import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../prisma';
import type { SourceConnector, SyncObservability } from './connector';
import { ensureSource } from './sources';
import { OgdConfigError } from './lib/ogd';

// Retry helper with exponential backoff, max 3 attempts
async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseMs = 1000): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (e instanceof OgdConfigError || i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
    }
  }
  throw lastErr;
}

/** Keep the exact bytes we parsed, so any published figure can be traced to a download. */
async function storeRaw(sourceId: string, hash: string, buffer: Buffer): Promise<string | null> {
  const dir = process.env.RAW_DATA_DIR;
  if (!dir) return null;
  const file = path.join(dir, sourceId, `${new Date().toISOString().slice(0, 10)}-${hash.slice(0, 16)}.gz`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, zlib.gzipSync(buffer));
  return file;
}

export interface SyncOptions {
  /** Re-parse and re-write even if the download is identical to the last successful sync. */
  force?: boolean;
}

/**
 * SOURCE → FETCH → RAW STORAGE → CHANGE DETECTION → PARSE → VALIDATE → NORMALIZE →
 * DETECT CHANGES → DATABASE → PUBLISH. A failure at any step leaves existing data untouched.
 */
export async function runSyncJob(connector: SourceConnector, options: SyncOptions = {}): Promise<SyncObservability> {
  const startedAt = new Date();
  const obs: SyncObservability = {
    sourceId: connector.sourceId,
    startedAt,
    recordsFetched: 0,
    recordsInserted: 0,
    recordsUpdated: 0,
    recordsDeleted: 0,
    recordsRejected: 0,
    validationFailures: 0,
    parserFailures: 0,
    sourceAvailability: 'ok',
    lastSync: startedAt,
    status: 'success',
    log: [],
  };
  const log = (m: string) => {
    obs.log.push(`${new Date().toISOString()} ${m}`);
    console.log(`[sync:${connector.sourceId}] ${m}`);
  };
  const setSource = (data: Record<string, unknown>) =>
    prisma.source.update({ where: { sourceId: connector.sourceId }, data }).catch(() => undefined);
  const finish = (status: SyncObservability['status']) => {
    obs.status = status;
    obs.durationMs = Date.now() - startedAt.getTime();
    return obs;
  };

  // 1. SOURCE
  if (connector.source) await ensureSource(connector.source);
  const source = await prisma.source.findUnique({ where: { sourceId: connector.sourceId } });
  if (!source) throw new Error(`Source ${connector.sourceId} not found`);
  await setSource({ lastChecked: new Date() });

  const missing = connector.missingConfig?.();
  if (missing) {
    log(`NOT CONFIGURED: ${missing}`);
    obs.sourceAvailability = 'failed';
    await setSource({ status: 'not_configured', notes: missing });
    return finish('failed');
  }

  let rawId: string | null = null;
  try {
    // 2. FETCH
    log('FETCH start');
    const fetched = await withRetry(() => connector.fetch(), 3);
    const hash = crypto.createHash('sha256').update(fetched.buffer).digest('hex');

    // 3. RAW STORAGE
    const storagePath = await storeRaw(connector.sourceId, hash, fetched.buffer);
    const raw = await prisma.rawDocument.create({
      data: {
        sourceId: connector.sourceId,
        url: fetched.url,
        contentType: fetched.contentType,
        size: fetched.size,
        hash,
        storagePath,
        status: 'fetched',
      },
    });
    rawId = raw.id;
    log(`RAW stored ${raw.id} hash ${hash.slice(0, 8)} (${fetched.size} bytes)`);
    if (fetched.publishedAt) await setSource({ lastPublishedDate: fetched.publishedAt });

    // 4. CHANGE DETECTION: compare with the last download that synced successfully
    const lastSynced = await prisma.rawDocument.findFirst({
      where: { sourceId: connector.sourceId, status: 'synced', NOT: { id: raw.id } },
      orderBy: { fetchedAt: 'desc' },
    });
    if (!options.force && lastSynced?.hash === hash) {
      log('CHANGE DETECTION: identical to the last successful sync, nothing to do');
      await prisma.rawDocument.update({ where: { id: raw.id }, data: { status: 'unchanged' } });
      await setSource({ lastSuccessfulSync: new Date(), status: 'active' });
      return finish('success');
    }

    // 5. PARSE
    log('PARSE start');
    let rows;
    try {
      rows = await connector.parse(fetched.buffer, fetched.contentType);
      obs.recordsFetched = rows.length;
    } catch (e) {
      obs.parserFailures++;
      throw e;
    }
    const parsed = await prisma.parsedDocument.create({
      data: { rawDocumentId: raw.id, rowCount: rows.length, parsedJson: rows.slice(0, 5) as object[] },
    });

    // 6. VALIDATE
    log(`VALIDATE ${rows.length} rows`);
    const validation = await connector.validate(fetched.buffer, fetched.contentType);
    await prisma.validationResult.create({
      data: {
        parsedDocumentId: parsed.id,
        isValid: validation.isValid,
        errors: validation.errors.slice(0, 500) as object[],
        warnings: validation.warnings.slice(0, 500) as object[],
      },
    });
    obs.validationFailures = validation.errors.length;
    obs.recordsRejected = validation.errors.length;
    if (!validation.isValid && validation.errors.length > rows.length * 0.5) {
      throw new Error(`Validation failed: ${validation.errors.length} errors across ${rows.length} rows`);
    }
    if (validation.warnings.length) log(`VALIDATE ${validation.warnings.length} warnings, first: ${validation.warnings[0].message}`);

    // 7. NORMALIZE
    const normalized = await connector.normalize(rows);
    log(`NORMALIZE ${normalized.length} entities`);

    // 8. DETECT CHANGES
    const changes = await connector.detectChanges(normalized);
    log(`CHANGES new ${changes.newRecords.length} updated ${changes.updatedRecords.length} deleted ${changes.deletedRecords.length}`);
    if (changes.schemaChanged) {
      log('SCHEMA CHANGE detected, keeping data and flagging the source for review');
      await setSource({ status: 'degraded', notes: 'Schema changed, manual review required' });
    }

    // 9. DATABASE (idempotent upserts)
    const result = await connector.sync(changes);
    obs.recordsInserted = result.inserted;
    obs.recordsUpdated = result.updated;
    obs.recordsDeleted = result.deleted;

    // 10. PUBLISH
    await prisma.rawDocument.update({ where: { id: raw.id }, data: { status: 'synced' } });
    if (!changes.schemaChanged) await setSource({ lastSuccessfulSync: new Date(), status: 'active' });
    log(`PUBLISH inserted ${result.inserted} updated ${result.updated} deleted ${result.deleted}`);
    return finish(changes.schemaChanged ? 'partial' : 'success');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    obs.sourceAvailability = 'failed';
    log(`FAILED: ${msg}. Existing data is unchanged.`);
    if (rawId) await prisma.rawDocument.update({ where: { id: rawId }, data: { status: 'failed', error: msg.slice(0, 2000) } }).catch(() => undefined);
    await setSource(e instanceof OgdConfigError ? { status: 'not_configured', notes: msg } : { status: 'degraded' });
    return finish('failed');
  }
}
