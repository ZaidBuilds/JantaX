import React from 'react';
import type { FreshnessStatus } from '../core/services/performanceCache';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface FreshnessBadgeProps {
  status: FreshnessStatus;
  ageMinutes?: number;
  lastUpdatedText?: string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status,
  ageMinutes = 0,
  lastUpdatedText
}) => {
  if (status === 'FRESH') {
    return (
      <span style={{
        background: '#ecfdf5',
        color: '#047857',
        border: '1px solid #a7f3d0',
        fontSize: '0.75rem',
        fontWeight: 800,
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem'
      }}>
        <CheckCircle2 size={13} /> Live Data {lastUpdatedText ? `· ${lastUpdatedText}` : ''}
      </span>
    );
  }

  if (status === 'CACHED') {
    return (
      <span style={{
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
        fontSize: '0.75rem',
        fontWeight: 800,
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem'
      }}>
        <Clock size={13} /> Cached ({ageMinutes}m ago)
      </span>
    );
  }

  return (
    <span style={{
      background: '#fef2f2',
      color: '#b91c1c',
      border: '1px solid #fecaca',
      fontSize: '0.75rem',
      fontWeight: 800,
      padding: '0.2rem 0.6rem',
      borderRadius: '9999px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem'
    }}>
      <AlertTriangle size={13} /> Stale Source Sync Required
    </span>
  );
};
