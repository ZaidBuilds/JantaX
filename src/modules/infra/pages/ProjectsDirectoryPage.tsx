import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Construction, 
  Search, 
  MapPin, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Building2, 
  IndianRupee, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getStoredProjects } from '../services/projectService';
import type { InfraProject, NeutralStatus } from '../types/projectInfra';

export function ProjectsDirectoryPage() {
  const navigate = useNavigate();
  const [projects] = useState<InfraProject[]>(() => getStoredProjects());
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sectors = ['All', 'Roads & Highways', 'Urban Transit', 'Water & Sewage', 'Bridges & Culverts', 'Power & Energy'];
  const statusOptions: Array<'All' | NeutralStatus> = ['All', 'Delayed', 'Extended', 'Incomplete', 'Under Review', 'Completed', 'Verified'];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedSector !== 'All' && !p.sector.includes(selectedSector)) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.nameEnglish.toLowerCase().includes(q) ||
          p.nameHindi.includes(q) ||
          p.pinCode.includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.leadContractor.toLowerCase().includes(q) ||
          p.implementingAgency.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, selectedSector, selectedStatus, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalSanctionedLakhs = projects.reduce((sum, p) => sum + p.budgetOriginalLakhs, 0);
    const totalAnticipatedLakhs = projects.reduce((sum, p) => sum + p.budgetAnticipatedLakhs, 0);
    const underReviewCount = projects.filter(p => p.status === 'Under Review' || p.status === 'Delayed' || p.status === 'Extended').length;
    const verifiedCount = projects.filter(p => p.status === 'Verified' || p.status === 'Completed').length;

    return {
      totalProjects,
      totalSanctionedCr: (totalSanctionedLakhs / 100).toFixed(1),
      totalAnticipatedCr: (totalAnticipatedLakhs / 100).toFixed(1),
      underReviewCount,
      verifiedCount
    };
  }, [projects]);

  const getStatusBadgeStyle = (status: NeutralStatus) => {
    switch (status) {
      case 'Completed':
      case 'Verified':
        return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: <CheckCircle2 size={13} /> };
      case 'Extended':
      case 'Delayed':
        return { bg: '#fffbebf', border: '#fde68a', color: '#b45309', icon: <Clock size={13} /> };
      case 'Incomplete':
        return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: <Clock size={13} /> };
      case 'Under Review':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: <ShieldCheck size={13} /> };
    }
  };

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d59 0%, #1e3a8a 50%, #0f172a 100%)',
        borderRadius: 20,
        padding: '2.25rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 12px 32px rgba(15, 45, 89, 0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.5)',
              color: '#fb923c',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Construction size={14} /> JANTAX PHASE 20
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
              Government Data Gateway · MoSPI & CPPP Connected
            </span>
          </div>

          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.25,
            marginBottom: '0.6rem',
            letterSpacing: '-0.02em'
          }}>
            Public Works & Infrastructure Directory
          </h1>
          <p style={{
            fontSize: '0.96rem',
            color: '#cbd5e1',
            maxWidth: 780,
            lineHeight: 1.55,
            marginBottom: '1.5rem'
          }}>
            Track high-value central & state sector infrastructure projects across India. Neutral, source-linked history linking official tenders, work orders, budgets, extensions, and ground-truth verification.
          </p>

          {/* Quick Search Input */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 720 }}>
            <div style={{
              flex: 1,
              minWidth: 280,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search project name, PIN code, contractor, ministry..."
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
              to="/projects/search"
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
              <Filter size={16} /> Advanced Search Page
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={16} style={{ color: '#3b82f6' }} /> Tracked Projects
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalProjects}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Nationwide & State Sector</div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IndianRupee size={16} style={{ color: '#10b981' }} /> Sanctioned Budget
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>₹{stats.totalSanctionedCr} Cr</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Anticipated: ₹{stats.totalAnticipatedCr} Cr</div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} style={{ color: '#f59e0b' }} /> Neutral Monitoring
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.underReviewCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Delayed / Extended / Under Review</div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,23,42,0.03)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} style={{ color: '#059669' }} /> Verified / Complete
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.verifiedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Physical Audit Completed</div>
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
          Sectors:
        </span>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: selectedSector === sec ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: selectedSector === sec ? '#eff6ff' : '#ffffff',
              color: selectedSector === sec ? '#1d4ed8' : '#475569',
              fontWeight: selectedSector === sec ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.75rem',
        overflowX: 'auto'
      }}>
        {statusOptions.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              borderBottom: selectedStatus === st ? '2px solid #f97316' : '2px solid transparent',
              background: 'transparent',
              color: selectedStatus === st ? '#f97316' : '#64748b',
              fontWeight: selectedStatus === st ? 700 : 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {st === 'All' ? 'All Statuses' : st}
          </button>
        ))}
      </div>

      {/* Projects List Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: '#ffffff',
          borderRadius: 16,
          border: '1px dashed #cbd5e1'
        }}>
          <Layers size={40} style={{ color: '#94a3b8', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>No projects match your filter</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.3rem' }}>
            Try resetting your search query or choosing another sector filter.
          </p>
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
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 3px 12px rgba(15,23,42,0.04)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.85rem'
                }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      {/* Neutral Status Badge */}
                      <span style={{
                        background: badgeStyle.bg,
                        border: `1px solid ${badgeStyle.border}`,
                        color: badgeStyle.color,
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        {badgeStyle.icon} {proj.status}
                      </span>

                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 6
                      }}>
                        {proj.sector}
                      </span>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.76rem',
                        color: '#64748b',
                        fontWeight: 600
                      }}>
                        <MapPin size={13} style={{ color: '#ea580c' }} />
                        PIN {proj.pinCode} · {proj.district}, {proj.state}
                      </span>
                    </div>

                    <h2
                      onClick={() => navigate(`/projects/${proj.id}`)}
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        cursor: 'pointer',
                        lineHeight: 1.35,
                        margin: 0
                      }}
                    >
                      {proj.nameEnglish}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 500 }}>
                      {proj.nameHindi}
                    </div>
                  </div>

                  {/* Original Source Link */}
                  <a
                    href={proj.originalSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.75rem',
                      color: '#0f2d59',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      maxWidth: 240
                    }}
                    title={proj.originalSource.name}
                  >
                    <span>Source: {proj.originalSource.name.slice(0, 26)}…</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Progress Indicators */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1rem 1.1rem',
                  borderRadius: 12,
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      <span>Physical Progress</span>
                      <span>{proj.progressPhysical}%</span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${proj.progressPhysical}%`,
                        background: proj.progressPhysical >= 90 ? '#10b981' : '#3b82f6',
                        borderRadius: 999,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      <span>Financial Progress</span>
                      <span>{proj.progressFinancial}%</span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${proj.progressFinancial}%`,
                        background: '#8b5cf6',
                        borderRadius: 999,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sanctioned / Anticipated Cost</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
                      ₹{origCr} Cr <span style={{ color: '#94a3b8', fontWeight: 500 }}>→ ₹{antCr} Cr</span>
                    </div>
                  </div>
                </div>

                {/* Neutral Delay Note if delayed or extended */}
                {proj.neutralDelaySummary && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: '#475569',
                    background: '#fefce8',
                    borderLeft: '3px solid #f59e0b',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: '1rem',
                    lineHeight: 1.45
                  }}>
                    <strong>Timeline Note:</strong> {proj.neutralDelaySummary}
                  </div>
                )}

                {/* Subroute Tabs Direct Links */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.85rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link
                      to={`/projects/${proj.id}`}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 8,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Eye size={13} /> Overview
                    </Link>
                    <Link
                      to={`/projects/${proj.id}/timeline`}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Calendar size={13} /> Source Timeline
                    </Link>
                    <Link
                      to={`/projects/${proj.id}/financials`}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <IndianRupee size={13} /> Financials & Tenders
                    </Link>
                    <Link
                      to={`/projects/${proj.id}/evidence`}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FileText size={13} /> Evidence Docs ({proj.evidenceDocuments.length})
                    </Link>
                    <Link
                      to={`/projects/${proj.id}/ground-truth`}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <ShieldCheck size={13} /> Ground Truth ({proj.groundTruth.physicalScore}%)
                    </Link>
                  </div>

                  <button
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f97316',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    View Project <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
