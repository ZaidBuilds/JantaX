import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooths } from '../services/boothService';
import { BoothTable } from '../components/BoothTable';
import { VoterFormsAccordion } from '../components/VoterFormsAccordion';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { Search, MapPin, Users, Vote, ExternalLink, Filter, Accessibility, FileText, CheckCircle2 } from 'lucide-react';

export function BoothDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'booths' | 'forms'>('booths');
  const [searchQuery, setSearchQuery] = useState('');
  const [rampOnly, setRampOnly] = useState(false);

  const booths = useMemo(() => {
    return getAllBooths({
      query: searchQuery,
      hasWheelchairRamp: rampOnly ? true : undefined,
    });
  }, [searchQuery, rampOnly]);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      {/* Hero Banner */}
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
            JANTAX MODULE 20
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Electoral Booth & Booth Level Officer (BLO) Directory
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          Find Your Polling Station & Local BLO Contact
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 840, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Locate your designated polling booth room, verify accessibility facilities (wheelchair ramps, water), and connect with your government-appointed Booth Level Officer (BLO) for voter card enrollment and corrections.
        </p>

        {/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 750, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by school/building name, PIN code, BLO name, or Assembly Constituency..."
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

          <a
            href="https://electoralsearch.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
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
            Search Name on ECI Roll <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('booths')}
          style={{
            background: activeTab === 'booths' ? '#0f2d59' : 'transparent',
            color: activeTab === 'booths' ? '#ffffff' : '#64748b',
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
          <Vote size={16} /> Polling Booths & BLO Directory ({booths.length})
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          style={{
            background: activeTab === 'forms' ? '#0f2d59' : 'transparent',
            color: activeTab === 'forms' ? '#ffffff' : '#64748b',
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
          <FileText size={16} /> Voter Service Forms (Form 6/7/8)
        </button>
      </div>

      {/* TAB 1: BOOTHS */}
      {activeTab === 'booths' && (
        <div>
          {/* Quick Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rampOnly}
                onChange={(e) => setRampOnly(e.target.checked)}
                style={{ borderRadius: 4 }}
              />
              Show Only Booths with PwD Wheelchair Ramp
            </label>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Gazetted by Election Commission of India (ECI)
            </span>
          </div>

          <BoothTable booths={booths} />
        </div>
      )}

      {/* TAB 2: FORMS */}
      {activeTab === 'forms' && <VoterFormsAccordion />}
    </div>
  );
}
