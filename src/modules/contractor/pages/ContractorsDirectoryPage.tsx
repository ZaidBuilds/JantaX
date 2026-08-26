import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HardHat, 
  Search, 
  Building2, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  SlidersHorizontal,
  Award,
  BarChart3
} from 'lucide-react';
import { searchContractors } from '../services/contractorService';
import type { ContractorProfile } from '../types/contractorIntelligence';

export function ContractorsDirectoryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'score_desc' | 'value_desc' | 'contracts_desc' | 'completion_desc'>('score_desc');

  const categories = ['All', 'Class 1 Heavy Infrastructure', 'Urban Transit & Metro', 'Water & Sewage Specialist', 'Rural Roads & PMGSY'];

  const contractors = useMemo(() => {
    return searchContractors({ query, category, sortBy });
  }, [query, category, sortBy]);

  const stats = useMemo(() => {
    const totalCount = contractors.length;
    const totalValueCr = contractors.reduce((acc, c) => acc + c.performanceIndicators.totalAwardedValueCr, 0);
    const avgScore = totalCount > 0 ? Math.round(contractors.reduce((acc, c) => acc + c.performanceIndicators.overallScore, 0) / totalCount) : 0;
    const debarmentsCount = contractors.reduce((acc, c) => acc + c.performanceIndicators.activeDebarmentsCount, 0);

    return { totalCount, totalValueCr: totalValueCr.toLocaleString(), avgScore, debarmentsCount };
  }, [contractors]);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 20,
        padding: '2.25rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 12px 32px rgba(15,23,42,0.18)'
      }}>
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
            <HardHat size={14} /> JANTAX PHASE 21
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Competent Authority Verified Ledger · Evidence-Based Rules
          </span>
        </div>

        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.25,
          marginBottom: '0.6rem'
        }}>
          Contractor Performance & Intelligence Ledger
        </h1>
        <p style={{
          fontSize: '0.96rem',
          color: '#cbd5e1',
          maxWidth: 800,
          lineHeight: 1.55,
          marginBottom: '1.5rem'
        }}>
          Transparent, evidence-based track record of infrastructure contracting entities across India. Performance indicators, project completion rates, extensions, documented penalties, and official debarment records.
        </p>

        {/* Search Bar & Comparison Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 740 }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search company name, registration ID, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
            to="/contractors/compare"
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
            <BarChart3 size={16} /> Contractor Comparison
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tracked Contractors</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{stats.totalCount}</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Class 1 & Special Class</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Contracts Value</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>₹{stats.totalValueCr} Cr</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Awarded Value Cumulative</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Performance Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>{stats.avgScore}%</div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Transparent Index</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Debarments</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.debarmentsCount > 0 ? '#b91c1c' : '#047857', marginTop: '0.2rem' }}>
            {stats.debarmentsCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Competent Authority Orders</div>
        </div>
      </div>

      {/* Category Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: category === cat ? '1px solid #f97316' : '1px solid #e2e8f0',
              background: category === cat ? '#fff7ed' : '#ffffff',
              color: category === cat ? '#ea580c' : '#475569',
              fontWeight: category === cat ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contractor Cards List */}
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {contractors.map((c) => (
          <div
            key={c.id}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.6rem',
                    borderRadius: 6
                  }}>
                    {c.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    Reg: {c.registrationNumber} · Est. {c.incorporationYear}
                  </span>
                </div>

                <h3
                  onClick={() => navigate(`/contractors/${c.id}`)}
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    cursor: 'pointer',
                    margin: 0
                  }}
                >
                  {c.companyName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Headquarters: {c.headquarters} · Directors: {c.directors.join(', ')}
                </div>
              </div>

              {/* Performance Rating Badge */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '0.65rem 1rem',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Performance Score
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.1rem' }}>
                  {c.performanceIndicators.overallScore}%
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Bar */}
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
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Awarded Value</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{c.performanceIndicators.totalAwardedValueCr.toLocaleString()} Cr ({c.performanceIndicators.totalContractsCount} Projects)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Completion Rate</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857' }}>
                  {c.performanceIndicators.completionRatePct}% Completed
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Avg Extension Duration</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#b45309' }}>
                  {c.performanceIndicators.averageExtensionMonths} Months
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Documented Penalties</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: c.penalties.length > 0 ? '#b91c1c' : '#047857' }}>
                  {c.penalties.length} Order(s)
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/contractors/${c.id}`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 8,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Profile
                </Link>
                <Link
                  to={`/contractors/${c.id}/scorecard`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Scorecard
                </Link>
                <Link
                  to={`/contractors/${c.id}/projects`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Projects ({c.projects.length})
                </Link>
                <Link
                  to={`/contractors/${c.id}/history`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Track Record & Orders
                </Link>
              </div>

              <button
                onClick={() => navigate(`/contractors/${c.id}`)}
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
                Full Profile <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
