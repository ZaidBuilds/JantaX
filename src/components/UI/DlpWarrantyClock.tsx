import React from 'react';
import { Clock, ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DlpWarrantyClockProps {
  workTitle: string;
  contractorName: string;
  contractorId?: string;
  completionDate: string;
  dlpEndDate: string;
  daysRemaining?: number;
  isExpired?: boolean;
  onDraftRti?: () => void;
  className?: string;
}

export function DlpWarrantyClock({
  workTitle,
  contractorName,
  contractorId,
  completionDate,
  dlpEndDate,
  daysRemaining = 142,
  isExpired = false,
  onDraftRti,
  className = '',
}: DlpWarrantyClockProps) {
  const isSafe = !isExpired && daysRemaining > 90;
  const isUrgent = !isExpired && daysRemaining <= 90;

  return (
    <div
      className={`dlp-warranty-clock ${className}`}
      style={{
        padding: '1.25rem',
        borderRadius: 14,
        background: '#ffffff',
        border: `1px solid ${isUrgent ? '#fed7aa' : isExpired ? 'var(--border-color)' : '#bbf7d0'}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 6,
                background: isUrgent ? '#fff7ed' : isExpired ? 'var(--bg-subtle)' : '#f0fdf4',
                color: isUrgent ? '#c2410c' : isExpired ? 'var(--text-muted)' : '#15803d',
                border: `1px solid ${isUrgent ? '#fdba74' : isExpired ? 'var(--border-color)' : '#86efac'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              {isExpired ? (
                <>
                  <AlertTriangle size={12} /> DLP Warranty Expired
                </>
              ) : (
                <>
                  <ShieldAlert size={12} /> Active DLP Warranty (IRC SP:98)
                </>
              )}
            </span>
          </div>

          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {workTitle}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            Contractor:{' '}
            {contractorId ? (
              <Link to={`/contractors/${contractorId}`} style={{ color: 'var(--navy-700)', fontWeight: 700, textDecoration: 'underline' }}>
                {contractorName}
              </Link>
            ) : (
              <strong>{contractorName}</strong>
            )}
          </div>
        </div>

        {/* Days Counter Dial */}
        {!isExpired && (
          <div
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 10,
              background: isUrgent ? '#fff7ed' : '#f0fdf4',
              border: `1px solid ${isUrgent ? '#fdba74' : '#86efac'}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isUrgent ? '#c2410c' : '#15803d', lineHeight: 1 }}>
              {daysRemaining}
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isUrgent ? '#9a3412' : '#166534', marginTop: '0.15rem' }}>
              Days Remaining
            </div>
          </div>
        )}
      </div>

      {/* Dates Timeline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', marginBottom: '0.85rem' }}>
        <div>
          <span>Handover Date: </span>
          <strong style={{ color: 'var(--navy-900)' }}>{completionDate}</strong>
        </div>
        <div>
          <span>DLP Expiry Date: </span>
          <strong style={{ color: 'var(--navy-900)' }}>{dlpEndDate}</strong>
        </div>
      </div>

      {/* Statutory Notice & 1-Click RTI Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, flex: 1, minWidth: 200 }}>
          Under IRC SP:98 & PWD Clause 35, contractor is legally bound to repair potholes/cracks free of cost during this period.
        </p>

        {onDraftRti ? (
          <button
            onClick={onDraftRti}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              background: 'var(--navy-900)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FileText size={13} /> Draft Section 6(1) RTI Notice
          </button>
        ) : (
          <Link
            to={`/rti/draft?contractor=${encodeURIComponent(contractorName)}&project=${encodeURIComponent(workTitle)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              background: 'var(--navy-900)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <FileText size={13} /> Demand Repair via RTI <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
