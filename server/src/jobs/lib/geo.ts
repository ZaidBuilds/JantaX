export interface Point {
  lat: number;
  lng: number;
}

/** Rough bounding box for India, used to reject coordinates that are missing, swapped or zero. */
export function isInIndia(lat: number | null | undefined, lng: number | null | undefined): boolean {
  return typeof lat === 'number' && typeof lng === 'number' && lat >= 6 && lat <= 37.6 && lng >= 68 && lng <= 97.6;
}

/** Great-circle distance in kilometres. */
export function distanceKm(a: Point, b: Point): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Median of the valid points, so one mis-geocoded post office cannot drag a PIN's centre away. */
export function medianPoint(points: Point[]): Point | null {
  const ok = points.filter((p) => isInIndia(p.lat, p.lng));
  if (!ok.length) return null;
  const med = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  return { lat: med(ok.map((p) => p.lat)), lng: med(ok.map((p) => p.lng)) };
}

export function nearest<T extends Point>(from: Point, items: T[], limit = 1): (T & { km: number })[] {
  return items
    .map((it) => ({ ...it, km: distanceKm(from, it) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}
