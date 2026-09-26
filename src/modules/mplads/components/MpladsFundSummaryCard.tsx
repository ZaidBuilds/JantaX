import React from 'react';
import type { FundSummary } from '../types/mplads';
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  fund: FundSummary;
  houseTitle?: string;
}

export function MpladsFundSummaryCard({ fund, houseTitle = '5-Year MPLADS Quota' }: Props) {
  const isHighUtilization = fund.utilizationPercentage >= 75;
  const isModerate = fund.utilizationPercentage >= 50 && fund.utilizationPercentage < 75;

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Fund Utilization & Expenditure Ledger
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            {houseTitle} • Audited by Ministry of Statistics (MoSPI)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className={
              isHighUtilization
                ? 'jantax-badge-good'
                : isModerate
                ? 'jantax-badge-warn'
                : 'jantax-badge-alert'
            }
            style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0.3rem 0.8rem' }}
          >
            {fund.utilizationPercentage}% Utilized
          </span>
        </div>
      </div>

      {/* 4-Stat Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Govt Released
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.25rem' }}>
            ₹{fund.releasedByGovtCr.toFixed(2)} Cr
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Of ₹{fund.entitledAmountCr} Cr Entitled</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Sanctioned Works
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.25rem' }}>
            ₹{fund.sanctionedWorksCr.toFixed(2)} Cr
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>District Collector Approved</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Actual Spent
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--good)', marginTop: '0.25rem' }}>
            ₹{fund.expenditureReportedCr.toFixed(2)} Cr
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>UCs (Util Certs) Submitted</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Unspent Balance
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--warn)', marginTop: '0.25rem' }}>
            ₹{fund.unspentBalanceCr.toFixed(2)} Cr
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Available for Sanction</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.4rem' }}>
          <span>Overall Fund Execution Progress</span>
          <span>{fund.utilizationPercentage}% of Released Funds</span>
        </div>
        <div style={{ width: '100%', height: 10, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(fund.utilizationPercentage, 100)}%`,
              height: '100%',
              background: isHighUtilization ? 'var(--good-solid)' : isModerate ? 'var(--warn-solid)' : 'var(--bad-solid)',
              borderRadius: 9999,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
