import React from 'react';
import { Link } from 'react-router-dom';
import { CivicComplaintGenerator } from '../components/CivicComplaintGenerator';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Trash2, Building2, ExternalLink } from 'lucide-react';

export function CivicComplaintPage() {
  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1000, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/nagar"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Municipal Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Lodge Official 311 Municipal Grievance
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          Generate a legally compliant civic complaint draft citing statutory Citizen Charter SLA resolution hours (12 hours for garbage, 24 hours for streetlights, 48 hours for potholes).
        </p>

        <CivicComplaintGenerator />
      </div>
    </div>
  );
}
