import React from 'react';
import type { ReportCategory } from '../types/citizenReport';
import { MapPin, ShieldCheck, UserCheck, EyeOff, FileText, Camera } from 'lucide-react';

interface ReportPreviewProps {
  title: string;
  category: ReportCategory;
  description: string;
  pinCode: string;
  landmark: string;
  district: string;
  state: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  evidenceFiles: Array<{ url: string; fileName: string; fileSize: string; mediaType: 'image' | 'video' }>;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  title,
  category,
  description,
  pinCode,
  landmark,
  district,
  state,
  isAnonymous,
  reporterName,
  reporterContact,
  evidenceFiles
}) => {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(15,23,42,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Pre-Submission Report Summary & Review
        </h3>
        <span style={{
          background: isAnonymous ? '#eff6ff' : '#f8fafc',
          border: '1px solid #cbd5e1',
          color: isAnonymous ? '#1d4ed8' : '#475569',
          fontSize: '0.74rem',
          fontWeight: 700,
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {isAnonymous ? <EyeOff size={12} /> : <UserCheck size={12} />}
          {isAnonymous ? 'Anonymous Submission' : 'Public Auditor Identity'}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ background: '#f97316', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 6 }}>
            Category: {category}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={13} style={{ color: '#ea580c' }} /> PIN {pinCode} · {landmark}, {district}, {state}
          </span>
        </div>

        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.4rem' }}>
            {title || 'Untitled Issue Report'}
          </h4>
          <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.55 }}>
            {description || 'No description provided.'}
          </p>
        </div>

        {/* Attached Evidence Previews */}
        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Attached Media Evidence ({evidenceFiles.length})
          </div>
          {evidenceFiles.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No media attached.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {evidenceFiles.map((file, i) => (
                <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', height: 90 }}>
                  <img src={file.url} alt={file.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy & Data Minimization Note */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #f1f5f9',
          borderRadius: 10,
          padding: '0.65rem 0.85rem',
          fontSize: '0.78rem',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <ShieldCheck size={15} style={{ color: '#10b981' }} />
          <span><strong>Data Minimization:</strong> {isAnonymous ? 'No personal contact information stored.' : `Reporter: ${reporterName || 'N/A'} (${reporterContact || 'N/A'})`}</span>
        </div>
      </div>
    </div>
  );
};
