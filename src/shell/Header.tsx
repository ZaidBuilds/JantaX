import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Menu,
  X,
  Globe,
  GraduationCap,
  Construction,
  Building2,
  HardHat,
  Hospital,
  Scale,
  FileText,
  Wind,
  ShieldCheck,
  ChevronDown,
  Wheat,
  Landmark,
  Users,
} from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { resolvePincode, resolvePincodeAccurate } from '../core/utils/pinResolver';
import { PinModal } from './PinModal';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname: path } = location;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();
  const { language, setLanguage, tr } = useLanguage();
  const [resolvedLoc, setResolvedLoc] = useState(() => resolvePincode(selectedPin));

  useEffect(() => {
    let isCurrent = true;
    setResolvedLoc(resolvePincode(selectedPin));
    resolvePincodeAccurate(selectedPin).then((acc) => {
      if (isCurrent && acc.district) setResolvedLoc(acc);
    });
    return () => {
      isCurrent = false;
    };
  }, [selectedPin]);

  /**
   * Primary navigation is deliberately small.
   *
   * Nine flat links (one per domain) does not survive 17 modules — it already
   * wrapped and crowded the header. Domains now live inside the Explore menu,
   * grouped by the citizen's question rather than by department.
   * See the Notion Master Blueprint §39: "Keep primary navigation small … put
   * the 20+ modules inside Explore."
   *
   * SIH 2026 is intentionally not here — the showcase banner directly above the
   * header already links to it, so a nav entry duplicated it.
   */
  const navLinks = [
    { label: tr('Home', 'होम'), path: '/', active: path === '/' },
    { label: tr('Map', 'नक्शा'), path: `/maps?pin=${selectedPin}`, active: path.startsWith('/maps') },
    { label: tr('Reports', 'रिपोर्ट'), path: '/reports', active: path.startsWith('/report') },
    { label: tr('Sources', 'डेटा स्रोत'), path: '/data-sources', active: path === '/data-sources' || path === '/sources' },
  ];

  /**
   * Everything reachable from Explore, grouped by the citizen's question
   * ("what is around me?", "where did the money go?") rather than by which
   * ministry owns the dataset. Icons carry the domain identity; colour is
   * reserved for meaning, so no per-sector hues here.
   */
  const exploreGroups = [
    {
      title: tr('Around you', 'आपके आसपास'),
      items: [
        { name: tr('Schools & Education', 'स्कूल एवं शिक्षा'), path: `/schools?pin=${selectedPin}`, icon: GraduationCap },
        { name: tr('Healthcare & Hospitals', 'अस्पताल व स्वास्थ्य केंद्र'), path: `/module/hospital?pin=${selectedPin}`, icon: Hospital },
        { name: tr('Ration Shops (PDS)', 'राशन दुकानें'), path: `/module/pds?pin=${selectedPin}`, icon: Wheat },
        { name: tr('Air Quality (AQI)', 'वायु गुणवत्ता'), path: '/pollution', icon: Wind },
      ],
    },
    {
      title: tr('Public money', 'सार्वजनिक धन'),
      items: [
        { name: tr('Public Works & Roads', 'सड़कें और निर्माण कार्य'), path: `/projects?pin=${selectedPin}`, icon: Construction },
        { name: tr('Contractors', 'ठेकेदार'), path: '/contractors', icon: HardHat },
        { name: tr('MP / MLA Funds', 'सांसद/विधायक निधि'), path: '/mplads', icon: Landmark },
        { name: tr('RERA Housing', 'रेरा आवास परियोजनाएं'), path: `/rera?pin=${selectedPin}`, icon: Building2 },
      ],
    },
    {
      title: tr('Rights & institutions', 'अधिकार एवं संस्थाएं'),
      items: [
        { name: tr('Representatives', 'जनप्रतिनिधि'), path: `/pin/${selectedPin}/people`, icon: Users },
        { name: tr('Courts & Case Pendency', 'न्यायालय एवं केस स्टेटस'), path: `/module/courts?pin=${selectedPin}`, icon: Scale },
        { name: tr('RTI Applications', 'सूचना का अधिकार (RTI)'), path: '/rti', icon: FileText },
        { name: tr('Grievance Response', 'शिकायत निपटान'), path: '/module/grievance', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Brand Emblem & Logo */}
          <Link to="/" className="brand-wrap" aria-label="JantaX Home">
            <div className="brand-emblem">
              <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>JX</span>
              <div className="brand-emblem-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-title">
                Janta<span className="brand-title-accent">X</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="brand-subtitle">{tr('Bharat Public Intelligence', 'भारत नागरिक वेधशाला')}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#ecfdf5', color: '#047857', fontSize: '0.62rem', fontWeight: 800, padding: '0.05rem 0.4rem', borderRadius: 999, border: '1px solid #a7f3d0', textTransform: 'uppercase' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  GODL-India
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${link.active ? 'active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Explore Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="nav-link"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span>{tr('Explore', 'खोजें')}</span>
                <ChevronDown size={14} style={{ transform: isExploreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {isExploreOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 280,
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-modal)',
                    padding: '0.6rem',
                    zIndex: 150,
                    animation: 'scaleUp 0.18s var(--ease-spring)',
                  }}
                  onMouseLeave={() => setIsExploreOpen(false)}
                >
                  {exploreGroups.map((group) => (
                    <div key={group.title} style={{ marginBottom: 'var(--space-2)' }}>
                      <div
                        style={{
                          padding: 'var(--space-1) var(--space-2)',
                          fontSize: 'var(--text-caption)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {group.title}
                      </div>
                      {group.items.map((s) => {
                        const Icon = s.icon;
                        return (
                          <Link
                            key={s.path}
                            to={s.path}
                            onClick={() => setIsExploreOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-2)',
                              padding: 'var(--space-2)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--text-small)',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Icon size={15} aria-hidden="true" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <span>{s.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Controls */}
          <div className="header-right">
            {/* Interactive PIN Selector Modal Trigger */}
            <button
              type="button"
              className="pin-selector-pill"
              onClick={() => setIsPinModalOpen(true)}
              title="Click to set your Indian PIN Code"
              aria-label="Change Active PIN Code"
            >
              <MapPin size={15} style={{ color: 'var(--navy-600)' }} />
              <span className="pin-code-text">{selectedPin || '110001'}</span>
              {resolvedLoc.isValid && (
                <span className="pin-loc-text">({resolvedLoc.district})</span>
              )}
            </button>

            {/* Bilingual Switch Pill */}
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              aria-label="Toggle language between English and Hindi"
            >
              <Globe size={14} />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              background: '#ffffff',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-card)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              {tr('Primary Navigation', 'मुख्य मेनू')}
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: link.active ? 'var(--navy-600)' : 'var(--text-primary)',
                  background: link.active ? 'var(--navy-50)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.5rem 0' }}></div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              {tr('All Civic Sectors', 'सभी नागरिक विभाग')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {exploreGroups.flatMap((g) => g.items).map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.path}
                    to={s.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      background: 'var(--bg-subtle)',
                    }}
                  >
                    <Icon size={14} aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Interactive PIN Popover Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        currentPin={selectedPin}
        onClose={() => setIsPinModalOpen(false)}
        onSelectPin={(pin) => {
          setSelectedPin(pin);
          navigate(`/pin/${pin}`);
        }}
        onDetectLocation={detectLocation}
        isDetecting={isDetecting}
      />
    </>
  );
}
