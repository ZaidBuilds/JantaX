import React from 'react';
import { Shield, Users, BarChart3, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SourceBadge } from '../UI/SourceBadge';

export type DataSourceType = 'official' | 'community' | 'independent' | 'verified';

interface DataSourceSectionProps {
  type: DataSourceType;
  title: string;
  titleHi?: string;
  children: React.ReactNode;
  lastUpdated?: string;
  source?: { name: string; type: 'A' | 'B' | 'C'; url?: string };
  confidence?: 'low' | 'medium' | 'high';
  recordCount?: number;
  methodologyNote?: string;
}

const SOURCE_CONFIG: Record<DataSourceType, { color: string; bg: string; border: string; label: string; icon: React.ElementType; description: string }> = {
  official: {
    color: 'var(--brand-ink)',
    bg: 'var(--brand-soft)',
    border: 'var(--brand-line)',
    label: 'Official Data',
    icon: Shield,
    description: 'Government-reported data from UDISE+, DISE, state portals, and official returns.',
  },
  community: {
    color: 'var(--viz-4)',
    bg: 'var(--brand-soft)',
    border: 'var(--border)',
    label: 'Community Data',
    icon: Users,
    description: 'Crowdsourced citizen check-ins, parent submissions, and local reports.',
  },
  independent: {
    color: 'var(--good)',
    bg: 'var(--good-soft)',
    border: 'var(--good-line)',
    label: 'Independent Data',
    icon: BarChart3,
    description: 'Third-party audits, NGO studies, academic surveys, and media investigations.',
  },
  verified: {
    color: 'var(--warn)',
    bg: 'var(--warn-soft)',
    border: 'var(--warn-line)',
    label: 'Verified Evidence',
    icon: CheckCircle2,
    description: 'Photo/video evidence, GPS-tagged observations, and cross-verified reports.',
  },
};

export function DataSourceSection({
  type,
  title,
  titleHi,
  children,
  lastUpdated,
  source,
  confidence,
  recordCount,
  methodologyNote,
}: DataSourceSectionProps) {
  const config = SOURCE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: `1px solid ${config.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon size={16} style={{ color: config.color }} />
          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: config.color }}>
            {config.label}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.6 }}>- {config.description}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {recordCount !== undefined && (
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: config.color }}>
              {recordCount.toLocaleString('en-IN')} records
            </span>
          )}
          {confidence && (
            <ConfidenceBadge confidence={confidence} />
          )}
          {source && (
            <SourceBadge sourceType={source.type} sourceName={source.name} />
          )}
          {lastUpdated && (
            <span style={{ fontSize: '0.68rem', opacity: 0.5 }}>
              Updated {formatDate(lastUpdated)}
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{title}</span>
          {titleHi && <span style={{ fontSize: '0.82rem', opacity: 0.6, marginLeft: '0.4rem' }}>{titleHi}</span>}
        </div>
        {methodologyNote && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--ink-3)' }}>
            <Info size={12} style={{ flexShrink: 0, marginTop: 2 }} />
            {methodologyNote}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface ConfidenceBadgeProps {
  confidence: 'low' | 'medium' | 'high';
  showLabel?: boolean;
}

export function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
  const config = {
    high: { color: 'var(--good)', bg: 'var(--good-soft)', border: 'var(--good-line)', label: 'High Confidence' },
    medium: { color: 'var(--warn)', bg: 'var(--warn-soft)', border: 'var(--warn-line)', label: 'Medium Confidence' },
    low: { color: 'var(--bad)', bg: 'var(--bad-soft)', border: 'var(--bad-line)', label: 'Low Confidence' },
  }[confidence];

  return (
    <span
      style={{
        fontSize: '0.62rem',
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: 999,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {showLabel ? config.label : confidence.toUpperCase()}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

interface DataRowProps {
  label: string;
  labelHi?: string;
  officialValue?: string | number | null;
  communityValue?: string | number | null;
  independentValue?: string | number | null;
  verifiedValue?: string | number | null;
  unit?: string;
  status?: 'match' | 'mismatch' | 'partial';
  notes?: string;
  source?: { name: string; type: 'A' | 'B' | 'C' };
}

export function DataComparisonRow({
  label,
  labelHi,
  officialValue,
  communityValue,
  independentValue,
  verifiedValue,
  unit,
  status,
  notes,
  source,
}: DataRowProps) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, fontSize: '0.82rem' }}>
        <div>{label}</div>
        {labelHi && <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>{labelHi}</div>}
      </td>
      {[
        { val: officialValue, type: 'official' as DataSourceType },
        { val: communityValue, type: 'community' as DataSourceType },
        { val: independentValue, type: 'independent' as DataSourceType },
        { val: verifiedValue, type: 'verified' as DataSourceType },
      ].map(({ val, type }) => {
        const config = SOURCE_CONFIG[type];
        const hasVal = val !== null && val !== undefined && val !== '-';
        return (
          <td
            key={type}
            style={{
              padding: '0.75rem 0.5rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: hasVal ? 700 : 400,
              color: hasVal ? 'var(--text-primary)' : 'var(--ink-4)',
              background: hasVal ? config.bg : 'transparent',
            }}
          >
            <div>{val ?? '-'}</div>
            {unit && hasVal && <div style={{ fontSize: '0.68rem', opacity: 0.5 }}>{unit}</div>}
          </td>
        );
      })}
    </tr>
  );
}

export function DataComparisonTableHeader({ types }: { types: DataSourceType[] }) {
  return (
    <thead>
      <tr style={{ borderBottom: '2px solid var(--border)' }}>
        <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', minWidth: 160 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric</span>
        </th>
        {types.map(t => {
          const config = SOURCE_CONFIG[t];
          const Icon = config.icon;
          return (
            <th
              key={t}
              style={{
                textAlign: 'center',
                padding: '0.6rem 0.5rem',
                minWidth: 120,
                background: config.bg,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <Icon size={13} style={{ color: config.color }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: config.color }}>{config.label}</span>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
