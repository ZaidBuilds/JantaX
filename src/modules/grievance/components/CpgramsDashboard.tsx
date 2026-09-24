import { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { monthlyMinistries, monthlyStates } from '../data/cpgramsData';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { getUpdatedGrievances } from '../../../core/utils/autoUpdater';
import { SourceLine, Stat } from '../../../ui';
import { SectionTitle, pct } from '../../shared/ModuleKit';

type Row = {
  id: string;
  name: string;
  nameHi: string;
  totalGrievances: number;
  resolvedCount: number;
  pendingCount: number;
  avgDisposalDays: number;
  backlogOver30Days: number;
  worst: string;
};

type SortKey = 'avgDisposalDays' | 'backlogOver30Days' | 'resolvedPct';

export function CpgramsDashboard() {
  const { share } = useWhatsAppShare();
  const [tab, setTab] = useState<'ministry' | 'state'>('ministry');
  const [sort, setSort] = useState<SortKey>('avgDisposalDays');

  const rows = useMemo<Row[]>(() => {
    const src =
      tab === 'ministry'
        ? getUpdatedGrievances(monthlyMinistries).map((m) => ({ ...m, worst: m.worstCategoryEn }))
        : getUpdatedGrievances(monthlyStates).map((s) => ({ ...s, worst: s.worstDistrictEn }));
    return [...src].sort((a, b) => {
      if (sort === 'resolvedPct') return pct(a.resolvedCount, a.totalGrievances) - pct(b.resolvedCount, b.totalGrievances);
      return b[sort] - a[sort];
    });
  }, [tab, sort]);

  const total = rows.reduce((a, r) => a + r.totalGrievances, 0);
  const backlog = rows.reduce((a, r) => a + r.backlogOver30Days, 0);
  const avg = Math.round(rows.reduce((a, r) => a + r.avgDisposalDays, 0) / Math.max(1, rows.length));

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <div className="spread" style={{ flexWrap: 'wrap' }}>
        <div className="segmented" role="tablist" aria-label="Rank by">
          <button type="button" role="tab" aria-selected={tab === 'ministry'} aria-pressed={tab === 'ministry'} onClick={() => setTab('ministry')}>Union ministries</button>
          <button type="button" role="tab" aria-selected={tab === 'state'} aria-pressed={tab === 'state'} onClick={() => setTab('state')}>State governments</button>
        </div>
        <div className="cluster">
          <label htmlFor="griev-sort" className="small muted">Sort by</label>
          <select id="griev-sort" className="select select-sm" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="avgDisposalDays">Slowest to resolve</option>
            <option value="backlogOver30Days">Largest 30-day backlog</option>
            <option value="resolvedPct">Lowest resolution rate</option>
          </select>
        </div>
      </div>
      <div className="stat-row">
        <Stat label="Grievances this month" value={total.toLocaleString('en-IN')} />
        <Stat label="Pending over 30 days" value={backlog.toLocaleString('en-IN')} />
        <Stat label="Average time to resolve" value={avg} unit=" days" meta="CPGRAMS target is 21 days" />
      </div>
      <SectionTitle title={tab === 'ministry' ? 'Union ministries' : 'State governments'} sub="Ranked on DARPG's monthly CPGRAMS report. Longer disposal times appear first." />
      <div className="card">
        <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{ width: 48 }}>#</th>
                <th scope="col">{tab === 'ministry' ? 'Ministry' : 'State'}</th>
                <th scope="col" style={{ textAlign: 'right' }}>Received</th>
                <th scope="col" style={{ textAlign: 'right' }}>Resolved</th>
                <th scope="col" style={{ textAlign: 'right' }}>Over 30 days</th>
                <th scope="col" style={{ textAlign: 'right' }}>Avg. days</th>
                <th scope="col"><span className="visually-hidden">Share</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const resolved = pct(r.resolvedCount, r.totalGrievances);
                return (
                  <tr key={r.id}>
                    <td className="num muted">{i + 1}</td>
                    <td>
                      <div className="strong">{r.name}</div>
                      <div className="tiny muted">
                        <span lang="hi">{r.nameHi}</span> · Most complaints: {r.worst}
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: 'right' }}>{r.totalGrievances.toLocaleString('en-IN')}</td>
                    <td className={`num ${resolved < 75 ? 'text-bad' : ''}`} style={{ textAlign: 'right' }}>{resolved}%</td>
                    <td className="num" style={{ textAlign: 'right' }}>{r.backlogOver30Days.toLocaleString('en-IN')}</td>
                    <td className={`num ${r.avgDisposalDays > 21 ? 'text-bad' : 'text-good'}`} style={{ textAlign: 'right', fontWeight: 600 }}>{r.avgDisposalDays}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        aria-label={`Share ${r.name} on WhatsApp`}
                        onClick={() =>
                          share({
                            pinCode: '000000',
                            titleHindi: `CPGRAMS: ${r.nameHi}`,
                            titleEnglish: `CPGRAMS: ${r.name}`,
                            claimLabel: 'Target: resolve within 21 days',
                            claimLabelHindi: 'लक्ष्य: 21 दिन में निपटान',
                            realityLabel: `Average ${r.avgDisposalDays} days; ${r.backlogOver30Days} pending over 30 days`,
                            realityLabelHindi: `औसत ${r.avgDisposalDays} दिन; 30 दिन से अधिक ${r.backlogOver30Days} लंबित`,
                            responsiblePerson: tab === 'ministry' ? 'Ministry grievance officer' : 'State nodal officer',
                            responsibleOrg: r.name,
                            sourceUrl: 'https://pgportal.gov.in',
                            moduleNameHindi: 'शिकायत स्कोर',
                          })
                        }
                      >
                        <Share2 size={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-foot">
          <SourceLine source="DARPG CPGRAMS monthly report" url="https://pgportal.gov.in" updated="2026-08-31" />
        </div>
      </div>
    </div>
  );
}
