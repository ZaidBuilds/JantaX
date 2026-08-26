export type CourtType = 
  | 'District & Sessions Court' 
  | 'Sub-Divisional Court' 
  | 'Family Court' 
  | 'Commercial Court';

export interface StageBottleneck {
  stage: string;
  stageHi: string;
  caseCount: number;
  percentage: number;
  avgMonths: number;
}

export interface PendencyAgeBreakdown {
  lessThan1Year: number;
  between1And3Years: number;
  between3And5Years: number;
  between5And10Years: number;
  moreThan10Years: number;
}

export interface CourtComplex {
  id: string; // e.g. "COURT-DL-PHC01"
  complexName: string;
  complexNameHi: string;
  courtType: CourtType;
  address: string;
  addressHi: string;
  pinCode: string;
  district: string;
  state: string;
  sanctionedJudges: number;
  workingJudges: number;
  vacantJudges: number;
  vacancyPercentage: number;
  totalPendingCases: number;
  civilPending: number;
  criminalPending: number;
  pendingOver5Years: number;
  pendingOver10Years: number;
  casesDisposedLastMonth: number;
  avgDisposalDays: number;
  clearanceRatePercent: number; // Disposals / Inflow * 100
  pendencyByAge: PendencyAgeBreakdown;
  stageBreakdown: StageBottleneck[];
  lastSyncDate: string;
  sourceUrl: string;
  latitude?: number;
  longitude?: number;
  dlsaContactPhone: string; // District Legal Services Authority
  dlsaEmail: string;
}

export interface CnrStep {
  stepNumber: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  example: string;
}

export interface CourtFilter {
  query?: string;
  district?: string;
  state?: string;
  courtType?: CourtType | 'All';
  pinCode?: string;
  minVacancyRate?: number;
  sortBy?: 'pendency_desc' | 'vacancy_desc' | 'over5years_desc' | 'disposal_asc';
}
