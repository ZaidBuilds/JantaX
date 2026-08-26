import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getStoredAlerts, getStoredSnapshots, approveAlert, rollbackSnapshot } from '../services/monitoringService';
import type { InternalAlert, DatasetSnapshot } from '../types/dataMonitoring';
import { ChangeDetectionCard } from '../components/ChangeDetectionCard';
import { QuarantineQueue } from '../components/QuarantineQueue';
import { SnapshotRollback } from '../components/SnapshotRollback';
import { ShieldAlert, Activity, Clock, CheckCircle2, RotateCcw, AlertTriangle, Layers, Filter } from 'lucide-react';

interface MonitoringDashboardPageProps {
  initialTab?: 'all' | 'quarantine' | 'snapshots';
}

export function MonitoringDashboardPage({ initialTab }: MonitoringDashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<InternalAlert[]>(() => getStoredAlerts());
  const [snapshots, setSnapshots] = useState<DatasetSnapshot[]>(() => getStoredSnapshots());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentPath = location.pathname;
  let activeTab: 'all' | 'quarantine' | 'snapshots' = initialTab || 'all';
  if (currentPath.endsWith('/quarantine')) activeTab = 'quarantine';
  else if (currentPath.endsWith('/snapshots')) activeTab = 'snapshots';

  const quarantinedAlerts = alerts.filter((a) => a.status === 'Quarantined');

  const handleApprove = (alertId: string) => {
    const updated = approveAlert(alertId);
    setAlerts(updated);
  };

  const handleRollback = (snapshotId: string) => {
    const { snapshots: newSnaps, alerts: newAlerts } = rollbackSnapshot(snapshotId);
    setSnapshots(newSnaps);
    setAlerts(newAlerts);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 20,
        padding: '2.25rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 12px 32px rgba(15,23,42,0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} /> JANTAX PHASE 27
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Automated Data Monitoring & Anomaly Quarantine Control
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          Data Monitoring & Change Detection Center
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#cbd5e1', maxWidth: 820, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Automated change detection across documents, reports, datasets, tenders, RERA orders, and school records. Automated confidence thresholds prevent suspicious updates from auto-publishing without human review.
        </p>

        {/* Status Counter Chips */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.65rem 1.15rem', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Total System Alerts</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{alerts.length}</div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.65rem 1.15rem', borderRadius: 12 }}>
            <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700 }}>Quarantined Updates</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{quarantinedAlerts.length} Require Review</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.65rem 1.15rem', borderRadius: 12 }}>
            <div style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 700 }}>Active Version Snapshots</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{snapshots.length} Baselines</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <Link
          to="/monitoring"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'all' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'all' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'all' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          All System Alerts ({alerts.length})
        </Link>

        <Link
          to="/monitoring/quarantine"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'quarantine' ? '3px solid #ef4444' : '3px solid transparent',
            color: activeTab === 'quarantine' ? '#ef4444' : '#64748b',
            fontWeight: activeTab === 'quarantine' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ShieldAlert size={16} /> Human Review Quarantine Queue ({quarantinedAlerts.length})
        </Link>

        <Link
          to="/monitoring/snapshots"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'snapshots' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'snapshots' ? '#2563eb' : '#64748b',
            fontWeight: activeTab === 'snapshots' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RotateCcw size={16} /> Dataset Snapshots & Rollback
        </Link>
      </div>

      {/* Tab 1: All Internal Alerts */}
      {activeTab === 'all' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>Filter Category:</span>
            {['all', 'new_school_records', 'new_tenders', 'new_rera_orders', 'new_documents'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  background: selectedCategory === cat ? '#0f172a' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {filteredAlerts.map((alert) => (
              <ChangeDetectionCard
                key={alert.id}
                alert={alert}
                onApprove={handleApprove}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Quarantine Queue */}
      {activeTab === 'quarantine' && (
        <QuarantineQueue
          quarantinedAlerts={quarantinedAlerts}
          onApprove={handleApprove}
        />
      )}

      {/* Tab 3: Snapshots & Rollback */}
      {activeTab === 'snapshots' && (
        <SnapshotRollback
          snapshots={snapshots}
          onRollback={handleRollback}
        />
      )}
    </div>
  );
}
