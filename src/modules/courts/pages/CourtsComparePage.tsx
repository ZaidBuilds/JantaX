import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourts } from '../services/courtsService';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Scale, Users, Clock, CheckCircle2 } from 'lucide-react';

export function CourtsComparePage() {
  const allCourts = getAllCourts();
  const [court1Id, setCourt1Id] = useState(allCourts[0]?.id || '');
  const [court2Id, setCourt2Id] = useState(allCourts[1]?.id || '');

  const c1 = allCourts.find((c) => c.id === court1Id);
  const c2 = allCourts.find((c) => c.id === court2Id);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/courts"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Courts Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare District Court Complexes
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' }}>
          Compare case pendency, judge vacancies, 5+ year backlog ratios, and average disposal turnaround between two district court complexes.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Court Complex 1
            </label>
            <select
              value={court1Id}
              onChange={(e) => setCourt1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allCourts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.complexName} ({c.district}, {c.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Court Complex 2
            </label>
            <select
              value={court2Id}
              onChange={(e) => setCourt2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allCourts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.complexName} ({c.district}, {c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {c1 && c2 && (
          <div className="jantax-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{c1.complexName}</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{c2.complexName}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>District & State</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{c1.district}, {c1.state}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{c2.district}, {c2.state}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Total Pending Cases</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {c1.totalPendingCases.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {c2.totalPendingCases.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Cases Pending &gt; 5 Years</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#dc2626' }}>
                    {c1.pendingOver5Years.toLocaleString('en-IN')} ({((c1.pendingOver5Years/c1.totalPendingCases)*100).toFixed(1)}%)
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#dc2626' }}>
                    {c2.pendingOver5Years.toLocaleString('en-IN')} ({((c2.pendingOver5Years/c2.totalPendingCases)*100).toFixed(1)}%)
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Judge Vacancy Rate</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: c1.vacancyPercentage >= 25 ? '#ef4444' : '#16a34a' }}>
                    {c1.vacantJudges} of {c1.sanctionedJudges} Vacant ({c1.vacancyPercentage}%)
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: c2.vacancyPercentage >= 25 ? '#ef4444' : '#16a34a' }}>
                    {c2.vacantJudges} of {c2.sanctionedJudges} Vacant ({c2.vacancyPercentage}%)
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Average Disposal Time</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>~{c1.avgDisposalDays} days/case</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>~{c2.avgDisposalDays} days/case</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Case Clearance Rate</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: c1.clearanceRatePercent >= 90 ? '#16a34a' : '#d97706' }}>
                    {c1.clearanceRatePercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: c2.clearanceRatePercent >= 90 ? '#16a34a' : '#d97706' }}>
                    {c2.clearanceRatePercent}%
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
