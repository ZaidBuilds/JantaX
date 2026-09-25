/**
 * JantaX — CAG Fund Utilization & Lapsing Balance Auditor Service
 *
 * Pure-logic, zero-side-effect module that computes statutory fund utilization
 * metrics per the General Financial Rules (GFR) 2017, Rule 56 — lapsing of
 * unspent balances at fiscal year-end — and Comptroller & Auditor General (CAG)
 * audit observation standards.
 *
 * Every function is deterministic and unit-testable without mocking network calls.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FundUtilizationEntry {
  id: string;
  headOfAccount: string;
  subHead: string;
  sanctionedCr: number;
  revisedEstimateCr: number;
  actualExpenditureCr: number;
  unspentBalanceCr: number;
  utilizationRatioPct: number;
  isLapsed: boolean;
  lapsingCategory: 'Capital' | 'Revenue' | 'Grants-in-Aid';
  auditObservation: string;
  sourceReference: string;
}

export interface FundUtilizationSummary {
  totalSanctionedCr: number;
  totalActualCr: number;
  totalUnspentCr: number;
  overallUtilizationPct: number;
  lapsedFundsCr: number;
  criticalUnderutilizedHeads: number;
}

export type UtilizationSeverity = 'Normal' | 'Under-utilized' | 'Critical Lapse';

export interface UtilizationResult {
  unspentCr: number;
  utilizationPct: number;
  isLapsed: boolean;
  severity: UtilizationSeverity;
}

// ─── Core Calculation ────────────────────────────────────────────────────────

/**
 * Calculates statutory fund utilization per CAG methodology.
 *
 * Formula:
 *   unspentCr      = max(0, sanctionedCr − actualExpenditureCr)
 *   utilizationPct = round((actualExpenditureCr / sanctionedCr) × 100, 1)
 *   isLapsed       = fiscalYearEnded && unspentCr > 0
 *   severity:
 *     >= 75%  → 'Normal'
 *     >= 50%  → 'Under-utilized'
 *     < 50%   → 'Critical Lapse'
 */
export function calculateFundUtilization(
  sanctionedCr: number,
  actualExpenditureCr: number,
  fiscalYearEnded: boolean
): UtilizationResult {
  if (sanctionedCr <= 0) {
    return { unspentCr: 0, utilizationPct: 0, isLapsed: false, severity: 'Normal' };
  }

  const unspentCr = Math.max(0, Math.round((sanctionedCr - actualExpenditureCr) * 100) / 100);
  const utilizationPct = Math.round((actualExpenditureCr / sanctionedCr) * 1000) / 10;
  const isLapsed = fiscalYearEnded && unspentCr > 0;

  let severity: UtilizationSeverity;
  if (utilizationPct >= 75) {
    severity = 'Normal';
  } else if (utilizationPct >= 50) {
    severity = 'Under-utilized';
  } else {
    severity = 'Critical Lapse';
  }

  return { unspentCr, utilizationPct, isLapsed, severity };
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

/**
 * Aggregates individual entries into a district-level summary.
 */
export function computeUtilizationSummary(entries: FundUtilizationEntry[]): FundUtilizationSummary {
  const totalSanctionedCr = entries.reduce((s, e) => s + e.sanctionedCr, 0);
  const totalActualCr = entries.reduce((s, e) => s + e.actualExpenditureCr, 0);
  const totalUnspentCr = entries.reduce((s, e) => s + e.unspentBalanceCr, 0);
  const lapsedFundsCr = entries.filter((e) => e.isLapsed).reduce((s, e) => s + e.unspentBalanceCr, 0);
  const criticalUnderutilizedHeads = entries.filter((e) => e.utilizationRatioPct < 75).length;
  const overallUtilizationPct =
    totalSanctionedCr > 0
      ? Math.round((totalActualCr / totalSanctionedCr) * 1000) / 10
      : 0;

  return {
    totalSanctionedCr: Math.round(totalSanctionedCr * 100) / 100,
    totalActualCr: Math.round(totalActualCr * 100) / 100,
    totalUnspentCr: Math.round(totalUnspentCr * 100) / 100,
    overallUtilizationPct,
    lapsedFundsCr: Math.round(lapsedFundsCr * 100) / 100,
    criticalUnderutilizedHeads,
  };
}

// ─── Deterministic Demo Data ─────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Returns demonstration fund utilization entries for a given PIN code.
 * Data is seeded deterministically so the same PIN always shows the same numbers.
 */
export function getFundUtilizationForPin(pinCode: string): FundUtilizationEntry[] {
  const h = hashSeed(pinCode);
  const isUrban = pinCode.startsWith('11') || pinCode.startsWith('40') || pinCode.startsWith('56');

  const heads: Array<{
    head: string;
    sub: string;
    cat: FundUtilizationEntry['lapsingCategory'];
    baseSanctioned: number;
    utilRate: number;
    obs: string;
    ref: string;
  }> = [
    {
      head: '2202 — General Education',
      sub: 'Elementary Education (Samagra Shiksha)',
      cat: 'Revenue',
      baseSanctioned: isUrban ? 48.5 : 32.2,
      utilRate: 0.82 + ((h % 10) / 100),
      obs: 'Funds earmarked for mid-day meal infrastructure remained un-utilized due to delayed State matching grant release.',
      ref: 'CAG Report No. 2 of 2024, Para 3.2.1',
    },
    {
      head: '2210 — Medical & Public Health',
      sub: 'PHC / CHC Upgradation (NHM)',
      cat: 'Capital',
      baseSanctioned: isUrban ? 36.8 : 22.1,
      utilRate: 0.64 + ((h % 15) / 100),
      obs: 'Equipment procurement under NHM for sub-centre upgradation showed 36% unspent balance; vendor empanelment delayed.',
      ref: 'CAG Report No. 5 of 2024, Para 4.1.3',
    },
    {
      head: '3054 — Roads & Bridges',
      sub: 'State Highway Maintenance (PMGSY Phase-III)',
      cat: 'Capital',
      baseSanctioned: isUrban ? 62.0 : 44.7,
      utilRate: 0.71 + ((h % 12) / 100),
      obs: 'PMGSY Phase-III land acquisition disputes caused ₹12.9 Cr to lapse at year-end without any physical progress.',
      ref: 'CAG Report No. 8 of 2024, Para 5.3.2',
    },
    {
      head: '2235 — Social Security & Welfare',
      sub: 'Pension Disbursement (NSAP / State Pension)',
      cat: 'Revenue',
      baseSanctioned: isUrban ? 18.3 : 14.6,
      utilRate: 0.93 + ((h % 5) / 100),
      obs: 'NSAP pension disbursement showed satisfactory utilization; minor delay in DBT credit to 2.3% beneficiaries.',
      ref: 'CAG Report No. 3 of 2024, Para 2.5.1',
    },
    {
      head: '2215 — Water Supply & Sanitation',
      sub: 'Jal Jeevan Mission (JJM) — Tap Connections',
      cat: 'Grants-in-Aid',
      baseSanctioned: isUrban ? 28.4 : 38.9,
      utilRate: 0.45 + ((h % 20) / 100),
      obs: 'Critical under-utilization: 55% of JJM capital grant unspent. DPR approval bottleneck at State Jal Board caused treasury lapsing under GFR Rule 56.',
      ref: 'CAG Report No. 7 of 2024, Para 6.1.4',
    },
  ];

  return heads.map((item, idx) => {
    const sanctionedCr = Math.round(item.baseSanctioned * 100) / 100;
    const actualExpenditureCr = Math.round(sanctionedCr * Math.min(item.utilRate, 1.0) * 100) / 100;
    const result = calculateFundUtilization(sanctionedCr, actualExpenditureCr, true);

    return {
      id: `fu-${pinCode}-${idx}`,
      headOfAccount: item.head,
      subHead: item.sub,
      sanctionedCr,
      revisedEstimateCr: Math.round(sanctionedCr * 0.95 * 100) / 100,
      actualExpenditureCr,
      unspentBalanceCr: result.unspentCr,
      utilizationRatioPct: result.utilizationPct,
      isLapsed: result.isLapsed,
      lapsingCategory: item.cat,
      auditObservation: item.obs,
      sourceReference: item.ref,
    };
  });
}
