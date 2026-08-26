import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  getProjectById 
} from '../services/projectService';
import type { InfraProject, NeutralStatus } from '../types/projectInfra';
import { ProjectOverviewTab } from '../components/ProjectOverviewTab';
import { ProjectTimelineTab } from '../components/ProjectTimelineTab';
import { ProjectFinancialsTab } from '../components/ProjectFinancialsTab';
import { ProjectEvidenceTab } from '../components/ProjectEvidenceTab';
import { ProjectGroundTruthTab } from '../components/ProjectGroundTruthTab';
import { 
  ArrowLeft, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Eye, 
  Calendar, 
  IndianRupee, 
  FileText, 
  Building2,
  Share2
} from 'lucide-react';

interface ProjectDetailPageProps {
  initialTab?: 'overview' | 'timeline' | 'financials' | 'evidence' | 'ground-truth';
}

export function ProjectDetailPage({ initialTab }: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState<InfraProject | undefined>(() => id ? getProjectById(id) : undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const p = getProjectById(id);
      setProject(p);
    }
  }, [id]);

  // Determine active tab from prop or URL pathname
  const currentPath = location.pathname;
  let activeTab: 'overview' | 'timeline' | 'financials' | 'evidence' | 'ground-truth' = initialTab || 'overview';

  if (currentPath.endsWith('/timeline')) activeTab = 'timeline';
  else if (currentPath.endsWith('/financials')) activeTab = 'financials';
  else if (currentPath.endsWith('/evidence')) activeTab = 'evidence';
  else if (currentPath.endsWith('/ground-truth')) activeTab = 'ground-truth';

  if (!project) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Project Not Found</h2>
        <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The requested infrastructure project ID "{id}" could not be located in the database.
        </p>
        <Link
          to="/projects"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 10,
            background: 'var(--gradient-accent)',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Return to Projects Directory
        </Link>
      </div>
    );
  }

  const getStatusBadgeStyle = (st: NeutralStatus) => {
    switch (st) {
      case 'Completed':
      case 'Verified':
        return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: <CheckCircle2 size={14} /> };
      case 'Extended':
      case 'Delayed':
        return { bg: '#fffbebf', border: '#fde68a', color: '#b45309', icon: <Clock size={14} /> };
      case 'Incomplete':
        return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: <Clock size={14} /> };
      case 'Under Review':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: <ShieldCheck size={14} /> };
    }
  };

  const badgeStyle = getStatusBadgeStyle(project.status);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Navigation Back Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          onClick={() => navigate('/projects')}
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
          <ArrowLeft size={16} /> Back to Projects Directory
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
            <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share Project'}
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
              gap: '0.35rem'
            }}
            title="Share this infrastructure report on LinkedIn"
          >
            <span>Share on LinkedIn</span> <ExternalLink size={12} />
          </a>
          <a
            href={project.originalSource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0f2d59',
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
            Original Source <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Project Title Header Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: '1.75rem',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            color: badgeStyle.color,
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0.22rem 0.75rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {badgeStyle.icon} Neutral Status: {project.status}
          </span>

          <span style={{
            background: '#f1f5f9',
            color: '#475569',
            fontSize: '0.76rem',
            fontWeight: 700,
            padding: '0.22rem 0.65rem',
            borderRadius: 6
          }}>
            {project.sector}
          </span>

          <span style={{
            fontSize: '0.78rem',
            color: '#64748b',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <MapPin size={14} style={{ color: '#ea580c' }} /> PIN {project.pinCode} · {project.locationName}, {project.district}, {project.state}
          </span>
        </div>

        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: '#0f172a',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.3,
          margin: '0.3rem 0 0.2rem'
        }}>
          {project.nameEnglish}
        </h1>
        <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500, marginBottom: '1.25rem' }}>
          {project.nameHindi}
        </div>

        {/* Quick Highlights Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          background: '#f8fafc',
          padding: '1rem 1.15rem',
          borderRadius: 12,
          border: '1px solid #f1f5f9'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Sanctioned Budget</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
              ₹{(project.budgetOriginalLakhs / 100).toFixed(1)} Cr
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Anticipated Budget</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f97316', marginTop: '0.1rem' }}>
              ₹{(project.budgetAnticipatedLakhs / 100).toFixed(1)} Cr
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Physical Progress</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857', marginTop: '0.1rem' }}>
              {project.progressPhysical}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Lead Contractor</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginTop: '0.1rem' }}>
              {project.leadContractor}
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
          to={`/projects/${project.id}`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'overview' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'overview' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'overview' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          <Eye size={16} /> Overview
        </Link>

        <Link
          to={`/projects/${project.id}/timeline`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'timeline' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'timeline' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'timeline' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          <Calendar size={16} /> Source Timeline
        </Link>

        <Link
          to={`/projects/${project.id}/financials`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'financials' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'financials' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'financials' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          <IndianRupee size={16} /> Financials & Tenders
        </Link>

        <Link
          to={`/projects/${project.id}/evidence`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'evidence' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'evidence' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'evidence' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          <FileText size={16} /> Evidence Docs ({project.evidenceDocuments.length})
        </Link>

        <Link
          to={`/projects/${project.id}/ground-truth`}
          style={{
            padding: '0.65rem 1.15rem',
            borderBottom: activeTab === 'ground-truth' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'ground-truth' ? '#f97316' : '#64748b',
            fontWeight: activeTab === 'ground-truth' ? 800 : 600,
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            marginBottom: -2
          }}
        >
          <ShieldCheck size={16} /> Ground Truth ({project.groundTruth.physicalScore}%)
        </Link>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && <ProjectOverviewTab project={project} />}
      {activeTab === 'timeline' && <ProjectTimelineTab project={project} />}
      {activeTab === 'financials' && <ProjectFinancialsTab project={project} />}
      {activeTab === 'evidence' && <ProjectEvidenceTab project={project} />}
      {activeTab === 'ground-truth' && (
        <ProjectGroundTruthTab project={project} onProjectUpdated={(upd) => setProject(upd)} />
      )}
    </div>
  );
}
