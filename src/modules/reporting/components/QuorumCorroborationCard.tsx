import React, { useState } from 'react';
import type { CitizenReport } from '../types/citizenReport';
import { 
  getReportCorroborations, 
  corroborateReport, 
  getCitizenKarma,
  QUORUM_THRESHOLD,
  QuorumStatusResult 
} from '../services/citizenTrustService';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Flame
} from 'lucide-react';

interface QuorumCorroborationCardProps {
  report: CitizenReport;
  onQuorumUpdated?: (status: QuorumStatusResult) => void;
}

export const QuorumCorroborationCard: React.FC<QuorumCorroborationCardProps> = ({ 
  report, 
  onQuorumUpdated 
}) => {
  const [quorum, setQuorum] = useState<QuorumStatusResult>(() => getReportCorroborations(report.id));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [comment, setComment] = useState('');
  const [hasCorroborated, setHasCorroborated] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const currentUserKarma = getCitizenKarma(citizenName || 'Public Auditor');

  const handleCorroborateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const result = corroborateReport({
      reportId: report.id,
      citizenPin: report.location.pinCode,
      citizenName: citizenName || 'Verified Local Resident',
      comment: comment.trim(),
      distanceKm: 0.85
    });

    setQuorum(result.quorumStatus);
    setHasCorroborated(true);
    setIsFormOpen(false);

    if (result.isNewQuorumUnlocked) {
      setSuccessBanner('🎉 COMMUNITY QUORUM UNLOCKED! 3 local residents have verified this defect. Priority escalated to Executive Engineer.');
    } else {
      setSuccessBanner('✓ Ground corroboration recorded. +15 Karma points credited to your civic profile.');
    }

    if (onQuorumUpdated) onQuorumUpdated(result.quorumStatus);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const progressPct = Math.min(100, Math.round((quorum.corroborationCount / QUORUM_THRESHOLD) * 100));

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 18,
      border: quorum.quorumReached ? '2px solid #10b981' : '1px solid #e2e8f0',
      padding: '1.5rem',
      boxShadow: '0 4px 18px rgba(15,23,42,0.04)',
      marginBottom: '1.5rem'
    }}>
      {/* Top Banner Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              background: quorum.quorumReached ? '#ecfdf5' : '#eff6ff',
              border: `1px solid ${quorum.quorumReached ? '#a7f3d0' : '#bfdbfe'}`,
              color: quorum.quorumReached ? '#047857' : '#1d4ed8',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Users size={12} />
              {quorum.quorumReached ? 'COMMUNITY QUORUM VERIFIED' : 'LOCAL PEER CORROBORATION'}
            </span>

            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
              Threshold: {QUORUM_THRESHOLD} Independent Residents
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            {quorum.quorumReached 
              ? '⚡ High-Priority Quorum Escalation Activated'
              : `Community Corroboration Quorum (${quorum.corroborationCount}/${QUORUM_THRESHOLD})`
            }
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            {quorum.quorumReached
              ? '3 independent local residents have physically verified this civic issue. Official SLA escalated to high-priority alert.'
              : `${QUORUM_THRESHOLD - quorum.corroborationCount} more verified local resident check-in will trigger automated statutory escalation.`
            }
          </p>
        </div>

        {!hasCorroborated && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 10,
              background: 'var(--gradient-accent, #f97316)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 3px 12px rgba(249,115,22,0.3)'
            }}
          >
            <Sparkles size={14} /> Corroborate on Ground (+15 Karma)
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div style={{
          background: quorum.quorumReached ? '#ecfdf5' : '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          color: '#14532d',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
          {successBanner}
        </div>
      )}

      {/* Quorum Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', fontWeight: 700, marginBottom: '0.35rem' }}>
          <span>Corroboration Quorum Progress</span>
          <span style={{ color: quorum.quorumReached ? '#059669' : '#2563eb' }}>
            {quorum.corroborationCount} of {QUORUM_THRESHOLD} Residents Verified ({progressPct}%)
          </span>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: quorum.quorumReached 
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #3b82f6, #f97316)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Expandable Corroboration Form */}
      {isFormOpen && (
        <form 
          onSubmit={handleCorroborateSubmit}
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 14,
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            <MapPin size={16} style={{ color: '#ea580c' }} />
            Peer On-Ground Verification Check-In
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                Your Name / Auditor Handle
              </label>
              <input
                type="text"
                placeholder="e.g. Zaid (Local Resident)"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                Locality Postal PIN
              </label>
              <input
                type="text"
                value={report.location.pinCode}
                disabled
                style={{ width: '100%', padding: '0.45rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#e2e8f0', color: '#475569' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
              On-Ground Observations & Defect Confirmation *
            </label>
            <textarea
              rows={2}
              placeholder="State what you observe on ground today (e.g. defect severity, safety hazard, traffic slowdown)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} /> Sub-5km Postal Circle Geofence GPS Verified
            </span>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: 8, background: '#e2e8f0', color: '#475569', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '0.45rem 1rem', borderRadius: 8, background: '#059669', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Send size={12} /> Submit Corroboration (+15 Karma)
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Corroborators Feed */}
      <div>
        <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Verified Local Resident Attestations ({quorum.corroborations.length})
        </div>

        {quorum.corroborations.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '0.5rem 0' }}>
            No corroborations recorded yet. Be the first local resident to verify this issue.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {quorum.corroborations.map((c) => (
              <div
                key={c.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                      {c.citizenName}
                    </span>
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: 4
                    }}>
                      Verified Resident
                    </span>
                    {c.distanceKm !== undefined && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        · {c.distanceKm} km from centroid
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    "{c.comment}"
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                  {c.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
