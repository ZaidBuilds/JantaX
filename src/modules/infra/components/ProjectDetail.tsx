import React, { useState, useMemo } from 'react';
import type { Project } from '../../../core/types/Project';
import { useLanguage } from '../../../core/context/LanguageContext';
import { CircularProgressRing } from './CircularProgressRing';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onAddReport: (projectId: string, report: { userName: string; ratingValue: number; comment: string; imageUrl?: string }) => void;
  onUpvoteReport: (projectId: string, reportId: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onAddReport,
  onUpvoteReport
}) => {
  const {
    id,
    pinCode,
    nameEnglish,
    nameHindi,
    nameRegional,
    sector,
    ministry,
    implementingAgency,
    state,
    district,
    status,
    statusHindi,
    statusRegional,
    budgetOriginal,
    budgetAnticipated,
    expenditureToDate,
    startDate,
    originalCompletionDate,
    anticipatedCompletionDate,
    progressPhysical,
    progressFinancial,
    clearances,
    delayReasons,
    delaySummary,
    delaySummaryHindi,
    citizenReports,
    leadContractor,
    responsibleOfficer,
    responsibleOfficerDesignation
  } = project;

  // Form states for Citizen Eye (Anonymous)
  const [ratingValue, setRatingValue] = useState(50);
  const [comment, setComment] = useState('');
  const [mockPhotoName, setMockPhotoName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 1. Calculate Time Elapsed Progress %
  const timeProgress = useMemo(() => {
    if (status === 'Completed') return 100;
    
    const start = new Date(startDate).getTime();
    const end = new Date(anticipatedCompletionDate).getTime();
    const current = Date.now();
    
    if (current < start) return 0;
    if (current > end) return 100;
    
    const totalDuration = end - start;
    const elapsed = current - start;
    
    return Math.round((elapsed / totalDuration) * 100);
  }, [startDate, anticipatedCompletionDate, status]);

  // 2. Calculate Citizen Progress Consensus Rating
  const citizenConsensus = useMemo(() => {
    if (citizenReports.length === 0) return null;
    const sum = citizenReports.reduce((acc, curr) => acc + curr.ratingValue, 0);
    return Math.round(sum / citizenReports.length);
  }, [citizenReports]);

  // 3. Clearances Icons helper
  const renderClearanceIcon = (statusVal: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'N/A') => {
    switch (statusVal) {
      case 'Approved':
      case 'Completed':
        return <span style={{ color: 'var(--status-completed)', fontWeight: 'bold' }}>✓ स्वीकृत (Approved)</span>;
      case 'Pending':
        return <span style={{ color: 'var(--status-critical)', fontWeight: 'bold' }}>लंबित (Pending)</span>;
      case 'In Progress':
        return <span style={{ color: 'var(--status-delayed)', fontWeight: 'bold' }}>प्रगति पर (In Progress)</span>;
      default:
        return <span style={{ color: 'var(--text-muted)' }}>लागू नहीं (N/A)</span>;
    }
  };

  // Status mapping to CSS class
  const getStatusClass = (stat: string) => {
    switch (stat) {
      case 'Approved': return 'approved';
      case 'Construction': return 'construction';
      case 'Delayed': return 'delayed';
      case 'Completed': return 'completed';
      default: return '';
    }
  };

  // WhatsApp Share Formatter
  const handleWhatsAppShare = () => {
    const realityText = citizenConsensus !== null ? `${citizenConsensus}%` : "सुरक्षित / Unverified";
    const shareText = `*सड़क/कार्य रिपोर्ट (PROJECT UPDATE)* \n` +
                      `*पिन कोड (PIN Code):* ${pinCode}\n` +
                      `*कार्य (Project):* ${nameEnglish}\n` +
                      `*हिन्दी:* ${nameHindi}\n` +
                      `*सरकारी दावा (Official Claim):* ${progressPhysical}% Complete (₹${budgetAnticipated} Cr)\n` +
                      `*जमीनी हकीकत (Reality):* ${realityText}\n` +
                      `*ठेकेदार (Contractor):* ${leadContractor}\n` +
                      `*ज़िम्मेदार अधिकारी (Officer):* ${responsibleOfficer} (${responsibleOfficerDesignation})\n` +
                      `*सत्यापन लिंक (Source):* ${window.location.origin}/project/${id}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareText);
    alert("WhatsApp share text copied to clipboard! Opening WhatsApp...");
    
    // Open WhatsApp
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Simulate file selection for the photo drop zone
  const handleSimulatedPhotoDrop = () => {
    const mockPhotos = ['locked_phc.jpg', 'broken_road.png', 'rusty_iron_rods.jpg', 'empty_site.jpg'];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setMockPhotoName(randomPhoto);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReport(id, {
      userName: "गुमनाम नागरिक (Anonymous Citizen)",
      ratingValue,
      comment,
      imageUrl: mockPhotoName ? `mock_assets/${mockPhotoName}` : undefined
    });

    setComment('');
    setMockPhotoName('');
    setRatingValue(50);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const isDiscrepancy = citizenConsensus !== null && Math.abs(progressPhysical - citizenConsensus) > 10;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back button and Status Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
        <button 
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ← मुख्य सूची पर जाएं / Back to Dashboard
        </button>

        <span className={`status-badge ${getStatusClass(status)}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <span className={`pulse-dot ${getStatusClass(status)}`} style={{ marginRight: '0.35rem' }}></span>
          {status} ({statusHindi} / {statusRegional})
        </span>
      </div>

      {/* Multilingual Title, PIN Code, Contractor & responsible officer */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {sector} Sector • {implementingAgency}
          </span>
          <span style={{ 
            fontSize: '0.95rem', 
            fontWeight: 800, 
            color: 'var(--color-primary)',
            background: 'rgba(37, 99, 235, 0.08)',
            padding: '4px 12px',
            borderRadius: '4px'
          }}>
            पिन कोड / PIN {pinCode}
          </span>
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.3' }}>
          {nameEnglish}
        </h1>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          हिन्दी: {nameHindi}
        </h2>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          मराठी: {nameRegional}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div><strong>स्थान / Location:</strong> {district}, {state}</div>
          <div><strong>मंत्रालय / Ministry:</strong> {ministry}</div>
        </div>

        {/* Naming Contractor & Officer for direct accountability */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          background: 'rgba(15, 23, 42, 0.02)',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          marginTop: '0.5rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>मुख्य ठेकेदार (Lead Contractor)</span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{leadContractor}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>ज़िम्मेदार अधिकारी (Officer In-Charge)</span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{responsibleOfficer}</strong>
            <span style={{ color: 'var(--text-secondary)' }}> ({responsibleOfficerDesignation})</span>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '0.5rem' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#25D366',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--on-solid)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem'
            }}
          >
            WhatsApp पर शेयर करें (Share Report)
          </button>
        </div>
      </div>

      {/* Split Details Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '2rem',
        alignItems: 'start'
      }} className="responsive-detail-split">
        
        <style>{`
          @media (min-width: 992px) {
            .responsive-detail-split {
              grid-template-columns: 7fr 5fr !important;
            }
          }
        `}</style>

        {/* Left Column: Progress Rings, Clearances, Timelines, Delay assessment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Progress Indicators Container */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Execution Parameters</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <CircularProgressRing percentage={progressPhysical} label="Physical Work" color="var(--color-primary)" size={90} />
              <CircularProgressRing percentage={progressFinancial} label="Budget Incurred" color="var(--status-construction)" size={90} />
              <CircularProgressRing percentage={timeProgress} label="Timeline Spent" color="var(--color-accent)" size={90} />
            </div>

            {/* Comparative budget ledger summary */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '1rem', 
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Original Cost</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹{budgetOriginal} Cr</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Anticipated Cost</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹{budgetAnticipated} Cr</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Actual Expenditure</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>₹{expenditureToDate} Cr</p>
              </div>
            </div>
          </div>

          {/* Environmental and Land Clearances Checklist */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Clearances Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Land Acquisition Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 500 }}>Land Acquisition Status</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{clearances.landAcquisition}% Complete</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${clearances.landAcquisition}%`, background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Regulatory Approvals */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '1rem',
                marginTop: '0.5rem',
                fontSize: '0.85rem' 
              }}>
                <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Forest Clearance</span>
                  {renderClearanceIcon(clearances.forestClearance)}
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Eco Clearance</span>
                  {renderClearanceIcon(clearances.environmentalClearance)}
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Utility Shifting</span>
                  {renderClearanceIcon(clearances.utilityShifting)}
                </div>
              </div>
            </div>
          </div>

          {/* Delay Details Ledger */}
          {status === 'Delayed' && (
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--status-delayed)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--status-delayed)', marginBottom: '0.75rem' }}>Delay Assessment Report</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                {delaySummary}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                हिन्दी: {delaySummaryHindi}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Bottlenecks Logged:</span>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {delayReasons.map((reason, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Project Milestone Timeline */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Milestone Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', top: '5px', bottom: '5px', left: '4px', width: '2px', background: 'var(--border-color)' }}></div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-1.85rem', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-completed)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>START DATE</span>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{startDate}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Project officially mobilized on site.</p>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-1.85rem', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: status === 'Completed' ? 'var(--status-completed)' : 'var(--text-muted)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORIGINAL TARGET DATE</span>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{originalCompletionDate}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Planned timeframe determined in DPR.</p>
              </div>

              {status !== 'Completed' && (
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-1.85rem', 
                    top: '5px', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: status === 'Delayed' ? 'var(--status-delayed)' : 'var(--status-construction)'
                  }}></div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ANTICIPATED DATE</span>
                  <h4 style={{ 
                    fontSize: '0.9rem', 
                    color: status === 'Delayed' ? 'var(--status-delayed)' : 'var(--status-construction)', 
                    fontWeight: 700 
                  }}>{anticipatedCompletionDate}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {status === 'Delayed' ? "Revised timeframe adjusted for bottlenecks." : "Current expected delivery timetable."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: "Citizen Eye" Comparison Dashboard & Anonymous Photo Drop */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>
          
          {/* Side-by-Side Claim vs Reality Comparison */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>CLAIM vs. REALITY COMPARISON</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Official Claim */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>सरकारी दावा (Official Claim)</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{progressPhysical}% Complete</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(15,23,42,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPhysical}%`, background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Citizen consensus */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>जमीनी हकीकत (Ground Reality)</span>
                  <span style={{ 
                    fontWeight: 800, 
                    color: citizenConsensus === null ? 'var(--text-muted)' : isDiscrepancy ? 'var(--status-critical)' : 'var(--status-completed)' 
                  }}>
                    {citizenConsensus !== null ? `${citizenConsensus}% Consensus` : "नदारद (Unverified)"}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(15,23,42,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${citizenConsensus !== null ? citizenConsensus : progressPhysical}%`, 
                    background: citizenConsensus === null ? 'var(--text-muted)' : isDiscrepancy ? 'var(--status-critical)' : 'var(--status-completed)', 
                    borderRadius: '4px' 
                  }}></div>
                </div>
              </div>
              
              {/* Discrepancy indicator alerts */}
              {isDiscrepancy && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.15)', 
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--status-critical)',
                  lineHeight: '1.4'
                }}>
                  <strong>दावे में विसंगति! (Discrepancy Warning):</strong> Ground reality consensus varies by {Math.abs(progressPhysical - citizenConsensus)}% compared to the official dashboard records.
                </div>
              )}
            </div>
          </div>

          {/* Submission Form: Anonymous Photo Drop Zone */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>गुमनाम फोटो ड्रॉप (Anonymous Photo Drop)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Official data lies; photo evidence of locked buildings, idle cranes, or broken roads does not. Upload anonymously.
            </p>
            
            {formSubmitted ? (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: '8px',
                color: 'var(--status-completed)',
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                ✓ Thank you! Ground photo evidence published anonymously.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                {/* 1. Drag & Drop Zone */}
                <div 
                  onClick={handleSimulatedPhotoDrop}
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.01)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(37,99,235,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'rgba(15,23,42,0.01)'; }}
                >
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></span>
                  <strong>क्लिक करें या फोटो ड्रॉप करें (Click to Drop Photo)</strong>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {mockPhotoName ? `Selected: ${mockPhotoName}` : "Locked PHC, broken tracks, rusting rods..."}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    गुमनाम गवाह (Reporter Identity)
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    disabled 
                    value="गुमनाम नागरिक (Anonymous Citizen) - 100% Secure" 
                    style={{ background: 'rgba(15,23,42,0.04)', color: 'var(--text-muted)', borderStyle: 'dotted' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <label style={{ fontWeight: 500 }}>जमीनी प्रगति का अनुमान (Estimate Progress)</label>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{ratingValue}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    className="form-input" 
                    style={{ padding: '0.25rem 0', cursor: 'pointer' }}
                    value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                    सच्ची टिप्पणी / Ground Observation
                  </label>
                  <textarea 
                    placeholder="Add description of work done, idle machinery, delays..." 
                    className="form-input" 
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    padding: '0.65rem',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--on-solid)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Publish Anonymous Evidence
                </button>
              </form>
            )}
          </div>

          {/* Citizen Eye Ledger Gallery */}
          <div className="glass-card" style={{ padding: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Ground Reality Ledger</h3>
            {citizenReports.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No reports uploaded for this project yet. Be the first to verify.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {citizenReports.map((report) => (
                  <div 
                    key={report.id}
                    style={{
                      padding: '0.85rem',
                      background: 'rgba(15, 23, 42, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{report.userName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Estimated Progress: <strong style={{ color: 'var(--color-primary)' }}>{report.ratingValue}%</strong>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontStyle: 'italic' }}>
                      "{report.comment}"
                    </p>

                    {/* Simulated image thumbnail block if report contains image */}
                    {report.imageUrl && (
                      <div style={{ 
                        marginTop: '0.25rem',
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        color: 'var(--status-critical)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <strong>Ground Evidence Photo Attached:</strong> {report.imageUrl.split('/').pop()}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'end', marginTop: '0.2rem' }}>
                      <button
                        onClick={() => onUpvoteReport(id, report.id)}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          color: 'var(--text-secondary)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        Upvote ({report.upvotes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
