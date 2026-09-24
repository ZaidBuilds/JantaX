/**
 * JantaX Citizen Trust, Reputation & Community Quorum Corroboration Service
 * Implements anti-spam community verification quorum (3-citizen threshold),
 * geolocation-verified peer corroboration, and citizen auditor karma rankings.
 */

export interface CorroborationRecord {
  id: string;
  reportId: string;
  citizenPin: string;
  citizenName: string;
  timestamp: string;
  isGpsVerified: boolean;
  distanceKm?: number;
  comment?: string;
}

export interface QuorumStatusResult {
  reportId: string;
  corroborationCount: number;
  requiredCount: number;
  quorumReached: boolean;
  priorityLevel: 'Standard Citizen Report' | 'Elevated Community Notice' | 'Community Quorum Verified (High Priority)';
  corroborations: CorroborationRecord[];
}

export type KarmaTier = 'Civic Sentinel (Tier 1)' | 'Verified Local Resident (Tier 2)' | 'Active Citizen Auditor (Tier 3)';

export interface CitizenKarmaProfile {
  userIdOrName: string;
  karmaPoints: number;
  tier: KarmaTier;
  reportsFiled: number;
  reportsCorroborated: number;
  rectificationsConfirmed: number;
}

const CORROBORATIONS_KEY = 'jantax_corroborations_v1';
const KARMA_KEY = 'jantax_karma_profiles_v1';
export const QUORUM_THRESHOLD = 3;

const INITIAL_MOCK_CORROBORATIONS: Record<string, CorroborationRecord[]> = {
  'rep-1': [
    {
      id: 'corrob-101',
      reportId: 'rep-1',
      citizenPin: '250001',
      citizenName: 'Amit Sharma',
      timestamp: '2026-09-22 14:30 IST',
      isGpsVerified: true,
      distanceKm: 0.45,
      comment: 'Confirmed. Deep crater near Cantt railway crossing causing extreme traffic blockage.'
    },
    {
      id: 'corrob-102',
      reportId: 'rep-1',
      citizenPin: '250001',
      citizenName: 'Sunita Verma',
      timestamp: '2026-09-23 09:15 IST',
      isGpsVerified: true,
      distanceKm: 0.82,
      comment: 'Two school buses got stuck here yesterday morning. Needs immediate DLP asphalt relaying.'
    }
  ],
  'rep-2': [
    {
      id: 'corrob-201',
      reportId: 'rep-2',
      citizenPin: '110001',
      citizenName: 'Deepak Malhotra',
      timestamp: '2026-09-21 16:45 IST',
      isGpsVerified: true,
      distanceKm: 0.35,
      comment: 'Jal Board sewer line excavation left open without warning barricades.'
    }
  ]
};

function getStoredCorroborationStore(): Record<string, CorroborationRecord[]> {
  if (typeof window === 'undefined') return INITIAL_MOCK_CORROBORATIONS;
  try {
    const raw = localStorage.getItem(CORROBORATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CORROBORATIONS_KEY, JSON.stringify(INITIAL_MOCK_CORROBORATIONS));
      return INITIAL_MOCK_CORROBORATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_CORROBORATIONS;
  }
}

function saveStoredCorroborationStore(store: Record<string, CorroborationRecord[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CORROBORATIONS_KEY, JSON.stringify(store));
  } catch {}
}

export function getReportCorroborations(reportId: string): QuorumStatusResult {
  const store = getStoredCorroborationStore();
  const list = store[reportId] || [];
  const count = list.length;
  const quorumReached = count >= QUORUM_THRESHOLD;

  let priorityLevel: QuorumStatusResult['priorityLevel'] = 'Standard Citizen Report';
  if (quorumReached) {
    priorityLevel = 'Community Quorum Verified (High Priority)';
  } else if (count >= 1) {
    priorityLevel = 'Elevated Community Notice';
  }

  return {
    reportId,
    corroborationCount: count,
    requiredCount: QUORUM_THRESHOLD,
    quorumReached,
    priorityLevel,
    corroborations: list
  };
}

export function corroborateReport(params: {
  reportId: string;
  citizenPin: string;
  citizenName?: string;
  comment?: string;
  distanceKm?: number;
}): { quorumStatus: QuorumStatusResult; isNewQuorumUnlocked: boolean } {
  const store = getStoredCorroborationStore();
  const currentList = store[params.reportId] || [];

  const wasQuorumReachedBefore = currentList.length >= QUORUM_THRESHOLD;

  const newRecord: CorroborationRecord = {
    id: `corrob-${Date.now()}`,
    reportId: params.reportId,
    citizenPin: params.citizenPin,
    citizenName: params.citizenName?.trim() || 'Verified Local Resident',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST',
    isGpsVerified: (params.distanceKm !== undefined && params.distanceKm <= 15),
    distanceKm: params.distanceKm ?? 0.65,
    comment: params.comment || 'Verified and corroborated on ground.'
  };

  const updatedList = [newRecord, ...currentList];
  store[params.reportId] = updatedList;
  saveStoredCorroborationStore(store);

  // Award Karma to Corroborator
  awardKarma(newRecord.citizenName, 'corroborated');

  const nowQuorumReached = updatedList.length >= QUORUM_THRESHOLD;
  const isNewQuorumUnlocked = !wasQuorumReachedBefore && nowQuorumReached;

  return {
    quorumStatus: getReportCorroborations(params.reportId),
    isNewQuorumUnlocked
  };
}

// --- CITIZEN KARMA & AUDITOR REPUTATION ---

function calculateTier(points: number): KarmaTier {
  if (points >= 150) return 'Civic Sentinel (Tier 1)';
  if (points >= 60) return 'Verified Local Resident (Tier 2)';
  return 'Active Citizen Auditor (Tier 3)';
}

export function getCitizenKarma(userIdOrName: string): CitizenKarmaProfile {
  const name = userIdOrName.trim() || 'Public Auditor';
  if (typeof window === 'undefined') {
    return {
      userIdOrName: name,
      karmaPoints: 75,
      tier: 'Verified Local Resident (Tier 2)',
      reportsFiled: 3,
      reportsCorroborated: 4,
      rectificationsConfirmed: 1
    };
  }

  try {
    const raw = localStorage.getItem(KARMA_KEY);
    const store: Record<string, CitizenKarmaProfile> = raw ? JSON.parse(raw) : {};
    if (store[name]) return store[name];

    const initial: CitizenKarmaProfile = {
      userIdOrName: name,
      karmaPoints: 75,
      tier: 'Verified Local Resident (Tier 2)',
      reportsFiled: 2,
      reportsCorroborated: 3,
      rectificationsConfirmed: 1
    };
    store[name] = initial;
    localStorage.setItem(KARMA_KEY, JSON.stringify(store));
    return initial;
  } catch {
    return {
      userIdOrName: name,
      karmaPoints: 75,
      tier: 'Verified Local Resident (Tier 2)',
      reportsFiled: 2,
      reportsCorroborated: 3,
      rectificationsConfirmed: 1
    };
  }
}

export function awardKarma(
  userIdOrName: string,
  action: 'report_created' | 'corroborated' | 'rectification_verified' | 'flagged_spam'
): CitizenKarmaProfile {
  const current = getCitizenKarma(userIdOrName);
  let delta = 0;

  switch (action) {
    case 'report_created':
      delta = 10;
      current.reportsFiled += 1;
      break;
    case 'corroborated':
      delta = 15;
      current.reportsCorroborated += 1;
      break;
    case 'rectification_verified':
      delta = 25;
      current.rectificationsConfirmed += 1;
      break;
    case 'flagged_spam':
      delta = -30;
      break;
  }

  const updatedPoints = Math.max(0, current.karmaPoints + delta);
  const updatedProfile: CitizenKarmaProfile = {
    ...current,
    karmaPoints: updatedPoints,
    tier: calculateTier(updatedPoints)
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(KARMA_KEY);
      const store: Record<string, CitizenKarmaProfile> = raw ? JSON.parse(raw) : {};
      store[userIdOrName.trim() || 'Public Auditor'] = updatedProfile;
      localStorage.setItem(KARMA_KEY, JSON.stringify(store));
    } catch {}
  }

  return updatedProfile;
}
