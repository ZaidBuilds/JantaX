import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllWards } from '../services/nagarService';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Sparkles, Building2, Trash2, CheckCircle2 } from 'lucide-react';

export function WardComparePage() {
  const allWards = getAllWards();
  const [ward1Id, setWard1Id] = useState(allWards[0]?.id || '');
  const [ward2Id, setWard2Id] = useState(allWards[1]?.id || '');

  const w1 = allWards.find((w) => w.id === ward1Id);
  const w2 = allWards.find((w) => w.id === ward2Id);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/nagar"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Municipal Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare Municipal Wards
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' }}>
          Side-by-side comparison of cleanliness scores, door-to-door garbage coverage, streetlight functioning, and 311 complaint resolution speeds between two municipal wards.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Municipal Ward 1
            </label>
            <select
              value={ward1Id}
              onChange={(e) => setWard1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allWards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward #{w.wardNumber}: {w.wardName} ({w.corporationName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Municipal Ward 2
            </label>
            <select
              value={ward2Id}
              onChange={(e) => setWard2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allWards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward #{w.wardNumber}: {w.wardName} ({w.corporationName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {w1 && w2 && (
          <div className="jantax-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>Ward #{w1.wardNumber}: {w1.wardName}</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>Ward #{w2.wardNumber}: {w2.wardName}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Municipal Corporation</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{w1.corporationName}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{w2.corporationName}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Cleanliness Score</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: w1.cleanlinessScore >= 80 ? '#16a34a' : '#f59e0b' }}>
                    {w1.cleanlinessScore} / 100
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: w2.cleanlinessScore >= 80 ? '#16a34a' : '#f59e0b' }}>
                    {w2.cleanlinessScore} / 100
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Door-to-Door Garbage</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {w1.services.doorToDoorGarbage ? '✓ Active Daily' : '⚠ Irregular'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {w2.services.doorToDoorGarbage ? '✓ Active Daily' : '⚠ Irregular'}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Streetlight Working %</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {w1.services.streetlightCoveragePercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {w2.services.streetlightCoveragePercent}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Average 311 Resolution Time</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: w1.avgResolutionHours <= 30 ? '#16a34a' : '#f59e0b' }}>
                    ~{w1.avgResolutionHours} Hours
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: w2.avgResolutionHours <= 30 ? '#16a34a' : '#f59e0b' }}>
                    ~{w2.avgResolutionHours} Hours
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Elected Councillor (Parshad)</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {w1.councillor.name} ({w1.councillor.party})
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {w2.councillor.name} ({w2.councillor.party})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
