import { Link } from 'react-router-dom';
import { Activity, WifiOff } from 'lucide-react';
import { Badge } from '../../../ui';
import { formatWhen, isConnected, STATE_LABEL, useCatalog } from '../../../core/services/officialData';
import { STATE_TONE } from '../../transparency/pages/SourcesPage';

/** Real sync health from the data service: failing and out-of-date sources first. */
export function LivePipelineHealth() {
  const catalog = useCatalog();
  if (catalog.status === 'loading') return <div className="card card-pad" aria-busy="true" style={{ marginBottom: 'var(--s-6)' }}><span className="skeleton" style={{ height: 64 }} /></div>;
  if (catalog.status !== 'ok') {
    return (
      <div className="callout" style={{ marginBottom: 'var(--s-6)' }}>
        <WifiOff size={16} aria-hidden="true" />
        <span>Live pipeline health appears here when the JantaX data service is reachable. The alerts below are examples.</span>
      </div>
    );
  }
  const all = [...catalog.data.feeds, ...catalog.data.datasets];
  const attention = all.filter((s) => s.state === 'failing' || s.state === 'stale');
  const connected = all.filter((s) => isConnected(s.state)).length;
  return (
    <section className="card" style={{ marginBottom: 'var(--s-6)' }} aria-labelledby="pipeline-h">
      <div className="card-head">
        <h2 id="pipeline-h" className="card-title" style={{ fontSize: 'var(--text-md)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Activity size={16} aria-hidden="true" /> Live pipeline health
        </h2>
        <span className="tiny muted">{connected} of {all.length} sources connected · {attention.length} need attention</span>
      </div>
      {attention.length ? (
        <ul className="list">
          {attention.map((s) => (
            <li key={s.id} className="list-row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="strong small">{s.title}</div>
                <div className="tiny muted">Last success {formatWhen(s.lastSync) ?? 'never'}{s.lastError ? ` · ${s.lastError.slice(0, 200)}` : ''}</div>
              </div>
              <Badge tone={STATE_TONE[s.state]}>{STATE_LABEL[s.state]}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="small muted card-body">No connected source is failing or out of date.</p>
      )}
      <div className="card-foot">
        <span className="tiny muted">The alerts below are examples of the review workflow.</span>
        <Link to="/transparency/freshness" className="link tiny">All sources</Link>
      </div>
    </section>
  );
}
