import React from 'react';
import { Shield, Scale, HelpCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LegalIntermediaryNotice: React.FC = () => {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      margin: '2rem 0 1rem',
      fontSize: '0.78rem',
      color: '#475569',
      lineHeight: 1.6
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>
          <Scale size={16} style={{ color: '#2563eb' }} />
          <span>Statutory Intermediary Declaration (Section 79, Information Technology Act, 2000)</span>
        </div>
        <Link
          to="/official-response"
          style={{
            fontSize: '0.75rem',
            color: '#2563eb',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none'
          }}
        >
          Submit Official Rejoinder / Right to Reply →
        </Link>
      </div>

      <p style={{ margin: '0 0 0.5rem' }}>
        JantaX is an independent, non-partisan civic technology platform operating as an electronic intermediary under Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. Government data is mirrored directly from official gazettes and open repositories under the Government Open Data License (GODL-India). Ground photographs and citizen audits represent independent third-party user observations.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', color: '#64748b' }}>
        <div><strong>Designated Grievance Officer:</strong> Adv. K. Swaminathan, Legal Compliance Lead</div>
        <div><strong>Compliance Email:</strong> grievance-officer@jantax.gov.in</div>
        <div><strong>Statutory SLA:</strong> 72-Hour Grievance Acknowledgment & Dispute Audit</div>
      </div>
    </div>
  );
};

export default LegalIntermediaryNotice;
