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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.2rem' }}>
          Procedural Stage Bottleneck Analysis
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: 0 }}>
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
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '1rem',
                borderLeft: isCritical ? '4px solid var(--bad)' : '4px solid var(--brand-ink)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.88rem' }}>
                    {stage.stage}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
                    {stage.stageHi}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: isCritical ? 'var(--bad)' : 'var(--brand-ink)', fontSize: '0.9rem' }}>
                    {stage.percentage}% of Backlog
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                    {stage.caseCount.toLocaleString('en-IN')} cases
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${stage.percentage}%`,
                      height: '100%',
                      background: isCritical ? 'var(--bad-solid)' : 'var(--brand)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
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
