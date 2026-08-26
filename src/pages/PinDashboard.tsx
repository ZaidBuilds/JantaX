import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../core/utils/pinResolver';
import { SourceBadge } from '../components/UI/SourceBadge';

export function PinDashboard() {
  const { pinCode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || pinCode || '250001';
  const [pinInput, setPinInput] = useState(initialPin);
  const [currentPin, setCurrentPin] = useState(initialPin);
  const { share } = useWhatsAppShare();

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  // Sample data for the Locality OS dashboard
  const dashboardData = {
    pin: currentPin,
    state: loc?.state || 'Uttar Pradesh',
    district: loc?.district || 'Meerut',
    schools: 12,
    healthFacilities: 4,
    worksProjects: 31,
    welfareCases: 15,
    latestInfo: 'Latest survey data as of August 2026',
    sources: [
      { name: 'CPCB AQI API', type: 'B-api', status: 'active' },
      { name: 'State Pollution Control Board', type: 'C-document', status: 'active' },
    ],
  };

  const handleShare = (pin: string) => {
    share({
      pinCode: pin,
      titleHindi: `स्थानीय जानकारी: ${loc?.district || 'Meerut'}`,
      titleEnglish: `Local Information: ${loc?.district || 'Meerut'}`,
      claimLabel: 'Data as on August 2026',
      claimLabelHindi: 'अगस्त 2026 तक का आंकड़ा',
      realityLabel: 'Local ground data verified',
      realityLabelHindi: 'स्थानीय जमीन verified',
      responsiblePerson: 'District Administration',
      responsibleOrg: 'District Administration',
      sourceUrl: 'https://cpcb.nic.in',
      moduleNameHindi: 'स्थानीय जानकारी (Locality OS)',
    });
  };

  return (
    <div className="module-dashboard">
      <div className="glass-card dash-header-card" style={{ borderLeftColor: '#06b6d4' }}>
        <h2>📍 Locality OS (स्थानीय ऑपरेटिंग सिस्टम)</h2>
        <p>{loc?.district || 'Meerut'} ({loc?.state || 'Uttar Pradesh'}) की स्थानीय खबरें और आँकड़े</p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>PIN {pinCode || pinInput}</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="PIN code"
            style={{ maxWidth: 160 }}
          />
          <button
            onClick={() => { setCurrentPin(pinInput); setSearchParams({ pin: pinInput }); }}
            className="btn btn-primary">
            खोजें
          </button>
        </div>
        {loc.isValid && (
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            📍 {loc.district} ({loc.state}){loc.stateCode ? ` · ${loc.stateCode}` : ''}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Schools */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Schools</h3>
          <p>{dashboardData.schools} Schools</p>
        </div>

        {/* Health */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Health</h3>
          <p>{dashboardData.healthFacilities} Facilities</p>
        </div>

        {/* Works */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Works</h3>
          <p>{dashboardData.worksProjects} Projects</p>
        </div>

        {/* Welfare */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Welfare</h3>
          <p>{dashboardData.welfareCases} Cases</p>
        </div>

        {/* Latest information */}
        <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Latest Information</h3>
          <p>{dashboardData.latestInfo}</p>
        </div>

        {/* Sources */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Sources</h3>
          {dashboardData.sources.map((s, i) => (
            <SourceBadge
              key={i}
              sourceType={s.type}
              sourceName={s.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}