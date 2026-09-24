import React from 'react';
import { getCnrSteps } from '../services/courtsService';
import { Search, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export function CnrGuideCard() {
  const steps = getCnrSteps();

  return (
    <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.3rem' }}>
            How to Track Your Case via 16-Digit CNR Number on eCourts
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: 0 }}>
            Every pending district court case in India has a unique CNR number allowing instant tracking of daily order sheets and cause lists.
          </p>
        </div>

        <div>
          <a
            href="https://services.ecourts.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--accent-solid)',
              color: 'var(--on-solid)',
              padding: '0.55rem 1.1rem',
              borderRadius: 10,
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Open Official eCourts Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {steps.map((s) => (
          <div
            key={s.stepNumber}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  color: 'var(--on-solid)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                }}
              >
                {s.stepNumber}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                {s.title}
              </h4>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: '0.6rem' }}>
              {s.description}
            </p>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: 'var(--brand-ink)', fontWeight: 600 }}>
              {s.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
