import React, { useState } from 'react';
import { generateDgroPetition } from '../services/pdsAuditService';

interface Props {
  pinCode: string;
  fpsLicenseNo: string;
  onClose: () => void;
}

export function DgroPetitionModal({ pinCode, fpsLicenseNo, onClose }: Props) {
  const [petitionerName, setPetitionerName] = useState('');
  const [complaintNature, setComplaintNature] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState(new Date().toISOString().slice(0, 10));
  const [generatedPetition, setGeneratedPetition] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!petitionerName.trim() || !complaintNature.trim()) return;

    const petition = generateDgroPetition({
      petitionerName: petitionerName.trim(),
      pinCode,
      fpsLicenseNo,
      complaintNature: complaintNature.trim(),
      nfsaSectionRef: 'Section 15, NFSA 2013',
      dateOfIncident,
    });

    setGeneratedPetition(petition);
  };

  const handleCopy = async () => {
    if (!generatedPetition) return;
    try {
      await navigator.clipboard.writeText(generatedPetition);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = generatedPetition;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1.5px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
              📋 DGRO Petition Generator
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              NFSA Section 15 — जिला शिकायत निवारण अधिकारी को आवेदन
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!generatedPetition ? (
            /* ── Input Form ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  fontSize: '0.78rem',
                  color: '#1e40af',
                }}
              >
                FPS License: <strong>{fpsLicenseNo}</strong> · PIN: <strong>{pinCode}</strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: '#334155' }}>
                  आवेदक का नाम / Petitioner Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={petitionerName}
                  onChange={(e) => setPetitionerName(e.target.value)}
                  placeholder="Enter your name / अपना नाम दर्ज करें"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: '#334155' }}>
                  शिकायत का विवरण / Nature of Complaint *
                </label>
                <textarea
                  className="form-input"
                  value={complaintNature}
                  onChange={(e) => setComplaintNature(e.target.value)}
                  placeholder="Describe the issue in detail / समस्या का विस्तृत विवरण दें"
                  rows={4}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: '#334155' }}>
                  घटना की तिथि / Date of Incident
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={dateOfIncident}
                  onChange={(e) => setDateOfIncident(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!petitionerName.trim() || !complaintNature.trim()}
                style={{
                  padding: '0.7rem 1.5rem',
                  borderRadius: 10,
                  background: !petitionerName.trim() || !complaintNature.trim() ? '#cbd5e1' : '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: !petitionerName.trim() || !complaintNature.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                📄 Generate DGRO Petition / आवेदन तैयार करें
              </button>
            </div>
          ) : (
            /* ── Generated Petition Display ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <pre
                style={{
                  background: '#fefce8',
                  border: '1.5px solid #fde68a',
                  borderRadius: 10,
                  padding: '1.25rem',
                  fontSize: '0.76rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#1c1917',
                  fontFamily: "'Noto Sans Devanagari', 'Inter', monospace",
                  maxHeight: '50vh',
                  overflow: 'auto',
                }}
              >
                {generatedPetition}
              </pre>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setGeneratedPetition(null)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  ← Edit / संपादित करें
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 8,
                    background: copied ? '#10b981' : '#2563eb',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minWidth: 160,
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  padding: '0.6rem 0.8rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                ⚖️ This petition is formatted under NFSA Section 15 for submission to the District Grievance
                Redressal Officer (DGRO). For legal assistance, contact DLSA (District Legal Services Authority).
                JantaX provides this as an informational template only.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
