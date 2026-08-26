import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getContractorById } from '../services/contractorService';
import type { ContractorProfile } from '../types/contractorIntelligence';
import { 
  ArrowLeft, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  IndianRupee, 
  Award,
  AlertTriangle,
  BarChart3,
  Calendar,
  Layers,
  Share2
} from 'lucide-react';

interface ContractorProfilePageProps {
  initialTab?: 'overview' | 'scorecard' | 'projects' | 'history';
}

export function ContractorProfilePage({ initialTab }: ContractorProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [contractor, setContractor] = useState<ContractorProfile | undefined>(() => id ? getContractorById(id) : undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setContractor(getContractorById(id));
    }
  }, [id]);

  const currentPath = location.pathname;
  let activeTab: 'overview' | 'scorecard' | 'projects' | 'history' = initialTab || 'overview';
  if (currentPath.endsWith('/scorecard')) activeTab = 'scorecard';
  else if (currentPath.endsWith('/projects')) activeTab = 'projects';
  else if (currentPath.endsWith('/history')) activeTab = 'history';

  if (!contractor) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Contractor Profile Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested contractor ID "{id}" could not be located in the database.
        </p>
        <Link
          to="/contractors"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 10,
            background: 'var(--gradient-accent)',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Return to Contractors Directory
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const pi = contractor.performanceIndicators;

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Navigation Back Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={() => navigate('/contractors')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to Contractors Directory
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleShare}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share Profile'}
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0a66c2',
              color: '#ffffff',
              borderRadius: 8,
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Share on LinkedIn <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Header Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: '1.75rem',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 6
              }}>
                {contractor.category}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Reg ID: {contractor.registrationNumber} · Est. {contractor.incorporationYear}
              </span>
            </div>

            <h1 style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.3,
              margin: '0.2rem 0 0.4rem'
            }}>
              {contractor.companyName}
            </h1>

            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
              Headquarters: {contractor.headquarters} · Directors: {contractor.directors.join(', ')}
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 14,
            padding: '0.85rem 1.25rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Transparent Performance Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.1rem' }}>
              {pi.overallScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        <Link
          to={`/contractors/${contractor.id}`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'overview' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'overview' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'overview' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          Overview
        </Link>
        <Link
          to={`/contractors/${contractor.id}/scorecard`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'scorecard' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'scorecard' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'scorecard' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          Performance Scorecard
        </Link>
        <Link
          to={`/contractors/${contractor.id}/projects`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'projects' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'projects' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'projects' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          Projects & Contracts ({contractor.projects.length})
        </Link>
        <Link
          to={`/contractors/${contractor.id}/history`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'history' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'history' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'history' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          Track Record & Orders
        </Link>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Contracts Awarded</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                ₹{pi.totalAwardedValueCr.toLocaleString()} Cr
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Across {pi.totalContractsCount} projects</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Project Completion Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
                {pi.completionRatePct}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Handed over & commissioned</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>On-Time Delivery Index</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                {pi.onTimeDeliveryRatePct}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Completed without timeline extension</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Extension Duration</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', marginTop: '0.2rem' }}>
                {pi.averageExtensionMonths} Months
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Across active & completed works</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scorecard */}
      {activeTab === 'scorecard' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem' }}>
            Transparent Performance Scorecard Indicators
          </h3>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem 1.15rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                <span>Quality Audit Score</span>
                <span>{pi.qualityAuditScore} / 100</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pi.qualityAuditScore}%`, background: '#2563eb', borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                Derived from official quality core-cut reports and third-party safety audits.
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem 1.15rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                <span>On-Time Milestone Delivery</span>
                <span>{pi.onTimeDeliveryRatePct}%</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pi.onTimeDeliveryRatePct}%`, background: '#10b981', borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                Percentage of project packages delivered on or before the original target completion date.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Projects */}
      {activeTab === 'projects' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem' }}>
            Associated Projects & Public Works ({contractor.projects.length})
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {contractor.projects.map((p) => (
              <div key={p.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>{p.projectName}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {p.sector} · {p.district}, {p.state}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2d59', background: '#eff6ff', padding: '0.3rem 0.75rem', borderRadius: 8 }}>
                    Awarded: ₹{(p.awardedValueLakhs / 100).toFixed(2)} Cr
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                    Status: <strong style={{ color: p.status === 'Completed' || p.status === 'Verified' ? '#047857' : '#b45309' }}>{p.status}</strong> · Extensions: {p.extensionsMonths} Mos
                  </div>
                  <Link to={`/projects/${p.id}`} style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}>
                    View Project Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: History & Debarments */}
      {activeTab === 'history' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Documented Penalties Card */}
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
              Documented Competent Authority Penalty Orders ({contractor.penalties.length})
            </h3>

            {contractor.penalties.length === 0 ? (
              <div style={{ fontSize: '0.86rem', color: '#64748b' }}>No penalty orders issued by competent authorities on record.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {contractor.penalties.map((pen) => (
                  <div key={pen.id} style={{ background: '#fffbebf', border: '1px solid #fde68a', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800 }}>
                          Order #{pen.orderNumber} · {pen.date}
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                          Issuing Authority: {pen.issuingAuthority}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b91c1c' }}>
                        Penalty: ₹{pen.penaltyAmountLakhs} Lakhs
                      </div>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.5rem', lineHeight: 1.45 }}>
                      <strong>Documented Reason (Neutral):</strong> {pen.reasonNeutral}
                    </div>
                    <a href={pen.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.76rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
                      Official Penalty Gazette Entry ({pen.sourceTitle}) <ExternalLink size={11} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debarment Records Card */}
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
              Official Debarment & Blacklisting Records
            </h3>

            {contractor.debarmentRecords.length === 0 ? (
              <div style={{ fontSize: '0.86rem', color: '#047857', background: '#ecfdf5', padding: '0.85rem', borderRadius: 10, border: '1px solid #a7f3d0', fontWeight: 700 }}>
                ✓ No active debarment or blacklisting notices published by competent authorities.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {contractor.debarmentRecords.map((deb) => (
                  <div key={deb.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b91c1c' }}>
                        Debarment Notice #{deb.noticeNumber} ({deb.status})
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Period: {deb.startDate} to {deb.endDate} ({deb.debarmentPeriodMonths} Mos)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.4rem' }}>
                      <strong>Issuing Body:</strong> {deb.issuingMinistry}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.25rem' }}>
                      <strong>Official Ground:</strong> {deb.officialGroundNeutral}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
