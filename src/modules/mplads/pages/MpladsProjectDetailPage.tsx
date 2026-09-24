import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkById } from '../services/mpladsService';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, MapPin, CheckCircle2, Clock, ShieldCheck, FileText, AlertTriangle, ExternalLink, Share2, Send } from 'lucide-react';

export function MpladsProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const work = id ? getWorkById(id) : undefined;
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  if (!work) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)' }}>Project Record Not Found</h2>
        <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 1.5rem' }}>
          The requested MPLADS project ID "{id}" could not be located.
        </p>
        <Link to="/mplads" style={{ color: 'var(--brand-ink)', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to MPLADS Directory
        </Link>
      </div>
    );
  }

  const isCompleted = work.status === 'Completed';

  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to={`/mplads/representatives/${work.representativeId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to {work.representativeName}'s Fund Portfolio
        </Link>
      </div>

      {/* Main Project Card */}
      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ background: 'var(--surface-3)', color: 'var(--ink-2)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                {work.sector}
              </span>
              <span className={isCompleted ? 'jantax-badge-good' : 'jantax-badge-info'} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>
                {work.status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.4rem', lineHeight: 1.35 }}>
              {work.workTitle}
            </h1>
            <div style={{ fontSize: '0.92rem', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
              {work.workTitleHi}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: 140 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 700 }}>
              Sanctioned Cost
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)' }}>
              ₹{work.sanctionCostLakhs.toFixed(2)} L
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--good)', fontWeight: 600 }}>
              Disbursed: ₹{work.spentAmountLakhs.toFixed(2)} L
            </div>
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 14, border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Recommended By</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>
              <Link to={`/mplads/representatives/${work.representativeId}`} style={{ color: 'var(--brand-ink)', textDecoration: 'none' }}>
                {work.representativeName}
              </Link>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Executing Agency</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>
              {work.executingAgency}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Location & PIN</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginTop: '0.2rem' }}>
              {work.locationName} (PIN {work.pinCode})
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase' }}>Sanction Order No.</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-2)', marginTop: '0.2rem' }}>
              {work.sanctionOrderNumber}
            </div>
          </div>
        </div>

        {/* Inspections / Ground Truth */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem' }}>
            Ground Truth & Physical Inspection Log ({work.inspections.length})
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {work.inspections.map((ins, idx) => (
              <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.78rem', color: 'var(--ink-3)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{ins.inspector}</span>
                  <span>{ins.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.45 }}>
                  {ins.finding}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Layer CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowGrievanceModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--accent-solid)',
              color: 'var(--on-solid)',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Send size={15} /> Report Stalled / Substandard Asset
          </button>

          <a
            href={work.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border-strong)',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              color: 'var(--ink-2)',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
            }}
          >
            View Official Sanction PDF <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Grievance Modal */}
      {showGrievanceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '2rem', maxWidth: 580, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn-line)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--warn)', fontWeight: 600 }}>
              Draft Generated by JantaX · Official Portal Submission Required
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.5rem' }}>
              Structured MPLADS Grievance Draft
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '1rem' }}>
              Copy this structured complaint text and paste into the official CPGRAMS portal for the District Collector (District Nodal Authority for MPLADS).
            </p>

            <textarea
              readOnly
              rows={6}
              value={`To: District Nodal Officer / District Collector, ${work.district}
Subject: Non-functional / Stalled MPLADS Asset (Order: ${work.sanctionOrderNumber})

Respected Sir/Madam,
I wish to bring to your urgent attention the status of the following sanctioned MPLADS project:
- Work Title: ${work.workTitle}
- Recommended By: ${work.representativeName}
- Sanction Cost: ₹${work.sanctionCostLakhs} Lakhs
- Location: ${work.locationName} (PIN ${work.pinCode})
- Executing Agency: ${work.executingAgency}

Citizen Ground Observation: The asset is currently non-functional / delayed beyond statutory timeline. Kindly order a physical audit as per MoSPI MPLADS Guidelines 2023.`}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.82rem', fontFamily: 'monospace', marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button
                onClick={() => setShowGrievanceModal(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'var(--surface-2)', color: 'var(--ink-2)', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>

              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: 'var(--accent-solid)', color: 'var(--on-solid)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Copy & Open CPGRAMS Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
