import React from 'react';
import { getScoringFormulas } from '../services/transparencyService';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { Award, Layers, Calculator, CheckCircle2, FileText } from 'lucide-react';

export function ScoringPage() {
  const formulas = getScoringFormulas();

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          TRANSPARENT MATHEMATICAL ALGORITHMS
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.4rem' }}>
          Scoring Formulas & Algorithmic Index Standards
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.55 }}>
          Every score on JantaX is 100% mathematical and open. No subjective opinion, bias, or editorial rating is ever applied.
        </p>
      </div>

      {/* Scoring Formulas Cards List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {formulas.map((item) => (
          <div key={item.id} style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f2d59', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 6 }}>
                  Module: {item.targetModule}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  {item.indexName}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {item.descriptionText}
            </p>

            {/* LaTeX Mathematical Formula Render Container */}
            <div style={{ background: '#0f2d59', color: '#ffffff', padding: '1.25rem', borderRadius: 14, marginBottom: '1.25rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700 }}>
              \[ {item.formulaTex} \]
            </div>

            {/* Parameter Weightings Table */}
            <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Mathematical Parameter Weightings
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {item.parameters.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#0f172a' }}>
                    <span><strong>{p.name}</strong> — {p.description}</span>
                    <span style={{ fontWeight: 800, color: p.weightPct < 0 ? '#b91c1c' : '#047857' }}>
                      {p.weightPct > 0 ? `+${p.weightPct}%` : `${p.weightPct}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worked Example */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#1e40af', lineHeight: 1.45 }}>
              <strong>Worked Calculation Example:</strong> {item.exampleCalculation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
