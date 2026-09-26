import React from 'react';
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SourceBadge } from '../UI/SourceBadge';
import { DataFreshnessBadge } from '../data-states';

export interface CategoryMetricRow {
  name: string;
  value: string | number | null;
  unit?: string;
  status?: 'available' | 'unavailable' | 'stale';
  source?: string;
}

export interface CategoryData {
  moduleId: string;
  title: string;
  score?: string | number | null;
  scoreLabel?: string | null;
  source?: { type: string; name: string };
  freshness?: Date | string | null;
  metrics: CategoryMetricRow[];
  color: string;
  onViewDetails?: () => void;
  isLoading?: boolean;
}

export function CategoryOverviewCard({
  category,
  isLoading = false,
}: {
  category: CategoryData;
  isLoading?: boolean;
}) {
  const availableMetrics = category.metrics.filter(m => m.status !== 'unavailable' && m.value !== null);
  const unavailableMetrics = category.metrics.filter(m => m.status === 'unavailable' || m.value === null);
  const hasAnyData = availableMetrics.length > 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1rem',
        borderTop: `3px solid ${category.color}`,
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {category.title}
        </span>
        {!isLoading && category.score && (
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: category.color }}>
            {category.score}
          </span>
        )}
        {isLoading && <div className="skeleton" style={{ width: 40, height: 16, borderRadius: 4 }} />}
      </div>

      {!isLoading && category.source && (
        <div style={{ marginBottom: '0.75rem' }}>
          <SourceBadge sourceType={category.source.type} sourceName={category.source.name} />
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ width: '50%', height: 12, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: '25%', height: 12, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          {availableMetrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                opacity: m.status === 'stale' ? 0.7 : 1,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {m.status === 'stale' && (
                  <AlertTriangle size={10} style={{ color: 'var(--accent-ink)' }} />
                )}
                {m.name}
              </span>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {m.value}
                {m.unit && <span style={{ opacity: 0.5, fontSize: '0.9em' }}>{m.unit}</span>}
                {m.status === 'stale' && (
                  <Clock size={10} style={{ color: 'var(--accent-ink)' }} />
                )}
              </strong>
            </div>
          ))}
        </div>
      )}

      {!isLoading && unavailableMetrics.length > 0 && (
        <div
          style={{
            fontSize: '0.7rem',
            color: 'var(--ink-4)',
            padding: '0.5rem 0.75rem',
            background: 'var(--surface-2)',
            borderRadius: 6,
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertTriangle size={10} /> Not available from current sources
          </div>
          <div style={{ opacity: 0.7 }}>
            {unavailableMetrics.map((m, i) => (
              <span key={i}>
                {m.name}
                {i < unavailableMetrics.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {category.freshness && hasAnyData && (
        <div style={{ marginBottom: '0.5rem' }}>
          <DataFreshnessBadge lastUpdated={category.freshness} variant="inline" />
        </div>
      )}

      {category.onViewDetails && !isLoading && (
        <button
          onClick={category.onViewDetails}
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-primary)',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          View Details <ExternalLink size={10} />
        </button>
      )}
    </div>
  );
}

interface QuickLinksCardProps {
  links: Array<{
    label: string;
    path: string;
    icon?: React.ReactNode;
  }>;
  onNavigate: (path: string) => void;
}

export function QuickLinksCard({ links, onNavigate }: QuickLinksCardProps) {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
        Quick Links
      </h3>
      <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
        {links.map(link => (
          <div
            key={link.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '0.25rem 0',
            }}
            onClick={() => onNavigate(link.path)}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {link.icon}
              {link.label}
            </span>
            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
