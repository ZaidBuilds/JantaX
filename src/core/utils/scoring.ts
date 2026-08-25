// JantaX Scoring — per prd-school-scale §4
// Composite = teacher 30 + toilet 20 + MDM 25 + learning 25
// Only show if ≥5 reports across ≥3 reportingDays, else Not enough
// Confidence: low 1-4 or 1 day, building 5-14 ≥2 days, strong 15+ ≥3 days + agreement

export type Confidence = 'low' | 'building' | 'strong' | 'insufficient';

export interface ScoringInput {
  sampleSize: number;
  reportingDays: number;
  distinctContributors?: number;
  agreementRate?: number; // 0..1
  scores: { teacher: number; toilet: number; mdm: number; learning: number }; // each 0..100
}

export const SCORING_VERSION = 'v1.0-2026-08';

export function getConfidence(input: Pick<ScoringInput,'sampleSize'|'reportingDays'|'agreementRate'>): Confidence {
  const { sampleSize, reportingDays, agreementRate = 0.6 } = input;
  if (sampleSize < 5 || reportingDays < 3) return 'insufficient';
  if (sampleSize >= 15 && reportingDays >= 3 && agreementRate >= 0.6) return 'strong';
  if (sampleSize >= 5 && reportingDays >= 2) return 'building';
  return 'low';
}

export function getCompositeScore(input: ScoringInput): number | null {
  const conf = getConfidence(input);
  if (conf === 'insufficient') return null;
  const { teacher, toilet, mdm, learning } = input.scores;
  return Math.round(teacher*0.30 + toilet*0.20 + mdm*0.25 + learning*0.25);
}

export function confidenceLabel(c: Confidence): string {
  if (c === 'strong') return 'Strong — 15+ reports, 3+ days, ≥60% agreement';
  if (c === 'building') return 'Building — 5-14 reports, 2+ days';
  if (c === 'low') return 'Low — fewer reports or low agreement';
  return 'Not enough — need 5 reports across 3 days';
}

export function freshnessBadge(lastUpdated: string): { label: string; color: string } {
  const days = (Date.now() - new Date(lastUpdated).getTime()) / (1000*60*60*24);
  if (days > 90) return { label: `Stale • ${Math.floor(days)}d ago`, color: '#f59e0b' };
  if (days > 30) return { label: `${Math.floor(days)}d ago`, color: '#64748b' };
  return { label: 'Fresh', color: '#10b981' };
}
