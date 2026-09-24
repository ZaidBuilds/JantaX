import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  Scale,
  Layers,
  Download,
  Check,
  Maximize2,
  Minimize2,
  Landmark,
  Building2,
  HardHat,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../core/context/LanguageContext';
import { usePin } from '../core/context/PinContext';
import {
  SIH_MINISTRY_STATEMENTS,
  SIH_RUBRIC_CRITERIA,
  SIH_PITCH_SLIDES,
  SIH_JURY_QA,
  SihMinistryStatement,
} from '../data/sihPortalData';

export default function SihPortalPage() {
  const { tr, language } = useLanguage();
  const { setSelectedPin } = usePin();
  const navigate = useNavigate();

  // Navigation tabs
  type TabKey = 'demonstrator' | 'rubric' | 'slides' | 'defense';
  const [activeTab, setActiveTab] = useState<TabKey>('demonstrator');

  // Ministry Switcher state
  const [selectedPsId, setSelectedPsId] = useState<string>(SIH_MINISTRY_STATEMENTS[0].id);
  const selectedPs = SIH_MINISTRY_STATEMENTS.find((ps) => ps.id === selectedPsId) || SIH_MINISTRY_STATEMENTS[0];

  // 3-Minute Pitch Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Rubric Scorecard State
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SIH_RUBRIC_CRITERIA.forEach((c) => {
      initial[c.id] = c.defaultScore;
    });
    return initial;
  });
  const [copiedAudit, setCopiedAudit] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Pitch Slides State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = SIH_PITCH_SLIDES[currentSlideIndex];

  const handleLaunchDemo = (ps: SihMinistryStatement) => {
    setSelectedPin(ps.demoPin);
    navigate(ps.demoRoute);
  };

  const handleExportAuditSheet = () => {
    const reportText = `🇮🇳 JANTAX — SMART INDIA HACKATHON 2026 EVALUATOR AUDIT SHEET
Date: ${new Date().toLocaleDateString('en-IN')}
Total Calculated Score: ${totalScore}/100
Result Tier: ${totalScore >= 90 ? 'National Finalist / Gold Tier' : totalScore >= 75 ? 'Distinction' : 'Qualified'}

Rubric Breakdown:
${SIH_RUBRIC_CRITERIA.map(
  (c) => `- ${c.name} (${c.weight}% max): ${scores[c.id]} / ${c.weight} pts
  Evidence: ${c.proofPoints[0]}`
).join('\n')}

Problem Statement Tested: ${selectedPs.code} - ${selectedPs.ministry}
Verification Route: https://jantax.gov.in${selectedPs.demoRoute}
Official Intermediary Safe Harbor: Section 79 IT Act 2000 Compliant`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 3000);
    });
  };

  return (
    <div style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Top Banner Accent */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #f97316 0%, #ffffff 50%, #10b981 100%)' }} />

      {/* Hero Header */}
      <header
        style={{
          borderBottom: '1px solid #1e293b',
          background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
          padding: '1.75rem 1rem',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#f59e0b',
                    color: '#0f172a',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Award size={13} />
                  AICTE / SIH 2026 Special Evaluation Portal
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {tr('Jury & Evaluator Workbench', 'जूरी व मूल्यांकनकर्ता वर्कबेंच')}
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
                🇮🇳 JantaX — <span style={{ color: '#38bdf8' }}>SIH 2026 Evaluation Suite</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '750px', lineHeight: 1.5 }}>
                {tr(
                  'Explore live central ministry problem statement implementations, test our 4-beat comparative architecture, and score JantaX against official SIH judging criteria in under 3 minutes.',
                  'केंद्रीय मंत्रालयों के लाइव समाधान देखें, 4-बीट तुलनात्मक आर्किटेक्चर का परीक्षण करें और आधिकारिक एसआईएच मूल्यांकन मानकों पर 3 मिनट में स्कोर करें।'
                )}
              </p>
            </div>

            {/* 3-Minute Presentation Pitch Timer */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} style={{ color: timerSeconds < 30 ? '#ef4444' : '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                    {tr('Jury Pitch Timer', 'जूरी पिच टाइमर')}
                  </div>
                  <div
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color: timerSeconds < 30 ? '#ef4444' : '#f8fafc',
                    }}
                  >
                    {formatTimer(timerSeconds)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{
                    background: isTimerRunning ? '#f59e0b' : '#10b981',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.4rem 0.65rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                  title={isTimerRunning ? 'Pause Pitch' : 'Start 3-Min Pitch'}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isTimerRunning ? tr('Pause', 'रोकें') : tr('Start', 'शुरू')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(180);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    border: '1px solid #475569',
                    borderRadius: '0.375rem',
                    padding: '0.4rem',
                    cursor: 'pointer',
                  }}
                  title="Reset Timer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.75rem',
              borderBottom: '1px solid #1e293b',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            {[
              { id: 'demonstrator', label: tr('🏢 Ministry Problem Statements (4)', '🏢 मंत्रालय समस्या विवरण (4)'), icon: Building2 },
              { id: 'rubric', label: tr(`📋 Evaluator Rubric (${totalScore}/100 Pts)`, `📋 मूल्यांकन रूब्रिक (${totalScore}/100)`), icon: Scale },
              { id: 'slides', label: tr('📊 8-Slide Pitch Deck', '📊 8-स्लाइड पिच डेक'), icon: BookOpen },
              { id: 'defense', label: tr('🛡️ Jury Q&A Defense', '🛡️ जूरी प्रश्नोत्तरी व बचाव'), icon: ShieldCheck },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.15rem',
                    borderRadius: '0.5rem 0.5rem 0 0',
                    border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                    borderBottom: isActive ? '2px solid #38bdf8' : 'none',
                    background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="container" style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 1rem' }}>
        {/* ==================================================================== */}
        {/* TAB 1: MINISTRY DEMONSTRATOR */}
        {/* ==================================================================== */}
        {activeTab === 'demonstrator' && (
          <div>
            {/* Ministry Selector Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.65rem',
                marginBottom: '1.5rem',
              }}
            >
              {SIH_MINISTRY_STATEMENTS.map((ps) => {
                const isActive = ps.id === selectedPsId;
                return (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => setSelectedPsId(ps.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: '0.65rem',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
                        : 'rgba(30, 41, 59, 0.5)',
                      color: isActive ? '#fef3c7' : '#cbd5e1',
                      border: isActive ? '2px solid #f59e0b' : '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(245, 158, 11, 0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          background: isActive ? '#f59e0b' : '#1e293b',
                          color: isActive ? '#0f172a' : '#38bdf8',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.25rem',
                          fontWeight: 800,
                        }}
                      >
                        {ps.code}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        {ps.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {language === 'hi' ? ps.ministryHindi : ps.ministry}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Ministry Detail View */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800, fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>
                      {selectedPs.code}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {language === 'hi' ? selectedPs.ministryHindi : selectedPs.ministry}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
                    {language === 'hi' ? selectedPs.titleHindi : selectedPs.title}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, maxWidth: '850px' }}>
                    {language === 'hi' ? selectedPs.descriptionHindi : selectedPs.description}
                  </p>
                </div>

                {/* Direct Launch Button */}
                <button
                  type="button"
                  onClick={() => handleLaunchDemo(selectedPs)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#0f172a',
                    padding: '0.65rem 1.35rem',
                    borderRadius: '0.5rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{tr(`Launch Live Verification (PIN ${selectedPs.demoPin})`, `लाइव वेरिफिकेशन खोलें (पिन ${selectedPs.demoPin})`)}</span>
                  <ExternalLink size={16} />
                </button>
              </div>

              {/* The 4-Beat Comparative Architecture Matrix */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 800, marginBottom: '0.75rem' }}>
                  {tr('JantaX 4-Beat Verification Pipeline', 'JantaX 4-बीट सत्यापन पाइपलाइन')}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {/* Beat 1: Official Claim */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '0.65rem',
                      padding: '1.15rem',
                      borderTop: '3px solid #38bdf8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                        1. Official Claim (Govt)
                      </span>
                      <Landmark size={15} style={{ color: '#38bdf8' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedPs.officialClaim.portal}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: '0.35rem 0' }}>
                      {selectedPs.officialClaim.metric}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      "{selectedPs.officialClaim.value}"
                    </div>
                    <div style={{ marginTop: '0.65rem' }}>
                      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', fontWeight: 700 }}>
                        {selectedPs.officialClaim.status}
                      </span>
                    </div>
                  </div>

                  {/* Beat 2: Ground Reality */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '0.65rem',
                      padding: '1.15rem',
                      borderTop: '3px solid #f59e0b',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                        2. Ground Reality (Citizen)
                      </span>
                      <Compass size={15} style={{ color: '#f59e0b' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedPs.groundReality.method}</div>
                    <div style={{ fontSize: '0.82rem', color: '#fef3c7', margin: '0.35rem 0', lineHeight: 1.4, fontWeight: 600 }}>
                      {selectedPs.groundReality.finding}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', fontWeight: 700 }}>
                        {selectedPs.groundReality.sampleSize}
                      </span>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', fontWeight: 700 }}>
                        {selectedPs.groundReality.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Beat 3: Algorithmic Delta */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '0.65rem',
                      padding: '1.15rem',
                      borderTop: '3px solid #ef4444',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                        3. Algorithmic Delta
                      </span>
                      <Sparkles size={15} style={{ color: '#ef4444' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedPs.algorithmicDelta.metric}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171', margin: '0.35rem 0' }}>
                      {selectedPs.algorithmicDelta.discrepancy}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {selectedPs.algorithmicDelta.impact}
                    </div>
                  </div>

                  {/* Beat 4: Statutory Resolution */}
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '0.65rem',
                      padding: '1.15rem',
                      borderTop: '3px solid #10b981',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                        4. Statutory Resolution
                      </span>
                      <Scale size={15} style={{ color: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedPs.statutoryResolution.statute}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', margin: '0.35rem 0' }}>
                      {selectedPs.statutoryResolution.slaDays}-Day Statutory SLA
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {selectedPs.statutoryResolution.action}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Badges & Data Sources */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {tr('Features Demonstrated in this Module', 'इस मॉड्यूल में प्रदर्शित सुविधाएं')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {selectedPs.featuresDemonstrated.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {tr('Official Portals & Ingestion Sources', 'आधिकारिक पोर्टल एवं डेटा स्रोत')}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedPs.officialDataSources.map((src, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          color: '#38bdf8',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: EVALUATOR RUBRIC SCORECARD (100 PTS) */}
        {/* ==================================================================== */}
        {activeTab === 'rubric' && (
          <div>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {tr('Official SIH Judging Rubric Scorecard (100 Points)', 'आधिकारिक एसआईएच मूल्यांकन रूब्रिक (100 अंक)')}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                    {tr(
                      'Interactive evaluator scorecard based on official AICTE/SIH evaluation guidelines. Adjust sliders to audit our submission.',
                      'आधिकारिक एआईसीटीई/एसआईएच दिशा-निर्देशों पर आधारित इंटरैक्टिव स्कोरकार्ड। हमारे प्रोजेक्ट का मूल्यांकन करने के लिए स्लाइडर्स समायोजित करें।'
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      background: '#1e293b',
                      border: '2px solid #f59e0b',
                      borderRadius: '0.65rem',
                      padding: '0.45rem 1rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 800 }}>
                      Total Score
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                      {totalScore}<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/100</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportAuditSheet}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: copiedAudit ? '#10b981' : '#38bdf8',
                      color: '#0f172a',
                      padding: '0.65rem 1.15rem',
                      borderRadius: '0.5rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                    }}
                  >
                    {copiedAudit ? <Check size={16} /> : <Download size={16} />}
                    <span>{copiedAudit ? tr('Copied Audit Sheet!', 'ऑडिट शीट कॉपी हो गई!') : tr('Export Audit Sheet', 'ऑडिट शीट कॉपी करें')}</span>
                  </button>
                </div>
              </div>

              {/* Rubric Criteria Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {SIH_RUBRIC_CRITERIA.map((criterion) => {
                  const currentScore = scores[criterion.id] || 0;
                  return (
                    <div
                      key={criterion.id}
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid #334155',
                        borderRadius: '0.65rem',
                        padding: '1.15rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                              {criterion.name}
                            </h3>
                            <span style={{ background: '#1e293b', color: '#f59e0b', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontWeight: 800 }}>
                              Weight: {criterion.weight}%
                            </span>
                          </div>
                          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                            {criterion.description}
                          </p>
                        </div>

                        {/* Slider & Score Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <input
                            type="range"
                            min="0"
                            max={criterion.weight}
                            value={currentScore}
                            onChange={(e) =>
                              setScores({
                                ...scores,
                                [criterion.id]: parseInt(e.target.value, 10),
                              })
                            }
                            style={{
                              accentColor: '#38bdf8',
                              cursor: 'pointer',
                              width: '130px',
                            }}
                          />
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              color: '#38bdf8',
                              minWidth: '60px',
                              textAlign: 'right',
                            }}
                          >
                            {currentScore} / {criterion.weight}
                          </span>
                        </div>
                      </div>

                      {/* Concrete Proof Points */}
                      <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: '0.45rem', borderLeft: '3px solid #38bdf8' }}>
                        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>
                          Verified JantaX Proof Points
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.15rem', color: '#cbd5e1', fontSize: '0.78rem', lineHeight: 1.5 }}>
                          {criterion.proofPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: 8-SLIDE PITCH DECK */}
        {/* ==================================================================== */}
        {activeTab === 'slides' && (
          <div>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid #1e293b',
                borderRadius: '0.85rem',
                padding: '2rem',
                marginBottom: '1.5rem',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {/* Slide Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 800, fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '0.25rem' }}>
                      SLIDE {currentSlide.id} / {SIH_PITCH_SLIDES.length}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {currentSlide.category}
                    </span>
                  </div>

                  {/* Thumbnail jump dots */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {SIH_PITCH_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          background: idx === currentSlideIndex ? '#38bdf8' : '#334155',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title={`Jump to Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                  {currentSlide.title}
                </h2>
                <p style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>
                  {currentSlide.subtitle}
                </p>

                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {currentSlide.bullets.map((bullet, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.15rem' }} />
                      <span style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metrics Callout */}
                {currentSlide.metrics && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.85rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {currentSlide.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(30, 41, 59, 0.6)',
                          border: '1px solid #334155',
                          borderRadius: '0.5rem',
                          padding: '0.85rem 1rem',
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>{m.label}</div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f59e0b', margin: '0.2rem 0' }}>{m.value}</div>
                        {m.detail && <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{m.detail}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slide Bottom Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #1e293b',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', maxWidth: '650px' }}>
                  💡 <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Key Takeaway:</span> {currentSlide.takeaway}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: currentSlideIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                      color: currentSlideIndex === 0 ? '#475569' : '#ffffff',
                      border: '1px solid #334155',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.375rem',
                      cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(SIH_PITCH_SLIDES.length - 1, prev + 1))}
                    disabled={currentSlideIndex === SIH_PITCH_SLIDES.length - 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: currentSlideIndex === SIH_PITCH_SLIDES.length - 1 ? 'rgba(255,255,255,0.05)' : '#38bdf8',
                      color: currentSlideIndex === SIH_PITCH_SLIDES.length - 1 ? '#475569' : '#0f172a',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.375rem',
                      cursor: currentSlideIndex === SIH_PITCH_SLIDES.length - 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: JURY Q&A DEFENSE DOSSIER */}
        {/* ==================================================================== */}
        {activeTab === 'defense' && (
          <div>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #1e293b',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
                {tr('Jury Q&A Defense Dossier (Toughest Questions Answered)', 'जूरी प्रश्नोत्तरी व रणनीतिक बचाव')}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                {tr(
                  'Comprehensive institutional arguments prepared for AICTE jury panels, ministry evaluators, and technical vetting committees.',
                  'एआईसीटीई जूरी पैनल और मंत्रालय के मूल्यांकनकर्ताओं के लिए तैयार किए गए ठोस संस्थागत तर्क।'
                )}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {SIH_JURY_QA.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid #334155',
                      borderRadius: '0.65rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          background: '#1e293b',
                          color: '#f59e0b',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.25rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.theme}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Q{idx + 1}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.65rem 0' }}>
                      {language === 'hi' ? item.questionHindi : item.question}
                    </h3>

                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                      {item.answer}
                    </p>

                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.65rem 0.85rem', borderRadius: '0.375rem', borderLeft: '3px solid #10b981' }}>
                      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800, marginBottom: '0.25rem' }}>
                        Core Defense Bullets
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {item.keyPoints.map((kp, kIdx) => (
                          <div key={kIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#e2e8f0' }}>
                            <CheckCircle size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                            <span>{kp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
