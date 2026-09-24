export type GovernanceTier =
  | 'GRAM_PANCHAYAT'      // Gram Pradhan / Sarpanch
  | 'BLOCK_PANCHAYAT'     // Block Pramukh / Kshetra Panchayat
  | 'ZILA_PANCHAYAT'      // Zila Panchayat Adhyaksha
  | 'MUNICIPAL_WARD'      // Ward Councillor / Parshad
  | 'MUNICIPAL_CHAIRMAN'  // Nagar Palika Chairman / Mayor
  | 'VIDHAN_SABHA'        // MLA (Member of Legislative Assembly)
  | 'LOK_SABHA'           // MP Lok Sabha
  | 'RAJYA_SABHA';        // MP Rajya Sabha

export type WorkSector =
  | 'Roads & Pathways'
  | 'Drinking Water & Pipeline'
  | 'Drainage & Sanitation'
  | 'Education & Schools'
  | 'Street Lights & Solar'
  | 'Healthcare & Clinics'
  | 'Community Hall & Infra'
  | 'Irrigation & Ponds'
  | 'Other';

export type WorkProgressStatus =
  | 'Sanctioned'
  | 'Tender Awarded'
  | 'Under Construction'
  | 'Delayed / Stalled'
  | 'Completed'
  | 'Physically Audited';

export interface InspectionRecord {
  date: string;
  inspectorName: string;
  inspectorDesignation: string;
  finding: string;
  verifiedOnSite: boolean;
}

export interface SanctionedWork {
  id: string; // e.g. "WRK-GP-250001-01"
  representativeId: string;
  workTitle: string;
  workTitleHi: string;
  sector: WorkSector;
  sanctionOrderNo: string;
  sanctionDate: string;
  completionTargetDate: string;
  completionActualDate?: string;
  sanctionedCostLakhs: number;
  actualCostLakhs: number;
  costHikePercentage: number; // e.g. 24.5% overrun
  costHikeReason?: string;
  status: WorkProgressStatus;
  pincode: string;
  district: string;
  state: string;
  locationName: string;
  locationNameHi?: string;
  latitude: number;
  longitude: number;
  contractorId: string;
  contractorName: string;
  contractorRating: number; // 0 - 100
  dlpExpiryDate?: string;
  dlpStatus: 'Active DLP' | 'DLP Expired' | 'Not Applicable';
  schemeName?: string;
  groundTruthScore: number; // 0 - 100 (citizen confidence)
  sourceUrl: string;
  lastUpdatedDate: string;
  inspections: InspectionRecord[];
}

export interface FundSummary {
  entitledAmountCr: number;
  releasedByGovtCr: number;
  sanctionedWorksCr: number;
  expenditureReportedCr: number;
  unspentBalanceCr: number;
  utilizationPercentage: number;
  fundSchemeName: string; // e.g. "15th Finance Commission Tied Grant", "MLALADS", "MPLADS"
  lastAuditedDate: string;
}

export interface PublicRepresentative {
  id: string; // e.g. "REP-GP-250001"
  tier: GovernanceTier;
  tierLabel: string;
  tierLabelHi: string;
  designation: string;
  designationHi: string;
  name: string;
  nameHi: string;
  photoUrl: string;
  bodyName: string; // e.g. "Gram Panchayat Jani Khurd", "Meerut Cantt Assembly"
  bodyNameHi: string;
  constituencyOrArea: string;
  constituencyOrAreaHi: string;
  district: string;
  state: string;
  party: string;
  partyColor: string;
  termStart: string;
  termEnd: string;
  officeAddress: string;
  officeAddressHi?: string;
  helplinePhone?: string;
  officialEmail?: string;
  pincodesCovered: string[];
  coOfficialName?: string; // e.g. "Sachiv: Ramesh Kumar" or "BDO: S.P. Singh"
  coOfficialRole?: string;
  fundSummary: FundSummary;
  totalWorksCount: number;
  totalWorksCompleted: number;
  totalWorksDelayed: number;
  avgHikePercentage: number;
  works: SanctionedWork[];
}

export interface LocalityGovernanceHierarchy {
  pincode: string;
  district: string;
  state: string;
  areaType: 'Rural' | 'Urban' | 'Semi-Urban';
  representatives: PublicRepresentative[];
  totalLocalBudgetCr: number;
  totalSpentCr: number;
  totalUnspentCr: number;
  overallUtilizationRate: number;
  totalWorksCount: number;
  averageCostHike: number;
}
