import React from 'react';
import { Link } from 'react-router-dom';
import type { MpladsWork } from '../types/mplads';
import { MapPin, ShieldCheck, Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface Props {
  works: MpladsWork[];
  showRepresentative?: boolean;
}

export function MpladsProjectTable({ works, showRepresentative = false }: Props) {
  if (works.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: 0 }}>
          No sanctioned MPLADS/MLALADS projects match the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Sanction Order & Work Description</th>
            <th style={{ padding: '0.85rem 1rem' }}>Sector</th>
            {showRepresentative && <th style={{ padding: '0.85rem 1rem' }}>MP / MLA</th>}
            <th style={{ padding: '0.85rem 1rem' }}>Cost (₹ Lakhs)</th>
            <th style={{ padding: '0.85rem 1rem' }}>Agency</th>
            <th style={{ padding: '0.85rem 1rem' }}>Status</th>
            <th style={{ padding: '0.85rem 1rem' }}>Ground Truth</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {works.map((w) => {
            const isCompleted = w.status === 'Completed';
            const isInProgress = w.status === 'In Progress';

            return (
              <tr
                key={w.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 300 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem', lineHeight: 1.35 }}>
                    {w.workTitle}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                    <MapPin size={12} style={{ color: 'var(--accent-ink)' }} />
                    <span>PIN {w.pinCode} • {w.district}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-4)', marginTop: '0.2rem' }}>
                    Order: {w.sanctionOrderNumber}
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      background: 'var(--surface-3)',
                      color: 'var(--ink-2)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {w.sector}
                  </span>
                </td>

                {showRepresentative && (
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--ink)' }}>
                    <Link
                      to={`/mplads/representatives/${w.representativeId}`}
                      style={{ color: 'var(--brand-ink)', textDecoration: 'none', fontWeight: 700 }}
                    >
                      {w.representativeName}
                    </Link>
                  </td>
                )}

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: 'var(--ink)' }}>₹{w.sanctionCostLakhs.toFixed(1)} L</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>Spent: ₹{w.spentAmountLakhs.toFixed(1)} L</div>
                </td>

                <td style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)', maxWidth: 160 }}>
                  {w.executingAgency}
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span
                    className={
                      isCompleted
                        ? 'jantax-badge-good'
                        : isInProgress
                        ? 'jantax-badge-info'
                        : 'jantax-badge-warn'
                    }
                    style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}
                  >
                    {w.status}
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: w.groundTruthScore >= 85 ? 'var(--good-soft)' : 'var(--warn-soft)',
                        color: w.groundTruthScore >= 85 ? 'var(--good)' : 'var(--warn)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      {w.groundTruthScore}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>/100</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/mplads/projects/${w.id}`}
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
