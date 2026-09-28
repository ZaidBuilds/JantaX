import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { lookupPin, type PinRecord } from '../core/services/pinDirectory';
import { INDIA_VIEW, pinArea, placeRecord, type PinArea } from '../core/geo/placement';
import { AreaCircle, FitView, MapLegend, TILE_ATTRIBUTION, TILE_URL, areaText } from './MapParts';
import { pick, t } from '../i18n';

export interface SearchMapItem {
  key: string;
  title: string;
  titleHi?: string;
  typeLabel: string;
  href: string;
  pin: string;
  lat?: number;
  lng?: number;
}

/** PIN areas drawn at most; a page of results rarely spans more. */
const MAX_PINS = 40;
const POINT_COLOR = '#e2600c';

/**
 * Where a page of search results is. A result with its own published location is a point; the rest
 * are shown as the area of their PIN, one area per PIN listing the results in it.
 */
export default function SearchResultsMap({ items }: { items: SearchMapItem[] }) {
  const pins = useMemo(() => [...new Set(items.map((i) => i.pin))].slice(0, MAX_PINS), [items]);
  const [records, setRecords] = useState<Record<string, PinRecord | null>>({});

  useEffect(() => {
    let live = true;
    Promise.all(pins.map((p) => lookupPin(p).then((r) => [p, r] as const, () => [p, null] as const))).then((rows) => {
      if (live) setRecords(Object.fromEntries(rows));
    });
    return () => {
      live = false;
    };
  }, [pins]);

  const ready = pins.every((p) => p in records);
  const areas = useMemo(() => new Map(pins.map((p) => [p, pinArea(p, records[p])] as const)), [pins, records]);

  const placed = items.map((it) => ({ ...it, placement: placeRecord({ lat: it.lat, lng: it.lng }, areas.get(it.pin) ?? null) }));
  const exact = placed.flatMap((it) => (it.placement.kind === 'exact' ? [{ ...it, lat: it.placement.lat, lng: it.placement.lng }] : []));
  const byArea = new Map<string, { area: PinArea; items: SearchMapItem[] }>();
  let unplaced = 0;
  for (const it of placed) {
    if (it.placement.kind === 'exact') continue;
    const area = areas.get(it.pin);
    if (!area) {
      unplaced++;
      continue;
    }
    const group = byArea.get(it.pin) ?? { area, items: [] };
    group.items.push(it);
    byArea.set(it.pin, group);
  }
  const groups = [...byArea.values()];

  return (
    <section className="card search-map" aria-label={t('Map of these results')}>
      <div className="search-map-canvas">
        {ready ? (
          <MapContainer center={INDIA_VIEW.center} zoom={INDIA_VIEW.zoom} zoomSnap={0.5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
            <FitView areas={groups.map((g) => g.area)} points={exact} maxZoom={13} />
            {groups.map(({ area, items: inArea }) => (
              <AreaCircle key={area.pin} area={area}>
                <strong>PIN {area.pin}</strong>
                <br />
                <span style={{ fontSize: 12 }}>{areaText(area)}</span>
                <ul className="search-map-list">
                  {inArea.slice(0, 4).map((it) => (
                    <li key={it.key}>
                      <Link to={it.href} translate="no">{pick(it.title, it.titleHi)}</Link>
                    </li>
                  ))}
                </ul>
                {inArea.length > 4 && <span style={{ fontSize: 12 }}>{t('and {n} more in this PIN', { n: inArea.length - 4 })}</span>}
              </AreaCircle>
            ))}
            {exact.map((it) => (
              <CircleMarker
                key={it.key}
                center={[it.lat, it.lng]}
                radius={8}
                className="map-point"
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: POINT_COLOR, fillOpacity: 0.92 }}
              >
                <Popup>
                  <Link to={it.href} translate="no">{pick(it.title, it.titleHi)}</Link>
                  <br />
                  <span style={{ fontSize: 12 }}>{it.typeLabel}</span>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        ) : (
          <div className="skeleton" style={{ height: '100%', borderRadius: 0 }} />
        )}
      </div>
      <div className="card-foot search-map-foot">
        <MapLegend showExact={exact.length > 0} />
        {unplaced > 0 && <span className="tiny muted">{t(unplaced === 1 ? '{n} result has no location to show.' : '{n} results have no location to show.', { n: unplaced })}</span>}
      </div>
    </section>
  );
}
