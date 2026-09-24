import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourtById } from '../services/courtsService';
import { CourtJudgeVacancyCard } from '../components/CourtJudgeVacancyCard';
import { CourtStageBottleneckCard } from '../components/CourtStageBottleneckCard';
import { CnrGuideCard } from '../components/CnrGuideCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, Scale, Clock, Users, ExternalLink, ShieldCheck, Phone, Mail, AlertTriangle } from 'lucide-react';

export function CourtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const court = id ? getCourtById(id) : undefined;

  if (!court) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>Court Record Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested court complex ID "{id}" could not be located in the NJDG directory.
        </p>
        <Link to="/courts" style={{ color: 'var(--brand-ink)', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Courts Directory
        </Link>
      </div>
    );
  }

  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/courts"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Courts Directory
        </Link>
      </div>

      {/* Main Court Profile Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: 'var(--brand-soft)', color: 'var(--brand-ink)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                {court.courtType}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                Synced {court.lastSyncDate}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {court.complexName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', marginBottom: '0.4rem' }}>
              {court.complexNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
              <MapPin size={15} style={{ color: 'var(--accent-ink)' }} />
              <span>{court.address} (PIN {court.pinCode}) • {court.district}, {court.state}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Case Pendency
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>
              {court.totalPendingCases.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--bad)', fontWeight: 700 }}>
              {court.pendingOver5Years.toLocaleString('en-IN')} pending &gt; 5 years
            </div>
          </div>
        </div>

        {/* 4 Key Pendency Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Civil Pendency</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>
              {court.civilPending.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Property, Contract, Family</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Criminal Pendency</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.2rem' }}>
              {court.criminalPending.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Bail, Trial, Appeals</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Pending &gt; 10 Years</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--bad)', marginTop: '0.2rem' }}>
              {court.pendingOver10Years.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Chronic Backlog</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Case Clearance Rate</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: court.clearanceRatePercent >= 90 ? 'var(--good)' : 'var(--warn)', marginTop: '0.2rem' }}>
              {court.clearanceRatePercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)' }}>Disposals vs Inflow</span>
          </div>
        </div>

        {/* DLSA Legal Aid Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--brand-soft)', border: '1px solid var(--brand-line)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: '0.88rem' }}>
              District Legal Services Authority (DLSA) · Free Legal Aid
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--brand-ink)', marginTop: '0.15rem' }}>
              Women, SC/ST, custody undertrials, and citizens with income &lt; ₹3 Lakh/yr are entitled to free legal counsel under Legal Services Authorities Act 1987.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={`tel:${court.dlsaContactPhone.split(' ')[0]}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--brand)', color: 'var(--on-solid)', padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <Phone size={13} /> {court.dlsaContactPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Judge Vacancies */}
      <CourtJudgeVacancyCard
        sanctioned={court.sanctionedJudges}
        working={court.workingJudges}
        vacant={court.vacantJudges}
        vacancyPercentage={court.vacancyPercentage}
      />

      {/* Stage Bottleneck Analysis */}
      <CourtStageBottleneckCard stages={court.stageBreakdown} />

      {/* CNR Search Guide */}
      <CnrGuideCard />
    </div>
  );
}
