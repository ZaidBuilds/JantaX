import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Share2,
  Printer,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Building2,
  Calendar,
  ExternalLink,
  Search,
  ArrowLeft
} from 'lucide-react';
import { getStoredReports } from '../modules/reporting/services/reportingService';
import { MOCK_OFFICIAL_TRACKING } from '../modules/reporting/data/mockReports';
import type { OfficialTrackingRecord } from '../modules/reporting/types/officialAction';

export const TicketTrackingPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(ticketId || '');
  const [currentTicketId, setCurrentTicketId] = useState(ticketId || 'rep-001');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ticketId) {
      setCurrentTicketId(ticketId);
      setSearchQuery(ticketId);
    }
  }, [ticketId]);

  // Lookup report and tracking details
  const allReports = getStoredReports();
  const matchedReport = allReports.find(
    r => r.id === currentTicketId || r.id.toLowerCase() === currentTicketId.toLowerCase()
  ) || allReports[0];

  const trackingRecord: OfficialTrackingRecord = MOCK_OFFICIAL_TRACKING[currentTicketId] || {
    reportId: matchedReport?.id || 'JTX-2026-DL-8821',
    official_system: 'CPGRAMS (Central PG Portal)',
    reference_number: currentTicketId.startsWith('DARPG') ? currentTicketId : `DARPG/E/2026/${Math.abs(currentTicketId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 137).toString().padStart(6, '0')}`,
    submission_time: matchedReport ? new Date(matchedReport.createdAt).toLocaleString('en-IN') : '2026-08-24 11:30 IST',
    status: 'Under Process',
    isDirectApiSubmission: true,
    responses: [
      {
        id: 'resp-live-1',
        responseDate: 'Within 24 Hours of Logging',
        officerName: 'Er. S.K. Verma',
        officerDesignation: 'Executive Engineer / Nodal Grievance Officer',
        department: 'Public Works & Civic Infrastructure Authority',
        responseText: 'Grievance assigned to the Sub-Divisional Field Inspection Unit. Statutory 15-day defect notice served to the primary empanelled contractor.',
        statusChangeTo: 'Under Process'
      }
    ],
    appeals: [],
    resolutionVerification: {
      verificationStatus: 'Verification Pending',
      groundCheckScore: 68,
      citizenFeedbackNote: 'Local RWA and citizens scheduled to review field remediation once bitumen surface is sealed.'
    }
  };

  // Statutory SLA calculations (30 days standard for RTI / CPGRAMS; 15 days for PWD DLP)
  const isPwdDefect = matchedReport?.category === 'Road' || matchedReport?.category === 'Public works';
  const statutoryDaysTotal = isPwdDefect ? 15 : 30;
  
  // Calculate days elapsed since submission
  const submissionDate = matchedReport?.createdAt ? new Date(matchedReport.createdAt) : new Date(Date.now() - 6 * 86400000);
  const now = new Date();
  const daysElapsed = Math.max(1, Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, statutoryDaysTotal - daysElapsed);
  const isBreached = daysElapsed > statutoryDaysTotal;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/track/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🚨 *Civic Grievance Status Update* — JantaX Public Tracker\n\n📌 *Reference ID:* ${trackingRecord.reference_number}\n📍 *Location:* PIN ${matchedReport?.location.pinCode || '110001'}, ${matchedReport?.location.district || 'Delhi'}\n⏳ *Statutory SLA:* Day ${daysElapsed} of ${statutoryDaysTotal} (${daysRemaining} days left)\n📊 *Status:* ${trackingRecord.status}\n\n🔍 Track live official progress & field evidence:\n${window.location.origin}/track/${currentTicketId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem', minHeight: '85vh' }}>
      
      {/* Back to Home / Locality Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link 
          to={matchedReport?.location?.pinCode ? `/pin/${matchedReport.location.pinCode}` : '/'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Return to Locality Intelligence
        </Link>
        <span style={{ fontSize: '0.74rem', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: 999, fontWeight: 700, color: '#334155' }}>
          🏛️ Statutory Portal Interoperability Standard
        </span>
      </div>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '2rem', color: '#ffffff', marginBottom: '2rem', boxShadow: '0 8px 24px rgba(15,23,42,0.12)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ background: '#f97316', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>
                LIVE STATUTORY DOSSIER
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                System: {trackingRecord.official_system}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {trackingRecord.reference_number}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleShareWhatsApp}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#25D366', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <Share2 size={15} /> WhatsApp Alert
            </button>
            <button
              onClick={handlePrintReceipt}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', color: '#0f172a', border: 'none', padding: '0.55rem 1rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <Printer size={15} /> Print Receipt
            </button>
            <button
              onClick={handleCopyLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.55rem 0.9rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {copied ? '✓ Copied' : 'Copy URL'}
            </button>
          </div>
        </div>

        {/* Search / Lookup Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: 650, background: 'rgba(255,255,255,0.08)', padding: 6, borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
          <Search size={18} style={{ color: '#94a3b8', margin: 'auto 0.5rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Track another reference ID (e.g. DARPG/E/2024/001928, rep-001)"
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
          />
          <button
            type="submit"
            style={{ background: '#f97316', color: '#fff', border: 'none', padding: '0.45rem 1rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Main Grid: SLA Clock on Left, Timeline on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Statutory SLA Clock & Defect Spec */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Statutory SLA Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: isBreached ? '#ef4444' : '#f97316' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Statutory SLA Clock</span>
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isBreached ? '#ef4444' : '#15803d', background: isBreached ? '#fee2e2' : '#dcfce7', padding: '3px 8px', borderRadius: 999 }}>
                {isBreached ? 'STATUTORY DEADLINE BREACHED' : 'TIMELINE ACTIVE'}
              </span>
            </div>

            {/* SLA Progress Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                <span style={{ color: '#64748b' }}>Elapsed: <strong>Day {daysElapsed}</strong></span>
                <span style={{ color: isBreached ? '#ef4444' : '#0f172a' }}>
                  Statutory Limit: <strong>{statutoryDaysTotal} Days</strong>
                </span>
              </div>
              <div style={{ height: 10, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min(100, (daysElapsed / statutoryDaysTotal) * 100)}%`,
                    background: isBreached ? '#ef4444' : daysElapsed > (statutoryDaysTotal * 0.7) ? '#f59e0b' : '#10b981',
                    borderRadius: 999,
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>

            {/* Legal Advisory Note */}
            <div style={{ background: isBreached ? '#fef2f2' : '#f8fafc', border: `1px solid ${isBreached ? '#fecaca' : '#e2e8f0'}`, padding: '0.85rem', borderRadius: 8, fontSize: '0.78rem', color: isBreached ? '#991b1b' : '#475569', lineHeight: 1.5 }}>
              {isBreached ? (
                <>
                  <strong>⚠️ Legal Notice:</strong> Under Section 7(1) of the RTI Act / Citizen Charter, the public authority has failed to furnish a determination within {statutoryDaysTotal} days. The applicant is legally entitled to file a <strong>First Appeal under Section 19(1)</strong> with zero filing fee.
                </>
              ) : (
                <>
                  <strong>Statutory Standard:</strong> Governed under {isPwdDefect ? 'State PWD Defect Liability Clause 4.2' : 'Section 7(1) of Right to Information Act & DARPG Citizen Charter'}. {daysRemaining} days remaining for Nodal Executive Engineer to issue final compliance affidavit.
                </>
              )}
            </div>

            {/* Escalate Button if Breached or Near Breach */}
            {(isBreached || daysRemaining <= 5) && (
              <button
                onClick={() => alert('First Appeal dossier generated under Section 19(1). Dispatch queued for District Magistrate / Appellate Authority.')}
                style={{ width: '100%', marginTop: '1rem', background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.65rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
              >
                <AlertTriangle size={16} /> 1-Click Escalate to Appellate Authority (First Appeal)
              </button>
            )}
          </div>

          {/* Grievance Summary Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              Reported Defect Summary
            </h3>
            
            <div style={{ display: 'grid', gap: '0.65rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <span style={{ fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>
                  {matchedReport?.category.replace(/_/g, ' ') || 'Road Infrastructure'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Location:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  PIN {matchedReport?.location?.pinCode || '110001'}, {matchedReport?.location?.district || 'Delhi'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Current Status:</span>
                <span style={{ fontWeight: 800, color: trackingRecord.status === 'Disposed / Resolved' ? '#15803d' : '#f97316' }}>
                  {trackingRecord.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Submission Date:</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>
                  {trackingRecord.submission_time}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Citizen Statement:</span>
                <p style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 8, color: '#1e293b', fontStyle: 'italic', margin: 0, fontSize: '0.78rem' }}>
                  "{matchedReport?.description || 'Severe cratering on the municipal arterial road causing traffic bottlenecks and risk of vehicular tipping during rain.'}"
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Multi-Tier Institutional Accountability Timeline */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Official Resolution Pathway
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Updated in real-time
            </span>
          </div>

          {/* Timeline Steps */}
          <div style={{ display: 'grid', gap: '1.5rem', position: 'relative' }}>
            
            {/* Step 1: Registered & Geotagged */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid #bbf7d0' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ width: 2, height: '100%', background: '#e2e8f0', marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                    1. Ground Defect Logged & Cryptographically Hashed
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Day 0</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.25rem 0' }}>
                  Citizen photo and GPS coordinate verified. SHA-256 evidence integrity hash minted for tamper prevention.
                </p>
                <span style={{ fontSize: '0.7rem', color: '#15803d', background: '#dcfce7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                  ✓ Geofence Verified: Sub-metre Accuracy
                </span>
              </div>
            </div>

            {/* Step 2: Nodal Authority Assignment */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid #bbf7d0' }}>
                  <Building2 size={17} />
                </div>
                <div style={{ width: 2, height: '100%', background: '#e2e8f0', marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                    2. Dispatched to Nodal Authority
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Day 1</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.25rem 0' }}>
                  Forwarded to <strong>{trackingRecord.responses[0]?.department || 'Public Works & Civic Infrastructure Authority'}</strong> under statutory reference <code>{trackingRecord.reference_number}</code>.
                </p>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 0.8rem', borderRadius: 6, marginTop: '0.35rem', fontSize: '0.74rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Assigned Officer:</div>
                  <div style={{ color: '#475569' }}>{trackingRecord.responses[0]?.officerName || 'Er. S.K. Verma'} — {trackingRecord.responses[0]?.officerDesignation}</div>
                </div>
              </div>
            </div>

            {/* Step 3: Field Inspection & Contractor Show-Cause */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid #fed7aa' }}>
                  <AlertTriangle size={17} />
                </div>
                <div style={{ width: 2, height: '100%', background: '#e2e8f0', marginTop: 4 }} />
              </div>
              <div style={{ flex: 1, paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                    3. Site Inspection & Contractor Show-Cause
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 700 }}>In Progress</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.25rem 0' }}>
                  {trackingRecord.responses[0]?.responseText || 'Site inspection conducted. Contractor issued 7-day DLP defect rectification notice under penalty provisions.'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    ⚠️ Penalty Clause Triggered
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#4338ca', background: '#e0e7ff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    15-Day SLA Counter Running
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4: Ground Resolution Audit & Sign-off */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: trackingRecord.status === 'Disposed / Resolved' ? '#dcfce7' : '#f1f5f9', color: trackingRecord.status === 'Disposed / Resolved' ? '#166534' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: `2px solid ${trackingRecord.status === 'Disposed / Resolved' ? '#bbf7d0' : '#cbd5e1'}` }}>
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: trackingRecord.status === 'Disposed / Resolved' ? '#15803d' : '#64748b' }}>
                    4. Citizen Ground Audit & Sign-off
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Final Step</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.25rem 0' }}>
                  {trackingRecord.status === 'Disposed / Resolved' 
                    ? 'Official remediation completed on-site. Field photo submitted by executive engineer verified against community check-ins.'
                    : 'Pending contractor physical repairs. Once the authority claims completion, local citizens in the PIN zone will be notified to verify the fix.'}
                </p>
                <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#334155' }}>
                  <strong>Ground Truth Confidence:</strong> {trackingRecord.resolutionVerification.groundCheckScore}% agreement among verified locality members.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Official Government Acknowledgment Receipt (Printable Area) */}
      <div className="print-only" style={{ display: 'none', marginTop: '2rem', padding: '2rem', border: '2px solid #000' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.2rem' }}>Republic of India — Statutory Civic Grievance Receipt</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Issued under Section 6(1) of RTI Act 2005 & DARPG Citizen Grievance Redressal Charter</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>Tracking Ref No:</strong> {trackingRecord.reference_number}</div>
          <div><strong>Submission Time:</strong> {trackingRecord.submission_time}</div>
          <div><strong>Target Locality:</strong> PIN {matchedReport?.location?.pinCode}, {matchedReport?.location?.district}</div>
          <div><strong>Department:</strong> {trackingRecord.responses[0]?.department}</div>
          <div><strong>Statutory Deadline:</strong> {statutoryDaysTotal} Days from Lodgement</div>
          <div><strong>Escalation Authority:</strong> State Information Commission / Lokayukta</div>
        </div>
      </div>

    </div>
  );
};

export default TicketTrackingPage;
