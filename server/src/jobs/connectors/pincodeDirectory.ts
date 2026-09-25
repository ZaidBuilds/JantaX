import fs from 'fs/promises';
import zlib from 'zlib';
import { prisma } from '../../prisma';
import type { ChangeSet, FetchResult, NormalizedEntity, ParsedRow, SourceConnector, ValidationResult } from '../connector';
import { fetchOgdResource, ogdApiKey, OgdConfigError } from '../lib/ogd';
import { parseCsv } from '../lib/csv';
import { bulkUpsert } from '../lib/bulk';
import { isInIndia, medianPoint } from '../lib/geo';
import { mode, num, picker, slug, text, titleCase } from '../lib/normalize';
import { regionForState } from '../../routes/pinHelpers';
import { RESOURCE_IDS, SOURCES } from '../sources';

/**
 * India Post "All India Pincode Directory" → PostOffice rows, plus one Pincode row per PIN
 * with its district, state and the median coordinates of its offices.
 *
 * Reads the data.gov.in API (needs DATA_GOV_IN_API_KEY) or, with `file`, the dataset's CSV or
 * JSON download. Field names are matched loosely because the CSV and API spell them differently.
 */
const SOURCE = SOURCES['india-post-pincode-directory'];

export interface PostOfficeRow {
  id: string;
  pincode: string;
  officeName: string;
  officeType: string;
  delivery: boolean;
  division: string | null;
  region: string | null;
  circle: string | null;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
}

export function readDirectoryRow(row: ParsedRow): Omit<PostOfficeRow, 'id'> {
  const get = picker(row);
  const lat = num(get('latitude', 'lat'));
  const lng = num(get('longitude', 'long', 'lng'));
  const coordsOk = isInIndia(lat, lng);
  const deliveryRaw = get('delivery', 'deliverystatus');
  return {
    pincode: get('pincode', 'pin code', 'pin').replace(/\D/g, ''),
    officeName: get('officename', 'office name', 'office'),
    officeType: get('officetype', 'office type').toUpperCase().replace(/[^A-Z]/g, ''),
    delivery: /^(delivery|1|true|yes)$/i.test(deliveryRaw),
    division: get('divisionname', 'division') || null,
    region: get('regionname', 'region') || null,
    circle: get('circlename', 'circle') || null,
    district: titleCase(text(get('district', 'districtname', 'districtsname'))),
    state: titleCase(text(get('statename', 'state'))),
    lat: coordsOk ? lat : null,
    lng: coordsOk ? lng : null,
  };
}

export function decodeDirectory(buffer: Buffer, contentType: string): ParsedRow[] {
  const text = (contentType.includes('gzip') ? zlib.gunzipSync(buffer) : buffer).toString('utf8');
  if (contentType.includes('csv')) return parseCsv(text);
  const json = JSON.parse(text);
  return Array.isArray(json) ? json : json.records;
}

/**
 * Some offices are published with district and state "NA". Fill them from other offices that share
 * the PIN; offices whose PIN has no labelled office are dropped, since guessing would be worse.
 */
export function fillMissingLocations(rows: Omit<PostOfficeRow, 'id'>[]) {
  const known = new Map<string, { district: string; state: string }[]>();
  for (const r of rows) {
    if (!r.district || !r.state) continue;
    const list = known.get(r.pincode);
    if (list) list.push({ district: r.district, state: r.state });
    else known.set(r.pincode, [{ district: r.district, state: r.state }]);
  }
  let filled = 0;
  let dropped = 0;
  const out: Omit<PostOfficeRow, 'id'>[] = [];
  for (const r of rows) {
    if (r.district && r.state) {
      out.push(r);
      continue;
    }
    const peers = known.get(r.pincode);
    if (!peers) {
      dropped++;
      continue;
    }
    const state = mode(peers.map((p) => p.state));
    out.push({ ...r, state, district: mode(peers.filter((p) => p.state === state).map((p) => p.district)) });
    filled++;
  }
  return { rows: out, filled, dropped };
}

export function validateDirectory(rows: ParsedRow[]): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  if (!rows.length) errors.push({ row: 0, field: '*', message: 'No rows in the download' });
  let missingCoords = 0;
  const read = rows.map((raw, i) => {
    const r = readDirectoryRow(raw);
    if (!/^[1-9]\d{5}$/.test(r.pincode)) errors.push({ row: i + 1, field: 'pincode', message: `Invalid PIN "${r.pincode}"` });
    if (!r.officeName) errors.push({ row: i + 1, field: 'officename', message: 'Missing office name' });
    if (r.lat === null) missingCoords++;
    return r;
  });
  const { filled, dropped } = fillMissingLocations(read);
  if (filled) warnings.push({ row: 0, field: 'district', message: `${filled} offices had no district or state; filled from other offices with the same PIN` });
  if (dropped) warnings.push({ row: 0, field: 'district', message: `${dropped} offices have no district or state and no labelled office shares their PIN; skipped` });
  if (missingCoords) warnings.push({ row: 0, field: 'latitude', message: `${missingCoords} offices have no usable coordinates (blank, NA or outside India)` });
  if (rows.length && rows.length < 100_000) {
    warnings.push({ row: 0, field: '*', message: `Only ${rows.length} rows; the full directory has about 165,000. Offices will not be deleted.` });
  }
  return { isValid: errors.length === 0, errors, warnings };
}

/** Rows → PostOffice entities with stable ids; repeated office names in one PIN get a suffix. */
export function normalizeDirectory(rows: ParsedRow[]): NormalizedEntity[] {
  const seen = new Map<string, number>();
  const out: NormalizedEntity[] = [];
  const read = rows.map(readDirectoryRow).filter((r) => /^[1-9]\d{5}$/.test(r.pincode) && r.officeName);
  for (const r of fillMissingLocations(read).rows) {
    let id = `${r.pincode}:${slug(r.officeName)}`;
    const n = (seen.get(id) || 0) + 1;
    seen.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    out.push({ entityType: 'PostOffice', entityId: id, sourceId: SOURCE.sourceId, data: { id, ...r } });
  }
  return out;
}

/** One Pincode row per PIN: its most common district and state, and the median office location. */
export function summarisePins(offices: PostOfficeRow[]) {
  const byPin = new Map<string, PostOfficeRow[]>();
  for (const o of offices) {
    const list = byPin.get(o.pincode);
    if (list) list.push(o);
    else byPin.set(o.pincode, [o]);
  }
  return [...byPin.entries()].map(([code, list]) => {
    const state = mode(list.map((o) => o.state));
    const centre = medianPoint(list.filter((o) => o.lat !== null).map((o) => ({ lat: o.lat!, lng: o.lng! })));
    return {
      code,
      state,
      district: mode(list.filter((o) => o.state === state).map((o) => o.district)),
      region: regionForState(state),
      lat: centre?.lat ?? null,
      lng: centre?.lng ?? null,
    };
  });
}

export function createPincodeDirectoryConnector(opts: { file?: string; maxRecords?: number } = {}): SourceConnector {
  let fetchedTotal = 0;
  return {
    sourceId: SOURCE.sourceId,
    schedule: 'monthly',
    source: SOURCE,
    missingConfig() {
      if (opts.file) return null;
      try {
        ogdApiKey();
        return null;
      } catch (e) {
        return e instanceof OgdConfigError ? e.message : String(e);
      }
    },

    async fetch(): Promise<FetchResult> {
      if (opts.file) {
        const buffer = await fs.readFile(opts.file);
        const contentType = (opts.file.endsWith('.gz') ? 'application/gzip;' : '') + (/\.csv(\.gz)?$/i.test(opts.file) ? 'text/csv' : 'application/json');
        return { url: `file://${opts.file}`, contentType, size: buffer.length, hash: '', buffer, fetchedAt: new Date() };
      }
      const res = await fetchOgdResource(RESOURCE_IDS.pincodeDirectory, { pageSize: 1000, maxRecords: opts.maxRecords, pageDelayMs: 150 });
      fetchedTotal = res.total;
      const buffer = Buffer.from(JSON.stringify({ title: res.title, updated_date: res.updatedDate, total: res.total, records: res.records }));
      return {
        url: SOURCE.apiUrl!,
        contentType: 'application/json',
        size: buffer.length,
        hash: '',
        buffer,
        fetchedAt: new Date(),
        publishedAt: res.updatedDate,
      };
    },

    async parse(buffer, contentType) {
      return decodeDirectory(buffer, contentType);
    },

    async validate(buffer, contentType) {
      return validateDirectory(decodeDirectory(buffer, contentType));
    },

    async normalize(rows) {
      return normalizeDirectory(rows);
    },

    async detectChanges(normalized): Promise<ChangeSet> {
      const existing = new Set((await prisma.postOffice.findMany({ select: { id: true } })).map((o) => o.id));
      const incoming = new Set(normalized.map((e) => e.entityId));
      const stub = (id: string): NormalizedEntity => ({ entityType: 'PostOffice', entityId: id, data: {}, sourceId: SOURCE.sourceId });
      // Only delete when this looks like the whole directory, so a partial download never wipes offices.
      const complete = normalized.length >= 100_000 && (!fetchedTotal || normalized.length >= fetchedTotal * 0.98) && normalized.length >= existing.size * 0.9;
      return {
        newRecords: normalized.filter((e) => !existing.has(e.entityId)),
        updatedRecords: normalized.filter((e) => existing.has(e.entityId)).map((e) => ({ before: stub(e.entityId), after: e })),
        deletedRecords: complete ? [...existing].filter((id) => !incoming.has(id)).map(stub) : [],
        correctedRecords: [],
        schemaChanged: false,
      };
    },

    async sync(changes) {
      const offices = [...changes.newRecords, ...changes.updatedRecords.map((u) => u.after)].map((e) => e.data as PostOfficeRow);
      await bulkUpsert('Pincode', summarisePins(offices), { conflict: ['code'], touchUpdatedAt: true, casts: { region: '"Region"' } });
      await bulkUpsert(
        'PostOffice',
        offices.map(({ pincode, ...o }) => ({ ...o, pincodeCode: pincode, sourceId: SOURCE.sourceId })),
        { conflict: ['id'], touchUpdatedAt: true }
      );
      const gone = changes.deletedRecords.map((e) => e.entityId);
      for (let i = 0; i < gone.length; i += 5000) {
        await prisma.postOffice.deleteMany({ where: { id: { in: gone.slice(i, i + 5000) } } });
      }
      return { inserted: changes.newRecords.length, updated: changes.updatedRecords.length, deleted: gone.length };
    },
  };
}
