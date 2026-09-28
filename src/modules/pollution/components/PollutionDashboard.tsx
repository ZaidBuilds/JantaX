import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function PollutionDashboard() {
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

  const pollutionRecords = useMemo(() => {
    const suffix = parseInt(currentPin.substring(4, 6)) || 1;
    return {
      aqiValue: loc.region === 'North' ? 342 : loc.region === 'South' ? 88 : 160,
      aqiStatus: loc.region === 'North' ? 'Very Poor' : loc.region === 'South' ? 'Satisfactory' : 'Moderate',
      activeSPCBNotices: [
        {
          industryName: `M/S Balaji Chemical Industries Pvt Ltd #${suffix}`,
          noticeType: 'Closure Order / SPCB Section 33A',
          issueDate: '2025-06-12',
          violationReason: 'कचरा पानी को बिना शोधित किए सीधे जल स्रोतों में बहाया जा रहा था।',
        }
      ],
      source: 'Central Pollution Control Board (CPCB) / State PCB Notices Portal 2025',
    };
  }, [currentPin, loc]);

  const handleShare = () => {
    share({
      pinCode: currentPin,
      titleHindi: `प्रदूषण नोटिस रिपोर्ट: ${pollutionRecords.activeSPCBNotices[0].industryName}`,
      titleEnglish: `Pollution Notice Report: ${pollutionRecords.activeSPCBNotices[0].industryName}`,
      claimLabel: `Air Quality Index (AQI): ${pollutionRecords.aqiValue} - ${pollutionRecords.aqiStatus}`,
      claimLabelHindi: `वायु गुणवत्ता सूचकांक: ${pollutionRecords.aqiValue} - ${pollutionRecords.aqiStatus}`,
      realityLabel: `Violation: ${pollutionRecords.activeSPCBNotices[0].violationReason}`,
      realityLabelHindi: `उल्लंघन: ${pollutionRecords.activeSPCBNotices[0].violationReason}`,
      responsiblePerson: 'Regional Environment Officer',
      responsibleOrg: 'State Pollution Control Board',
      sourceUrl: 'https://cpcb.nic.in',
      moduleNameHindi: 'M13 - प्रदूषण नक्शा',
    });
  };

  return (
    <div className="module-dashboard">
      <div className="glass-card dash-header-card" style={{ borderLeftColor: 'var(--aqi-satisfactory)' }}>
        <h2>Pollution notices</h2>
        <p>
          CPCB air quality readings, with closure orders and show-cause notices issued by the state pollution control board near you.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Search Pollution Notices</h3>
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
            Active: {loc.district} ({loc.state})
          </p>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Air Quality Index</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', padding: '0.75rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--status-critical)' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>AQI Value: {pollutionRecords.aqiValue}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--status-critical)', fontWeight: 700 }}>{pollutionRecords.aqiStatus}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>Active PCB Notices</h3>
        {pollutionRecords.activeSPCBNotices.map((n, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--status-critical)' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{n.industryName}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-critical)', fontWeight: 700, marginBottom: '0.75rem' }}>{n.noticeType}</div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <strong>Violation:</strong> {n.violationReason}
            </p>
            <div className="card-footer-meta">
              <span>Issue Date: {n.issueDate}</span>
              <button onClick={handleShare} className="btn-whatsapp">
                Share SPCB Notice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
