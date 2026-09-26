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

  let badgeColor = 'var(--good)';
  let badgeBg = 'var(--good-soft)';
  if (alert.status === 'Quarantined') {
    badgeColor = 'var(--bad)';
    badgeBg = 'var(--bad-soft)';
  } else if (alert.status === 'Pending Review') {
    badgeColor = 'var(--warn)';
    badgeBg = '#fffbebf';
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 16,
      border: alert.status === 'Quarantined' ? '2px solid var(--bad-line)' : '1px solid var(--border)',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(15,23,42,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ background: badgeBg, color: badgeColor, fontSize: '0.76rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
              {alert.status}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-3)', fontWeight: 600 }}>
              {alert.categoryLabel} · Detected {alert.detectedAt}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            {alert.sourceName}
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
            {alert.summary}
          </div>
        </div>

        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: 12, padding: '0.6rem 1rem', textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Confidence Score</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: v.confidenceScore < 90 ? 'var(--bad)' : 'var(--good)' }}>
            {v.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Delta Diff Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.85rem',
        background: 'var(--surface-2)',
        padding: '0.85rem 1.1rem',
        borderRadius: 12,
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Records Processed</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>{v.totalRecordsProcessed.toLocaleString()}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Changed Records</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-ink)' }}>{v.changedRecordsCount.toLocaleString()}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Rejected Records</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: v.rejectedRecordsCount > 0 ? 'var(--bad)' : 'var(--good)' }}>
            {v.rejectedRecordsCount.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Schema Anomalies</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: v.schemaAnomaliesCount > 0 ? 'var(--bad)' : 'var(--good)' }}>
            {v.schemaAnomaliesCount}
          </div>
        </div>
      </div>

      {/* Quarantine Reason Warning Box */}
      {v.requiresHumanReview && v.quarantineReason && (
        <div style={{
          background: 'var(--bad-soft)',
          border: '1px solid var(--bad-line)',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          fontSize: '0.82rem',
          color: 'var(--bad)',
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
              background: 'var(--good-solid)',
              color: 'var(--on-solid)',
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
