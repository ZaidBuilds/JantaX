import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllStations, getActiveGrapStage, getGrapRules } from '../services/pollutionService';
import type { AqiCategory, PollutantType } from '../types/pollution';
import { PollutionTable } from '../components/PollutionTable';
import { GrapStatusCard } from '../components/GrapStatusCard';
import { PollutionReportGenerator } from '../components/PollutionReportGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { LiveAirCard } from '../components/LiveAirCard';
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
    <div>
      <LiveAirCard />

      {/* Hero Header */}
      <div className="card card-pad module-toolbar">
{/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search station name, city, district, or PIN code..."
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
            to="/pollution/compare"
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
            <Wind size={16} /> Compare Stations
          </Link>
        </div>
</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button
          onClick={() => setActiveTab('stations')}
          style={{
            background: activeTab === 'stations' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'stations' ? 'var(--on-solid)' : 'var(--ink-3)',
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
          <Activity size={16} /> Sample stations ({stations.length})
        </button>

        <button
          onClick={() => setActiveTab('grap')}
          style={{
            background: activeTab === 'grap' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'grap' ? 'var(--on-solid)' : 'var(--ink-3)',
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
          <ShieldAlert size={16} /> CAQM GRAP Restrictions ({activeGrap.stageName.split('-')[0]})
        </button>

        <button
          onClick={() => setActiveTab('report')}
          style={{
            background: activeTab === 'report' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'report' ? 'var(--on-solid)' : 'var(--ink-3)',
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
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as AqiCategory | 'All')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
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
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
              >
                <option value="All">All Pollutants</option>
                <option value="PM2.5">PM2.5 (Fine Particulate)</option>
                <option value="PM10">PM10 (Dust & Coarse)</option>
                <option value="NO2">NO2 (Vehicular Gas)</option>
              </select>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
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
