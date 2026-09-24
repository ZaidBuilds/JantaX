import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Check, X, Minus, SearchX, Columns3, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { api, type ApiRecord } from '../core/services/api';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { Badge, EmptyState, Stat, toneForScore, toneForStatus, useToast } from '../ui';
import { ModuleFrame } from './ModuleFrame';

const SAMPLE_PINS = ['110001', '250001', '560001', '400001', '226001', '800001'];
const LEVELS = ['All', 'Primary', 'Upper Primary', 'Secondary', 'Higher Secondary'];
const PAGE_SIZE = 8;

type Sort = 'score-desc' | 'score-asc' | 'name' | 'ptr';

function ptr(s: ApiRecord) {
  const t = s.officialTeacherCount || 0;
  return t > 0 ? Math.round((s.officialStudentCount || 0) / t) : null;
}

function Facility({ ok, label }: { ok: boolean | undefined; label: string }) {
  const Icon = ok === undefined ? Minus : ok ? Check : X;
  const tone = ok === undefined ? 'neutral' : ok ? 'good' : 'bad';
  return (
    <Badge tone={tone}>
      <Icon size={11} aria-hidden="true" />
      {label}
    </Badge>
  );
}

function toCsv(rows: ApiRecord[]) {
  const head = ['Name', 'UDISE', 'PIN', 'District', 'Level', 'Students', 'Teachers', 'Sanctioned', 'Ground truth score', 'Status'];
  const body = rows.map((s) =>
    [s.titleEnglish, s.udiseCode, s.location.pinCode, s.location.district, s.schoolLevel, s.officialStudentCount, s.officialTeacherCount, s.teachersSanctioned, s.groundTruthScore, s.status]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  return [head.join(','), ...body].join('\n');
}

export function SchoolsDirectory() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const pin = params.get('pin') || '';
  const level = params.get('level') || 'All';
  const sort = (params.get('sort') as Sort) || 'score-desc';
  const [pinDraft, setPinDraft] = useState(pin);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [schools, setSchools] = useState<ApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setPinDraft(pin);
    let alive = true;
    setLoading(true);
    const pins = isValidIndianPincode(pin) ? [pin] : SAMPLE_PINS;
    Promise.all(pins.map((p) => api.getSchools(p).catch(() => [] as ApiRecord[])))
      .then((lists) => {
        if (!alive) return;
        const all = lists.flat();
        setSchools(all.filter((s, i) => all.findIndex((x) => x.id === s.id) === i));
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [pin]);

  useEffect(() => setPage(1), [pin, level, sort, q]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'All') next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = schools.filter((s) => {
      if (level !== 'All' && s.schoolLevel !== level) return false;
      if (!needle) return true;
      return [s.titleEnglish, s.titleHindi, s.udiseCode, s.location.pinCode, s.location.district].join(' ').toLowerCase().includes(needle);
    });
    const byName = (a: ApiRecord, b: ApiRecord) => a.titleEnglish.localeCompare(b.titleEnglish);
    return [...list].sort((a, b) => {
      if (sort === 'name') return byName(a, b);
      if (sort === 'score-asc') return a.groundTruthScore - b.groundTruthScore;
      if (sort === 'ptr') return (ptr(b) ?? 0) - (ptr(a) ?? 0);
      return b.groundTruthScore - a.groundTruthScore;
    });
  }, [schools, level, q, sort]);

  const stats = useMemo(() => {
    const n = filtered.length;
    const avg = n ? Math.round(filtered.reduce((a, s) => a + s.groundTruthScore, 0) / n) : 0;
    const attention = filtered.filter((s) => s.groundTruthScore < 75).length;
    const vacancies = filtered.reduce((a, s) => a + Math.max(0, (s.teachersSanctioned || 0) - (s.officialTeacherCount || 0)), 0);
    const noPower = filtered.filter((s) => s.hasElectricity === false).length;
    return { n, avg, attention, vacancies, noPower };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const loc = isValidIndianPincode(pin) ? resolvePincode(pin) : null;

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id]));

  const download = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `jantax-schools-${pin || 'sample'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Downloaded ${filtered.length} schools`);
  };

  return (
    <ModuleFrame moduleId="school">
      <div className="card card-pad schools-toolbar">
        <form
          className="field"
          onSubmit={(e) => {
            e.preventDefault();
            setParam('pin', isValidIndianPincode(pinDraft) ? pinDraft : '');
          }}
        >
          <label className="label" htmlFor="schools-pin">PIN code</label>
          <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
            <input id="schools-pin" className="input num" style={{ width: 140 }} inputMode="numeric" maxLength={6} placeholder="All sample PINs" value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ''))} />
            <button type="submit" className="btn btn-secondary">Apply</button>
          </div>
          <span className="hint">{loc ? `${loc.district}, ${loc.state}` : `Sample from ${SAMPLE_PINS.length} cities`}</span>
        </form>
        <div className="field" style={{ flex: '1 1 240px' }}>
          <label className="label" htmlFor="schools-q">Find a school</label>
          <div className="input-group">
            <Search size={16} aria-hidden="true" />
            <input id="schools-q" className="input" type="search" placeholder="Name, UDISE code or district" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="schools-sort">Sort by</label>
          <select id="schools-sort" className="select" value={sort} onChange={(e) => setParam('sort', e.target.value === 'score-desc' ? '' : e.target.value)}>
            <option value="score-desc">Ground truth, highest first</option>
            <option value="score-asc">Ground truth, lowest first</option>
            <option value="ptr">Most pupils per teacher</option>
            <option value="name">Name, A to Z</option>
          </select>
        </div>
      </div>

      <div className="cluster" role="group" aria-label="School level" style={{ margin: 'var(--s-5) 0' }}>
        {LEVELS.map((l) => (
          <button key={l} type="button" className="chip" aria-pressed={level === l} onClick={() => setParam('level', l)}>
            {l}
          </button>
        ))}
      </div>

      <div className="stat-row" style={{ marginBottom: 'var(--s-6)' }}>
        <Stat label="Schools listed" value={loading ? '–' : stats.n} />
        <Stat label="Average ground truth" value={loading ? '–' : stats.avg} unit="/100" />
        <Stat label="Need attention" value={loading ? '–' : stats.attention} meta="Score below 75" />
        <Stat label="Teacher posts vacant" value={loading ? '–' : stats.vacancies} meta="Sanctioned minus working" />
        <Stat label="Without electricity" value={loading ? '–' : stats.noPower} />
      </div>

      <div className="spread" style={{ marginBottom: 'var(--s-3)', flexWrap: 'wrap' }}>
        <p className="small muted" aria-live="polite">
          {loading ? 'Loading schools…' : `Showing ${paged.length ? (page - 1) * PAGE_SIZE + 1 : 0} to ${(page - 1) * PAGE_SIZE + paged.length} of ${filtered.length}`}
        </p>
        <div className="cluster">
          {selected.length > 0 && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={selected.length < 2}
              onClick={() => navigate(`/compare?type=schools&ids=${selected.join(',')}`)}
              title={selected.length < 2 ? 'Select at least two schools' : undefined}
            >
              <Columns3 size={14} aria-hidden="true" /> Compare {selected.length}
            </button>
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={download} disabled={!filtered.length}>
            <Download size={14} aria-hidden="true" /> CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="stack">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card card-pad stack-sm">
              <span className="skeleton" style={{ height: 18, width: '45%' }} />
              <span className="skeleton" style={{ height: 12, width: '70%' }} />
              <span className="skeleton" style={{ height: 24, width: '35%' }} />
            </div>
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={SearchX}
            title="No schools match"
            text={pin ? `We have no government school records for PIN ${pin} with these filters.` : 'Try clearing the search or level filter.'}
            action={<button type="button" className="btn btn-secondary" onClick={() => { setQ(''); setParams({}, { replace: true }); }}>Reset filters</button>}
          />
        </div>
      ) : (
        <div className="stack">
          {paged.map((s) => {
            const ratio = ptr(s);
            const isSel = selected.includes(s.id);
            return (
              <article key={s.id} className="card school-card">
                <div className="school-card-main">
                  <div style={{ minWidth: 0 }}>
                    <h3 className="card-title">
                      <Link to={`/module/school?id=${s.id}`} className="school-link">{s.titleEnglish}</Link>
                    </h3>
                    <p className="tiny muted" lang="hi">{s.titleHindi}</p>
                    <p className="small" style={{ color: 'var(--ink-2)', marginTop: 'var(--s-2)' }}>
                      {s.schoolLevel} · {s.managementType} · UDISE <span className="mono">{s.udiseCode}</span> · PIN {s.location.pinCode}, {s.location.district}
                    </p>
                    <div className="cluster" style={{ marginTop: 'var(--s-3)' }}>
                      <Facility ok={s.hasToilet} label="Toilets" />
                      <Facility ok={s.hasElectricity} label="Electricity" />
                      <Facility ok={s.hasDrinkingWater} label="Drinking water" />
                      <Badge tone={toneForStatus(s.status)}>{s.status}</Badge>
                    </div>
                  </div>
                  <dl className="school-metrics">
                    <div><dt>Students</dt><dd className="num">{s.officialStudentCount ?? '–'}</dd></div>
                    <div><dt>Teachers</dt><dd className="num">{s.officialTeacherCount ?? '–'}<span className="muted">/{s.teachersSanctioned ?? '–'}</span></dd></div>
                    <div><dt>Pupils per teacher</dt><dd className={`num ${ratio && ratio > 30 ? 'text-bad' : ''}`}>{ratio ?? '–'}</dd></div>
                    <div>
                      <dt>Ground truth</dt>
                      <dd className={`score text-${toneForScore(s.groundTruthScore)}`}>{s.groundTruthScore}<small>/100</small></dd>
                    </div>
                  </dl>
                </div>
                <div className="card-foot">
                  <label className="check" style={{ padding: 0 }}>
                    <input type="checkbox" checked={isSel} onChange={() => toggle(s.id)} disabled={!isSel && selected.length >= 3} />
                    Add to compare
                  </label>
                  <Link to={`/module/school?id=${s.id}`} className="link">View school profile</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button type="button" className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={15} aria-hidden="true" /> Previous
          </button>
          <span className="small muted num">Page {page} of {totalPages}</span>
          <button type="button" className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight size={15} aria-hidden="true" />
          </button>
        </nav>
      )}
    </ModuleFrame>
  );
}
