import express, { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';
import { CATALOG, SPECS } from '../data/catalog';
import { datasetStatuses, feedStatuses, type DatasetStatus } from '../data/status';
import { canonicalState } from '../data/geography';
import { createDatasetConnector, pinDistrictMap } from '../data/datasetConnector';
import { decodeRows, formatOf } from '../data/decode';
import { inspectRows } from '../data/inspect';
import { loadGeoResolver } from '../data/districts';
import { runSyncJob } from '../jobs/syncEngine';
import { distanceKm } from '../jobs/lib/geo';
import type { DatasetSpec } from '../data/spec';

/**
 * Official datasets, served with their provenance.
 *
 *   GET  /api/data/catalog[?module=]                       every dataset: state, rows, last sync, what is missing
 *   GET  /api/data/:id?pin=|district=|state=[&limit&offset] rows for a place, at the closest level the data has
 *   GET  /api/area/:pin[?module=]                          everything known for a PIN, grouped by dataset
 *   POST /api/admin/data/:id/import[?format=&dryRun=1]     ADMIN: upload a CSV, XLSX or JSON file for a dataset
 */
const router = Router();

const cache = (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 12}`);
  next();
};

/** Status is read from the database; share one read across a burst of requests. */
let statusCache: { at: number; list: DatasetStatus[] } | null = null;
async function statuses(): Promise<DatasetStatus[]> {
  if (!statusCache || Date.now() - statusCache.at > 30_000) statusCache = { at: Date.now(), list: await datasetStatuses() };
  return statusCache.list;
}
export const clearStatusCache = () => (statusCache = null);

function columnsOf(spec: DatasetSpec) {
  return spec.show.columns.map((id) => ({ id, label: spec.fields[id].label, type: spec.fields[id].type, unit: spec.fields[id].unit ?? null }));
}

function describe(spec: DatasetSpec, status?: DatasetStatus) {
  return {
    id: spec.id,
    module: spec.module,
    title: spec.title,
    summary: spec.summary,
    level: spec.level,
    columns: columnsOf(spec),
    source: {
      publisher: spec.publisher,
      department: spec.department ?? null,
      url: spec.sourceUrl,
      license: spec.license,
      licenseUrl: spec.licenseUrl ?? null,
      attribution: spec.attribution,
      lastSync: status?.lastSync ?? null,
      publishedAt: status?.publishedAt ?? null,
    },
    status: status?.state ?? 'needs-setting',
  };
}

export type Scope =
  | { level: 'pincode'; pin: string; districtId: string | null; district: string | null; state: string; lat: number | null; lng: number | null }
  | { level: 'district'; districtId: string; district: string; state: string }
  | { level: 'state'; state: string }
  | { level: 'national' };

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function scopeFrom(q: Record<string, unknown>): Promise<Scope> {
  const pin = String(q.pin ?? '').replace(/\D/g, '');
  if (pin) {
    if (!/^[1-9]\d{5}$/.test(pin)) throw new HttpError(400, 'A six-digit PIN code is required');
    const p = await prisma.pincode.findUnique({ where: { code: pin }, select: { districtId: true, district: true, state: true, lat: true, lng: true } });
    if (!p) throw new HttpError(404, 'PIN code not found in the India Post directory');
    return { level: 'pincode', pin, districtId: p.districtId, district: p.district, state: p.state, lat: p.lat, lng: p.lng };
  }
  if (q.district) {
    const d = await prisma.district.findUnique({ where: { id: String(q.district) }, select: { id: true, name: true, state: true } });
    if (!d) throw new HttpError(404, 'Unknown district id');
    return { level: 'district', districtId: d.id, district: d.name, state: d.state };
  }
  if (q.state) {
    const state = canonicalState(String(q.state));
    if (!state) throw new HttpError(400, 'Unknown state or union territory');
    return { level: 'state', state };
  }
  return { level: 'national' };
}

type Row = { data: Prisma.JsonValue; state: string | null; districtId: string | null; pincode: string | null; lat: number | null; lng: number | null; period: string | null };
const MAX_SCAN = 5000;

/**
 * Rows of one dataset for a place, at the closest level the data offers:
 * a PIN's own rows, then its district's, then its state's, then national figures.
 */
export async function rowsFor(spec: DatasetSpec, scope: Scope): Promise<{ level: Scope['level'] | 'none'; rows: Row[]; total: number }> {
  const select = { data: true, state: true, districtId: true, pincode: true, lat: true, lng: true, period: true } as const;
  const find = async (where: Prisma.DatasetRecordWhereInput) => {
    const [rows, total] = await Promise.all([prisma.datasetRecord.findMany({ where: { datasetId: spec.id, ...where }, select, take: MAX_SCAN }), prisma.datasetRecord.count({ where: { datasetId: spec.id, ...where } })]);
    return { rows, total };
  };

  const tries: [Scope['level'], Prisma.DatasetRecordWhereInput | null][] = [];
  if (spec.level === 'national') tries.push(['national', {}]);
  else {
    if (scope.level === 'pincode' && (spec.level === 'pincode' || spec.level === 'point')) tries.push(['pincode', { pincode: scope.pin }]);
    if ((scope.level === 'pincode' || scope.level === 'district') && scope.districtId && spec.level !== 'state') tries.push(['district', { districtId: scope.districtId }]);
    if (scope.level !== 'national') tries.push(['state', { state: scope.state }]);
    else tries.push(['national', {}]);
  }

  for (const [level, where] of tries) {
    if (!where) continue;
    const r = await find(where);
    if (!r.rows.length) continue;
    // Point data (hospitals) near a PIN: nearest first.
    if (scope.level === 'pincode' && scope.lat !== null && scope.lng !== null && r.rows.some((x) => x.lat !== null)) {
      const from = { lat: scope.lat, lng: scope.lng };
      const km = (x: Row) => (x.lat === null || x.lng === null ? Infinity : distanceKm(from, { lat: x.lat, lng: x.lng }));
      r.rows.sort((a, b) => km(a) - km(b));
    } else sortRows(spec, r.rows);
    return { level, ...r };
  }
  return { level: 'none', rows: [], total: 0 };
}

function sortRows(spec: DatasetSpec, rows: Row[]) {
  const s = spec.show.sort;
  if (!s) return;
  const get = (r: Row) => (r.data as Record<string, unknown> | null)?.[s.field] ?? null;
  rows.sort((a, b) => {
    const x = get(a);
    const y = get(b);
    if (x === y) return 0;
    if (x === null) return 1; // blanks last either way
    if (y === null) return -1;
    const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en', { numeric: true });
    return s.dir === 'asc' ? c : -c;
  });
}

function present(row: Row, scope: Scope) {
  const km = scope.level === 'pincode' && scope.lat !== null && scope.lng !== null && row.lat !== null && row.lng !== null ? Math.round(distanceKm({ lat: scope.lat, lng: scope.lng }, { lat: row.lat, lng: row.lng }) * 10) / 10 : undefined;
  return { ...(row.data as Record<string, unknown>), _place: { state: row.state, districtId: row.districtId, pincode: row.pincode, km } };
}

const wrap = (fn: (req: Request, res: Response) => Promise<unknown>) => async (req: Request, res: Response) => {
  try {
    await fn(req, res);
  } catch (e) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    console.error('[api:data]', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get(
  '/data/catalog',
  cache(60),
  wrap(async (req, res) => {
    const module = req.query.module ? String(req.query.module) : null;
    const list = (await statuses()).filter((d) => !module || d.module === module);
    const counts = list.reduce<Record<string, number>>((a, d) => ((a[d.state] = (a[d.state] ?? 0) + 1), a), {});
    res.json({
      datasets: list.map((d) => ({ ...d, columns: columnsOf(SPECS.get(d.id)!) })),
      feeds: module ? [] : await feedStatuses(),
      summary: { total: list.length, ...counts },
      generatedAt: new Date().toISOString(),
    });
  })
);

router.get(
  '/data/:id',
  cache(300),
  wrap(async (req, res) => {
    const spec = SPECS.get(String(req.params.id));
    if (!spec) throw new HttpError(404, 'Unknown dataset');
    const scope = await scopeFrom(req.query);
    const limit = Math.min(Math.max(Number(req.query.limit) || spec.show.limit || 50, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const found = await rowsFor(spec, scope);
    const status = (await statuses()).find((d) => d.id === spec.id);
    res.json({
      dataset: describe(spec, status),
      scope,
      matched: found.level,
      total: found.total,
      rows: found.rows.slice(offset, offset + limit).map((r) => present(r, scope)),
    });
  })
);

router.get(
  '/area/:pin',
  cache(300),
  wrap(async (req, res) => {
    const scope = await scopeFrom({ pin: req.params.pin });
    if (scope.level !== 'pincode') throw new HttpError(400, 'A six-digit PIN code is required');
    const module = req.query.module ? String(req.query.module) : null;
    const specs = CATALOG.filter((s) => (module ? s.module === module : s.module !== 'geography'));
    const all = await statuses();
    const district = scope.districtId
      ? await prisma.district.findUnique({ where: { id: scope.districtId }, select: { id: true, name: true, state: true, lgdCode: true, pinCount: true } })
      : null;
    const census = scope.districtId ? await prisma.datasetRecord.findFirst({ where: { datasetId: 'census-2011-districts', districtId: scope.districtId }, select: { data: true } }) : null;

    const datasets = await Promise.all(
      specs.map(async (spec) => {
        const status = all.find((d) => d.id === spec.id);
        const found = status && status.rows > 0 ? await rowsFor(spec, scope) : { level: 'none' as const, rows: [], total: 0 };
        return {
          ...describe(spec, status),
          matched: found.level,
          total: found.total,
          rows: found.rows.slice(0, spec.show.limit ?? 10).map((r) => present(r, scope)),
          missing: status?.missing ?? null,
        };
      })
    );
    res.json({
      pin: scope.pin,
      place: { district: district?.name ?? scope.district, districtId: scope.districtId, state: scope.state, lgdCode: district?.lgdCode ?? null, population2011: (census?.data as { population?: number } | null)?.population ?? null },
      datasets,
    });
  })
);

// Upload a file for a dataset from the browser (hand-compiled registers, portal exports).
router.post(
  '/admin/data/:id/import',
  requireRole('ADMIN'),
  express.raw({ type: () => true, limit: '60mb' }),
  wrap(async (req, res) => {
    const spec = SPECS.get(String(req.params.id));
    if (!spec) throw new HttpError(404, 'Unknown dataset');
    // application/json bodies arrive already parsed by the app-wide JSON parser.
    const parsed = !Buffer.isBuffer(req.body) && req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0;
    const body: Buffer = parsed ? Buffer.from(JSON.stringify(req.body)) : req.body;
    if (!Buffer.isBuffer(body) || !body.length) throw new HttpError(400, 'Send the file as the request body');
    const format = parsed ? 'json' : formatOf(String(req.query.format || req.headers['content-type'] || 'csv'));
    const gzip = body[0] === 0x1f && body[1] === 0x8b;

    if (req.query.dryRun) {
      const rows = await decodeRows(body, format, gzip);
      return res.json(inspectRows(spec, rows, await loadGeoResolver(), await pinDistrictMap(spec)));
    }
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'jantax-import-'));
    const file = path.join(dir, `${spec.id}.${format}${gzip ? '.gz' : ''}`);
    try {
      await fs.writeFile(file, body);
      const obs = await runSyncJob(createDatasetConnector(spec, { file }), { force: true });
      clearStatusCache();
      res.status(obs.status === 'failed' ? 422 : 200).json({ observability: obs });
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  })
);

export default router;
