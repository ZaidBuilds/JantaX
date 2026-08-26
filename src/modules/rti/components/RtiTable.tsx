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
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          No public authorities found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
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
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ fontWeight: 700, color: '#0f2d59', lineHeight: 1.3 }}>
                    {a.authorityName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    {a.parentMinistry}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>
                    {a.governmentLevel}
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: isCompliant ? '#10b981' : '#dc2626', fontSize: '0.95rem' }}>
                    {a.avgResponseDays} Days
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Statutory limit: 30 days
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: a.disposedWithin30DaysPercent >= 85 ? '#16a34a' : '#d97706' }}>
                    {a.disposedWithin30DaysPercent}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
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
                  <div style={{ fontWeight: 700, color: '#0f2d59', fontSize: '0.8rem' }}>
                    {a.cpio.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {a.cpio.designation}
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  {a.onlineFilingSupported ? (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.78rem' }}>
                      ✓ rtionline.gov.in
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.78rem' }}>
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
                      background: '#0f2d59',
                      color: '#ffffff',
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
