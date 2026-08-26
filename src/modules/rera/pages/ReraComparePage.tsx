import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredReraProjects } from '../services/reraService';
import type { ReraProject } from '../types/reraIntelligence';
import { ArrowLeft, Scale, Home, ShieldCheck } from 'lucide-react';

export function ReraComparePage() {
  const projects = getStoredReraProjects();
  const [p1Id, setP1Id] = useState(projects[0]?.id || '');
  const [p2Id, setP2Id] = useState(projects[1]?.id || '');

  const p1 = projects.find((p) => p.id === p1Id);
  const p2 = projects.find((p) => p.id === p2Id);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1200, margin: '0 auto' }}>
      {/* Disclaimer */}
      <div style={{ background: '#fffbebf', border: '1px solid #fde68a', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#b45309' }}>
        <Scale size={18} style={{ flexShrink: 0 }} />
        <div><strong>Legal Disclaimer:</strong> JantaX is an independent public data transparency platform aggregating official state RERA records. JantaX does not provide legal advice.</div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/rera" style={{ color: '#0891b2', fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={16} /> Back to RERA Directory
        </Link>
      </div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 1.5rem' }}>
        RERA Housing Project Comparison Matrix
      </h1>

      {/* Selectors Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#ffffff', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Select RERA Project 1</label>
          <select value={p1Id} onChange={(e) => setP1Id(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem' }}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.projectName} ({p.builderName})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>Select RERA Project 2</label>
          <select value={p2Id} onChange={(e) => setP2Id(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 10, border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem' }}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.projectName} ({p.builderName})</option>)}
          </select>
        </div>
      </div>

      {/* Comparison Display */}
      {p1 && p2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#0891b2', fontWeight: 700, background: '#ecfeff', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              {p1.statePortal}
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>{p1.projectName}</h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>Promoter: {p1.builderName}</div>

            <div style={{ display: 'grid', gap: '0.85rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Promised Completion</div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{p1.promisedCompletionDate}</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Revised Completion</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#f97316' }}>{p1.revisedCompletionDate}</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Documented Delay</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>{p1.documentedDelayMonths} Mos</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>RERA Tribunal Orders</div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{p1.orders.length} Adjudication(s)</div></div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#0891b2', fontWeight: 700, background: '#ecfeff', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              {p2.statePortal}
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.2rem' }}>{p2.projectName}</h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>Promoter: {p2.builderName}</div>

            <div style={{ display: 'grid', gap: '0.85rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Promised Completion</div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{p2.promisedCompletionDate}</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Revised Completion</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#f97316' }}>{p2.revisedCompletionDate}</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>Documented Delay</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>{p2.documentedDelayMonths} Mos</div></div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10 }}><div style={{ fontSize: '0.74rem', color: '#64748b' }}>RERA Tribunal Orders</div><div style={{ fontSize: '1rem', fontWeight: 800 }}>{p2.orders.length} Adjudication(s)</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
