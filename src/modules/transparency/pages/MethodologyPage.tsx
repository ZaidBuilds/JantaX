import React from 'react';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { Layers, ShieldCheck, CheckCircle2, FileText, Scale, Cpu, Lock } from 'lucide-react';

export function MethodologyPage() {
  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1050, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          JANTAX METHODOLOGY & DIRECTIVES
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.4rem' }}>
          Core Processing & Neutrality Methodology
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.55 }}>
          How JantaX ingests, verifies, normalizes, and publishes civic data while strictly maintaining neutral, evidence-based rules.
        </p>
      </div>

      {/* 5-Stage Ingestion Pipeline */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem' }}>
          The 5-Stage Data Processing Pipeline
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { stage: '1. Ingestion', title: 'Automated Harvesting & Verification', desc: 'Official datasets are pulled via HTTPS APIs (CPPP, UDISE+, HMIS, CPCB) or parsed from gazette PDFs (CAG, RERA Tribunal Decrees). Raw files are hashed with SHA-256 for immutability.' },
            { stage: '2. Normalization', title: 'Entity & Geo Resolution', desc: 'Records are normalized across state/district boundaries and resolved to 6-digit Indian PIN codes using official Survey of India bounding maps.' },
            { stage: '3. Claim vs Ground Truth', title: 'Dual-Track Side-by-Side Linking', desc: 'Official government targets (e.g. UDISE+ toilet functional, promised RERA delivery date) are paired side-by-side with verified citizen ground check photo drops.' },
            { stage: '4. Neutrality Filter', title: 'Evidence-Based Language Rules', desc: 'Strict algorithmic filters enforce neutral terminology (e.g., "Delayed", "Extended", "Under Review"). Subjective labels like "corrupt" or "fraud" are prohibited unless formally established by a competent authority.' },
            { stage: '5. Public Ledger', title: 'Open Publishing & Source Linking', desc: 'Every record published on JantaX includes direct links back to original primary source documents and competent authority gazette entries.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: 14, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>{item.stage}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.title}</div>
              <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Partisan Rules Card */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
          Non-Partisan & Evidence-Based Neutrality Directives
        </h2>

        <ul style={{ display: 'grid', gap: '0.85rem', color: '#334155', fontSize: '0.9rem', paddingLeft: '1.2rem', lineHeight: 1.55 }}>
          <li><strong>No Standalone Accusations:</strong> JantaX never makes standalone allegations against any contractor, builder, or government agency.</li>
          <li><strong>Competent Authority Principle:</strong> Debarment or penalty status is published strictly when an official competent authority (NHAI, MoRTH, High Court, RERA Tribunal) issues a formal order.</li>
          <li><strong>Data Minimization:</strong> Citizen reporting collects minimum necessary personal data with full support for anonymous reporting.</li>
          <li><strong>Open Source & Reproducible:</strong> Scoring algorithms and data processing rules are completely open and transparent.</li>
        </ul>
      </div>
    </div>
  );
}
