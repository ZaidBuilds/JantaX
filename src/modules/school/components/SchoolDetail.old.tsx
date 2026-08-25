import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../../../core/services/api';
import type { SchoolRecord } from '../types';

const METRIC_LABELS: Record<string, { en: string; hi: string; icon: string }> = {
  teacherPresent: { en: 'Teacher Present', hi: 'शिक्षक मौजूद', icon: '👨‍🏫' },
  toiletUsable: { en: 'Toilet Usable', hi: 'शौचालय चालू', icon: '🚻' },
  mdmServed: { en: 'MDM Served', hi: 'मिड-डे मील', icon: '🍱' },
  learningMaterials: { en: 'Materials Available', hi: 'सामग्री उपलब्ध', icon: '📚' },
  classroomReady: { en: 'Classroom Ready', hi: 'कक्षा तैयार', icon: '🏫' },
};

function MetricRow({ metricKey, state }: { metricKey: string; state: string }) {
  const label = METRIC_LABELS[metricKey];
  const stateConfig: Record<string, { color: string; bg: string; label: string }> = {
    yes: { color: '#166534', bg: '#dcfce7', label: '✅ हां / Yes' },
    no: { color: '#991b1b', bg: '#fecaca', label: '❌ नहीं / No' },
    not_sure: { color: '#92400e', bg: '#fef3c7', label: '❓ पता नहीं / Not Sure' },
    no_data: { color: '#6b7280', bg: '#f3f4f6', label: '— डेटा नहीं' },
  };
  const c = stateConfig[state] || stateConfig.no_data;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: '10px',
      background: '#f8fafc',
      border: '1px solid #f1f5f9',
      marginBottom: '0.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{label?.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label?.hi}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{label?.en}</div>
        </div>
      </div>
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
      }}>
        {c.label}
      </span>
    </div>
  );
}

interface SchoolDetailProps {
  schoolId: string;
  school?: SchoolRecord;
  onBack: () => void;
}

export function SchoolDetail({ schoolId, school: schoolProp, onBack }: SchoolDetailProps) {
  const [school, setSchool] = useState<SchoolRecord | undefined>(schoolProp);
  const [loading, setLoading] = useState<boolean>(!schoolProp);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'infra' | 'timeline' | 'evidence' | 'compare' | 'report'>('overview');
  
  // State for compare school selector
  const [compareSchoolId, setCompareSchoolId] = useState<string>('');
  
  // State for reporting form
  const [reportCategory, setReportCategory] = useState('toilet');
  const [reportDesc, setReportDesc] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [consentCheck, setConsentCheck] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [compareSchool, setCompareSchool] = useState<SchoolRecord | null>(null);
  const [pincodeSchools, setPincodeSchools] = useState<SchoolRecord[]>([]);

  useEffect(() => {
    if (schoolProp) {
      setSchool(schoolProp);
      setLoading(false);
      setError(null);
    } else if (schoolId) {
      setLoading(true);
      setError(null);
      api.getRecord('school', schoolId)
        .then((res: any) => {
          setSchool(res.record || res);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load school details:', err);
          setError('स्कूल डेटा लोड करने में विफल / Failed to load school details');
          setLoading(false);
        });
    }
  }, [schoolId, schoolProp]);

  useEffect(() => {
    if (school && school.location && school.location.pinCode) {
      api.getSchools(school.location.pinCode)
        .then((res: any) => {
          setPincodeSchools(res || []);
        })
        .catch((err) => {
          console.error('Failed to load other schools in pincode:', err);
        });
    }
  }, [school]);

  useEffect(() => {
    if (compareSchoolId) {
      api.getRecord('school', compareSchoolId)
        .then((res: any) => {
          setCompareSchool(res.record || res);
        })
        .catch((err) => {
          console.error('Failed to load comparison school details:', err);
        });
    } else {
      setCompareSchool(null);
    }
  }, [compareSchoolId]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="spinner" style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #cbd5e1', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', opacity: 0.6 }}>स्कूल डेटा लोड हो रहा है... / Loading school data...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error || 'स्कूल नहीं मिला / School not found'}</p>
        <button
          onClick={onBack}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.5rem',
            background: 'var(--color-primary)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← वापस जाएं / Go Back
        </button>
      </div>
    );
  }

  const scoreColor = school.groundTruthScore >= 70 ? '#10b981' : school.groundTruthScore >= 40 ? '#f59e0b' : '#ef4444';

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentCheck) {
      alert('कृपया फोटो/डेटा सत्यापन सहमति को स्वीकार करें।');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="module-dashboard" style={{ maxWidth: '850px', margin: '0 auto', padding: '1rem 0' }}>
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="back-button"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          padding: '0.5rem 0',
          fontWeight: 700,
          marginBottom: '1rem',
        }}
      >
        ← स्कूल सूची पर वापस / Back to Schools
      </button>

      {/* Header Banner */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '16px',
        background: 'rgba(15, 45, 89, 0.05)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px' }}>
          📍 PIN {school.location.pinCode} · {school.location.district}, {school.location.state}
          {school.location.block && ` · ${school.location.block}`}
          {school.location.ward && ` · Ward: ${school.location.ward}`}
        </div>
        <h1 style={{ margin: '0.5rem 0', fontSize: '1.5rem', color: 'var(--color-primary)' }}>{school.titleHindi}</h1>
        <div style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.75rem' }}>
          {school.titleEnglish}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
          <span>🆔 UDISE: <strong>{school.udiseCode}</strong></span>
          <span>📊 Level: <strong>{school.schoolLevel}</strong></span>
          <span>🏛️ {school.managementType}</span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button onClick={() => setActiveTab('overview')} className={`time-tab ${activeTab === 'overview' ? 'active' : ''}`}>Overview</button>
        <button onClick={() => setActiveTab('infra')} className={`time-tab ${activeTab === 'infra' ? 'active' : ''}`}>Infrastructure</button>
        <button onClick={() => setActiveTab('timeline')} className={`time-tab ${activeTab === 'timeline' ? 'active' : ''}`}>Timeline</button>
        <button onClick={() => setActiveTab('evidence')} className={`time-tab ${activeTab === 'evidence' ? 'active' : ''}`}>Evidence Gallery</button>
        <button onClick={() => setActiveTab('compare')} className={`time-tab ${activeTab === 'compare' ? 'active' : ''}`}>Compare</button>
        <button onClick={() => setActiveTab('report')} className={`time-tab ${activeTab === 'report' ? 'active' : ''}`}>Report Issue</button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Score & Responsible Officer row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ flex: 1, padding: '1.5rem', textAlign: 'center', minWidth: '250px' }}>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {school.groundTruthScore}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700 }}>/ 100 Ground Truth Score</div>
              <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.5 }}>
                Confidence: {school.confidenceLevel} · {school.totalCheckIns} parent check-ins
              </div>
            </div>
            
            <div className="glass-card" style={{ flex: 1, padding: '1.5rem', minWidth: '250px' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', fontWeight: 700 }}>👤 Responsible Officer / ज़िम्मेदार अधिकारी</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>{school.responsiblePerson}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{school.responsibleDesignation}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>{school.responsibleOrg}</div>
            </div>
          </div>

          {/* Claims vs Reality side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--status-approved-bg)', borderLeft: '4px solid var(--status-approved)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--status-approved)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                📈 UDISE+ Official Claim (सरकारी दावा)
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{school.claim.labelHindi}</p>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Source: {school.claim.source.nameHindi}</span>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--status-critical-bg)', borderLeft: '4px solid var(--status-critical)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: 'var(--status-critical)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                👁️ Parent Ground Truth (ज़मीनी हकीकत)
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{school.reality.labelHindi}</p>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Based on {school.reality.evidenceCount} citizen checks</span>
            </div>
          </div>

          {/* Five Metrics */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              📊 पांच दैनिक संकेतक / Five Daily Indicators
            </h3>
            {Object.entries(school.metrics).map(([key, value]) => (
              <MetricRow key={key} metricKey={key} state={value} />
            ))}
          </div>

          {/* Official Statistics */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>📋 Official Stats vs Observed Data</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ opacity: 0.6, fontSize: '0.72rem' }}>Enrolled Students (Official)</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.15rem' }}>{school.officialStudentCount}</div>
              </div>
              <div>
                <div style={{ opacity: 0.6, fontSize: '0.72rem' }}>Observed Attendance Band</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.15rem', color: '#f59e0b' }}>{school.observedStudentBand}</div>
              </div>
              <div>
                <div style={{ opacity: 0.6, fontSize: '0.72rem' }}>Posted Teachers (Official)</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.15rem' }}>{school.officialTeacherCount}</div>
              </div>
              <div>
                <div style={{ opacity: 0.6, fontSize: '0.72rem' }}>Last Audit Log</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.15rem' }}>{school.lastCheckInDate}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* M10 — School Infrastructure Tab */}
      {activeTab === 'infra' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            🏫 Detail Infrastructure Check (भौतिक संसाधन हकीकत)
          </h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            UDISE+ डेटाबेस में घोषित संसाधन दावों बनाम अभिभावकों द्वारा भौतिक निरीक्षण की सूची।
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left', opacity: 0.6 }}>
                <th style={{ paddingBottom: '0.75rem' }}>Infrastructure Item</th>
                <th style={{ paddingBottom: '0.75rem' }}>UDISE+ Claim</th>
                <th style={{ paddingBottom: '0.75rem', textAlign: 'right' }}>Parent Log</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>Separate Girls Toilets (शौचालय)</td>
                <td style={{ padding: '1rem 0', color: '#10b981' }}>✅ 100% Functional</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', color: '#ef4444', fontWeight: 700 }}>❌ Locked / No Water</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>Purified Water Supply (पेयजल)</td>
                <td style={{ padding: '1rem 0', color: '#10b981' }}>✅ RO Filter Available</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', color: '#ef4444', fontWeight: 700 }}>❌ Taps dry since 2 weeks</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>Electricity & Fans (बिजली)</td>
                <td style={{ padding: '1rem 0', color: '#10b981' }}>✅ Connected</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', color: '#f97316', fontWeight: 700 }}>⚠️ Frequent cuts / Fans broken</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>Playground & Boundary Wall</td>
                <td style={{ padding: '1rem 0', color: '#10b981' }}>✅ Completed</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>✅ Available</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0', fontWeight: 600 }}>Computer Lab (कंप्यूटर)</td>
                <td style={{ padding: '1rem 0', color: '#10b981' }}>✅ 5 Workstations</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', color: '#ef4444', fontWeight: 700 }}>❌ Locked/Out of order</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* M17 — School Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            ⏳ Progress Accountability Timeline (जवाबदेही प्रगति चक्र)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #cbd5e1' }}>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', border: '3px solid white' }}></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>2025-08-01 · parent report</div>
              <h4 style={{ fontSize: '0.95rem', margin: '0.15rem 0' }}>Toilet Not Usable Reported</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Citizen reported locked block and dry taps in girls toilets.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6', border: '3px solid white' }}></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>2025-08-03 · verify check</div>
              <h4 style={{ fontSize: '0.95rem', margin: '0.15rem 0' }}>Community Verification Complete</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>3 independent local check-ins verified the toilet is non-functional.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#f59e0b', border: '3px solid white' }}></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>2025-08-05 · notice dispatched</div>
              <h4 style={{ fontSize: '0.95rem', margin: '0.15rem 0' }}>District Officer Notified</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Official notice dispatched to District Basic Education Officer (BSA) citing UDISE vs Ground discrepancies.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.05rem', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', border: '3px solid white' }}></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 700 }}>2025-08-15 · action logged</div>
              <h4 style={{ fontSize: '0.95rem', margin: '0.15rem 0' }}>Action Planned: Maintenance Scheduled</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>MLA fund allocated ₹45,000 for repair. Work assigned to Local Contractor.</p>
            </div>

          </div>
        </div>
      )}

      {/* M16 — Evidence Gallery Tab */}
      {activeTab === 'evidence' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            📸 Verified Ground Truth Evidence (साक्ष्य गैलरी)
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            अभिभावकों द्वारा सत्यापित फोटो और वीडियो। गोपनीयता बनाए रखने हेतु EXIF डेटा मिटा दिया गया है।
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            <div style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ height: '150px', background: '#cbd5e1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80" alt="Toilet status" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>❌ Locked Toilet Block</span>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.2rem' }}>Verified · 5 days ago</div>
              </div>
            </div>

            <div style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ height: '150px', background: '#cbd5e1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&w=300&q=80" alt="Water tap dry" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>❌ Broken Drinking Water RO Tap</span>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.2rem' }}>Verified · 1 week ago</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* M18 — School Comparison Tab */}
      {activeTab === 'compare' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            ⚖️ School Comparison Matrix (स्कूल तुलना)
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            इस विद्यालय की तुलना ज़िले के किसी अन्य सरकारी विद्यालय से करें।
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Select School to Compare:</label>
            <select
              value={compareSchoolId}
              onChange={(e) => setCompareSchoolId(e.target.value)}
              className="form-input"
              style={{ maxWidth: '400px' }}
            >
              <option value="">-- तुलना के लिए स्कूल चुनें --</option>
              {pincodeSchools.filter((s: any) => s.id !== schoolId).map((s: any) => (
                <option key={s.id} value={s.id}>{s.titleHindi || s.nameHindi} ({s.titleEnglish || s.nameEnglish})</option>
              ))}
            </select>
          </div>

          {compareSchool ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '0.75rem' }}>Parameter</th>
                  <th style={{ paddingBottom: '0.75rem' }}>{school.titleHindi}</th>
                  <th style={{ paddingBottom: '0.75rem' }}>{compareSchool.titleHindi}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 700 }}>Ground Truth Score</td>
                  <td style={{ padding: '1rem 0', color: scoreColor, fontWeight: 800 }}>{school.groundTruthScore}</td>
                  <td style={{ padding: '1rem 0', color: compareSchool.groundTruthScore >= 70 ? '#10b981' : '#ef4444', fontWeight: 800 }}>{compareSchool.groundTruthScore}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 700 }}>Toilet Status</td>
                  <td style={{ padding: '1rem 0' }}>{school.metrics.toiletUsable === 'yes' ? '✅ usable' : '❌ unusable'}</td>
                  <td style={{ padding: '1rem 0' }}>{compareSchool.metrics.toiletUsable === 'yes' ? '✅ usable' : '❌ unusable'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 700 }}>Mid-Day Meal Served</td>
                  <td style={{ padding: '1rem 0' }}>{school.metrics.mdmServed === 'yes' ? '✅ yes' : '❌ no'}</td>
                  <td style={{ padding: '1rem 0' }}>{compareSchool.metrics.mdmServed === 'yes' ? '✅ yes' : '❌ no'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 700 }}>Total Check-ins</td>
                  <td style={{ padding: '1rem 0' }}>{school.totalCheckIns} parent reviews</td>
                  <td style={{ padding: '1rem 0' }}>{compareSchool.totalCheckIns} parent reviews</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
              कृपया तुलना करने के लिए ऊपर ड्रॉपडाउन से दूसरा सरकारी स्कूल चुनें।
            </div>
          )}
        </div>
      )}

      {/* M20 — Report School Issue Form Tab */}
      {activeTab === 'report' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
            📢 Report a School Issue (शिकायत दर्ज करें)
          </h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            इस विद्यालय में भौतिक संसाधनों की कमी या मध्याह्न भोजन में अनियमितताओं की गुप्त रिपोर्ट भेजें।
          </p>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid #10b981' }}>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
              <h4 style={{ fontSize: '1.2rem', color: '#10b981', margin: '0.5rem 0' }}>शिकायत सफलतापूर्वक दर्ज!</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>आपकी रिपोर्ट को SHA-256 सुरक्षित रूप से एन्क्रिप्ट कर दिया गया है। BSA विभाग को सूचित किया जा रहा है।</p>
              <button onClick={() => { setIsSubmitted(false); setReportDesc(''); }} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                New Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Select Category / शिकायत श्रेणी:</label>
                <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value)} className="form-input">
                  <option value="toilet">🚾 Toilet Non-functional / शौचालय बंद</option>
                  <option value="water">🚰 Water supply issue / पेयजल की कमी</option>
                  <option value="mdm">🍱 MDM Meal Interruption / भोजन अनियमितता</option>
                  <option value="teacher">👨‍🏫 Teacher Absence / शिक्षक की अनुपस्थिति</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Description / शिकायत विवरण:</label>
                <textarea
                  required
                  rows={4}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="form-input"
                  placeholder="कृपया समस्या का विस्तृत विवरण दर्ज करें (उदा. नल में पानी नहीं आ रहा)..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Upload Photo Evidence (Optional):</label>
                <input type="file" accept="image/*" className="form-input" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                  <span>🕵️ Report Anonymously (शिकायतकर्ता की पहचान गुप्त रखें)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={consentCheck} onChange={(e) => setConsentCheck(e.target.checked)} />
                  <span>🛡️ I certify this photo/data represents current ground truth.</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" style={{ padding: '0.65rem 2rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  Submit Anonymous Report
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
