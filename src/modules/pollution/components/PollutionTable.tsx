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
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          No air quality monitoring stations found matching your search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="jantax-table-wrapper">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1rem' }}>Monitoring Station & Operator</th>
            <th style={{ padding: '0.85rem 1rem' }}>Live AQI & Category</th>
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
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '1rem', maxWidth: 280 }}>
                  <div style={{ fontWeight: 700, color: '#0f2d59', lineHeight: 1.3 }}>
                    {s.stationName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    {s.operator}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#f97316', marginTop: '0.2rem' }}>
                    <MapPin size={11} />
                    <span>PIN {s.pinCode} • {s.city}, {s.state}</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: color,
                        color: '#ffffff',
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
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        CPCB NAQI Standard
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '1rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  <div>PM2.5: <strong style={{ color: s.pm25Value > 60 ? '#dc2626' : '#16a34a' }}>{s.pm25Value} µg/m³</strong></div>
                  <div style={{ color: '#64748b' }}>PM10: <strong>{s.pm10Value} µg/m³</strong></div>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  <span style={{ background: '#f1f5f9', color: '#0f2d59', padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 800, fontSize: '0.75rem' }}>
                    {s.prominentPollutant}
                  </span>
                </td>

                <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#64748b' }}>
                  <div style={{ color: '#16a34a', fontWeight: 700 }}>● CAAQMS Online</div>
                  <div>{s.lastUpdated.split('(')[0]}</div>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/pollution/stations/${s.id}`}
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
