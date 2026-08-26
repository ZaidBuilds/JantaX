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
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          No polling booths found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
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
                borderBottom: '1px solid #f1f5f9',
                transition: 'background 0.15s ease',
              }}
            >
              <td style={{ padding: '1rem', fontWeight: 800, color: '#0f2d59', fontSize: '1rem' }}>
                #{b.stationNumber}
              </td>

              <td style={{ padding: '1rem', maxWidth: 280 }}>
                <div style={{ fontWeight: 700, color: '#0f2d59', lineHeight: 1.3 }}>
                  {b.buildingName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {b.roomNumber}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#f97316', marginTop: '0.2rem' }}>
                  <MapPin size={11} />
                  <span>PIN {b.pinCode} • {b.address}</span>
                </div>
              </td>

              <td style={{ padding: '1rem', fontSize: '0.78rem', color: '#334155' }}>
                <div style={{ fontWeight: 700 }}>{b.assemblyConstituency}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{b.parliamentaryConstituency}</div>
              </td>

              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 800, color: '#0f2d59' }}>{b.totalElectors}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {b.maleElectors}M / {b.femaleElectors}F
                </div>
              </td>

              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.blo.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
