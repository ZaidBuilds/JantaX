export interface CouncillorDetails {
  name: string;
  nameHi: string;
  party: string;
  phone: string;
  officeAddress: string;
}

export interface SanitaryInspectorDetails {
  name: string;
  nameHi: string;
  phone: string;
  shiftTimings: string;
  officeLocation: string;
}

export interface WardServices {
  doorToDoorGarbage: boolean;
  sweepingFrequency: string; // e.g. "Daily (Twice)"
  streetlightCoveragePercent: number;
  waterloggingHotspots: number;
  openDumpsResolvedPercent: number;
}

export interface MunicipalWard {
  id: string; // e.g. "WARD-DL-MCD042"
  wardNumber: number;
  wardName: string;
  wardNameHi: string;
  corporationName: string;
  corporationNameHi: string;
  zone: string;
  zoneHi: string;
  pinCode: string;
  district: string;
  state: string;
  cleanlinessScore: number; // 0 - 100
  population: number;
  councillor: CouncillorDetails;
  sanitaryInspector: SanitaryInspectorDetails;
  services: WardServices;
  openComplaints: number;
  resolvedComplaintsAnnual: number;
  avgResolutionHours: number; // e.g. 28 hours vs 48-hour statutory SLA
  slaCompliancePercent: number;
  civicHelpline: string;
  controlRoomPhone: string;
  onlinePortalUrl: string;
  lastSyncDate: string;
  sourceUrl: string;
}

export interface CivicServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  statutorySlaHours: number;
  escalationOfficer: string;
  description: string;
  descriptionHi: string;
}

export interface NagarFilter {
  query?: string;
  corporation?: string;
  zone?: string;
  pinCode?: string;
  minCleanlinessScore?: number;
  doorToDoorOnly?: boolean;
  sortBy?: 'score_desc' | 'speed_asc' | 'complaints_desc';
}
