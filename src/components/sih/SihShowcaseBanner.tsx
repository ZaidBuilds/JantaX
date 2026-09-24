import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Landmark, CheckCircle, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../core/context/LanguageContext';
import { usePin } from '../../core/context/PinContext';
import { SIH_SHOWCASE_STATEMENTS, SihProblemStatement } from '../../data/sihShowcase';
import { EvaluatorTourModal } from './EvaluatorTourModal';
import { SihLiveAuditSimulatorModal } from './SihLiveAuditSimulatorModal';

const DISMISS_KEY = 'jantax_sih_banner_dismissed';

export function SihShowcaseBanner() {
  const [isOpen, setIsOpen] = useState(false);
  // The banner sits above the header on every public page. A citizen using
  // JantaX for its actual purpose should be able to put it away.
  const [isDismissed, setIsDismissed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(DISMISS_KEY) === '1'
  );
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedPsId, setSelectedPsId] = useState<string>(SIH_SHOWCASE_STATEMENTS[0].id);
  const { tr, language } = useLanguage();
  const { setSelectedPin } = usePin();
  const navigate = useNavigate();

  const selectedPs = SIH_SHOWCASE_STATEMENTS.find((ps) => ps.id === selectedPsId) || SIH_SHOWCASE_STATEMENTS[0];

  const handleLaunchDemo = (ps: SihProblemStatement) => {
    setSelectedPin(ps.demoPin);
    navigate(ps.demoRoute);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Storage unavailable (private mode) — dismiss for this session only.
    }
  };

  if (isDismissed) return null;

  return (
    <div
      style={{
        background: 'var(--navy-900)',
        color: 'var(--text-inverse)',
        borderBottom: '1px solid var(--navy-800)',
        fontSize: 'var(--text-small)',
      }}
      role="region"
      aria-label="SIH Ministry Evaluation Showcase"
    >
      <div className="container" style={{ padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--navy-800)',
                color: 'var(--text-inverse)',
                border: '1px solid var(--navy-700)',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: 'var(--text-caption)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Award size={13} aria-hidden="true" />
              SIH 2026 Showcase
            </span>
            <span style={{ fontWeight: 500, color: 'var(--navy-100)' }}>
              {tr(
                'PS SIH26202 · Smart Automation — one Locality OS across 4 civic themes',
                'समस्या SIH26202 · स्मार्ट ऑटोमेशन — एक लोकैलिटी ओएस, 4 नागरिक क्षेत्र'
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate('/sih')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-surface)',
                color: 'var(--navy-900)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Award size={13} aria-hidden="true" />
              <span>{tr('SIH 2026 Portal', 'एसआईएच पोर्टल')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--gradient-accent, #f97316)',
                border: 'none',
                color: '#ffffff',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(249,115,22,0.3)'
              }}
            >
              <Sparkles size={13} aria-hidden="true" />
              <span>{tr('Pan-India Live Audit Simulator (30s)', 'अखिल भारतीय लाइव ऑडिट सिम्युलेटर (30s)')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTourOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                border: '1px solid var(--navy-700)',
                color: 'var(--text-inverse)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={13} aria-hidden="true" />
              <span>{tr('Evaluator Tour (2-Min Demo)', 'जूरी टूर (2 मिनट डेमो)')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                border: '1px solid var(--navy-700)',
                color: 'var(--navy-100)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)',
              }}
              aria-expanded={isOpen}
            >
              <span>{isOpen ? tr('Hide Civic Themes', 'क्षेत्र छुपाएं') : tr('View Civic Themes (4 Sectors)', 'नागरिक क्षेत्र देखें (4 क्षेत्र)')}</span>
              {isOpen ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label={tr('Dismiss SIH showcase banner', 'एसआईएच बैनर बंद करें')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                minHeight: '32px',
                background: 'transparent',
                border: '1px solid var(--navy-700)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--navy-100)',
                cursor: 'pointer',
              }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Evaluator Tour Modal */}
        <EvaluatorTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

        {/* Pan-India 30-Second Stage Simulator Modal */}
        <SihLiveAuditSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />

        {isOpen && (
          <div
            style={{
              marginTop: 'var(--space-3)',
              marginBottom: 'var(--space-3)',
              padding: 'var(--space-4)',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            {/* Ministry Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              {SIH_SHOWCASE_STATEMENTS.map((ps) => {
                const isActive = ps.id === selectedPsId;
                return (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => setSelectedPsId(ps.id)}
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--navy-50)' : 'var(--bg-surface)',
                      color: isActive ? 'var(--navy-900)' : 'var(--text-secondary)',
                      border: `1px solid ${isActive ? 'var(--navy-700)' : 'var(--border-color)'}`,
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: isActive ? 0.9 : 0.7 }}>
                      {ps.badge}
                    </div>
                    <div style={{ fontSize: '0.82rem', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {language === 'hi' ? ps.ministryHindi : ps.ministry}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Problem Statement Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-4)',
                background: 'var(--bg-subtle)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--navy-700)',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem var(--space-2)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: 'var(--text-caption)',
                      fontWeight: 700,
                    }}
                  >
                    {selectedPs.code}
                  </span>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                    {language === 'hi' ? selectedPs.ministryHindi : selectedPs.ministry}
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  {language === 'hi' ? selectedPs.titleHindi : selectedPs.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-small)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                  {language === 'hi' ? selectedPs.descriptionHindi : selectedPs.description}
                </p>

                <div style={{ background: 'var(--navy-50)', borderLeft: '3px solid var(--navy-700)', padding: 'var(--space-2) var(--space-3)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <div style={{ fontSize: 'var(--text-caption)', fontWeight: 700, color: 'var(--navy-800)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {tr('JantaX Architectural Solution', 'JantaX समाधान संरचना')}
                  </div>
                  <div style={{ fontSize: 'var(--text-small)', color: 'var(--text-secondary)' }}>
                    {language === 'hi' ? selectedPs.solutionMappingHindi : selectedPs.solutionMapping}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-caption)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    {tr('Features Demonstrated', 'प्रदर्शित सुविधाएं')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', marginBottom: '0.85rem' }}>
                    {selectedPs.featuresDemonstrated.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={13} aria-hidden="true" style={{ color: 'var(--emerald-700)', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 'var(--text-caption)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {tr('Official Source Integration', 'संबद्ध आधिकारिक डेटा स्रोत')}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedPs.officialDataSources.map((src, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: 'var(--text-caption)',
                        }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleLaunchDemo(selectedPs)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: 'var(--color-primary)',
                      color: 'var(--text-inverse)',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: 'var(--text-small)',
                      border: '1px solid var(--color-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{tr(`Open demo (PIN ${selectedPs.demoPin})`, `डेमो खोलें (पिन ${selectedPs.demoPin})`)}</span>
                    <ExternalLink size={15} aria-hidden="true" />
                  </button>
                  <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                    {tr('Target Route:', 'लक्षित मार्ग:')} <code style={{ color: 'var(--navy-700)', fontFamily: 'var(--font-mono)' }}>{selectedPs.demoRoute}</code>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
