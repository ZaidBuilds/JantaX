import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  GraduationCap,
  Construction,
  Building2,
  HeartPulse,
  Scale,
  FileText,
  AlertCircle,
  BarChart3,
  Map as MapIcon,
  Compass,
  ArrowRight,
  ShieldCheck,
  Wheat,
} from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { MODULE_REGISTRY } from '../core/registry/moduleRegistry';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname: path } = location;
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();
  const { t, language } = useLanguage();

  const resolvedLoc = resolvePincode(selectedPin);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsModulesOpen(false);
  }, [path]);

  // Click outside to close modules dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModulesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (isValidIndianPincode(q)) {
      setSelectedPin(q);
      navigate(`/pin/${q}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const navLinks = [
    { label: t('home') || 'Home', path: '/', active: path === '/' },
    { label: t('explore') || 'Schools', path: '/schools', active: path.startsWith('/schools') },
    { label: 'Public Works', path: '/module/infra', active: path.startsWith('/module/infra') },
    { label: t('compare') || 'Compare', path: '/compare', active: path.startsWith('/compare') },
    { label: t('maps') || 'Maps', path: '/maps', active: path.startsWith('/maps') },
    { label: t('reports') || 'Reports', path: '/reports', active: path.startsWith('/reports') },
  ];

  const quickModules = [
    { id: 'school', name: 'School Observatory', hi: 'स्कूल डेटा', icon: GraduationCap, color: '#2563eb' },
    { id: 'infra', name: 'Public Works & Roads', hi: 'सार्वजनिक कार्य', icon: Construction, color: '#f59e0b' },
    { id: 'rera', name: 'RERA Housing Tracker', hi: 'RERA प्रोजेक्ट', icon: Building2, color: '#06b6d4' },
    { id: 'hospital', name: 'Healthcare & PHCs', hi: 'अस्पताल व स्वास्थ्य', icon: HeartPulse, color: '#ec4899' },
    { id: 'contractor', name: 'Contractor Intelligence', hi: 'ठेकेदार ट्रैकर', icon: ShieldCheck, color: '#ef4444' },
    { id: 'ration', name: 'PDS & Welfare Schemes', hi: 'राशन व कल्याण', icon: Wheat, color: '#10b981' },
    { id: 'courts', name: 'Courts & CNR Tracker', hi: 'अदालत व न्याय', icon: Scale, color: '#8b5cf6' },
    { id: 'rti', name: 'RTI & Public Records', hi: 'RTI रिकॉर्ड्स', icon: FileText, color: '#64748b' },
  ];

  return (
    <>
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={`app-navbar ${scrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        <div className="navbar-inner">
          {/* Brand Logo */}
          <div
            className="navbar-brand"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            aria-label="JantaX Civic OS"
          >
            <div className="brand-logo-wrap">
              <span className="brand-janta">Janta</span>
              <span className="brand-x">X</span>
              <span className="brand-badge">CIVIC OS</span>
            </div>
            <div className="brand-subtext">
              <span className="live-beacon" />
              <span>Real Govt Data</span>
            </div>
          </div>

          {/* Quick Search & Location Command Pill */}
          <form className="navbar-search-pill" onSubmit={handleSearchSubmit}>
            <Search size={15} className="search-pill-icon" />
            <input
              type="text"
              placeholder="Search PIN / School / Project / Builder…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search JantaX"
              className="search-pill-input"
            />
            <button
              type="button"
              onClick={handleLocate}
              disabled={isDetecting}
              title="Detect my current location"
              className="location-pill-btn"
            >
              <MapPin size={13} className="pin-icon" />
              <span className="pin-text">
                {isDetecting ? 'Locating…' : selectedPin ? `PIN ${selectedPin}` : 'Set PIN'}
              </span>
              {resolvedLoc.isValid && (
                <span className="pin-state-chip">{resolvedLoc.stateCode}</span>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="navbar-links" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.path + link.label}
                onClick={() => navigate(link.path)}
                className={`nav-item-btn ${link.active ? 'active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}

            {/* Modules Dropdown Button */}
            <div className="modules-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`nav-item-btn modules-trigger ${isModulesOpen ? 'active' : ''}`}
                onClick={() => setIsModulesOpen((prev) => !prev)}
                aria-expanded={isModulesOpen}
                aria-haspopup="true"
              >
                <Layers size={14} />
                <span>Modules</span>
                <ChevronDown size={13} className={`chevron-icon ${isModulesOpen ? 'open' : ''}`} />
              </button>

              {isModulesOpen && (
                <div className="modules-mega-menu animate-fade-in" role="menu">
                  <div className="mega-menu-header">
                    <div className="mega-title">Civic Intelligence Modules</div>
                    <div className="mega-subtitle">Open data observatories across sectors</div>
                  </div>

                  <div className="mega-grid">
                    {quickModules.map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          className="mega-item"
                          onClick={() => {
                            setIsModulesOpen(false);
                            navigate(`/module/${m.id}?pin=${selectedPin}`);
                          }}
                          role="menuitem"
                        >
                          <div className="mega-item-icon" style={{ color: m.color, background: `${m.color}15` }}>
                            <Icon size={16} />
                          </div>
                          <div className="mega-item-content">
                            <div className="mega-item-title">{language === 'hi' ? m.hi : m.name}</div>
                            <div className="mega-item-sub">{language === 'hi' ? m.name : m.hi}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mega-footer">
                    <button
                      className="mega-footer-link"
                      onClick={() => {
                        setIsModulesOpen(false);
                        navigate('/module/monitoring');
                      }}
                    >
                      <span>Explore all 15 Civic Modules</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools */}
          <div className="navbar-actions">
            <div className="lang-toggle-wrap">
              <LanguageToggle />
            </div>

            <button
              type="button"
              className="report-issue-btn"
              onClick={() => navigate('/report-issue')}
            >
              <AlertCircle size={14} />
              <span className="btn-text">Report Issue</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-root">
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="mobile-drawer-panel animate-slide-left">
            <div className="drawer-header">
              <div className="drawer-brand">
                <span className="brand-janta">Janta</span>
                <span className="brand-x">X</span>
                <span className="brand-badge">CIVIC OS</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search */}
            <form className="drawer-search" onSubmit={handleSearchSubmit}>
              <Search size={16} className="drawer-search-icon" />
              <input
                type="text"
                placeholder="Search PIN / School / Project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="drawer-search-input"
              />
            </form>

            {/* Mobile Location Badge */}
            <div className="drawer-location-box">
              <div className="location-box-left">
                <MapPin size={16} className="loc-pin" />
                <div>
                  <div className="loc-title">Active PIN Code: {selectedPin || 'None'}</div>
                  <div className="loc-sub">
                    {resolvedLoc.isValid ? `${resolvedLoc.district}, ${resolvedLoc.state}` : 'National Overview'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="loc-change-btn"
                onClick={() => {
                  const p = prompt('Enter 6-digit Indian PIN Code:', selectedPin);
                  if (p && isValidIndianPincode(p)) {
                    setSelectedPin(p);
                    navigate(`/pin/${p}`);
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                Change
              </button>
            </div>

            {/* Navigation Links */}
            <div className="drawer-nav-group">
              <div className="drawer-group-title">Navigation</div>
              {navLinks.map((link) => (
                <button
                  key={link.path + link.label}
                  className={`drawer-link ${link.active ? 'active' : ''}`}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} className="drawer-link-arrow" />
                </button>
              ))}
            </div>

            {/* Quick Modules */}
            <div className="drawer-nav-group">
              <div className="drawer-group-title">Key Civic Observatories</div>
              <div className="drawer-modules-grid">
                {quickModules.slice(0, 6).map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      className="drawer-module-chip"
                      onClick={() => {
                        navigate(`/module/${m.id}?pin=${selectedPin}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon size={14} style={{ color: m.color }} />
                      <span>{language === 'hi' ? m.hi : m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="drawer-footer">
              <div className="drawer-lang-row">
                <span className="lang-label">Select Language:</span>
                <LanguageToggle />
              </div>
              <div className="drawer-legal">
                JantaX Civic OS · Open Government Data · Non-Partisan
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
