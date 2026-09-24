import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, HeartPulse, Route, Package, Droplets, ShieldAlert, AlertTriangle, ExternalLink, Camera, SearchX } from 'lucide-react';
import { states, claims, type ClaimData } from '../data/rawSeedData';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode, isValidIndianPincode } from '../../../core/utils/pinResolver';
import { api } from '../../../core/services/api';
import { Badge, EmptyState, Stat, useToast } from '../../../ui';
import { EvidenceCard, SectionTitle } from '../../shared/ModuleKit';

const CATEGORIES = [
  { key: 'school', label: 'Schools', hi: 'स्कूल', icon: Building2 },
  { key: 'hospital', label: 'Hospitals', hi: 'अस्पताल', icon: HeartPulse },
  { key: 'road', label: 'Roads', hi: 'सड़क', icon: Route },
  { key: 'ration', label: 'Ration', hi: 'राशन', icon: Package },
  { key: 'water', label: 'Water', hi: 'पानी', icon: Droplets },
  { key: 'police', label: 'Policing', hi: 'पुलिस', icon: ShieldAlert },
];

const codeByStateName: Record<string, string> = Object.fromEntries(states.map((s) => [s.name, s.code]));

function stateCodeForPin(pin: string): string {
  const r = resolvePincode(pin);
  return r.isValid ? codeByStateName[r.state] || '' : '';
}

interface PhotoDrop {
  id: string;
  pincode: string;
  district: string;
  category: string;
  description: string;
  when: string;
}

export function AndhbhaktDash() {
  const { share } = useWhatsAppShare();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const pin = params.get('pin') || '';
  const stateCode = params.get('state') || (isValidIndianPincode(pin) ? stateCodeForPin(pin) : '');
  const cat = params.get('cat') || '';
  const [pinDraft, setPinDraft] = useState(pin);
  useEffect(() => setPinDraft(pin), [pin]);

  const [drops, setDrops] = useState<PhotoDrop[]>([
    { id: '1', pincode: '226001', district: 'Lucknow', category: 'hospital', description: 'Ward locked during visiting hours at the district hospital.', when: '2 hours ago' },
    { id: '2', pincode: '823001', district: 'Gaya', category: 'water', description: 'Public tap dry for three weeks.', when: '5 hours ago' },
  ]);
  const [form, setForm] = useState({ pin: '', category: 'school', description: '' });

  const update = (next: Record<string, string>) => {
    const sp = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    setParams(sp, { replace: true });
  };

  const list = useMemo(() => {
    let out: ClaimData[] = [...claims];
    if (isValidIndianPincode(pin)) {
      const exact = out.filter((c) => String(c.pincode) === pin);
      out = exact.length ? exact : out.filter((c) => c.stateCode === stateCodeForPin(pin));
    } else if (stateCode) {
      out = out.filter((c) => c.stateCode === stateCode);
    }
    if (cat) out = out.filter((c) => c.category === cat);
    return out;
  }, [pin, stateCode, cat]);

  const stats = useMemo(() => {
    const allocated = claims.reduce((a, c) => a + (c.budgetAllocated || 0), 0);
    const spent = claims.reduce((a, c) => a + (c.budgetSpent || 0), 0);
    return {
      total: claims.length,
      verified: claims.filter((c) => c.verified).length,
      states: new Set(claims.map((c) => c.stateCode)).size,
      allocated,
      spent,
    };
  }, []);

  const submitDrop = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidIndianPincode(form.pin) || form.description.trim().length < 10) {
      toast('Add a valid PIN and a short description');
      return;
    }
    try {
      await api.submitReport({ pincode: form.pin, module: 'andhbhakt', category: form.category, description: form.description.trim() });
      toast('Sent for moderation');
    } catch {
      toast('Saved on this device. We will send it when you are back online');
    }
    setDrops((d) => [{ id: String(Date.now()), pincode: form.pin, district: resolvePincode(form.pin).district, category: form.category, description: form.description.trim(), when: 'Just now' }, ...d]);
    setForm({ pin: '', category: form.category, description: '' });
  };

  return (
    <div className="stack" style={{ gap: 'var(--s-6)' }}>
      <div className="callout callout-warn">
        <AlertTriangle size={16} aria-hidden="true" />
        <span>
          <strong>Sample records.</strong> The claims below are placeholder entries used to design this module. They have not yet been checked against
          the linked statements and audit reports. Do not cite them until each one is marked verified by a reviewer.
        </span>
      </div>

      <div className="card card-pad cm-filters">
        <form
          className="field"
          onSubmit={(e) => {
            e.preventDefault();
            if (pinDraft && !isValidIndianPincode(pinDraft)) {
              toast('Enter a valid 6-digit PIN');
              return;
            }
            update({ pin: pinDraft, state: pinDraft ? stateCodeForPin(pinDraft) : stateCode });
          }}
        >
          <label className="label" htmlFor="cm-pin">PIN code</label>
          <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
            <input id="cm-pin" className="input num" style={{ width: 130 }} inputMode="numeric" maxLength={6} placeholder="Any" value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ''))} />
            <button type="submit" className="btn btn-secondary">Apply</button>
          </div>
        </form>
        <div className="field">
          <label className="label" htmlFor="cm-state">State</label>
          <select id="cm-state" className="select" value={stateCode} onChange={(e) => update({ state: e.target.value, pin: '' })}>
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ flex: '1 1 100%' }}>
          <span className="label">Topic</span>
          <div className="cluster" role="group" aria-label="Topic">
            <button type="button" className="chip" aria-pressed={!cat} onClick={() => update({ cat: '' })}>All topics</button>
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" className="chip" aria-pressed={cat === key} onClick={() => update({ cat: cat === key ? '' : key })}>
                <Icon size={14} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <Stat label="Claims tracked" value={stats.total} meta={`${stats.verified} marked verified`} />
        <Stat label="States covered" value={stats.states} meta={`of ${states.length}`} />
        <Stat label="Budget referenced" value={`₹${Math.round(stats.allocated).toLocaleString('en-IN')}`} unit=" Cr" meta={`₹${Math.round(stats.spent).toLocaleString('en-IN')} Cr reported spent`} />
        <Stat label="Citizen photos" value={drops.length} meta="Awaiting moderation" />
      </div>

      <SectionTitle
        title={`${list.length} ${list.length === 1 ? 'claim' : 'claims'}`}
        sub={stateCode ? states.find((s) => s.code === stateCode)?.name : 'All states'}
      />

      {list.length === 0 ? (
        <div className="card">
          <EmptyState icon={SearchX} title="No claims recorded for this filter" text="Try another state or topic." action={<button type="button" className="btn btn-secondary" onClick={() => setParams({}, { replace: true })}>Clear filters</button>} />
        </div>
      ) : (
        list.map((c, i) => {
          const topic = CATEGORIES.find((x) => x.key === c.category);
          return (
            <EvidenceCard
              key={`${c.stateCode}-${c.pincode}-${i}`}
              title={c.claimTextEn}
              hindi={c.claimTextHi}
              meta={`${c.claimedBy}, ${c.claimedByDesignation} · ${c.claimOccasion} · ${c.claimDate} · ${c.district}`}
              status={c.verified ? { label: 'Marked verified', tone: 'good' } : { label: 'Unverified', tone: 'warn' }}
              claimLabel="Public statement"
              realityLabel="Audit or field finding"
              claim={
                <div className="stack-sm">
                  <span className="stat-value" style={{ fontSize: 'var(--text-lg)' }}>{c.claimNumber}</span>
                  {c.sourceUrl && (
                    <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="small">
                      Statement ({c.sourceType}) <ExternalLink size={11} style={{ display: 'inline' }} aria-hidden="true" />
                    </a>
                  )}
                </div>
              }
              reality={
                <div className="stack-sm">
                  <span className="stat-value" style={{ fontSize: 'var(--text-lg)' }}>{c.realityNumber}</span>
                  <p className="small" style={{ color: 'var(--ink)' }}>{c.realityTextEn}</p>
                </div>
              }
              responsible={c.officerName ? `${c.officerName}, ${c.officerDesignation} (${c.officerDept})` : undefined}
              source={{ name: c.verificationSource || 'Pending verification', updated: c.realityDate }}
              recordRef={`cm-claim-${c.stateCode}-${c.pincode}-${i}`}
              onShare={() =>
                share({
                  pinCode: String(c.pincode),
                  titleHindi: c.claimTextHi,
                  titleEnglish: c.claimTextEn,
                  claimLabel: c.claimNumber,
                  claimLabelHindi: c.claimNumber,
                  realityLabel: c.realityNumber,
                  realityLabelHindi: c.realityNumber,
                  responsiblePerson: c.officerName || c.contractorName || 'Not recorded',
                  responsibleOrg: c.officerDept || c.contractorFirm || 'Not recorded',
                  sourceUrl: c.sourceUrl,
                  moduleNameHindi: 'मुख्यमंत्री दावे बनाम ऑडिट',
                })
              }
            >
              {topic && (
                <div className="cluster">
                  <Badge><topic.icon size={12} aria-hidden="true" /> {topic.label}</Badge>
                  {c.budgetAllocated > 0 && <Badge>₹{c.budgetAllocated} Cr allocated, ₹{c.budgetSpent} Cr spent</Badge>}
                </div>
              )}
            </EvidenceCard>
          );
        })
      )}

      <section className="grid-2" style={{ alignItems: 'start' }} aria-labelledby="drops-h">
        <form className="card card-pad-lg stack" onSubmit={submitDrop}>
          <h2 id="drops-h" className="card-title">Add a photo from the ground</h2>
          <p className="small muted">Anonymous. Location data is stripped. A moderator reviews it before it appears.</p>
          <div className="grid-2">
            <div className="field">
              <label className="label" htmlFor="drop-pin">PIN code</label>
              <input id="drop-pin" className="input num" inputMode="numeric" maxLength={6} value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <div className="field">
              <label className="label" htmlFor="drop-cat">Topic</label>
              <select id="drop-cat" className="select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="drop-desc">What did you see?</label>
            <textarea id="drop-desc" className="textarea" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Camera size={16} aria-hidden="true" /> Submit for review
          </button>
        </form>
        <div className="card">
          <div className="card-head">
            <h2 className="card-title" style={{ fontSize: 'var(--text-md)' }}>Recent submissions</h2>
            <Badge tone="warn">In moderation</Badge>
          </div>
          <div className="list">
            {drops.map((d) => (
              <div key={d.id} className="list-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="small" style={{ color: 'var(--ink)' }}>{d.description}</div>
                  <div className="tiny muted">
                    {CATEGORIES.find((c) => c.key === d.category)?.label} · PIN {d.pincode} · {d.district} · {d.when}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
