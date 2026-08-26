export type HouseType = 'Lok Sabha' | 'Rajya Sabha' | 'Vidhan Sabha' | 'Vidhan Parishad';

export type SectorType = 
  | 'Drinking Water' 
  | 'Education' 
  | 'Electricity & Solar' 
  | 'Health & Sanitation' 
  | 'Roads & Pathways' 
  | 'Community Infrastructure' 
  | 'Other';

export type WorkStatus = 'Completed' | 'In Progress' | 'Sanctioned' | 'Under Review' | 'Cancelled';

export interface FundSummary {
  entitledAmountCr: number;
  releasedByGovtCr: number;
  sanctionedWorksCr: number;
  expenditureReportedCr: number;
  unspentBalanceCr: number;
  utilizationPercentage: number;
  lastUpdatedDate: string;
}

export interface Representative {
  id: string; // e.g. "REP-LS-DL-01"
  name: string;
  nameHi: string;
  house: HouseType;
  constituencyName: string;
  constituencyNameHi: string;
  state: string;
  stateHi: string;
  party: string;
  partyColor: string;
  photoUrl: string;
  termStart: string;
  termEnd: string;
  fundSummary: FundSummary;
  totalWorksRecommended: number;
  totalWorksSanctioned: number;
  totalWorksCompleted: number;
  keySectors: { sector: SectorType; amountLakhs: number; count: number }[];
}

export interface MpladsWork {
  id: string; // e.g. "MPLAD-DL01-2025-001"
  representativeId: string;
  representativeName: string;
  workTitle: string;
  workTitleHi: string;
  sector: SectorType;
  sanctionDate: string;
  completionDate?: string;
  sanctionCostLakhs: number;
  spentAmountLakhs: number;
  executingAgency: string;
  status: WorkStatus;
  pinCode: string;
  district: string;
  state: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  groundTruthScore: number; // 0 - 100
  sanctionOrderNumber: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  inspections: {
    date: string;
    inspector: string;
    finding: string;
    verified: boolean;
  }[];
}

export interface MpladsFilter {
  query?: string;
  house?: HouseType | 'All';
  state?: string;
  sector?: SectorType | 'All';
  status?: WorkStatus | 'All';
  pinCode?: string;
  sortBy?: 'cost_desc' | 'cost_asc' | 'date_desc' | 'score_desc';
}
