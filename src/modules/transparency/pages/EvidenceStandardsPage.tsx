import React, { useState } from 'react';
import { getEvidenceTiers } from '../services/transparencyService';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { ShieldCheck, FileCheck, Layers, CheckCircle2, Award } from 'lucide-react';

export function EvidenceStandardsPage() {
  const tiers = getEvidenceTiers();

  // Interactive Confidence Level Calculator State
  const [hasExif, setHasExif] = useState(true);
  const [upvotesCount, setUpvotesCount] = useState(12);

  const calculateConfidence = () => {
    let conf = 65;
    if (hasExif) conf += 20;
    if (upvotesCount >= 5) conf += 10;
    if (upvotesCount >= 15) conf += 4;
    return Math.min(99, conf);
  };

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          JANTAX EVIDENCE MATRIX
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.4rem' }}>
          Evidence Tiers & Community Confidence Standards
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.55 }}>
          Clear classification of data provenance tiers from official constitutional gazettes down to EXIF-verified citizen photo drops.
        </p>
      </div>

      {/* 4 Tiers List */}
      <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
        {tiers.map((t) => (
          <div key={t.tierNumber} style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f2d59', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 6 }}>
                  Tier {t.tierNumber} Evidence
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                  {t.tierName}
                </h3>
              </div>
              <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontWeight: 800, fontSize: '0.88rem', padding: '0.35rem 0.85rem', borderRadius: 10 }}>
                {t.confidenceRange}
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1rem' }}>
              {t.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Source Types</div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 700, marginTop: '0.25rem' }}>
                  {t.sourceTypes.join(', ')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verification Criteria</div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, marginTop: '0.25rem' }}>
                  {t.verificationCriteria.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Community Confidence Calculator */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
          Interactive Community Report Confidence Level Calculator
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              EXIF GPS Metadata Match:
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', cursor: 'pointer' }}>
                <input type="radio" checked={hasExif} onChange={() => setHasExif(true)} /> Verified GPS EXIF (+20%)
              </label>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309', cursor: 'pointer' }}>
                <input type="radio" checked={!hasExif} onChange={() => setHasExif(false)} /> Manual Upload (+0%)
              </label>
            </div>

            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Community Upvotes: {upvotesCount}
            </label>
            <input
              type="range"
              min={0}
              max={30}
              value={upvotesCount}
              onChange={(e) => setUpvotesCount(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Computed Report Confidence Level</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
              {calculateConfidence()}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
              Tier 4 Verified Community Ground Report
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
