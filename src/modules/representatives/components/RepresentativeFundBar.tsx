import React from 'react';
import { FundSummary } from '../types/representative';
import { IndianRupee, ShieldCheck, Clock } from 'lucide-react';

interface RepresentativeFundBarProps {
  fund: FundSummary;
}

export const RepresentativeFundBar: React.FC<RepresentativeFundBarProps> = ({ fund }) => {
  const util = Math.min(100, Math.max(0, fund.utilizationPercentage));

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '1rem',
        margin: '0.85rem 0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <IndianRupee size={15} style={{ color: '#0f2d59' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f2d59' }}>
            {fund.fundSchemeName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#64748b' }}>
          <Clock size={12} /> Last audited: {fund.lastAuditedDate}
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: 10,
          background: '#e2e8f0',
          borderRadius: 999,
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            width: `${util}%`,
            background: util >= 70 ? '#10b981' : util >= 40 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.4s ease',
          }}
          title={`Utilized: ${util}%`}
        />
      </div>

      {/* Metric Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.5rem',
        }}
      >
        <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8, border: '1px solid #eef2f7' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Entitled / Year</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>₹{fund.entitledAmountCr} Cr</div>
        </div>

        <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8, border: '1px solid #eef2f7' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Govt Released</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>₹{fund.releasedByGovtCr} Cr</div>
        </div>

        <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8, border: '1px solid #eef2f7' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Actual Spent</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>₹{fund.expenditureReportedCr} Cr</div>
        </div>

        <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8, border: '1px solid #eef2f7' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Unspent Balance</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: fund.unspentBalanceCr > 1 ? '#d97706' : '#64748b' }}>
            ₹{fund.unspentBalanceCr} Cr
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8, border: '1px solid #eef2f7' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Utilization Rate</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: util >= 70 ? '#10b981' : '#f59e0b' }}>
            {util}%
          </div>
        </div>
      </div>
    </div>
  );
};
