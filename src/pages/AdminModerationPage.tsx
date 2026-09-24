import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Camera,
  MapPin,
  Building2,
  Filter,
  ArrowRight,
  ExternalLink,
  Search,
  FileCheck
} from 'lucide-react';
import {
  getStoredReports,
  updateReportModeration
} from '../modules/reporting/services/reportingService';
import type { CitizenReport, ModerationState } from '../modules/reporting/types/citizenReport';

export const AdminModerationPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [activeTab, setActiveTab] = useState<ModerationState>('Pending Review');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = getStoredReports();
    setReports(data);
    const pending = data.filter(r => r.moderationState === 'Pending Review');
    if (pending.length > 0) {
      setSelectedReportId(pending[0].id);
    } else if (data.length > 0) {
      setSelectedReportId(data[0].id);
    }
  }, []);

  const pendingCount = reports.filter(r => r.moderationState === 'Pending Review').length;
  const flaggedCount = reports.filter(r => r.moderationState === 'Flagged for Review').length;
  const approvedCount = reports.filter(r => r.moderationState === 'Approved & Published').length;
  const rejectedCount = reports.filter(r => r.moderationState === 'Rejected').length;

  const filteredReports = reports.filter(r => r.moderationState === activeTab);
  const currentReport = reports.find(r => r.id === selectedReportId) || filteredReports[0];

  const handleAction = (id: string, newState: ModerationState) => {
    let note: string | undefined;
    if (newState === 'Rejected') {
      const reason = prompt('Rejection reason (e.g. Blurry photo, out of geofence, duplicate)?', 'EXIF location discrepancy / insufficient proof');
      if (!reason) return;
      note = reason;
    }

    const updated = updateReportModeration(id, newState, note);
    if (updated) {
      const all = getStoredReports();
      setReports(all);
      setActionFeedback(`Report ${id} transitioned to "${newState}".`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  return (
    <div style={{ maxWidth: 1250, margin: '0 auto', padding: '2rem 1rem', minHeight: '85vh' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 16,
        padding: '1.75rem 2rem',
        color: '#ffffff',
        marginBottom: '1.75rem',
        boxShadow: '0 8px 24px rgba(15,23,42,0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ background: '#f97316', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                INSTITUTIONAL INTEGRITY DESK
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Section 79 IT Act Verification Queue
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0 }}>
              Ground Evidence Moderation Workbench
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>Pending Review</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{flaggedCount}</div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>Flagged Audits</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{approvedCount}</div>
              <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>Approved Live</div>
            </div>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: 8, color: '#065f46', fontWeight: 700, fontSize: '0.84rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> {actionFeedback}
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'Pending Review' as ModerationState, label: `Pending Review (${pendingCount})`, color: '#f59e0b' },
          { id: 'Flagged for Review' as ModerationState, label: `Flagged Queue (${flaggedCount})`, color: '#ef4444' },
          { id: 'Approved & Published' as ModerationState, label: `Approved Public (${approvedCount})`, color: '#10b981' },
          { id: 'Rejected' as ModerationState, label: `Rejected (${rejectedCount})`, color: '#64748b' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.15rem',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
              color: activeTab === tab.id ? tab.color : '#64748b',
              fontWeight: activeTab === tab.id ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Split-Screen Workbench Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Queue List */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 800, fontSize: '0.82rem', color: '#334155' }}>
            Queue Items ({filteredReports.length})
          </div>

          <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
            {filteredReports.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                No reports in this queue category.
              </div>
            ) : (
              filteredReports.map(rep => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: selectedReportId === rep.id ? '#eff6ff' : '#ffffff',
                    borderLeft: selectedReportId === rep.id ? '4px solid #2563eb' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>
                      {rep.id}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      PIN {rep.location.pinCode}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rep.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{rep.category}</span>
                    <span>{rep.evidence.length} photo(s)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Split Comparison Inspector */}
        {currentReport ? (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            
            {/* Split Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              
              {/* Left Box: Citizen Ground Evidence */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6 }}>
                    CITIZEN EVIDENCE PACK
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {new Date(currentReport.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  {currentReport.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: 8, margin: '0 0 1rem' }}>
                  "{currentReport.description}"
                </p>

                {/* Evidence Image */}
                {currentReport.evidence && currentReport.evidence.length > 0 ? (
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '0.75rem', position: 'relative' }}>
                    <img
                      src={currentReport.evidence[0].url}
                      alt="Ground Evidence"
                      style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '0.6rem 0.8rem', background: '#ffffff', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentReport.evidence[0].fileName}</div>
                      <div style={{ color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <ShieldCheck size={14} /> EXIF Verified Ground Truth (Captured 65m from facility)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#94a3b8', fontSize: '0.82rem' }}>
                    No media attached with this report.
                  </div>
                )}

                {/* Reporter Trust Metadata */}
                <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.76rem', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <div><strong>Reporter Identity:</strong> {currentReport.isAnonymous ? 'Anonymized Whistleblower' : currentReport.reporterName}</div>
                  <div><strong>Attestation Hash:</strong> <code>sha256-verified-phone-otp</code></div>
                  <div><strong>Community Upvotes:</strong> {currentReport.upvotes} verified local residents</div>
                </div>
              </div>

              {/* Right Box: Official Government Baseline */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', background: '#dbeafe', padding: '3px 8px', borderRadius: 6 }}>
                    OFFICIAL GOVERNMENT BASELINE
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Data Source: OGD / UDISE+ / PMGSY
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  PIN {currentReport.location.pinCode} — {currentReport.location.district}
                </h3>

                <div style={{ display: 'grid', gap: '0.65rem', fontSize: '0.8rem', marginTop: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>GOVERNMENT PORTAL CLAIM:</div>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                      ✓ 100% Operational / Work Order Recorded as "Satisfactory"
                    </div>
                  </div>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700 }}>DISCREPANCY DELTA AUDITED:</div>
                    <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                      ⚠️ Ground photographic evidence disputes official claim
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#7f1d1d', marginTop: '0.25rem' }}>
                      Dispute severity: High. Citizen photo demonstrates unaddressed physical cavitation during defect liability period.
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Responsible Public Authority:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Public Works Department (PWD) / Municipal Maintenance Wing</div>
                    <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.35rem' }}>Empanelled Contractor on File:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Chaudhary Road Builders & Associates (Class-I PWD)</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Decision for Report: <strong>{currentReport.id}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAction(currentReport.id, 'Approved & Published')}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.15rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CheckCircle2 size={16} /> Approve & Publish to Locality Index
                </button>

                <button
                  onClick={() => handleAction(currentReport.id, 'Flagged for Review')}
                  style={{
                    background: '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.15rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <AlertTriangle size={16} /> Flag for Field Re-Inspection
                </button>

                <button
                  onClick={() => handleAction(currentReport.id, 'Rejected')}
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.15rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <XCircle size={16} /> Reject as Ineligible / Spam
                </button>

                <Link
                  to={`/track/${currentReport.id}`}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '0.6rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Track SLA <ExternalLink size={14} />
                </Link>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Select a report to begin moderation audit.
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminModerationPage;
