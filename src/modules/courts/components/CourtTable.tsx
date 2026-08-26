import React from 'react';
import { Link } from 'react-router-dom';
import type { CourtComplex } from '../types/courts';
import { MapPin, Scale, Clock, ChevronRight, AlertTriangle, Users } from 'lucide-react';

interface Props {
  courts: CourtComplex[];
}

export function CourtTable({ courts }: Props) {
  if (courts.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          No court complexes found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Court Complex & District</th>
            <th style={{ padding: '0.85rem 1rem' }}>Total Pendency</th>
            <th style={{ padding: '0.85rem 1rem' }}>Civil / Criminal</th>
            <th style={{ padding: '0.85rem 1rem' }}>Pending &gt; 5 Yrs</th>
            <th style={{ padding: '0.85rem 1rem' }}>Judge Vacancy</th>
            <th style={{ padding: '0.85rem 1rem' }}>Clearance Rate</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((c) => {
            const isHighVacancy = c.vacancyPercentage >= 30;

            return (
              <tr
                key={c.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ fontWeight: 700, color: '#0f2d59', lineHeight: 1.3 }}>
                    {c.complexName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    {c.courtType}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#f97316', marginTop: '0.2rem' }}>
                    <MapPin size={11} />
                    <span>PIN {c.pinCode} • {c.district}, {c.state}</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: '#0f2d59', fontSize: '0.95rem' }}>
                    {c.totalPendingCases.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Avg {c.avgDisposalDays} days/case
                  </div>
                </td>

                <td style={{ padding: '1rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  <div>Civil: <strong>{c.civilPending.toLocaleString('en-IN')}</strong></div>
                  <div style={{ color: '#64748b' }}>Criminal: <strong>{c.criminalPending.toLocaleString('en-IN')}</strong></div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: c.pendingOver5Years > 10000 ? '#dc2626' : '#d97706' }}>
                    {c.pendingOver5Years.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {((c.pendingOver5Years / c.totalPendingCases) * 100).toFixed(1)}% of cases
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span
                    className={isHighVacancy ? 'jantax-badge-alert' : 'jantax-badge-warn'}
                    style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}
                  >
                    {c.vacantJudges} of {c.sanctionedJudges} Vacant ({c.vacancyPercentage}%)
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: c.clearanceRatePercent >= 90 ? '#16a34a' : '#475569' }}>
                    {c.clearanceRatePercent}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {c.casesDisposedLastMonth} last mo.
                  </div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/courts/${c.id}`}
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
