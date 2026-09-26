import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getReraProjectById } from '../services/reraService';
import type { ReraProject } from '../types/reraIntelligence';
import { 
  ArrowLeft, 
  Home, 
  ExternalLink, 
  ShieldCheck, 
  Scale, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock,
  Share2
} from 'lucide-react';

interface ReraProjectDetailPageProps {
  initialTab?: 'overview' | 'orders';
}

export function ReraProjectDetailPage({ initialTab }: ReraProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState<ReraProject | undefined>(() => id ? getReraProjectById(id) : undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      setProject(getReraProjectById(id));
    }
  }, [id]);

  const currentPath = location.pathname;
  let activeTab: 'overview' | 'orders' = initialTab || 'overview';
  if (currentPath.endsWith('/orders')) activeTab = 'orders';

  if (!project) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>RERA Project Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested RERA project ID "{id}" was not found.
        </p>
        <Link to="/rera" style={{ padding: '0.65rem 1.25rem', borderRadius: 10, background: 'var(--viz-6)', color: 'var(--on-solid)', fontWeight: 700, textDecoration: 'none' }}>
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
    <div>
      {/* Legal Disclaimer */}
      <div style={{ background: '#fffbebf', border: '1px solid var(--warn-line)', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--warn)' }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div><strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice. All adjudications are sourced directly from competent State RERA Authorities.</div>
      </div>

      {/* Back Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button onClick={() => navigate('/rera')} style={{ background: 'none', border: 'none', color: 'var(--viz-6)', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}>
          <ArrowLeft size={16} /> Back to RERA Directory
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleShare} style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share'}
          </button>
          <a href={project.originalSource.url} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--viz-6)', color: 'var(--on-solid)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            State RERA Register <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
          {/* Provenance Badges */}
          <span style={{ background: 'var(--info-soft)', border: '1px solid #a5f3fc', color: 'var(--viz-6)', fontSize: '0.75rem', fontWeight: 700, padding: '0.18rem 0.6rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={12} /> Provenance: {project.statusProvenances.officialStatus}
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--ink-3)', fontWeight: 600 }}>
            {project.statePortal} · Reg #{project.reraRegistrationNumber}
          </span>
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
          {project.projectName}
        </h1>
        <div style={{ fontSize: '0.95rem', color: 'var(--ink-3)', marginBottom: '1.25rem' }}>
          Promoter: <Link to={`/rera/builders/${project.builderId}`} style={{ color: 'var(--viz-6)', fontWeight: 700, textDecoration: 'none' }}>{project.builderName}</Link> · {project.locationName}, {project.district} (PIN {project.pinCode})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', background: 'var(--surface-2)', padding: '1rem', borderRadius: 12 }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', fontWeight: 600 }}>Promised Completion</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>{project.promisedCompletionDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', fontWeight: 600 }}>Revised Completion</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-ink)' }}>{project.revisedCompletionDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', fontWeight: 600 }}>Documented Delay</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--warn)' }}>
              {project.documentedDelayMonths} Mos
              <span style={{ fontSize: '0.68rem', background: 'var(--info-soft)', color: 'var(--viz-6)', padding: '1px 4px', borderRadius: 4, marginLeft: 4 }}>
                {project.statusProvenances.delayCalculation}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', fontWeight: 600 }}>Total Housing Units</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>{project.totalUnits} Units</div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        <Link to={`/rera/projects/${project.id}`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'overview' ? '3px solid var(--viz-6)' : '3px solid transparent', color: activeTab === 'overview' ? 'var(--viz-6)' : 'var(--ink-3)', fontWeight: activeTab === 'overview' ? 800 : 600, fontSize: '0.88rem', textDecoration: 'none' }}>
          Project Overview
        </Link>
        <Link to={`/rera/projects/${project.id}/orders`} style={{ padding: '0.65rem 1.15rem', borderBottom: activeTab === 'orders' ? '3px solid var(--viz-6)' : '3px solid transparent', color: activeTab === 'orders' ? 'var(--viz-6)' : 'var(--ink-3)', fontWeight: activeTab === 'orders' ? 800 : 600, fontSize: '0.88rem', textDecoration: 'none' }}>
          RERA Tribunal Orders & Adjudications ({project.orders.length})
        </Link>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1rem' }}>
            RERA Registration Attributes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>Project Type</div><div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{project.projectType}</div></div>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>Extensions Granted</div><div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{project.extensionsGranted} Extension(s)</div></div>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>Units Sold</div><div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{project.soldUnits} / {project.totalUnits} Units</div></div>
          </div>
        </div>
      )}

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1rem' }}>
            Official RERA Tribunal Adjudication Orders ({project.orders.length})
          </h3>

          {project.orders.length === 0 ? (
            <div style={{ fontSize: '0.86rem', color: 'var(--ink-3)' }}>No formal RERA tribunal orders or complaints filed against this project.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {project.orders.map((ord) => (
                <div key={ord.id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', background: 'var(--info-soft)', color: 'var(--viz-6)', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 4 }}>
                        {ord.provenance}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: '0.3rem 0 0.2rem' }}>
                        Order #{ord.orderNumber} ({ord.adjudicationDate})
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>Bench: {ord.benchName} · Complainant: {ord.complainantType}</div>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--good)', background: 'var(--good-soft)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                      Status: {ord.complianceStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--ink-2)', marginTop: '0.65rem', lineHeight: 1.5 }}>
                    <strong>Order Summary (Neutral):</strong> {ord.summaryNeutral}
                  </div>
                  <a href={ord.sourcePdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.76rem', color: 'var(--viz-6)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.6rem' }}>
                    Download Official Order PDF ({ord.sourceTitle}) <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
