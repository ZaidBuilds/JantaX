import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { distanceKm, spreadKm, SPREAD_KM } from '../jobs/lib/geo';

/** A point `km` kilometres north of `from`. */
const north = (from: { lat: number; lng: number }, km: number) => ({ lat: from.lat + km / 111.2, lng: from.lng });
const centre = { lat: 28.6, lng: 77.2 };

describe('how far a PIN spreads around its post offices', () => {
  it('needs at least two located offices', () => {
    expect(spreadKm(centre, [])).toBeNull();
    expect(spreadKm(centre, [north(centre, 2)])).toBeNull();
    expect(spreadKm(centre, [{ lat: 0, lng: 0 }, north(centre, 2)])).toBeNull();
  });

  it('covers most offices, measured from the centre', () => {
    const offices = [1, 2, 3, 4, 5].map((km) => north(centre, km));
    const r = spreadKm(centre, offices)!;
    expect(r).toBeGreaterThanOrEqual(4);
    expect(r).toBeLessThanOrEqual(5);
    expect(Math.abs(distanceKm(centre, north(centre, 3)) - 3)).toBeLessThan(0.05);
  });

  it('ignores a mis-geocoded office far from the rest', () => {
    const offices = [1, 1.5, 2, 2.5, 3].map((km) => north(centre, km));
    const without = spreadKm(centre, offices)!;
    const withStray = spreadKm(centre, [...offices, north(centre, 300)])!;
    expect(withStray).toBeLessThan(4);
    expect(Math.abs(withStray - without)).toBeLessThan(1);
  });

  it('never draws a dot or half a state', () => {
    expect(spreadKm(centre, [north(centre, 0.01), north(centre, 0.02)])).toBe(SPREAD_KM.min);
    const wide = [40, 45, 50, 55, 60].map((km) => north(centre, km));
    expect(spreadKm(centre, wide)).toBe(SPREAD_KM.max);
  });
});

describe('the published PIN directory', () => {
  it('carries a spread for PINs with located offices', () => {
    const chunk = JSON.parse(readFileSync('public/data/pins/110.json', 'utf8')) as Record<string, { c?: number[]; r?: number }>;
    const located = Object.values(chunk).filter((p) => p.c);
    const withSpread = located.filter((p) => typeof p.r === 'number');
    expect(withSpread.length / located.length).toBeGreaterThan(0.8);
    for (const p of withSpread) {
      expect(p.r).toBeGreaterThanOrEqual(SPREAD_KM.min);
      expect(p.r).toBeLessThanOrEqual(SPREAD_KM.max);
    }
    // Connaught Place is compact: its offices sit within a couple of kilometres.
    expect(chunk['110001'].r).toBeLessThan(4);
  });
});
