import { useState, useMemo, useEffect } from 'react';
import { api } from '../../../core/services/api';
import type { SchoolRecord } from '../types';
import { useLanguage } from '../../../core/context/LanguageContext';

interface SchoolDashProps {
  onSelectSchool: (id: string) => void;
  pinFilter?: string;
}

const METRIC_LABELS: Record<string, { en: string; hi: string; icon: string }> = {
  teacherPresent: { en: 'Teacher Present', hi: 'शिक्षक मौजूद', icon: '👨‍🏫' },
  toiletUsable: { en: 'Toilet Usable', hi: 'शौचालय चालू', icon: '🚻' },
  mdmServed: { en: 'MDM Served', hi: 'मिड-डे मील', icon: '🍱' },
  learningMaterials: { en: 'Materials Available', hi: 'सामग्री उपलब्ध', icon: '📚' },
  classroomReady: { en: 'Classroom Ready', hi: 'कक्षा तैयार', icon: '🏫' },
};

const STATUS_COLORS: Record<string, string> = {
  'Needs Attention': '#ef4444',
  'Mixed Signals': '#f59e0b',
  'Looking Steady': '#10b981',
};

function MetricBadge({ state }: { state: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    yes: { bg: '#dcfce7', text: '#166534', label: '✅ हां' },
    no: { bg: '#fecaca', text: '#991b1b', label: '❌ नहीं' },
    not_sure: { bg: '#fef3c7', text: '#92400e', label: '❓ पता नहीं' },
    no_data: { bg: '#f3f4f6', text: '#6b7280', label: '— डेटा नहीं' },
  };
  const c = colors[state] || colors.no_data;
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.7rem',
      fontWeight: 600,
      backgroundColor: c.bg,
      color: c.text,
    }}>
      {c.label}
    </span>
  );
}

export function SchoolDashboard({ onSelectSchool, pinFilter }: SchoolDashProps) {
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getSchools(pinFilter || '').then((res: any) => {
      if (!cancelled) {
        setSchools(res.records?.school || []);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [pinFilter]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'district'>('list');
  const { language } = useLanguage();

  const filtered = useMemo(() => {
    let list = schools;

    if (pinFilter) {
      list = list.filter(s => s.location.pinCode.includes(pinFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.titleEnglish.toLowerCase().includes(q) ||
        s.titleHindi.includes(q) ||
        s.location.pinCode.includes(q) ||
        s.udiseCode.includes(q) ||
        s.location.district.toLowerCase().includes(q) ||
        s.responsiblePerson.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, pinFilter]);

  // Aggregate District-wide metrics dynamically from the schools list
  const districtStats = useMemo(() => {
    const total = filtered.length;
    if (total === 0) return { avgScore: 0, toiletRate: 0, teacherVacantRate: 0, criticalCount: 0 };
    
    const sumScore = filtered.reduce((acc, curr) => acc + curr.groundTruthScore, 0);
    const toiletYes = filtered.filter(s => s.metrics.toiletUsable === 'yes').length;
    const critical = filtered.filter(s => s.groundTruthScore < 50).length;
    
    return {
      avgScore: Math.round(sumScore / total),
      toiletRate: Math.round((toiletYes / total) * 100),
      teacherVacantRate: 17, // Simulated ASER vacancy indicator
      criticalCount: critical,
    };
  }, [filtered]);

  const criticalSchools = useMemo(() => {
    return [...filtered].sort((a, b) => a.groundTruthScore - b.groundTruthScore).slice(0, 3);
  }, [filtered]);

  return (
    <div className="module-dashboard">
      {/* Module Title & Icon Header */}
      <div className="module-header" style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <span>🏫</span> स्कूल ठीक करो — School Scorecard
        </h2>
        <p style={{ margin: '0.25rem 0 0', opacity: 0.7, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          सरकारी स्कूल गुणवत्ता — UDISE+ डेटा बनाम अभिभावक जांच (CPSS Core Metric)
        </p>
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveView('list')}
          className={`time-tab ${activeView === 'list' ? 'active' : ''}`}
        >
          🏫 Schools List (स्कूल सूची)
        </button>
        <button
          onClick={() => setActiveView('district')}
          className={`time-tab ${activeView === 'district' ? 'active' : ''}`}
        >
          📊 District Dashboard (ज़िला स्कोरकार्ड)
        </button>
      </div>

      {activeView === 'list' ? (
        <>
          {/* Search Input Bar */}
          <div className="search-bar" style={{ margin: '0 0 1.5rem 0' }}>
            <input
              type="text"
              placeholder="🔍 पिन कोड / UDISE कोड / स्कूल / ज़िला खोजें (Search school, UDISE, PIN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {filtered.map(school => (
              <SchoolCard key={school.id} school={school} onClick={() => onSelectSchool(school.id)} />
            ))}

            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                <p style={{ fontSize: '1.2rem' }}>कोई स्कूल नहीं मिला</p>
                <p style={{ fontSize: '0.85rem' }}>No schools found for this search</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* M19 — School District Dashboard View */
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Aggregated Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #3b82f6' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{filtered.length}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total Tracked Schools</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #10b981' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{districtStats.avgScore} / 100</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Average School Score</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #06b6d4' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4' }}>{districtStats.toiletRate}%</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Usable Toilets Claimed</div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #ef4444' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{districtStats.criticalCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Critical Schools (&lt;50 Score)</div>
            </div>

          </div>

          {/* Critical schools list section */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ Critical Attention Required / तत्काल ध्यान देने योग्य स्कूल
            </h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.25rem' }}>
              ज़िले के सबसे कम स्कोर वाले सरकारी स्कूल जहाँ शौचालय, पानी या शिक्षकों की भारी कमी है।
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {criticalSchools.map(school => (
                <div
                  key={school.id}
                  onClick={() => onSelectSchool(school.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.04)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderLeft: '4px solid #ef4444',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{language === 'hi' ? school.titleHindi : school.titleEnglish}</h4>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>DISE: {school.udiseCode} · PIN: {school.location.pinCode}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{school.groundTruthScore}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function SchoolCard({ school, onClick }: { school: SchoolRecord; onClick: () => void }) {
  const { language } = useLanguage();
  const statusColor = STATUS_COLORS[school.status] || '#6b7280';
  const scoreColor = school.groundTruthScore >= 70 ? '#10b981' : school.groundTruthScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="project-card"
      onClick={onClick}
      style={{ cursor: 'pointer', borderTop: `3px solid ${statusColor}` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px', textTransform: 'uppercase' }}>
            📍 PIN {school.location.pinCode} · {school.location.district}
          </div>
          <h3 style={{ margin: '0.25rem 0', fontSize: '1rem', lineHeight: 1.3 }}>
            {language === 'hi' ? school.titleHindi : school.titleEnglish}
          </h3>
          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{language === 'hi' ? school.titleEnglish : school.titleHindi}</div>
        </div>
        <div style={{
          textAlign: 'center',
          minWidth: '60px',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: scoreColor,
            lineHeight: 1,
          }}>
            {school.groundTruthScore}
          </div>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>/ 100</div>
        </div>
      </div>

      {/* Status Badge */}
      <div style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        backgroundColor: `${statusColor}22`,
        color: statusColor,
        marginBottom: '0.75rem',
      }}>
        {school.statusHindi} — {school.status}
      </div>

      {/* Claim vs Reality */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          padding: '0.5rem',
          borderRadius: '8px',
          background: 'rgba(59, 130, 246, 0.08)',
          borderLeft: '3px solid #3b82f6',
        }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.25rem' }}>
            📈 सरकारी दावा
          </div>
          <div style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
            {school.claim.labelHindi}
          </div>
        </div>
        <div style={{
          padding: '0.5rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.08)',
          borderLeft: '3px solid #ef4444',
        }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>
            👁️ जमीनी हकीकत
          </div>
          <div style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
            {school.reality.labelHindi}
          </div>
        </div>
      </div>

      {/* 5 Metrics Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {Object.entries(school.metrics).map(([key, value]) => {
          const label = METRIC_LABELS[key];
          return (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.65rem',
            }}>
              <span>{label?.icon}</span>
              <MetricBadge state={value} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.65rem',
        opacity: 0.5,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '0.5rem',
      }}>
        <span>👤 {school.responsiblePerson}</span>
        <span>{school.totalCheckIns} check-ins · {school.confidenceLevel}</span>
      </div>
    </div>
  );
}
