import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Popup, useMap, CircleMarker } from 'react-leaflet';
import { Search, Crosshair, List, Map as MapIcon, X, ArrowRight, Layers, SearchX } from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useCatalog } from '../core/hooks/useCatalog';
import { circleBounds, INDIA_VIEW, pinArea, placeRecord, type PinArea, type Placement } from '../core/geo/placement';
import { usePinRecord } from '../core/services/pinDirectory';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getAllWorks } from '../modules/mplads/services/mpladsService';
import { getAllBooths } from '../modules/booth/services/boothService';
import { getAllCourts } from '../modules/courts/services/courtsService';
import { MOCK_CITIZEN_REPORTS } from '../modules/reporting/data/mockReports';
import { Badge, EmptyState, toneForStatus, decodeEntities } from '../ui';
import { AreaCircle, FitView, MapLegend, TILE_ATTRIBUTION, TILE_URL, areaText } from '../ui/MapParts';
import { pick, t } from '../i18n';

type Layer = 'school' | 'infra' | 'mplads' | 'booth' | 'court' | 'issue';

export interface MapGeoEntity {
  id: string;
  layer: Layer;
  title: string;
  titleHi?: string;
  /** Interface text about the record (translated). */
  subtitle?: string;
  /** The record's own place or landmark, shown as published. */
  place?: string;
  status: string;
  pinCode: string;
  /** An exact point only when the record carries its own coordinates; otherwise somewhere in the PIN. */
  placement: Placement;
  href: string;
  metricLabel?: string;
  metricValue?: string;
}

/** Marker colours mirror the categorical --viz tokens. */
const LAYERS: Record<Layer, { label: string; color: string }> = {
  school: { label: 'Schools', color: '#1b46a8' },
  infra: { label: 'Public works', color: '#e2600c' },
  mplads: { label: 'MP/MLA works', color: '#0d7a84' },
  booth: { label: 'Polling booths', color: '#12774a' },
  court: { label: 'Courts', color: '#7440b5' },
  issue: { label: 'Citizen reports', color: '#bf2f52' },
};

const HUBS = [
  { pin: '110001', name: 'New Delhi' },
  { pin: '110054', name: 'Tis Hazari' },
  { pin: '250001', name: 'Meerut' },
  { pin: '440001', name: 'Nagpur' },
  { pin: '560001', name: 'Bengaluru' },
];

/** Moves the view to the selected record: its point, or the PIN area when it has no exact location. */
function FocusOn({ entity, area }: { entity: MapGeoEntity | null; area: PinArea | null }) {
  const map = useMap();
  useEffect(() => {
    if (!entity) return;
    if (entity.placement.kind === 'exact') map.setView([entity.placement.lat, entity.placement.lng], Math.max(map.getZoom(), 15), { animate: true });
    else if (area) map.fitBounds(circleBounds(area, area.radiusKm), { padding: [24, 24], animate: true });
  }, [map, entity, area]);
  return null;
}

export function MapExplorer() {
  const [params, setParams] = useSearchParams();
  const { selectedPin, setSelectedPin } = usePin();
  const pin = isValidIndianPincode(params.get('pin') || '') ? (params.get('pin') as string) : selectedPin || '110001';
  const [draft, setDraft] = useState(pin);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({ school: true, infra: true, mplads: true, booth: true, court: true, issue: true });
  const [selected, setSelected] = useState<MapGeoEntity | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [recenter, setRecenter] = useState(0);

  useEffect(() => {
    setDraft(pin);
    setSelected(null);
    setSelectedPin(pin);
  }, [pin, setSelectedPin]);

  // The PIN as an area around its post offices (India Post directory); its postal district if the
  // directory has no location for it. Nothing is placed at an invented point.
  const dir = usePinRecord(pin);
  const area = dir.status === 'loading' ? null : pinArea(pin, dir.record);
  const loc = resolvePincode(pin);
  const { records, isLoading } = useCatalog(pin);

  const entities = useMemo<MapGeoEntity[]>(() => {
    const list: MapGeoEntity[] = [];
    records.forEach((r) => {
      const layer: Layer = r.moduleId === 'school' ? 'school' : 'infra';
      list.push({
        id: r.id,
        layer,
        title: r.titleEnglish,
        titleHi: r.titleHindi,
        place: `${r.location.district}, ${r.location.state}`,
        status: r.status,
        pinCode: r.location.pinCode,
        placement: { kind: 'area' },
        href: layer === 'school' ? `/schools/${r.id}` : `/module/infra?pin=${r.location.pinCode}`,
        metricLabel: 'Ground truth',
        metricValue: `${r.groundTruthScore}/100`,
      });
    });
    getAllWorks({ pinCode: pin }).forEach((w) => {
      list.push({
        id: w.id,
        layer: 'mplads',
        title: w.workTitle,
        titleHi: w.workTitleHi,
        subtitle: `Recommended by ${w.representativeName}`,
        status: w.status,
        pinCode: w.pinCode,
        placement: placeRecord({ lat: w.latitude, lng: w.longitude }, area),
        href: `/mplads/projects/${w.id}`,
        metricLabel: 'Sanctioned',
        metricValue: `₹${w.sanctionCostLakhs} lakh`,
      });
    });
    getAllBooths({ pinCode: pin }).forEach((b) => {
      list.push({
        id: b.id,
        layer: 'booth',
        title: `Booth ${b.stationNumber}: ${b.buildingName}`,
        titleHi: b.buildingNameHi,
        subtitle: `BLO ${b.blo.name}`,
        status: b.facilities.wheelchairRamp ? 'Ramp available' : 'No ramp',
        pinCode: b.pinCode,
        placement: placeRecord({ lat: b.latitude, lng: b.longitude }, area),
        href: `/booth/${b.id}`,
        metricLabel: 'Electors',
        metricValue: b.totalElectors.toLocaleString('en-IN'),
      });
    });
    getAllCourts({ pinCode: pin }).forEach((c) => {
      list.push({
        id: c.id,
        layer: 'court',
        title: c.complexName,
        titleHi: c.complexNameHi,
        subtitle: c.courtType,
        place: c.district,
        status: `${c.vacancyPercentage}% judge posts vacant`,
        pinCode: c.pinCode,
        placement: placeRecord({ lat: c.latitude, lng: c.longitude }, area),
        href: `/courts/${c.id}`,
        metricLabel: 'Pending cases',
        metricValue: c.totalPendingCases.toLocaleString('en-IN'),
      });
    });
    MOCK_CITIZEN_REPORTS.filter((r) => r.location.pinCode === pin).forEach((r) => {
      list.push({
        id: r.id,
        layer: 'issue',
        title: decodeEntities(r.title),
        subtitle: r.category,
        place: r.location.landmark,
        status: r.moderationState,
        pinCode: r.location.pinCode,
        placement: placeRecord(r.location, area),
        href: `/reports/${r.id}`,
        metricLabel: 'Upvotes',
        metricValue: String(r.upvotes),
      });
    });
    return list;
  }, [records, pin, area]);

  const counts = useMemo(() => {
    const c = {} as Record<Layer, number>;
    (Object.keys(LAYERS) as Layer[]).forEach((l) => (c[l] = entities.filter((e) => e.layer === l).length));
    return c;
  }, [entities]);

  const visible = entities.filter((e) => layers[e.layer]);
  const exact = visible.filter((e): e is MapGeoEntity & { placement: { kind: 'exact'; lat: number; lng: number } } => e.placement.kind === 'exact');
  const inArea = visible.length - exact.length;

  const submit = (e?: FormEvent, value = draft) => {
    e?.preventDefault();
    if (isValidIndianPincode(value)) setParams({ pin: value });
  };

  return (
    <div className={`map-page view-${mobileView}`}>
      <aside className="map-panel" aria-label="Map controls and results">
        <div className="map-panel-head">
          <h1 className="card-title" style={{ fontSize: 'var(--text-xl)' }}>Map</h1>
          <p className="tiny muted">
            PIN {pin} ·{' '}
            <span translate="no">
              {loc.district}, {loc.state}
            </span>
          </p>
          <form onSubmit={submit} className="cluster" style={{ marginTop: 'var(--s-3)', flexWrap: 'nowrap' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <Search size={16} aria-hidden="true" />
              <input className="input num" inputMode="numeric" maxLength={6} value={draft} onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))} aria-label="PIN code" placeholder="PIN code" />
            </div>
            <button type="submit" className="btn btn-primary">Go</button>
          </form>
          <div className="cluster" style={{ marginTop: 'var(--s-3)' }}>
            {HUBS.map((h) => (
              <button key={h.pin} type="button" className="chip" aria-pressed={pin === h.pin} onClick={() => submit(undefined, h.pin)} style={{ height: 28, fontSize: 'var(--text-xs)' }}>
                {h.name}
              </button>
            ))}
          </div>
        </div>

        <div className="map-layers">
          <div className="spread" style={{ marginBottom: 'var(--s-2)' }}>
            <span className="label cluster" style={{ gap: 6 }}><Layers size={14} aria-hidden="true" /> Layers</span>
            <button type="button" className="link small" onClick={() => setLayers({ school: true, infra: true, mplads: true, booth: true, court: true, issue: true })}>
              Show all
            </button>
          </div>
          <div className="cluster">
            {(Object.keys(LAYERS) as Layer[]).map((l) => (
              <button key={l} type="button" className="chip layer-chip" aria-pressed={layers[l]} onClick={() => setLayers((cur) => ({ ...cur, [l]: !cur[l] }))}>
                <span className="layer-swatch" style={{ background: LAYERS[l].color }} aria-hidden="true" />
                {LAYERS[l].label}
                <span className="chip-count">{counts[l]}</span>
              </button>
            ))}
          </div>
          <MapLegend area={area} className="map-panel-legend" />
        </div>

        <div className="map-results" aria-live="polite">
          {isLoading ? (
            <div className="list">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="list-row"><span className="skeleton" style={{ height: 14, flex: 1 }} /></div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState icon={SearchX} title="Nothing on these layers" text="Turn on more layers or try another PIN." />
          ) : (
            <div className="list">
              {visible.map((e) => (
                <button
                  key={`${e.layer}-${e.id}`}
                  type="button"
                  className={`list-row map-result ${selected?.id === e.id ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelected(e);
                    setMobileView('map');
                  }}
                >
                  <span className="layer-swatch" style={{ background: LAYERS[e.layer].color, marginTop: 6 }} aria-hidden="true" />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="strong clamp-2" style={{ display: 'block' }} translate="no">{pick(e.title, e.titleHi)}</span>
                    <span className="tiny muted truncate" style={{ display: 'block' }}>
                      {LAYERS[e.layer].label}
                      {e.subtitle && <> · {e.subtitle}</>}
                      {e.place && <> · <span translate="no">{e.place}</span></>}
                    </span>
                    <span className="loc-tag" style={{ marginTop: 4 }} data-placement={e.placement.kind}>
                      {e.placement.kind === 'exact' ? t('Exact location') : t('In PIN area')}
                    </span>
                  </span>
                  {e.metricValue && <span className="tiny num muted" style={{ whiteSpace: 'nowrap' }}>{e.metricValue}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="map-panel-foot">
          <Link to={`/pin/${pin}`} className="btn btn-secondary btn-block">
            Open area dashboard <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <section className="map-canvas" aria-label={`Map of PIN ${pin}`}>
        <MapContainer
          center={area ? [area.lat, area.lng] : INDIA_VIEW.center}
          zoom={area ? 13 : INDIA_VIEW.zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
          <FitView areas={area ? [area] : []} points={exact.map((e) => e.placement)} nonce={recenter} />
          <FocusOn entity={selected} area={area} />
          {area && (
            <AreaCircle area={area} emphasis={selected?.placement.kind === 'area'}>
              <strong>PIN {pin}</strong>
              <br />
              <span style={{ fontSize: 12 }}>{areaText(area)}</span>
              {inArea > 0 && (
                <>
                  <br />
                  <span style={{ fontSize: 12 }}>{t(inArea === 1 ? '{n} record here has no published exact location; it is in the list.' : '{n} records here have no published exact location; they are in the list.', { n: inArea })}</span>
                </>
              )}
            </AreaCircle>
          )}
          {exact.map((e) => (
            <CircleMarker
              key={`${e.layer}-${e.id}`}
              center={[e.placement.lat, e.placement.lng]}
              radius={selected?.id === e.id ? 11 : 8}
              className="map-point"
              pathOptions={{ color: '#ffffff', weight: 2, fillColor: LAYERS[e.layer].color, fillOpacity: 0.92 }}
              eventHandlers={{ click: () => setSelected(e) }}
            >
              <Popup>
                <strong translate="no">{pick(e.title, e.titleHi)}</strong>
                <br />
                <span style={{ fontSize: 12 }}>
                  {e.subtitle}
                  {e.subtitle && e.place && ' · '}
                  {e.place && <span translate="no">{e.place}</span>}
                </span>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {dir.status === 'missing' && !area && (
          <div className="callout callout-info map-notice" role="status">
            <span>{t('PIN {pin} has no location in the India Post directory, so the map shows all of India.', { pin })}</span>
          </div>
        )}

        <button type="button" className="btn btn-secondary btn-icon map-recenter" onClick={() => {
            setSelected(null);
            setRecenter((n) => n + 1);
          }} aria-label="Show the whole PIN area" title="Show the whole PIN area">
          <Crosshair size={17} aria-hidden="true" />
        </button>

        {selected && (
          <div className="card map-selection" role="dialog" aria-label={pick(selected.title, selected.titleHi)}>
            <div className="card-body stack-sm">
              <div className="spread" style={{ alignItems: 'flex-start' }}>
                <span className="tiny strong" style={{ color: LAYERS[selected.layer].color }}>{LAYERS[selected.layer].label}</span>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelected(null)} aria-label="Close">
                  <X size={15} aria-hidden="true" />
                </button>
              </div>
              <div className="card-title" style={{ fontSize: 'var(--text-md)' }}>{pick(selected.title, selected.titleHi)}</div>
              <div className="small muted">
                {selected.subtitle}
                {selected.subtitle && selected.place && ' · '}
                {selected.place && <span translate="no">{selected.place}</span>}
              </div>
              <p className="tiny muted">
                {selected.placement.kind === 'exact'
                  ? t('Shown at the location published with this record.')
                  : t('This record has no published exact location, so it is shown as the PIN area.')}
              </p>
              <div className="spread">
                <Badge tone={toneForStatus(selected.status)}>{selected.status}</Badge>
                {selected.metricValue && (
                  <span className="small">
                    <span className="muted">{selected.metricLabel}</span>
                    <span className="muted">: </span>
                    <strong className="num">{selected.metricValue}</strong>
                  </span>
                )}
              </div>
              <Link to={selected.href} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'var(--s-2)' }}>
                Open record <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <div className="map-switch segmented" role="group" aria-label="View">
        <button type="button" aria-pressed={mobileView === 'map'} onClick={() => setMobileView('map')}>
          <MapIcon size={14} aria-hidden="true" /> Map
        </button>
        <button type="button" aria-pressed={mobileView === 'list'} onClick={() => setMobileView('list')}>
          <List size={14} aria-hidden="true" /> List ({visible.length})
        </button>
      </div>
    </div>
  );
}
