import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Megaphone, ThumbsUp, ImageOff, MapPin, SearchX, X } from 'lucide-react';
import { api, type CitizenReport as ApiReport } from '../core/services/api';
import { getStoredReports } from '../modules/reporting/services/reportingService';
import type { CitizenReport } from '../modules/reporting/types/citizenReport';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { Badge, EmptyState, PageHeader, reportForDisplay, toneForStatus } from '../ui';

const CATEGORIES = ['All', 'Road', 'School', 'Healthcare', 'Water', 'Sanitation', 'Electricity', 'Public works', 'Other'] as const;
const STATUSES = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'review', label: 'Under review' },
] as const;

interface Row {
  id: string;
  title: string;
  category: string;
  pin: string;
  place: string;
  status: string;
  createdAt: string;
  upvotes: number;
  image?: string;
  local: boolean;
}

function fromLocal(r: CitizenReport): Row {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    pin: r.location.pinCode,
    place: [r.location.landmark, r.location.district].filter(Boolean).join(', '),
    status: r.moderationState,
    createdAt: r.createdAt,
    upvotes: r.upvotes,
    image: r.evidence.find((e) => e.mediaType === 'image')?.url,
    local: true,
  };
}

function fromApi(r: ApiReport): Row {
  const loc = resolvePincode(r.pincode || '');
  return {
    id: r.id,
    title: r.description?.slice(0, 90) || r.category || 'Citizen report',
    category: r.category || r.module || 'Other',
    pin: r.pincode,
    place: loc.isValid ? loc.district : '',
    status: r.status,
    createdAt: r.createdAt,
    upvotes: 0,
    local: false,
  };
}

function Thumb({ src }: { src?: string }) {
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

export function ReportsPage() {
  const [params, setParams] = useSearchParams();
  const pin = params.get('pin') || '';
  const category = params.get('category') || 'All';
  const status = params.get('status') || 'all';
  const [pinDraft, setPinDraft] = useState(pin);
  const [remote, setRemote] = useState<Row[]>([]);

  const local = useMemo(() => getStoredReports().map(reportForDisplay).map(fromLocal), []);

  useEffect(() => {
    setPinDraft(pin);
    if (!isValidIndianPincode(pin)) {
      setRemote([]);
      return;
    }
    let alive = true;
    api
      .getReports(pin)
      .then((rows) => alive && setRemote(rows.map(fromApi)))
      .catch(() => alive && setRemote([]));
    return () => {
      alive = false;
    };
  }, [pin]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'All' || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const rows = useMemo(() => {
    const seen = new Set<string>();
    return [...remote, ...local]
      .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
      .filter((r) => !pin || r.pin === pin)
      .filter((r) => category === 'All' || r.category === category)
      .filter((r) => {
        if (status === 'all') return true;
        const s = r.status.toLowerCase();
        return status === 'published' ? /(approved|published|resolved)/.test(s) : /(pending|review|flag|submitted)/.test(s);
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [remote, local, pin, category, status]);

  const loc = isValidIndianPincode(pin) ? resolvePincode(pin) : null;

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Citizen reports' }]}
        title="Citizen reports"
        lede="Photo evidence filed by residents about roads, schools, clinics, water and more. Every report is reviewed before it is published."
        actions={
          <Link to={`/report-issue${pin ? `?pin=${pin}` : ''}`} className="btn btn-primary">
            <Megaphone size={16} aria-hidden="true" />
            Report an issue
          </Link>
        }
      />

      <div className="card card-pad reports-toolbar">
        <form
          className="field"
          onSubmit={(e) => {
            e.preventDefault();
            update('pin', isValidIndianPincode(pinDraft) ? pinDraft : '');
          }}
        >
          <label className="label" htmlFor="reports-pin">PIN code</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
            <div className="input-group" style={{ flex: '1 1 160px', maxWidth: 220 }}>
              <MapPin size={16} aria-hidden="true" />
              <input
                id="reports-pin"
                className="input num"
                inputMode="numeric"
                maxLength={6}
                placeholder="All of India"
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Apply</button>
            {pin && (
              <button type="button" className="btn btn-ghost" onClick={() => update('pin', '')}>
                <X size={15} aria-hidden="true" /> Clear
              </button>
            )}
          </div>
          <span className="hint">{loc ? `${loc.district}, ${loc.state}` : 'Showing reports from every PIN.'}</span>
        </form>
        <div className="field">
          <span className="label">Status</span>
          <div className="segmented" role="group" aria-label="Status">
            {STATUSES.map((s) => (
              <button key={s.id} type="button" aria-pressed={status === s.id} onClick={() => update('status', s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="cluster" role="group" aria-label="Category" style={{ margin: 'var(--s-5) 0 var(--s-4)' }}>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => update('category', c)}>
            {c}
          </button>
        ))}
      </div>

      <p className="small muted" style={{ marginBottom: 'var(--s-3)' }} aria-live="polite">
        {rows.length} {rows.length === 1 ? 'report' : 'reports'}
      </p>

      {rows.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={SearchX}
            title="No reports match these filters"
            text={pin ? `Nobody has filed a matching report for PIN ${pin} yet.` : 'Try another category or status.'}
            action={<Link to={`/report-issue${pin ? `?pin=${pin}` : ''}`} className="btn btn-primary">File the first report</Link>}
          />
        </div>
      ) : (
        <div className="card list">
          {rows.map((r) => (
            <Link key={r.id} to={r.local ? `/reports/${r.id}` : `/reports?pin=${r.pin}`} className="list-row report-row">
              <Thumb src={r.image} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="strong clamp-2">{r.title}</div>
                <div className="tiny muted" style={{ marginTop: 2 }}>
                  {r.category} · PIN {r.pin}
                  {r.place ? ` · ${r.place}` : ''} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="report-row-meta">
                <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                {r.upvotes > 0 && (
                  <span className="tiny muted cluster" style={{ gap: 4 }}>
                    <ThumbsUp size={12} aria-hidden="true" /> {r.upvotes}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
