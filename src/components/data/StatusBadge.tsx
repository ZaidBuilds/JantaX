import React from 'react';

interface StatusBadgeProps {
  status: string;
  statusHi?: string;
  type?: 'approved' | 'construction' | 'delayed' | 'completed' | 'critical' | 'neutral';
}

export function StatusBadge({ status, statusHi, type }: StatusBadgeProps) {
  // Determine badge type based on status string if not explicitly provided
  const badgeType = type || (
    status.toLowerCase().includes('complete') ? 'completed' :
    status.toLowerCase().includes('delay') ? 'delayed' :
    status.toLowerCase().includes('ongoing') || status.toLowerCase().includes('progress') ? 'construction' :
    status.toLowerCase().includes('attention') || status.toLowerCase().includes('critical') || status.toLowerCase().includes('poor') ? 'critical' :
    'neutral'
  );

  return (
    <span className={`status-badge ${badgeType}`}>
      {statusHi ? `${statusHi} — ${status}` : status}
    </span>
  );
}
