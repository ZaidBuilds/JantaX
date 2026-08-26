import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getBuilderById } from '../services/reraService';
import type { BuilderProfile } from '../types/reraIntelligence';
import { ArrowLeft, Home, ExternalLink, ShieldCheck, Scale, Building2, Share2, CheckCircle2, Clock } from 'lucide-react';

interface ReraBuilderProfilePageProps {
  initialTab?: 'overview' | 'track-record';
}

export function ReraBuilderProfilePage({ initialTab }: ReraBuilderProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [builder, setBuilder] = useState<BuilderProfile | undefined>(() => id ? getBuilderById(id) : undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) setBuilder(getBuilderById(id));
  }, [id]);

  const currentPath = location.pathname;
  let activeTab: 'overview' | 'track-record' = initialTab || 'overview';
  if (currentPath.endsWith('/track-record')) activeTab = 'track-record';

  if (!builder) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Builder Profile Not Found</h2>
        <Link to="/rera" style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: '#0891b2', color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}>
          Return to RERA Directory
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

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Legal Disclaimer */}
      <div style={{ background: '#fffbebf', border: '1px solid #fde68a', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#b45309' }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div><strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice. Never declare a builder fraudulent unless an official competent source establishes that fact.</div>
      </div>

      {/* Back Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => navigate('/rera')} style={{ background: 'none', border: 'none', color: '#0891b2', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}>
          <ArrowLeft size={16} /> Back to RERA Directory
        </button>

        <button onClick={handleShare} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share'}
        </button>
      </div>

      {/* Main Header */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.2rem' }}>
              Promoter Reg #{builder.promoterRegistrationId} · Est. {builder.incorporationYear}
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
              {builder.builderName}
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Headquarters: {builder.headquarters} · Directors: {builder.directors.join(', ')}
            </div>
          </div>

          <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: 14, padding: '0.85rem 1.25rem', textAlign: 'right' }}>
            <div style={{ fontSize: '0.74rem', color: '#0e7490', fontWeight: 700, textTransform: 'uppercase' }}>
              Track Record Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0891b2', marginTop: '0.1rem' }}>
              {builder.trackRecordScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <Link to={`/rera/builders/${builder.id}`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'overview' ? '3px solid #0891b2' : '3px solid transparent', color: activeTab === 'overview' ? '#0891b2' : '#64748b', fontWeight: activeTab === 'overview' ? 800 : 600, fontSize: '0.88rem', textDecoration: 'none' }}>
          Promoter Profile
        </Link>
        <Link to={`/rera/builders/${builder.id}/track-record`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'track-record' ? '3px solid #0891b2' : '3px solid transparent', color: activeTab === 'track-record' ? '#0891b2' : '#64748b', fontWeight: activeTab === 'track-record' ? 800 : 600, fontSize: '0.88rem', textDecoration: 'none' }}>
          Delivery Track Record ({builder.projects.length} Projects)
        </Link>
      </div>

      {/* Content Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Registered Projects</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{builder.totalRegisteredProjects}</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Units Delivered</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>{builder.totalUnitsDelivered.toLocaleString()}</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Documented Delays</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>{builder.delayedProjectsCount} Projects</div>
          </div>
        </div>
      )}

      {/* Content Track Record */}
      {activeTab === 'track-record' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
            Promoter Projects Track Record
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {builder.projects.map((p) => (
              <div key={p.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.projectName}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Reg #{p.reraRegistrationNumber} · {p.locationName}</div>
                  </div>
                  <Link to={`/rera/projects/${p.id}`} style={{ fontSize: '0.78rem', color: '#0891b2', fontWeight: 700, textDecoration: 'none' }}>
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
