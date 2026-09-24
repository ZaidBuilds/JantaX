import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, X, Download, ArrowRight, MapPin, GraduationCap, Info } from 'lucide-react';
import { api, type ApiRecord, type PincodeInfo } from '../core/services/api';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { getCourtSummaryForPin } from '../modules/courts/services/courtsService';
import { getStationSummaryForPin } from '../modules/pollution/services/pollutionService';
import { getMpladsSummaryForPin } from '../modules/mplads/services/mpladsService';
import { getWardSummaryForPin } from '../modules/nagar/services/nagarService';
import { ModuleIcon, PageHeader, getModule, toneForScore, useToast } from '../ui';

type Better = 'high' | 'low' | null;

interface Row {
  label: string;
  hint?: string;
  better: Better;
  values: (number | string | null)[];
  format?: (v: number) => string;
}

function csvDownload(name: string, header: string[], rows: Row[]) {
  const lines = [header, ...rows.map((r) => [r.label, ...r.values.map((v) => (v === null ? '' : String(v)))])]
    .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function CompareTable({ columns, rows }: { columns: { key: string; title: string; sub?: string; onRemove?: () => void }[]; rows: Row[] }) {
  return (
    <div className="table-wrap">
      <table className="table compare-table">
        <thead>
          <tr>
            <th scope="col">Measure</th>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                <div className="compare-col">
                  <div style={{ minWidth: 0 }}>
                    <div className="strong truncate" style={{ color: 'var(--ink)' }}>{c.title}</div>
                    {c.sub && <div className="tiny muted truncate">{c.sub}</div>}
                  </div>
                  {c.onRemove && (
                    <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={c.onRemove} aria-label={`Remove ${c.title}`}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const nums = r.values.filter((v): v is number => typeof v === 'number');
            const best = r.better && nums.length > 1 ? (r.better === 'high' ? Math.max(...nums) : Math.min(...nums)) : null;
            const worst = r.better && nums.length > 1 ? (r.better === 'high' ? Math.min(...nums) : Math.max(...nums)) : null;
            return (
              <tr key={r.label}>
                <th scope="row" style={{ position: 'static', background: 'transparent', borderBottom: '1px solid var(--border)', fontWeight: 500, color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>
                  {r.label}
                  {r.hint && <div className="tiny muted" style={{ fontWeight: 400 }}>{r.hint}</div>}
                </th>
                {r.values.map((v, i) => {
                  const cls = typeof v === 'number' && best !== worst ? (v === best ? 'cell-best' : v === worst ? 'cell-worst' : '') : '';
                  return (
                    <td key={i} className={`num ${cls}`}>
                      {v === null || v === undefined ? <span className="muted">No data</span> : typeof v === 'number' && r.format ? r.format(v) : v}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AreasCompare() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const pins = (params.get('pins') || '110001,250001,560001').split(',').filter(isValidIndianPincode).slice(0, 4);
  const [draft, setDraft] = useState('');
  const [info, setInfo] = useState<Record<string, PincodeInfo>>({});

  useEffect(() => {
    let alive = true;
    pins.forEach((p) => {
      if (info[p]) return;
      api.getPincode(p).then((i) => alive && setInfo((cur) => ({ ...cur, [p]: i })));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins.join(',')]);

  const setPins = (next: string[]) => {
    const sp = new URLSearchParams(params);
    sp.set('pins', next.join(','));
    setParams(sp, { replace: true });
  };

  const rows: Row[] = useMemo(() => {
    const get = (fn: (p: string) => number | null) => pins.map((p) => {
      try {
        return fn(p);
      } catch {
        return null;
      }
    });
    const c = (k: keyof PincodeInfo['counts']) => pins.map((p) => (info[p] ? info[p].counts[k] : null));
    return [
      { label: 'Government schools', better: null, values: c('schools') },
      { label: 'Public works projects', better: null, values: c('infraProjects') },
      { label: 'Health facilities', better: 'high', values: c('hospitals') },
      { label: 'Ration shops', better: 'high', values: c('pdsShops') },
      { label: 'RERA housing projects', better: null, values: c('reraProjects') },
      { label: 'Open grievances', better: 'low', values: c('grievances') },
      { label: 'Air quality index', hint: 'Nearest CPCB station', better: 'low', values: get((p) => getStationSummaryForPin(p).currentAqi) },
      { label: 'Court cases pending over 5 years', better: 'low', values: get((p) => getCourtSummaryForPin(p).court.pendingOver5Years), format: (v) => v.toLocaleString('en-IN') },
      { label: 'Judge posts vacant', better: 'low', values: get((p) => getCourtSummaryForPin(p).court.vacancyPercentage), format: (v) => `${v}%` },
      { label: 'MPLADS funds unspent', better: 'low', values: get((p) => getMpladsSummaryForPin(p).representative.fundSummary.unspentBalanceCr), format: (v) => `₹${v} Cr` },
      { label: 'Ward complaint resolution', hint: 'Average hours', better: 'low', values: get((p) => getWardSummaryForPin(p).avgResolutionHours), format: (v) => `${v} h` },
    ];
  }, [pins, info]);

  const add = () => {
    if (!isValidIndianPincode(draft)) {
      toast('Enter a valid 6-digit PIN code');
      return;
    }
    if (pins.includes(draft)) {
      toast(`${draft} is already in the comparison`);
      return;
    }
    setPins([...pins, draft]);
    setDraft('');
  };

  return (
    <div className="stack" style={{ gap: 'var(--s-5)' }}>
      <div className="spread" style={{ flexWrap: 'wrap' }}>
        <form
          className="cluster"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <div className="input-group" style={{ width: 180 }}>
            <MapPin size={16} aria-hidden="true" />
            <input className="input num" inputMode="numeric" maxLength={6} placeholder="Add a PIN" aria-label="Add a PIN code" value={draft} onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))} disabled={pins.length >= 4} />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={pins.length >= 4}>
            <Plus size={16} aria-hidden="true" /> Add area
          </button>
          <span className="tiny muted">{pins.length}/4 areas</span>
        </form>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => csvDownload('jantax-area-comparison.csv', ['Measure', ...pins], rows)}>
          <Download size={14} aria-hidden="true" /> CSV
        </button>
      </div>
      {pins.length === 0 ? (
        <div className="callout"><Info size={16} aria-hidden="true" /> Add two or more PIN codes to compare them.</div>
      ) : (
        <CompareTable
          columns={pins.map((p) => {
            const l = resolvePincode(p);
            return { key: p, title: `PIN ${p}`, sub: `${l.district}, ${l.state}`, onRemove: pins.length > 1 ? () => setPins(pins.filter((x) => x !== p)) : undefined };
          })}
          rows={rows}
        />
      )}
      <p className="tiny muted">Green marks the better value in a row and red the weaker one, where a direction is meaningful. Counts come from the PIN index; the rest from each module's source.</p>
    </div>
  );
}

function SchoolsCompare() {
  const [params, setParams] = useSearchParams();
  const ids = (params.get('ids') || '').split(',').filter(Boolean).slice(0, 4);
  const [records, setRecords] = useState<Record<string, ApiRecord>>({});
  const [pickPin, setPickPin] = useState('110001');
  const [options, setOptions] = useState<ApiRecord[]>([]);

  useEffect(() => {
    ids.forEach((id) => {
      if (records[id]) return;
      api
        .getRecord('school', id)
        .then((r) => setRecords((cur) => ({ ...cur, [id]: ((r as { record?: ApiRecord }).record || r) as ApiRecord })))
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  useEffect(() => {
    if (!isValidIndianPincode(pickPin)) return;
    api.getSchools(pickPin).then(setOptions).catch(() => setOptions([]));
  }, [pickPin]);

  const setIds = (next: string[]) => {
    const sp = new URLSearchParams(params);
    sp.set('ids', next.join(','));
    setParams(sp, { replace: true });
  };

  const loaded = ids.map((id) => records[id]).filter(Boolean);
  const rows: Row[] = [
    { label: 'Level', better: null, values: loaded.map((s) => s.schoolLevel || null) },
    { label: 'PIN and district', better: null, values: loaded.map((s) => `${s.location.pinCode}, ${s.location.district}`) },
    { label: 'Students enrolled', better: null, values: loaded.map((s) => s.officialStudentCount ?? null) },
    { label: 'Teachers working', better: 'high', values: loaded.map((s) => s.officialTeacherCount ?? null) },
    { label: 'Teacher posts vacant', better: 'low', values: loaded.map((s) => (s.teachersSanctioned != null && s.officialTeacherCount != null ? s.teachersSanctioned - s.officialTeacherCount : null)) },
    { label: 'Pupils per teacher', hint: 'RTE norm is 30 or fewer', better: 'low', values: loaded.map((s) => (s.officialTeacherCount ? Math.round((s.officialStudentCount || 0) / s.officialTeacherCount) : null)) },
    { label: 'Usable toilets', better: null, values: loaded.map((s) => (s.hasToilet === undefined ? null : s.hasToilet ? 'Yes' : 'No')) },
    { label: 'Electricity', better: null, values: loaded.map((s) => (s.hasElectricity === undefined ? null : s.hasElectricity ? 'Yes' : 'No')) },
    { label: 'Drinking water', better: null, values: loaded.map((s) => (s.hasDrinkingWater === undefined ? null : s.hasDrinkingWater ? 'Yes' : 'No')) },
    { label: 'Ground truth score', hint: 'Out of 100', better: 'high', values: loaded.map((s) => s.groundTruthScore) },
  ];

  return (
    <div className="stack" style={{ gap: 'var(--s-5)' }}>
      <div className="card card-pad">
        <div className="spread" style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field">
            <label className="label" htmlFor="pick-pin">Pick schools from PIN</label>
            <input id="pick-pin" className="input num" style={{ width: 160 }} inputMode="numeric" maxLength={6} value={pickPin} onChange={(e) => setPickPin(e.target.value.replace(/\D/g, ''))} />
          </div>
          <span className="tiny muted">{ids.length}/4 selected</span>
        </div>
        <div className="cluster" style={{ marginTop: 'var(--s-4)' }}>
          {options.length === 0 && <span className="small muted">No schools found for this PIN.</span>}
          {options.map((s) => {
            const on = ids.includes(s.id);
            return (
              <button key={s.id} type="button" className="chip" aria-pressed={on} disabled={!on && ids.length >= 4} onClick={() => setIds(on ? ids.filter((x) => x !== s.id) : [...ids, s.id])}>
                {on ? <X size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                {s.titleEnglish}
              </button>
            );
          })}
        </div>
      </div>
      {loaded.length < 2 ? (
        <div className="callout callout-info"><Info size={16} aria-hidden="true" /> Select at least two schools to see them side by side.</div>
      ) : (
        <>
          <CompareTable
            columns={loaded.map((s) => ({ key: s.id, title: s.titleEnglish, sub: `UDISE ${s.udiseCode}`, onRemove: () => setIds(ids.filter((x) => x !== s.id)) }))}
            rows={rows}
          />
          <div className="cluster">
            {loaded.map((s) => (
              <Link key={s.id} to={`/module/school?id=${s.id}`} className="btn btn-secondary btn-sm">
                <GraduationCap size={14} aria-hidden="true" />
                <span className={`text-${toneForScore(s.groundTruthScore)}`}>{s.groundTruthScore}</span> Open {s.titleEnglish.split(',')[0]}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const MORE = [
  { id: 'contractor', to: '/contractors/compare', label: 'Contractors' },
  { id: 'rera', to: '/rera/compare', label: 'RERA projects' },
  { id: 'courts', to: '/courts/compare', label: 'District courts' },
  { id: 'rti', to: '/rti/compare', label: 'RTI authorities' },
  { id: 'nagar', to: '/nagar/compare', label: 'Municipal wards' },
  { id: 'pollution', to: '/pollution/compare', label: 'AQI stations' },
  { id: 'mplads', to: '/mplads/compare', label: 'MPs and MLAs' },
];

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') === 'schools' ? 'schools' : 'areas';

  return (
    <div className="page">
      <PageHeader
        crumbs={[{ label: 'Compare' }]}
        title="Compare side by side"
        lede="Put areas or schools next to each other on the same public measures. Every column uses the same sources and the same date."
      />
      <div className="segmented" role="tablist" aria-label="What to compare" style={{ marginBottom: 'var(--s-6)' }}>
        <button type="button" role="tab" aria-selected={type === 'areas'} aria-pressed={type === 'areas'} onClick={() => setParams({ type: 'areas' })}>
          <MapPin size={14} aria-hidden="true" /> Areas
        </button>
        <button type="button" role="tab" aria-selected={type === 'schools'} aria-pressed={type === 'schools'} onClick={() => setParams({ type: 'schools' })}>
          <GraduationCap size={14} aria-hidden="true" /> Schools
        </button>
      </div>

      {type === 'areas' ? <AreasCompare /> : <SchoolsCompare />}

      <section className="section" aria-labelledby="more-compare">
        <h2 id="more-compare" className="section-title" style={{ marginBottom: 'var(--s-4)' }}>More comparisons</h2>
        <div className="grid-auto">
          {MORE.map((m) => (
            <Link key={m.to} to={m.to} className="card card-link card-pad cluster" style={{ gap: 'var(--s-3)', flexWrap: 'nowrap' }}>
              <ModuleIcon id={m.id} size="sm" />
              <span style={{ flex: 1 }}>
                <span className="strong" style={{ display: 'block' }}>{m.label}</span>
                <span className="tiny muted">{getModule(m.id)?.dataSource}</span>
              </span>
              <ArrowRight size={16} className="muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
