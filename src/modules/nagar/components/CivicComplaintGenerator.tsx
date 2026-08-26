import React, { useState } from 'react';
import { getCivicCategories } from '../services/nagarService';
import { FileText, Copy, Check, ExternalLink, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface Props {
  wardNumber?: number;
  wardName?: string;
  corporationName?: string;
  pinCode?: string;
}

export function CivicComplaintGenerator({ wardNumber = 42, wardName = 'Connaught Place', corporationName = 'Municipal Corporation of Delhi (MCD)', pinCode = '110001' }: Props) {
  const categories = getCivicCategories();
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'garbage');
  const [streetAddress, setStreetAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedCat = categories.find((c) => c.id === selectedCatId) || categories[0];

  const generatedText = `To: The Sanitary Inspector / Zonal Executive Engineer,
${corporationName}
Ward #${wardNumber} (${wardName}) — PIN: ${pinCode}

Subject: Urgent Civic Grievance regarding ${selectedCat.name} (Statutory SLA: ${selectedCat.statutorySlaHours} Hours)

Respected Sir/Madam,
I am lodging this formal civic complaint regarding an acute civic defect in Ward #${wardNumber}:

1. Issue Category: ${selectedCat.name} (${selectedCat.nameHi})
2. Exact Location: ${streetAddress || '[Enter Landmark / Street Name / House No.]'}, Ward #${wardNumber}, PIN ${pinCode}
3. Nature of Problem: ${selectedCat.description}
4. Statutory Resolution SLA: Under the Citizen Charter of ${corporationName}, this category carries a mandatory resolution window of ${selectedCat.statutorySlaHours} hours.

Evidence: Geo-tagged photo attached.

Kindly dispatch the ward sanitation/maintenance crew and update the resolution status on the 311 portal.

Yours faithfully,
[Citizen Resident / RWA Member]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.3rem' }}>
            Structured Municipal 311 Complaint Generator
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Generate legally compliant civic grievance drafts citing official Citizen Charter statutory SLA hours (12h - 48h).
          </p>
        </div>

        <div>
          <a
            href="https://swachhata.gov.in"
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
            Open National Swachhata 311 <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Category Selector Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            style={{
              background: selectedCatId === cat.id ? '#0f2d59' : '#f1f5f9',
              color: selectedCatId === cat.id ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.5rem 0.9rem',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {cat.name.split('/')[0]} ({cat.statutorySlaHours}h SLA)
          </button>
        ))}
      </div>

      {/* Street Address Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter exact street name / colony / landmark (e.g. Block C Market, Outer Ring Road)..."
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        />
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <textarea
          readOnly
          value={generatedText}
          rows={11}
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
          {copied ? 'Copied 311 Text!' : 'Copy Complaint Draft'}
        </button>
      </div>

      {/* Escalation Hierarchy Footer */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#1e40af' }}>
        <strong>SLA Escalation Officer:</strong> {selectedCat.escalationOfficer} • If unaddressed within {selectedCat.statutorySlaHours} hours, lodge a secondary escalation on the Municipal Commissioner Helpline (155304 / 1916).
      </div>
    </div>
  );
}
