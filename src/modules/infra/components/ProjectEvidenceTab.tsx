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
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <FileText size={18} style={{ color: 'var(--brand-ink)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Official Evidence & Source Document Repository
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
          Verified government publications, gazette PDFs, MoSPI flash reports, and CAG audits supporting this project. All documents link directly to authoritative primary sources.
        </p>
      </div>

      {/* Primary Evidence Documents List */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', marginTop: 0, marginBottom: '1.25rem' }}>
          Attached Public Documents ({project.evidenceDocuments.length})
        </h4>

        {project.evidenceDocuments.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: 'var(--ink-3)' }}>No public evidence documents attached yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {project.evidenceDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 12,
                  padding: '1.15rem',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{
                        background: 'var(--brand-soft)',
                        color: 'var(--brand-ink)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.18rem 0.6rem',
                        borderRadius: 6
                      }}>
                        {doc.documentType}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--ink-3)', fontWeight: 600 }}>
                        Published {doc.publishDate} · {doc.fileSize}
                      </span>
                    </div>

                    <h5 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--ink)', margin: '0.2rem 0' }}>
                      {doc.title}
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-2)', fontWeight: 600 }}>
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
                      background: 'var(--brand)',
                      color: 'var(--on-solid)',
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
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.84rem',
                  color: 'var(--ink-2)',
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
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--good)' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Master Data Source Gateway
          </h4>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--ink-2)', margin: '0 0 1rem', lineHeight: 1.5 }}>
          All project attributes, financial releases, and milestone clearings are mapped to the primary source portal:
        </p>

        <div style={{
          background: 'var(--surface-2)',
          padding: '1rem 1.15rem',
          borderRadius: 12,
          border: '1px solid var(--border-strong)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)' }}>
              {project.originalSource.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
              Portal URL: {project.originalSource.url}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>
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
              background: 'var(--accent-solid)',
              color: 'var(--on-solid)',
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
