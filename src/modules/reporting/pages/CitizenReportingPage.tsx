import React from 'react';
import { Link } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export function CitizenReportingPage() {
  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 900, margin: '0 auto' }}>
      {/* Top Back Navigation Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/reports" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={16} /> Back to Reports Directory
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#ea580c', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
            JANTAX PHASE 23 & 24
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Civic Evidence & Official Action Gateway
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 0.3rem' }}>
          Submit Citizen Civic Defect Report
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
          File a verified civic defect with media evidence. Select anonymous public reporting or public auditor profile.
        </p>
      </div>

      {/* Main Report Form Multi-Step Wizard */}
      <ReportForm />
    </div>
  );
}
