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
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2d59 0%, #1e3a8a 100%)',
          borderRadius: 20,
          padding: '2.25rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 12px 32px rgba(15,45,89,0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
            JANTAX MODULE 17
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            RTI Clock & Statutory Response Tracker
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          RTI Clock & Public Authority Directory
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Real-time statutory compliance metrics under Section 25 of the RTI Act 2005. Track average ministry response speeds, Section 8 rejection rates, official CPIO/FAA contacts, and generate compliant RTI application drafts.
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by ministry, department, CPIO name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
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
              background: '#f97316',
              color: '#ffffff',
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('authorities')}
          style={{
            background: activeTab === 'authorities' ? '#0f2d59' : 'transparent',
            color: activeTab === 'authorities' ? '#ffffff' : '#64748b',
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
            background: activeTab === 'generator' ? '#0f2d59' : 'transparent',
            color: activeTab === 'generator' ? '#ffffff' : '#64748b',
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
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
              >
                <option value="All">All Government Levels</option>
                <option value="Union Ministry">Union Ministry</option>
                <option value="State Department">State Department</option>
                <option value="Municipal / Local Body">Municipal / Local Body</option>
                <option value="Public Sector Undertaking">Public Sector Undertaking</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={compliantOnly}
                  onChange={(e) => setCompliantOnly(e.target.checked)}
                />
                Statutory 30-Day Compliant Only
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
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
