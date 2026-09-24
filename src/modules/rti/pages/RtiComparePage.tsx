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
    <div>

      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/rti"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--ink-3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to RTI Directory
        </Link>
      </div>

      <div className="jantax-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
          Compare Public Authority RTI Compliance
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-3)', margin: '0 0 1.5rem' }}>
          Side-by-side comparison of response turnaround speeds, 30-day statutory compliance, and Section 8 rejection rates between two government departments.
        </p>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-2)', display: 'block', marginBottom: '0.4rem' }}>
              Select Public Authority 1
            </label>
            <select
              value={auth1Id}
              onChange={(e) => setAuth1Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
            >
              {allAuthorities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.authorityName} ({a.governmentLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-2)', display: 'block', marginBottom: '0.4rem' }}>
              Select Public Authority 2
            </label>
            <select
              value={auth2Id}
              onChange={(e) => setAuth2Id(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
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
                <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--ink-2)' }}>Metric / Parameter</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink)', width: '35%' }}>{a1.authorityName}</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink)', width: '35%' }}>{a2.authorityName}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Government Level</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{a1.governmentLevel}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{a2.governmentLevel}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Average Response Speed</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a1.avgResponseDays <= 30 ? 'var(--good)' : 'var(--bad)' }}>
                    {a1.avgResponseDays} Days
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a2.avgResponseDays <= 30 ? 'var(--good)' : 'var(--bad)' }}>
                    {a2.avgResponseDays} Days
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>30-Day On-Time Disposals</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: 'var(--ink)' }}>
                    {a1.disposedWithin30DaysPercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: 'var(--ink)' }}>
                    {a2.disposedWithin30DaysPercent}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Rejection Rate</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a1.rejectionRatePercent > 5 ? 'var(--bad)' : 'var(--good)' }}>
                    {a1.rejectionRatePercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: a2.rejectionRatePercent > 5 ? 'var(--bad)' : 'var(--good)' }}>
                    {a2.rejectionRatePercent}%
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>Annual Requests Received</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {a1.totalRequestsReceivedAnnual.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                    {a2.totalRequestsReceivedAnnual.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--ink-2)' }}>First Appeals Upheld %</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--brand-ink)' }}>
                    {a1.firstAppealsUpheldPercent}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--brand-ink)' }}>
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
