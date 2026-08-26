import React from 'react';
import { getSyncStatuses } from '../services/transparencyService';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { Clock, CheckCircle2, AlertTriangle, RefreshCw, Database } from 'lucide-react';

export function DataFreshnessPage() {
  const syncItems = getSyncStatuses();

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#ecfeff', color: '#0e7490', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          LIVE SYNC DASHBOARD
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.4rem' }}>
          Data Freshness & Realtime Sync Status
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.55 }}>
          Real-time operational status of JantaX automated ingestion workers, API webhooks, and gazette parser sync cycles.
        </p>
      </div>

      {/* Sync Health Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Ingestion Feeds</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>{syncItems.length} Feeds</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>100% Operational</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Records Ingested</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
            {syncItems.reduce((acc, s) => acc + s.totalRecordsIngested, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Indexed Across Modules</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Sync Health</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>99.6%</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>99.9% Uptime Target</div>
        </div>
      </div>

      {/* Sync Table */}
      <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Government Source Name</th>
              <th style={{ padding: '1rem 1.25rem' }}>Refresh Cycle</th>
              <th style={{ padding: '1rem 1.25rem' }}>Last Successful Sync</th>
              <th style={{ padding: '1rem 1.25rem' }}>Records Ingested</th>
              <th style={{ padding: '1rem 1.25rem' }}>Sync Status</th>
            </tr>
          </thead>
          <tbody>
            {syncItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {item.sourceName}
                  <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 500 }}>{item.publishingEntity}</div>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#334155', fontWeight: 600 }}>{item.updateFrequency}</td>
                <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{item.lastSuccessfulSync}</td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>{item.totalRecordsIngested.toLocaleString()}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{
                    background: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <CheckCircle2 size={12} /> {item.status} ({item.syncHealthPct}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
