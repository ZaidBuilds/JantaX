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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Court Record Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested court complex ID "{id}" could not be located in the NJDG directory.
        </p>
        <Link to="/courts" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Courts Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/courts"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Courts Directory
        </Link>
      </div>

      {/* Main Court Profile Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                {court.courtType}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Synced {court.lastSyncDate}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {court.complexName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.4rem' }}>
              {court.complexNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <MapPin size={15} style={{ color: '#f97316' }} />
              <span>{court.address} (PIN {court.pinCode}) • {court.district}, {court.state}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Case Pendency
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f2d59' }}>
              {court.totalPendingCases.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>
              {court.pendingOver5Years.toLocaleString('en-IN')} pending &gt; 5 years
            </div>
          </div>
        </div>

        {/* 4 Key Pendency Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Civil Pendency</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.2rem' }}>
              {court.civilPending.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Property, Contract, Family</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Criminal Pendency</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
              {court.criminalPending.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Bail, Trial, Appeals</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending &gt; 10 Years</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
              {court.pendingOver10Years.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Chronic Backlog</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Case Clearance Rate</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: court.clearanceRatePercent >= 90 ? '#16a34a' : '#d97706', marginTop: '0.2rem' }}>
              {court.clearanceRatePercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Disposals vs Inflow</span>
          </div>
        </div>

        {/* DLSA Legal Aid Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.88rem' }}>
              District Legal Services Authority (DLSA) — Free Legal Aid
            </div>
            <div style={{ fontSize: '0.78rem', color: '#3b82f6', marginTop: '0.15rem' }}>
              Women, SC/ST, custody undertrials, and citizens with income &lt; ₹3 Lakh/yr are entitled to free legal counsel under Legal Services Authorities Act 1987.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={`tel:${court.dlsaContactPhone.split(' ')[0]}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#2563eb', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
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
