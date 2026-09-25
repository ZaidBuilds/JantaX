import { getSyncStatuses } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, Stat } from '../../../ui';
import { STATUS_TONE } from './SourcesPage';

export function DataFreshnessPage() {
  const rows = getSyncStatuses();
  const connected = rows.filter((r) => r.status === 'Connected').length;
  const ready = rows.filter((r) => r.status === 'Connector ready').length;
  const records = rows.reduce((a, r) => a + r.totalRecordsIngested, 0);
  return (
    <TransparencyLayout current="Data freshness" title="Data freshness" lede="When each source was last checked and last updated successfully, so you know how current a figure is.">
      <div className="stat-row" style={{ marginBottom: 'var(--s-6)' }}>
        <Stat label="Sources listed" value={rows.length} />
        <Stat label="Connected" value={connected} meta={`${ready} ready, waiting on setup`} />
        <Stat label="Not connected yet" value={rows.length - connected - ready} />
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
                <td><Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TransparencyLayout>
  );
}
