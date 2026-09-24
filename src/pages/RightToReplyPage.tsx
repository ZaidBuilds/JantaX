import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  FileCheck,
  Building2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  FileText,
  Upload,
  Lock
} from 'lucide-react';

export const RightToReplyPage: React.FC = () => {
  const navigate = useNavigate();

  const [entityType, setEntityType] = useState<'contractor' | 'school' | 'rera' | 'pwd'>('contractor');
  const [entityId, setEntityId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [designation, setDesignation] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [workOrderRef, setWorkOrderRef] = useState('');
  const [statement, setStatement] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [acknowledgmentId, setAcknowledgmentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId.trim() || !statement.trim() || !officerName.trim()) {
      alert('Please fill all mandatory fields including Officer Name, Entity Identifier, and Statement.');
      return;
    }

    const ack = `RTR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setAcknowledgmentId(ack);

    const replyData = {
      acknowledgmentId: ack,
      entityType,
      entityId,
      officerName,
      designation,
      officialEmail,
      workOrderRef,
      statement,
      docUrl: docUrl || 'https://jantax.gov.in/docs/completion-certificate-sample.pdf',
      submittedAt: new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem('jantax_official_replies_v1');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(replyData);
      localStorage.setItem('jantax_official_replies_v1', JSON.stringify(list));
    } catch {}

    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', minHeight: '85vh' }}>
      
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link 
          to="/" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 16,
        padding: '2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(15,23,42,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
            INSTITUTIONAL NEUTRALITY MANDATE
          </span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Rule 9.4 Compliance & IT Act Section 79
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          Official Right to Reply & Clarification Desk
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5, maxWidth: 750 }}>
          JantaX operates as an open, non-partisan civic intermediary. Empanelled contractors, school principals, municipal engineers, and builders may submit verified rejoinders, completion certificates, and factual rectifications.
        </p>
      </div>

      {submitted ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Official Rejoinder Authenticated & Queued
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.55 }}>
            Acknowledgment Reference: <strong>{acknowledgmentId}</strong>. Your official statement has been attached to entity <code>{entityId}</code> and will be published alongside citizen ground audits within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#0f172a', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Return to Observatory
            </button>
            <button
              onClick={() => { setSubmitted(false); setStatement(''); }}
              style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#f1f5f9', color: '#334155', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Submit Another Rejoinder
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'grid', gap: '1.5rem' }}>
          
          {/* Entity Category Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              1. Institutional Submitter Category *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {[
                { id: 'contractor', label: 'PWD / PMGSY Contractor' },
                { id: 'school', label: 'School Principal / Management' },
                { id: 'rera', label: 'RERA Housing Developer' },
                { id: 'pwd', label: 'Executive Engineer / Municipal Body' },
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setEntityType(cat.id as any)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 10,
                    border: entityType === cat.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: entityType === cat.id ? '#eff6ff' : '#ffffff',
                    color: entityType === cat.id ? '#1d4ed8' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Identifier */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Entity Identifier (Registration / UDISE / RERA No.) *
              </label>
              <input
                type="text"
                placeholder="e.g. PWD-CL-A-KA-8800 or 070111000101"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Work Order / Project Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. WO/2026/PWD/MAYUR-VIHAR/41"
                value={workOrderRef}
                onChange={(e) => setWorkOrderRef(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Officer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Officer / Authorized Signatory Name *
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Designation *
              </label>
              <input
                type="text"
                placeholder="e.g. Executive Engineer / Headmaster"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Official Email / Contact
              </label>
              <input
                type="email"
                placeholder="officer@nic.in or company email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Statement Body */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Official Statement / Remediation Affidavit *
            </label>
            <textarea
              rows={5}
              placeholder="State the factual context, rectify defect claims, or explain remediation actions taken with exact dates..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', lineHeight: 1.5 }}
            />
          </div>

          {/* Document URL or Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Completion Certificate / Official Order Proof URL
            </label>
            <input
              type="url"
              placeholder="https://... (link to signed PDF or site remediation photo)"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>

          {/* Legal Compliance Notice */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.85rem', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
              <Lock size={13} /> Statutory Authentication Notice
            </div>
            By submitting this official response, you affirm that you are the authorized representative of the designated institution. Submissions containing fraudulent certifications are subject to proceedings under the Indian Penal Code and Section 79(3)(b) of the Information Technology Act.
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              style={{
                background: '#0f2d59',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: 10,
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(15,45,89,0.25)'
              }}
            >
              <FileCheck size={18} /> Authenticate & Submit Official Response
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default RightToReplyPage;
