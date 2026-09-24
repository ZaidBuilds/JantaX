import React, { useState } from 'react';
import { calculateCompositeCivicScore, CivicScoringInputs } from '../services/transparencyService';
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  School, 
  ShieldCheck, 
  HeartPulse, 
  Wheat, 
  Wind, 
  Scale 
} from 'lucide-react';

const PRESETS: Record<string, { label: string; pin: string; inputs: CivicScoringInputs }> = {
  chandigarh: {
    label: 'Chandigarh Sector 17',
    pin: '160017',
    inputs: {
      schoolsRteCompliance: 92,
      roadDlpWarranty: 88,
      healthcareIphsReadiness: 90,
      rationNfsaFulfillment: 95,
      airQualityIndex: 65,
      grievanceRedressalRate: 85
    }
  },
  delhi: {
    label: 'Delhi Connaught Place',
    pin: '110001',
    inputs: {
      schoolsRteCompliance: 80,
      roadDlpWarranty: 75,
      healthcareIphsReadiness: 85,
      rationNfsaFulfillment: 82,
      airQualityIndex: 220,
      grievanceRedressalRate: 70
    }
  },
  meerut: {
    label: 'Meerut Civil Lines',
    pin: '250001',
    inputs: {
      schoolsRteCompliance: 68,
      roadDlpWarranty: 65,
      healthcareIphsReadiness: 62,
      rationNfsaFulfillment: 78,
      airQualityIndex: 160,
      grievanceRedressalRate: 58
    }
  },
  deficit: {
    label: 'Critical Deficit Zone',
    pin: '800001',
    inputs: {
      schoolsRteCompliance: 35,
      roadDlpWarranty: 30,
      healthcareIphsReadiness: 40,
      rationNfsaFulfillment: 45,
      airQualityIndex: 340,
      grievanceRedressalRate: 25
    }
  }
};

export const InteractiveScoringCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CivicScoringInputs>(PRESETS.meerut.inputs);
  const [activePreset, setActivePreset] = useState<string>('meerut');

  const result = calculateCompositeCivicScore(inputs);

  const handlePreset = (key: string) => {
    setActivePreset(key);
    setInputs(PRESETS[key].inputs);
  };

  const handleSliderChange = (field: keyof CivicScoringInputs, val: number) => {
    setActivePreset('');
    setInputs((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 20,
      border: '1px solid #e2e8f0',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Calculator size={12} /> AUDIT SIMULATOR
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              Deterministic 6-Pillar Formula
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            Interactive Mathematical Scoring Sandbox
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Tweak any parameter slider below to see how our exact mathematical formula recalculates the locality score.
          </p>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {Object.entries(PRESETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 8,
                border: activePreset === key ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: activePreset === key ? '#eff6ff' : '#ffffff',
                color: activePreset === key ? '#1d4ed8' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {data.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Live Score Meter on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Sliders Container */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          
          {/* 1. Schools */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <School size={15} style={{ color: '#2563eb' }} /> 1. Schools RTE Compliance (Weight: 25%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb' }}>
                {inputs.schoolsRteCompliance}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.schoolsRteCompliance}
              onChange={(e) => handleSliderChange('schoolsRteCompliance', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.schools.points}</strong> / 25.0 pts
            </div>
          </div>

          {/* 2. Road DLP */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={15} style={{ color: '#ea580c' }} /> 2. Road DLP Active Warranty (Weight: 25%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c' }}>
                {inputs.roadDlpWarranty}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.roadDlpWarranty}
              onChange={(e) => handleSliderChange('roadDlpWarranty', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.roads.points}</strong> / 25.0 pts
            </div>
          </div>

          {/* 3. Healthcare */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <HeartPulse size={15} style={{ color: '#e11d48' }} /> 3. Healthcare IPHS Readiness (Weight: 15%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e11d48' }}>
                {inputs.healthcareIphsReadiness}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.healthcareIphsReadiness}
              onChange={(e) => handleSliderChange('healthcareIphsReadiness', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.health.points}</strong> / 15.0 pts
            </div>
          </div>

          {/* 4. Ration */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Wheat size={15} style={{ color: '#16a34a' }} /> 4. Ration NFSA Fulfillment (Weight: 15%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>
                {inputs.rationNfsaFulfillment}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.rationNfsaFulfillment}
              onChange={(e) => handleSliderChange('rationNfsaFulfillment', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#16a34a', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.ration.points}</strong> / 15.0 pts
            </div>
          </div>

          {/* 5. Air Quality AQI */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Wind size={15} style={{ color: '#0284c7' }} /> 5. Air Quality (AQI Index) (Weight: 10%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7' }}>
                {inputs.airQualityIndex} AQI ({result.pillarBreakdown.airQuality.normalizedScore}/100 normalized)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              value={inputs.airQualityIndex}
              onChange={(e) => handleSliderChange('airQualityIndex', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.airQuality.points}</strong> / 10.0 pts (AQI &le; 50 is best)
            </div>
          </div>

          {/* 6. Citizen Grievances */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Scale size={15} style={{ color: '#7c3aed' }} /> 6. Grievance Disposal Rate (Weight: 10%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed' }}>
                {inputs.grievanceRedressalRate}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.grievanceRedressalRate}
              onChange={(e) => handleSliderChange('grievanceRedressalRate', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
              Points earned: <strong>{result.pillarBreakdown.grievances.points}</strong> / 10.0 pts
            </div>
          </div>

        </div>

        {/* Live Score Display Card */}
        <div style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mathematical Result
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.4rem 0' }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                {result.compositeScore}
              </span>
              <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>/ 100</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: result.gradeColor,
              color: '#ffffff',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 800
            }}>
              Grade: {result.grade} Civic Health
            </div>
          </div>

          {/* Mathematical Proof Accordion Box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <div style={{ color: '#fb923c', fontWeight: 700, marginBottom: '0.4rem' }}>
              MATHEMATICAL EXPANSION:
            </div>
            <div style={{ color: '#e2e8f0', lineHeight: 1.6 }}>
              = (0.25 × {inputs.schoolsRteCompliance}) + (0.25 × {inputs.roadDlpWarranty}) + (0.15 × {inputs.healthcareIphsReadiness}) + (0.15 × {inputs.rationNfsaFulfillment}) + (0.10 × {result.pillarBreakdown.airQuality.normalizedScore}) + (0.10 × {inputs.grievanceRedressalRate})
              <br />
              = {result.pillarBreakdown.schools.points} + {result.pillarBreakdown.roads.points} + {result.pillarBreakdown.health.points} + {result.pillarBreakdown.ration.points} + {result.pillarBreakdown.airQuality.points} + {result.pillarBreakdown.grievances.points}
              <br />
              = <strong style={{ color: '#38bdf8' }}>{result.compositeScore}</strong>
            </div>
          </div>

          {/* Contribution Progress Bar */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>
              PILLAR WEIGHTED CONTRIBUTIONS
            </div>
            <div style={{ height: 10, borderRadius: 999, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ width: `${(result.pillarBreakdown.schools.points / 100) * 100}%`, background: '#2563eb' }} title="Schools (25%)" />
              <div style={{ width: `${(result.pillarBreakdown.roads.points / 100) * 100}%`, background: '#ea580c' }} title="Roads (25%)" />
              <div style={{ width: `${(result.pillarBreakdown.health.points / 100) * 100}%`, background: '#e11d48' }} title="Health (15%)" />
              <div style={{ width: `${(result.pillarBreakdown.ration.points / 100) * 100}%`, background: '#16a34a' }} title="Ration (15%)" />
              <div style={{ width: `${(result.pillarBreakdown.airQuality.points / 100) * 100}%`, background: '#0284c7' }} title="AQI (10%)" />
              <div style={{ width: `${(result.pillarBreakdown.grievances.points / 100) * 100}%`, background: '#7c3aed' }} title="Grievances (10%)" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#6ee7b7' }}>
            <CheckCircle2 size={14} /> Zero human editorial intervention. 100% deterministic code.
          </div>
        </div>

      </div>
    </div>
  );
};
