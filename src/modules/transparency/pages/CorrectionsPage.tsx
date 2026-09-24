import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { getCorrectionRequests, submitCorrectionRequest } from '../services/transparencyService';
import type { CorrectionRequest } from '../types/transparency';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, toneForStatus } from '../../../ui';

type Kind = CorrectionRequest['requestType'];

export function CorrectionsPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>(() => getCorrectionRequests());
  const [kind, setKind] = useState<Kind>('Citizen Correction Request');
  const [params] = useSearchParams();
  const [form, setForm] = useState({ submitterName: '', organization: '', email: '', entityId: params.get('ref') || '', claimDetails: '', supportingGazetteUrl: '' });
  const [done, setDone] = useState<CorrectionRequest | null>(null);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const created = submitCorrectionRequest({
      requestType: kind,
      submitterName: form.submitterName.trim(),
      organization: form.organization.trim() || undefined,
      email: form.email.trim(),
      entityId: form.entityId.trim(),
      claimDetails: form.claimDetails.trim(),
      supportingGazetteUrl: form.supportingGazetteUrl.trim() || undefined,
    });
    setRequests((r) => [created, ...r]);
    setDone(created);
    setForm({ submitterName: '', organization: '', email: '', entityId: '', claimDetails: '', supportingGazetteUrl: '' });
  };

  return (
    <TransparencyLayout
      current="Corrections"
      title="Corrections"
      lede="Anyone can challenge a published figure: residents, contractors, builders or government offices. Disputed records are flagged, the original is kept, and every decision is logged here."
    >
      <div className="corrections-grid">
        <form className="card card-pad-lg stack" onSubmit={submit}>
          <h2 className="card-title">Request a correction</h2>
          <div className="segmented" role="group" aria-label="Request type">
            <button type="button" aria-pressed={kind === 'Citizen Correction Request'} onClick={() => setKind('Citizen Correction Request')}>I am a citizen</button>
            <button type="button" aria-pressed={kind === 'Official Data Challenge'} onClick={() => setKind('Official Data Challenge')}>I represent an office or firm</button>
          </div>
          {done && (
            <div className="callout callout-good" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Request <span className="mono">{done.id}</span> received. We review corrections within 72 hours and log the outcome below.</span>
            </div>
          )}
          <div className="grid-2">
            <div className="field">
              <label className="label" htmlFor="c-name">Your name</label>
              <input id="c-name" className="input" required value={form.submitterName} onChange={set('submitterName')} autoComplete="name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="c-email">Email</label>
              <input id="c-email" type="email" className="input" required value={form.email} onChange={set('email')} autoComplete="email" />
              <span className="hint">Only used to tell you the outcome.</span>
            </div>
          </div>
          {kind === 'Official Data Challenge' && (
            <div className="field">
              <label className="label" htmlFor="c-org">Office or organisation</label>
              <input id="c-org" className="input" required value={form.organization} onChange={set('organization')} autoComplete="organization" />
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="c-entity">Record reference</label>
            <input id="c-entity" className="input" required placeholder="e.g. project ID, UDISE code or page link" value={form.entityId} onChange={set('entityId')} />
          </div>
          <div className="field">
            <label className="label" htmlFor="c-details">What is wrong, and what should it say?</label>
            <textarea id="c-details" className="textarea" required minLength={20} value={form.claimDetails} onChange={set('claimDetails')} />
          </div>
          <div className="field">
            <label className="label" htmlFor="c-url">Supporting document link {kind === 'Citizen Correction Request' && <span className="muted">(optional)</span>}</label>
            <input id="c-url" type="url" className="input" required={kind === 'Official Data Challenge'} placeholder="https://" value={form.supportingGazetteUrl} onChange={set('supportingGazetteUrl')} />
            <span className="hint">A gazette notification, order or official page that shows the correct figure.</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit request</button>
        </form>

        <section aria-labelledby="log-h">
          <h2 id="log-h" className="section-title" style={{ marginBottom: 'var(--s-3)' }}>Public log</h2>
          <div className="card list">
            {requests.map((r) => (
              <div key={r.id} className="list-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
                <div className="spread" style={{ width: '100%' }}>
                  <span className="tiny muted mono">{r.entityId}</span>
                  <Badge tone={toneForStatus(r.status === 'Accepted & Updated' ? 'resolved' : r.status === 'Rejected' ? 'rejected' : 'review')}>{r.status}</Badge>
                </div>
                <p className="small" style={{ color: 'var(--ink)' }}>{r.claimDetails}</p>
                {r.resolutionNote && <p className="tiny muted">Outcome: {r.resolutionNote}</p>}
                <div className="source-row">
                  <span>{r.requestType === 'Official Data Challenge' ? r.organization || 'Official challenge' : 'Citizen request'}</span>
                  <span>{r.submittedAt}</span>
                  {r.supportingGazetteUrl && (
                    <a href={r.supportingGazetteUrl} target="_blank" rel="noreferrer">Document <ExternalLink size={11} style={{ display: 'inline' }} aria-hidden="true" /></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TransparencyLayout>
  );
}
