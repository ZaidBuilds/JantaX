import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, User, Menu, X, ChevronDown, ShieldCheck, Users, Scale, Flag, Sparkles } from 'lucide-react';
import { MODULE_REGISTRY } from './core/registry/moduleRegistry';
import { isValidIndianPincode } from './core/utils/pinResolver';
import { LanguageProvider, useLanguage } from './core/context/LanguageContext';
import LanguageToggle from './components/LanguageToggle';
import { PinProvider, usePin } from './core/context/PinContext';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { OfflineBanner } from './components/UI/OfflineBanner';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const PinDashboard = lazy(() => import('./pages/PinDashboard').then(m => ({ default: m.PinDashboard })));
const MapExplorer = lazy(() => import('./pages/MapExplorer').then(m => ({ default: m.MapExplorer })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const SchoolsDirectory = lazy(() => import('./pages/SchoolsDirectory').then(m => ({ default: m.SchoolsDirectory })));
const InfraApp = lazy(() => import('./modules/infra/InfraApp').then(m => ({ default: m.InfraApp })));
const SchoolModulePage = lazy(() => import('./pages/SchoolModulePage').then(m => ({ default: m.SchoolModulePage })));
const AndhbhaktDash = lazy(() => import('./modules/andhbhakt').then(m => ({ default: m.AndhbhaktDash })));
const ContractorApp = lazy(() => import('./modules/contractor').then(m => ({ default: m.ContractorApp })));
const CpgramsDashboard = lazy(() => import('./modules/grievance').then(m => ({ default: m.CpgramsDashboard })));
const BudgetDashboard = lazy(() => import('./modules/budget').then(m => ({ default: m.BudgetDashboard })));
const RationDashboard = lazy(() => import('./modules/ration').then(m => ({ default: m.RationDashboard })));
const HospitalDashboard = lazy(() => import('./modules/hospital').then(m => ({ default: m.HospitalDashboard })));
const ReraDashboard = lazy(() => import('./modules/rera').then(m => ({ default: m.ReraDashboard })));
const NagarDashboard = lazy(() => import('./modules/nagar').then(m => ({ default: m.NagarDashboard })));
const UtilityDashboard = lazy(() => import('./modules/utility').then(m => ({ default: m.UtilityDashboard })));
const LandDashboard = lazy(() => import('./modules/land').then(m => ({ default: m.LandDashboard })));
const PollutionDashboard = lazy(() => import('./modules/pollution').then(m => ({ default: m.PollutionDashboard })));
const ElectionDashboard = lazy(() => import('./modules/election').then(m => ({ default: m.ElectionDashboard })));
const RtiDashboard = lazy(() => import('./modules/rti').then(m => ({ default: m.RtiDashboard })));
const AboutPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.AboutPage })));
const DataSourcesPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.DataSourcesPage })));
const PrivacyPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.PrivacyPage })));
const ReportIssuePage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ReportIssuePage })) );
const AdminPage = lazy(() => import('./pages/Admin').then(m => ({ default: m.AdminPage })) );

function AppNav() {
  const navigate = useNavigate();
  const { pathname: path } = useLocation();
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { selectedPin, detectLocation, isDetecting } = usePin();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navSearchQuery.trim();
    if (!q) return;
    if (isValidIndianPincode(q)) navigate(`/pin/${q}`);
    else navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const navLinks = [
    { label: t('home'), path: '/', active: path === '/' },
    { label: t('explore'), path: '/schools', active: path === '/schools' },
    { label: t('compare'), path: '/compare', active: path === '/compare' },
    { label: t('maps'), path: '/maps', active: path === '/maps' },
    { label: t('reports'), path: '/schools', active: false },
  ];

  return (
    <>
      <a href="#main" style={{ position:'absolute', left:'-9999px', top:'auto', width:'1px', height:'1px', overflow:'hidden' }} onFocus={e=>{ const t=e.currentTarget as HTMLAnchorElement; t.style.left='1rem'; t.style.top='1rem'; t.style.width='auto'; t.style.height='auto'; t.style.background='#0f2d59'; t.style.color='#fff'; t.style.padding='0.5rem 1rem'; t.style.zIndex='9999'; t.style.borderRadius='8px'; }} onBlur={e=>{ const t=e.currentTarget as HTMLAnchorElement; t.style.left='-9999px'; t.style.top='-9999px'; }}>Skip to content</a>
      <nav className={`app-nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Primary">
        {/* Top Deck */}
        <div style={{ borderBottom: '1px solid rgba(241,245,249,0.9)', padding: '0.7rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '1rem' }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }} onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(e)=> e.key==='Enter' && navigate('/')} aria-label="JantaX Home">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f2d59', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>Janta</span>
                <span style={{ fontSize: '1.55rem', fontWeight: 900, color: '#f97316', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>X</span>
                <span style={{ marginLeft: '0.35rem', background: 'var(--gradient-accent)', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.04em' }}>BETA</span>
              </div>
              <span className="hide-on-mobile" style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.02em', marginTop: '-0.18rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={10} style={{ color: '#f97316' }} /> See What Your Government Data Says.
              </span>
            </div>

            {/* Center Search — desktop only */}
            <form onSubmit={handleNavSearchSubmit} className="hide-on-tablet" style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '9999px', padding: '0.28rem 0.45rem 0.28rem 1rem', width: 'min(520px, 42vw)', boxShadow: '0 1px 4px rgba(15,23,42,0.04)', transition: 'all 0.2s' }}>
              <Search size={16} style={{ opacity: 0.45, marginRight: '0.5rem', flexShrink: 0, color: '#0f2d59' }} />
              <input
                type="text"
                placeholder="Search PIN / School / Builder / Contractor / Project"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                aria-label="Search JantaX"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, minWidth: 0 }}
              />
              <span style={{ fontSize: '0.7rem', opacity: 0.35, padding: '0 0.5rem', borderRight: '1px solid #e2e8f0', marginRight: '0.4rem', fontWeight: 600 }}>/</span>
              <button
                type="button"
                onClick={handleLocate}
                disabled={isDetecting}
                title="Use my current location"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: isDetecting ? 'wait' : 'pointer',
                  background: '#eff6ff',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                <MapPin size={13} /> {isDetecting ? 'Locating…' : selectedPin} <ChevronDown size={12} style={{ opacity: 0.6 }} />
              </button>
            </form>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
              <span className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center' }}>
                <LanguageToggle />
              </span>
              <button aria-label="Notifications" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '9999px', background: '#f8fafc', border: '1px solid #f1f5f9' }} className="hide-on-mobile">
                <Bell size={17} style={{ color: '#475569' }} />
                <span style={{ position: 'absolute', top: '6px', right: '7px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', border: '1.5px solid #fff' }}></span>
              </button>
              <div role="button" aria-label="Profile" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f2d59, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(15,45,89,0.15)' }} className="hide-on-mobile">
                <User size={16} />
              </div>
              {/* Hamburger */}
              <button onClick={() => setIsMobileMenuOpen(v => !v)} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} style={{ display: 'none', width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="mobile-hamburger">
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile search row — visible under 1024 */}
          <div className="show-on-tablet" style={{ display: 'none', marginTop: '0.75rem', maxWidth: '1200px', margin: '0.75rem auto 0' }}>
            <form onSubmit={handleNavSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.4rem 0.5rem 0.4rem 1rem', boxShadow: '0 2px 10px rgba(15,23,42,0.05)' }}>
              <Search size={16} style={{ opacity: 0.45, marginRight: '0.5rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search PIN / School / Builder..."
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', fontWeight: 500, minWidth: 0 }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px', padding: '0.45rem 1rem', fontSize: '0.8rem' }}>Search</button>
            </form>
          </div>
        </div>

        {/* Bottom Deck — hide on mobile when drawer handles it */}
        <div className="hide-on-tablet" style={{ padding: '0.5rem 1.25rem', background: 'rgba(248,250,252,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="nav-menu-links" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.84rem', fontWeight: 600 }}>
              {navLinks.map(link => (
                <button
                  key={link.label + link.path}
                  onClick={() => navigate(link.path)}
                  aria-current={link.active ? 'page' : undefined}
                  style={{
                    cursor: 'pointer',
                    color: link.active ? 'var(--color-primary)' : 'var(--text-secondary)',
                    background: link.active ? '#eff6ff' : 'transparent',
                    border: `1px solid ${link.active ? '#dbeafe' : 'transparent'}`,
                    borderRadius: '9999px',
                    padding: '0.32rem 0.85rem',
                    fontWeight: link.active ? 700 : 600,
                    transition: 'all 0.18s',
                  }}
                >
                  {link.label}
                </button>
              ))}
              <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.32rem 0.65rem', opacity: 0.9, fontWeight: 600 }}>About</span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }} className="hide-on-mobile">Switch Module:</div>
              <div style={{ position: 'relative' }}>
                <select
                  onChange={(e) => { if (e.target.value) navigate(`/module/${e.target.value}`); }}
                  value={path.split('/module/')[1]?.split('/')[0] || ''}
                  aria-label="Switch module"
                  style={{
                    padding: '0.38rem 2rem 0.38rem 0.85rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
                    minWidth: '160px',
                  }}
                >
                  <option value="">Explore 15 Modules…</option>
                  {MODULE_REGISTRY.filter(m => m.isLive).map(m => (
                    <option key={m.id} value={m.id}>{m.nameHindi} — {m.nameEnglish}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .hide-on-tablet { display: none !important; }
            .show-on-tablet { display: block !important; }
            .mobile-hamburger { display: flex !important; }
          }
          @media (min-width: 1025px) {
            .show-on-tablet { display: none !important; }
            .mobile-hamburger { display: none !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)} aria-hidden />
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 900, fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                <span style={{ color: '#0f2d59' }}>Janta</span><span style={{ color: '#f97316' }}>X</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {navLinks.map(link => (
                <button key={link.path + link.label} onClick={() => navigate(link.path)} style={{ textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9', background: link.active ? '#eff6ff' : '#f8fafc', color: link.active ? 'var(--color-primary)' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {link.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Switch Module</div>
              <select
                onChange={(e) => { if (e.target.value) navigate(`/module/${e.target.value}`); }}
                value={path.split('/module/')[1]?.split('/')[0] || ''}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}
              >
                <option value="">Choose module…</option>
                {MODULE_REGISTRY.filter(m => m.isLive).map(m => (
                  <option key={m.id} value={m.id}>{m.nameHindi} ({m.nameEnglish})</option>
                ))}
              </select>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Language</span>
                <LanguageToggle />
              </div>
              <button onClick={handleLocate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid #dbeafe', background: '#eff6ff', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                <MapPin size={16} /> Use my location · {selectedPin}
              </button>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>© 2024 JantaX · Citizen Powered · Non-Partisan</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ComingSoonPage({ moduleId }: { moduleId?: string }) {
  const navigate = useNavigate();
  return (
    <div className="page-enter" style={{ textAlign: 'center', padding: '4rem 1.25rem', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem' }}>🚧</div>
      <h2 style={{ fontSize: '1.45rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>जल्द आ रहा है — Coming Soon</h2>
      <p style={{ opacity: 0.65, marginBottom: '1.5rem', lineHeight: 1.5, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
        Module <strong style={{ color: 'var(--text-primary)' }}>{moduleId}</strong> is being built.<br />Data sources are being connected.
      </p>
      <button onClick={() => navigate('/')} className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}>← Back to Home</button>
    </div>
  );
}

function GlobalFooter() {
  const navigate = useNavigate();
  return (
    <footer className="global-footer">
      <div className="global-footer-inner">
        <div>
          <div className="footer-brand-title"><span>Janta</span><span className="accent">X</span><span style={{ marginLeft: '0.4rem', fontSize: '0.6rem', background: '#f97316', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>BETA</span></div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.6rem', lineHeight: 1.5, maxWidth: '320px' }}>
            India, Explained by Where You Live. Real data. Real places. Real impact. Track schools, projects, and governance by PIN code.
          </p>
          <div className="footer-badges-list" style={{ marginTop: '1.1rem' }}>
            <span className="footer-badge-item"><ShieldCheck size={14} style={{ color: '#0f2d59' }} /> 100% Open Data</span>
            <span className="footer-badge-item"><Users size={14} style={{ color: '#0f2d59' }} /> Citizen Powered</span>
            <span className="footer-badge-item"><Scale size={14} style={{ color: '#0f2d59' }} /> Non-Partisan</span>
            <span className="footer-badge-item"><Flag size={14} style={{ color: '#0f2d59' }} /> For Every Indian</span>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.7rem' }}>Explore</div>
          <div style={{ display: 'grid', gap: '0.1rem' }}>
            <span className="footer-link" onClick={() => navigate('/schools')}>Schools Directory</span>
            <span className="footer-link" onClick={() => navigate('/module/infra')}>Public Works</span>
            <span className="footer-link" onClick={() => navigate('/module/contractor')}>Contractors</span>
            <span className="footer-link" onClick={() => navigate('/module/rera')}>RERA Tracker</span>
            <span className="footer-link" onClick={() => navigate('/maps')}>Map Explorer</span>
            <span className="footer-link" onClick={() => navigate('/compare')}>Compare</span>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.7rem' }}>JantaX</div>
          <div style={{ display: 'grid', gap: '0.1rem' }}>
            <span className="footer-link" onClick={() => navigate('/about')}>About Us</span>
            <span className="footer-link" onClick={() => navigate('/data-sources')}>Data Sources</span>
            <span className="footer-link" onClick={() => navigate('/report')}>Report an Issue</span>
            <span className="footer-link" onClick={() => navigate('/privacy')}>Privacy & Terms</span>
            <a className="footer-link" href="https://github.com/anomalyco/opencode" target="_blank" rel="noreferrer">Feedback & GitHub</a>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Built for citizens, by citizens.<br />Press <kbd style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '1px 5px', borderRadius: '4px', fontSize: '0.7rem' }}>ctrl+p</kbd> for actions.
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', maxWidth: '1200px', margin: '0 auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>© 2024 JantaX. All rights reserved. Made with accountability in India 🇮🇳</span>
        <span style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 0 4px rgba(16,185,129,0.15)' }} /> All systems operational</span>
      </div>
    </footer>
  );
}

function ModuleRouter() {
  const { pathname: path } = useLocation();
  const moduleId = path.split('/module/')[1]?.split('/')[0];
  switch (moduleId) {
    case 'infra': return <InfraApp />;
    case 'school': return <SchoolModulePage />;
    case 'andhbhakt': return <AndhbhaktDash />;
    case 'contractor': return <ContractorApp />;
    case 'grievance': return <CpgramsDashboard />;
    case 'budget': return <BudgetDashboard />;
    case 'ration': return <RationDashboard />;
    case 'hospital': return <HospitalDashboard />;
    case 'rera': return <ReraDashboard />;
    case 'nagar': return <NagarDashboard />;
    case 'utility': return <UtilityDashboard />;
    case 'land': return <LandDashboard />;
    case 'pollution': return <PollutionDashboard />;
    case 'election': return <ElectionDashboard />;
    case 'rti': return <RtiDashboard />;
    default: return <ComingSoonPage moduleId={moduleId} />;
  }
}

function AppRoutes() {
  return (
    <>
      <AppNav />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem' }}><OfflineBanner /></div>
      <main id="main" style={{ flex: 1, background: 'var(--bg-primary)', minHeight: 'calc(100vh - var(--nav-height) - 200px)' }}>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '720px', margin: '0 auto' }}>
                <div className="skeleton" style={{ height: '18px', width: '40%' }} />
                <div className="skeleton" style={{ height: '42px', borderRadius: '9999px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                  <div className="skeleton" style={{ height: '120px' }} />
                  <div className="skeleton" style={{ height: '120px' }} />
                  <div className="skeleton" style={{ height: '120px' }} />
                </div>
                <div className="skeleton" style={{ height: '220px' }} />
              </div>
            </div>
          }>
            <div className="page-enter">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/pin/:pinCode" element={<PinDashboard />} />
                <Route path="/maps" element={<MapExplorer />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/schools" element={<SchoolsDirectory />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/module/*" element={<ModuleRouter />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <GlobalFooter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <PinProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppRoutes />
          </div>
        </PinProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
