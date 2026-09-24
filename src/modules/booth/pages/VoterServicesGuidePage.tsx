import React from 'react';
import { Link } from 'react-router-dom';
import { VoterFormsAccordion } from '../components/VoterFormsAccordion';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, FileText, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

export function VoterServicesGuidePage() {
  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/booth"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Booth Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Voter Enrollment, Deletion & Correction Guide
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          Comprehensive guide explaining the official statutory forms required for Indian voter registration, address change, duplicate voter card issuance, and name objection.
        </p>

        <VoterFormsAccordion />
      </div>
    </div>
  );
}
