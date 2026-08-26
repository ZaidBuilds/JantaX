import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourts } from '../services/courtsService';
import type { CourtType } from '../types/courts';
import { CourtTable } from '../components/CourtTable';
import { CnrGuideCard } from '../components/CnrGuideCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, MapPin, Scale, Clock, Users, ExternalLink, Filter, ShieldAlert } from 'lucide-react';

export function CourtsDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'courts' | 'cnr'>('courts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CourtType | 'All'>('All');
  const [highVacancyOnly, setHighVacancyOnly] = useState(false);

  const courts = useMemo(() => {
    return getAllCourts({
      query: searchQuery,
      courtType: selectedType,
      minVacancyRate: highVacancyOnly ? 25 : undefined,
    });
  }, [searchQuery, selectedType, highVacancyOnly]);

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
            JANTAX MODULE 08
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            District Court Case Pendency & Judicial Delay Intelligence
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          District Court Pendency & Judge Vacancy Tracker
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Real-time case pendency data, 5+ year backlog statistics, procedural stage bottlenecks (evidence vs arguments), and judge vacancy ratios across India's district courts from the National Judicial Data Grid (NJDG).
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by court complex name, district, state, or PIN code..."
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
            to="/courts/compare"
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
            <Scale size={16} /> Compare Courts
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('courts')}
          style={{
            background: activeTab === 'courts' ? '#0f2d59' : 'transparent',
            color: activeTab === 'courts' ? '#ffffff' : '#64748b',
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
          <Scale size={16} /> Court Complexes ({courts.length})
        </button>

        <button
          onClick={() => setActiveTab('cnr')}
          style={{
            background: activeTab === 'cnr' ? '#0f2d59' : 'transparent',
            color: activeTab === 'cnr' ? '#ffffff' : '#64748b',
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
          <Search size={16} /> 16-Digit CNR Case Tracking Guide
        </button>
      </div>

      {/* TAB 1: COURTS */}
      {activeTab === 'courts' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as CourtType | 'All')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
              >
                <option value="All">All Court Types</option>
                <option value="District & Sessions Court">District & Sessions Court</option>
                <option value="Sub-Divisional Court">Sub-Divisional Court</option>
                <option value="Family Court">Family Court</option>
                <option value="Commercial Court">Commercial Court</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={highVacancyOnly}
                  onChange={(e) => setHighVacancyOnly(e.target.checked)}
                />
                High Judge Vacancy (&gt;25%)
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Source: National Judicial Data Grid (NJDG)
            </span>
          </div>

          <CourtTable courts={courts} />
        </div>
      )}

      {/* TAB 2: CNR GUIDE */}
      {activeTab === 'cnr' && <CnrGuideCard />}
    </div>
  );
}
