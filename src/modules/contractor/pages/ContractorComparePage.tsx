import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredContractors } from '../services/contractorService';
import type { ContractorProfile } from '../types/contractorIntelligence';
import { BarChart3, ArrowLeft, Building2, CheckCircle2, ShieldCheck, HardHat } from 'lucide-react';

export function ContractorComparePage() {
  const allContractors = getStoredContractors();
  const [selectedId1, setSelectedId1] = useState<string>(allContractors[0]?.id || '');
  const [selectedId2, setSelectedId2] = useState<string>(allContractors[1]?.id || '');

  const c1 = allContractors.find((c) => c.id === selectedId1);
  const c2 = allContractors.find((c) => c.id === selectedId2);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/contractors" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={16} /> Back to Contractors Directory
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>
          Contractor Side-by-Side Comparison Matrix
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.3rem' }}>
          Compare performance indicators, awarded contract values, delivery timeliness, and competent authority penalty records.
        </p>
      </div>

      {/* Selectors Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        marginBottom: '1.75rem'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
            Select Contractor 1
          </label>
          <select
            value={selectedId1}
            onChange={(e) => setSelectedId1(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem' }}
          >
            {allContractors.map((c) => (
              <option key={c.id} value={c.id}>{c.companyName} ({c.category})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
            Select Contractor 2
          </label>
          <select
            value={selectedId2}
            onChange={(e) => setSelectedId2(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem' }}
          >
            {allContractors.map((c) => (
              <option key={c.id} value={c.id}>{c.companyName} ({c.category})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      {c1 && c2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Contractor 1 Column */}
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
              {c1.category}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>{c1.companyName}</h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>Reg: {c1.registrationNumber}</div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Overall Performance Score</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59' }}>{c1.performanceIndicators.overallScore}%</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Total Contracts Value</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>₹{c1.performanceIndicators.totalAwardedValueCr.toLocaleString()} Cr</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{c1.performanceIndicators.totalContractsCount} Projects</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Completion Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{c1.performanceIndicators.completionRatePct}%</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Documented Penalties</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: c1.penalties.length > 0 ? '#b91c1c' : '#047857' }}>{c1.penalties.length} Orders</div>
              </div>
            </div>
          </div>

          {/* Contractor 2 Column */}
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
              {c2.category}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>{c2.companyName}</h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>Reg: {c2.registrationNumber}</div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Overall Performance Score</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59' }}>{c2.performanceIndicators.overallScore}%</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Total Contracts Value</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>₹{c2.performanceIndicators.totalAwardedValueCr.toLocaleString()} Cr</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{c2.performanceIndicators.totalContractsCount} Projects</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Completion Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{c2.performanceIndicators.completionRatePct}%</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Documented Penalties</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: c2.penalties.length > 0 ? '#b91c1c' : '#047857' }}>{c2.penalties.length} Orders</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
