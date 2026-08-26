import React from 'react';
import type { InfraProject, NeutralStatus } from '../types/projectInfra';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  AlertCircle, 
  FileText,
  FileCheck
} from 'lucide-react';

interface ProjectTimelineTabProps {
  project: InfraProject;
}

export const ProjectTimelineTab: React.FC<ProjectTimelineTabProps> = ({ project }) => {
  const getStatusBadgeStyle = (status: NeutralStatus) => {
    switch (status) {
      case 'Completed':
      case 'Verified':
        return { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857', icon: <CheckCircle2 size={13} /> };
      case 'Extended':
      case 'Delayed':
        return { bg: '#fffbebf', border: '#fde68a', color: '#b45309', icon: <Clock size={13} /> };
      case 'Incomplete':
        return { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: <Clock size={13} /> };
      case 'Under Review':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: <ShieldCheck size={13} /> };
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Neutral Language Timeline Banner */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Calendar size={18} style={{ color: '#f97316' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Source-Linked Project History & Schedule Log
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          Chronological events verified from government publications, gazette notices, CPPP procurement records, and MoSPI flash reports. Neutral terminology strictly enforced.
        </p>
      </div>

      {/* Target Schedule vs Extension Summary Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: '1.25rem 1.5rem'
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', marginTop: 0, marginBottom: '0.85rem' }}>
          Key Dates & Extension Approvals
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Start Date</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{project.startDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Original Target Deadline</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{project.originalCompletionDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Anticipated Target Completion</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f97316' }}>{project.anticipatedCompletionDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Extensions Granted</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{project.extensions.length} Extension(s)</div>
          </div>
        </div>

        {/* Extensions Table */}
        {project.extensions.length > 0 && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.65rem' }}>
              Approved Extension Records:
            </div>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {project.extensions.map((ext) => (
                <div
                  key={ext.id}
                  style={{
                    background: '#fffbebf',
                    border: '1px solid #fde68a',
                    borderRadius: 10,
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#b45309' }}>
                      + {ext.grantedMonths} Months Granted ({ext.grantDate}) → New Deadline: {ext.revisedCompletionDate}
                    </span>
                    <a
                      href={ext.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      {ext.sourceTitle} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ color: '#475569', marginTop: '0.25rem' }}>
                    <strong>Neutral Reason:</strong> {ext.neutralReason} (Approved by: {ext.approvingAuthority})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Source-Linked Timeline Chain */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.5rem' }}>
          Chronological Source-Linked History
        </h4>

        <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0' }}>
          {project.history.map((event, index) => {
            const badgeStyle = getStatusBadgeStyle(event.statusBadge);

            return (
              <div
                key={event.id}
                style={{
                  position: 'relative',
                  marginBottom: index === project.history.length - 1 ? 0 : '1.75rem'
                }}
              >
                {/* Bullet point dot */}
                <div style={{
                  position: 'absolute',
                  left: '-2.15rem',
                  top: '0.15rem',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '3px solid #f97316',
                  boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.15)'
                }} />

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '1rem 1.15rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        {event.date} · {event.eventType}
                      </span>
                      <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0 0' }}>
                        {event.title}
                      </h5>
                    </div>

                    <span style={{
                      background: badgeStyle.bg,
                      border: `1px solid ${badgeStyle.border}`,
                      color: badgeStyle.color,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {badgeStyle.icon} {event.statusBadge}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#334155', margin: '0.4rem 0 0.75rem', lineHeight: 1.5 }}>
                    {event.neutralDescription}
                  </p>

                  {/* Clickable Source Badge */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.76rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <FileCheck size={14} style={{ color: '#059669' }} />
                    <span style={{ color: '#475569' }}>Source Reference:</span>
                    <a
                      href={event.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      {event.source.title} ({event.source.publisher}) <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
