import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { searchProjects } from '../services/projectService';
import type { NeutralStatus } from '../types/projectInfra';

export function ProjectsSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter values from URL or defaults
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [pinCode, setPinCode] = useState(searchParams.get('pin') || '');
  const [state, setState] = useState(searchParams.get('state') || 'All');
  const [sector, setSector] = useState(searchParams.get('sector') || 'All');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'All');
  const [contractor, setContractor] = useState(searchParams.get('contractor') || 'All');
  const [authority, setAuthority] = useState(searchParams.get('authority') || 'All');
  const [sortBy, setSortBy] = useState<'budget_desc' | 'budget_asc' | 'progress_desc' | 'progress_asc' | 'recent'>('budget_desc');

  const states = ['All', 'Delhi', 'Uttar Pradesh', 'Karnataka', 'Maharashtra'];
  const sectors = ['All', 'Roads & Highways', 'Urban Transit', 'Water & Sewage', 'Bridges & Culverts', 'Power & Energy'];
  const statuses: Array<'All' | NeutralStatus> = ['All', 'Delayed', 'Extended', 'Incomplete', 'Under Review', 'Completed', 'Verified'];
  const contractors = ['All', 'Larsen & Toubro', 'NCC', 'Afcons', 'Chaudhary Road Builders', 'VA Tech Wabag'];
  const authorities = ['All', 'PWD', 'BMRCL', 'BMC', 'UP Jal Nigam', 'NMCG', 'NHAI'];

  // Query results from project service
  const filteredProjects = useMemo(() => {
    return searchProjects({
      query,
      pinCode,
      state,
      sector,
      status,
      contractor,
      authority,
      sortBy
    });
  }, [query, pinCode, state, sector, status, contractor, authority, sortBy]);

  const handleReset = () => {
    setQuery('');
    setPinCode('');
    setState('All');
    setSector('All');
    setStatus('All');
    setContractor('All');
    setAuthority('All');
    setSortBy('budget_desc');
    setSearchParams({});
  };

  const getStatusBadgeStyle = (st: NeutralStatus) => {
    switch (st) {
      case 'Completed':
      case 'Verified':
        return { bg: 'var(--good-soft)', border: 'var(--good-line)', color: 'var(--good)', icon: <CheckCircle2 size={13} /> };
      case 'Extended':
      case 'Delayed':
        return { bg: '#fffbebf', border: 'var(--warn-line)', color: 'var(--warn)', icon: <Clock size={13} /> };
      case 'Incomplete':
        return { bg: 'var(--bad-soft)', border: 'var(--bad-line)', color: 'var(--bad)', icon: <Clock size={13} /> };
      case 'Under Review':
      default:
        return { bg: 'var(--brand-soft)', border: 'var(--brand-line)', color: 'var(--brand-ink)', icon: <ShieldCheck size={13} /> };
    }
  };

  return (
    <div>
      {/* Top Search Breadcrumb Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '0.4rem' }}>
          <Link to="/projects" style={{ color: 'var(--brand-ink)', textDecoration: 'none' }}>Projects Directory</Link> / Search & Filter
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: 0 }}>
          Infrastructure Projects Search Gateway
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>
          Filter tenders, work orders, contractors, authorities, and status metrics with neutral source attribution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem' }}>
        {/* Filters Sidebar */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(15,23,42,0.03)',
          alignSelf: 'start'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--accent-ink)' }} /> Filter Projects
            </h2>
            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-3)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>

          {/* Search Query Filter */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Keyword Search
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--ink-4)' }} />
              <input
                type="text"
                placeholder="Name, tender ID, contractor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.3rem',
                  borderRadius: 10,
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* PIN Code Filter */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              PIN Code Filter
            </label>
            <input
              type="text"
              placeholder="e.g. 110001, 250401..."
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* State Dropdown */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              State / UT
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Sector Dropdown */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Infrastructure Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Status Neutral Filter */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Status (Neutral Categories)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Contractor Filter */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Lead Contractor
            </label>
            <select
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              {contractors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Authority Filter */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Implementing Authority
            </label>
            <select
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              {authorities.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                outline: 'none',
                background: 'var(--surface)'
              }}
            >
              <option value="budget_desc">Budget Cost: High to Low</option>
              <option value="budget_asc">Budget Cost: Low to High</option>
              <option value="progress_desc">Physical Progress: Highest First</option>
              <option value="progress_asc">Physical Progress: Lowest First</option>
              <option value="recent">Most Recently Started</option>
            </select>
          </div>
        </div>

        {/* Results Column */}
        <div>
          {/* Header Row for Results */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            background: 'var(--surface)',
            padding: '0.85rem 1.25rem',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>
              Found <span style={{ color: 'var(--accent-ink)' }}>{filteredProjects.length}</span> matching infrastructure projects
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
              Official Sources Connected
            </div>
          </div>

          {/* Projects Results */}
          {filteredProjects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: 'var(--surface)',
              borderRadius: 16,
              border: '1px dashed var(--border-strong)'
            }}>
              <Search size={36} style={{ color: 'var(--ink-4)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>No matching public works found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>
                Try relaxing search filters or clearing the keyword input.
              </p>
              <button
                onClick={handleReset}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1.2rem',
                  borderRadius: 10,
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border-strong)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  color: 'var(--ink-2)'
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {filteredProjects.map((proj) => {
                const badgeStyle = getStatusBadgeStyle(proj.status);
                const origCr = (proj.budgetOriginalLakhs / 100).toFixed(1);
                const antCr = (proj.budgetAnticipatedLakhs / 100).toFixed(1);

                return (
                  <div
                    key={proj.id}
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 16,
                      border: '1px solid var(--border)',
                      padding: '1.35rem',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                          <span style={{
                            background: badgeStyle.bg,
                            border: `1px solid ${badgeStyle.border}`,
                            color: badgeStyle.color,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.18rem 0.6rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {badgeStyle.icon} {proj.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--ink-2)', fontWeight: 600, background: 'var(--surface-3)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                            {proj.sector}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                            <MapPin size={12} style={{ color: 'var(--accent-ink)' }} /> PIN {proj.pinCode} · {proj.district}, {proj.state}
                          </span>
                        </div>

                        <h3
                          onClick={() => navigate(`/projects/${proj.id}`)}
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: 'var(--ink)',
                            cursor: 'pointer',
                            margin: 0
                          }}
                        >
                          {proj.nameEnglish}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginTop: '0.15rem' }}>
                          {proj.nameHindi}
                        </div>
                      </div>

                      <a
                        href={proj.originalSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.72rem',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span>Source</span> <ExternalLink size={11} />
                      </a>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                      background: 'var(--surface-2)',
                      padding: '0.85rem 1rem',
                      borderRadius: 10,
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Contractor</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>{proj.leadContractor}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Implementing Authority</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>{proj.implementingAgency}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Budget (Sanctioned → Anticipated)</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--ink)' }}>₹{origCr} Cr → ₹{antCr} Cr</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--ink-2)', fontWeight: 600 }}>
                        <span>Physical: <strong style={{ color: 'var(--good)' }}>{proj.progressPhysical}%</strong></span>
                        <span>Financial: <strong style={{ color: 'var(--viz-4)' }}>{proj.progressFinancial}%</strong></span>
                        <span>Tenders: <strong style={{ color: 'var(--ink)' }}>{proj.tenders.length}</strong></span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          to={`/projects/${proj.id}/timeline`}
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--brand-ink)',
                            background: 'var(--brand-soft)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: 6,
                            textDecoration: 'none'
                          }}
                        >
                          Timeline
                        </Link>
                        <Link
                          to={`/projects/${proj.id}/financials`}
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--brand-ink)',
                            background: 'var(--brand-soft)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: 6,
                            textDecoration: 'none'
                          }}
                        >
                          Financials
                        </Link>
                        <Link
                          to={`/projects/${proj.id}`}
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--on-solid)',
                            background: 'var(--accent-solid)',
                            padding: '0.3rem 0.75rem',
                            borderRadius: 6,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          Details <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
