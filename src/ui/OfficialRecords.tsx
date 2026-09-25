import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, FileSpreadsheet, Landmark, PlugZap, WifiOff } from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import {
  formatValue,
  formatWhen,
  isConnected,
  STATE_LABEL,
  useArea,
  useCatalog,
  type AreaDataset,
  type Column,
  type OfficialRow,
} from '../core/services/officialData';
import { Badge } from './Badge';

const PREVIEW = 8;

function scopeLabel(d: AreaDataset, place: { district: string | null; state: string }, pin: string) {
  switch (d.matched) {
    case 'pincode':
      return `PIN ${pin}`;
    case 'district':
      return `${place.district ?? 'Your'} district`;
    case 'state':
      return d.level === 'state' ? place.state : `Districts of ${place.state}`;
    case 'national':
      return 'All India';
    default:
      return null;
  }
}

/** When the data only reaches a wider area than the dataset's own level, say which place each row is. */
function placeColumn(d: AreaDataset): Column | null {
  const broader = (d.level === 'district' || d.level === 'pincode' || d.level === 'point') && (d.matched === 'state' || (d.matched === 'district' && d.level !== 'district'));
  if (!broader || d.columns.some((c) => c.id === 'district')) return null;
  return { id: '_placeName', label: 'Place', type: 'text', unit: null };
}

function cell(row: OfficialRow, col: Column) {
  if (col.id === '_placeName') return String(row.district ?? row.city ?? row._place.pincode ?? '—');
  if (col.id === '_km') return row._place.km === undefined ? '—' : `${row._place.km} km`;
  if (col.type === 'url' && typeof row[col.id] === 'string') {
    return (
      <a href={String(row[col.id])} target="_blank" rel="noreferrer">
        Open <ExternalLink size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-1px' }} />
      </a>
    );
  }
  return formatValue(row[col.id], col);
}

const numeric = (c: Column) => c.type === 'int' || c.type === 'number' || c.type === 'percent' || c.id === '_km';

function DatasetTable({ d, place, pin }: { d: AreaDataset; place: { district: string | null; state: string }; pin: string }) {
  const [all, setAll] = useState(false);
  const scope = scopeLabel(d, place, pin);
  const lead = placeColumn(d);
  const withKm = d.rows.some((r) => r._place.km !== undefined);
  const columns = [...(lead ? [lead] : []), ...d.columns, ...(withKm ? [{ id: '_km', label: 'Distance', type: 'number' as const, unit: null }] : [])];
  const rows = all ? d.rows : d.rows.slice(0, PREVIEW);
  const updated = formatWhen(d.source.lastSync);
  const titleId = `official-${d.id}`;

  return (
    <article className="card" aria-labelledby={titleId}>
      <div className="card-head" style={{ flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <div style={{ minWidth: 0 }}>
          <h3 id={titleId} className="card-title" style={{ fontSize: 'var(--text-md)' }}>{d.title}</h3>
          <p className="tiny muted" style={{ marginTop: 2 }}>{d.summary}</p>
        </div>
        <div className="cluster">
          {scope && <Badge tone="brand">{scope}</Badge>}
          {(d.status === 'stale' || d.status === 'failing') && <Badge tone="warn">{STATE_LABEL[d.status]}</Badge>}
        </div>
      </div>
      {d.matched === 'state' && d.level !== 'state' && (
        <p className="small muted card-body" style={{ paddingBottom: 0 }}>
          This release has no figures for {place.district ?? `PIN ${pin}`}, so districts across {place.state} are shown.
        </p>
      )}
      <div className="card-body">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.id} scope="col" className={numeric(c) ? 'num' : undefined}>
                    {c.label}
                    {c.unit && c.unit !== '%' && !c.unit.startsWith('₹') ? <span className="muted"> ({c.unit})</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.id} className={numeric(c) ? 'num' : undefined}>{cell(r, c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="spread" style={{ marginTop: 'var(--s-3)', flexWrap: 'wrap' }}>
          <div className="source-row">
            <span>
              Source:{' '}
              <a href={d.source.url} target="_blank" rel="noreferrer">
                {d.source.publisher} <ExternalLink size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-1px' }} />
              </a>
            </span>
            {updated && <span>Fetched {updated}</span>}
            {d.source.publishedAt && <span>Published {formatWhen(d.source.publishedAt)}</span>}
            <span>
              {d.source.licenseUrl ? (
                <a href={d.source.licenseUrl} target="_blank" rel="noreferrer">{d.source.license}</a>
              ) : (
                d.source.license
              )}
            </span>
          </div>
          {d.rows.length > PREVIEW && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAll((v) => !v)} aria-expanded={all}>
              {all ? 'Show fewer' : `Show all ${d.rows.length}`}
            </button>
          )}
        </div>
        {d.total > d.rows.length && (
          <p className="tiny muted" style={{ marginTop: 'var(--s-2)' }}>
            Showing {d.rows.length} of {d.total.toLocaleString('en-IN')} records for this area.
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Official government records for a module and PIN, straight from the JantaX data service.
 * Renders nothing for modules without catalogued datasets, and never shows invented figures.
 */
export function OfficialRecords({ moduleId, pin: pinProp }: { moduleId: string; pin?: string | null }) {
  const { selectedPin } = usePin();
  const [params] = useSearchParams();
  const pin = pinProp || params.get('pin') || selectedPin;
  const catalog = useCatalog();
  const area = useArea(pin, moduleId);

  // Nothing to say for modules with no official dataset (e.g. pollution, which has its own live card).
  if (catalog.status === 'ok' && !catalog.data.datasets.some((d) => d.module === moduleId)) return null;

  const heading = (
    <div className="section-head" style={{ marginBottom: 'var(--s-3)' }}>
      <h2 id={`official-${moduleId}-h`} className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Landmark size={18} aria-hidden="true" /> Official records
      </h2>
      {area.status === 'ok' && (
        <span className="small muted">
          PIN {area.data.pin} · {area.data.place.district ? `${area.data.place.district}, ` : ''}{area.data.place.state}
        </span>
      )}
    </div>
  );

  let body;
  if (area.status === 'loading' || catalog.status === 'loading') {
    body = (
      <div className="card card-pad" aria-busy="true">
        <span className="skeleton" style={{ height: 120 }} />
      </div>
    );
  } else if (area.status === 'unreachable' || catalog.status === 'unreachable') {
    body = (
      <div className="callout">
        <WifiOff size={16} aria-hidden="true" />
        <span>
          Official records can't be loaded because the JantaX data service isn't reachable. The figures further down this page are samples.
        </span>
      </div>
    );
  } else if (area.status === 'error') {
    body = (
      <div className="callout callout-warn">
        <WifiOff size={16} aria-hidden="true" />
        <span>Official records for PIN {pin} are unavailable: {area.message}.</span>
      </div>
    );
  } else {
    const withRows = area.data.datasets.filter((d) => d.rows.length > 0);
    const connectedEmpty = area.data.datasets.filter((d) => isConnected(d.status) && d.rows.length === 0);
    const waiting = area.data.datasets.filter((d) => !isConnected(d.status));
    body = (
      <div className="stack">
        {withRows.map((d) => (
          <DatasetTable key={d.id} d={d} place={area.data.place} pin={area.data.pin} />
        ))}
        {connectedEmpty.length > 0 && (
          <div className="callout callout-info">
            <FileSpreadsheet size={16} aria-hidden="true" />
            <span>
              No figures for {area.data.place.district ?? `PIN ${area.data.pin}`} in: {connectedEmpty.map((d) => d.title).join('; ')}.
            </span>
          </div>
        )}
        {waiting.length > 0 && (
          <div className="callout">
            <PlugZap size={16} aria-hidden="true" />
            <span>
              {withRows.length ? 'Also planned, not connected yet' : 'Official datasets for this module are set up but not connected yet'}:{' '}
              {waiting.map((d, i) => (
                <span key={d.id}>
                  {i > 0 && '; '}
                  <strong>{d.title}</strong> ({d.source.publisher})
                </span>
              ))}
              . <Link to="/transparency/freshness">Data status</Link>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="official-records" aria-labelledby={`official-${moduleId}-h`} style={{ marginBottom: 'var(--s-8)' }}>
      {heading}
      {body}
    </section>
  );
}

/** Headline official figures for a PIN across every module, for the area dashboard. */
export function AreaSummary({ pin }: { pin: string }) {
  const area = useArea(pin);
  if (area.status === 'loading') return <div className="card card-pad" aria-busy="true"><span className="skeleton" style={{ height: 88 }} /></div>;
  if (area.status === 'unreachable') {
    return (
      <div className="callout">
        <WifiOff size={16} aria-hidden="true" />
        <span>Official figures for this PIN appear when the JantaX data service is reachable.</span>
      </div>
    );
  }
  if (area.status === 'error') return null;

  const withRows = area.data.datasets.filter((d) => d.rows.length > 0);
  if (!withRows.length) {
    return (
      <div className="callout">
        <PlugZap size={16} aria-hidden="true" />
        <span>
          No official datasets with figures for {area.data.place.district ?? `PIN ${pin}`} are connected yet. <Link to="/transparency/freshness">See data status</Link>.
        </span>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="list">
        {withRows.map((d) => {
          const first = d.rows[0];
          const figures = d.columns.filter((c) => first[c.id] !== null && first[c.id] !== undefined && c.type !== 'url').slice(0, 3);
          return (
            <Link key={d.id} to={`/module/${d.module}?pin=${pin}`} className="list-row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="strong small">{d.title}</div>
                <div className="cluster tiny" style={{ marginTop: 4, gap: 'var(--s-3)' }}>
                  {d.rows.length === 1 || d.matched !== 'state'
                    ? figures.map((c) => (
                        <span key={c.id}>
                          <span className="muted">{c.label}</span> <span className="num strong">{formatValue(first[c.id], c)}</span>
                        </span>
                      ))
                    : <span className="muted">{d.total.toLocaleString('en-IN')} records for {area.data.place.state}</span>}
                </div>
              </div>
              <Badge tone="brand">{scopeLabel(d, area.data.place, pin)}</Badge>
            </Link>
          );
        })}
      </div>
      <div className="card-foot">
        <span className="tiny muted">From {new Set(withRows.map((d) => d.source.publisher)).size} official publishers</span>
        <Link to="/transparency/freshness" className="link tiny">Data status</Link>
      </div>
    </div>
  );
}
