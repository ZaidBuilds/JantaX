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
  Flame,
  Droplets,
  Users,
  Compass,
} from 'lucide-react';
import { usePinSearch } from '../core/hooks/usePinSearch';
import { useCatalog } from '../core/hooks/useCatalog';
import { isValidIndianPincode, resolvePincode } from '../core/utils/pinResolver';
import { usePin } from '../core/context/PinContext';
import { MOCK_CITIZEN_REPORTS } from '../modules/reporting/data/mockReports';

export function Home() {
  const navigate = useNavigate();
  const { query, search } = usePinSearch();
  const [searchText, setSearchText] = useState('');
  const { selectedPin, setSelectedPin, detectLocation, isDetecting } = usePin();

  const activePin = selectedPin || '110001';
  const resolvedLoc = resolvePincode(activePin);
  const { records: catalogRecords } = useCatalog();

  const [pinCounts, setPinCounts] = useState({
    schools: 14,
    infraProjects: 8,
    reraProjects: 12,
    hospitals: 4,
    pdsShops: 6,
    grievances: 5,
    citizenReports: 3,
  });
  const [countsLoading, setCountsLoading] = useState(false);
  const [countsLastUpdated, setCountsLastUpdated] = useState<Date | null>(new Date());

  const [reports, setReports] = useState<any[]>(MOCK_CITIZEN_REPORTS.slice(0, 4));
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
        setPinCounts({
          schools: info.counts.schools || 14,
          infraProjects: info.counts.infraProjects || 8,
          reraProjects: info.counts.reraProjects || 12,
          hospitals: info.counts.hospitals || 4,
          pdsShops: info.counts.pdsShops || 6,
          grievances: info.counts.grievances || 5,
          citizenReports: info.counts.citizenReports || 3,
        });
        setCountsLastUpdated(new Date());
      }
    } catch {
      // Retain fallback numbers
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
      if (alive && Array.isArray(data) && data.length > 0) {
        setReports(data.slice(0, 4));
      } else {
        setReports(MOCK_CITIZEN_REPORTS.slice(0, 4));
      }
    } catch {
      setReports(MOCK_CITIZEN_REPORTS.slice(0, 4));
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
      count: `${pinCounts.schools} schools`,
      desc: 'Classroom infrastructure, functional toilets, electricity, and pupil-teacher ratios.',
      source: 'UDISE+ / Ministry of Education',
      route: `/schools?pin=${activePin}`,
    },
    {
      id: 'infra',
      title: 'Roads & Public Works',
      count: `${pinCounts.infraProjects} projects`,
      desc: 'Highway expansions, rural road maintenance, contractor tenders, and completion delays.',
      source: 'PMGSY / State PWD',
      route: `/module/infra?pin=${activePin}`,
    },
    {
      id: 'hospital',
      title: 'Healthcare Centers (PHC/CHC)',
      count: `${pinCounts.hospitals} centers`,
      desc: 'Primary health centers, doctor availability, bed counts, and medicine distribution.',
      source: 'HMIS / MoHFW',
      route: `/module/hospital?pin=${activePin}`,
    },
    {
      id: 'rera',
      title: 'RERA Housing Projects',
      count: `${pinCounts.reraProjects} projects`,
      desc: 'Builder delivery timelines, occupancy certificates, and buyer complaints.',
      source: 'State RERA Authorities',
      route: `/module/rera?pin=${activePin}`,
    },
    {
      id: 'ration',
      title: 'Fair Price Shops (PDS)',
      count: `${pinCounts.pdsShops} outlets`,
      desc: 'Food grain allocations, active ration cards, and stock delivery latency.',
      source: 'NFSA / State Food Dept',
      route: `/module/ration?pin=${activePin}`,
    },
    {
      id: 'contractor',
      title: 'Contractor Transparency',
      count: 'Active Ledger',
      desc: 'Public procurement records, contract values, performance history, and blacklists.',
      source: 'Central / State Portals',
      route: `/module/contractor?pin=${activePin}`,
    },
    {
      id: 'courts',
      title: 'Courts & Case Filings (CNR)',
      count: 'District Courts',
      desc: 'Case pendency, daily cause lists, disposal rates, and judicial tracking.',
      source: 'eCourts Services / NJDG',
      route: `/module/courts?pin=${activePin}`,
    },
    {
      id: 'rti',
      title: 'RTI & Public Filings',
      count: 'CPIO Clock',
      desc: 'Right to Information appeal response times, draft templates, and disclosures.',
      source: 'Central Information Commission',
      route: `/module/rti?pin=${activePin}`,
    },
    {
      id: 'grievance',
      title: 'Public Grievances (CPGRAMS)',
      count: `${pinCounts.grievances} tickets`,
      desc: 'Departmental resolution speed, pending citizen complaints, and disposal latency.',
      source: 'DARPG / CPGRAMS',
      route: `/module/grievance?pin=${activePin}`,
    },
    {
      id: 'pollution',
      title: 'Air Quality & Pollution (AQI)',
      count: 'Live Stations',
      desc: 'Real-time particulate matter (PM2.5 / PM10), station sensors, and GRAP stages.',
      source: 'CPCB / State PCBs',
      route: `/module/pollution?pin=${activePin}`,
    },
    {
      id: 'nagar',
      title: 'Ward & Municipal Services',
      count: 'Local Body',
      desc: 'Sanitation, streetlights, property tax rates, and councillor contact ledger.',
      source: 'State Urban Dev Depts',
      route: `/module/nagar?pin=${activePin}`,
    },
    {
      id: 'mplads',
      title: 'MPLADS Fund Tracker',
      count: 'Constituency',
      desc: 'Parliamentarian fund allocation, recommended works, and unspent balances.',
      source: 'MoSPI / MPLADS Portal',
      route: `/module/mplads?pin=${activePin}`,
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

          {/* Clean Search Form */}
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
              Search Records
            </button>
          </form>

          {/* Example lookups */}
          <div className="search-examples">
            <span>Examples:</span>
            {[
              { label: 'Delhi (110001)', pin: '110001' },
              { label: 'Bengaluru (560001)', pin: '560001' },
              { label: 'Mumbai (400001)', pin: '400001' },
              { label: 'Lucknow (226001)', pin: '226001' },
              { label: 'Patna (800001)', pin: '800001' },
              { label: 'Hyderabad (500001)', pin: '500001' },
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
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.schools}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> schools</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>UDISE+</strong> • Ministry of Education
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="source-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => navigate(`/schools?pin=${activePin}`)}
                    >
                      View schools →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Roads & Public Works</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintenance & highway tenders</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.infraProjects}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> projects</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>PMGSY / PWD</strong> • MoRD
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="source-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => navigate(`/module/infra?pin=${activePin}`)}
                    >
                      View works →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Healthcare Centers (PHC)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary health clinic status</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.hospitals}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> facilities</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>HMIS</strong> • MoHFW
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="source-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => navigate(`/module/hospital?pin=${activePin}`)}
                    >
                      View centers →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>RERA Registered Housing</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Builder delivery & delays</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.reraProjects}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> projects</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>State RERA</strong> • Housing Ministry
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="source-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => navigate(`/module/rera?pin=${activePin}`)}
                    >
                      View housing →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Fair Price Shops (PDS)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ration distribution outlets</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{countsLoading ? '...' : pinCounts.pdsShops}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> outlets</span>
                  </td>
                  <td>
                    <span className="source-tag">
                      <strong>NFSA</strong> • Dept of Food & Public Distribution
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="source-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => navigate(`/module/ration?pin=${activePin}`)}
                    >
                      View PDS →
                    </button>
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
                Citizen-submitted photo verifications and infrastructure audit records.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/reports')}
            >
              View all reports →
            </button>
          </div>

          <div className="evidence-list">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="evidence-row"
                onClick={() => navigate(`/reports/${rep.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="evidence-main">
                  <div className="evidence-title">
                    {rep.title || rep.description.slice(0, 80)}
                  </div>
                  <div className="evidence-meta">
                    <span>Category: {rep.category || rep.module}</span>
                    <span>•</span>
                    <span>PIN {rep.location?.pinCode || rep.pincode || activePin}</span>
                    <span>•</span>
                    <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="badge-status official">
                  {rep.moderationState || rep.status || 'Verified'}
                </span>
              </div>
            ))}
          </div>
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
