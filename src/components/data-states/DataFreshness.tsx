import React from 'react';
import { AlertTriangle, Clock, Database, WifiOff, Info } from 'lucide-react';

interface DataFreshnessBadgeProps {
  lastUpdated: string | Date;
  nextUpdate?: string | Date;
  source?: string;
  variant?: 'inline' | 'banner';
  className?: string;
}

export function DataFreshnessBadge({
  lastUpdated,
  nextUpdate,
  source,
  variant = 'inline',
  className = '',
}: DataFreshnessBadgeProps) {
  const lastUpdatedDate = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60);
  const daysSinceUpdate = hoursSinceUpdate / 24;

  let freshness: 'fresh' | 'aging' | 'stale' | 'critical';
  let freshnessColor: string;
  let freshnessBg: string;
  let freshnessLabel: string;

  if (hoursSinceUpdate < 24) {
    freshness = 'fresh';
    freshnessColor = '#10b981';
    freshnessBg = 'rgba(16, 185, 129, 0.1)';
    freshnessLabel = 'Updated recently';
  } else if (hoursSinceUpdate < 72) {
    freshness = 'aging';
    freshnessColor = '#f59e0b';
    freshnessBg = 'rgba(245, 158, 11, 0.1)';
    freshnessLabel = `${Math.floor(hoursSinceUpdate)}h ago`;
  } else if (daysSinceUpdate < 7) {
    freshness = 'stale';
    freshnessColor = '#f97316';
    freshnessBg = 'rgba(249, 115, 22, 0.1)';
    freshnessLabel = `${Math.floor(daysSinceUpdate)}d ago`;
  } else {
    freshness = 'critical';
    freshnessColor = '#ef4444';
    freshnessBg = 'rgba(239, 68, 68, 0.1)';
    freshnessLabel = `${Math.floor(daysSinceUpdate)}d ago`;
  }

  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${className}`}
        style={{
          background: freshnessBg,
          borderColor: freshnessColor + '30',
        }}
      >
        <Clock size={18} style={{ color: freshnessColor }} />
        <div className="flex-1">
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: freshnessColor }}>
            {freshnessLabel}
          </p>
          {source && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Source: {source}
            </p>
          )}
        </div>
        {nextUpdate && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Next: {typeof nextUpdate === 'string' ? nextUpdate : nextUpdate.toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Clock size={12} style={{ color: freshnessColor }} />
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: freshnessColor,
          padding: '2px 6px',
          borderRadius: 999,
          background: freshnessBg,
        }}
      >
        {freshnessLabel}
      </span>
    </div>
  );
}

interface StaleDataBadgeProps {
  lastUpdated: string | Date;
  expectedInterval?: string;
  source?: string;
  className?: string;
}

export function StaleDataBadge({
  lastUpdated,
  expectedInterval = '24h',
  source,
  className = '',
}: StaleDataBadgeProps) {
  const lastUpdatedDate = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60);
  const daysSinceUpdate = hoursSinceUpdate / 24;

  const isStale = hoursSinceUpdate > 24;

  if (!isStale) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${className}`}
      style={{
        background: 'rgba(249, 115, 22, 0.08)',
        borderColor: 'rgba(249, 115, 22, 0.2)',
      }}
    >
      <AlertTriangle size={14} style={{ color: '#f97316' }} />
      <div className="flex-1">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>
          Data may be outdated
        </p>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
          Last update: {Math.floor(daysSinceUpdate)}d ago (expected: {expectedInterval})
          {source && ` · Source: ${source}`}
        </p>
      </div>
    </div>
  );
}

interface SourceUnavailableProps {
  sourceName: string;
  failedAt?: string | Date;
  onRetry?: () => void;
  className?: string;
}

export function SourceUnavailable({
  sourceName,
  failedAt,
  onRetry,
  className = '',
}: SourceUnavailableProps) {
  const failedAtDate = failedAt
    ? typeof failedAt === 'string'
      ? new Date(failedAt)
      : failedAt
    : null;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${className}`}
      style={{
        background: 'rgba(239, 68, 68, 0.05)',
        borderColor: 'rgba(239, 68, 68, 0.15)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(239, 68, 68, 0.1)' }}
      >
        <Database size={16} style={{ color: '#ef4444' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>
          {sourceName} unavailable
        </p>
        {failedAtDate && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Failed at {failedAtDate.toLocaleTimeString()}
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#ef4444',
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 6,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

interface PartialDataNoticeProps {
  loadedFields: string[];
  missingFields: string[];
  source?: string;
  onRetry?: () => void;
  className?: string;
}

export function PartialDataNotice({
  loadedFields,
  missingFields,
  source,
  onRetry,
  className = '',
}: PartialDataNoticeProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${className}`}
      style={{
        background: 'rgba(245, 158, 11, 0.06)',
        borderColor: 'rgba(245, 158, 11, 0.2)',
      }}
    >
      <Info size={16} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>
          Partial data available
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Some fields are missing: {missingFields.join(', ')}
          {source && ` · Source: ${source}`}
        </p>
        {loadedFields.length > 0 && (
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Available: {loadedFields.join(', ')}
          </p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#f59e0b',
              background: 'transparent',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            Retry missing fields →
          </button>
        )}
      </div>
    </div>
  );
}

interface VerificationPendingProps {
  entityType?: string;
  submittedAt?: string | Date;
  className?: string;
}

export function VerificationPending({
  entityType = 'This record',
  submittedAt,
  className = '',
}: VerificationPendingProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${className}`}
      style={{
        background: 'rgba(14, 165, 233, 0.06)',
        borderColor: 'rgba(14, 165, 233, 0.2)',
      }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: '#0ea5e9' }}
      />
      <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#0ea5e9' }}>
        Verification pending
      </p>
      {submittedAt && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          · Submitted {typeof submittedAt === 'string' ? submittedAt : submittedAt.toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
