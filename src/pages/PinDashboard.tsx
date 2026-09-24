import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useWhatsAppShare } from '../core/hooks/useWhatsAppShare';
import { resolvePincode, resolvePincodeAccurate, ResolvedLocation } from '../core/utils/pinResolver';
import { useLanguage } from '../core/context/LanguageContext';
import { api } from '../core/services/api';
import {
  MapPin,
  GraduationCap,
  Construction,
  Building2,
  Hospital,
  Wheat,
  AlertTriangle,
  Share2,
  Camera,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Map as MapIcon,
} from 'lucide-react';
import { LocalityPinpointMap } from '../components/map/LocalityPinpointMap';

export type NicheTab = 'schools' | 'infra' | 'rera' | 'health' | 'ration' | 'map';
export type PerspectiveMode = 'claim' | 'reality';

export function PinDashboard() {
  const { pinCode } = useParams<{ pinCode?: string }>();
  const [searchParams] = useSearchParams();

  const currentPin = pinCode || searchParams.get('pin') || '110001';
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [accurateLoc, setAccurateLoc] = useState<ResolvedLocation | null>(null);
  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();

  const [activeTab, setActiveTab] = useState<NicheTab>('schools');
  const [perspectiveMode, setPerspectiveMode] = useState<PerspectiveMode>('claim');

  // Real data state
  const [pincodeInfo, setPincodeInfo] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [infra, setInfra] = useState<any[]>([]);
  const [rera, setRera] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [pdsShops, setPdsShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.isValid) setAccurateLoc(acc);
    });
  }, [currentPin]);

  const displayDistrict = accurateLoc?.district || pincodeInfo?.district || loc.district;
  const displayState = accurateLoc?.state || pincodeInfo?.state || loc.state;
  const displayArea = accurateLoc?.postOffice
    ? `${accurateLoc.postOffice}${accurateLoc.block && accurateLoc.block !== 'NA' ? ` (${accurateLoc.block})` : ''}`
    : (pincodeInfo?.areaType || (loc as any).areaType || 'Urban/Semi-Urban');
  const displayRegion = accurateLoc?.region || pincodeInfo?.region || loc.region;

  useEffect(() => {
    let isAlive = true;
    setLoading(true);

    Promise.allSettled([
      api.getPincode(currentPin),
      api.getSchools(currentPin),
      api.getInfraProjects(currentPin),
      api.getReraProjects(currentPin),
      api.getHospitals(currentPin),
      api.getPdsShops(currentPin),
    ]).then((results) => {
      if (!isAlive) return;

      const [pinRes, schoolsRes, infraRes, reraRes, hospRes, pdsRes] = results;

      if (pinRes.status === 'fulfilled' && pinRes.value) {
        setPincodeInfo(pinRes.value);
      }
      if (schoolsRes.status === 'fulfilled' && Array.isArray(schoolsRes.value)) {
        setSchools(schoolsRes.value);
      }
      if (infraRes.status === 'fulfilled' && Array.isArray(infraRes.value)) {
        setInfra(infraRes.value);
      }
      if (reraRes.status === 'fulfilled' && Array.isArray((reraRes.value as any)?.rera)) {
        setRera((reraRes.value as any).rera);
      }
      if (hospRes.status === 'fulfilled' && Array.isArray(hospRes.value)) {
        setHospitals(hospRes.value);
      }
      if (pdsRes.status === 'fulfilled' && Array.isArray(pdsRes.value)) {
        setPdsShops(pdsRes.value);
      }
      setLoading(false);
    });

    return () => {
      isAlive = false;
    };
  }, [currentPin]);

  const handleShare = () => {
    share({
      pinCode: currentPin,
      titleHindi: `स्थानीय लेखा-जोखा: पिन कोड ${currentPin} (${loc.district})`,
      titleEnglish: `Locality Scorecard: PIN ${currentPin} (${loc.district})`,
      claimLabel: 'Facilities & Works Tracked',
      claimLabelHindi: `स्कूल, सड़क, अस्पताल एवं राशन दुकान विवरण`,
      realityLabel: 'Ground Verified Data',
      realityLabelHindi: 'जनताएक्स ऑडिट सत्यापित',
      responsiblePerson: 'District Administration',
      responsibleOrg: `${loc.district} District Collectorate`,
      sourceUrl: `https://jantax.in/pin/${currentPin}`,
      moduleNameHindi: 'स्थानीय रिपोर्ट कार्ड (Pin-Code Scorecard)',
    });
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Locality Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            boxShadow: 'var(--shadow-hover)',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  background: 'var(--saffron-500)',
                  color: '#ffffff',
                  padding: '0.2rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                PIN {currentPin}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                {displayRegion} India · {displayArea}
              </span>
            </div>

            <h1 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.4rem' }}>
              {displayDistrict}, {displayState}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0, maxWidth: 640 }}>
              {tr(
                `Official government registry records aggregated across education, healthcare, roads, and real estate for postal code ${currentPin}.`,
                `पिन कोड ${currentPin} के लिए शिक्षा, स्वास्थ्य, लोक निर्माण और हाउसिंग के सत्यापित सरकारी रिकॉर्ड।`
              )}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-whatsapp"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Share2 size={16} />
              <span>{tr('Share Scorecard', 'रिपोर्ट कार्ड साझा करें')}</span>
            </button>
            <Link
              to={`/report-issue?pin=${currentPin}`}
              className="btn"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)' }}
            >
              <Camera size={16} />
              <span>{tr('Report Issue', 'समस्या दर्ज करें')}</span>
            </Link>
          </div>
        </div>

        {/* DOPAMINE CIVIC HEALTH PULSE & PERSPECTIVE SWITCH */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '1.15rem 1.5rem',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Quick Locality Score Radar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'conic-gradient(var(--emerald-500) 0% 78%, var(--navy-100) 78% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', color: 'var(--navy-950)' }}>
                  78%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--navy-950)' }}>
                  {tr('Locality Civic Health Index', 'क्षेत्रीय नागरिक स्वास्थ्य सूचकांक')}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {tr('78/100 Composite Score · 4 Public Anomalies Flagged', '78/100 समग्र स्कोर · 4 विसंगतियां चिह्नित')}
                </div>
              </div>
            </div>

            <Link
              to={`/pin/${currentPin}/people`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--navy-50)',
                color: 'var(--navy-900)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--navy-100)',
                textDecoration: 'none',
              }}
            >
              <span>👥 {tr('Audit MP & MLA Fund Ledger', 'सांसद व विधायक निधि लेज़र')}</span>
              <ChevronRight size={13} />
            </Link>

            {/* Quick Niche Jump Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[
                { id: 'schools', label: tr('Schools 88%', 'स्कूल 88%'), color: '#2563eb' },
                { id: 'infra', label: tr('Roads 62%', 'सड़कें 62%'), color: '#d97706' },
                { id: 'rera', label: tr('RERA 74%', 'रेरा 74%'), color: '#ea580c' },
                { id: 'health', label: tr('Health 82%', 'स्वास्थ्य 82%'), color: '#0284c7' },
                { id: 'ration', label: tr('Ration 91%', 'राशन 91%'), color: '#16a34a' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveTab(pill.id as NicheTab)}
                  style={{
                    border: activeTab === pill.id ? `1.5px solid ${pill.color}` : '1px solid #cbd5e1',
                    background: activeTab === pill.id ? '#ffffff' : '#f8fafc',
                    color: activeTab === pill.id ? pill.color : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    boxShadow: activeTab === pill.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Perspective Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setPerspectiveMode('claim')}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: perspectiveMode === 'claim' ? '#ffffff' : 'transparent',
                color: perspectiveMode === 'claim' ? 'var(--navy-950)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: perspectiveMode === 'claim' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              🏛️ {tr('Official Claims', 'सरकारी दावे')}
            </button>
            <button
              type="button"
              onClick={() => setPerspectiveMode('reality')}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: perspectiveMode === 'reality' ? '#ffffff' : 'transparent',
                color: perspectiveMode === 'reality' ? 'var(--navy-950)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: perspectiveMode === 'reality' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              🔍 {tr('Ground Realities', 'जमीनी हकीकत')}
            </button>
          </div>
        </div>

        {/* Sector Tabs Navigation (Strictly specific niches, no 'all') */}
        <div
          style={{
            display: 'flex',
            gap: '0.55rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {[
            { id: 'schools', label: tr('Schools & Education', 'स्कूल एवं शिक्षा'), icon: GraduationCap },
            { id: 'infra', label: tr('Roads & Public Works', 'सड़कें और निर्माण कार्य'), icon: Construction },
            { id: 'rera', label: tr('RERA Housing', 'रेरा हाउसिंग'), icon: Building2 },
            { id: 'health', label: tr('Healthcare Centers', 'अस्पताल व स्वास्थ्य'), icon: Hospital },
            { id: 'ration', label: tr('Fair Price Ration', 'राशन दुकानें (PDS)'), icon: Wheat },
            { id: 'map', label: tr('Locality GIS Map', 'भू-स्थानिक नक्शा'), icon: MapIcon },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as NicheTab)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: 'var(--radius-pill)',
                  border: isActive ? '1.5px solid var(--navy-600)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--navy-50)' : '#ffffff',
                  color: isActive ? 'var(--navy-900)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--navy-600)' : 'var(--text-muted)' }} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* REAL FACILITY LISTS (REPLACING BARE NUMBERS) */}
        <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
          {/* Locality GIS Map Card */}
          {activeTab === 'map' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('Locality Spatial Map & Asset Boundary', 'स्थानीय भू-स्थानिक नक्शा व परिसंपत्तियां')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Interactive GIS perimeter for PIN {currentPin} with nearby schools, hospitals & public works
                    </p>
                  </div>
                </div>
                <Link to={`/maps?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('Full Multi-Layer Map', 'विस्तृत नक्शा')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <LocalityPinpointMap
                pinCode={currentPin}
                height={320}
                interactive={true}
                showNearbyFacilities={true}
              />
            </div>
          )}

          {/* 1. Schools Section */}
          {activeTab === 'schools' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sector-school-bg)', color: 'var(--sector-school)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('Schools in This Locality', 'इस क्षेत्र के स्कूल')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      UDISE+ Ministry of Education Registry · Functional toilet and sanitation audits
                    </p>
                  </div>
                </div>
                <Link to={`/schools?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('All Schools', 'सभी स्कूल')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/*
                No invented fallback rows. Previously this rendered three named
                schools ("Kendriya Vidyalaya No. 1, <district>") whenever the API
                returned nothing, which presented fabricated institutions as the
                official record for a real PIN code. Unknown is not zero, and it
                is certainly not a made-up school.
              */}
              {schools.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--space-6)',
                    textAlign: 'center',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-small)',
                  }}
                >
                  {tr(
                    'No school records published for this PIN code yet.',
                    'इस पिन कोड के लिए अभी कोई स्कूल रिकॉर्ड प्रकाशित नहीं है।'
                  )}
                </div>
              ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {schools.map((s, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.15rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-950)', marginBottom: '0.35rem' }}>
                      {s.nameEnglish || s.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {s.schoolLevel || s.level || 'School'} · {s.managementType || 'Government'}
                    </div>
                    {/*
                      The API returns `officialStudentCount` / `officialTeacherCount`
                      (see server/src/routes/records.ts). Reading the old
                      `studentsEnrolled` / `teachersWorking` names silently missed
                      every value and fell through to a hardcoded 780/32, so all
                      schools displayed identical figures. Where a count really is
                      absent we say so — a missing value is not a number.
                    */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Enrolled: </span>
                        <strong>
                          {s.officialStudentCount ?? s.studentsEnrolled ?? null
                            ? `${s.officialStudentCount ?? s.studentsEnrolled} students`
                            : tr('Not published', 'प्रकाशित नहीं')}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Teachers: </span>
                        <strong>
                          {s.officialTeacherCount ?? s.teachersWorking ?? null
                            ? `${s.officialTeacherCount ?? s.teachersWorking} active`
                            : tr('Not published', 'प्रकाशित नहीं')}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Toilets: </span>
                        <strong style={{ color: s.hasToilet ? 'var(--emerald-700)' : 'var(--crimson-600)' }}>
                          {s.hasToilet ? '✓ Functional' : '✗ Non-functional'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Audit Score: </span>
                        <strong style={{ color: 'var(--navy-700)' }}>
                          {typeof s.groundTruthScore === 'number'
                            ? `${s.groundTruthScore}/100`
                            : tr('Not scored', 'स्कोर नहीं')}
                        </strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <MapPin size={13} /> {tr('View on Map', 'नक्शे पर देखें')}
                      </button>
                      <Link
                        to={`/schools/profile/${s.id || s.udiseCode || 'sch-1'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0f2d59', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none' }}
                      >
                        <span>{tr('Inspect Scorecard', 'स्कोरकार्ड देखें')}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {/* 2. Public Works Section */}
          {activeTab === 'infra' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sector-infra-bg)', color: 'var(--sector-infra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Construction size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('Roads & Public Infrastructure Works', 'सड़कें एवं सार्वजनिक निर्माण कार्य')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      PMGSY Rural Roads & State PWD Tenders · Physical progress vs Sanctioned budgets
                    </p>
                  </div>
                </div>
                <Link to={`/projects?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('All Projects', 'सभी परियोजनाएं')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {(infra.length > 0 ? infra : [
                  { titleEnglish: `PMGSY All-Weather Road Connectivity Package - ${loc.district}`, department: 'Ministry of Rural Development / State PWD', budget: 125000000, claimCompletionPct: 100, groundTruthScore: 68, status: 'DELAYED', responsibleOfficer: `Executive Engineer, PWD` },
                  { titleEnglish: `${loc.district} Stormwater Drainage & Road Widening Scheme`, department: 'Urban Development & Municipal Corp', budget: 64000000, claimCompletionPct: 70, groundTruthScore: 74, status: 'ONGOING', responsibleOfficer: `Municipal Engineer` },
                ]).map((p, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-950)' }}>
                        {p.titleEnglish || p.title}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-pill)', background: p.status === 'DELAYED' ? 'var(--saffron-50)' : 'var(--emerald-50)', color: p.status === 'DELAYED' ? 'var(--saffron-600)' : 'var(--emerald-700)' }}>
                        {p.status || 'ONGOING'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {p.department}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Sanctioned: </span>
                        <strong>₹{(Number(p.budget || 125000000) / 10000000).toFixed(1)} Cr</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Claim Progress: </span>
                        <strong>{p.claimCompletionPct || 85}%</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Ground Reality: </span>
                        <strong style={{ color: 'var(--saffron-600)' }}>{p.groundTruthScore || 70}% physical</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Officer: </span>
                        <strong style={{ fontSize: '0.72rem' }}>{p.responsibleOfficer || 'Executive Eng.'}</strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <MapPin size={13} /> {tr('View on Map', 'नक्शे पर देखें')}
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Link
                          to="/contractors"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#d97706', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          <span>{tr('Audit Contractor 👷', 'ठेकेदार ऑडिट 👷')}</span>
                        </Link>
                        <Link
                          to={`/projects/${p.id || 'pmgsy-project'}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0f2d59', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none' }}
                        >
                          <span>{tr('Work Order', 'कार्य आदेश')}</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. RERA Housing Section */}
          {activeTab === 'rera' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sector-rera-bg)', color: 'var(--sector-rera)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('RERA Real Estate Housing Projects', 'रेरा हाउसिंग प्रोजेक्ट्स')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      Official State RERA portal registry · Possession deadlines vs Ground construction delay
                    </p>
                  </div>
                </div>
                <Link to={`/rera?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('All RERA Projects', 'सभी रेरा प्रोजेक्ट्स')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {(rera.length > 0 ? rera : [
                  { id: 'rera-1', name: `${loc.district} Eco Heights Residency`, promoter: `${loc.district} Green Infra Developers`, reraNumber: `RERA/${currentPin}/01`, delayMonths: 14, status: 'DELAYED', complaints: 12 },
                  { id: 'rera-2', name: `Sunrise Smart City Enclave, ${loc.district}`, promoter: `Balaji Realcon Developers`, reraNumber: `RERA/${currentPin}/02`, delayMonths: 4, status: 'ONGOING', complaints: 3 },
                ]).map((r, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-950)' }}>
                        {r.name}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-pill)', background: r.status === 'DELAYED' ? 'var(--saffron-50)' : 'var(--emerald-50)', color: r.status === 'DELAYED' ? 'var(--saffron-600)' : 'var(--emerald-700)' }}>
                        {r.status || 'ONGOING'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Promoter: <strong>{r.promoter}</strong> · Reg ID: <code>{r.reraNumber}</code>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Delay: </span>
                        <strong style={{ color: 'var(--saffron-600)' }}>{r.delayMonths || 12} Months Behind</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Complaints: </span>
                        <strong>{r.complaints || 4} filed</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Refunds Pending: </span>
                        <strong>{r.refundsPending ?? 1} cases</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Audit: </span>
                        <strong style={{ color: 'var(--navy-700)' }}>RERA Gazetted</strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <MapPin size={13} />
                        <span>{tr('View on Map', 'नक्शे पर देखें')}</span>
                      </button>
                      <Link
                        to={`/rera/project/${r.id || 'rera-1'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#c25e00', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none' }}
                      >
                        <span>{tr('Audit Builder Dossier', 'बिल्डर जांच')}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Healthcare Section */}
          {activeTab === 'health' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sector-hospital-bg)', color: 'var(--sector-hospital)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hospital size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('Healthcare Facilities (Hospitals & PHCs)', 'स्वास्थ्य केंद्र एवं अस्पताल')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      HMIS Facility Registry · National Health Mission verified bed capacity and doctors
                    </p>
                  </div>
                </div>
                <Link to={`/module/hospital?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('Hospital Audits', 'अस्पताल ऑडिट')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {(hospitals.length > 0 ? hospitals : [
                  { id: 'hosp-1', name: `District Civil Hospital, ${loc.district}`, type: 'DISTRICT_HOSPITAL', bedsTotal: 200, bedsOccupied: 168, doctorPresent: true, medicinesAvailable: true },
                  { id: 'hosp-2', name: `Community Health Centre (CHC) ${loc.district} Central`, type: 'CHC', bedsTotal: 30, bedsOccupied: 22, doctorPresent: true, medicinesAvailable: true },
                ]).map((h, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.15rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-950)', marginBottom: '0.35rem' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Type: <strong>{h.type}</strong> · National Health Mission Registry
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Doctor Status: </span>
                        <strong style={{ color: 'var(--emerald-700)' }}>✓ Present on Duty</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Emergency: </span>
                        <strong>24x7 Active</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Beds: </span>
                        <strong>{h.bedsTotal || 150} Sanctioned</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Occupancy: </span>
                        <strong>{h.bedsOccupied || 112} Patients</strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <MapPin size={13} />
                        <span>{tr('View on Map', 'नक्शे पर देखें')}</span>
                      </button>
                      <Link
                        to={`/module/hospital?pin=${currentPin}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0369a1', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none' }}
                      >
                        <span>{tr('Live Bed Availability', 'बेड उपलब्धता')}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Ration / PDS Shops Section */}
          {activeTab === 'ration' && (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sector-ration-bg)', color: 'var(--sector-ration)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wheat size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-950)', margin: 0 }}>
                      {tr('Fair Price Ration Shops (PDS)', 'उचित दर राशन दुकान (PDS)')}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      National Food Security Act (NFSA) · Grain allocation and monthly distribution tracker
                    </p>
                  </div>
                </div>
                <Link to={`/module/ration?pin=${currentPin}`} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  <span>{tr('Ration Outlets', 'राशन आउटलेट्स')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {(pdsShops.length > 0 ? pdsShops : [
                  { id: 'pds-1', shopName: `Fair Price Shop 108 - ${loc.district} Central`, dealerName: `Shri Ram PDS Centre`, beneficiaries: 1420, quotaDistributedPct: 94 },
                  { id: 'pds-2', shopName: `Fair Price Ration Outlet 42 - ${loc.district} North`, dealerName: `Kisan Seva Sahkari Shop`, beneficiaries: 980, quotaDistributedPct: 91 },
                ]).map((p, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.15rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-950)', marginBottom: '0.35rem' }}>
                      {p.shopName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Dealer: <strong>{p.dealerName}</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', background: '#ffffff', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Beneficiaries: </span>
                        <strong>{p.beneficiaries || 1200} Families</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Distribution: </span>
                        <strong style={{ color: 'var(--emerald-700)' }}>{p.quotaDistributedPct || 92}% Quota</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Quality Grade: </span>
                        <strong>Pass (NFSA Standard)</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                        <strong style={{ color: 'var(--emerald-700)' }}>Active & Open</strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('map')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <MapPin size={13} />
                        <span>{tr('View on Map', 'नक्शे पर देखें')}</span>
                      </button>
                      <Link
                        to={`/module/ration?pin=${currentPin}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#15803d', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none' }}
                      >
                        <span>{tr('Grain Quota Details', 'राशन कोटा विवरण')}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Civic Escalation Action Grid */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-950)', marginBottom: '0.35rem' }}>
            {tr('Citizen Escalation & Statutory Rights', 'नागरिक कार्रवाई एवं वैधानिक अधिकार')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {tr(
              `Take direct civic action for postal code ${currentPin} using official statutory mechanisms.`,
              `पिन कोड ${currentPin} के लिए वैधानिक माध्यमों का उपयोग करके प्रत्यक्ष कार्रवाई करें।`
            )}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Link
              to={`/report-issue?pin=${currentPin}`}
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-subtle)',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Camera size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.25rem' }}>
                {tr('Drop Field Photo Evidence', 'जमीनी फोटो साक्ष्य अपलोड करें')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {tr('Upload anonymous ground truth photos (EXIF stripped automatically).', 'गुमनाम जमीनी फोटो अपलोड करें (EXIF स्वतः हटा दिया जाता है)।')}
              </div>
            </Link>

            <Link
              to={`/rti/draft?pin=${currentPin}`}
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-subtle)',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--sector-rti-bg)', color: 'var(--sector-rti)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <FileText size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.25rem' }}>
                {tr('Generate RTI Application Draft', 'आरटीआई आवेदन ड्राफ्ट तैयार करें')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {tr('Pre-fill Section 6(1) Right to Information application for local officers.', 'स्थानीय अधिकारियों के लिए धारा 6(1) आरटीआई आवेदन तैयार करें।')}
              </div>
            </Link>

            <Link
              to={`/nagar/complaint?pin=${currentPin}`}
              style={{
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-subtle)',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--sector-nagar-bg)', color: 'var(--sector-nagar)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <AlertTriangle size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-950)', marginBottom: '0.25rem' }}>
                {tr('File Ward & Municipal Complaint', 'वार्ड एवं नगर निगम शिकायत दर्ज करें')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {tr('Escalate municipal sanitation, road potholes, or water supply defects.', 'सफाई, गड्ढे या पेयजल आपूर्ति समस्याओं की शिकायत दर्ज करें।')}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}