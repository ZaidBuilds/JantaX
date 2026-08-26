import React, { useState } from 'react';
import { FileText, Copy, Check, ExternalLink, Flame, ShieldAlert, AlertTriangle } from 'lucide-react';

interface Props {
  stationName?: string;
  city?: string;
  pinCode?: string;
}

export function PollutionReportGenerator({ stationName = 'ITO New Delhi', city = 'Delhi', pinCode = '110001' }: Props) {
  const [violationType, setViolationType] = useState<'Garbage Burning' | 'Construction Dust' | 'Industrial Smoke'>('Garbage Burning');
  const [exactSpot, setExactSpot] = useState('');
  const [copied, setCopied] = useState(false);

  const generatedText = `To: Member Secretary / Nodal Officer (SAMEER Grievance Cell),
Central Pollution Control Board (CPCB) / State Pollution Control Committee
Jurisdiction: ${city} (PIN ${pinCode})

Subject: Urgent Complaint Regarding Illegal ${violationType} in Violation of CAQM GRAP Orders

Respected Sir/Madam,
I am reporting an acute environmental violation posing immediate health hazards in our locality:

1. Nature of Violation: ${violationType}
2. Exact Location / Landmark: ${exactSpot || '[Enter Street Name / Plot No. / Flyover Landmark]'}, PIN ${pinCode} (${city})
3. Proximity: Near ${stationName}
4. Violation Details: Open burning / uncontrolled dust emission occurring in direct contravention of CAQM GRAP Stage I-IV statutory directives and NGT Order regarding open biomass/waste burning.

Evidence: Real-time photo with timestamp & GPS coordinates attached.

Kindly deploy the Flying Squad / Municipal Quick Response Team (QRT) immediately to extinguish the fire / seal the polluting unit and levy environmental compensation penalties.

Reported by:
[Citizen Resident / Green Volunteer]`;

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
            Pollution & Smog Violation Complaint Generator
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Generate formal violation drafts for illegal open waste burning, construction dust, and industrial smoke for direct submission on CPCB SAMEER & DPCC Green Delhi apps.
          </p>
        </div>

        <div>
          <a
            href="https://cpcb.nic.in"
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
            Open CPCB Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Violation Type Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['Garbage Burning', 'Construction Dust', 'Industrial Smoke'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setViolationType(type)}
            style={{
              background: violationType === type ? '#0f2d59' : '#f1f5f9',
              color: violationType === type ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {type === 'Garbage Burning' && '🔥 '}
            {type === 'Construction Dust' && '🏗️ '}
            {type === 'Industrial Smoke' && '🏭 '}
            {type}
          </button>
        ))}
      </div>

      {/* Location Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter exact spot / landmark (e.g. Near Ring Road underpass, vacant plot behind market)..."
          value={exactSpot}
          onChange={(e) => setExactSpot(e.target.value)}
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
          {copied ? 'Copied SAMEER Draft!' : 'Copy Complaint Text'}
        </button>
      </div>

      {/* Footer Info */}
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#991b1b' }}>
        <strong>Enforcement Proviso:</strong> Under National Green Tribunal (NGT) orders and Section 15 of Environment (Protection) Act 1986, open waste burning attracts an on-the-spot environmental penalty of ₹5,000 to ₹25,000.
      </div>
    </div>
  );
}
