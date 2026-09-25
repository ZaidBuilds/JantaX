import { getSyncStatuses } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, Stat } from '../../../ui';
import { STATE_TONE, STATUS_TONE } from './SourcesPage';
import { formatWhen, isConnected, STATE_LABEL, useCatalog } from '../../../core/services/officialData';

const SCHEDULE: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Yearly', event: 'On import' };

/** Live status from the data service; the documented list only when the service can't be reached. */
export function DataFreshnessPage() {
  const catalog = useCatalog();
  const lede = 'When each source was last fetched successfully and how many records it holds, so you know how current a figure is.';

  if (catalog.status === 'ok') {
    const rows = [
      ...catalog.data.feeds.map((f) => ({ ...f, module: null as string | null, nextRun: null as string | null })),
      ...catalog.data.datasets.map((d) => ({ id: d.id, title: d.title, publisher: d.publisher, schedule: d.schedule, state: d.state, rows: d.rows, lastSync: d.lastSync, lastError: d.lastError, module: d.module, nextRun: d.nextRun })),
    ];
    const connected = rows.filter((r) => isConnected(r.state));
    const waiting = rows.filter((r) => r.state === 'needs-setting' || r.state === 'ready').length;
    const imports = rows.filter((r) => r.state === 'needs-file').length;
    return (
      <TransparencyLayout current="Data freshness" title="Data freshness" lede={lede}>
        <div className="stat-row" style={{ marginBottom: 'var(--s-6)' }}>
          <Stat label="Official sources" value={rows.length} />
          <Stat label="Connected" value={connected.length} meta={`${rows.filter((r) => r.state === 'stale' || r.state === 'failing').length} need attention`} />
          <Stat label="Waiting on setup" value={waiting} meta={`${imports} need a file import`} />
          <Stat label="Records held" value={connected.reduce((a, r) => a + r.rows, 0).toLocaleString('en-IN')} />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Refresh</th>
                <th scope="col">Last success</th>
                <th scope="col" className="num">Records</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="strong">{r.title}</div>
                    <div className="tiny muted">{r.publisher}{r.module ? ` · ${r.module}` : ''}</div>
                    {r.lastError && <div className="tiny text-warn" style={{ marginTop: 2 }}>Last attempt failed: {r.lastError.slice(0, 160)}</div>}
                  </td>
                  <td className="small" style={{ color: 'var(--ink-2)' }}>
                    {SCHEDULE[r.schedule] ?? r.schedule}
                    {r.nextRun && <div className="tiny muted">next {formatWhen(r.nextRun)}</div>}
                  </td>
                  <td className="small num">{formatWhen(r.lastSync) ?? 'Never'}</td>
                  <td className="num">{r.rows.toLocaleString('en-IN')}</td>
                  <td><Badge tone={STATE_TONE[r.state]}>{STATE_LABEL[r.state]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tiny muted" style={{ marginTop: 'var(--s-3)' }}>Status as of {formatWhen(catalog.data.generatedAt)}, read from the JantaX data service.</p>
      </TransparencyLayout>
    );
  }

  const rows = getSyncStatuses();
  const connected = rows.filter((r) => r.status === 'Connected').length;
  const ready = rows.filter((r) => r.status === 'Connector ready').length;
  const records = rows.reduce((a, r) => a + r.totalRecordsIngested, 0);
  return (
    <TransparencyLayout current="Data freshness" title="Data freshness" lede={lede}>
      {catalog.status !== 'loading' && (
        <div className="callout" style={{ marginBottom: 'var(--s-5)' }}>
          <span>The JantaX data service isn't reachable, so this is the documented status of each source rather than a live reading.</span>
        </div>
      )}
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
