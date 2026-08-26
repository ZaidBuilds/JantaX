import React from 'react';
import type { InternalAlert } from '../types/dataMonitoring';
import { ChangeDetectionCard } from './ChangeDetectionCard';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface QuarantineQueueProps {
  quarantinedAlerts: InternalAlert[];
  onApprove: (id: string) => void;
}

export const QuarantineQueue: React.FC<QuarantineQueueProps> = ({
  quarantinedAlerts,
  onApprove
}) => {
  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{
        background: '#fffbebf',
        border: '1px solid #fde68a',
        borderRadius: 14,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.86rem',
        color: '#b45309'
      }}>
        <ShieldAlert size={22} style={{ flexShrink: 0, color: '#d97706' }} />
        <div>
          <strong>Suspicious Data Quarantine Policy:</strong> JantaX never automatically publishes suspicious dataset updates. Updates with confidence scores below 90%, schema anomalies, or high rejection rates are quarantined for human auditor review.
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
        Quarantine & Human Review Queue ({quarantinedAlerts.length})
      </h3>

      {quarantinedAlerts.length === 0 ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '1.25rem', textAlign: 'center', color: '#047857', fontWeight: 700 }}>
          ✓ Quarantine queue clean. All active dataset syncs meet automated validation standards.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {quarantinedAlerts.map((alert) => (
            <ChangeDetectionCard
              key={alert.id}
              alert={alert}
              onApprove={onApprove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
