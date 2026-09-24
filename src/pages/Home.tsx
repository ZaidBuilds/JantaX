import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  LocateFixed,
  ArrowRight,
  MapPin,
  Scale,
  Share2,
  FileSearch,
  ShieldCheck,
  EyeOff,
  Landmark,
  Link2,
  ImageOff,
} from 'lucide-react';
import { api, type PincodeInfo } from '../core/services/api';
import { usePin } from '../core/context/PinContext';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getBottleneckLensesForPin } from '../core/services/bottleneckService';
import { getStoredReports } from '../modules/reporting/services/reportingService';
import { Badge, ClaimReality, ModuleIcon, MODULE_GROUPS, getModule, moduleHref, reportForDisplay, toneForStatus } from '../ui';

const POPULAR = [
  { pin: '110001', city: 'New Delhi' },
  { pin: '400001', city: 'Mumbai' },
  { pin: '560001', city: 'Bengaluru' },
  { pin: '226001', city: 'Lucknow' },
  { pin: '800001', city: 'Patna' },
  { pin: '250001', city: 'Meerut' },
];

function AreaPreview({ pin }: { pin: string }) {
  const [info, setInfo] = useState<PincodeInfo | null>(null);
  useEffect(() => {
    let alive = true;
    setInfo(null);
    api.getPincode(pin).then((i) => alive && setInfo(i));
    return () => {
      alive = false;
    };
  }, [pin]);
  const loc = resolvePincode(pin);
  const lens = useMemo(() => getBottleneckLensesForPin(pin).lenses.find((l) => l.severity === 'CRITICAL') || getBottleneckLensesForPin(pin).lenses[0], [pin]);
  const counts = info
    ? [
        { label: 'Schools', value: info.counts.schools },
        { label: 'Public works', value: info.counts.infraProjects },
        { label: 'Health centres', value: info.counts.hospitals },
        { label: 'Grievances', value: info.counts.grievances },
      ]
    : null;

  return (
    <div className="card area-preview">
      <div className="card-body">
        <div className="spread">
          <div>
            <div className="tiny muted">Your area</div>
            <div className="area-preview-pin">
              <span className="num">{pin}</span>
              <span>{loc.district}, {loc.state}</span>
            </div>
          </div>
          <Link to={`/pin/${pin}`} className="btn btn-soft btn-sm">
            Open <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="area-preview-counts">
          {(counts || [0, 1, 2, 3].map(() => null)).map((c, i) => (
            <div key={i}>
              <div className="stat-value num" style={{ fontSize: 'var(--text-xl)' }}>
                {c ? c.value : <span className="skeleton" style={{ display: 'inline-block', width: 28, height: 22 }} />}
              </div>
              <div className="tiny muted">{c ? c.label : ' '}</div>
            </div>
          ))}
        </div>
        {lens && (
          <div className="stack-sm" style={{ marginTop: 'var(--s-4)' }}>
            <div className="spread">
              <span className="small strong">{lens.title}</span>
              <Badge tone={lens.severity === 'CRITICAL' ? 'bad' : 'warn'}>{lens.severity === 'CRITICAL' ? 'Needs attention' : 'Watch'}</Badge>
            </div>
            <ClaimReality
              claim={<p className="tiny" style={{ color: 'var(--ink)' }}>{lens.officialClaim}</p>}
              reality={<p className="tiny" style={{ color: 'var(--ink)' }}>{lens.auditReality}</p>}
            />
          </div>
        )}
      </div>
      {lens && (
        <div className="card-foot">
          <span>{lens.source}</span>
          <span>{lens.asOfDate}</span>
        </div>
      )}
    </div>
  );
}

function ReportThumb({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="report-thumb report-thumb-empty" aria-hidden="true">
        <ImageOff size={18} />
      </div>
    );
  }
  return <img className="report-thumb" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

export function Home() {
  const navigate = useNavigate();
  const { selectedPin, setSelectedPin, detectLocation, isDetecting, detectionError } = usePin();
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const reports = useMemo(
    () =>
      getStoredReports()
        .filter((r) => /approved|published/i.test(r.moderationState))
        .slice(0, 3)
        .map(reportForDisplay),
    []
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) {
      setError('Type a PIN code, or the name of a school, project or contractor.');
      return;
    }
    setError('');
    if (/^\d+$/.test(value)) {
      if (!isValidIndianPincode(value)) {
        setError('A PIN code has six digits and does not start with 0.');
        return;
      }
      setSelectedPin(value);
      navigate(`/pin/${value}`);
      return;
    }
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const locate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1 className="home-title">
              See what your government records say about <span className="home-title-em">your PIN code</span>.
            </h1>
            <p className="home-lede">
              Schools, clinics, roads, ration shops and courts. Official data beside what citizens found on the ground.
            </p>

            <form role="search" onSubmit={submit} className="home-search" noValidate>
              <div className="search-field">
                <Search size={20} aria-hidden="true" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="PIN code, school, project or contractor"
                  aria-label="Search by PIN code or name"
                  aria-invalid={!!error || undefined}
                  aria-describedby="home-search-help"
                />
                <button type="submit" className="btn btn-primary btn-lg">
                  Search
                </button>
              </div>
              <div id="home-search-help" className={error ? 'error-text' : 'hint'} style={{ marginTop: 'var(--s-2)' }}>
                {error || detectionError || 'Tip: press / anywhere to jump to search.'}
              </div>
            </form>

            <div className="home-quick">
              <button type="button" className="btn btn-secondary" onClick={locate} disabled={isDetecting}>
                <LocateFixed size={16} aria-hidden="true" />
                {isDetecting ? 'Finding your area…' : 'Use my location'}
              </button>
              <div className="cluster" aria-label="Popular PIN codes">
                {POPULAR.map((p) => (
                  <Link key={p.pin} to={`/pin/${p.pin}`} className="chip" onClick={() => setSelectedPin(p.pin)}>
                    <span className="num strong">{p.pin}</span>
                    <span className="muted">{p.city}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="home-hero-aside">
            <AreaPreview pin={selectedPin} />
          </div>
        </div>
      </section>

      <div className="page" style={{ paddingTop: 0 }}>
        <section className="section" aria-labelledby="questions-h">
          <div className="section-head">
            <div>
              <h2 id="questions-h" className="section-title">Start with a question</h2>
              <p className="section-sub">Eighteen modules, each tied to a public dataset and a named office.</p>
            </div>
            <Link to="/explore" className="link small">
              Browse all modules <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid-3">
            {MODULE_GROUPS.map((g) => (
              <div key={g.id} className="card">
                <div className="card-body" style={{ paddingBottom: 'var(--s-3)' }}>
                  <h3 className="card-title">{g.title}</h3>
                  <p className="card-sub">{g.description}</p>
                </div>
                <div className="list">
                  {g.modules.map((id) => {
                    const m = getModule(id);
                    if (!m) return null;
                    return (
                      <Link key={id} to={moduleHref(id, selectedPin)} className="list-row" style={{ padding: '10px var(--s-5)' }}>
                        <ModuleIcon id={id} size="sm" />
                        <span className="small" style={{ flex: 1, color: 'var(--ink)', fontWeight: 500 }}>{m.shortName}</span>
                        <ArrowRight size={14} className="muted" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="how-h">
          <h2 id="how-h" className="section-title" style={{ marginBottom: 'var(--s-4)' }}>How it works</h2>
          <ol className="how-strip">
            <li>
              <span className="icon-tile" style={{ ['--tile' as string]: 'var(--brand-ink)' }}><MapPin size={20} aria-hidden="true" /></span>
              <div>
                <h3>Open your PIN</h3>
                <p>We resolve it to your district and pull every matching record from UDISE+, HMIS, PMGSY, RERA, NJDG and more.</p>
              </div>
            </li>
            <li>
              <span className="icon-tile" style={{ ['--tile' as string]: 'var(--accent)' }}><Scale size={20} aria-hidden="true" /></span>
              <div>
                <h3>Compare claim and reality</h3>
                <p>Each official figure sits next to audit findings and verified citizen check-ins, with the source and date.</p>
              </div>
            </li>
            <li>
              <span className="icon-tile" style={{ ['--tile' as string]: 'var(--good)' }}><Share2 size={20} aria-hidden="true" /></span>
              <div>
                <h3>Act on it</h3>
                <p>File a photo report, draft an RTI or a CPGRAMS grievance, or share the evidence with your ward.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="section home-reports" aria-labelledby="reports-h">
          <div>
            <div className="section-head">
              <div>
                <h2 id="reports-h" className="section-title">Latest from citizens</h2>
                <p className="section-sub">Published after moderation. Faces and number plates are blurred.</p>
              </div>
              <Link to="/reports" className="link small">
                All reports <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="card list">
              {reports.map((r) => (
                <Link key={r.id} to={`/reports/${r.id}`} className="list-row report-row">
                  <ReportThumb src={r.evidence.find((e) => e.mediaType === 'image')?.url} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="strong clamp-2">{r.title}</div>
                    <div className="tiny muted" style={{ marginTop: 2 }}>
                      {r.category} · PIN {r.location.pinCode} · {r.location.district}
                    </div>
                  </div>
                  <Badge tone={toneForStatus(r.moderationState)} className="hide-mobile">Published</Badge>
                </Link>
              ))}
            </div>
          </div>
          <aside className="card card-pad-lg home-cta">
            <span className="icon-tile lg" style={{ ['--tile' as string]: 'var(--accent)' }}>
              <FileSearch size={24} aria-hidden="true" />
            </span>
            <h3 className="card-title" style={{ fontSize: 'var(--text-xl)' }}>Found something the records miss?</h3>
            <p className="small" style={{ color: 'var(--ink-2)' }}>
              A dated photo from you can confirm or dispute an official claim. It takes about two minutes.
            </p>
            <Link to="/report-issue" className="btn btn-primary btn-block">Report an issue</Link>
          </aside>
        </section>

        <section className="section" aria-label="Our principles">
          <ul className="principles">
            <li><Link2 size={18} aria-hidden="true" /><div><strong>Every number is sourced</strong><span>Each figure links to the public document it came from.</span></div></li>
            <li><Landmark size={18} aria-hidden="true" /><div><strong>Non-partisan</strong><span>We place claims and audits side by side. We do not editorialise.</span></div></li>
            <li><EyeOff size={18} aria-hidden="true" /><div><strong>Anonymous by default</strong><span>Reporters are never named publicly. Photo metadata is stripped.</span></div></li>
            <li><ShieldCheck size={18} aria-hidden="true" /><div><strong>Open corrections</strong><span>Anyone can challenge a record. Every change is logged.</span></div></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
