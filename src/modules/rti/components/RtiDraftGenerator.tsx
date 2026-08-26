import React, { useState } from 'react';
import { getRtiTemplates } from '../services/rtiService';
import { FileText, Copy, Check, ExternalLink, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

export function RtiDraftGenerator() {
  const templates = getRtiTemplates();
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeTemplate = templates[selectedTemplateIndex] || templates[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTemplate.templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.3rem' }}>
            Statutory RTI Application & First Appeal Generator
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Generate legally compliant application drafts under Section 6(1), Section 19(1) First Appeal, or 48-Hour Life & Liberty provisos.
          </p>
        </div>

        <div>
          <a
            href="https://rtionline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f97316',
              color: '#ffffff',
              padding: '0.55rem 1.1rem',
              borderRadius: 10,
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open DoPT RTI Online Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Template Selector Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {templates.map((tpl, idx) => (
          <button
            key={tpl.applicationType}
            onClick={() => setSelectedTemplateIndex(idx)}
            style={{
              background: selectedTemplateIndex === idx ? '#0f2d59' : '#f1f5f9',
              color: selectedTemplateIndex === idx ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tpl.title}
          </button>
        ))}
      </div>

      {/* Metadata Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.78rem' }}>
        <div>
          <span style={{ color: '#64748b', fontWeight: 700 }}>Statutory Clock:</span>
          <div style={{ fontWeight: 700, color: '#0f2d59', marginTop: '0.15rem' }}>{activeTemplate.statutoryTimeline}</div>
        </div>
        <div>
          <span style={{ color: '#64748b', fontWeight: 700 }}>Statutory Fee:</span>
          <div style={{ fontWeight: 700, color: '#0f2d59', marginTop: '0.15rem' }}>{activeTemplate.feeRule}</div>
        </div>
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <textarea
          readOnly
          value={activeTemplate.templateText}
          rows={12}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            lineHeight: 1.5,
            background: '#ffffff',
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: copied ? '#10b981' : '#0f2d59',
            color: '#ffffff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied Draft!' : 'Copy Draft Text'}
        </button>
      </div>

      {/* Guidance Notes */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.85rem 1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.3rem' }}>
          💡 Expert Legal Drafting Tips:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.45 }}>
          {activeTemplate.guidanceNotes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
