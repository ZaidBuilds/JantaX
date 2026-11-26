// Live CPCB air quality for a PIN: its city's stations, else nearest in state.

import { fetchOgd } from '../connectors/ogdClient';
import { OGD } from '../connectors/ogdResources';
import { cached, HOUR } from './cache';
import { resolvePin } from './pin';
import { toNum, unavailable, type LiveResult } from './types';

type Raw = Record<string, string>;

export interface LiveAqiStation {
  station: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  lastUpdate: string;
  /** pollutant id → { avg, min, max } as published by CPCB */
  pollutants: Record<string, { avg: number | null; min: number | null; max: number | null }>;
}

function km(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(r(bLat - aLat) / 2) ** 2 +
    Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(r(bLng - aLng) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}

function group(rows: Raw[], lat: number | null, lng: number | null): LiveAqiStation[] {
  const map = new Map<string, LiveAqiStation>();
  for (const r of rows) {
    let s = map.get(r.station);
    if (!s) {
      const sLat = toNum(r.latitude);
      const sLng = toNum(r.longitude);
      s = {
        station: r.station,
        city: r.city,
        state: r.state,
        lat: sLat,
        lng: sLng,
        distanceKm: lat !== null && lng !== null && sLat !== null && sLng !== null ? km(lat, lng, sLat, sLng) : null,
        lastUpdate: r.last_update,
        pollutants: {},
      };
      map.set(r.station, s);
    }
    s.pollutants[r.pollutant_id] = { avg: toNum(r.avg_value), min: toNum(r.min_value), max: toNum(r.max_value) };
  }
  return [...map.values()].sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
}

const load = (filters: Record<string, string>) =>
  cached(`aqi:${JSON.stringify(filters)}`, HOUR / 2, () => fetchOgd<Raw>('cpcbAqi', { filters, max: 400 }));

export async function liveAqi(pin: string): Promise<LiveResult<LiveAqiStation> & { scope?: string }> {
  const p = await resolvePin(pin);
  if (!p) return unavailable('pollution', 'PIN code not found.');

  let scope = 'city';
  let res = await load({ state: p.state, city: p.district });
  if (res.records.length === 0) {
    scope = 'nearest in state';
    res = await load({ state: p.state });
  }
  if (res.records.length === 0) {
    return unavailable('pollution', `No CPCB monitoring station reporting in ${p.state} right now.`);
  }

  const stations = group(res.records, p.lat, p.lng).slice(0, scope === 'city' ? 20 : 3);
  return {
    domain: 'pollution',
    available: true,
    scope,
    records: stations,
    total: stations.length,
    source: {
      name: 'Central Pollution Control Board — Real-time AQI',
      url: res.sourceUrl,
      resourceId: OGD.cpcbAqi.id,
      updatedDate: res.updatedDate,
      level: 'monitoring station',
    },
    fetchedAt: res.fetchedAt,
  };
}
