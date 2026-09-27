import React from 'react';
import type { Project } from '../../../core/types/Project';
import { useLanguage } from '../../../core/context/LanguageContext';

interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { language } = useLanguage();
  const {
    id,
    pinCode,
    nameEnglish,
    nameHindi,
    nameRegional,
    sector,
    state,
    district,
    status,
    budgetOriginal,
    budgetAnticipated,
    progressPhysical,
    leadContractor,
    responsibleOfficer,
    responsibleOfficerDesignation
  } = project;

  // Compute citizen verified consensus average rating
  const citizenConsensus = React.useMemo(() => {
    if (project.citizenReports.length === 0) return null;
    const sum = project.citizenReports.reduce((acc, curr) => acc + curr.ratingValue, 0);
    return Math.round(sum / project.citizenReports.length);
  }, [project.citizenReports]);

  // Compute latest citizen comment snippet
  const latestComment = React.useMemo(() => {
    if (project.citizenReports.length === 0) return "कोई रिपोर्ट उपलब्ध नहीं है / No reports";
    const sorted = [...project.citizenReports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sorted[0].comment;
  }, [project.citizenReports]);

  // Sector symbols/icons mapping
  const getSectorIcon = (sec: string) => {
    switch (sec) {
      case 'Roads': return '';
      case 'Railways': return '';
      case 'Power': return '';
      case 'Water': return '';
      case 'Urban': return '';
      case 'Aviation': return '';
      default: return '';
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

  // Cost Overrun calculations
  const costOverrun = budgetAnticipated - budgetOriginal;

  // WhatsApp Share Formatter
  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop navigation click
    
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
    
    // Open WhatsApp Web/App
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const isDiscrepancy = citizenConsensus !== null && Math.abs(progressPhysical - citizenConsensus) > 10;

  return (
    <div 
      className="glass-card" 
      onClick={() => onSelect(id)}
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        position: 'relative',
        overflow: 'hidden',
        border: isDiscrepancy ? '1.5px solid var(--status-critical)' : '1px solid var(--border-color)',
        background: 'var(--bg-card)'
      }}
    >
      {/* Top Header: PIN Code & Sector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.15rem' }}>{getSectorIcon(sector)}</span>
          <span style={{ 
            fontSize: '0.95rem', 
            fontWeight: 800, 
            color: 'var(--brand-ink)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.05em',
            background: 'var(--brand-soft)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            PIN {pinCode}
          </span>
        </div>
        <span className={`status-badge ${getStatusClass(status)}`}>
          <span className={`pulse-dot ${getStatusClass(status)}`} style={{ marginRight: '0.2rem' }}></span>
          {status}
        </span>
      </div>

      {/* Multilingual Titles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <h4 style={{ 
          fontSize: '1.05rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          lineHeight: '1.3'
        }}>
          {nameEnglish}
        </h4>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.3' }}>
          हिन्दी: {nameHindi}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          मराठी: {nameRegional}
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
          {district}, {state}
        </span>
      </div>

      {/* Accountability Section (Contractor & Officer Nouns) */}
      <div style={{ 
        padding: '0.65rem', 
        background: 'var(--surface-2)', 
        borderRadius: '8px', 
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Lead Contractor: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{leadContractor}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Officer In-Charge: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{responsibleOfficer}</strong>
          <span style={{ color: 'var(--text-muted)' }}> ({responsibleOfficerDesignation})</span>
        </div>
      </div>

      {/* CLAIM VS REALITY SIDE-BY-SIDE GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0.65rem',
        background: 'var(--surface-2)',
        padding: '0.65rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Left Column: Official Claim */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.25rem',
          minWidth: 0,
          borderRight: '1px solid var(--border-color)',
          paddingRight: '0.5rem'
        }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>सरकारी दावा (Claim)</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-ink)' }}>{progressPhysical}%</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>काम (Work)</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>लागत: ₹{budgetAnticipated} Cr</span>
        </div>

        {/* Right Column: Ground Reality */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.25rem', minWidth: 0 }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>जमीनी हकीकत (Reality)</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: citizenConsensus === null ? 'var(--text-muted)' : isDiscrepancy ? 'var(--status-critical)' : 'var(--status-completed)' 
            }}>
              {citizenConsensus !== null ? `${citizenConsensus}%` : "नदारद"}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>सहमति (Consensus)</span>
          </div>
          <span style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={latestComment}>
            "{latestComment}"
          </span>
        </div>
      </div>

      {/* Discrepancy warning indicator */}
      {isDiscrepancy && (
        <div style={{ 
          fontSize: 'var(--text-xs)', 
          background: 'var(--bad-soft)', 
          border: '1px solid var(--bad-line)',
          borderRadius: '4px',
          padding: '4px 8px',
          color: 'var(--status-critical)',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          सरकारी दावे और जमीनी सच्चाई में अंतर!
        </div>
      )}

      {/* Card Footer: Cost details & WhatsApp share */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        marginTop: 'auto'
      }}>
        {costOverrun > 0 ? (
          <div style={{ color: 'var(--status-critical)', fontWeight: 700 }}>
            +₹{costOverrun} Cr Escalation
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>On original budget</span>
        )}

        <button type="button" className="btn-whatsapp" onClick={handleWhatsAppShare}>
          WhatsApp शेयर
        </button>
      </div>
    </div>
  );
};
