import React, { useState } from 'react';
import type { CitizenReport } from '../types/citizenReport';
import { reportAbuse } from '../services/reportingService';
import { ModerationStatus } from './ModerationStatus';
import { MapPin, ThumbsUp, Flag, EyeOff, UserCheck, Calendar, AlertTriangle, ShieldCheck, Share2 } from 'lucide-react';

interface ReportStatusProps {
  report: CitizenReport;
  onUpdate?: () => void;
}

export const ReportStatus: React.FC<ReportStatusProps> = ({ report, onUpdate }) => {
  const [upvotes, setUpvotes] = useState(report.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [showAbuseModal, setShowAbuseModal] = useState(false);
  const [abuseReason, setAbuseReason] = useState('Inaccurate Location');
  const [abuseDetails, setAbuseDetails] = useState('');
  const [abuseSubmitted, setAbuseSubmitted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  const handleAbuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportAbuse(report.id, abuseReason, abuseDetails);
    setAbuseSubmitted(true);
    setTimeout(() => {
      setShowAbuseModal(false);
      setAbuseSubmitted(false);
      if (onUpdate) onUpdate();
    }, 2000);
  };

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {/* Moderation Status Banner */}
      <ModerationStatus
        moderationState={report.moderationState}
        spamScore={report.spamScore}
        abuseCount={report.abuseCount}
      />

      {/* Main Report Card */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        padding: '1.75rem',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span style={{ background: 'var(--accent-solid)', color: 'var(--on-solid)', fontSize: '0.76rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 6 }}>
                {report.category}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--ink-3)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={13} style={{ color: 'var(--accent-ink)' }} /> PIN {report.location.pinCode} · {report.location.landmark}, {report.location.district}
              </span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0.2rem 0 0.4rem' }}>
              {report.title}
            </h1>

            <div style={{ fontSize: '0.82rem', color: 'var(--ink-3)', fontWeight: 500 }}>
              Reported on {new Date(report.createdAt).toLocaleDateString()} · {report.isAnonymous ? 'Anonymous Citizen Report' : `Reporter: ${report.reporterName || 'Public Auditor'}`}
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpvote}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 12,
              border: hasUpvoted ? '1px solid var(--good)' : '1px solid var(--border-strong)',
              background: hasUpvoted ? 'var(--good-soft)' : 'var(--surface)',
              color: hasUpvoted ? 'var(--good)' : 'var(--ink-2)',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <ThumbsUp size={16} /> {upvotes} Upvotes
          </button>
        </div>

        <p style={{ fontSize: '0.94rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
          {report.description}
        </p>

        {/* Media Evidence Gallery */}
        {report.evidence.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Verified Ground Evidence ({report.evidence.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
              {report.evidence.map((ev) => (
                <div key={ev.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-strong)', height: 130, position: 'relative' }}>
                  <img src={ev.url} alt={ev.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '0.35rem', left: '0.35rem', background: 'rgba(15,23,42,0.8)', color: 'var(--on-solid)', fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4 }}>
                    {ev.fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Bar & Abuse Reporting Trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--ink-3)' }}>
            Report ID: <strong style={{ color: 'var(--ink)' }}>{report.id}</strong> {report.duplicateRefId && `(Merged with ${report.duplicateRefId})`}
          </div>

          <button
            type="button"
            onClick={() => setShowAbuseModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bad)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Flag size={13} /> Report Abuse / Inaccurate Content
          </button>
        </div>
      </div>

      {/* Abuse Reporting Modal */}
      {showAbuseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, maxWidth: 500, width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.5rem' }}>
              Report Abuse or Misinformation
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '1rem' }}>
              Submit a flag to JantaX moderators if this report contains false information, spam, or personal harassment.
            </p>

            {abuseSubmitted ? (
              <div style={{ background: 'var(--good-soft)', color: 'var(--good)', padding: '1rem', borderRadius: 10, fontWeight: 700, textAlign: 'center' }}>
                ✓ Abuse report submitted to JantaX moderators.
              </div>
            ) : (
              <form onSubmit={handleAbuseSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.3rem' }}>Reason</label>
                  <select value={abuseReason} onChange={(e) => setAbuseReason(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}>
                    <option value="Inaccurate Location">Inaccurate Location / PIN</option>
                    <option value="Fake or Manipulated Photo">Fake or Manipulated Photo Evidence</option>
                    <option value="Spam / Commercial Promotion">Spam or Commercial Promotion</option>
                    <option value="Personal Harassment">Personal Harassment / Offensive Content</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '0.3rem' }}>Additional Details</label>
                  <textarea rows={3} value={abuseDetails} onChange={(e) => setAbuseDetails(e.target.value)} placeholder="Provide specifics to assist moderation..." style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.85rem' }} required />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowAbuseModal(false)} style={{ padding: '0.55rem 1rem', borderRadius: 8, background: 'var(--surface-3)', border: '1px solid var(--border-strong)', fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '0.55rem 1.25rem', borderRadius: 8, background: 'var(--bad-solid)', color: 'var(--on-solid)', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                    Submit Abuse Flag
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
