import React, { useMemo } from 'react';
import {
  getCandidateExpendituresForPin,
  CandidateExpenditure,
  ECI_CEILING_LS_LAKHS,
  ECI_CEILING_VS_LAKHS,
} from '../services/shadowExpenditureService';

interface Props {
  pinCode: string;
}

function severityColor(severity: string): string {
  switch (severity) {
    case 'Over Limit': return '#dc2626';
    case 'Borderline': return '#d97706';
    default: return '#16a34a';
  }
}

function severityBg(severity: string): string {
  switch (severity) {
    case 'Over Limit': return '#fef2f2';
    case 'Borderline': return '#fffbeb';
    default: return '#f0fdf4';
  }
}

export function ShadowExpenditureCard({ pinCode }: Props) {
  const candidates = useMemo(() => getCandidateExpendituresForPin(pinCode), [pinCode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Statutory Ceiling Reference ── */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          🔍 ADR Shadow Expenditure Watchdog / एडीआर छाया व्यय पहरेदार
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <CeilingBadge label="Lok Sabha Ceiling" value={`₹${ECI_CEILING_LS_LAKHS} Lakhs`} color="#2563eb" />
          <CeilingBadge label="Vidhan Sabha Ceiling" value={`₹${ECI_CEILING_VS_LAKHS} Lakhs`} color="#7c3aed" />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.6rem', lineHeight: 1.5 }}>
          ECI Expenditure Ceiling (2024 Revision) · Comparison with ADR field-estimated actual spending.
          Shadow Ratio = ADR Estimated ÷ ECI Ceiling. Ratio &gt; 1.0 = statutory limit potentially exceeded.
        </p>
      </div>

      {/* ── Candidate Cards ── */}
      {candidates.map((c) => (
        <CandidateRow key={c.id} candidate={c} />
      ))}

      {/* ── Source Attribution ── */}
      <div
        style={{
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          padding: '0.75rem 1rem',
          borderRadius: 10,
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>
          📄 Sources: Association for Democratic Reforms (ADR) · Election Commission of India (ECI) Affidavits
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="https://adrindia.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
          >
            ADR ↗
          </a>
          <a
            href="https://affidavit.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
          >
            ECI Affidavits ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CeilingBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.85rem',
        borderRadius: 8,
        background: `${color}10`,
        border: `1.5px solid ${color}30`,
      }}
    >
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{label}:</span>
      <span style={{ fontSize: '0.95rem', fontWeight: 900, color }}>{value}</span>
    </div>
  );
}

function CandidateRow({ candidate: c }: { candidate: CandidateExpenditure }) {
  const severity = c.shadowRatio <= 0.8 ? 'Within Limit' : c.shadowRatio <= 1.0 ? 'Borderline' : 'Over Limit';
  const color = severityColor(severity);
  const bg = severityBg(severity);

  return (
    <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${color}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{c.candidateName}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            {c.party} · {c.constituency} · {c.electionType}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              background: bg,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            {severity === 'Over Limit' ? '🚨' : severity === 'Borderline' ? '⚠️' : '✅'} {severity}
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              background: c.electionType === 'Lok Sabha' ? '#eff6ff' : '#f5f3ff',
              color: c.electionType === 'Lok Sabha' ? '#1d4ed8' : '#6d28d9',
              border: `1px solid ${c.electionType === 'Lok Sabha' ? '#bfdbfe' : '#c4b5fd'}`,
            }}
          >
            {c.electionType === 'Lok Sabha' ? 'LS' : 'VS'}
          </span>
        </div>
      </div>

      {/* Financial Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <FinBox label="ECI Ceiling (सीमा)" value={`₹${c.eciStatutoryCeilingLakhs}L`} color="#475569" />
        <FinBox label="Declared (घोषित)" value={`₹${c.eciDeclaredSpendLakhs}L`} color="#2563eb" />
        <FinBox label="ADR Estimated (अनुमानित)" value={`₹${c.adrEstimatedSpendLakhs}L`} color={color} />
        <FinBox label="Shadow Ratio" value={`${c.shadowRatio}×`} color={color} highlight />
      </div>

      {/* Ceiling Threshold Bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '0.3rem' }}>
          ADR Spend vs Statutory Ceiling ({c.electionType})
        </div>
        <div style={{ position: 'relative', height: 22, borderRadius: 6, background: '#f1f5f9', overflow: 'visible' }}>
          {/* ADR bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${Math.min((c.adrEstimatedSpendLakhs / (c.eciStatutoryCeilingLakhs * 2.5)) * 100, 100)}%`,
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              borderRadius: 6,
              transition: 'width 0.4s ease',
            }}
          />
          {/* Ceiling marker */}
          <div
            style={{
              position: 'absolute',
              left: `${(c.eciStatutoryCeilingLakhs / (c.eciStatutoryCeilingLakhs * 2.5)) * 100}%`,
              top: -4,
              height: 30,
              width: 2,
              background: '#0f172a',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${(c.eciStatutoryCeilingLakhs / (c.eciStatutoryCeilingLakhs * 2.5)) * 100}%`,
              top: -18,
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#0f172a',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            ₹{c.eciStatutoryCeilingLakhs}L Ceiling
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ fontSize: '0.78rem', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Expenditure Breakdown:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {c.breakdownCategories.map((cat, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 5,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontWeight: 600,
              }}
            >
              {cat.name}: ₹{cat.amountLakhs}L ({cat.pctOfTotal}%)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinBox({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div
      className="stat-box"
      style={{
        textAlign: 'center',
        padding: '0.6rem',
        background: highlight ? `${color}10` : undefined,
        border: highlight ? `1.5px solid ${color}30` : undefined,
      }}
    >
      <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, marginBottom: '0.2rem', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 900, color }}>{value}</div>
    </div>
  );
}
