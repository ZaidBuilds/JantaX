import React, { useState } from 'react';
import type { CitizenReport } from '../types/citizenReport';
import type { OfficialTrackingRecord } from '../types/officialAction';
import { generateGrievanceDraft, getOfficialTracking, verifyResolution } from '../services/reportingService';
import { CitizenDossierModal } from '../../accountability/components/CitizenDossierModal';
import { 
  Building2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Layers,
  Send,
  HelpCircle,
  Scale
} from 'lucide-react';

interface OfficialActionLayerProps {
  report: CitizenReport;
}

export const OfficialActionLayer: React.FC<OfficialActionLayerProps> = ({ report }) => {
  const draft = generateGrievanceDraft(report);
  const [tracking, setTracking] = useState<OfficialTrackingRecord | undefined>(() => getOfficialTracking(report.id));
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierTab, setDossierTab] = useState<'rti' | 'lokayukta' | 'dossier'>('rti');

  // SLA Watchdog calculation
  const reportDate = new Date(report.createdAt);
  const now = new Date();
  const daysElapsed = Math.max(1, Math.floor((now.getTime() - (isNaN(reportDate.getTime()) ? now.getTime() - 32 * 86400000 : reportDate.getTime())) / (1000 * 60 * 60 * 24)));
  const isSlaBreached = daysElapsed >= 30 || tracking?.status === 'Pending First Appeal' || tracking?.resolutionVerification?.verificationStatus === 'Paper Closure Flagged';

  // Ground Verification Form State
  const [isGroundFixed, setIsGroundFixed] = useState(true);
  const [groundCheckNote, setGroundCheckNote] = useState('');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  const handleCopyDraft = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(draft.structuredBodyText);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = verifyResolution(report.id, isGroundFixed, groundCheckNote);
    if (updated) setTracking(updated);
    setVerificationSubmitted(true);
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* TRUTHFULNESS & TRANSPARENCY NOTICE */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 14,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.86rem',
        color: '#1e40af'
      }}>
        <ShieldCheck size={22} style={{ flexShrink: 0, color: '#2563eb' }} />
        <div>
          <strong>JantaX Official Action Layer:</strong> JantaX provides structured grievance drafting and tracking integration with official government portals (CPGRAMS / State IPGRS). JantaX never pretends to submit a complaint unless connected via an authorized direct API gateway.
        </div>
      </div>

      {/* SLA STATUS & ESCALATION WATCHDOG BANNER */}
      <div style={{
        background: isSlaBreached ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${isSlaBreached ? '#fca5a5' : '#86efac'}`,
        borderRadius: 14,
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={24} style={{ color: isSlaBreached ? '#dc2626' : '#16a34a', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSlaBreached ? '#991b1b' : '#166534' }}>
              {isSlaBreached 
                ? `⚠️ Statutory SLA Breached (${daysElapsed} Days Active — Mandated Window 30 Days)`
                : `⏱️ Within Citizen Charter SLA Window (${daysElapsed}/30 Days Elapsed)`
              }
            </div>
            <div style={{ fontSize: '0.82rem', color: isSlaBreached ? '#7f1d1d' : '#14532d', marginTop: '0.2rem' }}>
              {isSlaBreached
                ? 'Department has exceeded mandated disposal window. You have statutory standing to escalate via Section 6(1) RTI inquiry or Lokayukta complaint.'
                : 'Under Citizen Charter rules, the nodal department is mandated to redress within 30 days.'
              }
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setDossierTab('rti');
              setIsDossierOpen(true);
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 8,
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
            }}
          >
            <FileText size={14} /> 1-Click RTI Escalation
          </button>
          <button
            onClick={() => {
              setDossierTab('lokayukta');
              setIsDossierOpen(true);
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 8,
              background: '#1e293b',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Scale size={14} /> Lokayukta Complaint
          </button>
        </div>
      </div>

      {/* AUTHORITY MATRIX & DRAFT GENERATOR CARD */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#b45309',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Draft Generated by JantaX — Official Portal Submission Required
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>
              Designated Authority: {draft.relevantAuthorityName}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Department: {draft.department} · Nodal Designation: {draft.nodalOfficerDesignation}
            </div>
          </div>

          <a
            href={draft.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              background: 'var(--gradient-accent)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.86rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(249,115,22,0.3)'
            }}
          >
            Launch Official Portal <ExternalLink size={14} />
          </a>
        </div>

        {/* Structured Grievance Text Container */}
        <div style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: 14, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.5, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#fb923c', fontWeight: 700 }}>STRUCTURED COMPLAINT DRAFT</span>
            <button
              onClick={handleCopyDraft}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {copiedDraft ? <Check size={12} /> : <Copy size={12} />}
              {copiedDraft ? 'Copied to Clipboard!' : 'Copy Draft Text'}
            </button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
            {draft.structuredBodyText}
          </pre>
        </div>
      </div>

      {/* OFFICIAL SYSTEM REFERENCE TRACKING CARD */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
          Official Government System Reference & Tracking
        </h3>

        {!tracking ? (
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <HelpCircle size={28} style={{ color: '#94a3b8', marginBottom: '0.4rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>No Official Reference Number Linked Yet</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
              Once submitted on CPGRAMS or State Jan Sunwai, link your official acknowledgment reference number here for automated status tracking.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {/* Metadata Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', background: '#f8fafc', padding: '1rem', borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Official System</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{tracking.official_system}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Reference Number</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{tracking.reference_number}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Submission Time</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{tracking.submission_time}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Official Status</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: tracking.status === 'Disposed / Resolved' ? '#047857' : '#b45309' }}>
                  {tracking.status}
                </div>
              </div>
            </div>

            {/* Official Responses Timeline */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem' }}>
                Official Nodal Officer Responses ({tracking.responses.length})
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {tracking.responses.map((resp) => (
                  <div key={resp.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 800 }}>{resp.responseDate}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
                          {resp.officerName} ({resp.officerDesignation})
                        </div>
                      </div>
                      {resp.sourcePdfUrl && (
                        <a href={resp.sourcePdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.74rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          Official Disposal PDF <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.5rem', lineHeight: 1.5 }}>
                      {resp.responseText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CITIZEN RESOLUTION VERIFICATION CARD */}
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={18} /> Ground Verification: {tracking.resolutionVerification.verificationStatus}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857' }}>
                  Verification Score: {tracking.resolutionVerification.groundCheckScore}/100
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#065f46', marginBottom: '1rem', lineHeight: 1.5 }}>
                {tracking.resolutionVerification.citizenFeedbackNote}
              </div>

              {/* Resolution Verification Input */}
              {!verificationSubmitted ? (
                <form onSubmit={handleVerifySubmit} style={{ background: '#ffffff', borderRadius: 10, padding: '1rem', border: '1px solid #6ee7b7' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Conduct Physical Ground Check: Is this issue truly fixed on the ground?
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857', cursor: 'pointer' }}>
                      <input type="radio" name="groundFix" checked={isGroundFixed} onChange={() => setIsGroundFixed(true)} /> Yes, Truly Rectified
                    </label>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b91c1c', cursor: 'pointer' }}>
                      <input type="radio" name="groundFix" checked={!isGroundFixed} onChange={() => setIsGroundFixed(false)} /> No, Closed Only on Paper
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter ground verification observations..."
                    value={groundCheckNote}
                    onChange={(e) => setGroundCheckNote(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', marginBottom: '0.75rem' }}
                    required
                  />
                  <button type="submit" style={{ padding: '0.45rem 1rem', borderRadius: 8, background: '#047857', color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                    Submit Ground Verification
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
                  ✓ Ground check feedback recorded. Thank you for maintaining civic data accuracy.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1-CLICK CITIZEN DOSSIER & STATUTORY RTI MODAL */}
      <CitizenDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        defaultTab={dossierTab}
        rtiOptions={{
          publicAuthority: draft.relevantAuthorityName,
          department: draft.department,
          workTitle: report.title,
          workOrderNo: tracking?.reference_number || `REF-${report.id.toUpperCase()}`,
          localityPin: report.location.pinCode,
          specificIssue: `${report.description} (Reported via JantaX at ${report.location.landmark || report.location.district})`
        }}
        lokayuktaOptions={{
          complaintTitle: `Gross Administrative Delay & Public Negligence: ${report.title}`,
          authorityOrOfficer: `${draft.nodalOfficerDesignation}, ${draft.relevantAuthorityName}`,
          department: draft.department,
          allegationSummary: `Statutory citizen grievance ${tracking?.reference_number || report.id} regarding "${report.title}" in PIN ${report.location.pinCode} remains unrectified exceeding statutory Citizen Charter timeframes.`,
          localityPin: report.location.pinCode,
          evidenceUrls: report.evidence.map(e => e.url)
        }}
      />
    </div>
  );
};
