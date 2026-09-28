export interface PoliceStation {
  id: string; // e.g. "PS-DL-110001-CP"
  stationName: string;
  stationNameHi: string;
  pinCode: string;
  district: string;
  state: string;
  shoName: string;
  shoRank: string;
  contactPhone: string;
  controlRoomPhone: string;
  address: string;
  addressHi: string;
  jurisdictionAreas: string[];
  cctnsStatus: 'ONLINE_ACTIVE' | 'PARTIAL_SYNC' | 'OFFLINE_INCIDENT';
  cctnsDailyDiarySync: string;
  sanctionedStrength: number;
  postedStrength: number;
  womenHelpDeskAvailable: boolean;
  childFriendlyUnit: boolean;
  eFirSupported: boolean;
  averageDisposalDays: number;
  chargesheetRatePct: number;
  latitude: number;
  longitude: number;
  sourceAuthority: string;
  sourceUrl: string;
}

export interface ZeroFirRightsGuide {
  title: string;
  titleHi: string;
  statutoryBasis: string; // "Supreme Court Mandate (Lalita Kumari v. Govt of UP) & Sec 173(1) BNSS / 154 CrPC"
  keyRights: string[];
  keyRightsHi: string[];
  officerRefusalPenalty: string; // "Punishable under Sec 199 BNS (erstwhile 166A IPC) with up to 2 years imprisonment."
  transferProcessDays: number; // 24 to 48 hours to jurisdictional station
}

export interface EFirCategory {
  category: string;
  categoryHi: string;
  eligibleOffenses: string[];
  isOnlineEligible: boolean;
  statutorySection: string;
  mandatoryDocuments: string[];
  statePortalUrl: string;
}
