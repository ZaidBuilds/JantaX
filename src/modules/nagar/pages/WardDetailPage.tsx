import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWardById } from '../services/nagarService';
import { WardCleanlinessCard } from '../components/WardCleanlinessCard';
import { WardOfficerCard } from '../components/WardOfficerCard';
import { CivicComplaintGenerator } from '../components/CivicComplaintGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, Building2, Phone, ExternalLink, ShieldCheck, Trash2, CheckCircle2, Clock } from 'lucide-react';

export function WardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ward = id ? getWardById(id) : undefined;
  const [showDraftSection, setShowDraftSection] = useState(false);

  if (!ward) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>Municipal Ward Record Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested municipal ward ID "{id}" could not be located in the municipal directory.
        </p>
        <Link to="/nagar" style={{ color: 'var(--brand-ink)', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Municipal Directory
        </Link>
      </div>
    );
  }

  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/nagar"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Municipal Directory
        </Link>
      </div>

      {/* Main Ward Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: 'var(--brand)', color: 'var(--on-solid)', fontSize: '0.78rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                WARD #{ward.wardNumber}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                {ward.zone} ({ward.corporationName})
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {ward.wardName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', marginBottom: '0.4rem' }}>
              {ward.wardNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
              <MapPin size={15} style={{ color: 'var(--accent-ink)' }} />
              <span>PIN {ward.pinCode} • {ward.district}, {ward.state} (Pop ~{ward.population.toLocaleString('en-IN')})</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 700 }}>
              Cleanliness Score
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: ward.cleanlinessScore >= 80 ? 'var(--good)' : 'var(--warn)' }}>
              {ward.cleanlinessScore} / 100
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
              {ward.slaCompliancePercent}% 311 SLA Compliance
            </div>
          </div>
        </div>

        {/* 4 Quick Service Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Door-to-Door Garbage</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: ward.services.doorToDoorGarbage ? 'var(--good)' : 'var(--bad)', marginTop: '0.2rem' }}>
              {ward.services.doorToDoorGarbage ? 'Active 100%' : 'Irregular'}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>{ward.services.sweepingFrequency}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Streetlight Working %</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>
              {ward.services.streetlightCoveragePercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Coverage</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Avg 311 Resolution</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: ward.avgResolutionHours <= 30 ? 'var(--good)' : 'var(--warn)', marginTop: '0.2rem' }}>
              ~{ward.avgResolutionHours} Hours
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Statutory SLA: 48h</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Resolved Complaints</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.2rem' }}>
              {ward.resolvedComplaintsAnnual.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>{ward.openComplaints} currently open</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowDraftSection(!showDraftSection)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--brand)',
              color: 'var(--on-solid)',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={15} /> {showDraftSection ? 'Hide 311 Draft' : 'Draft 311 Complaint for this Ward'}
          </button>

          <a
            href={ward.onlinePortalUrl}
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
            Open Official Municipal Portal <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Draft Section if Toggled */}
      {showDraftSection && (
        <CivicComplaintGenerator
          wardNumber={ward.wardNumber}
          wardName={ward.wardName}
          corporationName={ward.corporationName}
          pinCode={ward.pinCode}
        />
      )}

      {/* Cleanliness Matrix */}
      <WardCleanlinessCard
        score={ward.cleanlinessScore}
        services={ward.services}
        slaCompliance={ward.slaCompliancePercent}
      />

      {/* Ward Officers & Councillor */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem' }}>
          Ward Public Representatives & Field Officers
        </h3>
        <WardOfficerCard
          councillor={ward.councillor}
          sanitaryInspector={ward.sanitaryInspector}
          wardNumber={ward.wardNumber}
          wardName={ward.wardName}
        />
      </div>
    </div>
  );
}
