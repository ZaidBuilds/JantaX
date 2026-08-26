import React from 'react';
import { MapPin, Clock, AlertTriangle, Minus, CheckCircle } from 'lucide-react';
import { SourceBadge } from '../UI/SourceBadge';
import { DataFreshnessBadge } from '../data-states';

export interface MetricData {
  label: string;
  value: string | number | null;
  unit?: string;
  status?: 'available' | 'unavailable' | 'stale' | 'partial';
  source?: { type: string; name: string; lastSync?: Date | string };
  freshness?: Date | string | null;
  alert?: string | null;
  trend?: 'up' | 'down' | 'stable' | null;
  trendValue?: string;
}

interface MetricCardProps {
  metric: MetricData;
  icon?: React.ReactNode;
  color?: string;
  onViewDetails?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  metric,
  icon,
  color = '#6b7280',
  onViewDetails,
  isLoading = false,
  className = '',
}: MetricCardProps) {
  const isAvailable = metric.status !== 'unavailable' && metric.value !== null && metric.value !== '—';
  const isStale = metric.status === 'stale' || (metric.freshness && !isFresh(metric.freshness));

  const displayValue = isLoading
    ? null
    : metric.value === null || metric.value === undefined
    ? '—'
    : metric.value;

  const statusColor = !isAvailable
    ? '#94a3b8'
    : metric.status === 'stale'
    ? '#f97316'
    : metric.status === 'partial'
    ? '#f59e0b'
    : '#10b981';

  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: '1.25rem 1rem',
        textAlign: 'center',
        position: 'relative',
        borderTop: `3px solid ${isAvailable ? color : '#e2e8f0'}`,
      }}
    >
      {icon && (
        <div style={{ marginBottom: '0.75rem', color: isAvailable ? color : '#94a3b8' }}>
          {icon}
        </div>
      )}

      {isLoading ? (
        <>
          <div className="skeleton" style={{ width: 48, height: 32, borderRadius: 6, margin: '0 auto 0.5rem' }} />
          <div className="skeleton" style={{ width: '70%', height: 12, borderRadius: 4, margin: '0 auto 0.25rem' }} />
          <div className="skeleton" style={{ width: '50%', height: 10, borderRadius: 4, margin: '0 auto' }} />
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: isAvailable ? 'var(--color-primary)' : '#cbd5e1',
              lineHeight: 1.1,
              marginBottom: '0.35rem',
            }}
          >
            {displayValue}
            {metric.unit && isAvailable && (
              <span style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.6, marginLeft: 2 }}>
                {metric.unit}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '0.35rem',
            }}
          >
            {metric.label}
          </div>

          {metric.alert && isAvailable && (
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#ef4444',
                marginBottom: '0.35rem',
              }}
            >
              {metric.alert}
            </div>
          )}

          {!isAvailable && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#94a3b8',
                padding: '2px 8px',
                background: '#f1f5f9',
                borderRadius: 999,
                marginBottom: '0.35rem',
              }}
            >
              <Minus size={10} /> Data unavailable
            </div>
          )}

          {isStale && isAvailable && (
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: '#f97316',
                marginBottom: '0.35rem',
              }}
            >
              <AlertTriangle size={10} style={{ verticalAlign: '-1px', marginRight: 2 }} />
              Data may be outdated
            </div>
          )}

          {metric.source && isAvailable && (
            <div style={{ marginTop: '0.5rem' }}>
              <SourceBadge sourceType={metric.source.type} sourceName={metric.source.name} />
            </div>
          )}

          {metric.freshness && isAvailable && (
            <div style={{ marginTop: '0.35rem' }}>
              <DataFreshnessBadge lastUpdated={metric.freshness} variant="inline" />
            </div>
          )}
        </>
      )}

      {onViewDetails && isAvailable && !isLoading && (
        <button
          onClick={onViewDetails}
          style={{
            marginTop: '0.75rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View Details →
        </button>
      )}
    </div>
  );
}

function isFresh(freshness: Date | string | null | undefined): boolean {
  if (!freshness) return false;
  const date = typeof freshness === 'string' ? new Date(freshness) : freshness;
  const hoursSince = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  return hoursSince < 72;
}

export interface LocationHeaderProps {
  pincode: string;
  location: {
    district: string;
    state: string;
    stateCode?: string;
    region?: string;
  };
  lastUpdated?: Date | string | null;
  actions?: {
    onShare?: () => void;
    onDownload?: () => void;
    onLocate?: () => void;
    onChangePin?: (newPin: string) => void;
  };
  following?: boolean;
  onToggleFollow?: () => void;
  isLoading?: boolean;
}

export function LocationHeader({
  pincode,
  location,
  lastUpdated,
  actions,
  following = false,
  onToggleFollow,
  isLoading = false,
}: LocationHeaderProps) {
  const handleChangePin = () => {
    const newPin = prompt('Enter PIN Code:', pincode);
    if (newPin && /^\d{6}$/.test(newPin) && actions?.onChangePin) {
      actions.onChangePin(newPin);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isLoading ? (
          <>
            <div className="skeleton" style={{ width: 120, height: 40, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>
              PIN Code {pincode}
            </h2>
            <button
              onClick={handleChangePin}
              style={{
                padding: '0.4rem 1rem',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              Change PIN
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {actions?.onShare && (
          <button
            onClick={actions.onShare}
            className="time-tab"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
        )}

        {actions?.onDownload && (
          <button
            onClick={actions.onDownload}
            className="search-action-btn"
            style={{ borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Report
          </button>
        )}

        {actions?.onLocate && (
          <button
            onClick={actions.onLocate}
            className="time-tab"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
            }}
            title="Detect my location"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
            </svg>
            Locate
          </button>
        )}

        {onToggleFollow && (
          <button
            onClick={onToggleFollow}
            className="search-action-btn"
            style={{
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: following ? '#10b981' : 'var(--color-primary)',
            }}
          >
            {following ? (
              <>
                <CheckCircle size={15} /> Following
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Follow
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export interface AboutLocationCardProps {
  location: {
    district: string;
    state: string;
    stateCode?: string;
    region?: string;
    areaType?: string;
  };
  population?: string | null;
  lastUpdated?: Date | string | null;
  isLoading?: boolean;
}

export function AboutLocationCard({
  location,
  population,
  lastUpdated,
  isLoading = false,
}: AboutLocationCardProps) {
  const formatDate = (d: Date | string | null | undefined) => {
    if (!d) return '—';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const infoRows = [
    { label: 'Location', value: `${location.district}, ${location.state}`, badge: location.stateCode },
    { label: 'District', value: location.district },
    { label: 'Region', value: location.region || '—' },
    { label: 'Area Type', value: location.areaType || '—' },
    { label: 'Population (Est.)', value: population || '—' },
    { label: 'Last Updated', value: formatDate(lastUpdated) },
  ];

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        About this area
      </h3>
      {isLoading ? (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ width: '40%', height: 14, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: '50%', height: 14, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
          {infoRows.map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ opacity: 0.6 }}>{row.label}:</span>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {row.value}
                {row.badge && (
                  <span
                    style={{
                      background: 'var(--color-primary-50)',
                      color: 'var(--color-primary-700)',
                      border: '1px solid var(--color-primary-500)',
                      padding: '0 5px',
                      borderRadius: 999,
                      fontSize: '0.6rem',
                      fontWeight: 800,
                    }}
                  >
                    {row.badge}
                  </span>
                )}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
