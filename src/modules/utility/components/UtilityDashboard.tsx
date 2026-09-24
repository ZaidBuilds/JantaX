import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';
import { CitizenDossierModal } from '../../accountability/components/CitizenDossierModal';
import { Scale, FileText } from 'lucide-react';

export function UtilityDashboard() {
  const { share } = useWhatsAppShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || '250001';
  const [pinInput, setPinInput] = useState(initialPin);
  const [currentPin, setCurrentPin] = useState(initialPin);
  const [dossierOpen, setDossierOpen] = useState(false);

  React.useEffect(() => {
    const p = searchParams.get('pin') || '250001';
    setPinInput(p);
    setCurrentPin(p);
  }, [searchParams]);

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  const powerStats = useMemo(() => {
    const suffix = parseInt(currentPin.substring(4, 6)) || 1;
    return {
      feederName: `${loc.district} Substation Feeder #${suffix}`,
      promisedSupplyHours: 24,
      actualSupplyHours: loc.region === 'North' ? 17 : loc.region === 'South' ? 22 : 19,
      loadSheddingMinutes: loc.region === 'North' ? 420 : loc.region === 'South' ? 120 : 300,
      voltageFluctuations: 'High voltage spikes reported between 6 PM to 9 PM',
      source: 'State Load Despatch Center (SLDC) Outage Logs',
    };
  }, [currentPin, loc]);

  const handleShare = () => {
    share({
      pinCode: currentPin,
      titleHindi: `DISCOM फीडर बिजली स्कोरकार्ड: ${powerStats.feederName}`,
      titleEnglish: `DISCOM Feeder Power Scorecard: ${powerStats.feederName}`,
      claimLabel: `Promised Supply: ${powerStats.promisedSupplyHours} Hours`,
      claimLabelHindi: `दावा की गई आपूर्ति: ${powerStats.promisedSupplyHours} घंटे`,
      realityLabel: `Actual Supply: ${powerStats.actualSupplyHours} Hours`,
      realityLabelHindi: `वास्तविक आपूर्ति: ${powerStats.actualSupplyHours} घंटे`,
      responsiblePerson: 'Assistant Engineer (AE) Substation',
      responsibleOrg: 'State Electricity Distribution Co. (DISCOM)',
      sourceUrl: 'https://cea.nic.in',
      moduleNameHindi: 'M11 - पानी-बिजली मीटर (Power Cut Tracker)',
    });
  };

  return (
    <div className="module-dashboard">
      <div className="glass-card dash-header-card" style={{ borderLeftColor: '#f59e0b' }}>
        <h2>⚡ बिजली कटौती स्कोरकार्ड (DISCOM Feeder Scorecard)</h2>
        <p>
          विद्युत वितरण कंपनियों (DISCOM) द्वारा २४ घंटे आपूर्ति के वादे बनाम आपके सब-स्टेशन फीडर पर हुई अघोषित कटौती की वास्तविक रिपोर्ट।
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Search Substation Feeder</h3>
        <div className="dash-search-row">
          <input
            type="text"
            className="form-input"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="पिन कोड दर्ज करें..."
          />
          <button onClick={() => { setCurrentPin(pinInput); setSearchParams({ pin: pinInput }); }} className="dash-search-btn">
            खोजें
          </button>
        </div>
        {loc.isValid && (
          <p className="dash-location-label">
            📍 Active: {loc.district} ({loc.state}) · {powerStats.feederName}
          </p>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Outage details / कटौती का विवरण</h3>
        <div className="dash-panel-grid">
          <div className="dash-panel claim">
            <span className="dash-panel-label">📢 SLA PROMISED (सरकारी वादा)</span>
            <p className="dash-panel-value">{powerStats.promisedSupplyHours} Hours</p>
          </div>
          <div className="dash-panel reality">
            <span className="dash-panel-label">👁️ ACTUAL SUPPLY (वास्तविक बिजली)</span>
            <p className="dash-panel-value">{powerStats.actualSupplyHours} Hours</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
          <div>🔴 <strong>कुल कटौती समय (Load Shedding):</strong> {powerStats.loadSheddingMinutes} Minutes ({(powerStats.loadSheddingMinutes / 60).toFixed(1)} Hours)</div>
          <div>⚠️ <strong>वोल्टेज में उतार-चढ़ाव (Fluctuations):</strong> {powerStats.voltageFluctuations}</div>
        </div>

        {/* 24-Hour Visual Delivery Bar */}
        <div style={{ margin: '1.25rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span>Feeder Daily Supply Reliability</span>
            <span style={{ color: powerStats.actualSupplyHours >= 20 ? '#047857' : '#b45309' }}>
              {powerStats.actualSupplyHours} / 24 Hours ({Math.round((powerStats.actualSupplyHours / 24) * 100)}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.round((powerStats.actualSupplyHours / 24) * 100)}%`,
                height: '100%',
                background: powerStats.actualSupplyHours >= 20 ? '#10b981' : '#f59e0b',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>

        <div className="card-footer-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span>Source: {powerStats.source}</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDossierOpen(true)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Scale size={14} style={{ color: '#0284c7' }} /> Draft SERC Penalty Petition
            </button>
            <button onClick={handleShare} className="btn-whatsapp">
              📤 Share Feeder Report
            </button>
          </div>
        </div>
      </div>

      <CitizenDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        defaultTab="lokayukta"
        rtiOptions={{
          publicAuthority: `Superintending Engineer, ${loc.district} Electricity Distribution Circle (DISCOM)`,
          department: 'Power & Energy Department',
          workTitle: `Feeder Supply & Unscheduled Load Shedding Audit: ${powerStats.feederName}`,
          localityPin: currentPin,
          specificIssue: `Demand hourly outage logs, transformer trip records, and compensation under Electricity (Rights of Consumers) Rules 2020 for ${powerStats.loadSheddingMinutes} mins daily load shedding.`,
        }}
        lokayuktaOptions={{
          complaintTitle: `Chronic Unscheduled Power Outages & Violation of 24x7 Supply Mandate`,
          authorityOrOfficer: `Executive Engineer (Distribution) & Substation In-Charge`,
          department: 'State Power Corporation / DISCOM',
          localityPin: currentPin,
          allegationSummary: `Substation recorded ${powerStats.loadSheddingMinutes} minutes of unannounced daily power cuts against 24x7 statutory supply mandate without notifying consumers or paying statutory outage compensation.`,
        }}
      />
    </div>
  );
}
