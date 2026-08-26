import React from 'react';
import { Link } from 'react-router-dom';
import { CnrGuideCard } from '../components/CnrGuideCard';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Search, Scale, FileText, ExternalLink } from 'lucide-react';

export function CnrGuidePage() {
  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1000, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/courts"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Courts Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Complete Guide to eCourts CNR Case Tracking
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          Step-by-step guidance on identifying your Case Natural Reference (CNR) number, checking digital order sheets, viewing next hearing dates, and downloading signed judgments.
        </p>

        <CnrGuideCard />
      </div>
    </div>
  );
}
