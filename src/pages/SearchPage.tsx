import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  SlidersHorizontal,
  SearchX,
  History,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  MapPin,
  GraduationCap,
  Construction,
  HardHat,
  Home as HomeIcon,
  Landmark,
  Scale,
  Vote,
  Building,
  CloudFog,
  FileText,
  Hospital,
  Wheat,
  MessageSquareWarning,
  Database,
  type LucideIcon,
} from 'lucide-react';
import { api, type SearchResponse, type SearchResult, type AutocompleteSuggestion } from '../core/services/api';
import { isValidIndianPincode } from '../core/utils/pinResolver';
import { Badge, Breadcrumbs, EmptyState, toneForStatus, useDismiss } from '../ui';

const TYPES: Record<string, { label: string; icon: LucideIcon; tone: string }> = {
  location: { label: 'Areas', icon: MapPin, tone: 'var(--accent)' },
  school: { label: 'Schools', icon: GraduationCap, tone: 'var(--viz-1)' },
  infra: { label: 'Public works', icon: Construction, tone: 'var(--viz-2)' },
  contractor: { label: 'Contractors', icon: HardHat, tone: 'var(--viz-2)' },
  rera: { label: 'RERA projects', icon: HomeIcon, tone: 'var(--viz-6)' },
  mplads: { label: 'MP/MLA works', icon: Landmark, tone: 'var(--viz-6)' },
  court: { label: 'Courts', icon: Scale, tone: 'var(--viz-4)' },
  booth: { label: 'Polling booths', icon: Vote, tone: 'var(--viz-3)' },
  ward: { label: 'Wards', icon: Building, tone: 'var(--viz-4)' },
  station: { label: 'AQI stations', icon: CloudFog, tone: 'var(--viz-8)' },
  authority: { label: 'RTI authorities', icon: FileText, tone: 'var(--viz-1)' },
  hospital: { label: 'Health facilities', icon: Hospital, tone: 'var(--viz-5)' },
  pds: { label: 'Ration shops', icon: Wheat, tone: 'var(--viz-7)' },
  grievance: { label: 'Grievances', icon: MessageSquareWarning, tone: 'var(--viz-5)' },
  issue: { label: 'Citizen reports', icon: MessageSquareWarning, tone: 'var(--viz-5)' },
  source: { label: 'Data sources', icon: Database, tone: 'var(--viz-8)' },
};

const SUGGESTED = ['Narela', 'Meerut', 'Barapullah', 'district court', 'Bengaluru', 'ration'];
const RECENT_KEY = 'jantax.recentSearches';
const PAGE_SIZE = 10;

function loadRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string').slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  try {
    const next = [q, ...loadRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked */
  }
}

function hrefFor(r: SearchResult): string {
  const meta = r.metadata as { href?: string };
  if (meta?.href) return meta.href;
  const pin = r.location?.pincode;
  switch (r.type) {
    case 'school':
      return `/module/school?id=${r.id}`;
    case 'infra':
      return `/projects/${r.id}`;
    case 'contractor':
      return `/contractors/${r.id}`;
    case 'rera':
      return `/rera/projects/${r.id}`;
    case 'hospital':
      return `/module/hospital${pin ? `?pin=${pin}` : ''}`;
    case 'pds':
      return `/module/ration${pin ? `?pin=${pin}` : ''}`;
    case 'grievance':
      return '/module/grievance';
    case 'location':
      return `/pin/${pin || r.id}`;
    default:
      return pin ? `/pin/${pin}` : '/explore';
  }
}

function TypeIcon({ type }: { type: string }) {
  const t = TYPES[type] || TYPES.source;
  const Icon = t.icon;
  return (
    <span className="icon-tile sm" style={{ ['--tile' as string]: t.tone }} aria-hidden="true">
      <Icon size={16} />
    </span>
  );
}

function ResultRow({ r }: { r: SearchResult }) {
  const meta = r.metadata as { status?: string; score?: number; hindi?: string };
  const t = TYPES[r.type] || TYPES.source;
  return (
    <Link to={hrefFor(r)} className="list-row search-result">
      <TypeIcon type={r.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="search-result-title">{r.title}</div>
        {meta?.hindi && <div className="tiny muted truncate" lang="hi">{meta.hindi}</div>}
        <div className="small" style={{ color: 'var(--ink-2)', marginTop: 2 }}>{r.description}</div>
        <div className="source-row" style={{ marginTop: 6 }}>
          <span>{t.label}</span>
          {r.location && (
            <span>
              PIN {r.location.pincode} · {r.location.district}
              {r.location.state && r.location.state !== r.location.district ? `, ${r.location.state}` : ''}
            </span>
          )}
          <span>Source: {r.source.name}</span>
        </div>
      </div>
      <div className="report-row-meta">
        {meta?.status && <Badge tone={toneForStatus(meta.status)}>{meta.status}</Badge>}
        {typeof meta?.score === 'number' && (
          <span className="tiny muted num">Ground truth {meta.score}/100</span>
        )}
      </div>
      <ArrowUpRight size={16} className="muted" aria-hidden="true" />
    </Link>
  );
}

export function SearchPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const pin = params.get('pin') || '';
  const state = params.get('state') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [draft, setDraft] = useState(q);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeSuggest = useCallback(() => setSuggestOpen(false), []);
  useDismiss(boxRef, suggestOpen, closeSuggest);

  useEffect(() => setDraft(q), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setData(null);
      return;
    }
    let alive = true;
    setLoading(true);
    api
      .search({ q, type: type || undefined, pincode: pin || undefined, state: state || undefined, page, limit: PAGE_SIZE })
      .then((r) => alive && setData(r))
      .catch(() => alive && setData({ results: [], pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 }, query: q, filters: {} }))
      .finally(() => alive && setLoading(false));
    saveRecent(q);
    setRecent(loadRecent());
    return () => {
      alive = false;
    };
  }, [q, type, pin, state, page]);

  useEffect(() => {
    const value = draft.trim();
    if (value.length < 2 || value === q) {
      setSuggestions([]);
      return;
    }
    let alive = true;
    const t = window.setTimeout(() => {
      api
        .searchAutocomplete(value)
        .then((r) => alive && setSuggestions(r.suggestions || []))
        .catch(() => alive && setSuggestions([]));
    }, 180);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [draft, q]);

  const setParam = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in updates)) next.delete('page');
    setParams(next);
  };

  const submit = (e?: FormEvent, value = draft) => {
    e?.preventDefault();
    const v = value.trim();
    setSuggestOpen(false);
    if (!v) return;
    if (isValidIndianPincode(v)) {
      navigate(`/pin/${v}`);
      return;
    }
    setParam({ q: v });
  };

  const facets = useMemo(() => {
    const f = (data?.filters as { facets?: Record<string, number> } | undefined)?.facets;
    if (f) return f;
    const counts: Record<string, number> = {};
    data?.results.forEach((r) => (counts[r.type] = (counts[r.type] || 0) + 1));
    return counts;
  }, [data]);

  const total = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const activeFilters = [type && (TYPES[type]?.label || type), pin && `PIN ${pin}`, state].filter(Boolean) as string[];

  const Filters = (
    <div className="stack" style={{ gap: 'var(--s-5)' }}>
      <div>
        <div className="label" style={{ marginBottom: 'var(--s-2)' }}>Type of record</div>
        <div className="stack-sm" role="radiogroup" aria-label="Type of record">
          <button type="button" className={`facet ${!type ? 'is-active' : ''}`} onClick={() => setParam({ type: '' })} role="radio" aria-checked={!type}>
            <span>All types</span>
            <span className="chip-count">{Object.values(facets).reduce((a, b) => a + b, 0) || ''}</span>
          </button>
          {Object.entries(facets)
            .sort((a, b) => b[1] - a[1])
            .map(([t, n]) => (
              <button key={t} type="button" className={`facet ${type === t ? 'is-active' : ''}`} onClick={() => setParam({ type: type === t ? '' : t })} role="radio" aria-checked={type === t}>
                <span>{TYPES[t]?.label || t}</span>
                <span className="chip-count">{n}</span>
              </button>
            ))}
        </div>
      </div>
      <form
        className="field"
        onSubmit={(e) => {
          e.preventDefault();
          const v = (new FormData(e.currentTarget).get('pin') as string) || '';
          setParam({ pin: isValidIndianPincode(v) ? v : '' });
        }}
      >
        <label className="label" htmlFor="filter-pin">PIN code</label>
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          <input id="filter-pin" name="pin" className="input num" inputMode="numeric" maxLength={6} defaultValue={pin} placeholder="Any" key={pin} />
          <button type="submit" className="btn btn-secondary">Apply</button>
        </div>
      </form>
      <div className="field">
        <label className="label" htmlFor="filter-state">State</label>
        <select id="filter-state" className="select" value={state} onChange={(e) => setParam({ state: e.target.value })}>
          <option value="">All states</option>
          {['Delhi', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Bihar', 'Telangana', 'Gujarat', 'Rajasthan', 'Kerala'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {activeFilters.length > 0 && (
        <button type="button" className="btn btn-ghost" onClick={() => setParam({ type: '', pin: '', state: '' })}>
          <X size={15} aria-hidden="true" /> Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <h1 className="page-title" style={{ marginBottom: 'var(--s-5)' }}>Search public records</h1>

      <div ref={boxRef} style={{ position: 'relative', maxWidth: 760 }}>
        <form role="search" onSubmit={submit} className="search-field">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            className="search-field-input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            placeholder="School, project, contractor, court, ward or PIN"
            aria-label="Search public records"
            aria-autocomplete="list"
            aria-controls="search-suggest"
            autoFocus={!q}
          />
          {draft && (
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setDraft('')} aria-label="Clear search">
              <X size={16} aria-hidden="true" />
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-lg">Search</button>
        </form>
        {suggestOpen && suggestions.length > 0 && (
          <div id="search-suggest" className="popover" role="listbox" style={{ left: 0, right: 0, top: 'calc(100% + 6px)' }}>
            {suggestions.map((s, i) => (
              <button
                key={`${s.text}-${i}`}
                type="button"
                role="option"
                aria-selected={false}
                className="menu-item"
                onClick={() => {
                  setDraft(s.text);
                  submit(undefined, s.text);
                }}
              >
                <TypeIcon type={s.type} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="strong truncate" style={{ display: 'block' }}>{s.text}</span>
                  {s.subtitle && <span className="tiny muted truncate" style={{ display: 'block' }}>{s.subtitle}</span>}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!q ? (
        <div className="grid-2" style={{ marginTop: 'var(--s-8)', maxWidth: 760 }}>
          <div className="card card-pad">
            <div className="spread" style={{ marginBottom: 'var(--s-3)' }}>
              <span className="cluster">
                <History size={16} className="muted" aria-hidden="true" />
                <span className="strong">Recent searches</span>
              </span>
              {recent.length > 0 && (
                <button
                  type="button"
                  className="link small"
                  onClick={() => {
                    try {
                      localStorage.removeItem(RECENT_KEY);
                    } catch {
                      /* storage blocked */
                    }
                    setRecent([]);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            {recent.length === 0 ? (
              <p className="small muted">Your searches stay on this device.</p>
            ) : (
              <div className="cluster">
                {recent.map((r) => (
                  <button key={r} type="button" className="chip" onClick={() => setParam({ q: r })}>{r}</button>
                ))}
              </div>
            )}
          </div>
          <div className="card card-pad">
            <div className="strong" style={{ marginBottom: 'var(--s-3)' }}>Try searching for</div>
            <div className="cluster">
              {SUGGESTED.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => setParam({ q: s })}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="split-left" style={{ marginTop: 'var(--s-8)' }}>
          <aside className="hide-tablet sticky-aside">{Filters}</aside>

          <section aria-live="polite" aria-busy={loading}>
            <div className="spread" style={{ marginBottom: 'var(--s-3)', flexWrap: 'wrap' }}>
              <p className="small" style={{ color: 'var(--ink-2)' }}>
                {loading ? 'Searching…' : (
                  <>
                    <strong className="num">{total}</strong> {total === 1 ? 'result' : 'results'} for <strong>“{q}”</strong>
                  </>
                )}
              </p>
              <div className="cluster">
                {activeFilters.map((f) => (
                  <Badge key={f} tone="brand">{f}</Badge>
                ))}
                <button type="button" className="btn btn-secondary btn-sm show-filters" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
                  <SlidersHorizontal size={14} aria-hidden="true" /> Filters
                </button>
              </div>
            </div>
            {filtersOpen && <div className="card card-pad show-filters-panel" style={{ marginBottom: 'var(--s-4)' }}>{Filters}</div>}

            <div className="card">
              {loading && !data ? (
                <div className="list">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="list-row">
                      <span className="skeleton" style={{ width: 32, height: 32 }} />
                      <div style={{ flex: 1 }} className="stack-sm">
                        <span className="skeleton" style={{ height: 14, width: '60%' }} />
                        <span className="skeleton" style={{ height: 12, width: '85%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data && data.results.length > 0 ? (
                <div className="list">
                  {data.results.map((r) => (
                    <ResultRow key={`${r.type}-${r.id}`} r={r} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={SearchX}
                  title={`Nothing found for “${q}”`}
                  text="Check the spelling, search a district or PIN code instead, or remove filters."
                  action={
                    <div className="cluster" style={{ justifyContent: 'center' }}>
                      {activeFilters.length > 0 && (
                        <button type="button" className="btn btn-secondary" onClick={() => setParam({ type: '', pin: '', state: '' })}>Clear filters</button>
                      )}
                      <Link to="/explore" className="btn btn-primary">Browse modules</Link>
                    </div>
                  }
                />
              )}
            </div>

            {totalPages > 1 && (
              <nav className="pager" aria-label="Pagination">
                <button type="button" className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })}>
                  <ChevronLeft size={15} aria-hidden="true" /> Previous
                </button>
                <span className="small muted num">
                  Page {page} of {totalPages}
                </span>
                <button type="button" className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setParam({ page: String(page + 1) })}>
                  Next <ChevronRight size={15} aria-hidden="true" />
                </button>
              </nav>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
