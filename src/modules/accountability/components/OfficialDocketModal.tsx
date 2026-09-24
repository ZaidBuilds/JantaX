import React, { useState } from 'react';
import { 
  CertifiedDocketData, 
  printCertifiedDocket 
} from '../services/docketExportService';
import { 
  Printer, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  ExternalLink, 
  FileText,
  Lock,
  Download
} from 'lucide-react';

interface OfficialDocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  docketData: CertifiedDocketData;
}

export const OfficialDocketModal: React.FC<OfficialDocketModalProps> = ({
  isOpen,
  onClose,
  docketData
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const raw = `${docketData.title}
Docket ID: ${docketData.docketId}
Statutory Act: ${docketData.statutoryAct}
Department: ${docketData.department}
Authority: ${docketData.authorityName}
Locality PIN: ${docketData.pinCode} (${docketData.district}, ${docketData.state})
Date: ${docketData.dateOfIssue}
SHA-256 Cryptographic Seal: ${docketData.sha256Seal}

STATEMENT OF FACTS:
${docketData.bodyText}

STATUTORY CLAUSES CITED:
${docketData.statutoryClausesCited.map(c => `- ${c}`).join('\n')}

VERIFICATION URL:
${docketData.verificationUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    printCertifiedDocket(docketData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#f8fafc',
        borderRadius: 20,
        maxWidth: 860,
        width: '100%',
        maxHeight: '92vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>

        {/* Modal Top Header Action Bar */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>
              Certified Official Statutory Docket Preview
            </span>
            <span style={{
              background: '#0369a1',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '0.15rem 0.5rem',
              borderRadius: 4
            }}>
              A4 PRINT SPEC
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopy}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                borderRadius: 8,
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>

            <button
              onClick={handlePrint}
              style={{
                background: 'var(--gradient-accent, #f97316)',
                border: 'none',
                color: '#ffffff',
                borderRadius: 8,
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(249,115,22,0.35)'
              }}
            >
              <Printer size={13} /> Save as PDF / Print Docket
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem',
                marginLeft: '0.25rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Surface (Simulates A4 Page) */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          flex: 1,
          background: '#cbd5e1',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: 720,
            width: '100%',
            padding: '2.5rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            borderRadius: 6,
            fontFamily: 'Times New Roman, serif',
            color: '#0f172a',
            lineHeight: 1.55,
            fontSize: '0.94rem'
          }}>

            {/* Emblem Banner */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                OFFICIAL STATUTORY CIVIC DOCKET
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                DEMOCRATIC ACCOUNTABILITY & TRANSPARENCY ARCHIVE (JANTAX PLATFORM)
              </div>
            </div>

            {/* Statutory Act Tag */}
            <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.25rem' }}>
              FILED UNDER: {docketData.statutoryAct.toUpperCase()}
            </div>

            {/* Metadata Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.82rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: 4 }}>
              <div>
                <span style={{ color: '#64748b' }}>Docket Ref:</span> <strong>{docketData.docketId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Date of Issue:</span> <strong>{docketData.dateOfIssue}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Nodal Department:</span> <strong>{docketData.department}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Postal Locality:</span> <strong>PIN {docketData.pinCode} ({docketData.district})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Target Authority:</span> <strong>{docketData.authorityName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Complainant:</span> <strong>{docketData.auditorName}</strong>
              </div>
            </div>

            {/* Section I: Prayer */}
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.2rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              I. Formal Prayer & Subject Matter
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '0.96rem', marginBottom: '0.3rem' }}>
              {docketData.title}
            </div>
            <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {docketData.subtitle}
            </div>

            {/* Section II: Statement of Facts */}
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.2rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              II. Statement of Facts & Grievance Particulars
            </div>
            <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {docketData.bodyText}
            </div>

            {/* Section III: Statutory Clauses Cited */}
            <div style={{ fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.2rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              III. Statutory Clauses & Standards Cited
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.84rem', margin: '0 0 1.25rem' }}>
              {docketData.statutoryClausesCited.map((clause, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{clause}</li>
              ))}
            </ul>

            {/* Non-Repudiation Cryptographic Seal Box */}
            <div style={{
              border: '1px dashed #64748b',
              background: '#f8fafc',
              padding: '0.75rem 1rem',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              lineHeight: 1.5,
              marginTop: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0f172a', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                <Lock size={13} style={{ color: '#2563eb' }} />
                NON-REPUDIATION CRYPTOGRAPHIC PROOF (JANTAX VERIFIED)
              </div>
              <div>SHA-256 Seal: <span style={{ color: '#1e40af', wordBreak: 'break-all' }}>{docketData.sha256Seal}</span></div>
              <div>Digital Verification URL: <span style={{ color: '#0369a1' }}>{docketData.verificationUrl}</span></div>
              <div style={{ color: '#059669', fontWeight: 'bold', marginTop: '0.2rem' }}>
                ✓ GPS Geofence Centroid Match Verified (&lt; 15 km Postal Boundary)
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem' }}>
              Generated via JantaX Open Civic OS · Immutable Hash Registered Under Public Proof Protocols
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
