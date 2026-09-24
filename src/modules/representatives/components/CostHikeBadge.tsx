import React from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CostHikeBadgeProps {
  percentage: number;
  reason?: string;
  compact?: boolean;
}

export const CostHikeBadge: React.FC<CostHikeBadgeProps> = ({
  percentage,
  reason,
  compact = false,
}) => {
  if (percentage <= 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: compact ? '0.72rem' : '0.8rem',
          fontWeight: 700,
          color: '#16a34a',
          background: '#dcfce7',
          padding: '0.2rem 0.55rem',
          borderRadius: 6,
          border: '1px solid #bbf7d0',
        }}
        title="Project executed within original sanctioned budget"
      >
        <CheckCircle2 size={12} /> On Budget (0% Hike)
      </span>
    );
  }

  const isSevere = percentage >= 20;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: compact ? '0.72rem' : '0.8rem',
        fontWeight: 700,
        color: isSevere ? '#dc2626' : '#d97706',
        background: isSevere ? '#fee2e2' : '#fef3c7',
        padding: '0.2rem 0.55rem',
        borderRadius: 6,
        border: `1px solid ${isSevere ? '#fecaca' : '#fde68a'}`,
      }}
      title={reason ? `Cost Overrun Reason: ${reason}` : 'Cost exceeded original tender sanction'}
    >
      {isSevere ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
      +{percentage}% Cost Hike
    </span>
  );
};
