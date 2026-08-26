import React from 'react';
import type { StageBottleneck } from '../types/courts';
import { Clock, AlertCircle } from 'lucide-react';

interface Props {
  stages: StageBottleneck[];
}

export function CourtStageBottleneckCard({ stages }: Props) {
  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.2rem' }}>
          Procedural Stage Bottleneck Analysis
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
          Where do cases spend the maximum time? Audited by National Judicial Data Grid (NJDG).
        </p>
      </div>

      <div style={{ display: 'grid', gap: '0.85rem' }}>
        {stages.map((stage, idx) => {
          const isCritical = stage.percentage >= 35;

          return (
            <div
              key={stage.stage}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1rem',
                borderLeft: isCritical ? '4px solid #ef4444' : '4px solid #2563eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f2d59', fontSize: '0.88rem' }}>
                    {stage.stage}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {stage.stageHi}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: isCritical ? '#dc2626' : '#2563eb', fontSize: '0.9rem' }}>
                    {stage.percentage}% of Backlog
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {stage.caseCount.toLocaleString('en-IN')} cases
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${stage.percentage}%`,
                      height: '100%',
                      background: isCritical ? '#ef4444' : '#2563eb',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: '#475569', whiteSpace: 'nowrap' }}>
                  <Clock size={12} />
                  <span>Avg ~{stage.avgMonths} months at this stage</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
