import { useState } from 'react';
import { Mail } from 'lucide-react';
import { usePinRecord, useDirectorySource } from '../core/services/pinDirectory';
import { SourceLine } from './SourceLine';

const TYPE_LABEL: Record<string, string> = { HO: 'Head office', SO: 'Sub office', PO: 'Post office', BO: 'Branch office' };
const SHOWN = 6;

/** The post offices that serve a PIN, from India Post's All India Pincode Directory. */
export function PostOfficesCard({ pin }: { pin: string }) {
  const lookup = usePinRecord(pin);
  const source = useDirectorySource();
  const [all, setAll] = useState(false);

  if (lookup.status === 'loading') {
    return (
      <div className="card card-pad stack-sm" aria-busy="true">
        <span className="skeleton" style={{ height: 18, width: '60%' }} />
        <span className="skeleton" style={{ height: 64 }} />
      </div>
    );
  }
  if (lookup.status !== 'found') {
    return (
      <div className="card card-pad small muted">
        PIN {pin} is not in the India Post directory snapshot. It may be new, retired or mistyped.
      </div>
    );
  }

  const offices = lookup.record.offices;
  const shown = all ? offices : offices.slice(0, SHOWN);
  return (
    <section className="card" aria-labelledby="po-h">
      <div className="card-head">
        <h2 id="po-h" className="card-title" style={{ fontSize: 'var(--text-md)' }}>
          <Mail size={16} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Post offices in {pin}
        </h2>
        <span className="tiny muted num">{offices.length}</span>
      </div>
      <ul className="list">
        {shown.map((o) => (
          <li key={o.name} className="list-row" style={{ padding: '8px var(--s-5)' }}>
            <span className="small" style={{ flex: 1, minWidth: 0, color: 'var(--ink)' }}>{o.name}</span>
            <span className="tiny muted" style={{ whiteSpace: 'nowrap' }}>
              {TYPE_LABEL[o.type] ?? o.type}
              {o.delivery ? ' · delivers' : ''}
            </span>
          </li>
        ))}
      </ul>
      {offices.length > SHOWN && (
        <div className="card-body" style={{ paddingTop: 'var(--s-2)', paddingBottom: 0 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAll((v) => !v)} aria-expanded={all}>
            {all ? 'Show fewer' : `Show all ${offices.length}`}
          </button>
        </div>
      )}
      <div className="card-body" style={{ paddingTop: 'var(--s-3)' }}>
        <SourceLine
          source={source ? `India Post, ${source.name}` : 'India Post, All India Pincode Directory'}
          url={source?.url}
          updated={source?.publishedAt ?? source?.syncedAt}
          showMethod={false}
        />
        {source?.via && <p className="tiny muted" style={{ marginTop: 'var(--s-2)' }}>{source.via}</p>}
      </div>
    </section>
  );
}
