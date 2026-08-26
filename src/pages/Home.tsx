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
  ShieldCheck,
  Scale,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Building2,
  HeartPulse,
  Activity,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { useLanguage } from '../core/context/LanguageContext';
import { SourceBadge } from '../components/UI/SourceBadge';
import {
  SkeletonCard,
  ErrorState,
  NoResultsState,
  DataFreshnessBadge,
  SourceUnavailable,
  VerificationPending,
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
  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();
  const { language, t: tx } = useLanguage();

  const activePin = selectedPin;
  const resolvedLoc = resolvePincode(activePin);
  const { records: catalogRecords, error: catalogError } = useCatalog();

  const [pinCounts, setPinCounts] = useState({
    schools: 0,
    infraProjects: 0,
    reraProjects: 0,
    hospitals: 0,
    pdsShops: 0,
    grievances: 0,
    citizenReports: 0,
  });
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

  const loadPinCounts = useCallback(async () => {
    if (!activePin) {
      setCountsLoading(false);
      return;
    }
    let alive = true;
    setCountsLoading(true);
    setCountsError(false);
    try {
      const info = await api.getPincode(activePin);
      if (alive && info?.counts) {
        setPinCounts(info.counts);
        setCountsLastUpdated(new Date());
      }
    } catch {
      if (alive) setCountsError(true);
    } finally {
      if (alive) setCountsLoading(false);
    }
  }, [activePin]);

  const loadReports = useCallback(async () => {
    if (!activePin) {
      setReportsLoading(false);
      return;
    }
    let alive = true;
    setReportsLoading(true);
    setReportsError(false);
    try {
      const data = await api.getReports(activePin);
      if (alive) setReports(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch {
      if (alive) setReportsError(true);
    } finally {
      if (alive) setReportsLoading(false);
    }
  }, [activePin]);

  const loadTrendingIssues = useCallback(async () => {
    if (!activePin) {
      setIssuesLoading(false);
      return;
    }
    let alive = true;
    setIssuesLoading(true);
    setIssuesError(false);
    try {
      const data = await api.getPincode(activePin);
      if (alive) {
        const mockIssues: TrendingIssue[] =
          data.counts.grievances > 0
            ? [
                {
                  issue: 'Civic Grievances & Road Maintenance',
                  count: `${data.counts.grievances} cases`,
                  countNum: data.counts.grievances,
                  status: data.counts.grievances > 5 ? 'High' : 'Medium',
                  color: data.counts.grievances > 5 ? '#ef4444' : '#f59e0b',
                  pincode: activePin,
                },
                {
                  issue: 'Citizen Ground-Truth Reports',
                  count: `${data.counts.citizenReports} active`,
                  countNum: data.counts.citizenReports,
                  status: 'Medium',
                  color: '#f97316',
                  pincode: activePin,
                },
                {
                  issue: 'Infrastructure Projects Tracked',
                  count: `${data.counts.infraProjects} public works`,
                  countNum: data.counts.infraProjects,
                  status: 'Low',
                  color: '#10b981',
                  pincode: activePin,
                },
                {
                  issue: 'RERA Delay Disclosures',
                  count: `${data.counts.reraProjects} registered`,
                  countNum: data.counts.reraProjects,
                  status: 'Low',
                  color: '#06b6d4',
                  pincode: activePin,
                },
              ]
            : [
                {
                  issue: 'No severe civic alerts reported in this PIN',
                  count: '0 cases',
                  countNum: 0,
                  status: 'Low',
                  color: '#10b981',
                  pincode: activePin,
                },
              ];
        setIssues(mockIssues);
        setIssuesLastUpdated(new Date());
      }
    } catch {
      if (alive) setIssuesError(true);
    } finally {
      if (alive) setIssuesLoading(false);
    }
  }, [activePin]);

  useEffect(() => {
    loadPinCounts();
  }, [loadPinCounts]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    loadTrendingIssues();
  }, [loadTrendingIssues]);

  const pinSchools = catalogRecords.filter(
    (record) => record.moduleId === 'school' && record.location.pinCode === activePin
  );
  const pinProjects = catalogRecords.filter(
    (project) => project.moduleId === 'infra' && project.location.pinCode === activePin
  );
  const schoolAttentionCount = pinSchools.filter((record) =>
    record.status.toLowerCase().includes('attention')
  ).length;
  const projectDelayedCount = pinProjects.filter((project) =>
    project.status.toLowerCase().includes('delay')
  ).length;

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

  const coreModules = [
    {
      id: 'school',
      name: 'School Observatory',
      nameHi: 'स्कूल डेटा वेधशाला',
      desc: 'UDISE+ infrastructure, teacher-student ratios, sanitation & scores',
      descHi: 'स्कूल स्कोर, शिक्षक अनुपात व बुनियादी सुविधाएं',
      icon: GraduationCap,
      color: '#2563eb',
      tag: 'UDISE+ Verified',
      count: pinCounts.schools || pinSchools.length,
      metricLabel: 'Govt Schools',
    },
    {
      id: 'infra',
      name: 'Public Works & Roads',
      nameHi: 'सार्वजनिक निर्माण व सड़कें',
      desc: 'Roads, bridges, flyovers, budget spend, contractor delays & timeline',
      descHi: 'सड़कें, पुल, बजट खर्च और निर्माण स्थिति',
      icon: Construction,
      color: '#f59e0b',
      tag: 'PMGSY / NHAI',
      count: pinCounts.infraProjects || pinProjects.length,
      metricLabel: 'Works Tracked',
    },
    {
      id: 'contractor',
      name: 'Contractor Intelligence',
      nameHi: 'ठेकेदार प्रदर्शन ट्रैकर',
      desc: 'Tender awards, blacklists, delay frequencies & completion ratings',
      descHi: 'टेंडर आवंटन, ब्लैकलिस्ट व कार्य प्रदर्शन',
      icon: HardHat,
      color: '#ef4444',
      tag: 'Tender Records',
      count: 'Live',
      metricLabel: 'Performance Score',
    },
    {
      id: 'rera',
      name: 'RERA Housing Tracker',
      nameHi: 'RERA आवास व प्रोजेक्ट',
      desc: 'Builder delay records, litigation history, complaints & completion',
      descHi: 'बिल्डर देरी, शिकायतें और प्रोजेक्ट स्थिति',
      icon: Building2,
      color: '#06b6d4',
      tag: 'State RERA',
      count: pinCounts.reraProjects,
      metricLabel: 'RERA Projects',
    },
    {
      id: 'hospital',
      name: 'Healthcare & PHCs',
      nameHi: 'स्वास्थ्य केंद्र व अस्पताल',
      desc: 'PHC doctor availability, beds, diagnostics & maternal health metrics',
      descHi: 'पीएचसी, डॉक्टर उपलब्धता, बेड और जांच',
      icon: HeartPulse,
      color: '#ec4899',
      tag: 'HMIS / MoHFW',
      count: pinCounts.hospitals,
      metricLabel: 'Health Centers',
    },
    {
      id: 'ration',
      name: 'Welfare & Ration (PDS)',
      nameHi: 'राशन व कल्याण योजनाएं',
      desc: 'Fair price shop stock, distribution latency & bottleneck detection',
      descHi: 'उचित दर दुकान स्टॉक और वितरण स्थिति',
      icon: Wheat,
      color: '#10b981',
      tag: 'NFSA / FCI',
      count: pinCounts.pdsShops,
      metricLabel: 'PDS Outlets',
    },
  ];

  const handleLocate = async () => {
    const pin = await detectLocation();
    if (pin) navigate(`/pin/${pin}`);
    else navigate('/maps');
  };

  return (
    <div className="home-modern-root">
      {/* Hero Section */}
      <section className="hero-modern-section">
        <div className="hero-modern-glow" />
        <div className="container hero-container">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>India's Civic Observability & Ground-Truth Platform</span>
          </div>

          <h1 className="hero-modern-title">
            Public Infrastructure & Civic Data,{' '}
            <span className="hero-gradient-text">Decoded For Your Area.</span>
          </h1>

          <p className="hero-modern-subtitle">
            Search any Indian PIN code, govt school, road project, builder or contractor.
            Uncensored official records paired with real citizen ground verification.
          </p>

          {/* Interactive Hero Search Console */}
          <div className="hero-search-console">
            <form
              className="hero-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(searchText || query);
              }}
            >
              <div className="hero-search-input-box">
                <Search size={20} className="search-lead-icon" />
                <input
                  type="text"
                  aria-label={tx('searchLabel') || 'Search PIN, school or project'}
                  placeholder="Enter 6-digit PIN (e.g. 110001) or school, builder, road name..."
                  value={searchText || query}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchText(value);
                    if (/^\d{0,6}$/.test(value)) search(value);
                  }}
                  className="hero-input-element"
                />
              </div>

              <div className="hero-search-actions">
                <button
                  type="button"
                  className="hero-locate-btn"
                  onClick={handleLocate}
                  disabled={isDetecting}
                >
                  <MapPin size={15} />
                  <span>{isDetecting ? 'Locating…' : 'Use My Location'}</span>
                </button>

                <button type="submit" className="hero-submit-btn">
                  <span>Explore Data</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Popular Quick Chips */}
            <div className="hero-quick-chips">
              <span className="chips-label">Popular Lookups:</span>
              {[
                { label: '110001 (New Delhi)', value: '110001' },
                { label: '560001 (Bengaluru)', value: '560001' },
                { label: '400001 (Mumbai)', value: '400001' },
                { label: 'UDISE Schools', value: 'school' },
                { label: 'RERA Projects', value: 'rera' },
                { label: 'PMGSY Roads', value: 'infra' },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => {
                    setSearchText(chip.value);
                    submitSearch(chip.value);
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Platform Metrics */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <ShieldCheck size={16} className="trust-icon" />
              <span>100% Official Govt Records (UDISE+, PMGSY, RERA)</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <Users size={16} className="trust-icon" />
              <span>Citizen Verified Ground Truth</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <Scale size={16} className="trust-icon" />
              <span>Non-Partisan & Open Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bento Grid for Core Observatories */}
      <section className="bento-section">
        <div className="container">
          <div className="section-head-wrap">
            <div>
              <div className="section-eyebrow">Sector Observatories</div>
              <h2 className="section-main-title">Explore Civic Intelligence Modules</h2>
            </div>
            <p className="section-lead">
              Drill down into institutional metrics, project delays, tender awards, and facility audits.
            </p>
          </div>

          <div className="bento-grid">
            {coreModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="bento-card"
                  onClick={() => navigate(`/module/${module.id}?pin=${activePin}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && navigate(`/module/${module.id}?pin=${activePin}`)
                  }
                >
                  <div className="bento-top-row">
                    <div
                      className="bento-icon-box"
                      style={{ color: module.color, background: `${module.color}15`, borderColor: `${module.color}30` }}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <span className="bento-tag">{module.tag}</span>
                  </div>

                  <h3 className="bento-card-title">
                    {language === 'hi' ? module.nameHi : module.name}
                  </h3>
                  <p className="bento-card-desc">
                    {language === 'hi' ? module.descHi : module.desc}
                  </p>

                  <div className="bento-card-footer">
                    <div className="bento-metric">
                      <span className="bento-metric-num" style={{ color: module.color }}>
                        {countsLoading ? '—' : module.count}
                      </span>
                      <span className="bento-metric-lbl">{module.metricLabel}</span>
                    </div>
                    <span className="bento-explore-link">
                      <span>Explore</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Intelligence Telemetry Console */}
      <section className="telemetry-section">
        <div className="container">
          {catalogError && (
            <div className="error-alert-banner" role="alert">
              <AlertTriangle size={18} />
              <span>Civic telemetry data could not be fully loaded. Showing local cached records.</span>
            </div>
          )}

          <div className="telemetry-header-card">
            <div className="telemetry-info">
              <div className="telemetry-tag">Local Telemetry Console</div>
              <h2 className="telemetry-title">
                Local Intelligence for PIN Code{' '}
                <span className="telemetry-pin-badge">{activePin || 'National'}</span>
              </h2>
              {resolvedLoc.isValid && (
                <div className="telemetry-loc-meta">
                  <MapPin size={14} className="loc-meta-icon" />
                  <span>
                    {resolvedLoc.district}, {resolvedLoc.state}
                  </span>
                  {resolvedLoc.stateCode !== '--' && (
                    <span className="state-pill">{resolvedLoc.stateCode}</span>
                  )}
                </div>
              )}
            </div>

            <div className="telemetry-actions">
              {countsLastUpdated && (
                <DataFreshnessBadge lastUpdated={countsLastUpdated} variant="inline" />
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={loadPinCounts}
                disabled={countsLoading}
              >
                <RefreshCw size={14} className={countsLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const p = prompt('Enter 6-digit Indian PIN Code:', activePin);
                  if (p && isValidIndianPincode(p)) setSelectedPin(p);
                }}
              >
                Change PIN
              </button>
            </div>
          </div>

          {!resolvedLoc.isValid && activePin && (
            <div className="warning-callout">
              <AlertTriangle size={16} />
              <span>
                PIN Code {activePin} not recognized as standard Indian 6-digit PIN. Enter a valid
                PIN (e.g. 110001, 560001) for hyper-local data.
              </span>
            </div>
          )}

          {countsError && resolvedLoc.isValid && (
            <SourceUnavailable sourceName="PIN Data" onRetry={loadPinCounts} />
          )}

          {/* 8-Tile Telemetry Grid */}
          <div className="telemetry-tiles-grid">
            {[
              {
                icon: GraduationCap,
                color: '#2563eb',
                key: 'schools',
                value: countsLoading ? null : pinSchools.length || pinCounts.schools,
                label: 'Govt Schools',
                sub: `${schoolAttentionCount} need attention`,
                route: `/schools?pin=${activePin}`,
              },
              {
                icon: Construction,
                color: '#f59e0b',
                key: 'publicProjects',
                value: countsLoading ? null : pinProjects.length || pinCounts.infraProjects,
                label: 'Public Works & Roads',
                sub: `${projectDelayedCount} delayed`,
                route: `/module/infra?pin=${activePin}`,
              },
              {
                icon: Building2,
                color: '#06b6d4',
                key: 'reraProjects',
                value: countsLoading ? null : pinCounts.reraProjects,
                label: 'RERA Projects',
                sub: pinCounts.reraProjects > 0 ? 'Verified records' : '0 registered in PIN',
                route: `/module/rera?pin=${activePin}`,
              },
              {
                icon: HeartPulse,
                color: '#ec4899',
                key: 'hospitals',
                value: countsLoading ? null : pinCounts.hospitals,
                label: 'Healthcare Centers',
                sub: pinCounts.hospitals > 0 ? 'HMIS Monitored' : 'No PHC logged',
                route: `/module/hospital?pin=${activePin}`,
              },
              {
                icon: Droplets,
                color: '#10b981',
                key: 'citizenReports',
                value: countsLoading ? null : pinCounts.citizenReports,
                label: 'Citizen Ground Reports',
                sub: `${pinCounts.citizenReports} community entries`,
                route: `/reports?pin=${activePin}`,
              },
              {
                icon: Users,
                color: '#8b5cf6',
                key: 'grievances',
                value: countsLoading ? null : pinCounts.grievances,
                label: 'CPGRAMS Grievances',
                sub: `${pinCounts.grievances} public tickets`,
                route: `/module/grievance?pin=${activePin}`,
              },
              {
                icon: HardHat,
                color: '#ef4444',
                key: 'infraProjects',
                value: countsLoading ? null : pinCounts.infraProjects,
                label: 'Active Infrastructure',
                sub: 'PMGSY / NHAI live',
                route: `/module/contractor?pin=${activePin}`,
              },
              {
                icon: Wheat,
                color: '#d97706',
                key: 'pdsShops',
                value: countsLoading ? null : pinCounts.pdsShops,
                label: 'PDS Fair Price Shops',
                sub: `${pinCounts.pdsShops} ration outlets`,
                route: `/module/ration?pin=${activePin}`,
              },
            ].map((metric, i) => {
              const src = METRIC_SOURCES[metric.key];
              const Icon = metric.icon;
              return (
                <div
                  key={i}
                  className="telemetry-tile"
                  onClick={() => navigate(metric.route)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="tile-top">
                    <div
                      className="tile-icon"
                      style={{ color: metric.color, background: `${metric.color}15` }}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    {src && !countsLoading && (
                      <SourceBadge sourceType={src.type} sourceName={src.name} />
                    )}
                  </div>

                  <div className="tile-body">
                    {countsLoading ? (
                      <div className="skeleton tile-skeleton" />
                    ) : (
                      <div className="tile-number">{metric.value ?? 0}</div>
                    )}
                    <div className="tile-label">{metric.label}</div>
                    <div className="tile-sub">{metric.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reports and Trending Section */}
      <section className="feed-section">
        <div className="container feed-grid">
          {/* Recent Citizen Reports */}
          <div className="feed-column">
            <div className="feed-header">
              <div>
                <h3 className="feed-title">Recent Citizen Ground Reports</h3>
                <p className="feed-sub">Verified photos and reports filed by local residents</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/reports')}
              >
                View all →
              </button>
            </div>

            {reportsLoading ? (
              <div className="feed-stack">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} variant="default" showImage />
                ))}
              </div>
            ) : reportsError ? (
              <ErrorState
                title="Reports unavailable"
                message="Could not load recent citizen reports."
                onRetry={loadReports}
                variant="warning"
              />
            ) : reports.length === 0 ? (
              <div className="empty-feed-box">
                <CheckCircle2 size={32} className="empty-icon" />
                <div className="empty-title">No Pending Issues Logged</div>
                <div className="empty-sub">
                  Be the first citizen to log a photo or audit a public facility in PIN {activePin}.
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => navigate('/reports')}
                >
                  File First Report
                </button>
              </div>
            ) : (
              <div className="feed-stack">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="report-card-modern"
                    onClick={() => navigate('/reports')}
                  >
                    <div className="report-media-thumb">
                      {rep.mediaUrl ? (
                        <img
                          src={rep.mediaUrl}
                          alt={rep.title || rep.category}
                          className="report-img"
                        />
                      ) : (
                        <div className="report-img-fallback">
                          <AlertTriangle size={20} />
                        </div>
                      )}
                    </div>
                    <div className="report-card-body">
                      <div className="report-card-badge">{rep.category || rep.module}</div>
                      <h4 className="report-card-title">
                        {rep.title || rep.description.slice(0, 60)}
                      </h4>
                      <div className="report-meta">
                        <span>{rep.location || rep.pincode}</span>
                        <span>•</span>
                        <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <VerificationPending />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Issues in Area */}
          <div className="feed-column">
            <div className="feed-header">
              <div>
                <h3 className="feed-title">
                  <TrendingUp size={18} className="trending-icon" />
                  <span>Area Civic Pulse & Issues</span>
                </h3>
                <p className="feed-sub">Active municipal grievances & infrastructure bottlenecks</p>
              </div>
              {issuesLastUpdated && (
                <DataFreshnessBadge lastUpdated={issuesLastUpdated} variant="inline" />
              )}
            </div>

            {issuesLoading ? (
              <div className="jantax-card" style={{ padding: '1.5rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 40, marginBottom: '0.75rem' }} />
                ))}
              </div>
            ) : issuesError ? (
              <ErrorState
                title="Issues unavailable"
                message="Could not load trending issues."
                onRetry={loadTrendingIssues}
                variant="warning"
              />
            ) : (
              <div className="jantax-card table-card-wrap">
                <table className="trending-table">
                  <thead>
                    <tr>
                      <th>Civic Category</th>
                      <th>Volume</th>
                      <th style={{ textAlign: 'right' }}>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((t, idx) => (
                      <tr
                        key={idx}
                        onClick={() => navigate(`/reports?q=${encodeURIComponent(t.issue)}`)}
                      >
                        <td className="table-issue-name">{t.issue}</td>
                        <td className="table-issue-count">{t.count}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span
                            className="severity-pill"
                            style={{
                              background: `${t.color}18`,
                              color: t.color,
                              borderColor: `${t.color}35`,
                            }}
                          >
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
        </div>
      </section>

      {/* Citizen Action Hero Banner */}
      <section className="action-cta-section">
        <div className="container">
          <div className="action-cta-card">
            <div className="action-cta-content">
              <span className="action-badge">Ground-Truth Auditing</span>
              <h2 className="action-title">Be the Eyes of Your Neighborhood.</h2>
              <p className="action-desc">
                Official documents often tell half the story. Photograph locked clinics, broken
                school toilets, stalled road contracts or missing ration grain. Help create
                accountability for your community.
              </p>
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => navigate('/report-issue')}
                >
                  <Droplets size={16} />
                  <span>Report Civic Issue Now</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
                  onClick={() => navigate('/transparency/evidence')}
                >
                  <span>Evidence Standards</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="action-cta-meta">
              <div className="guarantee-box">
                <ShieldCheck size={28} className="guarantee-icon" />
                <div>
                  <div className="guarantee-title">Tamper-Proof Timestamps</div>
                  <div className="guarantee-desc">GPS & Exif verification with immutable audit logs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
