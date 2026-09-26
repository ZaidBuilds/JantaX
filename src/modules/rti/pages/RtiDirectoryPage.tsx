import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllAuthorities } from '../services/rtiService';
import type { GovtLevel } from '../types/rti';
import { RtiTable } from '../components/RtiTable';
import { RtiDraftGenerator } from '../components/RtiDraftGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, Clock, ShieldCheck, Scale, FileText, ExternalLink, Filter } from 'lucide-react';

export function RtiDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'authorities' | 'generator'>('authorities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<GovtLevel | 'All'>('All');
  const [compliantOnly, setCompliantOnly] = useState(false);

  const authorities = useMemo(() => {
    return getAllAuthorities({
      query: searchQuery,
      governmentLevel: selectedLevel,
      maxResponseDays: compliantOnly ? 30 : undefined,
    });
  }, [searchQuery, selectedLevel, compliantOnly]);

  return (
    <div>

      {/* Hero Header */}
      <div className="card card-pad module-toolbar">
{/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search by ministry, department, CPIO name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)',
                color: 'var(--on-solid)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <Link
            to="/rti/compare"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--brand)',
              color: 'var(--on-solid)',
              padding: '0.75rem 1.25rem',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={16} /> Compare Authorities
          </Link>
        </div>
</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('authorities')}
          style={{
            background: activeTab === 'authorities' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'authorities' ? 'var(--on-solid)' : 'var(--ink-3)',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Clock size={16} /> Public Authorities ({authorities.length})
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          style={{
            background: activeTab === 'generator' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'generator' ? 'var(--on-solid)' : 'var(--ink-3)',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={16} /> RTI & First Appeal Draft Generator
        </button>
      </div>

      {/* TAB 1: AUTHORITIES */}
      {activeTab === 'authorities' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as GovtLevel | 'All')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
              >
                <option value="All">All Government Levels</option>
                <option value="Union Ministry">Union Ministry</option>
                <option value="State Department">State Department</option>
                <option value="Municipal / Local Body">Municipal / Local Body</option>
                <option value="Public Sector Undertaking">Public Sector Undertaking</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={compliantOnly}
                  onChange={(e) => setCompliantOnly(e.target.checked)}
                />
                Statutory 30-Day Compliant Only
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
              Source: Central Information Commission (CIC) Section 25 Returns
            </span>
          </div>

          <RtiTable authorities={authorities} />
        </div>
      )}

      {/* TAB 2: DRAFT GENERATOR */}
      {activeTab === 'generator' && <RtiDraftGenerator />}
    </div>
  );
}
