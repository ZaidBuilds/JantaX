import React from 'react';
import { Scale, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  sanctioned: number;
  working: number;
  vacant: number;
  vacancyPercentage: number;
}

export function CourtJudgeVacancyCard({ sanctioned, working, vacant, vacancyPercentage }: Props) {
  const isHighVacancy = vacancyPercentage >= 30;
  const isModerate = vacancyPercentage >= 15 && vacancyPercentage < 30;

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2d59', margin: 0 }}>
            Judicial Strength & Vacancy Ratio
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Sanctioned vs Working Judges • Department of Justice / High Court Digest
          </span>
        </div>

        <div>
          <span
            className={
              isHighVacancy
                ? 'jantax-badge-alert'
                : isModerate
                ? 'jantax-badge-warn'
                : 'jantax-badge-good'
            }
            style={{ fontSize: '0.82rem', fontWeight: 800, padding: '0.25rem 0.75rem' }}
          >
            {vacancyPercentage}% Judicial Posts Vacant
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Sanctioned Strength
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2d59', marginTop: '0.25rem' }}>
            {sanctioned} Judges
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Authorized Courtrooms</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Working Judges
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {working} Presiding
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Active Hearing Benches</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Vacant Benches
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isHighVacancy ? '#ef4444' : '#f59e0b', marginTop: '0.25rem' }}>
            {vacant} Vacancies
          </div>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Awaiting Collegium/PSC</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
          <span>Bench Occupancy Level</span>
          <span>{(100 - vacancyPercentage).toFixed(1)}% Operational</span>
        </div>
        <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${100 - vacancyPercentage}%`,
              height: '100%',
              background: isHighVacancy ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981',
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    </div>
  );
}
