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
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Non-Legal Advice Disclaimer Banner */}
      <div style={{
        background: '#fffbebf',
        border: '1px solid #fde68a',
        borderRadius: 12,
        padding: '0.75rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.84rem',
        color: '#b45309'
      }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice. All adjudications are sourced directly from competent State RERA Authorities.
        </div>
      </div>

      {/* Main Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0e7490 0%, #155e75 50%, #0f172a 100%)',
        borderRadius: 20,
        padding: '2.25rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 12px 32px rgba(14, 116, 144, 0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Home size={14} /> JANTAX PHASE 22
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cffaff', fontWeight: 600 }}>
            State RERA Integrated Intelligence · Official Record Provenance
          </span>
        </div>

        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.25,
          marginBottom: '0.6rem'
        }}>
          RERA Real Estate & Builder Intelligence Gateway
        </h1>
        <p style={{
          fontSize: '0.96rem',
          color: '#e0f2fe',
          maxWidth: 820,
          lineHeight: 1.55,
          marginBottom: '1.5rem'
        }}>
          Track state RERA registrations, promised vs actual completion timelines, regulatory tribunal orders, and promoter track records across India. Explicit source provenance guarantees data integrity.
        </p>

        {/* Quick Search & Compare Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 740 }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search RERA Reg #, Project Name, Builder, PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
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
              background: 'var(--gradient-accent)',
              color: '#ffffff',
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
              background: '#0891b2',
              color: '#ffffff',
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
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>RERA Projects Tracked</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{stats.totalProjects}</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>State RERA Portals</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Housing Units Tracked</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0891b2', marginTop: '0.2rem' }}>{stats.totalUnits}</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Allottee Inventory</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Documented Schedule Adjustments</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>{stats.delayedCount}</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Extended / Delayed Projects</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>RERA Tribunal Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.2rem' }}>{stats.totalOrders}</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Official Adjudications</div>
        </div>
      </div>

      {/* State Portal Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
          State RERA Portal:
        </span>
        {portals.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPortal(p)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: selectedPortal === p ? '1px solid #0891b2' : '1px solid #e2e8f0',
              background: selectedPortal === p ? '#ecfeff' : '#ffffff',
              color: selectedPortal === p ? '#0e7490' : '#475569',
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
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  {/* Provenance Badge */}
                  <span style={{
                    background: '#ecfeff',
                    border: '1px solid #a5f3fc',
                    color: '#0e7490',
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

                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {p.statePortal} · Reg #{p.reraRegistrationNumber}
                  </span>
                </div>

                <h3
                  onClick={() => navigate(`/rera/projects/${p.id}`)}
                  style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', margin: 0 }}
                >
                  {p.projectName}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Promoter: <strong style={{ color: '#0f172a' }}>{p.builderName}</strong> · {p.locationName}, {p.district} (PIN {p.pinCode})
                </div>
              </div>

              <a
                href={p.originalSource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.74rem',
                  color: '#0f2d59',
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
              background: '#f8fafc',
              padding: '0.85rem 1.1rem',
              borderRadius: 12,
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Promised Completion</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{p.promisedCompletionDate}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Revised Completion</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f97316' }}>{p.revisedCompletionDate}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Documented Delay</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: p.documentedDelayMonths > 0 ? '#b45309' : '#047857' }}>
                  {p.documentedDelayMonths} Months
                  <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '1px 4px', borderRadius: 4, marginLeft: 4 }}>
                    {p.statusProvenances.delayCalculation}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>RERA Orders</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{p.orders.length} Adjudication(s)</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Link
                  to={`/rera/projects/${p.id}`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Project Overview
                </Link>
                <Link
                  to={`/rera/projects/${p.id}/orders`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  RERA Tribunal Orders ({p.orders.length})
                </Link>
                <Link
                  to={`/rera/builders/${p.builderId}`}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Builder Track Record
                </Link>
              </div>

              <button
                onClick={() => navigate(`/rera/projects/${p.id}`)}
                style={{ background: 'none', border: 'none', color: '#0891b2', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
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
