import React from 'react';
import { Clock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  avgDays: number;
  disposedWithin30DaysPercent: number;
  pendingBeyond30DaysPercent: number;
  rejectionRate: number;
}

export function RtiClockCard({ avgDays, disposedWithin30DaysPercent, pendingBeyond30DaysPercent, rejectionRate }: Props) {
  const isCompliant = avgDays <= 30;
  const isDelayed = avgDays > 30;

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: 0 }}>
            Statutory RTI Response Clock & Disposal Compliance
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Audited under Section 25 of RTI Act 2005 (Central Information Commission)
          </span>
        </div>

        <div>
          <span
            className={isCompliant ? 'jantax-badge-good' : 'jantax-badge-alert'}
            style={{ fontSize: '0.82rem', fontWeight: 800, padding: '0.25rem 0.75rem' }}
          >
            {isCompliant ? '✓ Statutorily Compliant' : '⚠ Delayed Beyond 30 Days'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Avg Response Time
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isCompliant ? '#10b981' : '#dc2626', marginTop: '0.25rem' }}>
            {avgDays} Days
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Statutory limit: 30 days</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            On-Time Disposals
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>
            {disposedWithin30DaysPercent}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Within 30-day window</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Delayed Requests
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pendingBeyond30DaysPercent > 10 ? '#ef4444' : '#f59e0b', marginTop: '0.25rem' }}>
            {pendingBeyond30DaysPercent}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Deemed Refusal Risk</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Rejection Rate
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: rejectionRate > 5 ? '#dc2626' : '#10b981', marginTop: '0.25rem' }}>
            {rejectionRate}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Section 8 Exemptions</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
          <span>Timely Resolution Ratio</span>
          <span>{disposedWithin30DaysPercent}% on-time response</span>
        </div>
        <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${disposedWithin30DaysPercent}%`,
              height: '100%',
              background: disposedWithin30DaysPercent >= 85 ? '#10b981' : disposedWithin30DaysPercent >= 70 ? '#f59e0b' : '#ef4444',
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    </div>
  );
}
