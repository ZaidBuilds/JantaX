import React, { useState } from 'react';
import { getCorrectionRequests, submitCorrectionRequest } from '../services/transparencyService';
import type { CorrectionRequest } from '../types/transparency';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { AlertTriangle, FileText, Send, CheckCircle2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export function CorrectionsPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>(() => getCorrectionRequests());
  const [formType, setFormType] = useState<'Citizen Correction Request' | 'Official Data Challenge'>('Citizen Correction Request');

  // Form Fields
  const [submitterName, setSubmitterName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [entityId, setEntityId] = useState('');
  const [claimDetails, setClaimDetails] = useState('');
  const [supportingGazetteUrl, setSupportingGazetteUrl] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitCorrectionRequest({
      requestType: formType,
      submitterName,
      organization: organization || undefined,
      email,
      entityId,
      claimDetails,
      supportingGazetteUrl: supportingGazetteUrl || undefined
    });

    setRequests([created, ...requests]);
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '2rem' }}>
        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          RIGHT TO CORRECTION & DATA CHALLENGE
        </span>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.4rem' }}>
          Correction Requests & Official Data Challenge Gateway
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: 1.55 }}>
          JantaX guarantees the right to correction. Citizens, contractors, builders, and government authorities can challenge any published metric with official gazette proof.
        </p>
      </div>

      {/* Main Submission Form */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
          Submit Correction Request or Data Challenge
        </h2>

        {/* Type Toggle */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setFormType('Citizen Correction Request')}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: 12,
              border: formType === 'Citizen Correction Request' ? '2px solid #2563eb' : '1px solid #cbd5e1',
              background: formType === 'Citizen Correction Request' ? '#eff6ff' : '#ffffff',
              color: formType === 'Citizen Correction Request' ? '#1d4ed8' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Form A: Citizen Data Correction Request
          </button>

          <button
            type="button"
            onClick={() => setFormType('Official Data Challenge')}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: 12,
              border: formType === 'Official Data Challenge' ? '2px solid #ea580c' : '1px solid #cbd5e1',
              background: formType === 'Official Data Challenge' ? '#fff7ed' : '#ffffff',
              color: formType === 'Official Data Challenge' ? '#ea580c' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Form B: Contractor / Authority Official Data Challenge
          </button>
        </div>

        {submitted ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '1.25rem', borderRadius: 12, textAlign: 'center', fontWeight: 700 }}>
            ✓ Correction request submitted successfully! Your challenge has been recorded in the transparent audit log and assigned to JantaX data ops.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Your Name *</label>
                <input type="text" value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} required />
              </div>
            </div>

            {formType === 'Official Data Challenge' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Organization / Legal Designation</label>
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. M/s L&T Infra Legal Counsel / PWD Nodal Officer" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Target Entity / Record ID *</label>
              <input type="text" value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="e.g. Project ID (proj-delhi-elevated-01) or Contractor ID (cont-lt-infra)" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Claim & Discrepancy Details *</label>
              <textarea rows={4} value={claimDetails} onChange={(e) => setClaimDetails(e.target.value)} placeholder="Explain exact factual discrepancy, date error, or High Court stay order details..." style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Supporting Gazette / Official Order URL</label>
              <input type="url" value={supportingGazetteUrl} onChange={(e) => setSupportingGazetteUrl(e.target.value)} placeholder="https://cag.gov.in/stay-order.pdf" style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }} />
            </div>

            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 10, background: formType === 'Official Data Challenge' ? '#ea580c' : 'var(--gradient-accent)', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', border: 'none', cursor: 'pointer', justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Send size={16} /> Submit Formal Challenge
            </button>
          </form>
        )}
      </div>

      {/* Public Corrections & Challenge Register Log */}
      <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}>
          Transparent Correction & Dispute Register Log ({requests.length})
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.map((r) => (
            <div key={r.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 4 }}>
                    {r.requestType}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.15rem' }}>
                    {r.submitterName} {r.organization ? `(${r.organization})` : ''}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Target ID: {r.entityId} · Submitted: {r.submittedAt}</div>
                </div>

                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: r.status === 'Accepted & Updated' ? '#047857' : '#b45309', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                  Status: {r.status}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '0.5rem', lineHeight: 1.45 }}>
                <strong>Claim Details:</strong> {r.claimDetails}
              </div>

              {r.resolutionNote && (
                <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '0.4rem', fontWeight: 600 }}>
                  ✓ Resolution Note: {r.resolutionNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
