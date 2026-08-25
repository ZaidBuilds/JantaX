import React from 'react';

interface EvidenceCardProps {
  title: string;
  imgUrl: string;
  timestamp: string;
  verified: boolean;
  statusText: string;
}

export function EvidenceCard({ title, imgUrl, timestamp, verified, statusText }: EvidenceCardProps) {
  return (
    <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '140px', background: '#cbd5e1', overflow: 'hidden' }}>
        <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
          <span style={{ color: verified ? '#10b981' : '#ef4444', fontWeight: 800 }}>
            {verified ? '✓' : '⚠️'} {statusText}
          </span>
        </div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>{title}</p>
        <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>{timestamp}</div>
      </div>
    </div>
  );
}
