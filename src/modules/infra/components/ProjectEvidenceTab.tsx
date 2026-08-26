import React from 'react';
import type { InfraProject } from '../types/projectInfra';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Building2, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ProjectEvidenceTabProps {
  project: InfraProject;
}

export const ProjectEvidenceTab: React.FC<ProjectEvidenceTabProps> = ({ project }) => {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Evidence Banner */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <FileText size={18} style={{ color: '#2563eb' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Official Evidence & Source Document Repository
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          Verified government publications, gazette PDFs, MoSPI flash reports, and CAG audits supporting this project. All documents link directly to authoritative primary sources.
        </p>
      </div>

      {/* Primary Evidence Documents List */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem' }}>
          Attached Public Documents ({project.evidenceDocuments.length})
        </h4>

        {project.evidenceDocuments.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: '#64748b' }}>No public evidence documents attached yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {project.evidenceDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '1.15rem',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.18rem 0.6rem',
                        borderRadius: 6
                      }}>
                        {doc.documentType}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                        Published {doc.publishDate} · {doc.fileSize}
                      </span>
                    </div>

                    <h5 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                      {doc.title}
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                      Issuing Body: {doc.issuingBody}
                    </div>
                  </div>

                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 8,
                      background: '#0f2d59',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>Download / View PDF</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: 8,
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.84rem',
                  color: '#334155',
                  marginTop: '0.85rem',
                  lineHeight: 1.45
                }}>
                  <strong>Document Summary:</strong> {doc.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Data Gateway Source Box */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <ShieldCheck size={20} style={{ color: '#059669' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Master Data Source Gateway
          </h4>
        </div>
        <p style={{ fontSize: '0.86rem', color: '#475569', margin: '0 0 1rem', lineHeight: 1.5 }}>
          All project attributes, financial releases, and milestone clearings are mapped to the primary source portal:
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '1rem 1.15rem',
          borderRadius: 12,
          border: '1px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2d59' }}>
              {project.originalSource.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
              Portal URL: {project.originalSource.url}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Last Verified Sync: {project.originalSource.lastUpdated}
            </div>
          </div>

          <a
            href={project.originalSource.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              background: '#f97316',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Visit Government Portal <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
