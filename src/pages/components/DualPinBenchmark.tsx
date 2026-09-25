import React, { useMemo } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Hospital,
  Construction,
  Users,
  Wind,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { ResolvedLocation } from '../../core/utils/pinResolver';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocalityMetrics {
  pin: string;
  location: ResolvedLocation;
  civicHealthScore: number;
  schoolsCount: number;
  schoolHealthPct: number;
  studentTeacherRatio: string;
  hospitalBedsUsable: number;
  hospitalDoctorVacancyPct: number;
  infraCompletionPct: number;
  activeDlpRoadsCount: number;
  repFundUtilizationPct: number;
  repAverageCostHikePct: number;
  aqiValue: number;
  aqiCategory: string;
  grievanceDisposalDays: number;
}

interface Props {
  metricsA: LocalityMetrics;
  metricsB: LocalityMetrics;
  locA: ResolvedLocation;
  locB: ResolvedLocation;
}

// ─── Pillar Weight Constants ─────────────────────────────────────────────────

const PILLAR_WEIGHTS = {
  education: 0.20,
  healthcare: 0.20,
  infrastructure: 0.20,
  governance: 0.15,
  environment: 0.10,
  grievance: 0.15,
} as const;

// ─── Weighted Score Calculator ───────────────────────────────────────────────

export function computeWeightedScore(m: LocalityMetrics): number {
  const educationScore = m.schoolHealthPct;
  const healthcareScore = 100 - m.hospitalDoctorVacancyPct;
  const infraScore = m.infraCompletionPct;
  const govScore = m.repFundUtilizationPct;
  const envScore = Math.max(0, 100 - m.aqiValue / 5);
  const grievScore = Math.max(0, 100 - m.grievanceDisposalDays);

  const total =
    educationScore * PILLAR_WEIGHTS.education +
    healthcareScore * PILLAR_WEIGHTS.healthcare +
    infraScore * PILLAR_WEIGHTS.infrastructure +
    govScore * PILLAR_WEIGHTS.governance +
    envScore * PILLAR_WEIGHTS.environment +
    grievScore * PILLAR_WEIGHTS.grievance;

  return Math.round(total * 10) / 10;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DualPinBenchmark({ metricsA, metricsB, locA, locB }: Props) {
  const scoreA = useMemo(() => computeWeightedScore(metricsA), [metricsA]);
  const scoreB = useMemo(() => computeWeightedScore(metricsB), [metricsB]);

  const overallWinner = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'TIE';

  const pillars = useMemo(() => {
    const rows = [
      {
        category: 'Education Quality (शिक्षा)',
        icon: GraduationCap,
        color: '#059669',
        weight: '20%',
        rawA: metricsA.schoolHealthPct,
        rawB: metricsB.schoolHealthPct,
        valA: `${metricsA.schoolHealthPct}% (${metricsA.schoolsCount} schools, ${metricsA.studentTeacherRatio})`,
        valB: `${metricsB.schoolHealthPct}% (${metricsB.schoolsCount} schools, ${metricsB.studentTeacherRatio})`,
        higherIsBetter: true,
        detail: 'UDISE+ school health + Student-Teacher ratio',
      },
      {
        category: 'Healthcare Capacity (स्वास्थ्य)',
        icon: Hospital,
        color: '#db2777',
        weight: '20%',
        rawA: 100 - metricsA.hospitalDoctorVacancyPct,
        rawB: 100 - metricsB.hospitalDoctorVacancyPct,
        valA: `${metricsA.hospitalBedsUsable} beds · ${metricsA.hospitalDoctorVacancyPct}% dr vacancy`,
        valB: `${metricsB.hospitalBedsUsable} beds · ${metricsB.hospitalDoctorVacancyPct}% dr vacancy`,
        higherIsBetter: true,
        detail: 'Functional beds & doctor staffing (lower vacancy = better)',
      },
      {
        category: 'Infrastructure (अवसंरचना)',
        icon: Construction,
        color: '#d97706',
        weight: '20%',
        rawA: metricsA.infraCompletionPct,
        rawB: metricsB.infraCompletionPct,
        valA: `${metricsA.infraCompletionPct}% (${metricsA.activeDlpRoadsCount} DLP roads)`,
        valB: `${metricsB.infraCompletionPct}% (${metricsB.activeDlpRoadsCount} DLP roads)`,
        higherIsBetter: true,
        detail: 'PWD physical completion rate vs IRC SP:98 warranty',
      },
      {
        category: 'Governance (शासन)',
        icon: Users,
        color: '#7c3aed',
        weight: '15%',
        rawA: metricsA.repFundUtilizationPct,
        rawB: metricsB.repFundUtilizationPct,
        valA: `${metricsA.repFundUtilizationPct}% utilization (+${metricsA.repAverageCostHikePct}% hike)`,
        valB: `${metricsB.repFundUtilizationPct}% utilization (+${metricsB.repAverageCostHikePct}% hike)`,
        higherIsBetter: true,
        detail: 'MPLADS/MLALADS fund disbursement & cost escalation',
      },
      {
        category: 'Air Quality (वायु गुणवत्ता)',
        icon: Wind,
        color: '#0284c7',
        weight: '10%',
        rawA: Math.max(0, 100 - metricsA.aqiValue / 5),
        rawB: Math.max(0, 100 - metricsB.aqiValue / 5),
        valA: `AQI ${metricsA.aqiValue} (${metricsA.aqiCategory})`,
        valB: `AQI ${metricsB.aqiValue} (${metricsB.aqiCategory})`,
        higherIsBetter: true, // normalized score: higher = better air
        detail: 'CPCB ambient monitoring (lower AQI = cleaner air)',
      },
      {
        category: 'Grievance Speed (शिकायत)',
        icon: Building2,
        color: '#ea580c',
        weight: '15%',
        rawA: Math.max(0, 100 - metricsA.grievanceDisposalDays),
        rawB: Math.max(0, 100 - metricsB.grievanceDisposalDays),
        valA: `${metricsA.grievanceDisposalDays} days avg disposal`,
        valB: `${metricsB.grievanceDisposalDays} days avg disposal`,
        higherIsBetter: true, // normalized: higher = faster disposal
        detail: 'CPGRAMS & CM Helpline complaint resolution time',
      },
    ];

    return rows.map((r) => {
      const delta = Math.round(Math.abs(r.rawA - r.rawB) * 10) / 10;
      const winner = r.rawA > r.rawB ? 'A' : r.rawA < r.rawB ? 'B' : 'TIE';
      return { ...r, delta, winner };
    });
  }, [metricsA, metricsB]);

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* ── Overall Winner Banner ── */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderRadius: 12,
          marginBottom: '1.25rem',
          background:
            overallWinner === 'TIE'
              ? 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
              : overallWinner === 'A'
              ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
              : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          border: `1.5px solid ${overallWinner === 'TIE' ? '#cbd5e1' : overallWinner === 'A' ? '#86efac' : '#93c5fd'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            6-Pillar Weighted Benchmark Result / छह-स्तंभ भारित परिणाम
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
            {overallWinner === 'TIE'
              ? '🤝 Dead Heat — Both PINs Tied'
              : `🏆 ${overallWinner === 'A' ? locA.district : locB.district} Leads`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ScorePill label={locA.district} score={scoreA} isWinner={overallWinner === 'A'} color="#059669" />
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#94a3b8' }}>vs</span>
          <ScorePill label={locB.district} score={scoreB} isWinner={overallWinner === 'B'} color="#2563eb" />
        </div>
      </div>

      {/* ── Comparison Matrix ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 2fr 0.7fr 2fr',
            background: '#f8fafc',
            padding: '1rem 1.5rem',
            borderBottom: '1.5px solid #e2e8f0',
            fontWeight: 800,
            fontSize: '0.78rem',
            color: '#475569',
            textTransform: 'uppercase',
          }}
        >
          <div>Pillar (Weight)</div>
          <div>{locA.district} ({metricsA.pin})</div>
          <div style={{ textAlign: 'center' }}>Δ Gap</div>
          <div>{locB.district} ({metricsB.pin})</div>
        </div>

        {/* Rows */}
        {pillars.map((r, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.2fr 2fr 0.7fr 2fr',
              padding: '1.15rem 1.5rem',
              borderBottom: idx < pillars.length - 1 ? '1px solid #f1f5f9' : 'none',
              alignItems: 'center',
              background: idx % 2 === 0 ? '#ffffff' : '#fcfcfd',
            }}
          >
            {/* Category */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                <r.icon size={16} style={{ color: r.color, flexShrink: 0 }} />
                <span>{r.category}</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.35rem',
                    borderRadius: 4,
                    background: '#f1f5f9',
                    color: '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {r.weight}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                {r.detail}
              </div>
            </div>

            {/* Value A */}
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: r.winner === 'A' ? '#047857' : '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {r.valA}
                {r.winner === 'A' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '0.12rem 0.35rem', borderRadius: 4 }}>
                    <TrendingUp size={11} style={{ marginRight: 2 }} /> Leader
                  </span>
                )}
              </div>
            </div>

            {/* Delta */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  color: r.delta === 0 ? '#94a3b8' : '#0f172a',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 6,
                  background: r.delta === 0 ? '#f8fafc' : '#fef3c7',
                  border: `1px solid ${r.delta === 0 ? '#e2e8f0' : '#fde68a'}`,
                }}
              >
                {r.delta === 0 ? <Minus size={12} /> : `Δ ${r.delta}`}
              </span>
            </div>

            {/* Value B */}
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: r.winner === 'B' ? '#047857' : '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {r.valB}
                {r.winner === 'B' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '0.12rem 0.35rem', borderRadius: 4 }}>
                    <TrendingUp size={11} style={{ marginRight: 2 }} /> Leader
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-component ───────────────────────────────────────────────────────────

function ScorePill({ label, score, isWinner, color }: { label: string; score: number; isWinner: boolean; color: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '0.5rem 1rem',
        borderRadius: 10,
        background: isWinner ? `${color}15` : '#f8fafc',
        border: `1.5px solid ${isWinner ? color : '#e2e8f0'}`,
        minWidth: 100,
      }}
    >
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '0.15rem' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isWinner ? color : '#475569' }}>
        {score}
      </div>
    </div>
  );
}
