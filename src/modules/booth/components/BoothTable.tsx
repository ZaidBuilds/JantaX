import React from 'react';
import { Link } from 'react-router-dom';
import type { PollingBooth } from '../types/booth';
import { MapPin, Phone, User, CheckCircle2, ChevronRight, Accessibility } from 'lucide-react';

interface Props {
  booths: PollingBooth[];
}

export function BoothTable({ booths }: Props) {
  if (booths.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: 0 }}>
          No polling booths found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Booth #</th>
            <th style={{ padding: '0.85rem 1rem' }}>Polling Station & Location</th>
            <th style={{ padding: '0.85rem 1rem' }}>Assembly Constituency</th>
            <th style={{ padding: '0.85rem 1rem' }}>Electors</th>
            <th style={{ padding: '0.85rem 1rem' }}>Designated BLO</th>
            <th style={{ padding: '0.85rem 1rem' }}>PwD Ramp</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {booths.map((b) => (
            <tr
              key={b.id}
              style={{
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s ease',
              }}
            >
              <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--ink)', fontSize: '1rem' }}>
                #{b.stationNumber}
              </td>

              <td style={{ padding: '1rem', maxWidth: 280 }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                  {b.buildingName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.15rem' }}>
                  {b.roomNumber}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--accent-ink)', marginTop: '0.2rem' }}>
                  <MapPin size={11} />
                  <span>PIN {b.pinCode} • {b.address}</span>
                </div>
              </td>

              <td style={{ padding: '1rem', fontSize: '0.78rem', color: 'var(--ink-2)' }}>
                <div style={{ fontWeight: 700 }}>{b.assemblyConstituency}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>{b.parliamentaryConstituency}</div>
              </td>

              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 800, color: 'var(--ink)' }}>{b.totalElectors}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                  {b.maleElectors}M / {b.femaleElectors}F
                </div>
              </td>

              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{b.blo.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--brand-ink)', fontWeight: 600 }}>
                  {b.blo.contactPhone}
                </div>
              </td>

              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                {b.facilities.wheelchairRamp ? (
                  <span className="jantax-badge-good" style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem' }}>
                    ✓ Ramp
                  </span>
                ) : (
                  <span className="jantax-badge-warn" style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem' }}>
                    No Ramp
                  </span>
                )}
              </td>

              <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Link
                  to={`/booth/${b.id}`}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
