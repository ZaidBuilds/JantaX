import React from 'react';
import { Link } from 'react-router-dom';
import { getActiveGrapStage, getGrapRules } from '../services/pollutionService';
import { GrapStatusCard } from '../components/GrapStatusCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, ShieldAlert, FileText, ExternalLink } from 'lucide-react';

export function GrapGuidePage() {
  const activeGrap = getActiveGrapStage();
  const allGrap = getGrapRules();

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/pollution"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Air Quality Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Graded Response Action Plan (GRAP) — Complete Citizen Guide
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          Statutory directions issued by the Commission for Air Quality Management (CAQM) in NCR and Adjoining Areas for control of severe ambient air pollution during winter smog episodes.
        </p>

        <GrapStatusCard activeStage={activeGrap} allStages={allGrap} />

        {/* All Stages Detailed Breakdown */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d59', marginBottom: '1rem' }}>
            Full 4-Stage GRAP Restriction Hierarchy
          </h3>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {allGrap.map((stage) => (
              <div
                key={stage.stageNumber}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2d59' }}>
                    {stage.stageName} ({stage.stageNameHi})
                  </span>
                  <span style={{ background: '#0f2d59', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                    {stage.aqiThreshold}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Enforcing Authority: {stage.enforcingAuthority} • Order: {stage.gazetteOrderNumber}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#991b1b', marginBottom: '0.5rem' }}>
                  <strong>Key Restrictions:</strong>
                  <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.2rem' }}>
                    {stage.bannedActivities.map((b, i) => (
                      <li key={i} style={{ marginBottom: '0.2rem' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
