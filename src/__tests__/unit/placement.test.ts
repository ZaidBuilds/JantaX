import { describe, it, expect } from 'vitest';
import { circleBounds, DEFAULT_PIN_RADIUS_KM, DISTRICT_RADIUS_KM, distanceKm, pinArea, placeRecord, type PinArea } from '../../core/geo/placement';
import type { PinRecord } from '../../core/services/pinDirectory';

const record = (over: Partial<PinRecord> = {}): PinRecord => ({
  pin: '110001',
  district: 'New Delhi',
  state: 'Delhi',
  lat: 28.63,
  lng: 77.22,
  radiusKm: 1.7,
  offices: [],
  ...over,
});

const delhi: PinArea = { pin: '110001', lat: 28.63, lng: 77.22, radiusKm: 1.7, basis: 'post-offices' };

describe('where a PIN is drawn', () => {
  it('uses the centre and spread of its own post offices', () => {
    expect(pinArea('110001', record())).toEqual(delhi);
  });

  it('falls back to the typical spread when the PIN has too few located offices', () => {
    expect(pinArea('110001', record({ radiusKm: null }))?.radiusKm).toBe(DEFAULT_PIN_RADIUS_KM);
  });

  it('draws a PIN with no located office as its postal district, wide', () => {
    const area = pinArea('110001', record({ lat: null, lng: null }));
    expect(area?.basis).toBe('district');
    expect(area?.radiusKm).toBe(DISTRICT_RADIUS_KM);
    expect(pinArea('110001', null)?.basis).toBe('district');
  });

  it('draws nothing for a PIN it cannot place at all', () => {
    expect(pinArea('999999', null)).toBeNull();
  });
});

describe('where a record is drawn', () => {
  it('is an area when the record has no coordinates of its own', () => {
    expect(placeRecord(undefined, delhi)).toEqual({ kind: 'area' });
    expect(placeRecord({ lat: null, lng: null }, delhi)).toEqual({ kind: 'area' });
    expect(placeRecord({ lat: 28.63 }, delhi)).toEqual({ kind: 'area' });
  });

  it('is an exact point when its own coordinates fit its PIN', () => {
    expect(placeRecord({ lat: 28.64, lng: 77.21 }, delhi)).toEqual({ kind: 'exact', lat: 28.64, lng: 77.21 });
  });

  it('is an area when its coordinates are outside India, swapped or zero', () => {
    expect(placeRecord({ lat: 0, lng: 0 }, delhi)).toEqual({ kind: 'area' });
    expect(placeRecord({ lat: 77.22, lng: 28.63 }, delhi)).toEqual({ kind: 'area' });
    expect(placeRecord({ lat: 51.5, lng: -0.12 }, null)).toEqual({ kind: 'area' });
  });

  it('is an area when its coordinates contradict its PIN', () => {
    // Mumbai coordinates on a record that says it is in Connaught Place.
    expect(placeRecord({ lat: 19.07, lng: 72.87 }, delhi)).toEqual({ kind: 'area' });
  });

  it('trusts coordinates in India when the PIN is only placed by its district', () => {
    const district: PinArea = { ...delhi, basis: 'district', radiusKm: DISTRICT_RADIUS_KM };
    expect(placeRecord({ lat: 28.9, lng: 77.6 }, district).kind).toBe('exact');
  });
});

describe('map helpers', () => {
  it('fits a circle with a box that just contains it', () => {
    const [[s, w], [n, e]] = circleBounds(delhi, 10);
    expect(distanceKm({ lat: s, lng: delhi.lng }, delhi)).toBeCloseTo(10, 0);
    expect(distanceKm({ lat: n, lng: delhi.lng }, delhi)).toBeCloseTo(10, 0);
    expect(distanceKm({ lat: delhi.lat, lng: w }, delhi)).toBeCloseTo(10, 0);
    expect(distanceKm({ lat: delhi.lat, lng: e }, delhi)).toBeCloseTo(10, 0);
  });
});
