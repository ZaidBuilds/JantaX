import React from 'react';
import { Link } from 'react-router-dom';
import type { AirQualityStation } from '../types/pollution';
import { getAqiColor } from './AqiGaugeCard';
import { MapPin, Wind, ChevronRight, Activity } from 'lucide-react';

interface Props {
  stations: AirQualityStation[];
}

export function PollutionTable({ stations }: Props) {
  if (stations.length === 0) {
    return (
      <div className="jantax-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: 0 }}>
          No air quality monitoring stations found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Monitoring Station & Operator</th>
            <th style={{ padding: '0.85rem 1rem' }}>AQI and category (sample)</th>
            <th style={{ padding: '0.85rem 1rem' }}>PM2.5 / PM10 Levels</th>
            <th style={{ padding: '0.85rem 1rem' }}>Main Pollutant</th>
            <th style={{ padding: '0.85rem 1rem' }}>Status / Update</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => {
            const color = getAqiColor(s.category);

            return (
              <tr
                key={s.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {s.stationName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.15rem' }}>
                    {s.operator}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--accent-ink)', marginTop: '0.2rem' }}>
                    <MapPin size={11} />
                    <span>PIN {s.pinCode} • {s.city}, {s.state}</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: color,
                        color: 'var(--on-solid)',
                        fontSize: '1rem',
                        fontWeight: 900,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 8,
                        minWidth: 46,
                        textAlign: 'center',
                      }}
                    >
                      {s.currentAqi}
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, color: color, fontSize: '0.82rem' }}>
                        {s.category}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                        CPCB NAQI Standard
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '1rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  <div>PM2.5: <strong style={{ color: s.pm25Value > 60 ? 'var(--bad)' : 'var(--good)' }}>{s.pm25Value} µg/m³</strong></div>
                  <div style={{ color: 'var(--ink-3)' }}>PM10: <strong>{s.pm10Value} µg/m³</strong></div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span style={{ background: 'var(--surface-3)', color: 'var(--ink)', padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 800, fontSize: '0.75rem' }}>
                    {s.prominentPollutant}
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--ink-3)' }}>
                  <div style={{ color: 'var(--good)', fontWeight: 700 }}>● CAAQMS Online</div>
                  <div>{s.lastUpdated.split('(')[0]}</div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/pollution/stations/${s.id}`}
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
