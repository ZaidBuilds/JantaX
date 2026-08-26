import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStations } from '../services/pollutionService';
import { getAqiColor } from '../components/AqiGaugeCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Wind, Activity, Heart, ShieldAlert } from 'lucide-react';

export function PollutionComparePage() {
  const allStations = getAllStations();
  const [st1Id, setSt1Id] = useState(allStations[0]?.id || '');
  const [st2Id, setSt2Id] = useState(allStations[1]?.id || '');

  const s1 = allStations.find((s) => s.id === st1Id);
  const s2 = allStations.find((s) => s.id === st2Id);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/pollution"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Air Quality Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare Air Monitoring Stations
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' }}>
          Side-by-side comparison of live AQI values, PM2.5 and PM10 particulate levels, prominent pollutants, and medical health advisories between two continuous ambient air monitoring stations.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Monitoring Station 1
            </label>
            <select
              value={st1Id}
              onChange={(e) => setSt1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allStations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stationName} ({s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Monitoring Station 2
            </label>
            <select
              value={st2Id}
              onChange={(e) => setSt2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allStations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.stationName} ({s.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {s1 && s2 && (
          <div className="jantax-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{s1.stationName}</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{s2.stationName}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>City & Operator</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{s1.city} ({s1.operator})</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{s2.city} ({s2.operator})</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Current AQI</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: getAqiColor(s1.category) }}>
                    {s1.currentAqi} ({s1.category})
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: getAqiColor(s2.category) }}>
                    {s2.currentAqi} ({s2.category})
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>PM2.5 (Fine Particulate)</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: s1.pm25Value > 60 ? '#dc2626' : '#16a34a' }}>
                    {s1.pm25Value} µg/m³
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: s2.pm25Value > 60 ? '#dc2626' : '#16a34a' }}>
                    {s2.pm25Value} µg/m³
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>PM10 (Coarse Dust)</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800 }}>
                    {s1.pm10Value} µg/m³
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800 }}>
                    {s2.pm10Value} µg/m³
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Prominent Pollutant</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {s1.prominentPollutant}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {s2.prominentPollutant}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Health Impact</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#475569' }}>
                    {s1.healthAdvisory}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#475569' }}>
                    {s2.healthAdvisory}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
