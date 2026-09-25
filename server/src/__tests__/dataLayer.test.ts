// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { parseCsv } from '../jobs/lib/csv';
import { distanceKm, isInIndia, medianPoint } from '../jobs/lib/geo';
import { mode, num, text, titleCase } from '../jobs/lib/normalize';
import { aqiCategory, normalizePollutant, parseIstTimestamp, stationAqi } from '../jobs/lib/aqi';
import { fetchOgdResource, OgdConfigError, ogdUrl, redactKey } from '../jobs/lib/ogd';
import { fillMissingLocations, normalizeDirectory, readDirectoryRow, summarisePins, validateDirectory } from '../jobs/connectors/pincodeDirectory';
import { readAqiRow, validateAqi } from '../jobs/connectors/cpcbAqi';
import { nextRunAt } from '../jobs/scheduler';

const office = (o: Record<string, string>) => ({
  circlename: 'Delhi Circle',
  regionname: 'Delhi Region',
  divisionname: 'New Delhi Central Division',
  officename: 'Connaught Place SO',
  pincode: '110001',
  officetype: 'PO',
  delivery: 'Non Delivery',
  district: 'NEW DELHI',
  statename: 'DELHI',
  latitude: '28.6315',
  longitude: '77.2167',
  ...o,
});

describe('CSV parser', () => {
  it('handles quotes, embedded commas and newlines, CRLF and a BOM', () => {
    const rows = parseCsv('﻿name,note\r\n"Office, Main","said ""hi""\nthen left"\r\nB.O,\r\n\r\n');
    expect(rows).toEqual([
      { name: 'Office, Main', note: 'said "hi"\nthen left' },
      { name: 'B.O', note: '' },
    ]);
  });
});

describe('normalisation helpers', () => {
  it('treats the dataset placeholders as missing', () => {
    expect(num('NA')).toBeNull();
    expect(num('1,234.5')).toBe(1234.5);
    expect(text(' NA ')).toBe('');
    expect(text('Delhi')).toBe('Delhi');
  });
  it('title-cases names and keeps initials', () => {
    expect(titleCase('KUMURAM BHEEM ASIFABAD')).toBe('Kumuram Bheem Asifabad');
    expect(titleCase('JAMMU AND KASHMIR')).toBe('Jammu and Kashmir');
    expect(titleCase('Y.S.R. KADAPA')).toBe('Y.S.R. Kadapa');
  });
  it('picks the most common value', () => {
    expect(mode(['a', 'b', 'b'])).toBe('b');
  });
});

describe('geo', () => {
  it('measures distance and rejects coordinates outside India', () => {
    const delhiToMumbai = distanceKm({ lat: 28.61, lng: 77.21 }, { lat: 18.94, lng: 72.84 });
    expect(delhiToMumbai).toBeGreaterThan(1100);
    expect(delhiToMumbai).toBeLessThan(1200);
    expect(isInIndia(0, 0)).toBe(false);
    expect(isInIndia(77.2, 28.6)).toBe(false); // swapped
  });
  it('takes the median so one bad office cannot move a PIN', () => {
    expect(medianPoint([{ lat: 28.6, lng: 77.2 }, { lat: 28.7, lng: 77.3 }, { lat: 28.65, lng: 77.25 }, { lat: 0, lng: 0 }])).toEqual({ lat: 28.65, lng: 77.25 });
  });
});

describe('India Post directory connector', () => {
  it('reads either field spelling and cleans values', () => {
    const r = readDirectoryRow({ 'Office Name': 'Rechini S.O', Pincode: '504273', 'Office Type': 'S.O', Delivery: 'Delivery', District: 'KUMURAM BHEEM ASIFABAD', StateName: 'TELANGANA', Latitude: 'NA', Longitude: '' });
    expect(r).toMatchObject({ officeName: 'Rechini S.O', pincode: '504273', officeType: 'SO', delivery: true, district: 'Kumuram Bheem Asifabad', state: 'Telangana', lat: null, lng: null });
  });

  it('fills "NA" locations from offices sharing the PIN and drops the rest', () => {
    const rows = [office({}), office({ officename: 'Janpath SO', district: 'NA', statename: 'NA' }), office({ pincode: '494111', officename: 'Gumodhi B.O', district: 'NA', statename: 'NA' })].map(readDirectoryRow);
    const { rows: out, filled, dropped } = fillMissingLocations(rows);
    expect(filled).toBe(1);
    expect(dropped).toBe(1);
    expect(out.find((o) => o.officeName === 'Janpath SO')).toMatchObject({ district: 'New Delhi', state: 'Delhi' });
  });

  it('gives repeated office names in one PIN distinct ids', () => {
    const ids = normalizeDirectory([office({}), office({}), office({ officename: 'Janpath SO' })]).map((e) => e.entityId);
    expect(ids).toEqual(['110001:connaught-place-so', '110001:connaught-place-so-2', '110001:janpath-so']);
  });

  it('summarises a PIN by its most common district and median location', () => {
    const offices = normalizeDirectory([office({}), office({ officename: 'A', latitude: '28.60', longitude: '77.20' }), office({ officename: 'B', latitude: '28.64', longitude: '77.24' })]).map((e) => e.data as never);
    const [pin] = summarisePins(offices);
    expect(pin).toMatchObject({ code: '110001', district: 'New Delhi', state: 'Delhi', region: 'NORTH' });
    expect(pin.lat).toBeCloseTo(28.6315, 3);
  });

  it('rejects bad PINs and warns when a download looks partial', () => {
    const v = validateDirectory([office({ pincode: '012345' }), office({})]);
    expect(v.errors).toHaveLength(1);
    expect(v.warnings.some((w) => /Offices will not be deleted/.test(w.message))).toBe(true);
  });
});

describe('CPCB air quality', () => {
  it('reads both the current and the older field layouts', () => {
    const now = readAqiRow({ state: 'Delhi', city: 'Delhi', station: 'ITO, Delhi - CPCB', last_update: '25-09-2026 10:00:00', latitude: '28.63', longitude: '77.24', pollutant_id: 'PM2.5', min_value: '88', max_value: '212', avg_value: '151' });
    const old = readAqiRow({ state: 'Delhi', city: 'Delhi', station: 'ITO, Delhi - CPCB', last_update: '25-09-2026 10:00:00', pollutant_id: 'OZONE', pollutant_min: 'NA', pollutant_max: '48', pollutant_avg: '22' });
    expect(now).toMatchObject({ stationId: 'delhi-delhi-ito-delhi-cpcb', pollutant: 'PM2.5', avgValue: 151, observedAt: '2026-09-25T04:30:00.000Z' });
    expect(old).toMatchObject({ pollutant: 'OZONE', minValue: null, avgValue: 22 });
  });

  it('reports AQI only under the CPCB rule', () => {
    expect(stationAqi([{ pollutant: 'PM10', avgValue: 168 }, { pollutant: 'NO2', avgValue: 41 }, { pollutant: 'CO', avgValue: 33 }])).toMatchObject({ aqi: 168, category: 'Moderate', dominant: 'PM10' });
    expect(stationAqi([{ pollutant: 'NO2', avgValue: 41 }, { pollutant: 'CO', avgValue: 33 }, { pollutant: 'SO2', avgValue: 8 }]).aqi).toBeNull();
    expect(stationAqi([{ pollutant: 'PM10', avgValue: 44 }, { pollutant: 'NO2', avgValue: 17 }]).aqi).toBeNull();
    expect(stationAqi([{ pollutant: 'PM10', avgValue: 900 }, { pollutant: 'NO2', avgValue: 17 }, { pollutant: 'CO', avgValue: 2 }]).reason).toMatch(/0 to 500/);
  });

  it('maps index values to CPCB categories', () => {
    expect([50, 51, 101, 201, 301, 401].map(aqiCategory)).toEqual(['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very poor', 'Severe']);
    expect(normalizePollutant('O3')).toBe('OZONE');
  });

  it('reads CPCB timestamps as IST', () => {
    expect(parseIstTimestamp('01-01-2026 00:30:00')?.toISOString()).toBe('2025-12-31T19:00:00.000Z');
    expect(parseIstTimestamp('2026-01-01 05:30:00')?.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect(parseIstTimestamp('yesterday')).toBeNull();
  });

  it('flags stale feeds and values outside the index range', () => {
    const rows = [{ state: 'Delhi', city: 'Delhi', station: 'X', last_update: '25-09-2026 10:00:00', pollutant_id: 'PM10', avg_value: '640' }];
    const v = validateAqi(rows, new Date('2026-09-26T00:00:00Z'));
    expect(v.isValid).toBe(true);
    expect(v.warnings.map((w) => w.field)).toEqual(expect.arrayContaining(['avg_value', 'last_update']));
  });
});

describe('scheduler', () => {
  // 2026-09-25 10:00 IST
  const now = new Date('2026-09-25T04:30:00Z');
  it('plans runs in IST', () => {
    expect(nextRunAt('hourly', now)?.toISOString()).toBe('2026-09-25T04:40:00.000Z'); // 10:10 IST
    expect(nextRunAt('daily', now)?.toISOString()).toBe('2026-09-25T20:30:00.000Z'); // 26 Sep 02:00 IST
    expect(nextRunAt('weekly', now)?.toISOString()).toBe('2026-09-27T20:30:00.000Z'); // Mon 28 Sep 02:00 IST
    expect(nextRunAt('monthly', now)?.toISOString()).toBe('2026-09-30T20:30:00.000Z'); // 1 Oct 02:00 IST
    expect(nextRunAt('quarterly', now)?.toISOString()).toBe('2026-09-30T20:30:00.000Z'); // 1 Oct 02:00 IST
    expect(nextRunAt('annual', now)?.toISOString()).toBe('2026-12-31T20:30:00.000Z'); // 1 Jan 02:00 IST
    expect(nextRunAt('event', now)).toBeNull();
  });
});

describe('data.gov.in client', () => {
  it('builds URLs with filters and never logs the key', () => {
    const url = ogdUrl('abc', { apiKey: 'SECRET', offset: 0, limit: 10, filters: { state: 'Delhi' }, baseUrl: 'https://api.data.gov.in' });
    expect(url).toContain('filters%5Bstate%5D=Delhi');
    expect(redactKey(url)).not.toContain('SECRET');
  });

  it('pages through a resource', async () => {
    const all = Array.from({ length: 5 }, (_, i) => ({ i }));
    const fake = (async (u: string) => {
      const q = new URL(u).searchParams;
      const offset = Number(q.get('offset'));
      const limit = Number(q.get('limit'));
      return new Response(JSON.stringify({ total: 5, count: 0, limit, offset, records: all.slice(offset, offset + limit), updated_date: '2026-09-01' }));
    }) as typeof fetch;
    const res = await fetchOgdResource('abc', { apiKey: 'k', pageSize: 2, fetchImpl: fake });
    expect(res.records).toHaveLength(5);
    expect(res.urls).toHaveLength(3);
    expect(res.updatedDate).toBe('2026-09-01');
  });

  it('fails fast on a missing or rejected key', async () => {
    const before = process.env.DATA_GOV_IN_API_KEY;
    delete process.env.DATA_GOV_IN_API_KEY;
    await expect(fetchOgdResource('abc')).rejects.toBeInstanceOf(OgdConfigError);
    process.env.DATA_GOV_IN_API_KEY = before;
    const denied = (async () => new Response('{}', { status: 403 })) as typeof fetch;
    await expect(fetchOgdResource('abc', { apiKey: 'bad', fetchImpl: denied, retries: 0 })).rejects.toBeInstanceOf(OgdConfigError);
  });
});
