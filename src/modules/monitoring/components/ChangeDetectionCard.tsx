import React from 'react';
import type { InternalAlert } from '../types/dataMonitoring';
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Layers, FileText } from 'lucide-react';

interface ChangeDetectionCardProps {
  alert: InternalAlert;
  onApprove?: (id: string) => void;
  onQuarantine?: (id: string) => void;
}

export const ChangeDetectionCard: React.FC<ChangeDetectionCardProps> = ({
  alert,
  onApprove,
  onQuarantine
}) => {
  const v = alert.validation;

  let badgeColor = '#047857';
  let badgeBg = '#ecfdf5';
  if (alert.status === 'Quarantined') {
    badgeColor = '#b91c1c';
    badgeBg = '#fef2f2';
  } else if (alert.status === 'Pending Review') {
    badgeColor = '#b45309';
    badgeBg = '#fffbebf';
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      border: alert.status === 'Quarantined' ? '2px solid #fca5a5' : '1px solid #e2e8f0',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(15,23,42,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ background: badgeBg, color: badgeColor, fontSize: '0.76rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
              {alert.status}
            </span>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
              {alert.categoryLabel} · Detected {alert.detectedAt}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {alert.sourceName}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            {alert.summary}
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '0.6rem 1rem', textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Confidence Score</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: v.confidenceScore < 90 ? '#b91c1c' : '#047857' }}>
            {v.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Delta Diff Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.85rem',
        background: '#f8fafc',
        padding: '0.85rem 1.1rem',
        borderRadius: 12,
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Records Processed</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{v.totalRecordsProcessed.toLocaleString()}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Changed Records</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{v.changedRecordsCount.toLocaleString()}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Rejected Records</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: v.rejectedRecordsCount > 0 ? '#b91c1c' : '#047857' }}>
            {v.rejectedRecordsCount.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Schema Anomalies</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: v.schemaAnomaliesCount > 0 ? '#b91c1c' : '#047857' }}>
            {v.schemaAnomaliesCount}
          </div>
        </div>
      </div>

      {/* Quarantine Reason Warning Box */}
      {v.requiresHumanReview && v.quarantineReason && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          fontSize: '0.82rem',
          color: '#991b1b',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong>Quarantine Reason:</strong> {v.quarantineReason}
          </div>
        </div>
      )}

      {/* Action Buttons for Human Review */}
      {alert.status === 'Quarantined' && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onApprove && onApprove(alert.id)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 8,
              background: '#047857',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <CheckCircle2 size={14} /> Human Review: Approve & Publish
          </button>
        </div>
      )}
    </div>
  );
};
