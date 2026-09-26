import React from 'react';
import { Link } from 'react-router-dom';
import type { MunicipalWard } from '../types/nagar';
import { MapPin, Phone, ChevronRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  wards: MunicipalWard[];
}

export function WardTable({ wards }: Props) {
  if (wards.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: 0 }}>
          No municipal wards found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Ward & Corporation</th>
            <th style={{ padding: '0.85rem 1rem' }}>Cleanliness Score</th>
            <th style={{ padding: '0.85rem 1rem' }}>Elected Councillor</th>
            <th style={{ padding: '0.85rem 1rem' }}>Sanitary Inspector</th>
            <th style={{ padding: '0.85rem 1rem' }}>Avg 311 Resolution</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((w) => {
            const isHigh = w.cleanlinessScore >= 80;
            const isModerate = w.cleanlinessScore >= 65 && w.cleanlinessScore < 80;

            return (
              <tr
                key={w.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ background: 'var(--brand)', color: 'var(--on-solid)', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                      WARD #{w.wardNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontWeight: 600 }}>{w.zone}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {w.wardName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-ink)', marginTop: '0.15rem' }}>
                    {w.corporationName} • PIN {w.pinCode}
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span
                    className={isHigh ? 'jantax-badge-good' : isModerate ? 'jantax-badge-warn' : 'jantax-badge-alert'}
                    style={{ fontSize: '0.82rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}
                  >
                    {w.cleanlinessScore} / 100
                  </span>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
                    {w.services.doorToDoorGarbage ? '✓ Daily Collection' : 'Irregular'}
                  </div>
                </td>

                <td style={{ padding: '1rem', maxWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.82rem' }}>
                    {w.councillor.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                    {w.councillor.party}
                  </div>
                  <a href={`tel:${w.councillor.phone}`} style={{ fontSize: '0.72rem', color: 'var(--brand-ink)', textDecoration: 'none', fontWeight: 600 }}>
                    {w.councillor.phone}
                  </a>
                </td>

                <td style={{ padding: '1rem', maxWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.82rem' }}>
                    {w.sanitaryInspector.name}
                  </div>
                  <a href={`tel:${w.sanitaryInspector.phone}`} style={{ fontSize: '0.72rem', color: 'var(--good)', textDecoration: 'none', fontWeight: 600 }}>
                    {w.sanitaryInspector.phone}
                  </a>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 800, color: w.avgResolutionHours <= 30 ? 'var(--good)' : 'var(--warn)' }}>
                    ~{w.avgResolutionHours} Hours
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                    {w.slaCompliancePercent}% within SLA
                  </div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/nagar/wards/${w.id}`}
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
