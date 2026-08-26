import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllStations, getActiveGrapStage, getGrapRules } from '../services/pollutionService';
import type { AqiCategory, PollutantType } from '../types/pollution';
import { PollutionTable } from '../components/PollutionTable';
import { GrapStatusCard } from '../components/GrapStatusCard';
import { PollutionReportGenerator } from '../components/PollutionReportGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, Wind, ShieldAlert, Activity, Flame, ExternalLink, Filter } from 'lucide-react';

export function PollutionDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'stations' | 'grap' | 'report'>('stations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AqiCategory | 'All'>('All');
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType | 'All'>('All');

  const activeGrap = getActiveGrapStage();
  const allGrapRules = getGrapRules();

  const stations = useMemo(() => {
    return getAllStations({
      query: searchQuery,
      category: selectedCategory,
      prominentPollutant: selectedPollutant,
    });
  }, [searchQuery, selectedCategory, selectedPollutant]);

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
            JANTAX AIR QUALITY & GRAP
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            CPCB Live AQI Monitoring & CAQM Graded Response Enforcement
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          Air Quality Index (AQI) & GRAP Enforcement Tracker
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Live CAAQMS air monitoring station feeds from Central Pollution Control Board (CPCB). Track PM2.5/PM10 concentrations, active CAQM GRAP restrictions (vehicle & construction bans), and report smog violations directly to SAMEER.
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search station name, city, district, or PIN code..."
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
            to="/pollution/compare"
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
            <Wind size={16} /> Compare Stations
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button
          onClick={() => setActiveTab('stations')}
          style={{
            background: activeTab === 'stations' ? '#0f2d59' : 'transparent',
            color: activeTab === 'stations' ? '#ffffff' : '#64748b',
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
          <Activity size={16} /> Live AQI Stations ({stations.length})
        </button>

        <button
          onClick={() => setActiveTab('grap')}
          style={{
            background: activeTab === 'grap' ? '#0f2d59' : 'transparent',
            color: activeTab === 'grap' ? '#ffffff' : '#64748b',
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
          <ShieldAlert size={16} /> CAQM GRAP Restrictions ({activeGrap.stageName.split('—')[0]})
        </button>

        <button
          onClick={() => setActiveTab('report')}
          style={{
            background: activeTab === 'report' ? '#0f2d59' : 'transparent',
            color: activeTab === 'report' ? '#ffffff' : '#64748b',
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
          <Flame size={16} /> Report Smog / Burning (SAMEER)
        </button>
      </div>

      {/* TAB 1: STATIONS */}
      {activeTab === 'stations' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AqiCategory | 'All')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
              >
                <option value="All">All AQI Categories</option>
                <option value="Good">Good (0-50)</option>
                <option value="Satisfactory">Satisfactory (51-100)</option>
                <option value="Moderate">Moderate (101-200)</option>
                <option value="Poor">Poor (201-300)</option>
                <option value="Very Poor">Very Poor (301-400)</option>
                <option value="Severe">Severe (401-450)</option>
              </select>

              <select
                value={selectedPollutant}
                onChange={(e) => setSelectedPollutant(e.target.value as PollutantType | 'All')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
              >
                <option value="All">All Pollutants</option>
                <option value="PM2.5">PM2.5 (Fine Particulate)</option>
                <option value="PM10">PM10 (Dust & Coarse)</option>
                <option value="NO2">NO2 (Vehicular Gas)</option>
              </select>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Source: Central Pollution Control Board (CPCB) NAQI Feed
            </span>
          </div>

          <PollutionTable stations={stations} />
        </div>
      )}

      {/* TAB 2: GRAP */}
      {activeTab === 'grap' && <GrapStatusCard activeStage={activeGrap} allStages={allGrapRules} />}

      {/* TAB 3: REPORT */}
      {activeTab === 'report' && <PollutionReportGenerator />}
    </div>
  );
}
