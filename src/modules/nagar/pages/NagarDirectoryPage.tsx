import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllWards } from '../services/nagarService';
import { WardTable } from '../components/WardTable';
import { CivicComplaintGenerator } from '../components/CivicComplaintGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, Sparkles, Building2, Trash2, Phone, ExternalLink, Filter } from 'lucide-react';

export function NagarDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'wards' | 'report'>('wards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCorp, setSelectedCorp] = useState<string>('All');
  const [doorToDoorOnly, setDoorToDoorOnly] = useState(false);

  const wards = useMemo(() => {
    return getAllWards({
      query: searchQuery,
      corporation: selectedCorp,
      doorToDoorOnly,
    });
  }, [searchQuery, selectedCorp, doorToDoorOnly]);

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
              placeholder="Search by ward name, ward number, councillor, or PIN code..."
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
            to="/nagar/compare"
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
            <Sparkles size={16} /> Compare Wards
          </Link>
        </div>
</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('wards')}
          style={{
            background: activeTab === 'wards' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'wards' ? 'var(--on-solid)' : 'var(--ink-3)',
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
          <Building2 size={16} /> Municipal Wards ({wards.length})
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
          <Trash2 size={16} /> Lodge 311 Civic Grievance
        </button>
      </div>

      {/* TAB 1: WARDS */}
      {activeTab === 'wards' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={selectedCorp}
                onChange={(e) => setSelectedCorp(e.target.value)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', background: 'var(--surface)', color: 'var(--ink)' }}
              >
                <option value="All">All Municipal Corporations</option>
                <option value="Municipal Corporation of Delhi (MCD)">Municipal Corporation of Delhi (MCD)</option>
                <option value="Meerut Municipal Corporation (Nagar Nigam)">Meerut Municipal Corporation</option>
                <option value="Nagpur Municipal Corporation (NMC)">Nagpur Municipal Corporation</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={doorToDoorOnly}
                  onChange={(e) => setDoorToDoorOnly(e.target.checked)}
                />
                100% Door-to-Door Garbage Active
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
              Source: MoHUA Swachhata 311 & Municipal Citizen Charters
            </span>
          </div>

          <WardTable wards={wards} />
        </div>
      )}

      {/* TAB 2: 311 COMPLAINT */}
      {activeTab === 'report' && <CivicComplaintGenerator />}
    </div>
  );
}
