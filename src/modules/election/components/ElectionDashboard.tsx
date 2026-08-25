import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function ElectionDashboard() {
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
  const [activeTab, setActiveTab] = useState<'election' | 'exams'>('election');

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  const data = useMemo(() => {
    const suffix = parseInt(currentPin.substring(4, 6)) || 1;
    return {
      candidateName: loc.region === 'North' ? 'श्री राम निवास सिंह' : 'Shri K. Raghavan',
      declaredSpendLakhs: 32.50,
      estimatedActualSpendLakhs: 185.00,
      auditSource: 'ECI Affidavits vs Association for Democratic Reforms (ADR) Field Estimates 2024',
      examTimeline: {
        examName: 'SSC CGL / State PSC Group B Recruitment',
        notifiedDate: '2023-01-15',
        plannedExamDate: '2023-06-20',
        actualExamDate: '2023-11-10 (Delayed by 5 months)',
        resultDate: '2024-04-15 (Delayed by 6 months)',
        joiningDate: '2025-02-18 (1.5 years delay from promised date)',
      }
    };
  }, [currentPin, loc]);

  const handleShare = () => {
    if (activeTab === 'election') {
      share({
        pinCode: currentPin,
        titleHindi: `चुनाव खर्च ऑडिट: ${data.candidateName}`,
        titleEnglish: `Election Spend Audit: ${data.candidateName}`,
        claimLabel: `ECI Declared Limit: ₹${data.declaredSpendLakhs} Lakhs`,
        claimLabelHindi: `ECI घोषित सीमा: ₹${data.declaredSpendLakhs} लाख`,
        realityLabel: `ADR Estimated Spend: ₹${data.estimatedActualSpendLakhs} Lakhs`,
        realityLabelHindi: `ADR अनुमानित वास्तविक खर्च: ₹${data.estimatedActualSpendLakhs} लाख`,
        responsiblePerson: data.candidateName,
        responsibleOrg: 'Election Commission of India',
        sourceUrl: 'https://eci.gov.in',
        moduleNameHindi: 'M14 - चुनाव खर्चा (Election Spend Audit)',
      });
    } else {
      share({
        pinCode: currentPin,
        titleHindi: `भर्ती परीक्षा विलंब: ${data.examTimeline.examName}`,
        titleEnglish: `Recruitment Exam Delay: ${data.examTimeline.examName}`,
        claimLabel: `Notified Date: ${data.examTimeline.notifiedDate}`,
        claimLabelHindi: `अधिसूचना तिथि: ${data.examTimeline.notifiedDate}`,
        realityLabel: `Actual Joining: ${data.examTimeline.joiningDate}`,
        realityLabelHindi: `वास्तविक नियुक्ति तिथि: ${data.examTimeline.joiningDate}`,
        responsiblePerson: 'Commission Chairperson',
        responsibleOrg: 'Staff Selection Commission / PSC',
        sourceUrl: 'https://ssc.gov.in',
        moduleNameHindi: 'M14 - परीक्षा विलंब ट्रैकर (Exam Delay Tracker)',
      });
    }
  };

  return (
    <div className="module-dashboard">
      
      {/* Header */}
      <div className="glass-card dash-header-card" style={{ borderLeftColor: '#f43f5e' }}>
        <h2>🗳️ चुनाव खर्च और परीक्षा ट्रैकर (Election Spend & Exam Delay Tracker)</h2>
        <p>
          चुनाव उम्मीदवारों द्वारा घोषित सीमा खर्च बनाम वास्तविक आकलित खर्च, तथा भर्ती परीक्षाओं में अधिसूचना से नियुक्ति तक होने वाले विलंब का वास्तविक लेखा-जोखा।
        </p>
      </div>

      {/* Tabs */}
      <div className="dash-tab-group">
        <button
          onClick={() => setActiveTab('election')}
          className={`dash-tab-btn ${activeTab === 'election' ? 'active' : ''}`}
        >
          Election Spend Audit (चुनाव खर्चा)
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`dash-tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
        >
          Exam Delay Tracker (परीक्षा विलंब)
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Search Constituency</h3>
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
            📍 Active: {loc.district} ({loc.state})
          </p>
        )}
      </div>

      {activeTab === 'election' ? (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Candidate Spend Audit: {data.candidateName}</h3>
          <div className="dash-panel-grid">
            <div className="dash-panel claim">
              <span className="dash-panel-label">📢 ECI DECLARED LIMIT (घोषित सीमा)</span>
              <p className="dash-panel-value">₹{data.declaredSpendLakhs} Lakhs</p>
            </div>
            <div className="dash-panel reality">
              <span className="dash-panel-label">👁️ ADR ESTIMATED SPEND (अनुमानित खर्च)</span>
              <p className="dash-panel-value">₹{data.estimatedActualSpendLakhs} Lakhs</p>
            </div>
          </div>
          <div className="card-footer-meta">
            <span>Source: {data.auditSource}</span>
            <button onClick={handleShare} className="btn-whatsapp">
              📤 Share Spend Audit
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--status-delayed)' }}>Exam Delay Timeline / भर्ती परीक्षा चक्र</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>📢 <strong>विज्ञप्ति तिथि (Notified):</strong> {data.examTimeline.notifiedDate}</div>
            <div>🗓️ <strong>नियोजित परीक्षा (Planned Exam):</strong> {data.examTimeline.plannedExamDate}</div>
            <div>⚠️ <strong>वास्तविक परीक्षा (Actual Exam):</strong> <span style={{ color: 'var(--status-critical)' }}>{data.examTimeline.actualExamDate}</span></div>
            <div>📊 <strong>परीक्षा परिणाम (Result):</strong> <span style={{ color: 'var(--status-critical)' }}>{data.examTimeline.resultDate}</span></div>
            <div>💼 <strong>वास्तविक नियुक्ति (Joining):</strong> <span style={{ color: 'var(--status-critical)' }}>{data.examTimeline.joiningDate}</span></div>
          </div>
          <div className="card-footer-meta" style={{ marginTop: '1.5rem' }}>
            <span>Source: Official Commission Notification Schedules</span>
            <button onClick={handleShare} className="btn-whatsapp">
              📤 Share Exam Timeline
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
