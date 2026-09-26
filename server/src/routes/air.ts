import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { nearest } from '../jobs/lib/geo';
import { stationAqi } from '../jobs/lib/aqi';
import { SOURCES } from '../jobs/sources';

const router = Router();
const STALE_MS = 6 * 3600_000;

async function provenance() {
  const def = SOURCES['cpcb-realtime-aqi'];
  const row = await prisma.source.findUnique({ where: { sourceId: def.sourceId } });
  return {
    name: def.sourceName,
    organization: def.organization,
    url: def.sourceUrl,
    license: def.license,
    lastSync: row?.lastSuccessfulSync?.toISOString() ?? null,
  };
}

/** Latest hour of readings for a station, with the station AQI worked out from them. */
async function latest(stationId: string) {
  const last = await prisma.airReading.findFirst({ where: { stationId }, orderBy: { observedAt: 'desc' }, select: { observedAt: true } });
  if (!last) return null;
  const readings = await prisma.airReading.findMany({
    where: { stationId, observedAt: last.observedAt },
    select: { pollutant: true, minValue: true, maxValue: true, avgValue: true },
    orderBy: { pollutant: 'asc' },
  });
  return {
    observedAt: last.observedAt.toISOString(),
    stale: Date.now() - last.observedAt.getTime() > STALE_MS,
    ...stationAqi(readings),
    readings,
  };
}

// GET /api/air/near?pin=110001&limit=3 — the monitoring stations closest to a PIN, with their latest readings.
router.get('/air/near', async (req: Request, res: Response) => {
  const pin = String(req.query.pin || '').replace(/\D/g, '');
  const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 10);
  if (!/^[1-9]\d{5}$/.test(pin)) return res.status(400).json({ error: 'A six-digit PIN code is required' });

  const place = await prisma.pincode.findUnique({ where: { code: pin }, select: { lat: true, lng: true, district: true, state: true } });
  if (!place) return res.status(404).json({ error: 'PIN code not found in the India Post directory' });
  if (place.lat === null || place.lng === null) return res.status(404).json({ error: 'No coordinates for this PIN code' });

  const stations = await prisma.airStation.findMany({ where: { lat: { not: null }, lng: { not: null } }, select: { id: true, name: true, city: true, state: true, lat: true, lng: true } });
  const closest = nearest({ lat: place.lat, lng: place.lng }, stations.map((s) => ({ ...s, lat: s.lat!, lng: s.lng! })), limit);

  res.json({
    pin,
    district: place.district,
    state: place.state,
    stations: await Promise.all(closest.map(async (s) => ({ id: s.id, name: s.name, city: s.city, state: s.state, km: Math.round(s.km * 10) / 10, latest: await latest(s.id) }))),
    source: await provenance(),
  });
});

// GET /api/air/stations/:id — one station: latest readings plus hourly AQI for the last 48 hours.
router.get('/air/stations/:id', async (req: Request, res: Response) => {
  const station = await prisma.airStation.findUnique({ where: { id: String(req.params.id) } });
  if (!station) return res.status(404).json({ error: 'Station not found' });

  const since = new Date(Date.now() - 48 * 3600_000);
  const rows = await prisma.airReading.findMany({ where: { stationId: station.id, observedAt: { gte: since } }, select: { pollutant: true, avgValue: true, observedAt: true }, orderBy: { observedAt: 'asc' } });
  const byHour = new Map<string, { pollutant: string; avgValue: number | null }[]>();
  for (const r of rows) {
    const k = r.observedAt.toISOString();
    byHour.set(k, [...(byHour.get(k) ?? []), r]);
  }

  res.json({
    station,
    latest: await latest(station.id),
    history: [...byHour.entries()].map(([observedAt, rs]) => ({ observedAt, ...stationAqi(rs) })),
    source: await provenance(),
  });
});

export default router;
