import React from 'react';
import type { GrapStageRule } from '../types/pollution';
import { ShieldAlert, AlertOctagon, CheckCircle2, XCircle, FileText } from 'lucide-react';

interface Props {
  activeStage: GrapStageRule;
  allStages: GrapStageRule[];
}

export function GrapStatusCard({ activeStage, allStages }: Props) {
  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: 0 }}>
            Graded Response Action Plan (GRAP) — Statutory Enforcement
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Mandated by Commission for Air Quality Management (CAQM) under Section 12
          </span>
        </div>

        <div>
          <span
            className="jantax-badge-alert"
            style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0.3rem 0.8rem' }}
          >
            🔥 {activeStage.stageName} ENFORCED
          </span>
        </div>
      </div>

      {/* Stage Tracker Stepper */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {allStages.map((stage) => {
          const isThisActive = stage.stageNumber === activeStage.stageNumber;

          return (
            <div
              key={stage.stageNumber}
              style={{
                background: isThisActive ? '#fef2f2' : '#f8fafc',
                border: `1.5px solid ${isThisActive ? '#dc2626' : '#e2e8f0'}`,
                borderRadius: 10,
                padding: '0.75rem',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isThisActive ? '#dc2626' : '#64748b', textTransform: 'uppercase' }}>
                Stage {stage.stageNumber}
              </span>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isThisActive ? '#991b1b' : '#334155', marginTop: '0.15rem' }}>
                {stage.stageName.split('—')[1] || stage.stageName}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{stage.aqiThreshold}</span>
            </div>
          );
        })}
      </div>

      {/* Active Stage Details (Banned vs Allowed) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Banned Activities */}
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <XCircle size={15} /> Prohibited & Banned Activities
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.45 }}>
            {activeStage.bannedActivities.map((b, i) => (
              <li key={i} style={{ marginBottom: '0.3rem' }}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Mandatory Measures */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1d4ed8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={15} /> Mandatory Civic & Citizen Actions
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.45 }}>
            {activeStage.mandatoryCitizenActions.map((m, i) => (
              <li key={i} style={{ marginBottom: '0.3rem' }}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
