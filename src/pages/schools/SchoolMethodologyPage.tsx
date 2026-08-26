import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { SourceBadge } from '../../components/UI/SourceBadge';

const SCORING_VERSION = 'v2.0-2026-08';

const DIMENSIONS = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    labelHi: 'भौतिक संसाधन',
    formula: 'Score = (Toilet × 0.35) + (Water × 0.25) + (Electricity × 0.20) + (Classroom × 0.20)',
    inputs: [
      { name: 'Toilet Functional', source: 'UDISE+ / Community', weight: '35%' },
      { name: 'Water Available', source: 'UDISE+ / Community', weight: '25%' },
      { name: 'Electricity Connected', source: 'UDISE+', weight: '20%' },
      { name: 'Classroom Ready', source: 'UDISE+ / Community', weight: '20%' },
    ],
    statusThresholds: [
      { min: 75, status: 'Stable', description: 'All major infrastructure functional' },
      { min: 50, status: 'Watch', description: 'Some infrastructure issues reported' },
      { min: 25, status: 'Needs Attention', description: 'Multiple infrastructure deficiencies' },
      { min: -Infinity, status: 'Critical', description: 'Major infrastructure failures reported' },
    ],
    confidence: 'High for official data; Medium for community data',
    limitations: 'Community reports are voluntary and may over/under-represent actual conditions. Physical verification recommended.',
  },
  {
    id: 'staffing',
    label: 'Staffing',
    labelHi: 'शिक्षक संख्या',
    formula: 'Score = min(100, (Filled Posts / Sanctioned Posts) × 100)',
    inputs: [
      { name: 'Teachers Filled', source: 'UDISE+', weight: '40%' },
      { name: 'Vacant Posts', source: 'State HR', weight: '30%' },
      { name: 'Pupil-Teacher Ratio', source: 'Calculated', weight: '30%' },
    ],
    statusThresholds: [
      { min: 80, status: 'Stable', description: '≥80% posts filled' },
      { min: 60, status: 'Watch', description: '60-79% posts filled' },
      { min: 40, status: 'Needs Attention', description: '40-59% posts filled' },
      { min: -Infinity, status: 'Critical', description: '<40% posts filled' },
    ],
    confidence: 'High — official government data',
    limitations: 'Official counts may lag actual teacher deployments by 1-2 months. Para-teacher data updated quarterly.',
  },
  {
    id: 'ground-truth',
    label: 'Ground Truth',
    labelHi: 'जमीनी हकीकत',
    formula: 'Score = teacher_present×0.30 + toilet_usable×0.20 + mdm_served×0.25 + learning_materials×0.25 (YES=100, NOT_SURE=50, NO=0)',
    inputs: [
      { name: 'Teacher Present', source: 'Citizen Check-in', weight: '30%' },
      { name: 'Toilet Usable', source: 'Citizen Check-in', weight: '20%' },
      { name: 'MDM Served', source: 'Citizen Check-in', weight: '25%' },
      { name: 'Learning Materials', source: 'Citizen Check-in', weight: '25%' },
    ],
    statusThresholds: [
      { min: 75, status: 'Stable', description: '≥75: Most conditions reported positive' },
      { min: 50, status: 'Watch', description: '50-74: Some concerns raised' },
      { min: 25, status: 'Needs Attention', description: '25-49: Significant issues reported' },
      { min: -Infinity, status: 'Critical', description: '<25: Major deficiencies reported' },
    ],
    confidence: 'Varies — minimum 5 reports across 3 days required for display',
    limitations: 'Crowdsourced. Contributors are self-selected. Seasonal variation (monsoon, summer) affects reports. NOT statistically representative.',
  },
];

export function SchoolMethodologyPage() {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>School Health Score — Methodology</h2>
          <span style={{ fontFamily: 'monospace', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 7px', borderRadius: 4, fontSize: '0.72rem' }}>{SCORING_VERSION}</span>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          Transparent explanation of how JantaX calculates school health scores. No black boxes.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>What this is NOT</h3>
          <ul style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
            <li>This score is NOT a government rating or official certification</li>
            <li>It does NOT rank schools as "good" or "bad"</li>
            <li>It does NOT use AI or algorithmic judgment of school quality</li>
            <li>It is NOT statistically representative of year-round conditions</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #2563eb' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>What this IS</h3>
          <ul style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.3rem' }}>
            <li>A weighted composite of measurable, source-attributed indicators</li>
            <li>Every component has an explicit formula, inputs, weights, and source</li>
            <li>Confidence levels indicate data reliability</li>
            <li>Status labels (Stable/Watch/Needs Attention/Critical) are directly derived from score thresholds</li>
          </ul>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Score Dimensions</h3>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
        {DIMENSIONS.map(dim => (
          <div key={dim.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <button
              onClick={() => setExpandedDim(expandedDim === dim.id ? null : dim.id)}
              style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{dim.label}</span>
                {dim.labelHi && <span style={{ fontSize: '0.82rem', opacity: 0.5, marginLeft: '0.5rem' }}>{dim.labelHi}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>Confidence: {dim.confidence}</span>
                {expandedDim === dim.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {expandedDim === dim.id && (
              <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Formula</div>
                  <code style={{ fontSize: '0.85rem', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 8, display: 'block', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                    {dim.formula}
                  </code>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Inputs & Weights</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', fontWeight: 600 }}>Input</th>
                        <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', fontWeight: 600 }}>Source</th>
                        <th style={{ textAlign: 'center', padding: '0.4rem 0.5rem', fontWeight: 600 }}>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dim.inputs.map((inp, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '0.4rem 0.5rem', fontWeight: 600 }}>{inp.name}</td>
                          <td style={{ padding: '0.4rem 0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>{inp.source}</td>
                          <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>{inp.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Thresholds</div>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {dim.statusThresholds.map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: 800, minWidth: 120, color: t.status === 'Stable' ? '#166534' : t.status === 'Watch' ? '#92400e' : t.status === 'Needs Attention' ? '#c2410c' : '#991b1b' }}>
                          {t.status}
                        </span>
                        <span style={{ opacity: 0.7 }}>{t.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: '#fef3c7', borderRadius: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#92400e', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', marginBottom: '0.2rem' }}>Limitations</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>{dim.limitations}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Status Labels</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { status: 'Stable', color: '#166534', bg: '#dcfce7', desc: '≥75 score. Conditions generally satisfactory.', icon: CheckCircle2 },
            { status: 'Watch', color: '#92400e', bg: '#fef3c7', desc: '50-74 score. Some concerns present.', icon: Info },
            { status: 'Needs Attention', color: '#c2410c', bg: '#ffedd5', desc: '25-49 score. Significant issues reported.', icon: AlertTriangle },
            { status: 'Critical', color: '#991b1b', bg: '#fee2e2', desc: '<25 score. Major deficiencies requiring urgent action.', icon: AlertTriangle },
          ].map(item => (
            <div key={item.status} style={{ background: item.bg, borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: item.color, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <item.icon size={14} /> {item.status}
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Data Sources</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { name: 'UDISE+ (Unified District Information System for Education)', type: 'A' as const, desc: 'Annual census of all schools in India. Covers infrastructure, staffing, enrollment. Updated yearly (typically March).' },
            { name: 'DISE (District Information System for Education)', type: 'A' as const, desc: 'Census data used for planning. Covers school-level enrollment, facilities, and outcomes.' },
            { name: 'NAS (National Achievement Survey)', type: 'A' as const, desc: 'Class 3, 5, 8 student learning levels in language, math, EVS. Conducted triennially by NCERT.' },
            { name: 'Citizen Check-ins', type: 'C' as const, desc: 'GPS-tagged observations submitted by citizens through JantaX app. Voluntary, not statistically representative.' },
            { name: 'MDM Portal', type: 'B' as const, desc: 'Mid-day meal serving records. Self-reported by schools. Covers meal uptake and feeding days.' },
          ].map(src => (
            <div key={src.name} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
              <SourceBadge sourceType={src.type} sourceName={src.name} />
              <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: 0 }}>{src.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #64748b' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Versioning</h3>
        <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: 0 }}>
          This methodology version is <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: 3 }}>{SCORING_VERSION}</code>.
          Scores are recalculated whenever underlying data changes. Methodology changes are documented here with prior versions archived.
          Schools are never re-scored retroactively with new methodology — a new version creates new scores while preserving old ones.
        </p>
      </div>
    </div>
  );
}
