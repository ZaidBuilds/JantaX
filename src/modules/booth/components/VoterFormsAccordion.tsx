import React from 'react';
import { getVoterFormGuides } from '../services/boothService';
import { FileText, ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';

export function VoterFormsAccordion() {
  const guides = getVoterFormGuides();

  return (
    <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.3rem' }}>
          Official Election Commission of India (ECI) Voter Service Forms
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: 0 }}>
          Direct step-by-step guidance on how to register as a new voter, object to incorrect names, or update address & name errors on the official ECI portal.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {guides.map((g) => (
          <div
            key={g.formType}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ background: 'var(--brand)', color: 'var(--on-solid)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                    {g.formType}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                    {g.title}
                  </h4>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)', fontWeight: 600 }}>
                  {g.purpose}
                </div>
              </div>

              <div>
                <a
                  href={g.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--accent-solid)',
                    color: 'var(--on-solid)',
                    padding: '0.45rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Fill {g.formType} on ECI Portal <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.78rem' }}>
              <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.3rem' }}>
                Required Documents Checklist:
              </strong>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                {g.requiredDocuments.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
