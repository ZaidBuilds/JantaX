import { describe, it, expect } from 'vitest';
import { getCoordinateForPin } from '../../core/utils/pinCoordinates';
import { resolvePincode } from '../../core/utils/pinResolver';
import { getAllWorks } from '../../modules/mplads/services/mpladsService';
import { getAllBooths } from '../../modules/booth/services/boothService';
import { getAllCourts } from '../../modules/courts/services/courtsService';

describe('Map Explorer & Multi-Layer Geo-Intelligence — Unit & Integration Test Suite', () => {
  it('should resolve valid geospatial coordinates for all primary civic hubs', () => {
    const hubs = ['110001', '110054', '250001', '440001', '560001'];

    hubs.forEach((pin) => {
      const coords = getCoordinateForPin(pin);
      expect(coords).toBeDefined();
      expect(coords?.lat).toBeGreaterThan(8.0);
      expect(coords?.lat).toBeLessThan(37.0);
      expect(coords?.lng).toBeGreaterThan(68.0);
      expect(coords?.lng).toBeLessThan(98.0);

      const resolved = resolvePincode(pin);
      expect(resolved.state).toBeTruthy();
    });
  });

  it('should aggregate multi-layer civic entities (MPLADS, Booths, Courts) for PIN 110001', () => {
    const mplads = getAllWorks({ pinCode: '110001' });
    expect(mplads.length).toBeGreaterThan(0);
    mplads.forEach((w) => expect(w.pinCode).toBe('110001'));

    const booths = getAllBooths({ pinCode: '110001' });
    expect(booths.length).toBeGreaterThan(0);
    booths.forEach((b) => expect(b.pinCode).toBe('110001'));

    const courts = getAllCourts({ pinCode: '110001' });
    expect(courts.length).toBeGreaterThan(0);
    courts.forEach((c) => expect(c.pinCode).toBe('110001'));
  });

  it('should maintain distinct unique entity IDs across disparate modules for map rendering', () => {
    const mpladsIds = getAllWorks().map((w) => w.id);
    const boothIds = getAllBooths().map((b) => b.id);
    const courtIds = getAllCourts().map((c) => c.id);

    const allIds = [...mpladsIds, ...boothIds, ...courtIds];
    const uniqueIds = new Set(allIds);

    expect(uniqueIds.size).toBe(allIds.length);
  });
});
