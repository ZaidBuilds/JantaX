import { getSyncStatuses } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, Stat, toneForStatus } from '../../../ui';

export function DataFreshnessPage() {
  const rows = getSyncStatuses();
  const healthy = rows.filter((r) => r.status === 'Active Sync').length;
  const records = rows.reduce((a, r) => a + r.totalRecordsIngested, 0);
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.syncHealthPct, 0) / rows.length) : 0;
  return (
    <TransparencyLayout current="Data freshness" title="Data freshness" lede="When each source was last checked and last updated successfully, so you know how current a figure is.">
      <div className="stat-row" style={{ marginBottom: 'var(--s-6)' }}>
        <Stat label="Sources tracked" value={rows.length} />
        <Stat label="Syncing normally" value={healthy} meta={`${rows.length - healthy} delayed or degraded`} />
        <Stat label="Average sync health" value={avg} unit="%" />
        <Stat label="Records ingested" value={records.toLocaleString('en-IN')} />
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">Schedule</th>
              <th scope="col">Last success</th>
              <th scope="col" style={{ textAlign: 'right' }}>Records</th>
              <th scope="col">Health</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="strong">{r.sourceName}</div>
                  <div className="tiny muted">{r.publishingEntity}</div>
                </td>
                <td className="small" style={{ color: 'var(--ink-2)' }}>{r.updateFrequency}</td>
                <td className="small num">{r.lastSuccessfulSync}</td>
                <td className="num" style={{ textAlign: 'right' }}>{r.totalRecordsIngested.toLocaleString('en-IN')}</td>
                <td style={{ minWidth: 120 }}>
                  <div className="cluster" style={{ flexWrap: 'nowrap' }}>
                    <div className={`meter ${r.syncHealthPct >= 90 ? 'good' : r.syncHealthPct >= 70 ? 'warn' : 'bad'}`} style={{ width: 70 }}>
                      <span style={{ width: `${r.syncHealthPct}%` }} />
                    </div>
                    <span className="tiny num">{r.syncHealthPct}%</span>
                  </div>
                </td>
                <td><Badge tone={toneForStatus(r.status === 'Active Sync' ? 'active' : 'delayed')}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TransparencyLayout>
  );
}
