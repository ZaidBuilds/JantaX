import { prisma } from '../prisma';
import { bulkUpsert } from '../jobs/lib/bulk';
import { medianPoint } from '../jobs/lib/geo';
import { GeoResolver, districtId, placeKey, districtKey } from './geography';

/**
 * Rebuilds the District spine from the PIN directory: one district per (state, district) pair,
 * located at the median of its PINs, and links every Pincode to its district.
 */
export async function buildDistrictsFromPins(): Promise<{ districts: number; pins: number }> {
  const pins = await prisma.pincode.findMany({
    where: { postOffices: { some: {} } },
    select: { code: true, state: true, district: true, lat: true, lng: true },
  });
  const groups = new Map<string, { name: string; state: string; pins: typeof pins }>();
  for (const p of pins) {
    const id = districtId(p.state, p.district);
    const g = groups.get(id);
    if (g) g.pins.push(p);
    else groups.set(id, { name: p.district, state: p.state, pins: [p] });
  }

  await bulkUpsert(
    'District',
    [...groups.entries()].map(([id, g]) => {
      const centre = medianPoint(g.pins.filter((p) => p.lat !== null && p.lng !== null).map((p) => ({ lat: p.lat!, lng: p.lng! })));
      return { id, name: g.name, state: g.state, lat: centre?.lat ?? null, lng: centre?.lng ?? null, pinCount: g.pins.length };
    }),
    { conflict: ['id'], keep: ['lgdCode'] }
  );

  // Link PINs to their district in one statement per district.
  for (const [id, g] of groups) {
    await prisma.pincode.updateMany({ where: { code: { in: g.pins.map((p) => p.code) } }, data: { districtId: id } });
  }
  return { districts: groups.size, pins: pins.length };
}

/** A resolver over the current spine, including stored aliases. */
export async function loadGeoResolver(): Promise<GeoResolver> {
  const [districts, aliases] = await Promise.all([
    prisma.district.findMany({ select: { id: true, name: true, state: true } }),
    prisma.districtAlias.findMany({ select: { key: true, districtId: true } }),
  ]);
  return new GeoResolver(districts, aliases);
}

/** Record another spelling for a district, e.g. an LGD name that differs from India Post's. */
export async function addDistrictAlias(state: string, name: string, id: string, source: string) {
  const key = `${placeKey(state)}:${districtKey(name)}`;
  await prisma.districtAlias.upsert({ where: { key }, update: { districtId: id, source }, create: { key, districtId: id, source } });
}
