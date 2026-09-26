import React from 'react';

interface ScoreCardProps {
  score: number;
  label?: string;
  subLabel?: string;
  size?: number;
}

export function ScoreCard({ score, label, subLabel, size = 120 }: ScoreCardProps) {
  const safeScore = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0;

  // Determine color based on rating range
  const scoreColor = safeScore >= 70 ? 'var(--good)' : safeScore >= 40 ? 'var(--accent-ink)' : 'var(--bad)';

  return (
    <div className="glass-card score-card" aria-label={`${label ? `${label}: ` : ''}${safeScore} out of 100`}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" strokeDasharray="180 360" strokeLinecap="round" transform="rotate(135 50 50)" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke={scoreColor} strokeWidth="8" strokeDasharray={`${(safeScore / 100) * 180} 360`} strokeLinecap="round" transform="rotate(135 50 50)" />
        </svg>
        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: `${size * 0.22}px`, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{safeScore}</div>
          <div style={{ fontSize: `${size * 0.08}px`, opacity: 0.5 }}>/100</div>
        </div>
      </div>
      {label && <div style={{ color: scoreColor, fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem' }}>{label}</div>}
      {subLabel && <span style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.15rem' }}>{subLabel}</span>}
    </div>
  );
}
