import crypto from 'crypto';
import fs from 'fs/promises';
import zlib from 'zlib';
import { prisma } from '../../prisma';
import type { ChangeSet, FetchResult, NormalizedEntity, ParsedRow, SourceConnector, ValidationResult } from '../connector';
import { fetchOgdResource, ogdApiKey, OgdConfigError } from '../lib/ogd';
import { parseCsv } from '../lib/csv';
import { bulkUpsert } from '../lib/bulk';
import { isInIndia, nearest } from '../lib/geo';
import { num, picker, slug, titleCase } from '../lib/normalize';
import { normalizePollutant, parseIstTimestamp, POLLUTANTS } from '../lib/aqi';
import { RESOURCE_IDS, SOURCES } from '../sources';

/**
 * CPCB "Real time Air Quality Index from various locations" → AirStation + AirReading.
 * The feed has one row per station and pollutant for the latest hour. Accepts field names
 * from both the current (min_value/max_value/avg_value) and older (pollutant_min/...) layouts.
 */
const SOURCE = SOURCES['cpcb-realtime-aqi'];
const RETENTION_DAYS = 30;

export interface AirReadingRow {
  stationId: string;
  station: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  pollutant: string;
  minValue: number | null;
  maxValue: number | null;
  avgValue: number | null;
  observedAt: string | null; // ISO
}

export function readAqiRow(row: ParsedRow): AirReadingRow {
  const get = picker(row);
  const station = get('station');
  const city = get('city');
  const state = get('state').replace(/_/g, ' ');
  const lat = num(get('latitude'));
  const lng = num(get('longitude'));
  const ok = isInIndia(lat, lng);
  return {
    stationId: slug(`${state}|${city}|${station}`),
    station,
    city: titleCase(city.replace(/_/g, ' ')),
    state: titleCase(state),
    lat: ok ? lat : null,
    lng: ok ? lng : null,
    pollutant: normalizePollutant(get('pollutant_id', 'pollutant')),
    minValue: num(get('min_value', 'pollutant_min')),
    maxValue: num(get('max_value', 'pollutant_max')),
    avgValue: num(get('avg_value', 'pollutant_avg')),
    observedAt: parseIstTimestamp(get('last_update', 'lastupdate'))?.toISOString() ?? null,
  };
}

export function decodeAqi(buffer: Buffer, contentType: string): ParsedRow[] {
  const text = (contentType.includes('gzip') ? zlib.gunzipSync(buffer) : buffer).toString('utf8');
  if (contentType.includes('csv')) return parseCsv(text);
  const json = JSON.parse(text);
  return Array.isArray(json) ? json : json.records;
}

export function validateAqi(rows: ParsedRow[], now = new Date()): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  if (!rows.length) errors.push({ row: 0, field: '*', message: 'No rows in the download' });
  let above500 = 0;
  let newest = 0;
  rows.forEach((raw, i) => {
    const r = readAqiRow(raw);
    if (!r.station || !r.state) errors.push({ row: i + 1, field: 'station', message: 'Missing station or state' });
    if (!r.observedAt) errors.push({ row: i + 1, field: 'last_update', message: 'Unreadable last_update' });
    else newest = Math.max(newest, Date.parse(r.observedAt));
    if (!(POLLUTANTS as readonly string[]).includes(r.pollutant)) warnings.push({ row: i + 1, field: 'pollutant_id', message: `Unknown pollutant "${r.pollutant}"` });
    if ((r.avgValue ?? 0) > 500) above500++;
  });
  if (above500) warnings.push({ row: 0, field: 'avg_value', message: `${above500} values above 500; if the feed now publishes concentrations, AQI will not be computed` });
  if (newest && now.getTime() - newest > 6 * 3600_000) {
    warnings.push({ row: 0, field: 'last_update', message: `Newest reading is ${Math.round((now.getTime() - newest) / 3600_000)} hours old` });
  }
  return { isValid: errors.length === 0, errors, warnings };
}

export function createCpcbAqiConnector(opts: { file?: string; maxRecords?: number } = {}): SourceConnector {
  return {
    sourceId: SOURCE.sourceId,
    schedule: 'hourly',
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
      const res = await fetchOgdResource(RESOURCE_IDS.cpcbAqi, { pageSize: 1000, maxRecords: opts.maxRecords });
      const buffer = Buffer.from(JSON.stringify({ title: res.title, updated_date: res.updatedDate, total: res.total, records: res.records }));
      return { url: SOURCE.apiUrl!, contentType: 'application/json', size: buffer.length, hash: '', buffer, fetchedAt: new Date(), publishedAt: res.updatedDate };
    },

    async parse(buffer, contentType) {
      return decodeAqi(buffer, contentType);
    },

    async validate(buffer, contentType) {
      return validateAqi(decodeAqi(buffer, contentType));
    },

    async normalize(rows): Promise<NormalizedEntity[]> {
      return rows
        .map(readAqiRow)
        .filter((r) => r.station && r.observedAt && r.pollutant)
        .map((r) => ({ entityType: 'AirReading', entityId: `${r.stationId}:${r.pollutant}:${r.observedAt}`, sourceId: SOURCE.sourceId, data: r }));
    },

    async detectChanges(normalized): Promise<ChangeSet> {
      // Readings are append-only and keyed by station, pollutant and hour; the upsert absorbs repeats.
      return { newRecords: normalized, updatedRecords: [], deletedRecords: [], correctedRecords: [], schemaChanged: false };
    },

    async sync(changes) {
      // One row per station, pollutant and hour: Postgres rejects an upsert that hits a key twice.
      const readings = [...new Map(changes.newRecords.map((e) => [e.entityId, e.data as AirReadingRow])).values()];

      // Stations, with the nearest PIN worked out once per station (or when it moves).
      const stations = new Map<string, AirReadingRow>();
      for (const r of readings) if (!stations.has(r.stationId) || (r.lat !== null && stations.get(r.stationId)!.lat === null)) stations.set(r.stationId, r);
      const known = new Map((await prisma.airStation.findMany({ select: { id: true, lat: true, lng: true, nearestPin: true } })).map((s) => [s.id, s]));
      const needPin = [...stations.values()].filter((s) => {
        const k = known.get(s.stationId);
        return s.lat !== null && (!k?.nearestPin || k.lat !== s.lat || k.lng !== s.lng);
      });
      const pins = needPin.length
        ? (await prisma.pincode.findMany({ where: { lat: { not: null }, lng: { not: null } }, select: { code: true, lat: true, lng: true } })).map((p) => ({ code: p.code, lat: p.lat!, lng: p.lng! }))
        : [];
      const nearestPin = new Map(needPin.map((s) => [s.stationId, pins.length ? nearest({ lat: s.lat!, lng: s.lng! }, pins)[0]?.code ?? null : null]));

      await bulkUpsert(
        'AirStation',
        [...stations.values()].map((s) => ({
          id: s.stationId,
          name: s.station,
          city: s.city,
          state: s.state,
          lat: s.lat,
          lng: s.lng,
          nearestPin: nearestPin.get(s.stationId) ?? known.get(s.stationId)?.nearestPin ?? null,
        })),
        { conflict: ['id'], touchUpdatedAt: true }
      );

      const written = await bulkUpsert(
        'AirReading',
        readings.map((r) => ({
          id: crypto.randomUUID(),
          stationId: r.stationId,
          pollutant: r.pollutant,
          minValue: r.minValue,
          maxValue: r.maxValue,
          avgValue: r.avgValue,
          observedAt: new Date(r.observedAt!),
          sourceId: SOURCE.sourceId,
          fetchedAt: new Date(),
        })),
        { conflict: ['stationId', 'pollutant', 'observedAt'], keep: ['id'] }
      );

      const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400_000);
      const pruned = await prisma.airReading.deleteMany({ where: { observedAt: { lt: cutoff } } });
      return { inserted: written, updated: 0, deleted: pruned.count };
    },
  };
}
