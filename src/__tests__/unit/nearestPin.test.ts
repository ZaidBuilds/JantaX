// @vitest-environment node
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { searchNearest, type PrefixBounds, type RawPin } from '../../core/services/pinDirectory';

const dir = path.resolve(__dirname, '../../../public/data/pins');
const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')) as { bounds: PrefixBounds };
const loaded: string[] = [];
const loadReal = async (prefix: string) => {
  loaded.push(prefix);
  return JSON.parse(fs.readFileSync(path.join(dir, `${prefix}.json`), 'utf8')) as Record<string, RawPin>;
};
const place = async (lat: number, lng: number) => {
  loaded.length = 0;
  const hit = await searchNearest(lat, lng, index.bounds, loadReal);
  const rec = hit && (await loadReal(hit.pin.slice(0, 3)))[hit.pin];
  loaded.pop();
  return { ...hit, district: rec?.d, state: rec?.s, files: loaded.length };
};

describe('nearest PIN from a location', () => {
  it('finds the closest PIN centre and skips prefixes that cannot be closer', async () => {
    const bounds: PrefixBounds = { '110': [28.5, 77.1, 28.7, 77.3], '400': [18.9, 72.8, 19.1, 73.0] };
    const chunks: Record<string, Record<string, RawPin>> = {
      '110': { '110001': { d: 'New Delhi', s: 'Delhi', c: [28.62, 77.21], o: [] }, '110002': { d: 'Central Delhi', s: 'Delhi', c: [28.64, 77.24], o: [] } },
      '400': { '400001': { d: 'Mumbai', s: 'Maharashtra', c: [18.94, 72.84], o: [] } },
    };
    const seen: string[] = [];
    const hit = await searchNearest(28.621, 77.211, bounds, async (p) => (seen.push(p), chunks[p]));
    expect(hit?.pin).toBe('110001');
    expect(hit!.km).toBeLessThan(1);
    expect(seen).toEqual(['110']);
  });

  it('places real locations in the right district using the committed directory', async () => {
    expect(await place(28.6315, 77.2167)).toMatchObject({ district: 'New Delhi', state: 'Delhi' }); // Connaught Place
    expect(await place(18.9322, 72.8351)).toMatchObject({ state: 'Maharashtra', district: expect.stringMatching(/Mumbai/) }); // Fort, Mumbai
    expect(await place(26.8467, 80.9462)).toMatchObject({ state: 'Uttar Pradesh', district: 'Lucknow' });
    expect(await place(11.6234, 92.7265)).toMatchObject({ state: 'Andaman and Nicobar Islands' }); // Port Blair
  });

  it('loads only the few files whose area could hold the answer', async () => {
    // Kolkata is the worst case: eight postal prefixes overlap the metro area.
    const kolkata = await place(22.5726, 88.3639);
    expect(kolkata).toMatchObject({ district: 'Kolkata', state: 'West Bengal' });
    expect(kolkata.files).toBeLessThanOrEqual(8);
    const leh = await place(34.1526, 77.5771);
    expect(leh).toMatchObject({ state: 'Ladakh', files: 1 });
  });

  it('reports the distance, so a point outside India can be rejected', async () => {
    const r = await place(5.0, 70.0); // Indian Ocean
    expect(r.km).toBeGreaterThan(100);
  });
});
