import React from 'react';
import type { InfraProject } from '../types/projectInfra';
import { 
  Building2, 
  HardHat, 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Calendar,
  Layers
} from 'lucide-react';

interface ProjectOverviewTabProps {
  project: InfraProject;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ project }) => {
  const origCr = (project.budgetOriginalLakhs / 100).toFixed(2);
  const antCr = (project.budgetAnticipatedLakhs / 100).toFixed(2);
  const expCr = (project.expenditureToDateLakhs / 100).toFixed(2);

  const renderClearanceBadge = (val: string) => {
    switch (val) {
      case 'Approved':
      case 'Completed':
        return <span style={{ color: 'var(--good)', fontWeight: 700 }}>✓ Approved / Completed</span>;
      case 'In Progress':
        return <span style={{ color: 'var(--warn)', fontWeight: 700 }}>In Progress</span>;
      case 'Pending':
        return <span style={{ color: 'var(--bad)', fontWeight: 700 }}>Pending Clearance</span>;
      default:
        return <span style={{ color: 'var(--ink-3)' }}>N/A (Not Applicable)</span>;
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* High Level Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Original Sanctioned Cost</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>₹{origCr} Cr</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>Sanctioned by {project.sanctioningBody}</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Revised / Anticipated Cost</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-ink)', marginTop: '0.2rem' }}>₹{antCr} Cr</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>Target Completion: {project.anticipatedCompletionDate}</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Expenditure Disbursed To Date</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--good)', marginTop: '0.2rem' }}>₹{expCr} Cr</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>{project.progressFinancial}% Financial Disbursed</div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Physical Milestone Progress</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-ink)', marginTop: '0.2rem' }}>{project.progressPhysical}%</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>Verified Ground Audit</div>
        </div>
      </div>

      {/* Authorities & Lead Contractor Details Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} style={{ color: 'var(--brand-ink)' }} /> Governing Authorities & Contracting Entity
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Administrative Ministry</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.ministry}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Implementing Agency</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.implementingAgency}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsible Public Officer</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.responsibleOfficer}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>{project.responsibleOfficerDesignation}</div>
            <a
              href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(project.responsibleOfficer + ' ' + project.implementingAgency)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.74rem',
                color: '#0a66c2',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.35rem'
              }}
            >
              Verify Officer on LinkedIn <ExternalLink size={11} />
            </a>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lead Contractor / JV</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.leadContractor}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>Reg ID: {project.contractorDetails.registrationNumber}</div>
            <a
              href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(project.leadContractor)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.74rem',
                color: '#0a66c2',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.35rem'
              }}
            >
              Company Profile on LinkedIn <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Clearances Status Grid */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--good)' }} /> Statutory Clearances & Right of Way Checklist
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Land Acquisition</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.clearances.landAcquisition}% Completed</div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Forest Clearance</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>{renderClearanceBadge(project.clearances.forestClearance)}</div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Environmental Clearance</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>{renderClearanceBadge(project.clearances.environmentalClearance)}</div>
          </div>

          <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 600 }}>Utility Line Relocation</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>{renderClearanceBadge(project.clearances.utilityShifting)}</div>
          </div>
        </div>
      </div>

      {/* Original Source Reference Box */}
      <div style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Authoritative Source Attribution</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.2rem' }}>{project.originalSource.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', marginTop: '0.1rem' }}>
            Last Synced: {project.originalSource.lastUpdated} · Ref: {project.originalSource.publicationRef || 'N/A'}
          </div>
        </div>

        <a
          href={project.originalSource.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.55rem 1.1rem',
            borderRadius: 10,
            background: 'var(--brand)',
            color: 'var(--on-solid)',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          Verify Original Source <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
