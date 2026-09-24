import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepresentativeById, getWorksByRepresentativeId } from '../services/mpladsService';
import { MpladsFundSummaryCard } from '../components/MpladsFundSummaryCard';
import { MpladsSectorDonut } from '../components/MpladsSectorDonut';
import { MpladsProjectTable } from '../components/MpladsProjectTable';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, Building2, Calendar, FileText, CheckCircle2, AlertCircle, Share2, ExternalLink, IndianRupee } from 'lucide-react';

export function RepresentativeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const rep = id ? getRepresentativeById(id) : undefined;
  const works = id ? getWorksByRepresentativeId(id) : [];

  const [activeTab, setActiveTab] = useState<'works' | 'sectors' | 'audit'>('works');

  if (!rep) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>Representative Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested representative ID "{id}" could not be located in the database.
        </p>
        <Link to="/mplads" style={{ color: 'var(--brand-ink)', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to MPLADS Directory
        </Link>
      </div>
    );
  }

  return (
    <div>

      {/* Back Link */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/mplads"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to MPLADS Directory
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={rep.photoUrl}
            alt={rep.name}
            style={{ width: 96, height: 96, borderRadius: 20, objectFit: 'cover', border: '3px solid var(--border)' }}
          />

          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-ink)', background: 'var(--brand-soft)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                {rep.house}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--on-solid)', background: rep.partyColor, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                {rep.party}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                Tenure: {rep.termStart} to {rep.termEnd}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem' }}>
              {rep.name} <span style={{ fontSize: '1.1rem', color: 'var(--ink-3)', fontWeight: 600 }}>({rep.nameHi})</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--ink-2)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={15} style={{ color: 'var(--accent-ink)' }} />
                <span>Constituency: <strong>{rep.constituencyName}</strong>, {rep.state}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--good)' }} />
                <span><strong>{rep.totalWorksCompleted}</strong> of {rep.totalWorksSanctioned} works completed</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <a
              href={`https://mplads.gov.in/representatives/${rep.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border-strong)',
                padding: '0.5rem 1rem',
                borderRadius: 10,
                color: 'var(--ink-2)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Official MoSPI Ledger <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Fund Summary Component */}
      <MpladsFundSummaryCard fund={rep.fundSummary} houseTitle={`${rep.house} Fund Allocation`} />

      {/* Sector Donut Component */}
      <MpladsSectorDonut sectors={rep.keySectors} />

      {/* Works Ledger Heading & Table */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>
          Sanctioned Local Development Projects ({works.length})
        </h3>
        <MpladsProjectTable works={works} showRepresentative={false} />
      </div>
    </div>
  );
}
