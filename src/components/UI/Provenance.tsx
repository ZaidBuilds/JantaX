import React from 'react';
import { Link } from 'react-router-dom';
import { SCORING_VERSION, freshnessBadge } from '../../core/utils/scoring';

export function ProvenanceBar({ observedAt, sourceAt, recalcAt, sourceUrl, sourceLabel, sampleSize, reportingDays, agreementRate }: {
  observedAt?: string; sourceAt?: string; recalcAt?: string;
  sourceUrl?: string; sourceLabel?: string;
  sampleSize?: number; reportingDays?: number; agreementRate?: number;
}) {
  const recalc = recalcAt || new Date().toISOString().slice(0,10);
  const fresh = freshnessBadge(recalc);
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', fontSize:'0.62rem', color:'var(--ink-3)', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'0.5rem', marginTop:'0.5rem' }}>
      {observedAt && <span>Observed: {observedAt}</span>}
      {sourceAt && <><span>·</span><span>Source: {sourceAt}</span></>}
      <span>·</span><span>Recalc: {recalc}</span>
      <span style={{ background: fresh.color==='Fresh'?'var(--good-soft)': fresh.color==='#f59e0b'?'var(--warn-soft)':'var(--surface-3)', color: fresh.color==='Fresh'?'var(--good)':fresh.color==='#f59e0b'?'var(--warn)':'var(--ink-2)', padding:'1px 6px', borderRadius:999, fontWeight:700, border:'1px solid currentColor', opacity:0.9 }}>{fresh.label}</span>
      {sourceUrl && <><span>·</span><a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color:'var(--ink)', textDecoration:'underline' }}>{sourceLabel||'Source ↗'}</a></>}
      {sampleSize!==undefined && <><span>·</span><span>{sampleSize} reports · {reportingDays} days · {Math.round((agreementRate ?? 0.6) * 100)}% agree</span></>}
      <span>·</span><span style={{ fontFamily:'monospace', background:'var(--surface-2)', border:'1px solid var(--border)', padding:'1px 4px', borderRadius:4 }}>{SCORING_VERSION}</span>
      <Link to="/transparency/methodology" style={{ color:'var(--brand-ink)', fontWeight:700 }}>Methodology</Link>
    </div>
  );
}

export function DisclaimerBar() {
  return (
    <div style={{ fontSize:'0.68rem', color:'var(--ink-3)', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:8, padding:'0.5rem 0.7rem', marginTop:'0.5rem' }}>
      <strong style={{ color:'var(--ink-2)' }}>Disclaimer:</strong> Counts are observations, not official rating. Sample size, agreement & freshness shown. See the <Link to="/transparency/methodology" style={{ color:'var(--brand-ink)' }}>methodology</Link> · <em>Non-partisan: we list claims + audits side-by-side.</em>
    </div>
  );
}
