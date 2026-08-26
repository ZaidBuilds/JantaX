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
            JANTAX MUNICIPAL SERVICES
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Nagar Nigam Ward Directory, Councillor Contacts & 311 Grievance Tracker
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          Municipal Ward & Sanitation Directory (नगर निगम)
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Locate your municipal ward number, contact your elected Councillor and Sanitary Inspector, check daily garbage collection schedules, and generate verified 311 civic complaint drafts.
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 700, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by ward name, ward number, councillor, or PIN code..."
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
            to="/nagar/compare"
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
            <Sparkles size={16} /> Compare Wards
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('wards')}
          style={{
            background: activeTab === 'wards' ? '#0f2d59' : 'transparent',
            color: activeTab === 'wards' ? '#ffffff' : '#64748b',
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
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', color: '#1e293b' }}
              >
                <option value="All">All Municipal Corporations</option>
                <option value="Municipal Corporation of Delhi (MCD)">Municipal Corporation of Delhi (MCD)</option>
                <option value="Meerut Municipal Corporation (Nagar Nigam)">Meerut Municipal Corporation</option>
                <option value="Nagpur Municipal Corporation (NMC)">Nagpur Municipal Corporation</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={doorToDoorOnly}
                  onChange={(e) => setDoorToDoorOnly(e.target.checked)}
                />
                100% Door-to-Door Garbage Active
              </label>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
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
