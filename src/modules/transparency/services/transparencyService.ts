import type { GovtSourceDetail, SyncStatusItem, EvidenceTier, ScoringFormulaItem, CorrectionRequest } from '../types/transparency';
import { MOCK_GOVT_SOURCES, MOCK_SYNC_STATUSES, MOCK_EVIDENCE_TIERS, MOCK_SCORING_FORMULAS, MOCK_CORRECTIONS_LOG } from '../data/mockTransparency';

const CORRECTIONS_KEY = 'jantax_corrections_log_v1';

export function getStoredGovtSources(): GovtSourceDetail[] {
  return MOCK_GOVT_SOURCES;
}

export function getSyncStatuses(): SyncStatusItem[] {
  return MOCK_SYNC_STATUSES;
}

export function getEvidenceTiers(): EvidenceTier[] {
  return MOCK_EVIDENCE_TIERS;
}

export function getScoringFormulas(): ScoringFormulaItem[] {
  return MOCK_SCORING_FORMULAS;
}

export function getCorrectionRequests(): CorrectionRequest[] {
  if (typeof window === 'undefined') return MOCK_CORRECTIONS_LOG;
  try {
    const raw = localStorage.getItem(CORRECTIONS_KEY);
    if (!raw) {
      localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(MOCK_CORRECTIONS_LOG));
      return MOCK_CORRECTIONS_LOG;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(MOCK_CORRECTIONS_LOG));
    return MOCK_CORRECTIONS_LOG;
  } catch {
    return MOCK_CORRECTIONS_LOG;
  }
}

export function submitCorrectionRequest(newReq: {
  requestType: 'Citizen Correction Request' | 'Official Data Challenge';
  submitterName: string;
  organization?: string;
  email: string;
  entityId: string;
  claimDetails: string;
  supportingGazetteUrl?: string;
}): CorrectionRequest {
  const currentLogs = getCorrectionRequests();
  const created: CorrectionRequest = {
    id: `corr-${Date.now()}`,
    requestType: newReq.requestType,
    submitterName: newReq.submitterName,
    organization: newReq.organization,
    email: newReq.email,
    entityId: newReq.entityId,
    claimDetails: newReq.claimDetails,
    supportingGazetteUrl: newReq.supportingGazetteUrl,
    status: 'Under Review',
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST'
  };

  const updated = [created, ...currentLogs];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(updated));
    } catch {}
  }

  return created;
}

export interface CivicScoringInputs {
  schoolsRteCompliance: number; // 0 - 100
  roadDlpWarranty: number; // 0 - 100
  healthcareIphsReadiness: number; // 0 - 100
  rationNfsaFulfillment: number; // 0 - 100
  airQualityIndex: number; // 0 - 500 (lower is better)
  grievanceRedressalRate: number; // 0 - 100
}

export interface CivicScoreResult {
  compositeScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'Critical Deficit';
  gradeColor: string;
  pillarBreakdown: {
    schools: { weight: number; raw: number; points: number };
    roads: { weight: number; raw: number; points: number };
    health: { weight: number; raw: number; points: number };
    ration: { weight: number; raw: number; points: number };
    airQuality: { weight: number; raw: number; normalizedScore: number; points: number };
    grievances: { weight: number; raw: number; points: number };
  };
}

export function calculateCompositeCivicScore(inputs: CivicScoringInputs): CivicScoreResult {
  const s = Math.max(0, Math.min(100, inputs.schoolsRteCompliance));
  const r = Math.max(0, Math.min(100, inputs.roadDlpWarranty));
  const h = Math.max(0, Math.min(100, inputs.healthcareIphsReadiness));
  const f = Math.max(0, Math.min(100, inputs.rationNfsaFulfillment));
  
  // AQI normalization: CPCB "Good" category (AQI <= 50) receives full 100 score.
  const rawAqi = Math.max(0, Math.min(500, inputs.airQualityIndex));
  const aqiScore = rawAqi <= 50 
    ? 100 
    : Math.max(0, Math.min(100, Math.round(100 - ((rawAqi - 50) / 350) * 100)));
  
  const g = Math.max(0, Math.min(100, inputs.grievanceRedressalRate));

  const schoolPts = Math.round(s * 0.25 * 10) / 10;
  const roadPts = Math.round(r * 0.25 * 10) / 10;
  const healthPts = Math.round(h * 0.15 * 10) / 10;
  const rationPts = Math.round(f * 0.15 * 10) / 10;
  const aqiPts = Math.round(aqiScore * 0.10 * 10) / 10;
  const grievancePts = Math.round(g * 0.10 * 10) / 10;

  const compositeScore = Math.round((schoolPts + roadPts + healthPts + rationPts + aqiPts + grievancePts) * 10) / 10;

  let grade: CivicScoreResult['grade'] = 'Critical Deficit';
  let gradeColor = '#dc2626';

  if (compositeScore >= 85) {
    grade = 'A+';
    gradeColor = '#059669';
  } else if (compositeScore >= 75) {
    grade = 'A';
    gradeColor = '#10b981';
  } else if (compositeScore >= 60) {
    grade = 'B';
    gradeColor = '#2563eb';
  } else if (compositeScore >= 45) {
    grade = 'C';
    gradeColor = '#d97706';
  } else if (compositeScore >= 30) {
    grade = 'D';
    gradeColor = '#ea580c';
  }

  return {
    compositeScore,
    grade,
    gradeColor,
    pillarBreakdown: {
      schools: { weight: 25, raw: s, points: schoolPts },
      roads: { weight: 25, raw: r, points: roadPts },
      health: { weight: 15, raw: h, points: healthPts },
      ration: { weight: 15, raw: f, points: rationPts },
      airQuality: { weight: 10, raw: rawAqi, normalizedScore: aqiScore, points: aqiPts },
      grievances: { weight: 10, raw: g, points: grievancePts }
    }
  };
}
