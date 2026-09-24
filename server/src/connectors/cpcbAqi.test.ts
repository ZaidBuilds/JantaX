import { describe, it, expect } from 'vitest';
import { normaliseAqiRecords, CPCB_SOURCE_LABEL } from './cpcbAqi';

// Fixtures below mirror the exact shape CPCB returns on data.gov.in. They are
// TEST FIXTURES ONLY — never served as app data. They lock the normaliser's
// contract so a live CPCB schema drift is caught by a red test, not silently.

const NEW_SCHEMA_ROW = {
  country: 'India',
  state: 'Delhi',
  city: 'Delhi',
  station: 'Anand Vihar, Delhi - DPCC',
  last_update: '01-08-2026 14:00:00',
  latitude: '28.6469',
  longitude: '77.3160',
  pollutant_id: 'PM2.5',
  min_value: '120',
  max_value: '312',
  avg_value: '210',
};

const OLD_SCHEMA_ROW = {
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  station: 'Bandra, Mumbai - MPCB',
  last_update: '01-08-2026 14:00:00',
  latitude: '19.0544',
  longitude: '72.8402',
  pollutant_id: 'PM10',
  pollutant_min: '80',
  pollutant_max: '190',
  pollutant_avg: '140',
};

describe('CPCB AQI normaliser', () => {
  it('normalises the current CPCB field spelling (avg_value)', () => {
    const [r] = normaliseAqiRecords([NEW_SCHEMA_ROW]);
    expect(r.city).toBe('Delhi');
    expect(r.state).toBe('Delhi');
    expect(r.lat).toBeCloseTo(28.6469, 3);
    expect(r.lng).toBeCloseTo(77.316, 3);
    expect(r.pollutantId).toBe('PM2.5');
    expect(r.avgValue).toBe(210);
    expect(r.minValue).toBe(120);
    expect(r.maxValue).toBe(312);
  });

  it('tolerates the legacy field spelling (pollutant_avg)', () => {
    const [r] = normaliseAqiRecords([OLD_SCHEMA_ROW]);
    expect(r.avgValue).toBe(140);
    expect(r.minValue).toBe(80);
    expect(r.maxValue).toBe(190);
  });

  it('stamps every reading with its CPCB source and a fetch timestamp', () => {
    const [r] = normaliseAqiRecords([NEW_SCHEMA_ROW]);
    expect(r.source).toBe(CPCB_SOURCE_LABEL);
    expect(r.sourceUrl).toContain('data.gov.in');
    expect(() => new Date(r.fetchedAt).toISOString()).not.toThrow();
  });

  it('coerces NA / empty numerics to null and drops empty rows', () => {
    const [r] = normaliseAqiRecords([{ ...NEW_SCHEMA_ROW, avg_value: 'NA', min_value: '' }]);
    expect(r.avgValue).toBeNull();
    expect(r.minValue).toBeNull();
    expect(normaliseAqiRecords([{ station: '', city: '' }])).toHaveLength(0);
  });
});
