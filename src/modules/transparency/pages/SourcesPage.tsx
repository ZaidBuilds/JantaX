import { useMemo, useState } from 'react';
import { ExternalLink, Search, SearchX } from 'lucide-react';
import { getStoredGovtSources } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, EmptyState } from '../../../ui';
import type { Tone } from '../../../ui/Badge';
import type { SourceStatus } from '../types/transparency';
import { formatWhen, STATE_LABEL, useCatalog, type Catalog, type DatasetState } from '../../../core/services/officialData';

export const STATUS_TONE: Record<SourceStatus, Tone> = { Connected: 'good', 'Connector ready': 'info', 'Not connected': 'neutral' };
export const STATE_TONE: Record<DatasetState, Tone> = { live: 'good', stale: 'warn', failing: 'bad', 'needs-setting': 'neutral', 'needs-file': 'neutral', ready: 'info' };

const ACCESS: Record<string, string> = { ogd: 'data.gov.in API', ckan: 'CKAN API', url: 'Direct download', file: 'File import' };

/** Every catalogued dataset, as the data service reports it. */
function LiveCatalog({ catalog }: { catalog: Catalog }) {
  return (
    <section style={{ marginBottom: 'var(--s-8)' }} aria-labelledby="catalog-h">
      <div className="section-head" style={{ marginBottom: 'var(--s-3)' }}>
        <h2 id="catalog-h" className="section-title">Dataset catalog</h2>
        <span className="small muted">{catalog.datasets.length} datasets, status from the data service</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Dataset</th>
              <th scope="col">Module</th>
              <th scope="col">How it arrives</th>
              <th scope="col">Licence</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {catalog.datasets.map((d) => (
              <tr key={d.id}>
                <td>
                  <a className="strong" href={d.sourceUrl} target="_blank" rel="noreferrer">{d.title}</a>
                  <div className="tiny muted">{d.publisher} · {d.level} level</div>
                  {d.missing && (
                    <details className="tiny" style={{ marginTop: 4 }}>
                      <summary className="muted" style={{ cursor: 'pointer' }}>What's needed to connect it</summary>
                      <p style={{ marginTop: 4, maxWidth: '70ch' }}>{d.missing}</p>
                    </details>
                  )}
                </td>
                <td className="small">{d.module}</td>
                <td className="small">{ACCESS[d.access]}</td>
                <td className="tiny">{d.licenseUrl ? <a href={d.licenseUrl} target="_blank" rel="noreferrer">{d.license}</a> : d.license}</td>
                <td>
                  <Badge tone={STATE_TONE[d.state]}>{STATE_LABEL[d.state]}</Badge>
                  {d.rows > 0 && <div className="tiny muted num">{d.rows.toLocaleString('en-IN')} rows · {formatWhen(d.lastSync)}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SourcesPage() {
  const sources = getStoredGovtSources();
  const catalog = useCatalog();
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
      {catalog.status === 'ok' && <LiveCatalog catalog={catalog.data} />}
      {catalog.status === 'ok' && <h2 className="section-title" style={{ marginBottom: 'var(--s-3)' }}>Source notes</h2>}
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
                      <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
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
