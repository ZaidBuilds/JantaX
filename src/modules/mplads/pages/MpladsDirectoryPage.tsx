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
    <div>

      {/* Hero Header */}
      <div className="card card-pad module-toolbar">
{/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search by MP/MLA name, constituency, district, or PIN code..."
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
            to="/mplads/compare"
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
            <Scale size={16} /> Compare MPs/MLAs
          </Link>
        </div>
</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('representatives')}
          style={{
            background: activeTab === 'representatives' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'representatives' ? 'var(--on-solid)' : 'var(--ink-3)',
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
            background: activeTab === 'works' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'works' ? 'var(--on-solid)' : 'var(--ink-3)',
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
                  background: selectedHouse === house ? 'var(--border)' : 'var(--surface-2)',
                  color: selectedHouse === house ? 'var(--ink)' : 'var(--ink-3)',
                  border: '1px solid var(--border)',
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
                      style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', border: '2px solid var(--border)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-ink)', background: 'var(--brand-soft)', padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                          {rep.house}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--on-solid)', background: rep.partyColor, padding: '0.15rem 0.5rem', borderRadius: 6 }}>
                          {rep.party}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0.3rem 0 0.15rem' }}>
                        {rep.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                        {rep.constituencyName} • {rep.state}
                      </div>
                    </div>
                  </div>

                  {/* Fund Progress */}
                  <div style={{ background: 'var(--surface-2)', padding: '0.85rem', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--ink-2)' }}>Fund Utilization</span>
                      <span style={{ color: isHigh ? 'var(--good)' : isMed ? 'var(--warn)' : 'var(--bad)', fontWeight: 800 }}>
                        {util}% (₹{rep.fundSummary.expenditureReportedCr} Cr / ₹{rep.fundSummary.releasedByGovtCr} Cr)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ width: `${util}%`, height: '100%', background: isHigh ? 'var(--good-solid)' : isMed ? 'var(--warn-solid)' : 'var(--bad-solid)' }} />
                    </div>
                  </div>

                  {/* 3 Quick Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                    <div style={{ background: 'var(--surface-3)', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: '0.95rem' }}>{rep.totalWorksSanctioned}</div>
                      <span style={{ color: 'var(--ink-3)', fontSize: '0.68rem' }}>Sanctioned</span>
                    </div>
                    <div style={{ background: 'var(--surface-3)', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: 'var(--good)', fontSize: '0.95rem' }}>{rep.totalWorksCompleted}</div>
                      <span style={{ color: 'var(--ink-3)', fontSize: '0.68rem' }}>Completed</span>
                    </div>
                    <div style={{ background: 'var(--surface-3)', padding: '0.5rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, color: 'var(--warn)', fontSize: '0.95rem' }}>₹{rep.fundSummary.unspentBalanceCr} Cr</div>
                      <span style={{ color: 'var(--ink-3)', fontSize: '0.68rem' }}>Unspent</span>
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
                        background: 'var(--brand)',
                        color: 'var(--on-solid)',
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
              style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
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
              style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
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
