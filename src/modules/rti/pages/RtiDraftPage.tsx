import React from 'react';
import { Link } from 'react-router-dom';
import { RtiDraftGenerator } from '../components/RtiDraftGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export function RtiDraftPage() {
  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/rti"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to RTI Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Interactive RTI & First Appeal Application Generator
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          Draft legally compliant RTI requests for public works, school infrastructure, contractor payments, and First Appeals under the Right to Information Act 2005.
        </p>

        <RtiDraftGenerator />
      </div>
    </div>
  );
}
