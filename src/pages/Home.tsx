import { useState, useEffect, useCallback } from 'react';
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
  ChevronRight,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { SourceBadge } from '../components/UI/SourceBadge';
import {
  SkeletonCard,
  SkeletonMetric,
  ErrorState,
  NoResultsState,
  DataFreshnessBadge,
  StaleDataBadge,
  SourceUnavailable,
  PartialDataNotice,
  VerificationPending,
  LoadingOverlay,
} from '../components/data-states';

interface CitizenReport {
  id: string;
  pincode: string;
  module: string;
  category: string;
  title?: string;
  description: string;
  status: string;
  createdAt: string;
  mediaUrl?: string;
  location?: string;
}

interface TrendingIssue {
  issue: string;
  count: string;
  countNum: number;
  status: 'High' | 'Medium' | 'Low';
  color: string;
  pincode?: string;
}

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

  const activePin = selectedPin;
  const resolvedLoc = resolvePincode(activePin);
  const { records: catalogRecords, error: catalogError, isLoading: catalogLoading } = useCatalog();

  const [pinCounts, setPinCounts] = useState({ schools: 0, infraProjects: 0, reraProjects: 0, hospitals: 0, pdsShops: 0, grievances: 0, citizenReports: 0 });
  const [countsLoading, setCountsLoading] = useState(true);
  const [countsError, setCountsError] = useState(false);
  const [countsLastUpdated, setCountsLastUpdated] = useState<Date | null>(null);

  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(false);

  const [issues, setIssues] = useState<TrendingIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState(false);
  const [issuesLastUpdated, setIssuesLastUpdated] = useState<Date | null>(null);

  const loadPinCounts = useCallback(async () => {
    if (!activePin) { setCountsLoading(false); return; }
    let alive = true;
    setCountsLoading(true);
    setCountsError(false);
    try {
      const info = await api.getPincode(activePin);
      if (alive && info?.counts) {
        setPinCounts(info.counts);
        setCountsLastUpdated(new Date());
      }
    } catch { if (alive) setCountsError(true); }
    finally { if (alive) setCountsLoading(false); }
  }, [activePin]);

  const loadReports = useCallback(async () => {
    if (!activePin) { setReportsLoading(false); return; }
    let alive = true;
    setReportsLoading(true);
    setReportsError(false);
    try {
      const data = await api.getReports(activePin);
      if (alive) setReports(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch { if (alive) setReportsError(true); }
    finally { if (alive) setReportsLoading(false); }
  }, [activePin]);

  const loadTrendingIssues = useCallback(async () => {
    if (!activePin) { setIssuesLoading(false); return; }
    let alive = true;
    setIssuesLoading(true);
    setIssuesError(false);
    try {
      const data = await api.getPincode(activePin);
      if (alive) {
        const mockIssues: TrendingIssue[] = data.counts.grievances > 0 ? [
          { issue: 'Pending grievances in area', count: `${data.counts.grievances} cases`, countNum: data.counts.grievances, status: data.counts.grievances > 5 ? 'High' : 'Medium', color: data.counts.grievances > 5 ? '#ef4444' : '#f97316', pincode: activePin },
          { issue: 'Citizen reports awaiting review', count: `${data.counts.citizenReports} reports`, countNum: data.counts.citizenReports, status: 'Medium', color: '#f97316', pincode: activePin },
          { issue: 'Infrastructure projects tracked', count: `${data.counts.infraProjects} projects`, countNum: data.counts.infraProjects, status: 'Low', color: '#10b981', pincode: activePin },
        ] : [
          { issue: 'No active issues reported', count: '0 cases', countNum: 0, status: 'Low', color: '#10b981', pincode: activePin },
        ];
        setIssues(mockIssues);
        setIssuesLastUpdated(new Date());
      }
    } catch { if (alive) setIssuesError(true); }
    finally { if (alive) setIssuesLoading(false); }
  }, [activePin]);

  useEffect(() => { loadPinCounts(); }, [loadPinCounts]);
  useEffect(() => { loadReports(); }, [loadReports]);
  useEffect(() => { loadTrendingIssues(); }, [loadTrendingIssues]);

  const pinSchools = catalogRecords.filter(record => record.moduleId === 'school' && record.location.pinCode === activePin);
  const pinProjects = catalogRecords.filter(project => project.moduleId === 'infra' && project.location.pinCode === activePin);
  const schoolAttentionCount = pinSchools.filter(record => record.status.toLowerCase().includes('attention')).length;
  const projectDelayedCount = pinProjects.filter(project => project.status.toLowerCase().includes('delay')).length;

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

  const coreCards = [
    { id: 'school', name: tx('schools'), nameHi: 'स्कूल', desc: 'Check your school score & reality', descHi: 'अपने स्कूल स्कोर जांचें', icon: GraduationCap, color: '#3b82f6', count: pinCounts.schools || pinSchools.length },
    { id: 'infra', name: tx('publicWorks'), nameHi: 'सार्वजनिक कार्य', desc: 'Roads, parks, buildings & other projects', descHi: 'सड़कें, पार्क, इमारतें', icon: Construction, color: '#f59e0b', count: pinCounts.infraProjects || pinProjects.length },
    { id: 'contractor', name: tx('contractors'), nameHi: 'ठेकेदार', desc: 'Who gets the work & how they perform', descHi: 'ठेकेदार प्रदर्शन देखें', icon: HardHat, color: '#ef4444', count: 0 },
    { id: 'rera', name: tx('reraProjects'), nameHi: 'RERA प्रोजेक्ट', desc: 'Check delays, complaints & project status', descHi: 'देरी, शिकायतें जांचें', icon: HomeIcon, color: '#06b6d4', count: pinCounts.reraProjects },
    { id: 'hospital', name: tx('healthcare'), nameHi: 'स्वास्थ्य सेवा', desc: 'PHCs, CHCs & health centers', descHi: 'पीएचसी, सीएचसी', icon: Hospital, color: '#ec4899', count: pinCounts.hospitals },
    { id: 'ration', name: tx('welfareSchemes'), nameHi: 'कल्याण योजना', desc: 'Benefits, status & bottlenecks', descHi: 'लाभ, स्थिति', icon: Wheat, color: '#d97706', count: pinCounts.pdsShops },
  ];

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
    else navigate('/maps');
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title" style={{ lineHeight: 1.05 }}>
            India, Explained by <span className="killer-gradient-text">Where You Live.</span>
          </h2>
          <p className="hero-tagline">
            Real data. Real places. Real impact. Search any PIN code, school, builder, contractor or project — <strong style={{ color: 'var(--text-primary)' }}>see the full picture instantly.</strong>
          </p>

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

          <div className="popular-searches">
            <span>{tx("popularSearches")}:</span>
            {['110001', 'Schools Bangalore', 'DLF Builders', 'Hindustan Infra', 'RERA Mumbai'].map(tag => (
              <span key={tag} className="search-tag-item" onClick={() => { setSearchText(tag); submitSearch(tag); }}>
                {tag}
              </span>
            ))}
          </div>

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
                <span style={{ marginTop: '0.7rem', fontSize: '0.72rem', fontWeight: 700, color: card.color, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {countsLoading ? '—' : card.count} <ChevronRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '4rem' }}>
        {catalogError && (
          <div className="surface-card" role="alert" style={{ padding: '1rem', marginBottom: '1rem', color: 'var(--status-critical)' }}>
            <AlertTriangle size={16} style={{ marginRight: '0.5rem', verticalAlign: '-3px' }} />
            Civic data could not be loaded. Showing available catalog records.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'inline-block', margin: 0 }}>
              {tx("tenThings")} for PIN Code {activePin || '—'}
            </h3>
            {resolvedLoc.isValid && (
              <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginTop: '0.2rem' }}>
                <MapPin size={12} style={{ verticalAlign: '-2px', marginRight: '0.2rem' }} /> {resolvedLoc.district}, {resolvedLoc.state}
                {resolvedLoc.stateCode !== '--' && (
                  <span style={{ marginLeft: '0.4rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-500)', padding: '1px 7px', borderRadius: 999, fontWeight: 800, fontSize: '0.62rem' }}>{resolvedLoc.stateCode}</span>
                )}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {countsLastUpdated && <DataFreshnessBadge lastUpdated={countsLastUpdated} variant="inline" />}
            <button className="btn btn-secondary" onClick={loadPinCounts} disabled={countsLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RefreshCw size={14} className={countsLoading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button className="btn btn-secondary" onClick={() => { const p = prompt('Enter PIN Code:', activePin); if (p && isValidIndianPincode(p)) setSelectedPin(p); }}>
              Change
            </button>
          </div>
        </div>

        {!resolvedLoc.isValid && activePin && (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '0.85rem 1rem', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <AlertTriangle size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} />
            This doesn't look like a valid 6-digit Indian PIN code. Enter a valid PIN (e.g. 110001) to see live civic data.
          </div>
        )}

        {countsError && resolvedLoc.isValid && (
          <SourceUnavailable sourceName="PIN Data" onRetry={loadPinCounts} />
        )}

        <div className="summary-grid-list">
          {[
            { icon: GraduationCap, color: '#3b82f6', key: 'schools', value: countsLoading ? null : (pinSchools.length || pinCounts.schools), label: tx("govtSchools"), sub: `${schoolAttentionCount} ${tx("needAttention")}` },
            { icon: Construction, color: '#f59e0b', key: 'publicProjects', value: countsLoading ? null : (pinProjects.length || pinCounts.infraProjects), label: tx("publicProjects"), sub: `${projectDelayedCount} ${tx("delayed")}` },
            { icon: HomeIcon, color: '#06b6d4', key: 'reraProjects', value: countsLoading ? null : pinCounts.reraProjects, label: 'RERA Projects', sub: pinCounts.reraProjects > 0 ? 'Live • RERA verified' : 'No live RERA' },
            { icon: Hospital, color: '#ec4899', key: 'hospitals', value: countsLoading ? null : pinCounts.hospitals, label: 'Healthcare Centers', sub: pinCounts.hospitals > 0 ? 'Live • HMIS' : 'No PHC in area' },
            { icon: Droplets, color: '#10b981', key: 'citizenReports', value: countsLoading ? null : pinCounts.citizenReports, label: 'Citizen Reports', sub: `${pinCounts.citizenReports} verified` },
            { icon: Users, color: '#8b5cf6', key: 'grievances', value: countsLoading ? null : pinCounts.grievances, label: 'Grievances', sub: `CPGRAMS ${pinCounts.grievances}` },
            { icon: HardHat, color: '#ef4444', key: 'infraProjects', value: countsLoading ? null : pinCounts.infraProjects, label: 'Infra Tracked', sub: 'PMGSY/NHAI live' },
            { icon: HeartHandshake, color: '#d97706', key: 'pdsShops', value: countsLoading ? null : pinCounts.pdsShops, label: 'Welfare Shops', sub: `PDS ${pinCounts.pdsShops} FPS` },
          ].map((m, i) => {
            const src = METRIC_SOURCES[m.key];
            const isLoading = countsLoading;
            return (
              <div key={i} className="summary-metric-card">
                <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${m.color}14`, border: `1px solid ${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, flexShrink: 0 }}>
                  <m.icon size={20} strokeWidth={1.9} />
                </span>
                <div style={{ minWidth: 0 }}>
                  {isLoading ? (
                    <div className="skeleton" style={{ width: 42, height: 26, borderRadius: 6, marginBottom: 4 }} />
                  ) : (
                    <div className="summary-metric-value" style={{ color: m.value === 0 ? 'var(--text-muted)' : 'var(--color-primary)' }}>
                      {m.value}
                    </div>
                  )}
                  <div className="summary-metric-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.label} <span style={{ opacity: 0.5, fontWeight: 500 }}>· {m.sub}</span>
                  </div>
                  {src && !isLoading && (
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
          <button className="btn btn-primary" onClick={() => navigate(`/module/infra?pin=${activePin}`)}>
            {tx("viewFullDashboard")} →
          </button>
        </div>
      </section>

      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="section-header__title" style={{ fontSize: '1.3rem', margin: 0 }}>Recent Citizen Reports</h3>
            {reports.length > 0 && (
              <button className="btn btn-secondary" onClick={() => navigate('/reports')} style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                View all →
              </button>
            )}
          </div>

          {reportsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} variant="default" showImage />)}
            </div>
          ) : reportsError ? (
            <ErrorState
              title="Reports unavailable"
              message="Could not load recent citizen reports."
              onRetry={loadReports}
              variant="warning"
            />
          ) : reports.length === 0 ? (
            <NoResultsState
              query={`PIN ${activePin}`}
              onClear={() => navigate('/reports')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.map(rep => (
                <div key={rep.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/reports')}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1', flexShrink: 0 }}>
                    {rep.mediaUrl ? (
                      <img src={rep.mediaUrl} alt={rep.title || rep.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <AlertTriangle size={24} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                      {rep.category || rep.module}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.15rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.title || rep.description.slice(0, 50)}
                    </h4>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                      {rep.location || rep.pincode} · {new Date(rep.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <VerificationPending />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="section-header__title" style={{ fontSize: '1.3rem', margin: 0 }}>
              <TrendingUp size={18} style={{ verticalAlign: '-3px', marginRight: '0.4rem' }} />
              Trending Issues in Your Area
            </h3>
            {issuesLastUpdated && (
              <DataFreshnessBadge lastUpdated={issuesLastUpdated} variant="inline" />
            )}
          </div>

          {issuesLoading ? (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                  <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 16, width: '20%', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : issuesError ? (
            <ErrorState
              title="Issues unavailable"
              message="Could not load trending issues."
              onRetry={loadTrendingIssues}
              variant="warning"
            />
          ) : issues.length === 0 ? (
            <NoResultsState query="trending issues" />
          ) : (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ paddingBottom: '0.75rem', opacity: 0.6, fontWeight: 600 }}>Issue</th>
                    <th style={{ paddingBottom: '0.75rem', opacity: 0.6, fontWeight: 600 }}>Volume</th>
                    <th style={{ paddingBottom: '0.75rem', textAlign: 'right', opacity: 0.6, fontWeight: 600 }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < issues.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }} onClick={() => navigate('/reports')}>
                      <td style={{ padding: '0.85rem 0', fontWeight: 600 }}>{t.issue}</td>
                      <td style={{ padding: '0.85rem 0', opacity: 0.7 }}>{t.count}</td>
                      <td style={{ padding: '0.85rem 0', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${t.color}15`,
                          color: t.color,
                          fontWeight: 700,
                        }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="citizen-reporting-banner">
          <div className="reporting-content">
            <h3 className="reporting-title">Be the Eyes of Your Area</h3>
            <p className="reporting-desc">
              Report issues, share real photos & help build a better, more accountable India. Real photos of locked clinics or broken school toilets don't lie.
            </p>
            <button className="report-action-btn" onClick={() => navigate('/report')}>
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

      <footer className="home-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="footer-badges-list">
            <span className="footer-badge-item"><ShieldCheck size={16} /> 100% Open Data</span>
            <span className="footer-badge-item"><Users size={16} /> Citizen Powered</span>
            <span className="footer-badge-item"><Scale size={16} /> Non-Partisan</span>
            <span className="footer-badge-item"><Flag size={16} /> For Every Indian</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>© 2024 JantaX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
