import { prisma } from '../prisma';
import type { SourceConnector, SyncObservability } from './connector';
import { checkDbHealth } from '../db/dal';
import crypto from 'crypto';

// Retry helper with exponential backoff, max 3 retries
async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseMs = 1000): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, baseMs * Math.pow(2, i)));
    }
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
  const log = (m: string) => {
    obs.log.push(`${new Date().toISOString()} ${m}`);
    console.log(`[sync:${connector.sourceId}] ${m}`);
  };

  try {
    const isOnline = await checkDbHealth();

    // 1. SOURCE (validate or register source exists)
    if (isOnline) {
      try {
        await prisma.source.upsert({
          where: { sourceId: connector.sourceId },
          update: { lastChecked: new Date() },
          create: {
            sourceId: connector.sourceId,
            sourceName: connector.sourceId,
            organization: 'Government of India',
            governmentLevel: 'National',
            sourceUrl: 'https://data.gov.in',
            sourceType: 'API',
            license: 'GODL-India',
            attributionRequirement: 'Attribution Required',
            reusePermission: 'Open Government Data License - India',
            dataSensitivity: 'Public',
            updateFrequency: connector.schedule,
            expectedRefreshInterval: '1d',
            lastChecked: new Date(),
            parserVersion: '1.0.0',
            status: 'active',
            owner: 'Ministry / Department',
          },
        });
      } catch (err) {
        log('SOURCE metadata update skipped (non-critical)');
      }
    } else {
      log('DATABASE offline — running sync in Resilient In-Memory DAL mode');
    }

    // 2. FETCH (with retry)
    log('FETCH start');
    const fetchResult = await withRetry(() => connector.fetch(), 3);
    obs.recordsFetched = 1;

    // 3. RAW STORAGE
    const hash = crypto.createHash('sha256').update(fetchResult.buffer).digest('hex');
    let rawId: string | undefined;

    if (isOnline) {
      try {
        const raw = await prisma.rawDocument.create({
          data: {
            sourceId: connector.sourceId,
            url: fetchResult.url,
            contentType: fetchResult.contentType,
            size: fetchResult.size,
            hash,
            status: 'fetched',
          },
        });
        rawId = raw.id;
        log(`RAW stored ${raw.id} hash ${hash.slice(0, 8)}`);

        // 4. CHANGE DETECTION (compare hash with last successful RawDocument)
        const lastRaw = await prisma.rawDocument.findFirst({
          where: { sourceId: connector.sourceId, status: 'fetched' },
          orderBy: { fetchedAt: 'desc' },
          skip: 1,
        });

        if (lastRaw && lastRaw.hash === hash) {
          log('CHANGE DETECTION: no change (hash identical) — skipping parse');
          await prisma.source.update({
            where: { sourceId: connector.sourceId },
            data: { lastSuccessfulSync: new Date(), status: 'active' },
          });
          obs.status = 'success';
          obs.durationMs = Date.now() - startedAt.getTime();
          return obs;
        }
      } catch (err) {
        log('RAW document persistence skipped (DB fallback mode)');
      }
    }

    // 5. PARSE
    log('PARSE start');
    let rows;
    try {
      rows = await connector.parse(fetchResult.buffer, fetchResult.contentType);
      obs.recordsFetched = rows.length;
    } catch (e: any) {
      obs.parserFailures++;
      obs.status = 'failed';
      log(`PARSE failed: ${e.message}`);
      if (isOnline && rawId) {
        try {
          await prisma.rawDocument.update({
            where: { id: rawId },
            data: { status: 'failed', error: String(e.message).slice(0, 2000) },
          });
          await prisma.source.update({
            where: { sourceId: connector.sourceId },
            data: { status: 'degraded' },
          });
        } catch {}
      }
      throw e;
    }

    let parsedId: string | undefined;
    if (isOnline && rawId) {
      try {
        const parsed = await prisma.parsedDocument.create({
          data: { rawDocumentId: rawId, rowCount: rows.length, parsedJson: rows.slice(0, 5) as any },
        });
        parsedId = parsed.id;
      } catch {}
    }

    // 6. VALIDATE
    log('VALIDATE start');
    const validation = await connector.validate(fetchResult.buffer, fetchResult.contentType);
    if (isOnline && parsedId) {
      try {
        await prisma.validationResult.create({
          data: {
            parsedDocumentId: parsedId,
            isValid: validation.isValid,
            errors: validation.errors as any,
            warnings: validation.warnings as any,
          },
        });
      } catch {}
    }

    obs.validationFailures = validation.errors.length;
    if (!validation.isValid && validation.errors.length > rows.length * 0.5) {
      log(`VALIDATION failed: ${validation.errors.length} errors >50% rows`);
      obs.status = 'failed';
      obs.recordsRejected = rows.length;
      if (isOnline) {
        try {
          await prisma.source.update({
            where: { sourceId: connector.sourceId },
            data: { status: 'failed' },
          });
        } catch {}
      }
      throw new Error('Validation failed');
    }

    // 7. NORMALIZE + 8. ENTITY RESOLUTION
    log('NORMALIZE start');
    const normalized = await connector.normalize(rows);

    // 9. DETECT CHANGES
    log('DETECT CHANGES start');
    const changes = await connector.detectChanges(normalized);
    obs.recordsRejected = validation.errors.length;
    log(
      `CHANGES: new ${changes.newRecords.length} updated ${changes.updatedRecords.length} deleted ${changes.deletedRecords.length} corrected ${changes.correctedRecords.length} schemaChanged=${changes.schemaChanged}`
    );

    if (changes.schemaChanged && isOnline) {
      log('SCHEMA CHANGE detected — flagging source degraded, preserving data');
      try {
        await prisma.source.update({
          where: { sourceId: connector.sourceId },
          data: { status: 'degraded', notes: 'Schema changed, manual review required' },
        });
      } catch {}
    }

    // 10. VERSION + 11. DATABASE (idempotent upsert)
    log('DATABASE sync start (idempotent)');
    const result = await connector.sync(changes);
    obs.recordsInserted = result.inserted;
    obs.recordsUpdated = result.updated;
    obs.recordsDeleted = result.deleted;

    // 12. QUALITY CHECK + PUBLISH
    const total = result.inserted + result.updated;
    if (total === 0 && rows.length > 0 && !changes.schemaChanged) {
      log('QUALITY CHECK: no records inserted/updated but rows present');
    }
    if (isOnline) {
      try {
        await prisma.source.update({
          where: { sourceId: connector.sourceId },
          data: { lastSuccessfulSync: new Date(), status: 'active' },
        });
      } catch {}
    }
    obs.status = 'success';
    obs.durationMs = Date.now() - startedAt.getTime();
    log(`PUBLISH success — inserted ${result.inserted} updated ${result.updated} deleted ${result.deleted}`);
    return obs;
  } catch (e: any) {
    obs.status = 'failed';
    obs.sourceAvailability = 'failed';
    obs.durationMs = Date.now() - startedAt.getTime();
    log(`FAILED: ${e.message} — preserving existing data`);
    try {
      await prisma.source.update({
        where: { sourceId: connector.sourceId },
        data: { status: 'degraded', lastChecked: new Date() },
      });
    } catch {}
    return obs;
  }
}
