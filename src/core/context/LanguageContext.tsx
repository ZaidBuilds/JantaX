import { createContext, Fragment, useContext, useLayoutEffect, useState, type ReactNode } from 'react';
import { pick, setLang, t, type Lang } from '../../i18n';
import { startTranslator, stopTranslator } from '../../i18n/domTranslator';

export type LanguageCode = Lang;

export interface Language {
  code: LanguageCode;
  label: string;
  labelLocal: string;
}

/** Only languages with a complete dictionary are offered; adding one means adding its dictionary in src/i18n. */
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English', labelLocal: 'English' },
  { code: 'hi', label: 'Hindi', labelLocal: 'हिन्दी' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';
const STORAGE_KEY = 'jantax_language';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageInfo: Language;
  /** Translate an English UI string (see src/i18n). */
  t: typeof t;
  /** Pick the language version of a value that exists in both. */
  tr: (en: string, hi?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function storedLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored as LanguageCode;
  } catch {
    /* storage blocked: use the default */
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const initial = storedLanguage();
    setLang(initial);
    return initial;
  });

  const setLanguage = (next: LanguageCode) => {
    setLang(next);
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not remembered, but the switch still applies */
    }
  };

  // Runs after the fresh tree is committed and before paint, so Hindi pages never flash English.
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    if (language === 'hi') startTranslator();
    else stopTranslator();
    return stopTranslator;
  }, [language]);

  const languageInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageInfo, t, tr: pick }}>
      {/* Re-mount the page on a switch so every string, including ones read from constants, renders afresh. */}
      <Fragment key={language}>{children}</Fragment>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
