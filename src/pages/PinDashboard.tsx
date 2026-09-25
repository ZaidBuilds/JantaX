import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import {
  Star,
  Share2,
  Map as MapIcon,
  GraduationCap,
  Construction,
  Hospital,
  Home as HomeIcon,
  Wheat,
  MessageSquareWarning,
  Megaphone,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  FileSearch,
 FlaskConical } from 'lucide-react';
import { api, type ApiRecord, type PincodeInfo } from '../core/services/api';
import { usePin } from '../core/context/PinContext';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getCoordinateForPin } from '../core/utils/pinCoordinates';
import { usePinRecord } from '../core/services/pinDirectory';
import { PostOfficesCard } from '../ui/PostOffices';
import { getBottleneckLensesForPin, type BottleneckLens } from '../core/services/bottleneckService';
import { MOCK_CITIZEN_REPORTS } from '../modules/reporting/data/mockReports';
import {
  Badge,
  Breadcrumbs,
  ClaimReality,
  EmptyState,
  ModuleIcon,
  MODULE_GROUPS,
  PinInput,
  getModule,
  moduleHref,
  toneForScore,
  toneForStatus,
  reportForDisplay,
  useShare,
  useToast,
} from '../ui';

const COUNT_TILES = [
  { key: 'schools', label: 'Government schools', icon: GraduationCap, module: 'school' },
  { key: 'infraProjects', label: 'Public works', icon: Construction, module: 'infra' },
  { key: 'hospitals', label: 'Health facilities', icon: Hospital, module: 'hospital' },
  { key: 'reraProjects', label: 'RERA projects', icon: HomeIcon, module: 'rera' },
  { key: 'pdsShops', label: 'Ration shops', icon: Wheat, module: 'ration' },
  { key: 'grievances', label: 'Open grievances', icon: MessageSquareWarning, module: 'grievance' },
] as const;

function severityTone(s: BottleneckLens['severity']) {
  return s === 'CRITICAL' ? 'bad' : s === 'WARNING' ? 'warn' : 'neutral';
}

function severityLabel(s: BottleneckLens['severity']) {
  return s === 'CRITICAL' ? 'Needs attention' : s === 'WARNING' ? 'Watch' : 'On record';
}

function tidy(text: string) {
  return text.replace(/\s+[-–]\s+/g, ' · ');
}

function recordHref(r: ApiRecord) {
  return r.moduleId === 'school' ? `/schools/${r.id}` : `/module/infra?pin=${r.location.pinCode}`;
}

/** `choose` renders the PIN picker (used by /pin and /pin/new) instead of a dashboard. */
export function PinDashboard({ choose = false }: { choose?: boolean }) {
  const { pinCode } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { selectedPin, setSelectedPin, isFollowing, toggleFollow } = usePin();
  const share = useShare();
  const toast = useToast();

  const pin = pinCode || params.get('pin') || selectedPin;
  const valid = isValidIndianPincode(pin);
  const loc = resolvePincode(pin);
  const directory = usePinRecord(pin);

  const [info, setInfo] = useState<PincodeInfo | null>(null);
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!valid) return;
    setSelectedPin(pin);
    let alive = true;
    setLoading(true);
    Promise.all([api.getPincode(pin), api.getRecords(pin)])
      .then(([i, r]) => {
        if (!alive) return;
        setInfo(i);
        const all = [...(r.records.school || []), ...(r.records.infra || [])];
        setRecords(all.filter((rec, idx) => all.findIndex((x) => x.id === rec.id) === idx));
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [pin, valid, setSelectedPin]);

  const lenses = useMemo(() => (valid ? getBottleneckLensesForPin(pin).lenses : []), [pin, valid]);
  const reports = useMemo(() => {
    const local = MOCK_CITIZEN_REPORTS.filter((r) => r.location.pinCode === pin);
    const nearby = MOCK_CITIZEN_REPORTS.filter((r) => r.location.pinCode.slice(0, 3) === pin.slice(0, 3) && r.location.pinCode !== pin);
    return [...local, ...nearby].slice(0, 4).map(reportForDisplay);
  }, [pin]);
  const dirCoord = directory.record && directory.record.lat !== null && directory.record.lng !== null ? { lat: directory.record.lat, lng: directory.record.lng } : null;
  const coord = dirCoord ?? getCoordinateForPin(pin);
  const following = isFollowing(pin);

  if (choose || !valid) {
    return (
      <div className="page page-narrow">
        <Breadcrumbs items={[{ label: 'PIN code' }]} />
        <div className="card card-pad-lg">
          <h1 className="page-title" style={{ fontSize: 'var(--text-2xl)' }}>Open a PIN code</h1>
          <p className="page-lede" style={{ marginBottom: 'var(--s-5)' }}>
            {pinCode && !choose ? <>“{pinCode}” is not a valid Indian PIN code. </> : null}
            Enter the six-digit PIN printed on your address.
          </p>
          <PinInput onSubmit={(p) => navigate(`/pin/${p}`)} submitLabel="Open dashboard" />
        </div>
      </div>
    );
  }

  // India Post's directory is the authority for where a PIN is; the records API and prefix table are fallbacks.
  const place = directory.record ? `${directory.record.district}, ${directory.record.state}` : info ? `${info.district}, ${info.state}` : `${loc.district}, ${loc.state}`;

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: `PIN ${pin}` }]} />

      <header className="pin-hero">
        <div className="pin-hero-main">
          <div className="eyebrow">Area dashboard</div>
          <h1 className="pin-hero-title">
            <span className="num">{pin}</span>
            <span className="pin-hero-place">{place}</span>
          </h1>
          <div className="cluster" style={{ marginTop: 'var(--s-3)' }}>
            {loc.region && <Badge>{loc.region} India</Badge>}
            {info?.areaType && <Badge>{info.areaType}</Badge>}
            {loc.stateCode && <Badge tone="brand">{loc.stateCode}</Badge>}
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className={`btn ${following ? 'btn-soft' : 'btn-secondary'}`}
            aria-pressed={following}
            onClick={() => {
              toggleFollow(pin);
              toast(following ? `Stopped following ${pin}` : `Following ${pin}`);
            }}
          >
            <Star size={16} aria-hidden="true" fill={following ? 'currentColor' : 'none'} />
            {following ? 'Following' : 'Follow'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => share({ title: `JantaX: PIN ${pin}`, text: `Public records for ${place}` })}>
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
          <Link to={`/maps?pin=${pin}`} className="btn btn-secondary">
            <MapIcon size={16} aria-hidden="true" />
            Map
          </Link>
        </div>
      </header>

      <section aria-label="Records counted in this PIN" className="pin-counts">
        {COUNT_TILES.map(({ key, label, icon: Icon, module }) => (
          <Link key={key} to={moduleHref(module, pin)} className="pin-count">
            <span className="pin-count-top">
              <Icon size={16} aria-hidden="true" />
              {label}
            </span>
            <span className="pin-count-value num">
              {loading || !info ? <span className="skeleton" style={{ display: 'inline-block', width: 36, height: 26 }} /> : info.counts[key]}
            </span>
          </Link>
        ))}
      </section>
      {info?.sample && (
        <p className="tiny muted" style={{ marginTop: 'var(--s-2)' }}>
          Sample counts: the records service is offline, so these numbers are generated, not counted.
        </p>
      )}

      <div className="split" style={{ marginTop: 'var(--s-8)' }}>
        <div className="stack" style={{ gap: 'var(--s-8)' }}>
          <section aria-labelledby="claims-h">
            <div className="section-head">
              <div>
                <h2 id="claims-h" className="section-title">What the records say, and what was found</h2>
                <p className="section-sub">How JantaX will set official claims against audits, live feeds and citizen checks.</p>
              </div>
            </div>
            <div className="data-status data-status-sample" style={{ marginTop: 0, marginBottom: 'var(--s-4)', maxWidth: 'none' }}>
              <FlaskConical size={14} aria-hidden="true" />
              <span>
                <strong>Sample examples.</strong> These cards are templates built from sample data, not records for PIN {pin}. Real ones appear as each module's official feed is connected.
              </span>
            </div>
            <div className="stack">
              {lenses.map((lens) => (
                <article key={lens.id} className="card">
                  <div className="card-body stack-sm">
                    <div className="spread" style={{ alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 className="card-title">{lens.title}</h3>
                        <p className="card-sub">{tidy(lens.noun)}</p>
                      </div>
                      <Badge tone={severityTone(lens.severity)}>{severityLabel(lens.severity)}</Badge>
                    </div>
                    <ClaimReality
                      claim={<p className="small" style={{ color: 'var(--ink)' }}>{lens.officialClaim}</p>}
                      reality={<p className="small" style={{ color: 'var(--ink)' }}>{lens.auditReality}</p>}
                    />
                  </div>
                  <div className="card-foot">
                    <span>
                      {lens.source} · {lens.asOfDate}
                    </span>
                    <span>{lens.confidenceBadge}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="records-h">
            <div className="section-head">
              <div>
                <h2 id="records-h" className="section-title">Schools and works in this PIN</h2>
                <p className="section-sub">Ground-truth score combines official data with verified citizen check-ins.</p>
              </div>
              <Link to={`/search?q=${pin}`} className="link small">
                Search all records <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="card">
              {loading ? (
                <div className="list">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="list-row">
                      <span className="skeleton" style={{ width: 32, height: 32 }} />
                      <span className="skeleton" style={{ flex: 1, height: 16 }} />
                    </div>
                  ))}
                </div>
              ) : records.length === 0 ? (
                <EmptyState icon={FileSearch} title="No school or works records yet" text="We have not matched any school or public-works record to this PIN." />
              ) : (
                <div className="list">
                  {records.map((r) => (
                    <Link key={r.id} to={recordHref(r)} className="list-row">
                      <ModuleIcon id={r.moduleId} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="strong truncate">{r.titleEnglish}</div>
                        <div className="tiny muted truncate" lang="hi">{r.titleHindi}</div>
                      </div>
                      <Badge tone={toneForStatus(r.status)} className="hide-mobile">{r.status}</Badge>
                      <span className={`score text-${toneForScore(r.groundTruthScore)}`} style={{ minWidth: 48, justifyContent: 'flex-end' }}>
                        {r.groundTruthScore}
                        <small>/100</small>
                      </span>
                      <ChevronRight size={16} className="muted" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="reports-h">
            <div className="section-head">
              <div>
                <h2 id="reports-h" className="section-title">Citizen reports nearby</h2>
                <p className="section-sub">Photo evidence filed by residents, reviewed before publishing.</p>
              </div>
              <Link to={`/reports?pin=${pin}`} className="link small">
                All reports <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="card">
              {reports.length === 0 ? (
                <EmptyState
                  icon={Megaphone}
                  title="No reports filed here yet"
                  text="Seen a broken road, a closed clinic or an empty ration shop? File the first report for this PIN."
                  action={<Link to={`/report-issue?pin=${pin}`} className="btn btn-primary">Report an issue</Link>}
                />
              ) : (
                <div className="list">
                  {reports.map((r) => (
                    <Link key={r.id} to={`/reports/${r.id}`} className="list-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="strong clamp-2">{r.title}</div>
                        <div className="tiny muted">
                          {r.category} · PIN {r.location.pinCode} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <Badge tone={toneForStatus(r.moderationState)} className="hide-mobile">{r.moderationState}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="stack sticky-aside" style={{ gap: 'var(--s-5)' }}>
          {coord && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 200 }}>
                <MapContainer
                  key={pin}
                  center={[coord.lat, coord.lng]}
                  zoom={11}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  attributionControl={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CircleMarker center={[coord.lat, coord.lng]} radius={10} pathOptions={{ color: '#e2600c', weight: 3, fillOpacity: 0.25 }} />
                </MapContainer>
              </div>
              <div className="card-foot" style={{ borderRadius: 0 }}>
                <span>{dirCoord ? 'Centre of its post offices' : 'Approximate area centre'}</span>
                <Link to={`/maps?pin=${pin}`} className="link">Open full map</Link>
              </div>
            </div>
          )}

          <PostOfficesCard pin={pin} />

          <div className="card card-pad">
            <div className="strong" style={{ marginBottom: 'var(--s-3)' }}>Switch area</div>
            <PinInput key={pin} onSubmit={(p) => navigate(`/pin/${p}`)} submitLabel="Open" id="pin-switch" compact label="PIN code" />
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Every module for {pin}</h2>
            </div>
            <div className="list">
              {MODULE_GROUPS.flatMap((g) => g.modules).map((id) => {
                const m = getModule(id);
                if (!m) return null;
                return (
                  <Link key={id} to={moduleHref(id, pin)} className="list-row" style={{ padding: '10px var(--s-5)' }}>
                    <ModuleIcon id={id} size="sm" />
                    <span className="small" style={{ flex: 1, color: 'var(--ink)' }}>{m.shortName}</span>
                    <ChevronRight size={15} className="muted" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="callout callout-info">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>
              Figures come from public sources and may lag on-ground change. <Link to="/transparency/methodology">Read the methodology</Link>.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
