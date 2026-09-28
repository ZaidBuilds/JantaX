import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getStoredAlerts, getStoredSnapshots, approveAlert, rollbackSnapshot } from '../services/monitoringService';
import type { InternalAlert, DatasetSnapshot } from '../types/dataMonitoring';
import { ChangeDetectionCard } from '../components/ChangeDetectionCard';
import { QuarantineQueue } from '../components/QuarantineQueue';
import { SnapshotRollback } from '../components/SnapshotRollback';
import { LivePipelineHealth } from '../components/LivePipelineHealth';
import { ShieldAlert, Activity, Clock, CheckCircle2, RotateCcw, AlertTriangle, Layers, Filter } from 'lucide-react';
import { Stat } from '../../../ui';

interface MonitoringDashboardPageProps {
  initialTab?: 'all' | 'quarantine' | 'snapshots';
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new_school_records', label: 'School records' },
  { id: 'new_tenders', label: 'Tenders' },
  { id: 'new_rera_orders', label: 'RERA orders' },
  { id: 'new_documents', label: 'Documents' },
];

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
    <div>
      <LivePipelineHealth />
      <div className="stat-row" style={{ marginBottom: 'var(--s-6)' }}>
        <Stat label="Example alerts" value={alerts.length} />
        <Stat label="Waiting for review" value={quarantinedAlerts.length} meta="Held back until a person approves them" />
        <Stat label="Saved snapshots" value={snapshots.length} meta="Versions you can roll back to" />
      </div>

      {/* Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <Link
          to="/monitoring"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'all' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'all' ? 'var(--accent-ink)' : 'var(--ink-3)',
            fontWeight: activeTab === 'all' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          All alerts ({alerts.length})
        </Link>

        <Link
          to="/monitoring/quarantine"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'quarantine' ? '3px solid var(--bad)' : '3px solid transparent',
            color: activeTab === 'quarantine' ? 'var(--bad)' : 'var(--ink-3)',
            fontWeight: activeTab === 'quarantine' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ShieldAlert size={16} /> Waiting for review ({quarantinedAlerts.length})
        </Link>

        <Link
          to="/monitoring/snapshots"
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'snapshots' ? '3px solid var(--brand-ink)' : '3px solid transparent',
            color: activeTab === 'snapshots' ? 'var(--brand-ink)' : 'var(--ink-3)',
            fontWeight: activeTab === 'snapshots' ? 800 : 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RotateCcw size={16} /> Snapshots and rollback
        </Link>
      </div>

      {/* Tab 1: All Internal Alerts */}
      {activeTab === 'all' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-3)' }}>Show:</span>
            {CATEGORY_FILTERS.map(({ id, label }) => (
              <button key={id} type="button" className="chip" aria-pressed={selectedCategory === id} onClick={() => setSelectedCategory(id)}>
                {label}
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
