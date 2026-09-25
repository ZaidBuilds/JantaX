import { prisma } from '../prisma';
import { nextRunAt } from '../jobs/scheduler';
import { CATALOG } from './catalog';
import { missingSetting } from './datasetConnector';
import { accessSetting, type DatasetSpec } from './spec';

export type DatasetState = 'live' | 'stale' | 'failing' | 'needs-setting' | 'needs-file' | 'ready';

export interface DatasetStatus {
  id: string;
  module: string;
  title: string;
  summary: string;
  publisher: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string | null;
  attribution: string;
  access: DatasetSpec['access']['kind'];
  level: DatasetSpec['level'];
  schedule: DatasetSpec['schedule'];
  /** The environment setting that switches the dataset on, if it has one. */
  setting: string | null;
  /** What is still needed before it can sync on its own. Null when nothing is. */
  missing: string | null;
  state: DatasetState;
  rows: number;
  lastSync: string | null;
  /** When the publisher says it last updated the data. */
  publishedAt: string | null;
  lastError: string | null;
  nextRun: string | null;
}

const STALE_AFTER_DAYS = { hourly: 1, daily: 3, weekly: 14, monthly: 45, quarterly: 120, annual: 400, event: Infinity } as const;

/** Where every catalogued dataset stands: configured or not, synced or not, how many rows, and why it last failed. */
export async function datasetStatuses(specs: DatasetSpec[] = CATALOG, now = new Date()): Promise<DatasetStatus[]> {
  const ids = specs.map((s) => s.id);
  const [counts, sources, failures] = await Promise.all([
    prisma.datasetRecord.groupBy({ by: ['datasetId'], where: { datasetId: { in: ids } }, _count: { _all: true } }),
    prisma.source.findMany({ where: { sourceId: { in: ids } } }),
    prisma.rawDocument.findMany({
      where: { sourceId: { in: ids }, status: 'failed' },
      orderBy: { fetchedAt: 'desc' },
      distinct: ['sourceId'],
      select: { sourceId: true, fetchedAt: true, error: true },
    }),
  ]);
  const rowsOf = new Map(counts.map((c) => [c.datasetId, c._count._all]));
  const sourceOf = new Map(sources.map((s) => [s.sourceId, s]));
  const failureOf = new Map(failures.map((f) => [f.sourceId, f]));

  return specs.map((spec) => {
    const src = sourceOf.get(spec.id);
    const rows = rowsOf.get(spec.id) ?? 0;
    const missing = missingSetting(spec);
    const lastSync = src?.lastSuccessfulSync ?? null;
    const failure = failureOf.get(spec.id);
    const failedSince = failure && (!lastSync || failure.fetchedAt > lastSync) ? failure : null;
    const ageDays = lastSync ? (now.getTime() - lastSync.getTime()) / 86_400_000 : Infinity;

    let state: DatasetState;
    if (failedSince) state = 'failing';
    else if (rows > 0) state = ageDays > STALE_AFTER_DAYS[spec.schedule] ? 'stale' : 'live';
    else if (missing) state = spec.access.kind === 'file' ? 'needs-file' : 'needs-setting';
    else state = 'ready';

    return {
      id: spec.id,
      module: spec.module,
      title: spec.title,
      summary: spec.summary,
      publisher: spec.publisher,
      sourceUrl: spec.sourceUrl,
      license: spec.license,
      licenseUrl: spec.licenseUrl ?? null,
      attribution: spec.attribution,
      access: spec.access.kind,
      level: spec.level,
      schedule: spec.schedule,
      setting: accessSetting(spec),
      missing,
      state,
      rows,
      lastSync: lastSync?.toISOString() ?? null,
      publishedAt: src?.lastPublishedDate ?? null,
      lastError: failedSince?.error?.slice(0, 500) ?? null,
      nextRun: missing ? null : (nextRunAt(spec.schedule, now)?.toISOString() ?? null),
    };
  });
}

export interface FeedStatus {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  license: string;
  schedule: string;
  state: DatasetState;
  rows: number;
  lastSync: string | null;
  missing: string | null;
  lastError: string | null;
}

/** The hand-written connectors (PIN directory, CPCB air quality), in the same shape as datasets. */
export async function feedStatuses(now = new Date()): Promise<FeedStatus[]> {
  const { SOURCES } = await import('../jobs/sources');
  const { createConnector } = await import('../jobs/registry');
  const counts: Record<string, () => Promise<number>> = {
    'india-post-pincode-directory': () => prisma.postOffice.count(),
    'cpcb-realtime-aqi': () => prisma.airReading.count(),
  };
  return Promise.all(
    Object.entries(counts).map(async ([id, count]) => {
      const def = SOURCES[id];
      const connector = createConnector(id);
      const [rows, src, failure] = await Promise.all([
        count(),
        prisma.source.findUnique({ where: { sourceId: id } }),
        prisma.rawDocument.findFirst({ where: { sourceId: id, status: 'failed' }, orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true, error: true } }),
      ]);
      const lastSync = src?.lastSuccessfulSync ?? null;
      const failedSince = failure && (!lastSync || failure.fetchedAt > lastSync) ? failure : null;
      const missing = connector.missingConfig?.() ?? null;
      const ageDays = lastSync ? (now.getTime() - lastSync.getTime()) / 86_400_000 : Infinity;
      const state: DatasetState = failedSince ? 'failing' : rows > 0 ? (ageDays > STALE_AFTER_DAYS[connector.schedule] ? 'stale' : 'live') : missing ? 'needs-setting' : 'ready';
      return {
        id,
        title: def.sourceName,
        publisher: def.organization,
        sourceUrl: def.sourceUrl,
        license: def.license,
        schedule: connector.schedule,
        state,
        rows,
        lastSync: lastSync?.toISOString() ?? null,
        missing,
        lastError: failedSince?.error?.slice(0, 500) ?? null,
      };
    })
  );
}
