import React from 'react';
import { SCORING_VERSION, freshnessBadge } from '../../core/utils/scoring';

export function ProvenanceBar({ observedAt, sourceAt, recalcAt, sourceUrl, sourceLabel, sampleSize, reportingDays, agreementRate }: {
  observedAt?: string; sourceAt?: string; recalcAt?: string;
  sourceUrl?: string; sourceLabel?: string;
  sampleSize?: number; reportingDays?: number; agreementRate?: number;
}) {
  const recalc = recalcAt || new Date().toISOString().slice(0,10);
  const fresh = freshnessBadge(recalc);
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', fontSize:'0.62rem', color:'#64748b', alignItems:'center', borderTop:'1px solid #f1f5f9', paddingTop:'0.5rem', marginTop:'0.5rem' }}>
      {observedAt && <span>Observed: {observedAt}</span>}
      {sourceAt && <><span>·</span><span>Source: {sourceAt}</span></>}
      <span>·</span><span>Recalc: {recalc}</span>
      <span style={{ background: fresh.color==='Fresh'?'#dcfce7': fresh.color==='#f59e0b'?'#fef3c7':'#f1f5f9', color: fresh.color==='Fresh'?'#166534':fresh.color==='#f59e0b'?'#92400e':'#475569', padding:'1px 6px', borderRadius:999, fontWeight:700, border:'1px solid currentColor', opacity:0.9 }}>{fresh.label}</span>
      {sourceUrl && <><span>·</span><a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color:'#0f2d59', textDecoration:'underline' }}>{sourceLabel||'Source ↗'}</a></>}
      {sampleSize!==undefined && <><span>·</span><span>{sampleSize} reports · {reportingDays} days · {(agreementRate??0.6*100).toFixed(0)}% agree</span></>}
      <span>·</span><span style={{ fontFamily:'monospace', background:'#f8fafc', border:'1px solid #e2e8f0', padding:'1px 4px', borderRadius:4 }}>{SCORING_VERSION}</span>
      <a href="/data-sources" style={{ color:'#2563eb', fontWeight:700 }}>Methodology →</a>
    </div>
  );
}

export function DisclaimerBar() {
  return (
    <div style={{ fontSize:'0.68rem', color:'#64748b', background:'#f8fafc', border:'1px solid #eef2f7', borderRadius:8, padding:'0.5rem 0.7rem', marginTop:'0.5rem' }}>
      <strong style={{ color:'#334155' }}>Disclaimer:</strong> Counts are observations, not official rating. Sample size, agreement & freshness shown. See <a href="/data-sources" style={{ color:'#2563eb' }}>Methodology</a> — <em>Non-partisan: we list claims + audits side-by-side.</em>
    </div>
  );
}
