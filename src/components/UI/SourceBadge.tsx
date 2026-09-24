import React from 'react';

const tierColor: Record<string,string> = {
  'A': '#10b981',
  'B': 'var(--viz-6)',
  'C': 'var(--warn)',
  'D': 'var(--viz-4)',
  'E': 'var(--viz-5)',
};

export function SourceBadge({ sourceType, sourceName, sourceUrl, status }: { sourceType: string; sourceName?: string; sourceUrl?: string; status?: string }) {
  const tier = sourceType?.[0] || 'A';
  const color = tierColor[tier] || 'var(--ink-3)';
  const degraded = status === 'degraded' || status === 'failed';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', background: degraded?'var(--warn-soft)':`${color}12`, color: degraded?'var(--warn)':color, border:`1px solid ${degraded?'#fde68a':color+'30'}`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>
      {sourceName || sourceType} {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color:'inherit', textDecoration:'underline' }}>↗</a>} {degraded && ''}
    </span>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const color = tierColor[tier] || 'var(--ink-3)';
  return <span style={{ background: `${color}15`, color, border:`1px solid ${color}30`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Tier {tier}</span>;
}
