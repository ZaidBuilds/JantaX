import React, { useMemo } from 'react';
import {
  getFundUtilizationForPin,
  computeUtilizationSummary,
  FundUtilizationEntry,
  FundUtilizationSummary,
} from '../services/fundUtilizationService';
import { ProvenanceBar, DisclaimerBar } from '../../../components/UI/Provenance';

interface Props {
  pinCode: string;
}

function severityColor(pct: number): string {
  if (pct >= 75) return '#10b981';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
}

function severityBg(pct: number): string {
  if (pct >= 75) return '#ecfdf5';
  if (pct >= 50) return '#fffbeb';
  return '#fef2f2';
}

function severityLabel(pct: number): string {
  if (pct >= 75) return 'Normal';
  if (pct >= 50) return 'Under-utilized';
  return 'Critical';
}

export function FundUtilizationAuditCard({ pinCode }: Props) {
  const entries = useMemo(() => getFundUtilizationForPin(pinCode), [pinCode]);
  const summary = useMemo(() => computeUtilizationSummary(entries), [entries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Summary Row ── */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📊 CAG Fund Utilization Summary / सीएजी निधि उपयोग सारांश
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          <SummaryBox label="Sanctioned (आवंटित)" value={`₹${summary.totalSanctionedCr} Cr`} color="#2563eb" />
          <SummaryBox label="Actual Spent (व्यय)" value={`₹${summary.totalActualCr} Cr`} color="#10b981" />
          <SummaryBox label="Unspent (अव्ययित)" value={`₹${summary.totalUnspentCr} Cr`} color="#f59e0b" />
          <SummaryBox label="Utilization %" value={`${summary.overallUtilizationPct}%`} color={severityColor(summary.overallUtilizationPct)} />
          <SummaryBox label="Lapsed (लैप्स)" value={`₹${summary.lapsedFundsCr} Cr`} color="#ef4444" />
          <SummaryBox label="Critical Heads" value={`${summary.criticalUnderutilizedHeads}`} color={summary.criticalUnderutilizedHeads > 0 ? '#ef4444' : '#10b981'} />
        </div>
      </div>

      {/* ── Lapsed Funds Alert ── */}
      {summary.lapsedFundsCr > 0 && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 12,
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              GFR Rule 56 — Treasury Lapsing Alert / कोषागार लैप्सिंग चेतावनी
            </div>
            <div style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.6 }}>
              ₹{summary.lapsedFundsCr} Cr reverted to the Consolidated Fund at fiscal year-end without utilization.
              Under General Financial Rules 2017 (Rule 56), unspent balances in Capital and Revenue heads lapse automatically
              unless re-appropriated by competent authority before March 31.
            </div>
          </div>
        </div>
      )}

      {/* ── Head-of-Account Breakdown ── */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Head-of-Account Breakdown / मदवार विवरण
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {entries.map((entry) => (
            <HeadRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      <ProvenanceBar
        observedAt={new Date().toISOString().slice(0, 10)}
        sourceAt="CAG Audit Reports & State AG Appropriation Accounts"
        recalcAt={new Date().toISOString().slice(0, 10)}
        sourceUrl="https://cag.gov.in"
        sourceLabel="CAG ↗"
        sampleSize={entries.length}
        reportingDays={1}
        agreementRate={1}
      />
      <DisclaimerBar />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="stat-box" style={{ textAlign: 'center', padding: '0.75rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.15rem', fontWeight: 900, color }}>
        {value}
      </div>
    </div>
  );
}

function HeadRow({ entry }: { entry: FundUtilizationEntry }) {
  const color = severityColor(entry.utilizationRatioPct);
  const bg = severityBg(entry.utilizationRatioPct);

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 10,
        background: bg,
        border: `1px solid ${color}33`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{entry.headOfAccount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{entry.subHead}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.2rem 0.55rem',
              borderRadius: 6,
              background: color,
              color: '#fff',
            }}
          >
            {entry.utilizationRatioPct}%
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: 6,
              background: entry.isLapsed ? '#fef2f2' : '#f0fdf4',
              color: entry.isLapsed ? '#b91c1c' : '#166534',
              border: `1px solid ${entry.isLapsed ? '#fecaca' : '#bbf7d0'}`,
            }}
          >
            {entry.isLapsed ? '🔴 LAPSED' : '✅ Active'}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: 6,
              background: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0',
            }}
          >
            {entry.lapsingCategory}
          </span>
        </div>
      </div>

      {/* Financial Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
        <div><span style={{ color: '#64748b' }}>Sanctioned:</span> <strong>₹{entry.sanctionedCr} Cr</strong></div>
        <div><span style={{ color: '#64748b' }}>Actual:</span> <strong>₹{entry.actualExpenditureCr} Cr</strong></div>
        <div><span style={{ color: '#64748b' }}>Unspent:</span> <strong style={{ color: entry.unspentBalanceCr > 0 ? '#dc2626' : '#16a34a' }}>₹{entry.unspentBalanceCr} Cr</strong></div>
      </div>

      {/* Progress Bar */}
      <div className="progress-track" style={{ marginBottom: '0.6rem' }}>
        <div className="progress-fill" style={{ width: `${Math.min(entry.utilizationRatioPct, 100)}%`, background: color }} />
      </div>

      {/* CAG Observation */}
      <blockquote
        style={{
          margin: 0,
          padding: '0.6rem 0.8rem',
          borderLeft: `3px solid ${color}`,
          background: '#ffffff',
          borderRadius: '0 6px 6px 0',
          fontSize: '0.76rem',
          color: '#334155',
          lineHeight: 1.55,
          fontStyle: 'italic',
        }}
      >
        <strong>CAG Observation:</strong> {entry.auditObservation}
        <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: '#64748b', fontStyle: 'normal' }}>
          📄 {entry.sourceReference}
        </div>
      </blockquote>
    </div>
  );
}
