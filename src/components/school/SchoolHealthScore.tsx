import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { SourceBadge } from '../UI/SourceBadge';

export type ScoreStatus = 'stable' | 'watch' | 'needs_attention' | 'critical';

export interface ScoreDimension {
  id: string;
  label: string;
  labelHi?: string;
  description: string;
  score: number | null;
  status: ScoreStatus;
  maxScore: number;
  unit?: string;
  formula: string;
  inputs: Array<{
    name: string;
    value: number | string;
    source: string;
    weight: string;
  }>;
  weights: Record<string, number>;
  source: { name: string; type: 'A' | 'B' | 'C'; url?: string };
  lastCalculation: string;
  confidence: 'low' | 'medium' | 'high';
  limitations: string;
  dataQuality?: 'verified' | 'official' | 'estimated' | 'insufficient';
}

interface SchoolHealthScoreProps {
  dimensions: ScoreDimension[];
  compositeScore: number | null;
  compositeStatus: ScoreStatus | null;
  scoringVersion: string;
  methodologyUrl?: string;
  onStatusClick?: (dimensionId: string) => void;
}

const STATUS_CONFIG: Record<ScoreStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  stable: {
    label: 'Stable',
    color: 'var(--good)',
    bg: 'var(--good-soft)',
    border: 'var(--good-line)',
    icon: CheckCircle2,
  },
  watch: {
    label: 'Watch',
    color: 'var(--warn)',
    bg: 'var(--warn-soft)',
    border: 'var(--warn-line)',
    icon: Eye,
  },
  needs_attention: {
    label: 'Needs Attention',
    color: 'var(--accent-ink)',
    bg: 'var(--accent-soft)',
    border: 'var(--accent-line)',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: 'var(--bad)',
    bg: 'var(--bad-soft)',
    border: 'var(--bad-line)',
    icon: AlertTriangle,
  },
};

export function SchoolHealthScore({
  dimensions,
  compositeScore,
  compositeStatus,
  scoringVersion,
  methodologyUrl,
  onStatusClick,
}: SchoolHealthScoreProps) {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {compositeScore !== null && compositeStatus && (
        <CompositeScoreCard
          score={compositeScore}
          status={compositeStatus}
          version={scoringVersion}
          methodologyUrl={methodologyUrl}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {dimensions.map(dim => (
          <DimensionCard
            key={dim.id}
            dimension={dim}
            isExpanded={expandedDim === dim.id}
            onToggle={() => setExpandedDim(expandedDim === dim.id ? null : dim.id)}
            onStatusClick={onStatusClick}
          />
        ))}
      </div>
    </div>
  );
}

function CompositeScoreCard({
  score,
  status,
  version,
  methodologyUrl,
}: {
  score: number;
  status: ScoreStatus;
  version: string;
  methodologyUrl?: string;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const pct = (score / 100) * 100;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `2px solid ${config.border}`,
        borderRadius: 16,
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: config.color,
          borderRadius: '16px 16px 0 0',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: 100, height: 100 }}>
            <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={50} cy={50} r={42} fill="transparent" stroke="#f1f5f9" strokeWidth={10} />
              <circle
                cx={50}
                cy={50}
                r={42}
                fill="transparent"
                stroke={config.color}
                strokeWidth={10}
                strokeDasharray={`${pct * 2.64} 264`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: config.color, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--ink-3)', fontWeight: 600 }}>/100</span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Icon size={18} style={{ color: config.color }} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: config.color }}>{config.label}</span>
            </div>
            <p style={{ fontSize: '0.78rem', opacity: 0.7, margin: 0, maxWidth: 400 }}>
              Composite of Infrastructure, Staffing, Attendance, Meals, Learning, and Safety dimensions.
              Requires minimum 5 reports across 3 days.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontFamily: 'monospace', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: 4, fontSize: '0.68rem' }}>
                {version}
              </span>
              {methodologyUrl && (
                <a href={methodologyUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--brand-ink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  Methodology <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionCard({
  dimension: dim,
  isExpanded,
  onToggle,
  onStatusClick,
}: {
  dimension: ScoreDimension;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusClick?: (id: string) => void;
}) {
  const config = STATUS_CONFIG[dim.status];
  const Icon = config.icon;
  const pct = dim.maxScore > 0 ? ((dim.score ?? 0) / dim.maxScore) * 100 : 0;
  const hasScore = dim.score !== null;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hasScore ? config.border : '#e2e8f0'}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{dim.label}</h4>
            {dim.labelHi && <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{dim.labelHi}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <span
              onClick={() => onStatusClick?.(dim.id)}
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                background: config.bg,
                color: config.color,
                border: `1px solid ${config.border}`,
                cursor: onStatusClick ? 'pointer' : 'default',
              }}
            >
              <Icon size={10} style={{ verticalAlign: '-1px', marginRight: 2 }} />
              {config.label}
            </span>
            <button
              onClick={onToggle}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.72rem', opacity: 0.6, margin: '0 0 0.75rem' }}>{dim.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: config.color,
                  borderRadius: 999,
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: hasScore ? config.color : 'var(--ink-4)', minWidth: 48, textAlign: 'right' }}>
            {dim.score !== null ? `${dim.score}` : '-'}
            {dim.unit && dim.score !== null && <span style={{ fontSize: '0.7em', opacity: 0.6 }}>{dim.unit}</span>}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          <SourceBadge sourceType={dim.source.type} sourceName={dim.source.name} />
          <span style={{ fontSize: '0.62rem', opacity: 0.5 }}>
            Calc: {new Date(dim.lastCalculation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          {dim.confidence !== 'high' && (
            <span style={{ fontSize: '0.62rem', color: dim.confidence === 'low' ? 'var(--bad)' : 'var(--warn)' }}>
              {dim.confidence === 'low' ? 'Low confidence' : '◐ Medium confidence'}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border)', marginTop: 0 }}>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Formula</div>
              <code style={{ fontSize: '0.78rem', background: 'var(--surface-2)', padding: '0.4rem 0.6rem', borderRadius: 6, display: 'block', border: '1px solid var(--border)' }}>
                {dim.formula}
              </code>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inputs & Weights</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                <thead>
                  <tr style={{ color: 'var(--ink-3)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', fontWeight: 600 }}>Input</th>
                    <th style={{ textAlign: 'center', padding: '0.3rem 0.4rem', fontWeight: 600 }}>Value</th>
                    <th style={{ textAlign: 'center', padding: '0.3rem 0.4rem', fontWeight: 600 }}>Weight</th>
                    <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', fontWeight: 600 }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {dim.inputs.map((input, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.35rem 0.4rem', fontWeight: 600 }}>{input.name}</td>
                      <td style={{ padding: '0.35rem 0.4rem', textAlign: 'center', fontWeight: 700 }}>{input.value}</td>
                      <td style={{ padding: '0.35rem 0.4rem', textAlign: 'center', color: 'var(--ink-3)' }}>{input.weight}</td>
                      <td style={{ padding: '0.35rem 0.4rem', fontSize: '0.68rem', opacity: 0.6 }}>{input.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={12} /> Limitations
              </div>
              <p style={{ fontSize: '0.74rem', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>{dim.limitations}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function getStatusFromScore(score: number | null): ScoreStatus {
  if (score === null) return 'needs_attention';
  if (score >= 75) return 'stable';
  if (score >= 50) return 'watch';
  if (score >= 25) return 'needs_attention';
  return 'critical';
}
