import React from 'react';

const tierColor: Record<string,string> = {
  'A': '#10b981',
  'B': '#0ea5e9',
  'C': '#f59e0b',
  'D': '#8b5cf6',
  'E': '#ec4899',
};

export function SourceBadge({ sourceType, sourceName, sourceUrl, status }: { sourceType: string; sourceName?: string; sourceUrl?: string; status?: string }) {
  const tier = sourceType?.[0] || 'A';
  const color = tierColor[tier] || '#64748b';
  const degraded = status === 'degraded' || status === 'failed';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', background: degraded?'#fef3c7':`${color}12`, color: degraded?'#92400e':color, border:`1px solid ${degraded?'#fde68a':color+'30'}`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>
      {sourceName || sourceType} {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color:'inherit', textDecoration:'underline' }}>↗</a>} {degraded && '⚠️'}
    </span>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const color = tierColor[tier] || '#64748b';
  return <span style={{ background: `${color}15`, color, border:`1px solid ${color}30`, padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:800 }}>Tier {tier}</span>;
}
