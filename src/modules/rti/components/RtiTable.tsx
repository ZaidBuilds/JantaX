import React from 'react';
import { Link } from 'react-router-dom';
import type { PublicAuthority } from '../types/rti';
import { Clock, AlertTriangle, ChevronRight, UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  authorities: PublicAuthority[];
}

export function RtiTable({ authorities }: Props) {
  if (authorities.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: 0 }}>
          No public authorities found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Public Authority & Level</th>
            <th style={{ padding: '0.85rem 1rem' }}>Avg Response Speed</th>
            <th style={{ padding: '0.85rem 1rem' }}>On-Time Disposals</th>
            <th style={{ padding: '0.85rem 1rem' }}>Rejection Rate</th>
            <th style={{ padding: '0.85rem 1rem' }}>Designated CPIO</th>
            <th style={{ padding: '0.85rem 1rem' }}>Online Filing</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {authorities.map((a) => {
            const isCompliant = a.avgResponseDays <= 30;

            return (
              <tr
                key={a.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {a.authorityName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.15rem' }}>
                    {a.parentMinistry}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--brand-ink)', fontWeight: 600 }}>
                    {a.governmentLevel}
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: isCompliant ? 'var(--good)' : 'var(--bad)', fontSize: '0.95rem' }}>
                    {a.avgResponseDays} Days
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                    Statutory limit: 30 days
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: a.disposedWithin30DaysPercent >= 85 ? 'var(--good)' : 'var(--warn)' }}>
                    {a.disposedWithin30DaysPercent}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                    {a.totalRequestsReceivedAnnual.toLocaleString('en-IN')} annual RTIs
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span
                    className={a.rejectionRatePercent > 5 ? 'jantax-badge-alert' : 'jantax-badge-good'}
                    style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}
                  >
                    {a.rejectionRatePercent}% Rejected
                  </span>
                </td>

                <td style={{ padding: '1rem', maxWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.8rem' }}>
                    {a.cpio.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                    {a.cpio.designation}
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  {a.onlineFilingSupported ? (
                    <span style={{ color: 'var(--good)', fontWeight: 700, fontSize: '0.78rem' }}>
                      ✓ rtionline.gov.in
                    </span>
                  ) : (
                    <span style={{ color: 'var(--bad)', fontWeight: 700, fontSize: '0.78rem' }}>
                      Offline Only
                    </span>
                  )}
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/rti/authorities/${a.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      background: 'var(--brand)',
                      color: 'var(--on-solid)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Inspect <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
