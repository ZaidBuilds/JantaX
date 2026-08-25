import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'pa' | 'ml';

export interface Language {
  code: LanguageCode;
  label: string;
  labelLocal: string;
  dir: 'ltr';
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English', labelLocal: 'English', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', labelLocal: 'हिन्दी', dir: 'ltr' },
  { code: 'mr', label: 'Marathi', labelLocal: 'मराठी', dir: 'ltr' },
  { code: 'ta', label: 'Tamil', labelLocal: 'தமிழ்', dir: 'ltr' },
  { code: 'te', label: 'Telugu', labelLocal: 'తెలుగు', dir: 'ltr' },
  { code: 'bn', label: 'Bengali', labelLocal: 'বাংলা', dir: 'ltr' },
  { code: 'gu', label: 'Gujarati', labelLocal: 'ગુજરાતી', dir: 'ltr' },
  { code: 'kn', label: 'Kannada', labelLocal: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'pa', label: 'Punjabi', labelLocal: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'ml', label: 'Malayalam', labelLocal: 'മലയാളം', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageInfo: Language;
  t: (key: string) => string;
  tr: (en: string, hi?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    searchPlaceholder: 'Search by PIN code / School / Builder / Contractor / Project',
    searchButton: 'Search',
    useMyLocation: 'Use my location',
    popularSearches: 'Popular searches',
    language: 'Language',
    home: 'Home',
    backToHome: 'Back to JanCheck Home',
    comingSoon: 'Coming Soon',
    dataSources: 'Data sources are being connected.',
    schools: 'Schools',
    publicWorks: 'Public Works',
    contractors: 'Contractors',
    reraProjects: 'RERA Projects',
    healthcare: 'Healthcare',
    welfareSchemes: 'Welfare Schemes',
    explore: 'Explore',
    compare: 'Compare',
    maps: 'Maps',
    reports: 'Reports',
    about: 'About',
  },
  hi: {
    searchPlaceholder: 'खोजें PIN कोड / स्कूल / बिल्डर / ठेकेदार / प्रोजेक्ट',
    searchButton: 'खोजें',
    useMyLocation: 'मेरा स्थान उपयोग करें',
    popularSearches: 'लोकप्रिय खोजें',
    language: 'भाषा',
    home: 'होम',
    backToHome: 'जैंच होम पर वापस',
    comingSoon: 'जल्द आ रहा है',
    dataSources: 'डेटा सourceles जोड़े जा रहे हैं।',
    schools: 'स्कूल',
    publicWorks: 'सार्वजनिक कार्य',
    contractors: 'ठेकेदार',
    reraProjects: 'RERA प्रोजेक्ट्स',
    healthcare: 'स्वास्थ्य',
    welfareSchemes: 'कल्याण योजनाएँ',
    explore: 'खोजें',
    compare: 'तुलना',
    maps: 'मानचित्र',
    reports: 'रिपोर्ट',
    about: 'बारे में',
  },
  mr: {
    searchPlaceholder: 'PIN कोड / स्कूल / बिल्डर / ठेकेदार / प्रोजेक्टने शोधा',
    searchButton: 'शोधा',
    useMyLocation: 'माझी लोकेशन वापरा',
    popularSearches: 'लोकप्रिय शोधने',
    language: 'भाषा',
    home: 'होम',
    backToHome: 'जॅनचेक होमकडे परत',
    comingSoon: 'लवकाळी येईल',
    dataSources: 'डेटा स्रोते जोडली जात आहेत.',
    schools: 'शाळां',
    publicWorks: 'सार्वजनिक कामे',
    contractors: 'ठेकेदार',
    reraProjects: 'RERA प्रोजेक्ट्स',
    healthcare: 'आरोग्य',
    welfareSchemes: 'कल्याण योजना',
    explore: 'शोधा',
    compare: 'तुलना',
    maps: 'मॅप्स',
    reports: 'अहवेयी',
    about: 'बद्दल',
  },
  ta: {
    searchPlaceholder: 'PIN குறியீடு / பள்ளி / பில்டர் / ஒப்பந்தவர் / திட்டத்தைத் தேடுங்கள்',
    searchButton: 'தேடுங்கள்',
    useMyLocation: 'என் இடத்தைப் பயன்படுத்துங்கள்',
    popularSearches: 'பிரபல தேடல்கள்',
    language: 'மொழி',
    home: 'முகப்பு',
    backToHome: 'ஜான்செக் ஹோம் திருப்பித்',
    comingSoon: 'மேல்நிலையில் வருகிறது',
    dataSources: 'தரவு மூலங்கள் இணைக்கப்படுகின்றன.',
    schools: 'பள்ளிகள்',
    publicWorks: 'பொது வேலைகள்',
    contractors: 'முயலியாளர்கள்',
    reraProjects: 'RERA திட்டங்கள்',
    healthcare: 'சுகாதாரம்',
    welfareSchemes: 'நலவியல் திட்டங்கள்',
    explore: 'ஆவார்',
    compare: 'ஒப்பீடு',
    maps: 'மேப்ஸ்',
    reports: 'அறிக்கைகள்',
    about: 'பற்றி',
  },
  te: {
    searchPlaceholder: 'PIN కోడ్ / పాఠశాల / నిర్మాణదారు / కాంట్రాక్టర్ / ప్రాజెక్టును శోధండి',
    searchButton: 'శోధించండి',
    useMyLocation: 'నా స్థానికాన్ని ఉపయోగించండి',
    popularSearches: 'ప్రసిద్ధ శోధాలు',
    language: 'భాష',
    home: 'హోమ్',
    backToHome: 'జాన్చెక్ హోమ్‌కి తిరిగి',
    comingSoon: 'రానున్నాయి',
    dataSources: 'డేటా మూలాలు కనెక్ట్ చేయబడుతున్నాయి.',
    schools: 'పాఠశాలలు',
    publicWorks: 'పౌర పనులు',
    contractors: 'కాంట్రాక్టర్లు',
    reraProjects: 'RERA ప్రాజెక్టులు',
    healthcare: 'ఆరోగ్యం',
    welfareSchemes: 'జన్ కల్యాణ యోజనలు',
    explore: 'అన్వేషించండి',
    compare: 'పోల్చండి',
    maps: 'మ్యాప్స్',
    reports: 'నివేదికలు',
    about: 'గురించి',
  },
  bn: {
    searchPlaceholder: 'PIN কোড / স্কুল / বিল্ডার / ঠিকাদার / প্রকল্প অনুসন্ধান করুন',
    searchButton: 'অনুসন্ধান',
    useMyLocation: 'আমার অবস্থান ব্যবহার করুন',
    popularSearches: 'জনপ্রিয় অনুসন্ধান',
    language: 'ভাষা',
    home: 'হোম',
    backToHome: 'জানচেক হোমে ফিরে',
    comingSoon: 'শীঘ্রই আসছে',
    dataSources: 'ডেটা সোর্সগুলি সংযুক্ত করা হচ্ছে.',
    schools: 'বিদ্যালয়',
    publicWorks: 'সরকারি কাজ',
    contractors: 'ঠিকাদার',
    reraProjects: 'RERA প্রকল্প',
    healthcare: 'স্বাস্থ্য',
    welfareSchemes: 'কল্যাণ প্রকল্প',
    explore: 'অন্বেষণ',
    compare: 'তুলনা',
    maps: 'মানচিত্র',
    reports: ' প্রতিবেদন',
    about: 'সম্পর্কে',
  },
  gu: {
    searchPlaceholder: 'PIN કોડ / શાળા / બિલ્ડર / યોજનાકર્તા / પ્રોજેક્ટ શોધો',
    searchButton: 'શોધો',
    useMyLocation: 'મારું સ્થાન ઉપયોગ કરો',
    popularSearches: 'લોકપ્રિય શોધ',
    language: 'ભાષા',
    backToHome: 'જાનચેક હોમમાં પાછા',
    comingSoon: 'જલદી આવી રહી છે',
    dataSources: 'डेटા સ્રોતો જોડાઈ રહી છે.',
    schools: 'શાળાઓ',
    publicWorks: 'સરકારી કાર્ય',
    contractors: 'યોજનાકર્તા',
    reraProjects: 'RERA પ્રોજેક્ટ્સ',
    healthcare: 'સ્વાસ્થ્ય',
    welfareSchemes: 'કલ્યાણ યોજનાઓ',
    explore: 'શોધો',
    compare: 'મુલ્યાંકન',
    maps: 'મેપ્સ',
    reports: 'અહવાલો',
    about: 'વિશે',
  },
  kn: {
    searchPlaceholder: 'PIN ಕೋಡ್ / ಪಾಠಶಾಲೆ / ನಿರ್ಮಾಪಕ / ಕಂಟ್ರಾಕ್ಟರ್ / ಪ್ರಕಲ್ಪ ಹುಡುಕಿ',
    searchButton: 'ಹುಡುಕಿ',
    useMyLocation: 'ನನ್ನ ಸ್ಥಳವನ್ನು ಬಳಸಿ',
    popularSearches: 'ಪ್ರಖ್ಯಾತ ಹುಡುಕೆಯನ್ನು',
    language: 'ಭಾಷೆ',
    backToHome: 'ಜಾನ್ಚೆಕ್ ಹೋಮೆ ಹೋಗಿ',
    comingSoon: 'ಸುಮ್ಮನೆ ಬರುತ್ತದೆ',
    dataSources: 'ಡೇಟಾ ಮೂಲಗಳು ಸಂಪರ್ಕಿಸಲ್ಪಟ್ಟಿವೆ.',
    schools: 'ಪಾಠಶಾಲೆಗಳು',
    publicWorks: 'ಸಾರ್ವಜನಿಕ ಕೆಲಸಗಳು',
    contractors: 'ಕಂಟ್ರಾಕ್ಟರ್ಸ್',
    reraProjects: 'RERA ಪ್ರಕಲ್ಪಗಳು',
    healthcare: 'ಆರೋಗ್ಯ',
    welfareSchemes: 'ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
    explore: 'ಅನ್ವೇಷಿಸಿ',
    compare: 'ಹೋಲಿಸಿ',
    maps: 'ಮ್ಯಾಪ್ಸ್',
    reports: 'ವರದಿಗಳು',
    about: 'ಬಗ್ಗೆ',
  },
  pa: {
    searchPlaceholder: 'PIN ਕੋਡ / ਸਕੂਲ / ਬਿਲਡਰ / ਠੇਕੇਦਾਰ / ਪ੍ਰੋਜੈਕਟ ਖੋਜੋ',
    searchButton: 'ਖੋਜੋ',
    useMyLocation: 'ਮੇਰਾ ਸਥਾਨ ਵਰਤੋ',
    popularSearches: 'ਪ੍ਰਸਿੱਧ ਖੋਜਾਂ',
    language: 'ਭਾਸ਼ਾ',
    backToHome: "?????? ??? '?? ????",

    comingSoon: 'ਜਲ੍ਹੈ ਆਵੇਗਾ',
    dataSources: 'ਡੇਟਾ ਸਰੋਤਾਂ ਨੂੰ ਜੋੜਿਆ ਜਾ ਰਿਹਾ ਹੈ.',
    schools: 'ਸਕੂਲ',
    publicWorks: 'ਸਰਕਾਰੀ ਕੰਮ',
    contractors: 'ਠੇਕੇਦਾਰ',
    reraProjects: 'RERA ਪ੍ਰੋਜੈਕਟ',
    healthcare: 'ਸਿਹਤ',
    welfareSchemes: 'ਕਲਿਆਣ ਯੋਜਨਾਵਾਂ',
    explore: 'ਖੋਜੋ',
    compare: 'ਤੁਲਨਾ',
    maps: 'ਨਕਸ਼ੇ',
    reports: 'ਰਿਪੋਰਟ',
    about: 'ਬਾਰੇ',
  },
  ml: {
    searchPlaceholder: 'PIN കോഡ് / സ്കൂൾ / ബിൽഡർ / കന്ട്രാക്ടർ / പ്രോജക്ട് തിരയുക',
    searchButton: 'തിരയുക',
    useMyLocation: 'എന്റെ സ്ഥലത്തെ ഉപയോഗിക്കുക',
    popularSearches: 'പേർച്ചപ്പതി തിരയൽകൾ',
    language: 'ഭാഷ',
    backToHome: 'ജാന്‍ചെക്ക് ഹോം തിരികെ',
    comingSoon: 'തിങ്ങളെ വരും',
    dataSources: 'ഡാറ്റ മൂല്യങ്ങൾ ചേർക്കുന്നു.',
    schools: 'സ്കൂൾസ്',
    publicWorks: 'പൊതു പ്രവർത്തനങ്ങൾ',
    contractors: 'കന്ട്രാക്ടർസ്',
    reraProjects: 'RERA പ്രോജക്ട്സ്',
    healthcare: 'ആരോഗ്യം',
    welfareSchemes: 'സന്നദ്ധ പദ്ധതികൾ',
    explore: 'കണ്ടെത്തുക',
    compare: 'പൊരോപനം',
    maps: 'മാന്ചിത്രം',
    reports: 'നിവേദികൾ',
    about: 'കുറിത്ത്',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem('jantax_language');
      if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) return stored as LanguageCode;
    } catch {}
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    try { localStorage.setItem('jantax_language', language); } catch {}
  }, [language]);

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  const tr = (en: string, hi?: string): string => {
    if (language === 'en') return en;
    if (language === 'hi' && hi) return hi;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageInfo, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useTitle(english: string, hindi?: string): string {
  const { language, tr } = useLanguage();
  return language === 'hi' && hindi ? hindi : english;
}


