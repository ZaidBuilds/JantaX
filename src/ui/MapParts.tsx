import { useEffect, type ReactNode } from 'react';
import { Circle, Popup, useMap } from 'react-leaflet';
import { circleBounds, type LatLng, type PinArea } from '../core/geo/placement';
import { t } from '../i18n';

/**
 * Pieces shared by every map: the tile source, a PIN drawn as an area (never as a precise point),
 * a legend that says which marks are exact, and a helper that fits the view to what is drawn.
 */

export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
/** OpenStreetMap's tile policy requires this attribution wherever its tiles are shown. */
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const AREA_COLOR = '#1b46a8';

/** A PIN as a dashed area around its post offices. */
export function AreaCircle({ area, children, emphasis = false }: { area: PinArea; children?: ReactNode; emphasis?: boolean }) {
  return (
    <Circle
      center={[area.lat, area.lng]}
      radius={area.radiusKm * 1000}
      // Leaflet reads className only when it first draws the path, so it goes here, not in pathOptions.
      className="map-area"
      pathOptions={{
        color: AREA_COLOR,
        weight: emphasis ? 3 : 2,
        dashArray: '6 6',
        fillColor: AREA_COLOR,
        fillOpacity: emphasis ? 0.14 : 0.08,
      }}
    >
      {children && <Popup>{children}</Popup>}
    </Circle>
  );
}

type Fit = { areas?: PinArea[]; points?: LatLng[] };

/** Fits the view to the areas and points given, whenever `nonce` or what is drawn changes. */
export function FitView({ areas = [], points = [], nonce = 0, maxZoom = 15 }: Fit & { nonce?: number; maxZoom?: number }) {
  const map = useMap();
  const key = JSON.stringify([areas.map((a) => [a.lat, a.lng, a.radiusKm]), points.map((p) => [p.lat, p.lng]), nonce]);
  useEffect(() => {
    const corners: [number, number][] = [];
    for (const a of areas) corners.push(...circleBounds(a, a.radiusKm));
    for (const p of points) corners.push([p.lat, p.lng]);
    if (!corners.length) return;
    // The container may have changed size since the map was created (lazy loading, layout), so measure first.
    map.invalidateSize();
    map.fitBounds(corners, { padding: [24, 24], maxZoom, animate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

/** What the area means, in one line: "Somewhere in PIN 110001, about 1.7 km around its post offices". */
export function areaText(area: PinArea): string {
  return area.basis === 'post-offices'
    ? t('Somewhere in PIN {pin}, about {km} km around its post offices', { pin: area.pin, km: area.radiusKm })
    : t('Somewhere in PIN {pin}; the directory has no location for it, so this is its postal district', { pin: area.pin });
}

/** Explains the two kinds of mark. Shown on every map that mixes them. */
export function MapLegend({ area, showExact = true, className = '' }: { area?: PinArea | null; showExact?: boolean; className?: string }) {
  return (
    <div className={`map-legend ${className}`} role="note">
      {showExact && (
        <span className="map-legend-item">
          <span className="map-legend-dot" aria-hidden="true" /> {t('Exact location, from the record itself')}
        </span>
      )}
      <span className="map-legend-item">
        <span className="map-legend-ring" aria-hidden="true" /> {area ? areaText(area) : t('Somewhere in this PIN: the exact spot is not published')}
      </span>
    </div>
  );
}
