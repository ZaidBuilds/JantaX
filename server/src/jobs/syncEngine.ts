import { prisma } from '../prisma';
import type { SourceConnector, SyncObservability } from './connector';
import crypto from 'crypto';

// Retry helper with exponential backoff, max 3 retries
async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseMs = 1000): Promise<T> {
  let lastErr: any;
  for (let i=0;i<retries;i++) {
    try { return await fn(); } catch (e) { lastErr=e; if(i===retries-1) throw e; await new Promise(r=>setTimeout(r, baseMs * Math.pow(2,i))); }
  }
  throw lastErr;
}

export async function runSyncJob(connector: SourceConnector): Promise<SyncObservability> {
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
    lastSync: new Date(),
    status: 'success',
    log: [],
  };
  const log = (m:string)=> { obs.log.push(`${new Date().toISOString()} ${m}`); console.log(`[sync:${connector.sourceId}] ${m}`); };

  // 1. SOURCE (validate source exists)
  const source = await prisma.source.findUnique({ where: { sourceId: connector.sourceId } });
  if (!source) throw new Error(`Source ${connector.sourceId} not found`);
  await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { lastChecked: new Date() } });

  let fetchResult;
  try {
    // 2. FETCH (with retry)
    log('FETCH start');
    fetchResult = await withRetry(()=>connector.fetch(), 3);
    obs.recordsFetched = 1; // will be rowCount after parse
    // 3. RAW STORAGE
    const hash = crypto.createHash('sha256').update(fetchResult.buffer).digest('hex');
    const raw = await prisma.rawDocument.create({
      data: {
        sourceId: connector.sourceId,
        url: fetchResult.url,
        contentType: fetchResult.contentType,
        size: fetchResult.size,
        hash,
        status: 'fetched',
      }
    });
    log(`RAW stored ${raw.id} hash ${hash.slice(0,8)}`);

    // 4. CHANGE DETECTION (compare hash with last successful RawDocument)
    const lastRaw = await prisma.rawDocument.findFirst({ where: { sourceId: connector.sourceId, status: 'fetched' }, orderBy: { fetchedAt: 'desc' }, skip: 1 });
    if (lastRaw && lastRaw.hash === hash) {
      log('CHANGE DETECTION: no change (hash identical) — skipping parse');
      await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { lastSuccessfulSync: new Date(), status: 'active' } });
      obs.status = 'success';
      obs.durationMs = Date.now() - startedAt.getTime();
      return obs;
    }

    // 5. PARSE
    log('PARSE start');
    let rows;
    try {
      rows = await connector.parse(fetchResult.buffer, fetchResult.contentType);
      obs.recordsFetched = rows.length;
    } catch (e:any) {
      obs.parserFailures++; obs.status='failed'; log(`PARSE failed: ${e.message}`);
      await prisma.rawDocument.update({ where: { id: raw.id }, data: { status: 'failed', error: String(e.message).slice(0,2000) } });
      await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { status: 'degraded' } });
      throw e;
    }
    const parsed = await prisma.parsedDocument.create({
      data: { rawDocumentId: raw.id, rowCount: rows.length, parsedJson: rows.slice(0,5) as any },
    });

    // 6. VALIDATE
    log('VALIDATE start');
    const validation = await connector.validate(fetchResult.buffer, fetchResult.contentType);
    await prisma.validationResult.create({
      data: { parsedDocumentId: parsed.id, isValid: validation.isValid, errors: validation.errors as any, warnings: validation.warnings as any },
    });
    obs.validationFailures = validation.errors.length;
    if (!validation.isValid && validation.errors.length > rows.length*0.5) {
      log(`VALIDATION failed: ${validation.errors.length} errors >50% rows`);
      obs.status='failed'; obs.recordsRejected = rows.length;
      await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { status: 'failed' } });
      throw new Error('Validation failed');
    }

    // 7. NORMALIZE + 8. ENTITY RESOLUTION (via connector)
    log('NORMALIZE start');
    const normalized = await connector.normalize(rows);

    // 9. DETECT CHANGES (new/updated/deleted/corrected/schema)
    log('DETECT CHANGES start');
    const changes = await connector.detectChanges(normalized);
    obs.recordsRejected = validation.errors.length;
    log(`CHANGES: new ${changes.newRecords.length} updated ${changes.updatedRecords.length} deleted ${changes.deletedRecords.length} corrected ${changes.correctedRecords.length} schemaChanged=${changes.schemaChanged}`);

    if (changes.schemaChanged) {
      log('SCHEMA CHANGE detected — flagging source degraded, preserving data');
      await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { status: 'degraded', notes: 'Schema changed, manual review required' } });
    }

    // 10. VERSION + 11. DATABASE (idempotent upsert, preserve previous)
    log('DATABASE sync start (idempotent)');
    const result = await connector.sync(changes);
    obs.recordsInserted = result.inserted;
    obs.recordsUpdated = result.updated;
    obs.recordsDeleted = result.deleted;

    // 12. QUALITY CHECK + PUBLISH (update lastSuccessfulSync, status active)
    const total = result.inserted + result.updated;
    if (total===0 && rows.length>0 && !changes.schemaChanged) {
      log('QUALITY CHECK: no records inserted/updated but rows present — possible silent fail');
    }
    await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { lastSuccessfulSync: new Date(), status: 'active' } });
    obs.status = 'success';
    obs.durationMs = Date.now() - startedAt.getTime();
    log(`PUBLISH success — inserted ${result.inserted} updated ${result.updated} deleted ${result.deleted}`);
    return obs;

  } catch (e:any) {
    // Do NOT erase existing good data on failure
    obs.status = 'failed';
    obs.sourceAvailability = 'failed';
    obs.durationMs = Date.now() - startedAt.getTime();
    log(`FAILED: ${e.message} — preserving existing data, marking source stale`);
    try { await prisma.source.update({ where: { sourceId: connector.sourceId }, data: { status: 'degraded', lastChecked: new Date() } }); } catch {}
    return obs;
  }
}
