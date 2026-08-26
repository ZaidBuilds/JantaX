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
