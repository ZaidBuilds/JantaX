import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredGovtSources } from '../services/transparencyService';
import { TransparencyDisclaimer } from '../components/TransparencyDisclaimer';
import { Search, Database, ExternalLink, ShieldCheck, Clock, FileText, Layers, CheckCircle2 } from 'lucide-react';

export function SourcesPage() {
  const sources = getStoredGovtSources();
  const [query, setQuery] = useState('');

  const filteredSources = sources.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.sourceName.toLowerCase().includes(q) ||
      s.publishingEntity.toLowerCase().includes(q) ||
      s.dataAttributesCovered.some((attr) => attr.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d59 0%, #1e3a8a 100%)',
        borderRadius: 20,
        padding: '2.25rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 12px 32px rgba(15,45,89,0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
            JANTAX PHASE 25
          </span>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Primary Government Sources & Open Data Provenance Catalogue
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0 0 0.6rem' }}>
          Primary Government Data Sources Directory
        </h1>
        <p style={{ fontSize: '0.96rem', color: '#e2e8f0', maxWidth: 820, lineHeight: 1.55, marginBottom: '1.5rem' }}>
          Complete transparent disclosure of every official public database, gazette register, and statutory audit document processed by JantaX. Full attribution, ingestion pipelines, update frequencies, and limitations.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: 600 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search source name, publishing ministry, or data attribute..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Sources List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {filteredSources.map((s) => (
          <div key={s.id} style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 6 }}>
                  {s.governmentLevel}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem' }}>
                  {s.sourceName}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
                  Published By: {s.publishingEntity} ({s.ministryOrDepartment})
                </div>
              </div>

              <a
                href={s.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f2d59',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                Official Source Link <ExternalLink size={13} />
              </a>
            </div>

            {/* 7 Required Attributes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>1. Data Attributes Covered</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {s.dataAttributesCovered.map((attr, i) => (
                    <span key={i} style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>2. Update Frequency & Sync</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>{s.updateFrequency}</div>
                <div style={{ fontSize: '0.74rem', color: '#047857', marginTop: '0.15rem' }}>Last Successful Sync: {s.lastSuccessfulSync}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>3. JantaX Ingestion Pipeline</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.3rem', lineHeight: 1.45 }}>{s.processingPipeline}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>4. Data Limitations & Coverage Gaps</div>
                <div style={{ fontSize: '0.82rem', color: '#b45309', marginTop: '0.3rem', lineHeight: 1.45 }}>{s.knownLimitations}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #f1f5f9', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>5. License & Usage Terms</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>{s.licenseAndUsageRules}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
