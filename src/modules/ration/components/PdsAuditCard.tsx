import React, { useMemo } from 'react';
import { getPdsAuditForPin, PdsAuditEntry } from '../services/pdsAuditService';

interface Props {
  pinCode: string;
  onFilePetition: (fpsLicenseNo: string) => void;
}

function complianceColor(status: PdsAuditEntry['nfsaComplianceStatus']): string {
  switch (status) {
    case 'Compliant': return '#16a34a';
    case 'Partial': return '#d97706';
    case 'Non-Compliant': return '#dc2626';
  }
}

function complianceBg(status: PdsAuditEntry['nfsaComplianceStatus']): string {
  switch (status) {
    case 'Compliant': return '#f0fdf4';
    case 'Partial': return '#fffbeb';
    case 'Non-Compliant': return '#fef2f2';
  }
}

function fulfillmentColor(pct: number): string {
  if (pct >= 90) return '#16a34a';
  if (pct >= 60) return '#d97706';
  return '#dc2626';
}

export function PdsAuditCard({ pinCode, onFilePetition }: Props) {
  const auditEntries = useMemo(() => getPdsAuditForPin(pinCode), [pinCode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {auditEntries.map((entry) => (
        <FpsAuditRow key={entry.fpsLicenseNo} entry={entry} onFilePetition={onFilePetition} />
      ))}
    </div>
  );
}

function FpsAuditRow({ entry, onFilePetition }: { entry: PdsAuditEntry; onFilePetition: (fps: string) => void }) {
  const e = entry;
  const cColor = complianceColor(e.nfsaComplianceStatus);
  const cBg = complianceBg(e.nfsaComplianceStatus);

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Ribbon */}
      <div
        className="card-ribbon"
        style={{ margin: '-1.25rem -1.25rem 1rem', borderRadius: '10px 10px 0 0' }}
      >
        <span>FPS LICENSE: <strong>{e.fpsLicenseNo}</strong></span>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.2rem 0.55rem',
            borderRadius: 6,
            background: cBg,
            color: cColor,
            border: `1px solid ${cColor}40`,
          }}
        >
          {e.nfsaComplianceStatus === 'Compliant' ? '✅' : e.nfsaComplianceStatus === 'Partial' ? '⚠️' : '🚨'} {e.nfsaComplianceStatus}
        </span>
      </div>

      {/* Area + Operating Info */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        📍 {e.fpsArea} · Operating Days: <strong>{e.operatingDaysPerMonth}/25</strong> · Biometric Auth: <strong>{e.biometricAuthPct}%</strong>
      </div>

      {/* Quota Fulfillment Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <QuotaGauge
          label="🌾 Wheat (गेहूं)"
          allocated={e.wheatAllocatedKg}
          distributed={e.wheatDistributedKg}
        />
        <QuotaGauge
          label="🍚 Rice (चावल)"
          allocated={e.riceAllocatedKg}
          distributed={e.riceDistributedKg}
        />
      </div>

      {/* Overall Fulfillment Bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          <span>Overall Quota Fulfillment / कुल कोटा पूर्ति</span>
          <span style={{ color: fulfillmentColor(e.quotaFulfillmentPct) }}>{e.quotaFulfillmentPct}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(e.quotaFulfillmentPct, 100)}%`,
              background: fulfillmentColor(e.quotaFulfillmentPct),
            }}
          />
        </div>
      </div>

      {/* Ghost Card Alert */}
      {e.ghostCardFlag && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderLeft: '4px solid #dc2626',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>👻</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#b91c1c' }}>
              Ghost Card Suspect Alert / भूत राशन कार्ड चेतावनी
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '0.2rem' }}>
              {e.ghostCardSuspects} beneficiaries registered but never collected entitlement.
              Suspect rate: <strong>{Math.round((e.ghostCardSuspects / e.registeredBeneficiaries) * 1000) / 10}%</strong> (threshold: &gt;10%).
              Total registered: {e.registeredBeneficiaries} · Actually served: {e.actualDistributionCount}.
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary & Inspection Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          fontSize: '0.78rem',
        }}
      >
        <div className="stat-box" style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>Registered</div>
          <div style={{ fontWeight: 900 }}>{e.registeredBeneficiaries}</div>
        </div>
        <div className="stat-box" style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>Served</div>
          <div style={{ fontWeight: 900, color: e.ghostCardFlag ? '#dc2626' : '#16a34a' }}>{e.actualDistributionCount}</div>
        </div>
        <div className="stat-box" style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>Last Inspection</div>
          <div style={{ fontWeight: 900 }}>{e.lastInspectionDate}</div>
        </div>
        <div className="stat-box" style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>Inspector</div>
          <div style={{ fontWeight: 700, fontSize: '0.72rem' }}>{e.inspectingOfficer}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button
          onClick={() => onFilePetition(e.fpsLicenseNo)}
          style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            padding: '0.5rem 1rem',
            borderRadius: 8,
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1.5px solid #fecaca',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          📋 File DGRO Petition (शिकायत दर्ज करें)
        </button>
      </div>
    </div>
  );
}

function QuotaGauge({ label, allocated, distributed }: { label: string; allocated: number; distributed: number }) {
  const pct = allocated > 0 ? Math.round((distributed / allocated) * 1000) / 10 : 0;
  const shortfall = Math.max(0, allocated - distributed);
  const color = fulfillmentColor(pct);

  return (
    <div
      style={{
        padding: '0.7rem',
        borderRadius: 8,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
        <span>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-track" style={{ height: 8, marginBottom: '0.3rem' }}>
        <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color, height: '100%' }} />
      </div>
      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
        {distributed} / {allocated} kg · Shortfall: <strong style={{ color: shortfall > 0 ? '#dc2626' : '#16a34a' }}>{shortfall} kg</strong>
      </div>
    </div>
  );
}
