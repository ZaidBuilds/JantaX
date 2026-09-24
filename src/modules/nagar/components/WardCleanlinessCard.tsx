import React from 'react';
import type { WardServices } from '../types/nagar';
import { Sparkles, Trash2, Lightbulb, Waves, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  score: number;
  services: WardServices;
  slaCompliance: number;
}

export function WardCleanlinessCard({ score, services, slaCompliance }: Props) {
  const isHigh = score >= 80;
  const isModerate = score >= 65 && score < 80;

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Ward Sanitation & Service Delivery Matrix
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            MoHUA Swachhata Platform & Municipal Corporation Citizen Charter
          </span>
        </div>

        <div>
          <span
            className={isHigh ? 'jantax-badge-good' : isModerate ? 'jantax-badge-warn' : 'jantax-badge-alert'}
            style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0.3rem 0.8rem' }}
          >
            Cleanliness Score: {score}/100
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Trash2 size={13} style={{ color: 'var(--good)' }} /> Door-to-Door
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: services.doorToDoorGarbage ? 'var(--good)' : 'var(--bad)', marginTop: '0.25rem' }}>
            {services.doorToDoorGarbage ? 'Active 100%' : 'Irregular'}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>{services.sweepingFrequency}</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Lightbulb size={13} style={{ color: 'var(--warn)' }} /> Streetlights
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.25rem' }}>
            {services.streetlightCoveragePercent}%
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Working LED Luminaires</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Waves size={13} style={{ color: 'var(--brand-ink)' }} /> Waterlogging
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: services.waterloggingHotspots === 0 ? 'var(--good)' : 'var(--bad)', marginTop: '0.25rem' }}>
            {services.waterloggingHotspots} Spots
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Monsoon Vulnerability</span>
        </div>

        <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--brand-ink)' }} /> 311 SLA Rate
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: slaCompliance >= 85 ? 'var(--good)' : 'var(--warn)', marginTop: '0.25rem' }}>
            {slaCompliance}%
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--ink-4)' }}>Within Citizen Charter</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.4rem' }}>
          <span>Overall Ward Sanitation Index</span>
          <span>{score} / 100 Quality Benchmark</span>
        </div>
        <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${score}%`,
              height: '100%',
              background: isHigh ? 'var(--good-solid)' : isModerate ? 'var(--warn-solid)' : 'var(--bad-solid)',
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    </div>
  );
}
