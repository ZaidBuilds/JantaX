import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Menu, X, Globe } from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../core/context/LanguageContext';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname: path } = location;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();
  const { language, setLanguage } = useLanguage();
  const resolvedLoc = resolvePincode(selectedPin);

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  };

const navLinks = [
    { label: 'Search', path: '/', active: path === '/' },
    { label: 'Explore', path: '/explore', active: path === '/explore' },
    { label: 'About', path: '/about', active: path === '/about' },
];

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Brand */}
          <div
            className="brand-wrap"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <span className="brand-title">JantaX</span>
            <span className="brand-subtitle">Public Civic Records</span>
          </div>

          {/* Minimal Navigation */}
          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                className={`nav-link ${link.active ? 'active' : ''}`}
                onClick={() => navigate(link.path)}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Utilities */}
          <div className="header-right">
            <button
              type="button"
              className="location-indicator-btn"
              onClick={() => {
                const p = prompt('Enter 6-digit Indian PIN Code:', selectedPin);
                if (p && isValidIndianPincode(p)) setSelectedPin(p);
              }}
              title="Click to change active PIN"
            >
              <MapPin size={14} />
              <span>{selectedPin ? `PIN ${selectedPin}` : 'Set PIN'}</span>
              {resolvedLoc.isValid && <span>({resolvedLoc.stateCode})</span>}
            </button>

            {/* Clean Language Selector */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: '#ffffff',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  outline: 'none',
                }}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(300px, 80vw)',
              background: '#ffffff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-md)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>JantaX</strong>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: link.active ? 'var(--color-primary-subtle)' : '#ffffff',
                    color: link.active ? 'var(--color-primary)' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
