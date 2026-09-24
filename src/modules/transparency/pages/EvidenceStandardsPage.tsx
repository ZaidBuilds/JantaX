import { Check } from 'lucide-react';
import { getEvidenceTiers } from '../services/transparencyService';
import { TransparencyLayout } from '../components/TransparencyLayout';
import { Badge, type Tone } from '../../../ui';

const TONES: Tone[] = ['good', 'info', 'warn', 'neutral'];

export function EvidenceStandardsPage() {
  const tiers = getEvidenceTiers();
  return (
    <TransparencyLayout
      current="Evidence standards"
      title="Evidence standards"
      lede="Not all evidence is equal. Each record carries a tier that tells you how much weight it can bear."
    >
      <div className="stack">
        {tiers.map((t) => (
          <article key={t.tierNumber} className="card">
            <div className="card-body">
              <div className="spread" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <span className="tiny muted">Tier {t.tierNumber}</span>
                  <h2 className="card-title" style={{ fontSize: 'var(--text-xl)' }}>{t.tierName}</h2>
                </div>
                <Badge tone={TONES[t.tierNumber - 1]}>Confidence {t.confidenceRange}</Badge>
              </div>
              <p className="small" style={{ color: 'var(--ink-2)', margin: 'var(--s-2) 0 var(--s-4)', maxWidth: 'var(--prose-max)' }}>{t.description}</p>
              <div className="grid-2">
                <div className="inset">
                  <div className="label" style={{ marginBottom: 'var(--s-2)' }}>Typical sources</div>
                  <div className="cluster">
                    {t.sourceTypes.map((s) => <span key={s} className="badge badge-outline">{s}</span>)}
                  </div>
                </div>
                <div className="inset">
                  <div className="label" style={{ marginBottom: 'var(--s-2)' }}>What we check</div>
                  <ul className="stack-sm">
                    {t.verificationCriteria.map((c) => (
                      <li key={c} className="cluster small" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', color: 'var(--ink-2)' }}>
                        <Check size={14} className="text-good" style={{ marginTop: 3 }} aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </TransparencyLayout>
  );
}
