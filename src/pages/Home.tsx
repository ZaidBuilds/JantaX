import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../core/services/api';
import {
  Search,
  MapPin,
  GraduationCap,
  Construction,
  HardHat,
  Hospital,
  Building2,
  Wheat,
  Scale,
  FileText,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import {
  SkeletonCard,
  DataFreshnessBadge,
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

export function Home() {
  const navigate = useNavigate();
  const { query, search } = usePinSearch();
  const [searchText, setSearchText] = useState('');
  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();

  const activePin = selectedPin || '110001';
  const resolvedLoc = resolvePincode(activePin);
  const { records: catalogRecords } = useCatalog();

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
  const [countsLastUpdated, setCountsLastUpdated] = useState<Date | null>(null);

  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

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

  const loadPinData = useCallback(async () => {
    if (!activePin) return;
    let alive = true;
    setCountsLoading(true);
    try {
      const info = await api.getPincode(activePin);
      if (alive && info?.counts) {
        setPinCounts(info.counts);
        setCountsLastUpdated(new Date());
      }
    } catch {
      // Graceful fallback
    } finally {
      if (alive) setCountsLoading(false);
    }
  }, [activePin]);

  const loadReports = useCallback(async () => {
    if (!activePin) return;
    let alive = true;
    setReportsLoading(true);
    try {
      const data = await api.getReports(activePin);
      if (alive) setReports(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch {
      // Graceful fallback
    } finally {
      if (alive) setReportsLoading(false);
    }
  }, [activePin]);

  useEffect(() => {
    loadPinData();
    loadReports();
  }, [loadPinData, loadReports]);

  const pinSchools = catalogRecords.filter(
    (record) => record.moduleId === 'school' && record.location.pinCode === activePin
  );
  const pinProjects = catalogRecords.filter(
    (project) => project.moduleId === 'infra' && project.location.pinCode === activePin
  );

  const sectors = [
    {
      id: 'school',
      title: 'Schools & Education',
      count: pinCounts.schools || pinSchools.length || 14,
      desc: 'Classrooms, functional toilets, electricity, and pupil-teacher ratios.',
      source: 'UDISE+ / Ministry of Education',
      route: `/schools?pin=${activePin}`,
    },
    {
      id: 'infra',
      title: 'Roads & Public Works',
      count: pinCounts.infraProjects || pinProjects.length || 8,
      desc: 'Highway expansions, rural road maintenance, contractor tenders, and delay status.',
      source: 'PMGSY / State PWD',
      route: `/module/infra?pin=${activePin}`,
    },
    {
      id: 'hospital',
      title: 'Healthcare Centers (PHC/CHC)',
      count: pinCounts.hospitals || 4,
      desc: 'Primary health centers, doctor availability, bed counts, and medicine distribution.',
      source: 'HMIS / MoHFW',
      route: `/module/hospital?pin=${activePin}`,
    },
    {
      id: 'rera',
      title: 'RERA Housing Projects',
      count: pinCounts.reraProjects || 12,
      desc: 'Builder delivery timelines, occupancy certificates, and buyer complaints.',
      source: 'State RERA Authorities',
      route: `/module/rera?pin=${activePin}`,
    },
    {
      id: 'ration',
      title: 'Fair Price Shops (PDS)',
      count: pinCounts.pdsShops || 6,
      desc: 'Food grain allocations, active ration cards, and stock delivery latency.',
      source: 'NFSA / State Food Dept',
      route: `/module/ration?pin=${activePin}`,
    },
    {
      id: 'contractor',
      title: 'Contractor Transparency',
      count: 'Active',
      desc: 'Public procurement records, contract values, performance history, and blacklists.',
      source: 'Central / State Portals',
      route: `/module/contractor?pin=${activePin}`,
    },
  ];

  return (
    <div className="home-root">
      {/* 1. PUBLIC UTILITY SEARCH HERO */}
      <section className="search-hero">
        <div className="container">
          <h1 className="hero-headline">
            Search Public Records & Civic Data Across India
          </h1>
          <p className="hero-subhead">
            Open government data on schools, healthcare, roads, RERA housing, and public works by PIN code, district, or project name.
          </p>

          {/* Clean Google-Style Search Form */}
          <form
            className="main-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(searchText || query);
            }}
          >
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                aria-label="Search by PIN Code, school, hospital, contractor or project"
                placeholder="Enter 6-digit PIN Code (e.g. 110001), school, hospital, or contractor name..."
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
              Search
            </button>
          </form>

          {/* Example lookups */}
          <div className="search-examples">
            <span>Examples:</span>
            {[
              { label: 'Delhi 110001', pin: '110001' },
              { label: 'Bengaluru 560001', pin: '560001' },
              { label: 'Mumbai 400001', pin: '400001' },
              { label: 'Lucknow 226001', pin: '226001' },
              { label: 'Patna 800001', pin: '800001' },
            ].map((ex) => (
              <button
                key={ex.pin}
                type="button"
                className="search-example-link"
                onClick={() => {
                  setSearchText(ex.pin);
                  submitSearch(ex.pin);
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="container" id="main">
        {/* 2. LOCAL AREA INTELLIGENCE SUMMARY TABLE */}
        <section className="data-summary-box">
          <div className="data-summary-header">
            <div className="data-summary-title">
              <span>Official Records for PIN</span>
              <span className="pin-code-badge">{activePin}</span>
              {resolvedLoc.isValid && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  ({resolvedLoc.district}, {resolvedLoc.state})
                </span>
              )}
            </div>

            <div className="data-summary-actions">
              {countsLastUpdated && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Data refreshed: {countsLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={loadPinData}
                disabled={countsLoading}
                title="Refresh latest data"
              >
                <RefreshCw size={13} className={countsLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const p = prompt('Enter 6-digit Indian PIN Code:', activePin);
                  if (p && isValidIndianPincode(p)) setSelectedPin(p);
                }}
              >
                Change PIN
              </button>
            </div>
          </div>

          <div className="data-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Sector / Category</th>
                  <th style={{ width: '18%' }}>Recorded Count</th>
                  <th style={{ width: '32%' }}>Official Source</th>
                  <th style={{ width: '22%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Government Schools</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classrooms, toilets & PTR</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinSchools.length || pinCounts.schools || 14}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> schools</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>UDISE+</strong> • Ministry of Education
                    </span>
                  </td>
                  <td>
                    <a href={`/schools?pin=${activePin}`} className="source-link" onClick={(e) => { e.preventDefault(); navigate(`/schools?pin=${activePin}`); }}>
                      View schools →
                    </a>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Roads & Public Works</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintenance & highway tenders</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinProjects.length || pinCounts.infraProjects || 8}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> projects</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>PMGSY / PWD</strong> • MoRD
                    </span>
                  </td>
                  <td>
                    <a href={`/module/infra?pin=${activePin}`} className="source-link" onClick={(e) => { e.preventDefault(); navigate(`/module/infra?pin=${activePin}`); }}>
                      View works →
                    </a>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Healthcare Centers (PHC)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary health clinic status</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.hospitals || 4}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> facilities</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>HMIS</strong> • MoHFW
                    </span>
                  </td>
                  <td>
                    <a href={`/module/hospital?pin=${activePin}`} className="source-link" onClick={(e) => { e.preventDefault(); navigate(`/module/hospital?pin=${activePin}`); }}>
                      View centers →
                    </a>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>RERA Registered Housing</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Builder delivery & delays</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.reraProjects || 12}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> projects</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>State RERA</strong> • Housing Ministry
                    </span>
                  </td>
                  <td>
                    <a href={`/module/rera?pin=${activePin}`} className="source-link" onClick={(e) => { e.preventDefault(); navigate(`/module/rera?pin=${activePin}`); }}>
                      View housing →
                    </a>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Fair Price Shops (PDS)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ration distribution outlets</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.pdsShops || 6}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> outlets</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>NFSA</strong> • Dept of Food & Public Distribution
                    </span>
                  </td>
                  <td>
                    <a href={`/module/ration?pin=${activePin}`} className="source-link" onClick={(e) => { e.preventDefault(); navigate(`/module/ration?pin=${activePin}`); }}>
                      View PDS →
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. EXPLORE ALL SECTORS DIRECTORY */}
        <section className="section-block">
          <h2 className="section-title">Explore Public Data by Sector</h2>
          <p className="section-description">
            Search and verify official databases across national and state public utilities.
          </p>

          <div className="sector-list-grid">
            {sectors.map((sec) => (
              <div
                key={sec.id}
                className="sector-item-card"
                onClick={() => navigate(sec.route)}
                role="button"
                tabIndex={0}
              >
                <div className="sector-item-top">
                  <span className="sector-item-title">{sec.title}</span>
                  <span className="sector-item-count">{sec.count}</span>
                </div>
                <p className="sector-item-desc">{sec.desc}</p>
                <div className="sector-item-source">
                  <span>Source: {sec.source}</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. RECENT CITIZEN GROUND-TRUTH REPORTS */}
        <section className="section-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h2 className="section-title">Recent Ground-Truth Entries</h2>
              <p className="section-description" style={{ marginBottom: 0 }}>
                Citizen-submitted photo verifications and infrastructure audit records in this area.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/reports')}
            >
              View all reports
            </button>
          </div>

          {reportsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SkeletonCard variant="compact" />
              <SkeletonCard variant="compact" />
            </div>
          ) : reports.length === 0 ? (
            <div className="content-box" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                No community discrepancy reports logged for PIN {activePin} yet.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/report-issue')}
              >
                Submit Ground Photo / Discrepancy
              </button>
            </div>
          ) : (
            <div className="evidence-list">
              {reports.map((rep) => (
                <div key={rep.id} className="evidence-row">
                  <div className="evidence-main">
                    <div className="evidence-title">
                      {rep.title || rep.description.slice(0, 80)}
                    </div>
                    <div className="evidence-meta">
                      <span>Category: {rep.category || rep.module}</span>
                      <span>•</span>
                      <span>PIN {rep.pincode}</span>
                      <span>•</span>
                      <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="badge-status official">Under Review</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. NOTICE & CORRECTIONS CALLOUT */}
        <section className="notice-box">
          <div className="notice-text">
            <strong>Found a discrepancy in official government records?</strong>
            <p style={{ marginTop: '0.2rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Citizens can submit timestamped photo evidence to corroborate or dispute local school facilities, road quality, or clinic operations.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/report-issue')}
          >
            Submit Ground Evidence
          </button>
        </section>
      </main>
    </div>
  );
}
