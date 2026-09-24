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
    <div>

      {/* Hero Banner */}
      <div className="card card-pad module-toolbar">
{/* Global Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 750, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }} />
            <input
              type="text"
              placeholder="Search by school/building name, PIN code, BLO name, or Assembly Constituency..."
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

          <a
            href="https://electoralsearch.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
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
            Search Name on ECI Roll <ExternalLink size={16} />
          </a>
        </div>
</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('booths')}
          style={{
            background: activeTab === 'booths' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'booths' ? 'var(--on-solid)' : 'var(--ink-3)',
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
            background: activeTab === 'forms' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'forms' ? 'var(--on-solid)' : 'var(--ink-3)',
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rampOnly}
                onChange={(e) => setRampOnly(e.target.checked)}
                style={{ borderRadius: 4 }}
              />
              Show Only Booths with PwD Wheelchair Ramp
            </label>

            <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
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
