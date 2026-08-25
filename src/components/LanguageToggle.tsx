import { useLanguage, SUPPORTED_LANGUAGES } from '../core/context/LanguageContext';

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        aria-label={t('language')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        style={{
          appearance: 'none',
          padding: '0.38rem 1.4rem 0.38rem 0.8rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '92px',
          boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ background: '#ffffff', color: '#0f172a' }}>
            {lang.label} · {lang.labelLocal}
          </option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: '0.55rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5, fontSize: '0.7rem' }}>▾</span>
    </div>
  );
}

export default LanguageToggle;