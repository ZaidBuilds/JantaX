import type { PinRecord } from '../services/pinDirectory';
import { getCoordinateForPin } from '../utils/pinCoordinates';

/**
 * Where a record goes on a map, without implying precision the data does not have.
 *
 * A record is drawn as an exact point only when it carries its own coordinates and they make sense
 * (inside India, and near the PIN it says it is in). Everything else is "somewhere in this PIN": the
 * map draws the area around the PIN's post offices instead of inventing a point.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** A PIN drawn as an area: the middle of its post offices and how far they spread. */
export interface PinArea extends LatLng {
  pin: string;
  radiusKm: number;
  /**
   * 'post-offices': centre and spread of the PIN's own offices (India Post directory).
   * 'district': the directory has no location for this PIN, so this is the centre of its postal
   * district, drawn wide.
   */
  basis: 'post-offices' | 'district';
}

export type Placement = { kind: 'exact'; lat: number; lng: number } | { kind: 'area' };

/**
 * Median spread of a PIN's post offices across India (15,847 PINs with two or more located offices),
 * used when a PIN has too few located offices to measure its own.
 */
export const DEFAULT_PIN_RADIUS_KM = 4.4;
/** Radius for a PIN placed only by its postal district's centre. */
export const DISTRICT_RADIUS_KM = 25;
/** A record's own point further than this from its PIN (or twice the PIN's spread) contradicts it. */
export const MAX_KM_FROM_PIN = 25;

export function isInIndia(lat: unknown, lng: unknown): boolean {
  return typeof lat === 'number' && typeof lng === 'number' && lat >= 6 && lat <= 37.6 && lng >= 68 && lng <= 97.6;
}

export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The area to draw for a PIN, from the post office directory, else its postal district; null if unknown. */
export function pinArea(pin: string, record: PinRecord | null | undefined): PinArea | null {
  if (record && record.lat !== null && record.lng !== null) {
    return { pin, lat: record.lat, lng: record.lng, radiusKm: record.radiusKm ?? DEFAULT_PIN_RADIUS_KM, basis: 'post-offices' };
  }
  const district = getCoordinateForPin(pin);
  return district ? { pin, lat: district.lat, lng: district.lng, radiusKm: DISTRICT_RADIUS_KM, basis: 'district' } : null;
}

/** Exact only when the record's own point is in India and consistent with its PIN's area. */
export function placeRecord(point: { lat?: number | null; lng?: number | null } | null | undefined, area: PinArea | null): Placement {
  const lat = point?.lat;
  const lng = point?.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number' || !isInIndia(lat, lng)) return { kind: 'area' };
  if (area && area.basis === 'post-offices' && distanceKm(area, { lat, lng }) > Math.max(MAX_KM_FROM_PIN, 2 * area.radiusKm)) {
    return { kind: 'area' };
  }
  return { kind: 'exact', lat, lng };
}

/** South-west and north-east corners of a circle, for fitting a map to it. */
export function circleBounds(c: LatLng, radiusKm: number): [[number, number], [number, number]] {
  const dLat = radiusKm / 111.32;
  const dLng = radiusKm / (111.32 * Math.max(Math.cos((c.lat * Math.PI) / 180), 0.01));
  return [
    [c.lat - dLat, c.lng - dLng],
    [c.lat + dLat, c.lng + dLng],
  ];
}

/** Whole-India view, for when no location is known. */
export const INDIA_VIEW = { center: [22.6, 79.5] as [number, number], zoom: 4 };
