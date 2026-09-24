export type SchemeType = 'CENTRAL' | 'STATE' | 'CENTRALLY_SPONSORED';

export type SchemeCategory =
  | 'ROADS_CONNECTIVITY'    // PMGSY, NHAI, State PWD
  | 'WATER_SANITATION'      // Jal Jeevan Mission, SBM
  | 'HOUSING_SHELTER'       // PMAY-G, PMAY-U
  | 'RAILWAY_CORRIDOR'      // Indian Railways, RRTS, Flyovers, Overbridges
  | 'URBAN_TRANSFORMATION'  // AMRUT, Smart Cities, PM-eBus
  | 'HEALTHCARE_WELFARE';   // Ayushman Bharat HWCs, PM-JAY

export type SchemeProgressStatus =
  | 'Planned'
  | 'Sanctioned'
  | 'Tender Awarded'
  | 'Under Construction'
  | 'Delayed / Stalled'
  | 'Completed'
  | 'Physically Audited';

export interface SchemeMilestone {
  step: string;
  stepHi: string;
  targetDate: string;
  completedDate?: string;
  isCompleted: boolean;
  remarks?: string;
}

export interface SchemeProject {
  id: string; // e.g. "SCH-PMGSY-250001-01"
  schemeId: string; // e.g. "PMGSY-III"
  schemeName: string;
  schemeNameHi: string;
  category: SchemeCategory;
  type: SchemeType;
  ministry: string;
  ministryHi: string;
  projectName: string;
  projectNameHi: string;
  sanctionOrder: string;
  sanctionDate: string;
  targetCompletionDate: string;
  completionActualDate?: string;
  status: SchemeProgressStatus;
  progressPercentage: number;
  totalSanctionedBudgetCr: number;
  centralShareCr: number;
  stateShareCr: number;
  fundsDisbursedCr: number;
  fundsUtilizedCr: number;
  costHikePercentage: number;
  pincode: string;
  district: string;
  state: string;
  routeOrLocation: string;
  routeOrLocationHi?: string;
  startCoordinates?: { lat: number; lng: number };
  endCoordinates?: { lat: number; lng: number };
  latitude: number;
  longitude: number;
  executingAgency: string;
  contractorName: string;
  contractorId: string;
  contractorRating: number;
  dlpStatus: 'Active DLP' | 'DLP Expired' | 'Not Applicable' | 'N/A';
  groundTruthScore: number;
  citizenReportsCount: number;
  sourceUrl: string;
  lastSynced: string;
  milestones: SchemeMilestone[];
}

export interface LocalitySchemesSummary {
  pincode: string;
  district: string;
  state: string;
  totalSchemesActive: number;
  totalProjectsCount: number;
  totalSanctionedBudgetCr: number;
  totalFundsUtilizedCr: number;
  overallProgressPercentage: number;
  projectsUnderConstruction: number;
  projectsCompleted: number;
  projectsDelayed: number;
  projects: SchemeProject[];
}
