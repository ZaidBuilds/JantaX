import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllRepresentatives, getAllWorks } from '../services/mpladsService';
import type { SectorType, WorkStatus, HouseType } from '../types/mplads';
import { MpladsProjectTable } from '../components/MpladsProjectTable';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, MapPin, IndianRupee, Users, Building2, Layers, Filter, CheckCircle2, ChevronRight, Scale } from 'lucide-react';

export function MpladsDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'representatives' | 'works'>('representatives');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<HouseType | 'All'>('All');
  const [selectedSector, setSelectedSector] = useState<SectorType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<WorkStatus | 'All'>('All');

  const representatives = useMemo(() => {
    let list = getAllRepresentatives();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.constituencyName.toLowerCase().includes(q) ||
          r.state.toLowerCase().includes(q) ||
          r.party.toLowerCase().includes(q)
      );
    }
    if (selectedHouse !== 'All') {
      list = list.filter((r) => r.house === selectedHouse);
    }
    return list;
  }, [searchQuery, selectedHouse]);

  const works = useMemo(() => {
    return getAllWorks({
      query: searchQuery,
      sector: selectedSector,
      status: selectedStatus,
    });
  }, [searchQuery, selectedSector, selectedStatus]);

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
            JANTAX MODULE 09
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            MPLADS & MLALADS Local Area Development Fund & Project Tracker
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          MP & MLA Local Development Fund Scorecard
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Track ₹5 Crore/year MPLADS and MLALADS funds allocated to your elected representatives. Compare sanctioned project costs, physical execution status, and unspent balances.
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by MP/MLA name, constituency, district, or PIN code..."
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
            to="/mplads/compare"
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
            <Scale size={16} /> Compare MPs/MLAs
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('representatives')}
          style={{
            background: activeTab === 'representatives' ? '#0f2d59' : 'transparent',
            color: activeTab === 'representatives' ? '#ffffff' : '#64748b',
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
          <Users size={16} /> Elected Representatives ({representatives.length})
        </button>

        <button
          onClick={() => setActiveTab('works')}
          style={{
            background: activeTab === 'works' ? '#0f2d59' : 'transparent',
            color: activeTab === 'works' ? '#ffffff' : '#64748b',
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
          <Layers size={16} /> Sanctioned Works Ledger ({works.length})
        </button>
      </div>

      {/* TAB 1: REPRESENTATIVES GRID */}
      {activeTab === 'representatives' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {(['All', 'Lok Sabha', 'Vidhan Sabha'] as const).map((house) => (
              <button
                key={house}
                onClick={() => setSelectedHouse(house)}
                style={{
                  background: selectedHouse === house ? '#e2e8f0' : '#f8fafc',
                  color: selectedHouse === house ? '#0f2d59' : '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {house}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {representatives.map((rep) => {
              const util = rep.fundSummary.utilizationPercentage;
              const isHigh = util >= 75;
              const isMed = util >= 50 && util < 75;

              return (
                <div key={rep.id} className="jantax-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <img
                      src={rep.photoUrl}
                      alt={rep.name}
                      style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', border: '2px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                          {rep.house}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', background: rep.partyColor, padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                          {rep.party}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2d59', margin: '0.3rem 0 0.15rem' }}>
                        {rep.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {rep.constituencyName} • {rep.state}
                      </div>
                    </div>
                  </div>

                  {/* Fund Progress */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      <span style={{ color: '#475569' }}>Fund Utilization</span>
                      <span style={{ color: isHigh ? '#10b981' : isMed ? '#f59e0b' : '#ef4444', fontWeight: 800 }}>
                        {util}% (₹{rep.fundSummary.expenditureReportedCr} Cr / ₹{rep.fundSummary.releasedByGovtCr} Cr)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ width: `${util}%`, height: '100%', background: isHigh ? '#10b981' : isMed ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>

                  {/* 3 Quick Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                    <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: '#0f2d59', fontSize: '0.95rem' }}>{rep.totalWorksSanctioned}</div>
                      <span style={{ color: '#64748b', fontSize: '0.68rem' }}>Sanctioned</span>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>{rep.totalWorksCompleted}</div>
                      <span style={{ color: '#64748b', fontSize: '0.68rem' }}>Completed</span>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem' }}>₹{rep.fundSummary.unspentBalanceCr} Cr</div>
                      <span style={{ color: '#64748b', fontSize: '0.68rem' }}>Unspent</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      to={`/mplads/representatives/${rep.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        background: '#0f2d59',
                        color: '#ffffff',
                        padding: '0.65rem',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                      }}
                    >
                      View Fund Portfolio <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WORKS LEDGER */}
      {activeTab === 'works' && (
        <div>
          {/* Sector & Status Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as SectorType | 'All')}
              style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
            >
              <option value="All">All Sectors</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Education">Education</option>
              <option value="Electricity & Solar">Electricity & Solar</option>
              <option value="Health & Sanitation">Health & Sanitation</option>
              <option value="Roads & Pathways">Roads & Pathways</option>
              <option value="Community Infrastructure">Community Infrastructure</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as WorkStatus | 'All')}
              style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
            >
              <option value="All">All Execution Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Sanctioned">Sanctioned</option>
            </select>
          </div>

          <MpladsProjectTable works={works} showRepresentative={true} />
        </div>
      )}
    </div>
  );
}
