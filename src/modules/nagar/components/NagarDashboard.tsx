import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function NagarDashboard() {
  const { share } = useWhatsAppShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || '250001';
  const [pinInput, setPinInput] = useState(initialPin);
  const [currentPin, setCurrentPin] = useState(initialPin);

  React.useEffect(() => {
    const p = searchParams.get('pin') || '250001';
    setPinInput(p);
    setCurrentPin(p);
  }, [searchParams]);

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  const municipalScore = useMemo(() => {
    return {
      wardNo: `Ward ${parseInt(currentPin.substring(4, 6)) || 12}`,
      garbageScore: '40% Collected (SLA Claim: 100%)',
      openDrainage: 'Severe water logging reported in commercial markets',
      waterSupplyHours: '1.5 Hours daily (SLA Claim: 6 Hours)',
      complianceChecklist: [
        { item: 'Trade licence (municipal corporation)', status: 'Required' },
        { item: 'FSSAI Food License', status: 'Required for eateries' },
        { item: 'Shops & Establishment Registration', status: 'Required for all shops' },
        { item: 'Fire NOC', status: 'Required for commercial > 50 sq.m' },
      ]
    };
  }, [currentPin]);

  const handleShare = () => {
    share({
      pinCode: currentPin,
      titleHindi: `नगर पालिका वार्ड स्कोरबोर्ड: ${municipalScore.wardNo}`,
      titleEnglish: `Municipal Ward Scoreboard: ${municipalScore.wardNo}`,
      claimLabel: `Claimed Water Supply: 6 Hours`,
      claimLabelHindi: `दावा की गई जलापूर्ति: ६ घंटे`,
      realityLabel: `Actual Hours: ${municipalScore.waterSupplyHours}`,
      realityLabelHindi: `वास्तविक जलापूर्ति: ${municipalScore.waterSupplyHours}`,
      responsiblePerson: 'Ward Engineer / Health Officer',
      responsibleOrg: 'Municipal Corporation',
      sourceUrl: 'https://swachhsurvekshan.org',
      moduleNameHindi: 'M10 - नगर स्कोरबोर्ड',
    });
  };

  return (
    <div className="module-dashboard">
      <div className="glass-card dash-header-card" style={{ borderLeftColor: 'var(--viz-4)' }}>
        <h2>City services scorecard</h2>
        <p>
          What the municipal body promised on sanitation and water supply, set against what wards report, plus the licences a small business needs.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Search Municipal Ward</h3>
        <div className="dash-search-row">
          <input
            type="text"
            className="form-input"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter a PIN code"
          />
          <button onClick={() => { setCurrentPin(pinInput); setSearchParams({ pin: pinInput }); }} className="dash-search-btn">
            Search
          </button>
        </div>
        {loc.isValid && (
          <p className="dash-location-label">
            Active: {loc.district} ({loc.state}) · {municipalScore.wardNo}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Ward scorecard */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--viz-4)' }}>Ward Service Scorecard</h3>
          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div className="stat-box">
              <strong>Garbage:</strong> {municipalScore.garbageScore}
            </div>
            <div className="stat-box">
              <strong>Water:</strong> {municipalScore.waterSupplyHours}
            </div>
            <div style={{ padding: '0.5rem 0.75rem', background: 'var(--status-critical-bg)', borderRadius: '6px', borderLeft: '3px solid var(--status-critical)' }}>
              <strong>Drains:</strong> {municipalScore.openDrainage}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button onClick={handleShare} className="btn-whatsapp">
              Share Ward Score
            </button>
          </div>
        </div>

        {/* Small business compliance */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--status-completed)' }}>MSME Compliance Maze</h3>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
            {municipalScore.complianceChecklist.map((c, idx) => (
              <div key={idx} className="stat-box" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.item}</span>
                <span style={{ color: 'var(--status-completed)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
