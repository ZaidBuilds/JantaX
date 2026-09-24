import React from 'react';
import type { SectorType } from '../types/mplads';

interface Props {
  sectors: { sector: SectorType; amountLakhs: number; count: number }[];
}

const SECTOR_COLORS: Record<SectorType, string> = {
  'Drinking Water': '#0284c7',
  'Education': 'var(--viz-4)',
  'Electricity & Solar': 'var(--warn)',
  'Health & Sanitation': 'var(--viz-5)',
  'Roads & Pathways': 'var(--good)',
  'Community Infrastructure': 'var(--viz-4)',
  'Other': '#64748b',
};

export function MpladsSectorDonut({ sectors }: Props) {
  const totalLakhs = sectors.reduce((sum, s) => sum + s.amountLakhs, 0);

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem' }}>
        Priority Sector Allocation Breakdown
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
        {sectors.map((s) => {
          const pct = totalLakhs > 0 ? Math.round((s.amountLakhs / totalLakhs) * 100) : 0;
          const color = SECTOR_COLORS[s.sector] || 'var(--ink-3)';

          return (
            <div
              key={s.sector}
              style={{
                background: 'var(--surface-2)',
                padding: '0.85rem 1rem',
                borderRadius: 12,
                borderLeft: `4px solid ${color}`,
                borderTop: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>{s.sector}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color }}>{pct}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                <span>₹{s.amountLakhs.toFixed(1)} Lakhs</span>
                <span>{s.count} works</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
