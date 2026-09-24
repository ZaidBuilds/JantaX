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
    <div>
      {/* Top Banner */}
      <div className="card card-pad module-toolbar">
{/* Search Bar & Comparison Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 740 }}>
          <div style={{ flex: 1, minWidth: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search company name, registration ID, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
            to="/contractors/compare"
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
        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Tracked Contractors</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>{stats.totalCount}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Class 1 & Special Class</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Total Contracts Value</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--good)', marginTop: '0.2rem' }}>₹{stats.totalValueCr} Cr</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Awarded Value Cumulative</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Average Performance Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.2rem' }}>{stats.avgScore}%</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Transparent Index</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Active Debarments</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.debarmentsCount > 0 ? 'var(--bad)' : 'var(--good)', marginTop: '0.2rem' }}>
            {stats.debarmentsCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-4)' }}>Competent Authority Orders</div>
        </div>
      </div>

      {/* Category Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-3)', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              border: category === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: category === cat ? 'var(--accent-soft)' : 'var(--surface)',
              color: category === cat ? 'var(--accent-ink)' : 'var(--ink-2)',
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
              background: 'var(--surface)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(15,23,42,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: 'var(--brand-soft)',
                    color: 'var(--brand-ink)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.6rem',
                    borderRadius: 6
                  }}>
                    {c.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                    Reg: {c.registrationNumber} · Est. {c.incorporationYear}
                  </span>
                </div>

                <h3
                  onClick={() => navigate(`/contractors/${c.id}`)}
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    margin: 0
                  }}
                >
                  {c.companyName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
                  Headquarters: {c.headquarters} · Directors: {c.directors.join(', ')}
                </div>
              </div>

              {/* Performance Rating Badge */}
              <div style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 12,
                padding: '0.65rem 1rem',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Performance Score
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.1rem' }}>
                  {c.performanceIndicators.overallScore}%
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Bar */}
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
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Total Awarded Value</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)' }}>
                  ₹{c.performanceIndicators.totalAwardedValueCr.toLocaleString()} Cr ({c.performanceIndicators.totalContractsCount} Projects)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Completion Rate</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--good)' }}>
                  {c.performanceIndicators.completionRatePct}% Completed
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Avg Extension Duration</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--warn)' }}>
                  {c.performanceIndicators.averageExtensionMonths} Months
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 600 }}>Documented Penalties</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: c.penalties.length > 0 ? 'var(--bad)' : 'var(--good)' }}>
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
                    background: 'var(--brand-soft)',
                    color: 'var(--brand-ink)',
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
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--ink-2)',
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
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--ink-2)',
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
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--ink-2)',
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
                  color: 'var(--accent-ink)',
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
