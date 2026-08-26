export type ContractorCategory = 'Class 1 Heavy Infrastructure' | 'Special Class Highways' | 'Urban Transit & Metro' | 'Water & Sewage Specialist' | 'Rural Roads & PMGSY';

export interface DocumentedPenalty {
  id: string;
  orderNumber: string;
  date: string;
  issuingAuthority: string; // e.g. "NHAI Regional Office Lucknow", "BBMP Standing Committee"
  penaltyAmountLakhs: number;
  reasonNeutral: string; // e.g. "Delay in submission of quality control core cut test reports for Bituminous Layer", "Non-deployment of safety marshal during nocturnal girder launch"
  sourceUrl: string;
  sourceTitle: string;
}

export interface OfficialDebarmentRecord {
  id: string;
  noticeNumber: string;
  issuingMinistry: string; // e.g. "Ministry of Road Transport and Highways (MoRTH)", "Delhi PWD"
  debarmentPeriodMonths: number;
  startDate: string;
  endDate: string;
  officialGroundNeutral: string; // e.g. "Non-fulfillment of key machinery deployment commitments under clause 14.2"
  status: 'Active Debarment' | 'Expired' | 'Under Appeal';
  sourceUrl: string;
  sourceTitle: string;
}

export interface ContractorProjectItem {
  id: string;
  projectName: string;
  sector: string;
  state: string;
  district: string;
  awardedValueLakhs: number;
  revisedValueLakhs: number;
  startDate: string;
  originalTargetDate: string;
  actualOrAnticipatedCompletionDate: string;
  extensionsMonths: number;
  status: 'Completed' | 'Delayed' | 'Extended' | 'Incomplete' | 'Under Review' | 'Verified';
  qualityRatingScore: number; // 0 - 100
  sourceUrl: string;
}

export interface TransparentPerformanceIndicator {
  overallScore: number; // 0 - 100
  completionRatePct: number; // % of projects completed
  onTimeDeliveryRatePct: number; // % completed without extension
  averageExtensionMonths: number;
  qualityAuditScore: number; // 0 - 100
  totalContractsCount: number;
  totalAwardedValueCr: number;
  activeDebarmentsCount: number;
  documentedPenaltiesCount: number;
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  registrationNumber: string;
  category: ContractorCategory;
  incorporationYear: number;
  headquarters: string;
  directors: string[];
  gstin?: string;
  cin?: string;
  performanceIndicators: TransparentPerformanceIndicator;
  projects: ContractorProjectItem[];
  penalties: DocumentedPenalty[];
  debarmentRecords: OfficialDebarmentRecord[];
  officialSource: {
    name: string;
    url: string;
    lastUpdated: string;
  };
}
