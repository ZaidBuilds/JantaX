import React from 'react';
import { ExternalLink, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { ComparisonData, ComparisonEntity, ComparisonMetric, getEntityTypeLabel } from './types';
import { SourceBadge } from '../UI/SourceBadge';

interface ComparisonTableProps {
  data: ComparisonData;
  onEntityClick?: (entity: ComparisonEntity) => void;
  showSourceDisclosure?: boolean;
}

export function ComparisonTable({ data, onEntityClick, showSourceDisclosure = true }: ComparisonTableProps) {
  const { entities, rows } = data;

  if (entities.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '0.9rem' }}>Select at least 2 entities to compare</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', minWidth: 180, position: 'sticky', left: 0, background: 'var(--surface)', zIndex: 1 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric</span>
            </th>
            {entities.map(entity => {
              const color = ENTITY_COLORS[entity.type] || 'var(--ink-3)';
              return (
                <th
                  key={entity.id}
                  style={{
                    textAlign: 'center',
                    padding: '0.75rem 0.5rem',
                    minWidth: 160,
                    background: `${color}08`,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: `${color}15`, color, fontWeight: 700 }}>
                      {getEntityTypeLabel(entity.type)}
                    </span>
                    <span
                      style={{ fontWeight: 800, color: 'var(--text-primary)', cursor: onEntityClick ? 'pointer' : 'default' }}
                      onClick={() => onEntityClick?.(entity)}
                    >
                      {entity.name}
                    </span>
                    {entity.location && (
                      <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                        {entity.location.district}, {entity.location.state}
                      </span>
                    )}
                    {onEntityClick && (
                      <button
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--color-primary)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          padding: 0,
                        }}
                        onClick={() => onEntityClick(entity)}
                      >
                        View <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.id}
              style={{ borderBottom: '1px solid var(--border)', background: rowIdx % 2 === 0 ? 'transparent' : '#fafbfc' }}
            >
              <td style={{ padding: '0.85rem 1rem', position: 'sticky', left: 0, background: rowIdx % 2 === 0 ? 'var(--surface)' : '#fafbfc', zIndex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{row.category}</div>
                {row.categoryHi && (
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{row.categoryHi}</div>
                )}
              </td>
              {row.metrics.map((metric, colIdx) => (
                <td
                  key={`${row.id}-${colIdx}`}
                  style={{
                    padding: '0.85rem 0.5rem',
                    textAlign: 'center',
                    background: colIdx === 0 ? 'transparent' : `${ENTITY_COLORS[entities[colIdx]?.type] || '#6b7280'}08`,
                  }}
                >
                  <ComparisonCell metric={metric} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showSourceDisclosure && (
        <SourceDisclosure rows={rows} entities={entities} />
      )}
    </div>
  );
}

const ENTITY_COLORS: Record<string, string> = {
  school: '#3b82f6',
  contractor: 'var(--bad)',
  builder: 'var(--bad)',
  project: 'var(--warn)',
  location: 'var(--viz-6)',
  hospital: 'var(--viz-5)',
  rera: 'var(--viz-4)',
};

interface ComparisonCellProps {
  metric: ComparisonMetric;
}

function ComparisonCell({ metric }: ComparisonCellProps) {
  if (metric.status === 'unavailable' || metric.value === null || metric.value === '-') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink-4)' }}>-</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--ink-4)' }}>Unavailable</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: metric.color || 'var(--color-primary)' }}>
          {metric.value}
        </span>
        {metric.unit && (
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{metric.unit}</span>
        )}
      </div>

      {metric.rank && (
        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: metric.rank <= 3 ? '#10b98115' : 'var(--surface-3)', color: metric.rank <= 3 ? 'var(--good)' : 'var(--ink-3)' }}>
          #{metric.rank}
        </span>
      )}

      {metric.badge && (
        <span style={{ fontSize: '0.6rem', fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: `${metric.color || '#6b7280'}15`, color: metric.color || 'var(--ink-3)' }}>
          {metric.badge}
        </span>
      )}

      {metric.source && (
        <SourceBadge sourceType={metric.source.type} sourceName={metric.source.name} />
      )}

      {metric.freshness && (
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>
          {formatFreshness(metric.freshness)}
        </span>
      )}

      {metric.methodology && (
        <span title={metric.methodology} style={{ cursor: 'help', opacity: 0.4 }}>
          <Info size={12} />
        </span>
      )}
    </div>
  );
}

function formatFreshness(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

interface SourceDisclosureProps {
  rows: ComparisonData['rows'];
  entities: ComparisonEntity[];
}

function SourceDisclosure({ rows, entities }: SourceDisclosureProps) {
  const sources = new Map<string, { name: string; type: string; count: number }>();
  rows.forEach(row => {
    row.metrics.forEach(m => {
      if (m.source) {
        const key = m.source.name;
        const existing = sources.get(key);
        if (existing) {
          existing.count++;
        } else {
          sources.set(key, { name: m.source.name, type: m.source.type, count: 1 });
        }
      }
    });
  });

  if (sources.size === 0) return null;

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'var(--surface-2)',
        borderRadius: 10,
        border: '1px solid var(--border)',
      }}
    >
      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Info size={14} /> Data Sources
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {[...sources.values()].map(source => (
          <div key={source.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <SourceBadge sourceType={source.type as 'A' | 'B' | 'C'} sourceName={source.name} />
            <span style={{ opacity: 0.5 }}>({source.count} metrics)</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.75rem', lineHeight: 1.5 }}>
        All metrics are sourced from official government data portals. Methodology available on request.
        Scores are calculated using standardized formulas and may differ from official government reports.
      </p>
    </div>
  );
}
