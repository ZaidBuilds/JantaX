import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAuthorities } from '../services/rtiService';
import { TransparencyDisclaimer } from '../../transparency/components/TransparencyDisclaimer';
import { ArrowLeft, Clock, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export function RtiComparePage() {
  const allAuthorities = getAllAuthorities();
  const [auth1Id, setAuth1Id] = useState(allAuthorities[0]?.id || '');
  const [auth2Id, setAuth2Id] = useState(allAuthorities[1]?.id || '');

  const a1 = allAuthorities.find((a) => a.id === auth1Id);
  const a2 = allAuthorities.find((a) => a.id === auth2Id);

  return (
    <div style={{ padding: '1.75rem 0', maxWidth: 1100, margin: '0 auto' }}>
      <TransparencyDisclaimer />

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/rti"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to RTI Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2d59', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare Public Authority RTI Compliance
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' }}>
          Side-by-side comparison of response turnaround speeds, 30-day statutory compliance, and Section 8 rejection rates between two government departments.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Public Authority 1
            </label>
            <select
              value={auth1Id}
              onChange={(e) => setAuth1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allAuthorities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.authorityName} ({a.governmentLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
              Select Public Authority 2
            </label>
            <select
              value={auth2Id}
              onChange={(e) => setAuth2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              {allAuthorities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.authorityName} ({a.governmentLevel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {a1 && a2 && (
          <div className="jantax-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{a1.authorityName}</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#0f2d59', width: '35%' }}>{a2.authorityName}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Government Level</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{a1.governmentLevel}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{a2.governmentLevel}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Average Response Speed</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a1.avgResponseDays <= 30 ? '#10b981' : '#dc2626' }}>
                    {a1.avgResponseDays} Days
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a2.avgResponseDays <= 30 ? '#10b981' : '#dc2626' }}>
                    {a2.avgResponseDays} Days
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>30-Day On-Time Disposals</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {a1.disposedWithin30DaysPercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f2d59' }}>
                    {a2.disposedWithin30DaysPercent}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Rejection Rate</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a1.rejectionRatePercent > 5 ? '#dc2626' : '#10b981' }}>
                    {a1.rejectionRatePercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a2.rejectionRatePercent > 5 ? '#dc2626' : '#10b981' }}>
                    {a2.rejectionRatePercent}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>Annual Requests Received</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {a1.totalRequestsReceivedAnnual.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {a2.totalRequestsReceivedAnnual.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>First Appeals Upheld %</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>
                    {a1.firstAppealsUpheldPercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>
                    {a2.firstAppealsUpheldPercent}%
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
