import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuthorityById } from '../services/rtiService';
import { RtiClockCard } from '../components/RtiClockCard';
import { CpioFaaContactCard } from '../components/CpioFaaContactCard';
import { RtiDraftGenerator } from '../components/RtiDraftGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Clock, ShieldCheck, FileText, ExternalLink, MapPin, Building2, AlertTriangle } from 'lucide-react';

export function AuthorityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const authority = id ? getAuthorityById(id) : undefined;

  if (!authority) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Public Authority Record Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested public authority ID "{id}" could not be located in the CIC directory.
        </p>
        <Link to="/rti" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to RTI Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/rti"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to RTI Directory
        </Link>
      </div>

      {/* Main Authority Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                {authority.governmentLevel}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Synced {authority.lastQuarterSync}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
              {authority.authorityName}
            </h1>
            <div style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '0.4rem' }}>
              {authority.authorityNameHi}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <Building2 size={15} style={{ color: '#f97316' }} />
              <span>{authority.parentMinistry} • {authority.city}, {authority.state}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 160 }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Average Response Speed
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: authority.avgResponseDays <= 30 ? '#10b981' : '#dc2626' }}>
              {authority.avgResponseDays} Days
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Statutory 30-day clock
            </div>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Annual RTIs Received</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.2rem' }}>
              {authority.totalRequestsReceivedAnnual.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Citizen Inquiries</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>30-Day Disposals</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
              {authority.disposedWithin30DaysPercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>On-Time Compliance</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Rejection Rate</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: authority.rejectionRatePercent > 5 ? '#dc2626' : '#10b981', marginTop: '0.2rem' }}>
              {authority.rejectionRatePercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Section 8 Invoked</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>First Appeals Filed</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
              {authority.firstAppealsFiled.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{authority.firstAppealsUpheldPercent}% Upheld by FAA</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href={authority.onlinePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f97316',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            File RTI on Official Portal ({authority.onlinePortalUrl.replace('https://', '')}) <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* RTI Clock Card */}
      <RtiClockCard
        avgDays={authority.avgResponseDays}
        disposedWithin30DaysPercent={authority.disposedWithin30DaysPercent}
        pendingBeyond30DaysPercent={authority.pendingBeyond30DaysPercent}
        rejectionRate={authority.rejectionRatePercent}
      />

      {/* CPIO and FAA Contacts */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', marginBottom: '0.75rem' }}>
          Designated Public Information Officers & Appellate Authority
        </h3>
        <CpioFaaContactCard cpio={authority.cpio} faa={authority.faa} />
      </div>

      {/* Top Exemptions Card */}
      <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.5rem' }}>
          Top Section 8 Exemptions Cited by this Department
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1rem' }}>
          When information is refused, which clauses of the RTI Act 2005 are most frequently invoked?
        </p>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {authority.topExemptions.map((ex) => (
            <div key={ex.clause} style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 800, color: '#0f2d59', fontSize: '0.88rem' }}>{ex.clause}</span>
                <span style={{ color: '#475569', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{ex.clauseTitle}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.85rem' }}>{ex.percentage}%</span>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{ex.count} rejections</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Draft Generator */}
      <RtiDraftGenerator />
    </div>
  );
}
