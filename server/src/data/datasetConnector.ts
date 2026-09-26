import crypto from 'crypto';
import fs from 'fs/promises';
import { prisma } from '../prisma';
import type { ChangeSet, FetchResult, NormalizedEntity, ParsedRow, SourceConnector, ValidationResult } from '../jobs/connector';
import type { SourceDefinition } from '../jobs/sources';
import { fetchOgdResource, ogdApiKey, OgdConfigError, redactKey } from '../jobs/lib/ogd';
import { bulkUpsert } from '../jobs/lib/bulk';
import { isInIndia } from '../jobs/lib/geo';
import { convert, matchColumns, type Value } from './fields';
import { decodeRows, formatOf, type Format } from './decode';
import { loadGeoResolver } from './districts';
import { runAfterSync } from './hooks';
import type { GeoResolver } from './geography';
import type { DatasetSpec } from './spec';

export interface DatasetOptions {
  /** A downloaded copy of the dataset (CSV, JSON or XLSX, optionally .gz). */
  file?: string;
  /** Stop after this many API records (dry runs). */
  maxRecords?: number;
}

export interface DatasetRow {
  id: string;
  datasetId: string;
  entityKey: string;
  state: string | null;
  districtId: string | null;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  period: string | null;
  observedAt: Date | null;
  data: Record<string, Value>;
}

const contentType = (format: Format, gzip: boolean) =>
  `${gzip ? 'application/gzip;' : ''}${format === 'csv' ? 'text/csv' : format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/json'}`;

export function sourceFor(spec: DatasetSpec): SourceDefinition {
  const a = spec.access;
  return {
    sourceId: spec.id,
    organization: spec.publisher,
    department: spec.department,
    governmentLevel: spec.governmentLevel,
    sourceName: spec.title,
    sourceUrl: spec.sourceUrl,
    apiUrl: a.kind === 'ogd' ? 'https://api.data.gov.in/resource/{resource id}' : a.kind === 'ckan' ? `${a.baseUrl}/api/3/action/datastore_search` : undefined,
    sourceType: a.kind === 'file' ? 'file' : 'api',
    license: spec.license,
    termsUrl: spec.licenseUrl,
    attributionRequirement: spec.attribution,
    reusePermission: spec.license.includes('GODL') ? 'Free reuse, including commercial, with attribution' : 'See licence',
    dataSensitivity: 'public',
    updateFrequency: spec.schedule,
    expectedRefreshInterval: { hourly: '1h', daily: '1d', weekly: '7d', monthly: '30d', quarterly: '90d', annual: '365d', event: 'event' }[spec.schedule],
    parserVersion: `${spec.id}@1`,
    owner: 'data',
    notes: spec.summary,
  };
}

/** What is still needed before the dataset can sync on its own, or null when it is ready. */
export function missingSetting(spec: DatasetSpec, opts: DatasetOptions = {}): string | null {
  if (opts.file) return null;
  const a = spec.access;
  if (a.kind === 'file') return `No machine-readable feed. Import a file: npm run data -- sync ${spec.id} --file <path> (template: ${a.template}). ${a.find}`;
  if (a.kind === 'ogd') {
    try {
      ogdApiKey();
    } catch (e) {
      return e instanceof OgdConfigError ? e.message : String(e);
    }
    if (!process.env[a.resourceEnv] && !a.resourceId) return `Set ${a.resourceEnv} to the data.gov.in resource id. ${a.find}`;
    return null;
  }
  if (a.kind === 'ckan') return process.env[a.resourceEnv] || a.resourceId ? null : `Set ${a.resourceEnv} to the CKAN resource id. ${a.find}`;
  return process.env[a.urlEnv] || a.url ? null : `Set ${a.urlEnv} to the download link. ${a.find}`;
}

async function fetchCkan(baseUrl: string, resourceId: string, maxRecords?: number) {
  const records: Record<string, unknown>[] = [];
  let total = Infinity;
  for (let offset = 0; offset < total; offset += 1000) {
    const u = `${baseUrl.replace(/\/$/, '')}/api/3/action/datastore_search?resource_id=${encodeURIComponent(resourceId)}&limit=1000&offset=${offset}`;
    const res = await fetch(u, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${u}`);
    const body = (await res.json()) as { success: boolean; result: { total: number; records: Record<string, unknown>[] } };
    if (!body.success) throw new Error(`CKAN error from ${u}`);
    total = body.result.total;
    records.push(...body.result.records);
    if (!body.result.records.length || (maxRecords && records.length >= maxRecords)) break;
  }
  return records;
}

/** Map one decoded row to typed fields. Returns the values and the fields that could not be read. */
export function mapRow(spec: DatasetSpec, columns: Record<string, string>, row: ParsedRow) {
  const values: Record<string, Value> = {};
  const unreadable: string[] = [];
  for (const [id, f] of Object.entries(spec.fields)) {
    const col = columns[id];
    const raw = col === undefined ? '' : String(row[col] ?? '');
    const v = convert(raw, f.type);
    if (v === undefined) {
      unreadable.push(id);
      values[id] = null;
    } else values[id] = v;
  }
  return { values, unreadable };
}

/** Typed values → a stored row with its place resolved to the spine. */
export function toDatasetRow(
  spec: DatasetSpec,
  values: Record<string, Value>,
  geo: GeoResolver,
  pinDistricts: Map<string, { districtId: string | null; state: string }>
): DatasetRow | null {
  if (spec.key.some((k) => values[k] === null || values[k] === '')) return null;
  const g = spec.geo ?? {};
  const pincode = g.pincode ? ((values[g.pincode] as string | null) ?? null) : null;

  let state: string | null = null;
  let districtId: string | null = null;
  const r = geo.resolve(g.state ? (values[g.state] as string) : null, g.district ? (values[g.district] as string) : null);
  if (r.level === 'district') [state, districtId] = [r.state, r.districtId];
  else if (r.level === 'state') state = r.state;
  if (pincode && !districtId) {
    const p = pinDistricts.get(pincode);
    if (p) [state, districtId] = [p.state, p.districtId];
  }

  // Key on the resolved place, so "MAHARASHTRA|Mumbai" and "Maharashtra|Mumbai " in the next release are the same row.
  const entityKey = spec.key
    .map((k) => {
      if (k === g.state && state) return state;
      if (k === g.district && districtId) return districtId;
      return String(values[k]).replace(/\s+/g, ' ').trim().toLowerCase();
    })
    .join('|');

  let lat = g.lat ? (values[g.lat] as number | null) : null;
  let lng = g.lng ? (values[g.lng] as number | null) : null;
  if (g.latlng && typeof values[g.latlng] === 'string') {
    const [a, b] = (values[g.latlng] as string).split(/[,\s]+/).map(Number);
    [lat, lng] = [a, b];
  }
  if (!isInIndia(lat, lng)) [lat, lng] = [null, null];

  const period = spec.period ? (values[spec.period] === null ? null : String(values[spec.period])) : null;
  // Only date fields give a point in time; "2011-12" in a text field is a financial year, not December 2011.
  const isDate = spec.period && spec.fields[spec.period].type === 'date';
  const observedAt = isDate && period ? new Date(period.length === 7 ? `${period}-01T00:00:00Z` : `${period}T00:00:00Z`) : null;
  return {
    id: `${spec.id}:${crypto.createHash('sha1').update(entityKey).digest('hex').slice(0, 20)}`,
    datasetId: spec.id,
    entityKey,
    state,
    districtId,
    pincode,
    lat,
    lng,
    period,
    observedAt,
    data: values,
  };
}

export function createDatasetConnector(spec: DatasetSpec, opts: DatasetOptions = {}): SourceConnector {
  const source = sourceFor(spec);
  let decoded: { key: string; rows: Record<string, unknown>[] } | null = null;
  const rowsOf = async (buffer: Buffer, ct: string) => {
    const key = crypto.createHash('sha1').update(buffer).digest('hex');
    if (decoded?.key !== key) decoded = { key, rows: await decodeRows(buffer, formatOf(ct), ct.includes('gzip')) };
    return decoded.rows;
  };
  const columnsOf = (rows: Record<string, unknown>[]) => [...new Set(rows.slice(0, 200).flatMap((r) => Object.keys(r)))];

  return {
    sourceId: spec.id,
    schedule: spec.schedule,
    source,
    missingConfig: () => missingSetting(spec, opts),

    async fetch(): Promise<FetchResult> {
      if (opts.file) {
        const buffer = await fs.readFile(opts.file);
        return { url: `file://${opts.file}`, contentType: contentType(formatOf(opts.file), opts.file.endsWith('.gz')), size: buffer.length, hash: '', buffer, fetchedAt: new Date() };
      }
      const a = spec.access;
      if (a.kind === 'ogd') {
        const id = process.env[a.resourceEnv] || a.resourceId!;
        const res = await fetchOgdResource(id, { filters: a.filters, maxRecords: opts.maxRecords, pageSize: 1000, pageDelayMs: 150 });
        const buffer = Buffer.from(JSON.stringify({ title: res.title, updated_date: res.updatedDate, total: res.total, records: res.records }));
        return { url: redactKey(res.urls[0] ?? `ogd:${id}`), contentType: contentType('json', false), size: buffer.length, hash: '', buffer, fetchedAt: new Date(), publishedAt: res.updatedDate };
      }
      if (a.kind === 'ckan') {
        const id = process.env[a.resourceEnv] || a.resourceId!;
        const buffer = Buffer.from(JSON.stringify({ records: await fetchCkan(a.baseUrl, id, opts.maxRecords) }));
        return { url: `${a.baseUrl}/dataset (resource ${id})`, contentType: contentType('json', false), size: buffer.length, hash: '', buffer, fetchedAt: new Date() };
      }
      if (a.kind === 'url') {
        const url = process.env[a.urlEnv] || a.url!;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        return { url, contentType: contentType(a.format, false), size: buffer.length, hash: '', buffer, fetchedAt: new Date() };
      }
      throw new Error(missingSetting(spec) ?? 'This dataset needs a file');
    },

    async parse(buffer, ct) {
      return rowsOf(buffer, ct);
    },

    async validate(buffer, ct): Promise<ValidationResult> {
      const rows = await rowsOf(buffer, ct);
      const errors: ValidationResult['errors'] = [];
      const warnings: ValidationResult['warnings'] = [];
      if (!rows.length) return { isValid: false, errors: [{ row: 0, field: '*', message: 'No rows in the download' }], warnings };

      const cols = columnsOf(rows);
      const { mapped, missing } = matchColumns(cols, spec.fields);
      const missingRequired = missing.filter((f) => spec.fields[f].required || spec.key.includes(f));
      if (missingRequired.length) {
        errors.push({ row: 0, field: missingRequired.join(','), message: `Columns not found for ${missingRequired.join(', ')}. The file has: ${cols.join(', ')}` });
      }
      if (missing.length > missingRequired.length) {
        warnings.push({ row: 0, field: '*', message: `Optional fields not in this file: ${missing.filter((f) => !missingRequired.includes(f)).join(', ')}` });
      }

      const geo = await loadGeoResolver();
      const pins = await pinDistrictMap(spec);
      const unreadable: Record<string, number> = {};
      let placed = 0;
      rows.forEach((row, i) => {
        const { values, unreadable: bad } = mapRow(spec, mapped, row as ParsedRow);
        bad.forEach((f) => (unreadable[f] = (unreadable[f] ?? 0) + 1));
        for (const f of Object.keys(spec.fields)) {
          if ((spec.fields[f].required || spec.key.includes(f)) && values[f] === null) errors.push({ row: i + 1, field: f, message: `Missing ${spec.fields[f].label}` });
        }
        const r = toDatasetRow(spec, values, geo, pins);
        if (r && (spec.level === 'national' || (spec.level === 'state' ? r.state : r.districtId || r.pincode))) placed++;
      });
      for (const [f, n] of Object.entries(unreadable)) warnings.push({ row: 0, field: f, message: `${n} values of ${spec.fields[f].label} could not be read as ${spec.fields[f].type}` });
      if (spec.level !== 'national' && placed < rows.length * 0.9) {
        warnings.push({ row: 0, field: 'geography', message: `Only ${placed} of ${rows.length} rows matched a ${spec.level === 'state' ? 'state' : 'district or PIN'}; unmatched rows are kept at state level or without a place` });
      }
      return { isValid: errors.length === 0, errors, warnings };
    },

    async normalize(rows): Promise<NormalizedEntity[]> {
      const { mapped } = matchColumns(columnsOf(rows), spec.fields);
      const geo = await loadGeoResolver();
      const pins = await pinDistrictMap(spec);
      const out = new Map<string, NormalizedEntity>();
      for (const row of rows) {
        const r = toDatasetRow(spec, mapRow(spec, mapped, row).values, geo, pins);
        if (r) out.set(r.id, { entityType: 'DatasetRecord', entityId: r.id, sourceId: spec.id, data: r as unknown as Record<string, unknown> });
      }
      return [...out.values()];
    },

    async detectChanges(normalized): Promise<ChangeSet> {
      const existing = new Set((await prisma.datasetRecord.findMany({ where: { datasetId: spec.id }, select: { id: true } })).map((r) => r.id));
      const incoming = new Set(normalized.map((e) => e.entityId));
      const stub = (id: string): NormalizedEntity => ({ entityType: 'DatasetRecord', entityId: id, data: {}, sourceId: spec.id });
      // A full snapshot replaces the previous one, unless it is suspiciously smaller (a partial download).
      const replace = spec.replace && !opts.maxRecords && normalized.length >= existing.size * 0.8;
      return {
        newRecords: normalized.filter((e) => !existing.has(e.entityId)),
        updatedRecords: normalized.filter((e) => existing.has(e.entityId)).map((e) => ({ before: stub(e.entityId), after: e })),
        deletedRecords: replace ? [...existing].filter((id) => !incoming.has(id)).map(stub) : [],
        correctedRecords: [],
        schemaChanged: false,
      };
    },

    async sync(changes) {
      const rows = [...changes.newRecords, ...changes.updatedRecords.map((u) => u.after)].map((e) => e.data as unknown as DatasetRow);
      await bulkUpsert(
        'DatasetRecord',
        rows.map((r) => ({ ...r, data: JSON.stringify(r.data) })),
        { conflict: ['id'], touchUpdatedAt: true, casts: { data: 'jsonb' }, chunkSize: 1000 }
      );
      const gone = changes.deletedRecords.map((e) => e.entityId);
      for (let i = 0; i < gone.length; i += 5000) await prisma.datasetRecord.deleteMany({ where: { id: { in: gone.slice(i, i + 5000) } } });
      await runAfterSync(spec, rows);
      return { inserted: changes.newRecords.length, updated: changes.updatedRecords.length, deleted: gone.length };
    },
  };
}

/** PIN → district, for datasets that publish PIN codes but not districts. */
export async function pinDistrictMap(spec: DatasetSpec) {
  const map = new Map<string, { districtId: string | null; state: string }>();
  if (!spec.geo?.pincode) return map;
  for (const p of await prisma.pincode.findMany({ where: { districtId: { not: null } }, select: { code: true, districtId: true, state: true } })) {
    map.set(p.code, { districtId: p.districtId, state: p.state });
  }
  return map;
}
