import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRepresentatives } from '../services/mpladsService';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Scale, Users, CheckCircle2, IndianRupee } from 'lucide-react';

export function MpladsComparePage() {
  const allReps = getAllRepresentatives();
  const [rep1Id, setRep1Id] = useState(allReps[0]?.id || '');
  const [rep2Id, setRep2Id] = useState(allReps[1]?.id || '');

  const rep1 = allReps.find((r) => r.id === rep1Id);
  const rep2 = allReps.find((r) => r.id === rep2Id);

  return (
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/mplads"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to MPLADS Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare MP & MLA Fund Utilization
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-3)', margin: '0 0 1.5rem' }}>
          Compare performance metrics, fund release percentages, and completed works between two elected representatives side-by-side.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-2)', display: 'block', marginBottom: '0.4rem' }}>
              Select Representative 1
            </label>
            <select
              value={rep1Id}
              onChange={(e) => setRep1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
            >
              {allReps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.house} • {r.constituencyName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-2)', display: 'block', marginBottom: '0.4rem' }}>
              Select Representative 2
            </label>
            <select
              value={rep2Id}
              onChange={(e) => setRep2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
            >
              {allReps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.house} • {r.constituencyName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {rep1 && rep2 && (
          <div className="jantax-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--ink-2)' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink)', width: '35%' }}>{rep1.name} ({rep1.party})</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink)', width: '35%' }}>{rep2.name} ({rep2.party})</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>House & Constituency</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{rep1.house} • {rep1.constituencyName} ({rep1.state})</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{rep2.house} • {rep2.constituencyName} ({rep2.state})</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Fund Utilization Rate</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: rep1.fundSummary.utilizationPercentage >= 70 ? 'var(--good)' : 'var(--warn)' }}>
                    {rep1.fundSummary.utilizationPercentage}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: rep2.fundSummary.utilizationPercentage >= 70 ? 'var(--good)' : 'var(--warn)' }}>
                    {rep2.fundSummary.utilizationPercentage}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Government Released Funds</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>₹{rep1.fundSummary.releasedByGovtCr.toFixed(2)} Cr</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>₹{rep2.fundSummary.releasedByGovtCr.toFixed(2)} Cr</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Reported Expenditure (Spent)</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--good)' }}>₹{rep1.fundSummary.expenditureReportedCr.toFixed(2)} Cr</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--good)' }}>₹{rep2.fundSummary.expenditureReportedCr.toFixed(2)} Cr</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Unspent Balance</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--warn)' }}>₹{rep1.fundSummary.unspentBalanceCr.toFixed(2)} Cr</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--warn)' }}>₹{rep2.fundSummary.unspentBalanceCr.toFixed(2)} Cr</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Works Sanctioned vs Completed</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{rep1.totalWorksCompleted} / {rep1.totalWorksSanctioned}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{rep2.totalWorksCompleted} / {rep2.totalWorksSanctioned}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
