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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Statutory RTI Response Clock & Disposal Compliance
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            Audited under Section 25 of RTI Act 2005 (Central Information Commission)
          </span>
        </div>

        <div>
          <span
            className={isCompliant ? 'jantax-badge-good' : 'jantax-badge-alert'}
            style={{ fontSize: '0.82rem', fontWeight: 800, padding: '0.25rem 0.75rem' }}
          >
            {isCompliant ? '✓ Statutorily Compliant' : 'Delayed Beyond 30 Days'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Avg Response Time
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isCompliant ? 'var(--good)' : 'var(--bad)', marginTop: '0.25rem' }}>
            {avgDays} Days
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Statutory limit: 30 days</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            On-Time Disposals
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.25rem' }}>
            {disposedWithin30DaysPercent}%
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Within 30-day window</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Delayed Requests
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pendingBeyond30DaysPercent > 10 ? 'var(--bad)' : 'var(--warn)', marginTop: '0.25rem' }}>
            {pendingBeyond30DaysPercent}%
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Deemed Refusal Risk</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Rejection Rate
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: rejectionRate > 5 ? 'var(--bad)' : 'var(--good)', marginTop: '0.25rem' }}>
            {rejectionRate}%
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Section 8 Exemptions</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.4rem' }}>
          <span>Timely Resolution Ratio</span>
          <span>{disposedWithin30DaysPercent}% on-time response</span>
        </div>
        <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${disposedWithin30DaysPercent}%`,
              height: '100%',
              background: disposedWithin30DaysPercent >= 85 ? 'var(--good-solid)' : disposedWithin30DaysPercent >= 70 ? 'var(--warn-solid)' : 'var(--bad-solid)',
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    </div>
  );
}
