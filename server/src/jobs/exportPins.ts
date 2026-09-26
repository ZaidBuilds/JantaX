import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../prisma';
import { SOURCES } from './sources';

/**
 * Writes the synced PIN directory as static JSON the frontend can fetch without an API:
 * one file per 3-digit PIN prefix (the postal sorting district), plus index.json with provenance
 * and each prefix's bounding box (for nearest-PIN lookups from a location).
 *
 *   { "110001": { "d": "New Delhi", "s": "Delhi", "c": [28.62, 77.21], "o": [["Connaught Place SO", "PO", 0], ...] } }
 *
 * `via` records how the data reached us when it did not come straight from the publisher.
 */
export async function exportPinChunks(outDir: string, via?: string) {
  const source = SOURCES['india-post-pincode-directory'];
  const row = await prisma.source.findUnique({ where: { sourceId: source.sourceId } });
  if (!row?.lastSuccessfulSync) throw new Error('The PIN directory has not been synced yet. Run: npm run data -- sync india-post-pincode-directory');

  const pins = await prisma.pincode.findMany({
    where: { postOffices: { some: {} } },
    select: { code: true, district: true, state: true, lat: true, lng: true },
    orderBy: { code: 'asc' },
  });
  const offices = await prisma.postOffice.findMany({
    select: { pincodeCode: true, officeName: true, officeType: true, delivery: true },
    orderBy: [{ pincodeCode: 'asc' }, { officeType: 'desc' }, { officeName: 'asc' }],
  });
  const officesByPin = new Map<string, [string, string, number][]>();
  for (const o of offices) {
    const list = officesByPin.get(o.pincodeCode) ?? [];
    list.push([o.officeName, o.officeType, o.delivery ? 1 : 0]);
    officesByPin.set(o.pincodeCode, list);
  }

  const chunks = new Map<string, Record<string, unknown>>();
  // Bounding box of each prefix's PIN centres, so a browser can find the nearest PIN by loading only nearby files.
  const bounds = new Map<string, [number, number, number, number]>();
  const r4 = (n: number) => Math.round(n * 1e4) / 1e4;
  for (const p of pins) {
    const prefix = p.code.slice(0, 3);
    if (p.lat !== null && p.lng !== null) {
      const b = bounds.get(prefix);
      const [lat, lng] = [r4(p.lat), r4(p.lng)];
      bounds.set(prefix, b ? [Math.min(b[0], lat), Math.min(b[1], lng), Math.max(b[2], lat), Math.max(b[3], lng)] : [lat, lng, lat, lng]);
    }
    const chunk = chunks.get(prefix) ?? {};
    chunk[p.code] = {
      d: p.district,
      s: p.state,
      ...(p.lat !== null && p.lng !== null ? { c: [r4(p.lat), r4(p.lng)] } : {}),
      o: officesByPin.get(p.code) ?? [],
    };
    chunks.set(prefix, chunk);
  }

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  for (const [prefix, chunk] of chunks) await fs.writeFile(path.join(outDir, `${prefix}.json`), JSON.stringify(chunk));
  const index = {
    version: 1,
    source: {
      name: source.sourceName,
      organization: source.organization,
      url: source.sourceUrl,
      license: source.license,
      licenseUrl: source.termsUrl,
      publishedAt: row.lastPublishedDate,
      syncedAt: row.lastSuccessfulSync.toISOString(),
      ...(via ? { via } : {}),
    },
    pins: pins.length,
    offices: offices.length,
    prefixes: [...chunks.keys()],
    /** prefix → [minLat, minLng, maxLat, maxLng] of its PIN centres */
    bounds: Object.fromEntries(bounds),
  };
  // Loaded on most pages, so kept compact.
  await fs.writeFile(path.join(outDir, 'index.json'), JSON.stringify(index));
  return { pins: pins.length, offices: offices.length, files: chunks.size + 1 };
}
