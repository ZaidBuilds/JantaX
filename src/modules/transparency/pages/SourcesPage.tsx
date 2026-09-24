import { useMemo, useState } from 'react';
import { ExternalLink, Search, SearchX } from 'lucide-react';
import { getStoredGovtSources } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, EmptyState, toneForStatus } from '../../../ui';

export function SourcesPage() {
  const sources = getStoredGovtSources();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return sources;
    return sources.filter((s) => [s.sourceName, s.publishingEntity, s.ministryOrDepartment, ...s.dataAttributesCovered].join(' ').toLowerCase().includes(n));
  }, [q, sources]);

  return (
    <TransparencyLayout
      current="Data sources"
      title="Data sources"
      lede="Every official database, register and audit report we use, with how often it updates, what it misses and the licence it is published under."
    >
      <div className="input-group" style={{ maxWidth: 440, marginBottom: 'var(--s-5)' }}>
        <Search size={16} aria-hidden="true" />
        <input className="input" type="search" placeholder="Search by source, ministry or field" aria-label="Search sources" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {list.length === 0 ? (
        <div className="card"><EmptyState icon={SearchX} title="No source matches" text="Try a ministry name such as Education or Health." /></div>
      ) : (
        <div className="stack">
          {list.map((s) => (
            <article key={s.id} className="card">
              <div className="card-body stack">
                <div className="spread" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="cluster">
                      <Badge tone="brand">{s.governmentLevel}</Badge>
                      <Badge tone={toneForStatus(s.status === 'Active Sync' ? 'active' : 'delayed')}>{s.status}</Badge>
                    </div>
                    <h2 className="card-title" style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--s-2)' }}>{s.sourceName}</h2>
                    <p className="small muted">{s.publishingEntity} · {s.ministryOrDepartment}</p>
                  </div>
                  <a href={s.officialUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    Official site <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
                <div className="cluster">
                  {s.dataAttributesCovered.map((a) => (
                    <span key={a} className="badge badge-outline">{a}</span>
                  ))}
                </div>
                <dl className="source-facts">
                  <div><dt>Updates</dt><dd>{s.updateFrequency}</dd></div>
                  <div><dt>Last synced</dt><dd>{s.lastSuccessfulSync}</dd></div>
                  <div><dt>How we process it</dt><dd>{s.processingPipeline}</dd></div>
                  <div><dt>Known gaps</dt><dd className="text-warn">{s.knownLimitations}</dd></div>
                  <div className="wide"><dt>Licence</dt><dd>{s.licenseAndUsageRules}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      )}
    </TransparencyLayout>
  );
}
