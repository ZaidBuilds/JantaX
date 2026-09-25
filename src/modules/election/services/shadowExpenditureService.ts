/**
 * JantaX — ADR Shadow Candidate Expenditure Watchdog Service
 *
 * Pure-logic, zero-side-effect module that computes election expenditure
 * shadow ratios comparing Association for Democratic Reforms (ADR) ground
 * estimates against Election Commission of India (ECI) statutory ceilings.
 *
 * ECI Expenditure Ceiling (2024 revision):
 *   Lok Sabha  = ₹95 Lakhs
 *   Vidhan Sabha = ₹40 Lakhs
 *
 * Every function is deterministic and unit-testable without mocking.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExpenseCategory {
  name: string;
  amountLakhs: number;
  pctOfTotal: number;
}

export interface CandidateExpenditure {
  id: string;
  candidateName: string;
  party: string;
  constituency: string;
  electionType: 'Lok Sabha' | 'Vidhan Sabha' | 'Municipal';
  eciStatutoryCeilingLakhs: number;
  eciDeclaredSpendLakhs: number;
  adrEstimatedSpendLakhs: number;
  shadowRatio: number;
  overLimitFlag: boolean;
  breakdownCategories: ExpenseCategory[];
  adrReportUrl: string;
  affidavitUrl: string;
}

export type ShadowSeverity = 'Within Limit' | 'Borderline' | 'Over Limit';

export interface ShadowRatioResult {
  ratio: number;
  isOverLimit: boolean;
  severity: ShadowSeverity;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** ECI revised ceiling for Lok Sabha general elections (2024) */
export const ECI_CEILING_LS_LAKHS = 95;

/** ECI revised ceiling for Vidhan Sabha state elections (2024) */
export const ECI_CEILING_VS_LAKHS = 40;

// ─── Core Calculation ────────────────────────────────────────────────────────

/**
 * Calculates shadow expenditure ratio.
 *
 * Formula:
 *   ratio       = round(adrEstimatedLakhs / eciCeilingLakhs, 2)
 *   isOverLimit = ratio > 1.0
 *   severity:
 *     ratio <= 0.80 → 'Within Limit'
 *     ratio <= 1.00 → 'Borderline'
 *     ratio > 1.00  → 'Over Limit'
 */
export function calculateShadowRatio(
  adrEstimatedLakhs: number,
  eciCeilingLakhs: number
): ShadowRatioResult {
  if (eciCeilingLakhs <= 0) {
    return { ratio: 0, isOverLimit: false, severity: 'Within Limit' };
  }

  const ratio = Math.round((adrEstimatedLakhs / eciCeilingLakhs) * 100) / 100;
  const isOverLimit = ratio > 1.0;

  let severity: ShadowSeverity;
  if (ratio <= 0.80) {
    severity = 'Within Limit';
  } else if (ratio <= 1.00) {
    severity = 'Borderline';
  } else {
    severity = 'Over Limit';
  }

  return { ratio, isOverLimit, severity };
}

// ─── Deterministic Demo Data ─────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

function buildBreakdown(totalLakhs: number, seed: number): ExpenseCategory[] {
  const splits = [
    { name: 'Media & Print Ads (मीडिया विज्ञापन)', basePct: 28 },
    { name: 'Transport & Vehicles (वाहन)', basePct: 18 },
    { name: 'Rally & Public Meetings (रैली)', basePct: 24 },
    { name: 'Gifts & Freebies (उपहार)', basePct: 12 },
    { name: 'Party Workers & Logistics (कार्यकर्ता)', basePct: 10 },
    { name: 'Miscellaneous (विविध)', basePct: 8 },
  ];

  // Add seed-based jitter to make each candidate's breakdown unique
  let remaining = 100;
  return splits.map((s, idx) => {
    const jitter = ((seed + idx * 7) % 5) - 2;
    const pct = idx < splits.length - 1 ? Math.max(3, s.basePct + jitter) : remaining;
    remaining -= pct;
    return {
      name: s.name,
      pctOfTotal: Math.max(0, pct),
      amountLakhs: Math.round(totalLakhs * (Math.max(0, pct) / 100) * 100) / 100,
    };
  });
}

/**
 * Returns demonstration candidate expenditure data for a given PIN code.
 * Deterministic — the same PIN always yields the same candidate set.
 */
export function getCandidateExpendituresForPin(pinCode: string): CandidateExpenditure[] {
  const h = hashSeed(pinCode);
  const isNorth = pinCode.startsWith('1') || pinCode.startsWith('2') || pinCode.startsWith('3');

  const candidates: Array<{
    name: string;
    party: string;
    type: 'Lok Sabha' | 'Vidhan Sabha';
    declared: number;
    estimated: number;
  }> = [
    {
      name: isNorth ? 'श्री राजेश कुमार सिंह' : 'Shri K. Venkataraman',
      party: isNorth ? 'BJP' : 'DMK',
      type: 'Lok Sabha',
      declared: 72 + (h % 20),
      estimated: 160 + (h % 80),
    },
    {
      name: isNorth ? 'श्रीमती सुनीता यादव' : 'Smt. Lakshmi Devi',
      party: isNorth ? 'INC' : 'AIADMK',
      type: 'Lok Sabha',
      declared: 55 + (h % 25),
      estimated: 90 + (h % 40),
    },
    {
      name: isNorth ? 'श्री मोहम्मद इकबाल' : 'Shri P. Raju Naidu',
      party: isNorth ? 'SP' : 'TDP',
      type: 'Vidhan Sabha',
      declared: 22 + (h % 12),
      estimated: 48 + (h % 30),
    },
  ];

  return candidates.map((c, idx) => {
    const ceiling = c.type === 'Lok Sabha' ? ECI_CEILING_LS_LAKHS : ECI_CEILING_VS_LAKHS;
    const sr = calculateShadowRatio(c.estimated, ceiling);
    const constituency = isNorth
      ? ['Meerut', 'Ghaziabad', 'Lucknow'][idx % 3]
      : ['Chennai South', 'Bengaluru Central', 'Hyderabad'][idx % 3];

    return {
      id: `se-${pinCode}-${idx}`,
      candidateName: c.name,
      party: c.party,
      constituency,
      electionType: c.type,
      eciStatutoryCeilingLakhs: ceiling,
      eciDeclaredSpendLakhs: c.declared,
      adrEstimatedSpendLakhs: c.estimated,
      shadowRatio: sr.ratio,
      overLimitFlag: sr.isOverLimit,
      breakdownCategories: buildBreakdown(c.estimated, h + idx),
      adrReportUrl: 'https://adrindia.org/content/analysis-criminal-background-financial-self-sworn-information',
      affidavitUrl: 'https://affidavit.eci.gov.in',
    };
  });
}
