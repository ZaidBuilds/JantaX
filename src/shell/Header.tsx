import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  Megaphone,
  LocateFixed,
  Star,
  ChevronDown,
  Check,
  LayoutGrid,
  Map as MapIcon,
  Columns3,
  FileText,
  Info,
} from 'lucide-react';
import { usePin } from '../core/context/PinContext';
import { useLanguage, SUPPORTED_LANGUAGES, type LanguageCode } from '../core/context/LanguageContext';
import { useTheme } from '../core/context/ThemeContext';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { PinInput } from '../ui/PinInput';
import { useDismiss } from '../ui/useDismiss';

const NAV = [
  { label: 'Explore', to: '/explore', icon: LayoutGrid },
  { label: 'Map', to: '/maps', icon: MapIcon },
  { label: 'Compare', to: '/compare', icon: Columns3 },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'About', to: '/about', icon: Info },
];

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="JantaX home">
      <span className="brand-mark" aria-hidden="true">
        J<span>X</span>
      </span>
      <span className="brand-word">
        Janta<em>X</em>
      </span>
    </Link>
  );
}

function HeaderSearch({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(isValidIndianPincode(value) ? `/pin/${value}` : `/search?q=${encodeURIComponent(value)}`);
    setQ('');
    ref.current?.blur();
    onDone?.();
  };

  return (
    <form role="search" onSubmit={submit} className="header-search">
      <Search size={16} aria-hidden="true" />
      <input
        ref={ref}
        className="header-search-input"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search PIN, school, contractor"
        aria-label="Search public records"
      />
      <span className="kbd hide-tablet" aria-hidden="true">
        /
      </span>
    </form>
  );
}

function PinSwitcher() {
  const navigate = useNavigate();
  const { selectedPin, setSelectedPin, followedPins, detectLocation, isDetecting, detectionError } = usePin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const loc = resolvePincode(selectedPin);

  const choose = (pin: string) => {
    setSelectedPin(pin);
    setOpen(false);
    navigate(`/pin/${pin}`);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="pin-button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title="Change your PIN code"
      >
        <MapPin size={15} aria-hidden="true" />
        {selectedPin}
        {loc.isValid && <span className="pin-sub">{loc.stateCode}</span>}
        <ChevronDown size={14} aria-hidden="true" style={{ color: 'var(--ink-3)' }} />
      </button>
      {open && (
        <div className="popover" role="dialog" aria-label="Choose PIN code" style={{ right: 0, top: 44, width: 320, padding: 'var(--s-4)' }}>
          <div className="stack">
            <div>
              <div className="strong">Your area</div>
              <div className="small muted">
                {loc.isValid ? `${loc.district}, ${loc.state}` : 'No PIN selected'}
              </div>
            </div>
            <PinInput key={selectedPin} initial="" onSubmit={choose} label="Switch to another PIN" submitLabel="Open" id="header-pin" />
            <button type="button" className="btn btn-secondary btn-block" onClick={async () => {
              const pin = await detectLocation();
              if (pin) choose(pin);
            }} disabled={isDetecting}>
              <LocateFixed size={16} aria-hidden="true" />
              {isDetecting ? 'Finding your area…' : 'Use my location'}
            </button>
            {detectionError && <div className="error-text">{detectionError}</div>}
            {followedPins.length > 0 && (
              <div>
                <div className="menu-label" style={{ padding: '0 0 6px' }}>Following</div>
                <div className="cluster">
                  {followedPins.map((p) => (
                    <button key={p} type="button" className="chip" onClick={() => choose(p)}>
                      <Star size={13} aria-hidden="true" /> {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageMenu() {
  const { language, setLanguage, languageInfo } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  return (
    <div ref={ref} style={{ position: 'relative' }} className="header-lang">
      <button
        type="button"
        className="btn btn-ghost"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Language: ${languageInfo.label}`}
      >
        <Languages size={16} aria-hidden="true" />
        <span>{languageInfo.labelLocal}</span>
      </button>
      {open && (
        <div className="popover" role="menu" style={{ right: 0, top: 44, minWidth: 200 }}>
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={language === l.code}
              className="menu-item"
              onClick={() => {
                setLanguage(l.code as LanguageCode);
                setOpen(false);
              }}
            >
              <span style={{ flex: 1 }}>{l.labelLocal}</span>
              <span className="tiny muted">{l.label}</span>
              {language === l.code && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className={`btn btn-ghost btn-icon ${className}`}
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const { language, setLanguage } = useLanguage();
  const { theme, setPreference } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="drawer-head">
          <Brand />
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-body">
          <HeaderSearch onDone={onClose} />
          <nav className="drawer-nav" aria-label="Main">
            {NAV.map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to} onClick={onClose} aria-current={location.pathname.startsWith(to) ? 'page' : undefined}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <Link to="/report-issue" onClick={onClose} className="btn btn-primary btn-block">
            <Megaphone size={16} aria-hidden="true" />
            Report an issue
          </Link>
          <div className="field">
            <label className="label" htmlFor="drawer-lang">Language</label>
            <select id="drawer-lang" className="select" value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.labelLocal} ({l.label})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <span className="label">Theme</span>
            <div className="segmented" role="group" aria-label="Theme">
              <button type="button" aria-pressed={theme === 'light'} onClick={() => setPreference('light')}>
                <Sun size={14} aria-hidden="true" /> Light
              </button>
              <button type="button" aria-pressed={theme === 'dark'} onClick={() => setPreference('dark')}>
                <Moon size={14} aria-hidden="true" /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="primary-nav" aria-label="Main">
            {NAV.map(({ label, to }) => (
              <NavLink key={to} to={to} className="nav-link">
                {label}
              </NavLink>
            ))}
          </nav>
          <HeaderSearch />
          <div className="header-tools">
            <PinSwitcher />
            <LanguageMenu />
            <ThemeToggle className="header-theme" />
            <Link to="/report-issue" className="btn btn-primary header-cta">
              <Megaphone size={16} aria-hidden="true" />
              <span className="header-cta-label">Report an issue</span>
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-icon menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileDrawer onClose={closeMenu} />}
    </>
  );
}
