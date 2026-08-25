import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../core/services/api';
import {
  Search,
  MapPin,
  GraduationCap,
  Construction,
  HardHat,
  Home as HomeIcon,
  Hospital,
  Wheat,
  Droplets,
  Users,
  HeartHandshake,
  ShieldCheck,
  Scale,
  Flag,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { SourceBadge } from '../components/UI/SourceBadge';

/**
 * Home — JanCheck (JantaX) landing page.
 * Rebuilt to exactly match the clean JantaX light theme UI/UX mockup design.
 */
export function Home() {
  const navigate = useNavigate();
  const { query, search } = usePinSearch();
  const [searchText, setSearchText] = useState('');
  const { selectedPin, setSelectedPin, detectLocation } = usePin();
  const { language, t: tx } = useLanguage();

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

  // All metrics are derived from the live catalog for the selected PIN — no demo numbers.
  const activePin = selectedPin;
  const resolvedLoc = resolvePincode(activePin);
  const { records: catalogRecords, error: catalogError } = useCatalog();
  const [pinCounts, setPinCounts] = useState({ schools: 0, infraProjects: 0, reraProjects: 0, hospitals: 0, pdsShops: 0, grievances: 0, citizenReports: 0 });
  const [countsLoading, setCountsLoading] = useState(true);
  const [countsError, setCountsError] = useState(false);
  useEffect(() => {
    let alive = true;
    setCountsLoading(true);
    setCountsError(false);
    api.getPincode(activePin)
      .then(info => { if (alive && info?.counts) setPinCounts(info.counts); })
      .catch(() => { if (alive) setCountsError(true); })
      .finally(() => { if (alive) setCountsLoading(false); });
    return () => { alive = false; };
  }, [activePin]);
  const pinSchools = catalogRecords.filter(record => record.moduleId === 'school' && record.location.pinCode === activePin);
  const pinProjects = catalogRecords.filter(project => project.moduleId === 'infra' && project.location.pinCode === activePin);

  const schoolAttentionCount = pinSchools.filter(record => record.status.toLowerCase().includes('attention')).length;
  const projectDelayedCount = pinProjects.filter(project => project.status.toLowerCase().includes('delay')).length;

  // Source attribution per metric (Phase 13 — provenance on every data card)
  const METRIC_SOURCES: Record<string, { type: string; name: string }> = {
    schools: { type: 'A', name: 'UDISE+' },
    publicProjects: { type: 'A', name: 'PMGSY/PWD' },
    reraProjects: { type: 'A', name: 'RERA' },
    hospitals: { type: 'A', name: 'HMIS/MoHFW' },
    citizenReports: { type: 'C', name: 'JantaX Citizens' },
    grievances: { type: 'A', name: 'CPGRAMS' },
    infraProjects: { type: 'A', name: 'PMGSY/NHAI' },
    pdsShops: { type: 'A', name: 'PDS/FCI' },
  };

  // Core selector cards (matches the 6 mockup buttons)
  const coreCards = [
    { id: 'school', name: tx('schools'), nameHi: 'स्कूल', desc: 'Check your school score & reality', descHi: 'अपने स्कूल स्कोर जांचें', icon: GraduationCap, color: '#3b82f6' },
    { id: 'infra', name: tx('publicWorks'), nameHi: 'सार्वजनिक कार्य', desc: 'Roads, parks, buildings & other projects', descHi: 'सड़कें, आँगंनों, ईमारतें और अन्य प्रोजेक्ट', icon: Construction, color: '#f59e0b' },
    { id: 'contractor', name: tx('contractors'), nameHi: 'ठेकेदार', desc: 'Who gets the work & how they perform', descHi: 'कौन काम लेता है और वे कैसे प्रदर्शित होते हैं', icon: HardHat, color: '#ef4444' },
    { id: 'rera', name: tx('reraProjects'), nameHi: 'RERA प्रोजेक्ट', desc: 'Check delays, complaints & project status', descHi: 'देरी, शिकायतें और प्रोजेक्ट स्थिति जांचें', icon: HomeIcon, color: '#06b6d4' },
    { id: 'hospital', name: tx('healthcare'), nameHi: 'स्वास्थ्य सेवा', desc: 'PHCs, CHCs & health centers', descHi: 'पीएचसी, चीएचसी और स्वास्थ्य केंद्र', icon: Hospital, color: '#ec4899' },
    { id: 'ration', name: tx('welfareSchemes'), nameHi: 'कल्याण योजना', desc: 'Benefits, status & bottlenecks', descHi: 'लाभ, स्थिति और बाधाएँ', icon: Wheat, color: '#d97706' },
  ];

  // Explore gallery cards
  const exploreCards = [
    {
      title: tx('schools') + ' vs UDISE+', titleHi: 'यूडीएईएस के खिलाफ स्कूल',
      desc: 'Check infrastructure, teachers, facilities & ground truth', descHi: 'बुनियादी ढाँचा, शिक्षक, सुविधाएं',
      badge: 'Schools', badgeHi: 'स्कूल',
      color: '#3b82f6',
      linkId: 'school',
      imgUrl: 'https://images.unsplash.com/photo-1577896851231-70ee18881754?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: tx('viewFullDashboard'), titleHi: 'प्रोजेक्ट ट्रैकर',
      desc: 'Track public works in your area. Budget, status & delays', descHi: 'आपके क्षेत्र में सार्वजनिक कार्य',
      badge: 'Public Works', badgeHi: 'सार्वजनिक कार्य',
      color: '#f59e0b',
      linkId: 'infra',
      imgUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Contractor Scorecard', titleHi: 'ठेकेदार स्कोरकार्ड',
      desc: 'See contractor performance, projects won & failure rate', descHi: 'ठेकेदार प्रदर्शन देखें',
      badge: 'Contractors', badgeHi: 'ठेकेदार',
      color: '#ef4444',
      linkId: 'contractor',
      imgUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'RERA Project Tracker', titleHi: 'RERA प्रोजेक्ट ट्रैकर',
      desc: 'Check delays, complaints, orders & refund status', descHi: 'देरी और शिकायतें जाँचें',
      badge: 'Rera', badgeHi: 'RERA',
      color: '#06b6d4',
      linkId: 'rera',
      imgUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const recentReports = [
    { id: 'r1', category: 'SCHOOL', title: 'Toilet not functional in GGSSS Mayur Vihar', place: 'Mayur Vihar, Delhi', time: '2 hrs ago', imgUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80' },
    { id: 'r2', category: 'ROAD', title: 'Big pothole outside Block A Market', place: 'Rohini, Delhi', time: '5 hrs ago', imgUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=150&q=80' },
    { id: 'r3', category: 'HEALTH', title: 'PHC closed during working hours', place: 'Narela, Delhi', time: '1 day ago', imgUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=150&q=80' }
  ];

  const trendingIssues = [
    { issue: 'Delay in MCD Drain Cleaning', count: '23 reports', status: 'High', color: '#ef4444' },
    { issue: 'Garbage not collected regularly', count: '18 reports', status: 'Medium', color: '#f97316' },
    { issue: 'Streetlight not working', count: '14 reports', status: 'Medium', color: '#f97316' },
    { issue: 'Waterlogging on main road', count: '10 reports', status: 'Low', color: '#10b981' }
  ];

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
    else navigate('/maps');
  };

  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title" style={{ lineHeight: 1.05 }}>
            India, Explained by <span className="killer-gradient-text">Where You Live.</span>
          </h2>
          <p className="hero-tagline">
            Real data. Real places. Real impact. Search any PIN code, school, builder, contractor or project — <strong style={{ color: 'var(--text-primary)' }}>see the full picture instantly.</strong>
          </p>

          {/* Search bar */}
          <form className="hero-search" onSubmit={(event) => { event.preventDefault(); submitSearch(searchText || query); }}>
            <div className="search-input-wrapper">
              <Search size={18} style={{ opacity: 0.5, marginRight: '0.75rem', flexShrink: 0 }} />
              <input
                type="text"
                aria-label={tx("searchLabel")}
                placeholder={tx("searchPlaceholder")}
                value={searchText || query}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchText(value);
                  if (/^\d{0,6}$/.test(value)) search(value);
                }}
                className="search-input-field"
              />
              <button className="location-btn-inside" type="button" onClick={handleLocate}>
                <MapPin size={15} /> {tx("useMyLocation")}
              </button>
              <button className="search-action-btn" type="submit">{tx("searchButton")}</button>
            </div>
          </form>

          {/* Popular searches */}
          <div className="popular-searches">
            <span>{tx("popularSearches")}:</span>
            {['110001', 'Bangalore Schools', 'Lodha Group', 'ABC Infra', 'RERA Projects Pune'].map(tag => (
              <span key={tag} className="search-tag-item" onClick={() => {
                setSearchText(tag);
                submitSearch(tag);
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Core Grid Cards Selector — Killer */}
          <div className="module-grid">
            {coreCards.map(card => (
              <button
                key={card.id}
                className="module-tile"
                onClick={() => navigate(`/module/${card.id}?pin=${activePin}`)}
                aria-label={`Explore ${card.name}`}
              >
                <span style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${card.color}14`, border: `1px solid ${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', color: card.color }}>
                  <card.icon size={28} strokeWidth={1.9} />
                </span>
                <span className="module-tile-name-hi">{language === 'hi' ? card.nameHi : card.name}</span>
                <span className="module-tile-desc" style={{ marginTop: '0.25rem' }}>{language === 'hi' ? card.descHi : card.desc}</span>
                <span style={{ marginTop: '0.7rem', fontSize: '0.72rem', fontWeight: 700, color: card.color, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>Explore →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Things Glance summary block */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        {catalogError && (
          <div className="surface-card" role="alert" style={{ padding: '1rem', marginBottom: '1rem', color: 'var(--status-critical)' }}>
            Civic data could not be loaded. Showing no live records.
          </div>
        )}
        <div className="summary-glance-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'inline-block', margin: 0 }}>
                {tx("tenThings")} for PIN Code {activePin}
              </h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginTop: '0.2rem' }}>
                <MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} /> {resolvedLoc.district}, {resolvedLoc.state}
                {resolvedLoc.isValid && resolvedLoc.stateCode !== '--' && (
                  <span style={{ marginLeft: '0.4rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-500)', padding: '1px 7px', borderRadius: 999, fontWeight: 800, fontSize: '0.62rem' }}>{resolvedLoc.stateCode}</span>
                )}
              </span>
            </div>
            <button className="btn btn-secondary"
              onClick={() => {
                const newPin = prompt('पिन कोड दर्ज करें (Enter PIN Code):', activePin);
                if (newPin && isValidIndianPincode(newPin)) setSelectedPin(newPin);
              }}
            >
              Change
            </button>
          </div>

          {!resolvedLoc.isValid && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '0.85rem 1rem', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              This doesn't look like a valid 6-digit Indian PIN code. Enter a valid PIN (e.g. 110001) to see live civic data.
            </div>
          )}

          {countsError && resolvedLoc.isValid && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', padding: '0.85rem 1rem', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              Live counts are temporarily unavailable. Showing catalog records only.
            </div>
          )}

          <div className="summary-grid-list">
            {[
              { icon: GraduationCap, color: '#3b82f6', key: 'schools', value: pinSchools.length, label: tx("govtSchools"), sub: `${schoolAttentionCount} ${tx("needAttention")}` },
              { icon: Construction, color: '#f59e0b', key: 'publicProjects', value: pinProjects.length, label: tx("publicProjects"), sub: `${projectDelayedCount} ${tx("delayed")}` },
              { icon: HomeIcon, color: '#06b6d4', key: 'reraProjects', value: pinCounts.reraProjects, label: 'RERA Projects', sub: `${pinCounts.reraProjects>0?'Live • RERA verified':'No live RERA'}` },
              { icon: Hospital, color: '#ec4899', key: 'hospitals', value: pinCounts.hospitals, label: 'Healthcare Centers', sub: `${pinCounts.hospitals>0?'Live • HMIS':'No PHC in mock'}` },
              { icon: Droplets, color: '#10b981', key: 'citizenReports', value: pinCounts.citizenReports, label: 'Citizen Reports', sub: `${pinCounts.citizenReports} verified` },
              { icon: Users, color: '#8b5cf6', key: 'grievances', value: pinCounts.grievances, label: 'Grievances', sub: `CPGRAMS ${pinCounts.grievances}` },
              { icon: HardHat, color: '#ef4444', key: 'infraProjects', value: pinCounts.infraProjects, label: 'Infra Tracked', sub: 'PMGSY/NHAI live' },
              { icon: HeartHandshake, color: '#d97706', key: 'pdsShops', value: pinCounts.pdsShops, label: 'Welfare Shops', sub: `PDS ${pinCounts.pdsShops} FPS` },
            ].map((m, i) => {
              const src = METRIC_SOURCES[m.key];
              const showSkeleton = countsLoading && !['schools','publicProjects'].includes(m.key);
              return (
                <div key={i} className="summary-metric-card">
                  <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${m.color}14`, border: `1px solid ${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, flexShrink: 0 }}>
                    <m.icon size={20} strokeWidth={1.9} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    {showSkeleton ? (
                      <div className="skeleton" style={{ width: 42, height: 26, borderRadius: 6, marginBottom: 4 }} />
                    ) : (
                      <div className="summary-metric-value" style={{ color: String(m.value) === '—' || m.value === 0 ? 'var(--text-muted)' : 'var(--color-primary)' }}>{m.value}</div>
                    )}
                    <div className="summary-metric-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label} <span style={{ opacity: 0.5, fontWeight: 500 }}>· {m.sub}</span></div>
                    {src && !showSkeleton && (
                      <div style={{ marginTop: 4 }}>
                        <SourceBadge sourceType={src.type} sourceName={src.name} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem' }}>
            <button className="btn btn-primary"
              onClick={() => navigate(`/module/infra?pin=${activePin}`)}
            >
              {tx("viewFullDashboard")} →
            </button>
          </div>
        </div>
      </section>

      {/* Explore section */}
      <section id="explore" className="container" style={{ marginBottom: '4rem' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-header__title" style={{ fontSize: '1.4rem' }}>{tx("exploreWhatMatters")}</h3>
          <a className="section-header__action" href="#explore">{tx("viewAll")} →</a>
        </div>

        <div className="explore-gallery-grid">
          {exploreCards.map((card, idx) => (
            <div key={idx} className="explore-image-card">
              <div className="explore-image-wrapper">
                <img src={card.imgUrl} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="explore-card-badge" style={{ background: card.color }}>{language === 'hi' ? (card.badgeHi || card.badge) : card.badge}</span>
              </div>
              <div className="explore-card-body">
                <h4 className="explore-card-title">{language === 'hi' ? (card.titleHi || card.title) : card.title}</h4>
                <p className="explore-card-desc">{language === 'hi' ? (card.descHi || card.desc) : card.desc}</p>
                <button className="explore-card-link" type="button" onClick={() => navigate(`/module/${card.linkId}?pin=${activePin}`)}>
                  Explore {card.badge} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent reports & trending issues */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>

        {/* Left Side: Recent Citizen Reports */}
        <div>
          <h3 className="section-header__title" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Recent Citizen Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentReports.map(rep => (
              <div key={rep.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1' }}>
                  <img src={rep.imgUrl} alt={rep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                    {rep.category}
                  </span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.15rem 0' }}>{rep.title}</h4>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{rep.place} · {rep.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: 'Delay in MCD Drain Cleaning' */}
        <div>
          <h3 className="section-header__title" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Trending Issues in Your Area</h3>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', opacity: 0.6 }}>
                  <th style={{ paddingBottom: '0.75rem' }}>Issue</th>
                  <th style={{ paddingBottom: '0.75rem' }}>Volume</th>
                  <th style={{ paddingBottom: '0.75rem', textAlign: 'right' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {trendingIssues.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < trendingIssues.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '0.85rem 0', fontWeight: 600 }}>{t.issue}</td>
                    <td style={{ padding: '0.85rem 0', opacity: 0.7 }}>{t.count}</td>
                    <td style={{ padding: '0.85rem 0', textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: `${t.color}15`,
                        color: t.color,
                        fontWeight: 700
                      }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* Citizen report banner */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="citizen-reporting-banner">
          <div className="reporting-content">
            <h3 className="reporting-title">Be the Eyes of Your Area</h3>
            <p className="reporting-desc">
              Report issues, share real photos & help build a better, more accountable India. Real photos of locked clinics or broken school toilets don't lie.
            </p>
            <button
              className="report-action-btn"
              onClick={() => alert('कैमरा और फोटो अपलोड विकल्प (Ground Truth Upload enabled inside M6/M7 modules).')}
            >
              + Report Now
            </button>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block', marginBottom: '0.5rem' }}>Get the JantaX App</span>
            <div className="app-download-badges">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: '38px', cursor: 'pointer' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: '38px', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="footer-badges-list">
            <span className="footer-badge-item"><ShieldCheck size={16} /> 100% Open Data</span>
            <span className="footer-badge-item"><Users size={16} /> Citizen Powered</span>
            <span className="footer-badge-item"><Scale size={16} /> Non-Partisan</span>
            <span className="footer-badge-item"><Flag size={16} /> For Every Indian</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>
            © 2024 JantaX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
