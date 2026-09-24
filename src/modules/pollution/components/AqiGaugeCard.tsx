import React from 'react';
import type { AqiCategory, PollutantType, HourlyAqi } from '../types/pollution';
import { Wind, AlertTriangle, ShieldCheck, Heart, Info, Clock } from 'lucide-react';

interface Props {
  aqi: number;
  category: AqiCategory;
  prominentPollutant: PollutantType;
  pm25: number;
  pm10: number;
  no2?: number;
  trend: HourlyAqi[];
  healthAdvisory: string;
}

export function getAqiColor(category: AqiCategory): string {
  switch (category) {
    case 'Good':
      return 'var(--good)'; // Green
    case 'Satisfactory':
      return '#65a30d'; // Light Green
    case 'Moderate':
      return 'var(--warn)'; // Yellow-Orange
    case 'Poor':
      return 'var(--accent-ink)'; // Orange
    case 'Very Poor':
      return 'var(--bad)'; // Red
    case 'Severe':
      return 'var(--bad)'; // Deep Maroon
    case 'Severe Plus':
      return '#450a0a'; // Dark Maroon/Purple
    default:
      return '#64748b';
  }
}

export function AqiGaugeCard({ aqi, category, prominentPollutant, pm25, pm10, no2, trend, healthAdvisory }: Props) {
  const color = getAqiColor(category);

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Real-Time Ambient Air Quality Index (AQI)
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            Central Pollution Control Board (CPCB) Standard NAQI Scale
          </span>
        </div>

        <div>
          <span
            style={{
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}40`,
              fontSize: '0.85rem',
              fontWeight: 800,
              padding: '0.3rem 0.8rem',
              borderRadius: 999,
            }}
          >
            {category} (AQI {aqi})
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: `2px solid ${color}` }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            Current AQI
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: color, marginTop: '0.2rem' }}>
            {aqi}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            Main: {prominentPollutant}
          </span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            PM2.5 (Fine Particulate)
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: pm25 > 60 ? 'var(--bad)' : 'var(--good)', marginTop: '0.2rem' }}>
            {pm25} µg/m³
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Standard: 60 µg/m³</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
            PM10 (Coarse Dust)
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: pm10 > 100 ? 'var(--accent-ink)' : 'var(--good)', marginTop: '0.2rem' }}>
            {pm10} µg/m³
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Standard: 100 µg/m³</span>
        </div>

        {no2 !== undefined && (
          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
              NO2 (Vehicular Gas)
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>
              {no2} µg/m³
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Standard: 80 µg/m³</span>
          </div>
        )}
      </div>

      {/* 24-Hour Spark Curve */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} /> 24-Hour Diurnal AQI Trend
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>6-Hour Sampling Bins</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 60, paddingTop: 10 }}>
          {trend.map((t) => {
            const heightPercent = Math.min(100, (t.aqi / 450) * 100);
            return (
              <div key={t.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--ink)' }}>{t.aqi}</span>
                <div style={{ width: '100%', height: `${heightPercent}%`, background: t.aqi > 300 ? 'var(--bad-solid)' : t.aqi > 200 ? 'var(--accent-solid)' : 'var(--good-solid)', borderRadius: 4 }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--ink-4)' }}>{t.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Advisory Alert */}
      <div style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn-line)', borderRadius: 10, padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <Heart size={16} style={{ color: 'var(--warn)', marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--warn)', lineHeight: 1.45 }}>
          <strong>Medical Health Advisory:</strong> {healthAdvisory}
        </div>
      </div>
    </div>
  );
}
