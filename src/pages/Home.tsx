import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../core/services/api';
import {
  Search,
  MapPin,
  GraduationCap,
  Construction,
  Building2,
  HardHat,
  Hospital,
  Wheat,
  Scale,
  FileText,
  Wind,
  Landmark,
  PiggyBank,
  Share2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Camera,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { useWhatsAppShare } from '../core/hooks/useWhatsAppShare';
import { MOCK_CITIZEN_REPORTS } from '../modules/reporting/data/mockReports';
import HeroBackground from '../components/Antigravity/HeroBackground';

const QUICK_CITIES = [
  { label: 'Delhi (110001)', pin: '110001' },
  { label: 'Meerut (250001)', pin: '250001' },
  { label: 'Bengaluru (560001)', pin: '560001' },
  { label: 'Mumbai (400001)', pin: '400001' },
  { label: 'Lucknow (226001)', pin: '226001' },
  { label: 'Kolkata (700001)', pin: '700001' },
  { label: 'Chennai (600001)', pin: '600001' },
  { label: 'Patna (800001)', pin: '800001' },
  { label: 'Hyderabad (500001)', pin: '500001' },
];

export function Home() {
  const navigate = useNavigate();
  const { query, search } = usePinSearch();
  const [searchText, setSearchText] = useState('');
  const { selectedPin, setSelectedPin } = usePin();
  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const activePin = selectedPin || '110001';
  const resolvedLoc = resolvePincode(activePin);

  const [reports, setReports] = useState<any[]>(MOCK_CITIZEN_REPORTS.slice(0, 4));
  // True while `reports` holds local demonstration fixtures rather than
  // moderated records from the API. Must be surfaced in the UI — sample
  // records are never presented as verified citizen evidence.
  const [reportsAreSample, setReportsAreSample] = useState(true);

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (isValidIndianPincode(trimmed)) {
      setSelectedPin(trimmed);
      navigate(`/pin/${trimmed}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const loadReports = useCallback(async () => {
    if (!activePin) return;
    try {
      const data = await api.getReports(activePin);
      if (Array.isArray(data) && data.length > 0) {
        setReports(data.slice(0, 4));
        setReportsAreSample(false);
      }
    } catch {
      // Source unavailable — keep the demonstration fixtures, but they stay
      // flagged as sample so they are never shown as verified evidence.
    }
  }, [activePin]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const sectors = [
    {
      id: 'school',
      className: 'sector-school',
      title: tr('Schools & Education', 'स्कूल एवं शिक्षा'),
      category: tr('Primary & Secondary Education', 'प्राथमिक एवं माध्यमिक शिक्षा'),
      tag: tr('UDISE+ Registry Verified', 'UDISE+ सत्यापित'),
      desc: tr('Classroom infrastructure, functional toilets, pupil-teacher ratios and UDISE+ scores.', 'कक्षा संरचना, शौचालय, छात्र-शिक्षक अनुपात एवं UDISE+ स्कोर।'),
      source: tr('Ministry of Education / UDISE+', 'शिक्षा मंत्रालय / UDISE+'),
      route: `/schools?pin=${activePin}`,
      icon: GraduationCap,
      color: 'var(--sector-school)',
      bg: 'var(--sector-school-bg)',
    },
    {
      id: 'infra',
      className: 'sector-infra',
      title: tr('Roads & Public Works', 'सड़कें और निर्माण कार्य'),
      category: tr('Physical Infrastructure & PWD', 'सार्वजनिक निर्माण एवं सड़कें'),
      tag: tr('PMGSY & Highway Tenders', 'PMGSY एवं सड़क निविदाएं'),
      desc: tr('Rural connectivity, state highways, physical completion percentages vs sanctioned budget.', 'ग्रामीण कनेक्टिविटी, राज्य मार्ग, स्वीकृत बजट बनाम कार्य प्रगति।'),
      source: tr('PMGSY / State Public Works', 'PMGSY / राज्य लोक निर्माण विभाग'),
      route: `/projects?pin=${activePin}`,
      icon: Construction,
      color: 'var(--sector-infra)',
      bg: 'var(--sector-infra-bg)',
    },
    {
      id: 'rera',
      className: 'sector-rera',
      title: tr('RERA Real Estate', 'रेरा हाउसिंग प्रोजेक्ट्स'),
      category: tr('Housing & Urban Development', 'आवास एवं शहरी विकास'),
      tag: tr('Possession Deadlines & Delays', 'पजेशन समय सीमा एवं देरी'),
      desc: tr('Builder delivery commitments, construction delay tracker, and homebuyer complaints.', 'बिल्डर डिलीवरी वादे, निर्माण देरी ट्रैकर एवं खरीदार शिकायतें।'),
      source: tr('State RERA Authorities', 'राज्य रेरा प्राधिकरण'),
      route: `/rera?pin=${activePin}`,
      icon: Building2,
      color: 'var(--sector-rera)',
      bg: 'var(--sector-rera-bg)',
    },
    {
      id: 'contractor',
      className: 'sector-contractor',
      title: tr('Contractors Accountability', 'ठेकेदार जवाबदेही लेज़र'),
      category: tr('Public Procurement & Tenders', 'सार्वजनिक खरीद एवं निविदाएं'),
      tag: tr('Performance & Debarment', 'प्रदर्शन एवं डिबारमेंट रिकॉर्ड'),
      desc: tr('Contractor tender awards, blacklist records, win rates, and ground completion ratings.', 'ठेकेदार निविदा रिकॉर्ड, ब्लैकलिस्ट स्थिति एवं कार्य निष्पादन रेटिंग।'),
      source: tr('Central & State Procurement Gazettes', 'केंद्रीय एवं राज्य खरीद रिकॉर्ड'),
      route: '/contractors',
      icon: HardHat,
      color: 'var(--sector-contractor)',
      bg: 'var(--sector-contractor-bg)',
    },
    {
      id: 'hospital',
      className: 'sector-hospital',
      title: tr('Healthcare Facilities', 'अस्पताल व स्वास्थ्य केंद्र'),
      category: tr('Primary Healthcare & PHC/CHC', 'प्राथमिक स्वास्थ्य एवं अस्पताल'),
      tag: tr('Doctor Attendance & Beds', 'डॉक्टर उपस्थिति एवं बेड क्षमता'),
      desc: tr('District hospital capacity, primary health center doctor rosters, and essential medicines.', 'जिला अस्पताल क्षमता, प्राथमिक स्वास्थ्य केंद्र डॉक्टर रोस्टर एवं दवाएं।'),
      source: tr('HMIS / National Health Mission', 'HMIS / राष्ट्रीय स्वास्थ्य मिशन'),
      route: `/module/hospital?pin=${activePin}`,
      icon: Hospital,
      color: 'var(--sector-hospital)',
      bg: 'var(--sector-hospital-bg)',
    },
    {
      id: 'ration',
      className: 'sector-ration',
      title: tr('Fair Price Shops (PDS)', 'उचित दर राशन दुकान (PDS)'),
      category: tr('Food Security & NFSA', 'खाद्य सुरक्षा एवं राशन वितरण'),
      tag: tr('Grain Quotas & Distribution', 'अनाज कोटा एवं वितरण स्थिति'),
      desc: tr('NFSA grain quotas, active family beneficiaries, monthly distribution compliance rates.', 'राशन कोटा, सक्रिय लाभार्थी परिवार, मासिक वितरण स्थिति।'),
      source: tr('National Food Security Portal', 'राष्ट्रीय खाद्य सुरक्षा पोर्टल'),
      route: `/module/ration?pin=${activePin}`,
      icon: Wheat,
      color: 'var(--sector-ration)',
      bg: 'var(--sector-ration-bg)',
    },
    {
      id: 'courts',
      className: 'sector-courts',
      title: tr('eCourts & Case Filings', 'न्यायालय एवं केस स्टेटस'),
      category: tr('Judicial Administration', 'न्यायिक प्रशासन एवं वाद'),
      tag: tr('CNR Case Pendency', 'CNR केस स्थिति एवं सुनवाई'),
      desc: tr('District court case pendency, hearing schedules, cause lists, and disposal rates.', 'जिला अदालत केस पेंडेंसी, सुनवाई की तारीखें एवं निस्तारण दर।'),
      source: tr('eCourts Services / NJDG', 'eCourts सेवाएं / NJDG'),
      route: `/module/courts?pin=${activePin}`,
      icon: Scale,
      color: 'var(--sector-courts)',
      bg: 'var(--sector-courts-bg)',
    },
    {
      id: 'rti',
      className: 'sector-rti',
      title: tr('RTI Application Generator', 'सूचना का अधिकार (RTI)'),
      category: tr('Statutory Rights & CPIO', 'नागरिक अधिकार एवं सीपीएम'),
      tag: tr('30-Day Response Clock', '30-दिवसीय वैधानिक समय सीमा'),
      desc: tr('Instant Section 6(1) RTI draft generator, public authority directory, and reply tracker.', 'तुरंत आरटीआई आवेदन ड्राफ्ट, लोक सूचना अधिकारी निर्देशिका एवं ट्रैकर।'),
      source: tr('Central Information Commission', 'केंद्रीय सूचना आयोग'),
      route: '/rti',
      icon: FileText,
      color: 'var(--sector-rti)',
      bg: 'var(--sector-rti-bg)',
    },
    {
      id: 'grievance',
      className: 'sector-grievance',
      title: tr('Public Grievances (CPGRAMS)', 'सार्वजनिक शिकायत निवारण'),
      category: tr('Administrative Resolution', 'प्रशासनिक शिकायत निवारण'),
      tag: tr('SLA Resolution Tracker', 'विभागीय समाधान समय सीमा'),
      desc: tr('Central and state departmental resolution timelines, pending days, and escalation ladders.', 'केंद्रीय एवं राज्य विभागीय समाधान समय, पेंडिंग दिन एवं एस्केलेशन।'),
      source: tr('DARPG / CPGRAMS Portal', 'DARPG / CPGRAMS पोर्टल'),
      route: `/module/grievance?pin=${activePin}`,
      icon: AlertTriangle,
      color: 'var(--sector-grievance)',
      bg: 'var(--sector-grievance-bg)',
    },
    {
      id: 'pollution',
      className: 'sector-pollution',
      title: tr('Air Quality & GRAP (AQI)', 'वायु गुणवत्ता एवं प्रदूषण'),
      category: tr('Environmental Monitoring', 'पर्यावरण एवं वायु निगरानी'),
      tag: tr('Live PM2.5 / PM10 Sensors', 'लाइव सेंसर निगरानी'),
      desc: tr('Real-time continuous ambient monitoring, GRAP alert stages, and public health advisories.', 'वास्तविक समय वायु निगरानी, ग्रैप प्रतिबंध चरण एवं स्वास्थ्य परामर्श।'),
      source: tr('Central Pollution Control Board', 'केंद्रीय प्रदूषण नियंत्रण बोर्ड'),
      route: '/pollution',
      icon: Wind,
      color: 'var(--sector-pollution)',
      bg: 'var(--sector-pollution-bg)',
    },
    {
      id: 'nagar',
      className: 'sector-nagar',
      title: tr('Ward & Municipal Services', 'वार्ड एवं नगर निगम सेवाएं'),
      category: tr('Urban Local Body (ULB)', 'स्थानीय शहरी निकाय'),
      tag: tr('Sanitation & Complaints', 'सफाई एवं स्थानीय सुविधाएं'),
      desc: tr('Waste management routes, streetlights, local councillor contacts, and civic complaints.', 'कचरा प्रबंधन मार्ग, स्ट्रीट लाइट, पार्षद संपर्क एवं नागरिक शिकायतें।'),
      source: tr('State Urban Development Departments', 'राज्य नगर विकास विभाग'),
      route: '/nagar',
      icon: Landmark,
      color: 'var(--sector-nagar)',
      bg: 'var(--sector-nagar-bg)',
    },
    {
      id: 'mplads',
      className: 'sector-mplads',
      title: tr('MPLADS Fund Tracker', 'सांसद निधि (MPLADS)'),
      category: tr('Parliamentary Fund Audits', 'संसदीय विकास निधि लेखा'),
      tag: tr('₹5 Crore / Year Allotment', '₹5 करोड़ वार्षिक आवंटन'),
      desc: tr('Parliamentarian recommended projects, fund releases, completed civil works, and unspent balances.', 'सांसद द्वारा अनुशंसित कार्य, फंड रिलीज, पूर्ण कार्य एवं अप्रयुक्त शेष।'),
      source: tr('Ministry of Statistics (MoSPI)', 'सांख्यिकी मंत्रालय (MoSPI)'),
      route: '/mplads',
      icon: PiggyBank,
      color: 'var(--sector-mplads)',
      bg: 'var(--sector-mplads-bg)',
    },
  ];

  const handleShareSample = () => {
    share({
      pinCode: activePin,
      titleHindi: `जनताएक्स जमीनी रिपोर्ट: पिन कोड ${activePin}`,
      titleEnglish: `JantaX Ground Reality Report: PIN ${activePin}`,
      claimLabel: 'Official Claim',
      claimLabelHindi: 'सरकारी दावा: 100% कार्य पूर्ण',
      realityLabel: 'Ground Reality',
      realityLabelHindi: 'जमीनी हकीकत: 18 महीने से विलंबित',
      responsiblePerson: 'District Administration',
      responsibleOrg: 'Public Works Department',
      sourceUrl: `https://jantax.in/pin/${activePin}`,
      moduleNameHindi: 'दावा बनाम हकीकत (JantaX Reality Check)',
    });
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* 1. PUBLIC CIVIC SEARCH HERO */}
      <section className="search-hero">
        <HeroBackground />
        <div className="container">
          <div className="hero-content">
            {/* Live Status Pill */}
            <div className="hero-pill-badge">
              <span className="hero-pill-dot"></span>
              {/* Claim must stay checkable: we publish open government data and
                  show the source for every record. We do not claim to be
                  government-verified — JantaX is not an official portal. */}
              <span>{tr('Open government data · Source shown for every record', 'सरकारी ओपन डेटा · हर रिकॉर्ड का स्रोत दिखाया गया')}</span>
            </div>

            <h1 className="hero-headline">
              {tr('India, Explained by', 'भारत, आपके स्थान से')}{' '}
              <br />
              <span style={{ color: 'var(--navy-600)' }}>{tr('Where You Live.', 'सच्चाई समझें।')}</span>
            </h1>

            <p className="hero-subhead">
              {tr(
                'Search public records on schools, healthcare, roads, RERA housing, and government tenders across any Indian PIN code or district.',
                'किसी भी भारतीय पिन कोड या जिले के स्कूलों, स्वास्थ्य केंद्रों, सड़कों और हाउसिंग प्रोजेक्ट्स के सरकारी रिकॉर्ड देखें।'
              )}
            </p>

            {/* Elevated Command Search Bar */}
            <form
              className="main-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(searchText || query);
              }}
            >
              <div className="search-input-wrapper">
                <Search size={22} className="search-icon-inside" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  aria-label="Enter 6-digit Indian PIN Code or search topic"
                  placeholder={tr('Enter any 6-digit PIN (e.g. 110001, 682001, 302001)...', 'कोई भी 6 अंकों का पिन कोड दर्ज करें (उदा. 110001, 682001)...')}
                  value={searchText || query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchText(val);
                    if (/^\d{0,6}$/.test(val)) search(val);
                  }}
                  className="search-input-main"
                />
              </div>

              <button type="submit" className="search-submit-btn">
                <span>{tr('Search Records', 'रिकॉर्ड खोजें')}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Cities Pill Carousel */}
            <div className="search-examples">
              <span className="search-examples-label">{tr('Quick Cities:', 'प्रमुख शहर:')}</span>
              {QUICK_CITIES.map((c) => (
                <button
                  key={c.pin}
                  type="button"
                  className="search-example-link"
                  onClick={() => {
                    setSearchText(c.pin);
                    setSelectedPin(c.pin);
                    navigate(`/pin/${c.pin}`);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Live Ticker Strip */}
            <div className="live-stream-ticker">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-500)', display: 'inline-block' }}></span>
              {/* Name the sources we draw on, without claiming every one is
                  live nationwide. Per-module status is shown on each module. */}
              <span>{tr('Sources include UDISE+ · PMGSY · RERA · NHM · NFSA · CPGRAMS', 'स्रोतों में शामिल हैं: UDISE+ · PMGSY · RERA · NHM · NFSA · CPGRAMS')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container" id="main" style={{ marginTop: '2.5rem' }}>
        {/* 2. ACTIVE LOCALITY FACILITY SPOTLIGHT (REPLACES BARE NUMBERS) */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '2.75rem',
          }}
        >
          {/* Header of Active Locality */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--navy-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--navy-600)',
                }}
              >
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {tr('Active Locality', 'सक्रिय क्षेत्र')}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: 'var(--navy-900)',
                      color: '#ffffff',
                      padding: '0.1rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {activePin}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-950)', margin: '0.15rem 0 0' }}>
                  {resolvedLoc.district}, {resolvedLoc.state}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.5rem' }}>
                    ({resolvedLoc.region} India)
                  </span>
                </h2>
              </div>
            </div>

            <Link to={`/pin/${activePin}`} className="btn btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
              <span>{tr('View Complete Locality Scorecard', 'संपूर्ण क्षेत्र रिपोर्ट कार्ड देखें')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/*
            Illustrative spotlight cards. The figures below are fixed example
            content used to show the layout — they are NOT read from the API
            and do not describe the active PIN. They must stay clearly
            labelled until they are wired to /api/pincode/:code.
          */}
          <p
            role="note"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              margin: '0 0 var(--space-3)',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--status-warn-bg)',
              border: '1px solid var(--status-warn-border)',
              color: 'var(--status-warn-text)',
              fontSize: 'var(--text-caption)',
              fontWeight: 700,
            }}
          >
            <AlertTriangle size={13} aria-hidden="true" />
            {tr(
              'Illustrative example — not live data for this PIN',
              'उदाहरण मात्र — इस पिन का वास्तविक डेटा नहीं'
            )}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* School Spotlight */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sector-school)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <GraduationCap size={15} />
                  <span>{tr('Education Benchmark', 'शिक्षा मानक')}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.2rem' }}>
                  Kendriya Vidyalaya & Govt Schools
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  100% functional sanitation · 24:1 pupil-teacher ratio · UDISE+ audited
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{tr('Example', 'उदाहरण')}</span>
                <Link to={`/schools?pin=${activePin}`} style={{ color: 'var(--navy-600)', fontWeight: 700 }}>Inspect ↗</Link>
              </div>
            </div>

            {/* Public Works Spotlight */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sector-infra)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Construction size={15} />
                  <span>{tr('Public Infrastructure', 'सार्वजनिक निर्माण')}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.2rem' }}>
                  PMGSY Road & Drainage Network
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  ₹14.8 Cr sanctioned budget · 68% progress · 14 mo. average delay
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{tr('Example', 'उदाहरण')}</span>
                <Link to={`/projects?pin=${activePin}`} style={{ color: 'var(--navy-600)', fontWeight: 700 }}>Inspect ↗</Link>
              </div>
            </div>

            {/* Healthcare Spotlight */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sector-hospital)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Hospital size={15} />
                  <span>{tr('Healthcare Access', 'स्वास्थ्य सुविधाएं')}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.2rem' }}>
                  District Hospital & CHC Health Unit
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  24x7 emergency duty verified · 200 sanctioned beds · HMIS registered
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{tr('Example', 'उदाहरण')}</span>
                <Link to={`/module/hospital?pin=${activePin}`} style={{ color: 'var(--navy-600)', fontWeight: 700 }}>Inspect ↗</Link>
              </div>
            </div>

            {/* RERA Spotlight */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sector-rera)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Building2 size={15} />
                  <span>{tr('Housing Accountability', 'हाउसिंग जवाबदेही')}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.2rem' }}>
                  RERA Registered Residential Projects
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  2,730 housing units tracked · Delivery timelines & buyer complaints
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{tr('Example', 'उदाहरण')}</span>
                <Link to={`/rera?pin=${activePin}`} style={{ color: 'var(--navy-600)', fontWeight: 700 }}>Inspect ↗</Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BENTO GRID SECTOR OBSERVATORIES */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="section-header-block">
            <div>
              <h2 className="section-title">{tr('Public Observatories', 'नागरिक वेधशाला')}</h2>
              <p className="section-desc">
                {tr(
                  'Select any sector below to inspect official government claims side-by-side with ground realities.',
                  'किसी भी विभाग के आधिकारिक दावों और वास्तविक स्थिति की तुलना देखने के लिए नीचे चुनें।'
                )}
              </p>
            </div>
            <Link to={`/pin/${activePin}`} style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-600)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{tr('View Complete Locality Map', 'संपूर्ण क्षेत्र मानचित्र देखें')}</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bento-grid">
            {sectors.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.id} to={s.route} className={`bento-card ${s.className}`}>
                  <div>
                    <div className="bento-card-top">
                      <div className="bento-icon-halo" style={{ background: s.bg, color: s.color }}>
                        <Icon size={24} />
                      </div>
                      <span className="bento-count-badge">{s.tag}</span>
                    </div>

                    <h3 className="bento-title">
                      <span>{s.title}</span>
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.65rem' }}>
                      {s.category}
                    </div>

                    <p className="bento-desc">{s.desc}</p>
                  </div>

                  <div className="bento-footer">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.source}</span>
                    <span className="bento-explore-arrow">
                      <span>{tr('Inspect', 'जांचें')}</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. CLAIM VS REALITY SHOWCASE */}
        <section className="claim-reality-container">
          <div className="claim-reality-header">
            <div>
              <h2>
                <Sparkles size={22} style={{ color: 'var(--saffron-400)' }} />
                <span>{tr('Claim vs Ground Reality', 'दावा बनाम हकीकत')}</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                {tr(
                  'How JantaX presents an official record next to corroborated ground observations. Worked example — the figures below are illustrative, not a real case.',
                  'JantaX आधिकारिक रिकॉर्ड और जमीनी टिप्पणियों को साथ-साथ कैसे दिखाता है। यह एक उदाहरण है, वास्तविक मामला नहीं।'
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareSample}
              className="btn btn-whatsapp"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <Share2 size={16} />
              <span>{tr('Share on WhatsApp', 'व्हाट्सएप पर साझा करें')}</span>
            </button>
          </div>

          <div className="claim-reality-grid">
            {/* Left: Official Claim */}
            <div className="claim-panel">
              <div className="panel-kicker">{tr('Official Claim', 'सरकारी दावा')}</div>
              <h3 className="panel-headline">{tr('PMGSY Rural Road & Drain Package', 'प्रधानमंत्री ग्राम सड़क योजना कार्य')}</h3>
              <div className="panel-metric-huge">{tr('100% Completed', '100% पूर्ण घोषित')}</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {tr(
                  'Official State PWD dashboard records the 4.8 km connecting road and stormwater drainage work as 100% physically complete with full fund disbursement.',
                  'राज्य लोक निर्माण विभाग के अनुसार 4.8 किमी सड़क और जल निकासी कार्य 100% पूरा व भुगतान स्वीकृत है।'
                )}
              </p>
              {/* Illustrative only. Never print a specific tender reference or
                  claim portal verification unless it resolves to a real record. */}
              <div className="panel-citation">
                <strong>{tr('Source type:', 'स्रोत प्रकार:')}</strong>{' '}
                {tr(
                  'State public works portal — example, no real tender referenced',
                  'राज्य लोक निर्माण पोर्टल — उदाहरण, कोई वास्तविक निविदा संदर्भित नहीं'
                )}
              </div>
            </div>

            {/* Right: Ground Reality */}
            <div className="reality-panel">
              <div className="panel-kicker">{tr('Ground Reality', 'जमीनी हकीकत')}</div>
              <h3 className="panel-headline">{tr('Audit Finding & Citizen Observations', 'ऑडिट निष्कर्ष एवं नागरिक टिप्पणियाँ')}</h3>
              <div className="panel-metric-huge">{tr('18 Months Delayed', '18 महीने से विलंबित')}</div>
              {/* Illustrative. Do NOT cite a specific CAG paragraph number —
                  a fabricated citation of a real audit body is indefensible. */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {tr(
                  'In this example, a state audit report records 40% physical completion with missing culverts, while several corroborating citizen photo reports show open waterlogged ditches.',
                  'इस उदाहरण में, राज्य ऑडिट रिपोर्ट 40% वास्तविक कार्य दर्ज करती है, जबकि कई नागरिक फोटो रिपोर्टों में खुला जलभराव दिखता है।'
                )}
              </p>
              <div className="panel-citation">
                <strong>{tr('Evidence type:', 'साक्ष्य प्रकार:')}</strong>{' '}
                {tr(
                  'State performance audit + geotagged citizen reports — example, no real audit cited',
                  'राज्य ऑडिट एवं जियोटैग नागरिक रिपोर्ट — उदाहरण, कोई वास्तविक ऑडिट संदर्भित नहीं'
                )}
              </div>
            </div>
          </div>

          <div className="claim-reality-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--emerald-600)' }} />
              <span>{tr('Non-partisan presentation · Cites public documents & verified EXIF-stripped citizen submissions', 'गैर-पक्षपाती प्रस्तुति · केवल सार्वजनिक दस्तावेज एवं सत्यापित नागरिक साक्ष्य')}</span>
            </div>

            <Link to="/report-issue" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Camera size={16} />
              <span>{tr('Submit Local Evidence', 'स्थानीय साक्ष्य दर्ज करें')}</span>
            </Link>
          </div>
        </section>

        {/* 5. RECENT CITIZEN EVIDENCE STREAM */}
        <section>
          <div className="section-header-block">
            <div>
              <h2 className="section-title">
                {reportsAreSample
                  ? tr('Citizen Evidence Stream', 'नागरिक साक्ष्य स्ट्रीम')
                  : tr('Live Citizen Evidence Stream', 'लाइव नागरिक साक्ष्य स्ट्रीम')}
              </h2>
              <p className="section-desc">
                {reportsAreSample
                  ? tr(
                      'Sample records shown for demonstration — the live moderation feed is unavailable right now.',
                      'प्रदर्शन हेतु नमूना रिकॉर्ड — लाइव मॉडरेशन फ़ीड अभी उपलब्ध नहीं है।'
                    )
                  : tr(
                      'Latest ground verification photos submitted by citizens across India, reviewed by moderation.',
                      'भारत भर के नागरिकों द्वारा भेजे गए जमीनी सत्यापन चित्र, मॉडरेशन द्वारा सत्यापित।'
                    )}
              </p>
              {reportsAreSample && (
                <p
                  role="status"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--saffron-50)',
                    border: '1px solid var(--saffron-100)',
                    color: 'var(--saffron-600)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <AlertTriangle size={13} aria-hidden="true" />
                  {tr('Sample data — not citizen-verified', 'नमूना डेटा — नागरिक-सत्यापित नहीं')}
                </p>
              )}
            </div>
            <Link to="/reports" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-600)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{tr('View All Citizen Reports', 'सभी नागरिक रिपोर्टें देखें')}</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {reports.map((rep, idx) => (
              <div
                key={rep.id || idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'var(--bg-subtle)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--navy-700)',
                      }}
                    >
                      PIN {rep.pinCode || activePin}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: !reportsAreSample && rep.status === 'VERIFIED' ? 'var(--emerald-700)' : 'var(--saffron-600)',
                        background: !reportsAreSample && rep.status === 'VERIFIED' ? 'var(--emerald-50)' : 'var(--saffron-50)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-pill)',
                      }}
                    >
                      {reportsAreSample ? tr('SAMPLE', 'नमूना') : rep.status || 'UNVERIFIED'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-950)', marginBottom: '0.4rem' }}>
                    {rep.title || 'Ground Inspection Report'}
                  </h4>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    {rep.description?.substring(0, 110)}...
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} />
                    <span>{new Date(rep.createdAt || Date.now()).toLocaleDateString()}</span>
                  </span>
                  <Link to={`/reports/${rep.id}`} style={{ fontWeight: 700, color: 'var(--navy-600)' }}>
                    {tr('Details', 'विवरण')} ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
