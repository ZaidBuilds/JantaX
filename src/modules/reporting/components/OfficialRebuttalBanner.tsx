import React, { useState } from 'react';
import type { CitizenReport } from '../types/citizenReport';
import type { OfficialResponseLog, OfficialTrackingRecord } from '../types/officialAction';
import { getOfficialTracking, submitOfficialRebuttal } from '../services/reportingService';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Award
} from 'lucide-react';

interface OfficialRebuttalBannerProps {
  report: CitizenReport;
  onRebuttalSubmitted?: (updated: OfficialTrackingRecord) => void;
}

export const OfficialRebuttalBanner: React.FC<OfficialRebuttalBannerProps> = ({ 
  report, 
  onRebuttalSubmitted 
}) => {
  const [tracking, setTracking] = useState<OfficialTrackingRecord | undefined>(() => getOfficialTracking(report.id));
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [officerName, setOfficerName] = useState('');
  const [officerDesignation, setOfficerDesignation] = useState('Executive Engineer (Civil)');
  const [department, setDepartment] = useState('Public Works Department (PWD)');
  const [responseText, setResponseText] = useState('');
  const [statusChangeTo, setStatusChangeTo] = useState('Disposed / Resolved');
  const [sourcePdfUrl, setSourcePdfUrl] = useState('https://jantax.gov.in/docs/sample_inspection_cert.pdf');

  const responses = tracking?.responses || [];

  const handleSubmitRebuttal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName || !responseText) return;

    const updated = submitOfficialRebuttal(report.id, {
      officerName,
      officerDesignation,
      department,
      responseText,
      statusChangeTo,
      sourcePdfUrl
    });

    setTracking(updated);
    setIsSuccess(true);
    setIsFormExpanded(false);
    if (onRebuttalSubmitted) onRebuttalSubmitted(updated);

    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 18,
      border: '1px solid #cbd5e1',
      boxShadow: '0 4px 18px rgba(15,23,42,0.05)',
      overflow: 'hidden',
      margin: '1.25rem 0'
    }}>
      {/* Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(147,197,253,0.3)',
            borderRadius: 10,
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={24} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Right-to-Reply & Official Rebuttal Gateway
              </h3>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}>
                STATUTORY SAFEGUARD
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Nodal departments & contractors are granted equal standing to publish certified explanations, DLP records, and remediation status.
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          style={{
            background: isFormExpanded ? 'rgba(255,255,255,0.1)' : 'var(--gradient-accent, #f97316)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 0.95rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
        >
          <MessageSquare size={13} />
          {isFormExpanded ? 'Close Form' : 'Submit Official Clarification'}
          {isFormExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div style={{
          background: '#ecfdf5',
          borderBottom: '1px solid #a7f3d0',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#065f46',
          fontSize: '0.84rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={16} style={{ color: '#059669' }} />
          Official rebuttal statement published successfully. It is now cryptographically indexed against report #{report.id}.
        </div>
      )}

      {/* Rebuttal Submissions Container */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        {responses.length === 0 ? (
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 12,
            padding: '1.5rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <Clock size={28} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              No Official Rebuttal or Disposal Report Submitted Yet
            </div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.25rem', maxWidth: 500, margin: '0.25rem auto 0' }}>
              Department has been formally notified under CPGRAMS guidelines. If you are an authorized PWD / Municipal Nodal Officer, use the button above to upload a formal response or inspection certificate.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {responses.map((resp) => (
              <div 
                key={resp.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '1.25rem',
                  borderLeft: '4px solid #2563eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Award size={15} style={{ color: '#2563eb' }} />
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        {resp.officerName}
                      </span>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: 4
                      }}>
                        Verified Authority
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {resp.officerDesignation} · {resp.department}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                      Dated: {resp.responseDate}
                    </span>
                    {resp.sourcePdfUrl && (
                      <a 
                        href={resp.sourcePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#2563eb',
                          background: '#eff6ff',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 6,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          border: '1px solid #bfdbfe'
                        }}
                      >
                        <FileText size={12} /> Inspection Doc <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '1rem',
                  marginTop: '0.85rem',
                  fontSize: '0.86rem',
                  color: '#1e293b',
                  lineHeight: 1.6
                }}>
                  {resp.responseText}
                </div>

                {resp.statusChangeTo && (
                  <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Official Status Recorded:</span>
                    <span style={{
                      background: resp.statusChangeTo.includes('Resolved') ? '#dcfce7' : '#fef3c7',
                      color: resp.statusChangeTo.includes('Resolved') ? '#166534' : '#92400e',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 4,
                      fontWeight: 800
                    }}>
                      {resp.statusChangeTo}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Expandable Official Clarification Submission Form */}
        {isFormExpanded && (
          <form 
            onSubmit={handleSubmitRebuttal}
            style={{
              marginTop: '1.25rem',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 14,
              padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>
              <ShieldCheck size={18} style={{ color: '#2563eb' }} />
              Submit Official Departmental Statement / Contractor Response
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Officer / Contractor Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Er. Rajiv Singhal"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Superintending Engineer (Roads)"
                  value={officerDesignation}
                  onChange={(e) => setOfficerDesignation(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Department / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. UP Public Works Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Action / Status Category
                </label>
                <select
                  value={statusChangeTo}
                  onChange={(e) => setStatusChangeTo(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="Disposed / Resolved">Disposed / Resolved (Rectification Completed)</option>
                  <option value="Under Process">Under Process (Work Order Issued to Contractor)</option>
                  <option value="Pending First Appeal">Pending First Appeal (Technical Review in Progress)</option>
                  <option value="Force Majeure Impasse">Force Majeure Impasse (Utility Shifting / Weather Delay)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Official Counter-Statement & Remedial Facts *
              </label>
              <textarea
                rows={3}
                placeholder="State technical findings, remediation steps taken, contractor penalty invoked if any, or reason for delay..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                required
                style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Supporting Inspection Certificate / Measurement Book URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={sourcePdfUrl}
                onChange={(e) => setSourcePdfUrl(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsFormExpanded(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Send size={13} /> Publish Verified Rebuttal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
