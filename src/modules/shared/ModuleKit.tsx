import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Share2, Flag, User } from 'lucide-react';
import { usePin } from '../../core/context/PinContext';
import { isValidIndianPincode, resolvePincode, type ResolvedLocation } from '../../core/utils/pinResolver';
import { Badge, ClaimReality, SourceLine, type Tone } from '../../ui';

/**
 * Shared building blocks for module dashboards so every module reads the same:
 * a PIN bar synced to ?pin=, evidence cards with claim vs reality, and a
 * provenance footer with share and correction actions.
 */

export function useModulePin(): { pin: string; loc: ResolvedLocation; setPin: (p: string) => void } {
  const [params, setParams] = useSearchParams();
  const { selectedPin, setSelectedPin } = usePin();
  const fromUrl = params.get('pin') || '';
  const pin = isValidIndianPincode(fromUrl) ? fromUrl : selectedPin;

  useEffect(() => {
    if (pin !== selectedPin) setSelectedPin(pin);
  }, [pin, selectedPin, setSelectedPin]);

  const setPin = useCallback(
    (p: string) => {
      if (!isValidIndianPincode(p)) return;
      const next = new URLSearchParams(params);
      next.set('pin', p);
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  return { pin, loc: resolvePincode(pin), setPin };
}

export function ModulePinBar({ pin, loc, onChange, children }: { pin: string; loc: ResolvedLocation; onChange: (p: string) => void; children?: ReactNode }) {
  const [draft, setDraft] = useState(pin);
  useEffect(() => setDraft(pin), [pin]);
  const invalid = draft.length > 0 && draft.length === 6 && !isValidIndianPincode(draft);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isValidIndianPincode(draft)) onChange(draft);
  };
  return (
    <div className="card card-pad module-pinbar">
      <form onSubmit={submit} className="cluster" style={{ flexWrap: 'nowrap' }}>
        <div className="input-group" style={{ width: 170 }}>
          <MapPin size={16} aria-hidden="true" />
          <input
            className="input num"
            inputMode="numeric"
            maxLength={6}
            aria-label="PIN code"
            aria-invalid={invalid || undefined}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <button type="submit" className="btn btn-primary">Show</button>
      </form>
      <div className="module-pinbar-loc">
        <span className="strong">{loc.isValid ? `${loc.district}, ${loc.state}` : 'Unknown area'}</span>
        <span className="tiny muted">Showing records for PIN {pin}</span>
      </div>
      {children && <div className="module-pinbar-extra">{children}</div>}
    </div>
  );
}

export interface KvItem {
  label: ReactNode;
  value: ReactNode;
  tone?: 'good' | 'warn' | 'bad';
}

export function Kv({ items }: { items: KvItem[] }) {
  return (
    <dl className="kv-list">
      {items.map((it, i) => (
        <div key={i}>
          <dt>{it.label}</dt>
          <dd className={it.tone ? `text-${it.tone}` : undefined}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface EvidenceCardProps {
  title: ReactNode;
  hindi?: ReactNode;
  meta?: ReactNode;
  status?: { label: string; tone: Tone };
  claim: ReactNode;
  reality: ReactNode;
  claimLabel?: string;
  realityLabel?: string;
  finding?: ReactNode;
  findingTone?: 'warn' | 'bad' | 'info';
  responsible?: string;
  source: { name: string; url?: string; updated?: string };
  recordRef: string;
  onShare?: () => void;
  children?: ReactNode;
}

export function EvidenceCard(p: EvidenceCardProps) {
  return (
    <article className="card evidence-card">
      <div className="card-body stack">
        <header className="spread" style={{ alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
            <h3 className="card-title">{p.title}</h3>
            {p.hindi && <p className="small muted" lang="hi">{p.hindi}</p>}
            {p.meta && <p className="tiny muted" style={{ marginTop: 4 }}>{p.meta}</p>}
          </div>
          {p.status && <Badge tone={p.status.tone}>{p.status.label}</Badge>}
        </header>
        <ClaimReality claimLabel={p.claimLabel} realityLabel={p.realityLabel} claim={p.claim} reality={p.reality} />
        {p.finding && (
          <div className={`callout callout-${p.findingTone || 'warn'}`}>
            <span>{p.finding}</span>
          </div>
        )}
        {p.children}
        {p.responsible && (
          <p className="small cluster" style={{ color: 'var(--ink-2)' }}>
            <User size={14} className="muted" aria-hidden="true" />
            Responsible: <strong style={{ color: 'var(--ink)' }}>{p.responsible}</strong>
          </p>
        )}
      </div>
      <div className="card-foot">
        <SourceLine source={p.source.name} url={p.source.url} updated={p.source.updated} showMethod={false} />
        <div className="cluster">
          <Link to={`/transparency/corrections?ref=${encodeURIComponent(p.recordRef)}`} className="btn btn-ghost btn-sm">
            <Flag size={13} aria-hidden="true" /> Report a data issue
          </Link>
          {p.onShare && (
            <button type="button" className="btn btn-share btn-sm" onClick={p.onShare}>
              <Share2 size={13} aria-hidden="true" /> Share on WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function SectionTitle({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-head" style={{ marginTop: 'var(--s-2)' }}>
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/** Stable per-PIN number so sample figures do not jump between renders. */
export function pinSeed(pin: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < pin.length; i++) {
    h ^= pin.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function pct(part: number, whole: number) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}
