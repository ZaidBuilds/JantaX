import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoothById } from '../services/boothService';
import { BloContactCard } from '../components/BloContactCard';
import { BoothFacilitiesCard } from '../components/BoothFacilitiesCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, Users, Vote, ExternalLink, ShieldCheck, FileText, Send } from 'lucide-react';

export function BoothDetailPage() {
  const { id } = useParams<{ id: string }>();
  const booth = id ? getBoothById(id) : undefined;
  const [showIssueModal, setShowIssueModal] = useState(false);

  if (!booth) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>Polling Station Record Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested polling booth ID "{id}" could not be located in the ECI directory.
        </p>
        <Link to="/booth" style={{ color: 'var(--brand-ink)', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Booth Directory
        </Link>
      </div>
    );
  }

  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/booth"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Booth Directory
        </Link>
      </div>

      {/* Main Booth Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: 'var(--brand)', color: 'var(--on-solid)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800 }}>
                POLLING STATION #{booth.stationNumber}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                {booth.assemblyConstituency}
              </span>
            </div>

            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {booth.buildingName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', marginBottom: '0.4rem' }}>
              {booth.buildingNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
              <MapPin size={15} style={{ color: 'var(--accent-ink)' }} />
              <span><strong>{booth.roomNumber}</strong> • {booth.address} (PIN {booth.pinCode})</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 700 }}>
              Registered Electors
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)' }}>
              {booth.totalElectors}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
              {booth.maleElectors} Male • {booth.femaleElectors} Female
            </div>
          </div>
        </div>

        {/* 3 Quick Electoral Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--surface-2)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
          <div>
            <span style={{ color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Parliamentary Constituency</span>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '0.15rem' }}>{booth.parliamentaryConstituency}</div>
          </div>

          <div>
            <span style={{ color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Roll Revision Date</span>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '0.15rem' }}>{booth.electoralRollRevisionDate}</div>
          </div>

          <div>
            <span style={{ color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Gazette Order No.</span>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '0.15rem' }}>{booth.gazetteOrderNumber}</div>
          </div>
        </div>

        {/* BLO Card */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem' }}>
            Designated Booth Level Officer (BLO)
          </h3>
          <BloContactCard blo={booth.blo} stationNumber={booth.stationNumber} buildingName={booth.buildingName} />
        </div>

        {/* Facilities Card */}
        <BoothFacilitiesCard facilities={booth.facilities} />

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <a
            href="https://electoralsearch.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--accent-solid)',
              color: 'var(--on-solid)',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            Check Name on Electoral Roll <ExternalLink size={15} />
          </a>

          <button
            onClick={() => setShowIssueModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface)',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              color: 'var(--ink-2)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <Send size={15} /> Report Missing Ramp / Water Facility
          </button>
        </div>
      </div>

      {/* Grievance Modal */}
      {showIssueModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '2rem', maxWidth: 560, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn-line)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--warn)', fontWeight: 600 }}>
              Draft Generated by JantaX · Official Portal Submission Required
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.5rem' }}>
              Polling Station Accessibility Grievance Draft
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '1rem' }}>
              Copy this structured complaint text and submit to the District Election Officer (DEO) or ECI National Grievance Portal.
            </p>

            <textarea
              readOnly
              rows={6}
              value={`To: District Election Officer (DEO) / Chief Electoral Officer, ${booth.state}
Subject: Missing Minimum Facilities at Polling Station #${booth.stationNumber} (${booth.assemblyConstituency})

Respected Sir/Madam,
I wish to report a deficiency in Assuring Minimum Facilities (AMF) at the following polling station:
- Polling Station: #${booth.stationNumber} (${booth.buildingName})
- Room: ${booth.roomNumber}
- Location: ${booth.address} (PIN ${booth.pinCode})
- Designated BLO: ${booth.blo.name} (${booth.blo.contactPhone})

Citizen Observation: The polling station lacks mandatory PwD wheelchair ramp / drinking water facilities as mandated under ECI Assured Minimum Facility guidelines. Kindly arrange necessary physical improvements before polling day.`}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', fontFamily: 'monospace', marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button
                onClick={() => setShowIssueModal(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface-2)', color: 'var(--ink-2)', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>

              <a
                href="https://eci-citizenservices.eci.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: 'var(--accent-solid)', color: 'var(--on-solid)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Open ECI Grievance Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
