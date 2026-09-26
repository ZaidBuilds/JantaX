import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Home, ExternalLink, ShieldCheck, ArrowRight, Scale, RotateCcw } from 'lucide-react';
import { searchReraProjects } from '../services/reraService';

export function ReraSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [statePortal, setStatePortal] = useState('All');
  const [status, setStatus] = useState('All');
  const [projectType, setProjectType] = useState('All');
  const [sortBy, setSortBy] = useState<'delay_desc' | 'units_desc' | 'recent'>('delay_desc');

  const portals = ['All', 'MahaRERA', 'UP RERA', 'Karnataka RERA', 'Delhi RERA'];
  const statusOptions = ['All', 'Delayed', 'Extended', 'Possession Handed Over', 'Under Review'];

  const filteredProjects = useMemo(() => {
    return searchReraProjects({ query, statePortal, status, projectType, sortBy });
  }, [query, statePortal, status, projectType, sortBy]);

  return (
    <div>
      {/* Disclaimer */}
      <div style={{ background: '#fffbebf', border: '1px solid var(--warn-line)', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--warn)' }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div><strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice.</div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '0.4rem' }}>
          <Link to="/rera" style={{ color: 'var(--viz-6)', textDecoration: 'none' }}>RERA Intelligence</Link> / Search & Filter
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: 0 }}>
          RERA Projects & Builders Search Gateway
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem' }}>
        {/* Filter Sidebar */}
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.25rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1rem' }}>
            Filter RERA Database
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>Search Query</label>
            <input
              type="text"
              placeholder="Name, RERA #, Builder..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>State RERA Portal</label>
            <select value={statePortal} onChange={(e) => setStatePortal(e.target.value)} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}>
              {portals.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}>
              {statusOptions.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.35rem' }}>Sort By</label>
            <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}>
              <option value="delay_desc">Documented Delay: Highest First</option>
              <option value="units_desc">Total Housing Units: High to Low</option>
              <option value="recent">Target Date</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredProjects.map((p) => (
            <div key={p.id} style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--viz-6)', fontWeight: 700, background: 'var(--info-soft)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                    {p.statePortal} · Reg #{p.reraRegistrationNumber}
                  </span>
                  <h3 onClick={() => navigate(`/rera/projects/${p.id}`)} style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', cursor: 'pointer', margin: '0.3rem 0 0.15rem' }}>
                    {p.projectName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-3)' }}>
                    Builder: <strong>{p.builderName}</strong> · {p.locationName}
                  </div>
                </div>

                <Link to={`/rera/projects/${p.id}`} style={{ fontSize: '0.8rem', color: 'var(--viz-6)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  View Project <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
