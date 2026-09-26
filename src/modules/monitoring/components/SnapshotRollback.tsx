import React from 'react';
import type { DatasetSnapshot } from '../types/dataMonitoring';
import { RotateCcw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

interface SnapshotRollbackProps {
  snapshots: DatasetSnapshot[];
  onRollback: (id: string) => void;
}

export const SnapshotRollback: React.FC<SnapshotRollbackProps> = ({
  snapshots,
  onRollback
}) => {
  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{
        background: 'var(--brand-soft)',
        border: '1px solid var(--brand-line)',
        borderRadius: 14,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.86rem',
        color: 'var(--ink)'
      }}>
        <RotateCcw size={22} style={{ flexShrink: 0, color: 'var(--brand-ink)' }} />
        <div>
          <strong>1-Click Immutable Dataset Rollback:</strong> Every data ingestion cycle creates a versioned snapshot. If an anomalous update bypasses checks, administrators can instantly revert to a known-good baseline dataset snapshot.
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
        Versioned Dataset Snapshots & Restore Controls ({snapshots.length})
      </h3>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {snapshots.map((snap) => (
          <div
            key={snap.id}
            style={{
              background: 'var(--surface)',
              borderRadius: 16,
              border: snap.isCurrentActive ? '2px solid var(--good)' : '1px solid var(--border)',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(15,23,42,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  {snap.isCurrentActive && (
                    <span style={{ background: 'var(--good-soft)', color: 'var(--good)', fontSize: '0.74rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={12} /> Active Live Version
                    </span>
                  )}
                  <span style={{ fontSize: '0.76rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                    Created {snap.createdAt}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                  {snap.moduleName} ({snap.versionTag})
                </h4>
              </div>

              {!snap.isCurrentActive && (
                <button
                  type="button"
                  onClick={() => onRollback(snap.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 8,
                    background: 'var(--bad-solid)',
                    color: 'var(--on-solid)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <RotateCcw size={13} /> Rollback to This Snapshot
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)', marginBottom: '0.65rem' }}>
              {snap.notes}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.74rem', color: 'var(--ink-3)', fontFamily: 'monospace' }}>
              <span>Records: <strong>{snap.recordCount.toLocaleString()}</strong></span>
              <span>SHA-256: {snap.sha256Hash.substring(0, 20)}...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
