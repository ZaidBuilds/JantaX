import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Scale,
  Layers,
  BarChart3
} from 'lucide-react';
import { getStoredReraProjects } from '../services/reraService';
import type { ReraProject } from '../types/reraIntelligence';

export function ReraDirectoryPage() {
  const navigate = useNavigate();
  const [projects] = useState<ReraProject[]>(() => getStoredReraProjects());
  const [selectedPortal, setSelectedPortal] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const portals = ['All', 'MahaRERA', 'UP RERA', 'Karnataka RERA', 'Delhi RERA'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedPortal !== 'All' && !p.statePortal.toLowerCase().includes(selectedPortal.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.reraRegistrationNumber.toLowerCase().includes(q) ||
          p.builderName.toLowerCase().includes(q) ||
          p.pinCode.includes(q) ||
          p.locationName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, selectedPortal, searchQuery]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalUnits = projects.reduce((acc, p) => acc + p.totalUnits, 0);
    const totalOrders = projects.reduce((acc, p) => acc + p.orders.length, 0);
    const delayedCount = projects.filter((p) => p.status === 'Delayed' || p.status === 'Extended').length;

    return { totalProjects, totalUnits: totalUnits.toLocaleString(), totalOrders, delayedCount };
  }, [projects]);

  return (
    <div>
      {/* Non-Legal Advice Disclaimer Banner */}
      <div style={{
        background: '#fffbebf',
        border: '1px solid var(--warn-line)',
        borderRadius: 12,
        padding: '0.75rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.84rem',
        color: 'var(--warn)'
      }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice. All adjudications are sourced directly from competent State RERA Authorities.
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="card card-pad module-toolbar">
{/* Quick Search & Compare Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 740 }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search RERA Reg #, Project Name, Builder, PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: '0.9rem',
                outline: 'none',
                backdropFilter: 'blur(8px)'
              }}
            />
          </div>
          <Link
            to="/rera/search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: 12,
              background: 'var(--brand)',
              color: 'var(--on-solid)',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
            }}
          >
            <Filter size={16} /> Advanced RERA Search
          </Link>
          <Link
            to="/rera/compare"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.2rem',
              borderRadius: 12,
              background: 'var(--viz-6)',
              color: 'var(--on-solid)',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none'
            }}
          >
            <BarChart3 size={16} /> Compare Projects
          </Link>
        </div>
</div>

      {/* Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>RERA Projects Tracked</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>{stats.totalProjects}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>State RERA Portals</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Housing Units Tracked</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--viz-6)', marginTop: '0.2rem' }}>{stats.totalUnits}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Allottee Inventory</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Documented Schedule Adjustments</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warn)', marginTop: '0.2rem' }}>{stats.delayedCount}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Extended / Delayed Projects</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>RERA Tribunal Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>{stats.totalOrders}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Official Adjudications</div>
        </div>
      </div>

      {/* State Portal Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-3)', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
          State RERA Portal:
        </span>
        {portals.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPortal(p)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: selectedPortal === p ? '1px solid var(--viz-6)' : '1px solid var(--border)',
              background: selectedPortal === p ? 'var(--info-soft)' : 'var(--surface)',
              color: selectedPortal === p ? 'var(--viz-6)' : 'var(--ink-2)',
              fontWeight: selectedPortal === p ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--surface)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  {/* Provenance Badge */}
                  <span style={{
                    background: 'var(--info-soft)',
                    border: '1px solid #a5f3fc',
                    color: 'var(--viz-6)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.6rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <ShieldCheck size={12} /> {p.statusProvenances.officialStatus}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                    {p.statePortal} · Reg #{p.reraRegistrationNumber}
                  </span>
                </div>

                <h3
                  onClick={() => navigate(`/rera/projects/${p.id}`)}
                  style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink)', cursor: 'pointer', margin: 0 }}
                >
                  {p.projectName}
                </h3>
                <div style={{ fontSize: '0.88rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
                  Promoter: <strong style={{ color: 'var(--ink)' }}>{p.builderName}</strong> · {p.locationName}, {p.district} (PIN {p.pinCode})
                </div>
              </div>

              <a
                href={p.originalSource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.74rem',
                  color: 'var(--ink)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                View RERA Register <ExternalLink size={12} />
              </a>
            </div>

            {/* Project Metrics Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
              background: 'var(--surface-2)',
              padding: '0.85rem 1.1rem',
              borderRadius: 12,
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Promised Completion</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>{p.promisedCompletionDate}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Revised Completion</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-ink)' }}>{p.revisedCompletionDate}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Documented Delay</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: p.documentedDelayMonths > 0 ? 'var(--warn)' : 'var(--good)' }}>
                  {p.documentedDelayMonths} Months
                  <span style={{ fontSize: '0.68rem', background: 'var(--info-soft)', color: 'var(--viz-6)', padding: '1px 4px', borderRadius: 4, marginLeft: 4 }}>
                    {p.statusProvenances.delayCalculation}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>RERA Orders</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>{p.orders.length} Adjudication(s)</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Link
                  to={`/rera/projects/${p.id}`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'var(--brand-soft)', color: 'var(--brand-ink)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Project Overview
                </Link>
                <Link
                  to={`/rera/projects/${p.id}/orders`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--ink-2)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  RERA Tribunal Orders ({p.orders.length})
                </Link>
                <Link
                  to={`/rera/builders/${p.builderId}`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--ink-2)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Builder Track Record
                </Link>
              </div>

              <button
                onClick={() => navigate(`/rera/projects/${p.id}`)}
                style={{ background: 'none', border: 'none', color: 'var(--viz-6)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                View Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
