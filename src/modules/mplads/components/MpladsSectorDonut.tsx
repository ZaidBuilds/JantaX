import React from 'react';
import type { SectorType } from '../types/mplads';

interface Props {
  sectors: { sector: SectorType; amountLakhs: number; count: number }[];
}

const SECTOR_COLORS: Record<SectorType, string> = {
  'Drinking Water': '#0284c7',
  'Education': '#8b5cf6',
  'Electricity & Solar': '#f59e0b',
  'Health & Sanitation': '#ec4899',
  'Roads & Pathways': '#10b981',
  'Community Infrastructure': '#6366f1',
  'Other': '#64748b',
};

export function MpladsSectorDonut({ sectors }: Props) {
  const totalLakhs = sectors.reduce((sum, s) => sum + s.amountLakhs, 0);

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 1rem' }}>
        Priority Sector Allocation Breakdown
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
        {sectors.map((s) => {
          const pct = totalLakhs > 0 ? Math.round((s.amountLakhs / totalLakhs) * 100) : 0;
          const color = SECTOR_COLORS[s.sector] || '#64748b';

          return (
            <div
              key={s.sector}
              style={{
                background: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: 12,
                borderLeft: `4px solid ${color}`,
                borderTop: '1px solid #e2e8f0',
                borderRight: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{s.sector}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color }}>{pct}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
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
