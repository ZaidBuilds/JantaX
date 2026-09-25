/**
 * CPCB National Air Quality Index helpers.
 *
 * The data.gov.in real-time feed publishes, per station and pollutant, the minimum, maximum and
 * average index value. Following CPCB's NAQI method, a station's AQI is its highest pollutant
 * sub-index, and is only reported when at least three pollutants have data and one of them is
 * PM2.5 or PM10. Index values run 0 to 500; anything above that means the feed has switched to
 * raw concentrations, so we report no AQI rather than a wrong one.
 */

export const POLLUTANTS = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'OZONE', 'NH3'] as const;

export type AqiCategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very poor' | 'Severe';

export const AQI_BANDS: { max: number; category: AqiCategory }[] = [
  { max: 50, category: 'Good' },
  { max: 100, category: 'Satisfactory' },
  { max: 200, category: 'Moderate' },
  { max: 300, category: 'Poor' },
  { max: 400, category: 'Very poor' },
  { max: 500, category: 'Severe' },
];

export function normalizePollutant(id: string): string {
  const k = id.toUpperCase().replace(/\s+/g, '');
  if (k === 'O3') return 'OZONE';
  if (k === 'PM25') return 'PM2.5';
  return k;
}

export function aqiCategory(value: number): AqiCategory {
  return (AQI_BANDS.find((b) => value <= b.max) ?? AQI_BANDS[AQI_BANDS.length - 1]).category;
}

export interface StationAqi {
  aqi: number | null;
  category: AqiCategory | null;
  dominant: string | null;
  pollutantsReported: number;
  /** Why no AQI was computed, when `aqi` is null. */
  reason?: string;
}

export function stationAqi(readings: { pollutant: string; avgValue: number | null }[]): StationAqi {
  const withData = readings.filter((r) => typeof r.avgValue === 'number' && Number.isFinite(r.avgValue));
  const base = { pollutantsReported: withData.length };
  if (withData.some((r) => (r.avgValue as number) > 500)) {
    return { ...base, aqi: null, category: null, dominant: null, reason: 'Published values exceed the 0 to 500 index range' };
  }
  if (withData.length < 3 || !withData.some((r) => r.pollutant === 'PM2.5' || r.pollutant === 'PM10')) {
    return { ...base, aqi: null, category: null, dominant: null, reason: 'Fewer than three pollutants, or no PM2.5 or PM10 reading' };
  }
  const top = withData.reduce((a, b) => ((b.avgValue as number) > (a.avgValue as number) ? b : a));
  const aqi = Math.round(top.avgValue as number);
  return { ...base, aqi, category: aqiCategory(aqi), dominant: top.pollutant };
}

/** "25-09-2026 10:00:00" (IST, as CPCB publishes it) or ISO → UTC Date. */
export function parseIstTimestamp(s: string): Date | null {
  const m = s.trim().match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (m) {
    const [, dd, mm, yyyy, hh, mi, ss] = m;
    const utc = Date.UTC(+yyyy, +mm - 1, +dd, +hh, +mi, +(ss || 0)) - 330 * 60_000;
    return Number.isFinite(utc) ? new Date(utc) : null;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(s) ? s : `${s.replace(' ', 'T')}+05:30`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}
