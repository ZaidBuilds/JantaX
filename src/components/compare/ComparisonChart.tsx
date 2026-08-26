import React from 'react';
import { ComparisonRow, ComparisonMetric } from './types';

interface ComparisonChartProps {
  rows: ComparisonRow[];
  entityNames: string[];
  metricId?: string;
}

export function ComparisonChart({ rows, entityNames, metricId }: ComparisonChartProps) {
  const targetRows = metricId ? rows.filter(r => r.id === metricId) : rows.filter(r => r.metrics.some(m => m.value !== null && m.value !== '—')).slice(0, 4);

  if (targetRows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No comparable metrics available.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(targetRows.length, 2)}, 1fr)`, gap: '1.5rem' }}>
      {targetRows.map(row => {
        const values = row.metrics.map(m => (typeof m.value === 'number' ? m.value : parseFloat(String(m.value)) || 0));
        const maxVal = Math.max(...values, 1);

        return (
          <div key={row.id} className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              {row.category}
              {row.categoryHi && <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: '0.4rem' }}>{row.categoryHi}</span>}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {row.metrics.map((metric, idx) => {
                const numValue = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value)) || 0;
                const pct = maxVal > 0 ? (numValue / maxVal) * 100 : 0;
                const color = getBarColor(pct);

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entityNames[idx] || `Entity ${idx + 1}`}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: metric.color || 'var(--color-primary)' }}>
                        {metric.value ?? '—'}
                        {metric.unit && <span style={{ opacity: 0.6, fontSize: '0.7em' }}>{metric.unit}</span>}
                      </span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: color,
                          borderRadius: 999,
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {row.metrics[0]?.source && (
              <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.75rem' }}>
                Source: {row.metrics[0].source?.name}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getBarColor(pct: number): string {
  if (pct >= 75) return '#10b981';
  if (pct >= 50) return '#f59e0b';
  if (pct >= 25) return '#f97316';
  return '#ef4444';
}

interface ComparisonRadarProps {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>;
}

export function ComparisonRadar({ labels, datasets }: ComparisonRadarProps) {
  const maxVal = Math.max(...datasets.flatMap(d => d.data), 1);

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>Comparative Overview</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {labels.map((label, labelIdx) => {
          const values = datasets.map(d => d.data[labelIdx] || 0);
          const maxValForLabel = Math.max(...values, 1);

          return (
            <div key={labelIdx}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                {label}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {datasets.map((dataset, datasetIdx) => {
                  const val = dataset.data[labelIdx] || 0;
                  const pct = maxValForLabel > 0 ? (val / maxValForLabel) * 100 : 0;
                  return (
                    <div key={datasetIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <div
                        style={{
                          width: '100%',
                          background: `${dataset.color}20`,
                          borderRadius: 6,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            height: 32,
                            background: dataset.color,
                            width: `${pct}%`,
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>
                            {val}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6rem', opacity: 0.5, textAlign: 'center', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dataset.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
