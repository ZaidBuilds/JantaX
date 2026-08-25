export interface CityInfo {
  id: string;
  name: string;
  shortName: string;
  stateId: string;
  stateName: string;
  defaultPincode: string;
  municipalBody: string;
  activeWards: number;
  totalBudgetCr: number;
  keyZones?: string[];
}

export interface StateInfo {
  id: string;
  name: string;
  stateCode: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East' | 'National' | 'UT';
  cities: CityInfo[];
}

export type Language = 'en' | 'hi' | 'kn' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'ml' | 'pa';

export type RiskTier = 'CRITICAL_RISK' | 'HIGH_RISK' | 'MODERATE' | 'COMPLIANT' | 'EXEMPLARY';

export type DlpStatus = 'ACTIVE_DLP_PROTECTED' | 'DLP_EXPIRED' | 'DLP_BREACH_UNRESOLVED';

export type InfraCategory = 
  | 'ROADS_PAVEMENT'
  | 'HEALTH_PHC'
  | 'WATER_JAL_JEEVAN'
  | 'SCHOOL_EDUCATION'
  | 'DRAINAGE_FLOOD'
  | 'BRIDGE_CULVERT';

export type DefectType = 
  | 'Pothole Cluster' 
  | 'Asphalt Stripping & Ravelling' 
  | 'Trench & Road Cave-in' 
  | 'Drainage Inundation & Waterlogging' 
  | 'Premature Surface Cracking'
  | 'Substandard Bitumen / Bleeding'
  | 'Locked PHC / Clinic'
  | 'Dry Tap / Broken Pipeline'
  | 'Non-Functional School / Infra'
  | 'Cracked Culvert / Bridge Slab';

export type SeverityLevel = 'CRITICAL_HAZARD' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface BitumenSpecs {
  bitumenGrade: 'VG-30' | 'VG-40' | 'CRMB-55' | 'PMB-120' | 'Standard Bitumen 60/70' | string;
  thicknessMm: number;
  pavementType: 'Dense Bituminous Macadam (DBM) + BC' | 'PQC / White-Topping' | 'Interlocking Concrete Paver' | 'Micro-Surfacing' | 'Mastic Asphalt + Bituminous Concrete' | 'DBM + Bituminous Concrete' | 'Mastic Bituminous Concrete' | string;
  sanctionedWarrantyMonths: number;
}

export interface NamedOfficer {
  name: string;
  designation: string; // e.g. Executive Engineer (EE), Junior Engineer (JE), Chief Engineer
  department: string; // e.g. BBMP South Road Infrastructure Division
  officeAddress?: string;
  phoneOffice?: string;
  signedCertificateDate?: string;
}

export interface NamedPolitician {
  name: string;
  role: 'MLA' | 'Corporator' | 'MP';
  constituency: string;
  party?: string;
}

export interface ClaimVsRealityData {
  sanctionedCostFormatted: string;
  sanctionedSpecs: string;
  officialClaim: string; // e.g. "₹2.4 Cr Bitumen VG-30 complete with 3-year warranty and IRC quality certificate"
  officialSourceDoc: string; // e.g. "BBMP/2023-24/EE/RD/WO-9941 (Vol II, Pg 44)"
  cagAuditReference?: string; // e.g. "CAG Report No. 4 of 2024 (Local Bodies Karnataka), Para 3.2.1"
  cagFindingSnippet?: string; // e.g. "Measurement books inflated by 35%; core cut tests showed bitumen content 3.8% against mandated 5.4%"
  realityGroundTruth: string; // e.g. "14 massive craters after first monsoon rain, 4 months after handover. Core thickness: 22mm vs 50mm sanctioned."
  discrepancyPercentage: number; // e.g. 56%
  evidencePhotoUrl: string;
  evidenceDate: string;
  evidenceSource: 'Anonymous Citizen Photo Drop' | 'RWA Core-Cut Audit' | 'Lokayukta Inspection Report';
  sourcePortalUrl: string;
}

export interface WorkOrder {
  id: string;
  pincode: string;
  tenderNumber: string;
  procurementPortal: 'State e-Procurement' | 'GeM' | 'Municipal Work Order' | 'State PWD Portal' | string;
  title: string;
  wardId: string;
  wardName: string;
  zone: string;
  city: string;
  contractorId: string;
  contractorName: string;
  contractorDirectors: string[];
  executiveEngineer: NamedOfficer;
  juniorEngineer?: NamedOfficer;
  electedRepresentative: NamedPolitician;
  sanctionedAmountLakhs: number;
  awardedDate: string;
  completionDate: string;
  dlpExpiryDate: string;
  dlpStatus: DlpStatus;
  specifications: BitumenSpecs;
  roadLengthKm: number;
  roadName: string;
  startPoint: string;
  endPoint: string;
  totalPotholeReports: number;
  activeFailuresCount: number;
  coordinates: {
    lat1: number;
    lng1: number;
    lat2: number;
    lng2: number;
  };
  claimVsReality: ClaimVsRealityData;
}

export interface PincodeRecord {
  pincode: string;
  areaName: string;
  wardName: string;
  city: string;
  state: string;
  totalFundsSpentCrores: number;
  dominantContractor: {
    contractorId: string;
    name: string;
    directors: string[];
    sharePercent: number;
  };
  executiveEngineer: NamedOfficer;
  electedRepresentative: NamedPolitician;
  totalAuditedWorks: number;
  failedWorksCount: number;
  activeDlpBreachesCount: number;
  cagAuditNotes: string[];
  keyRoads: string[];
}

export interface ContractorNotice {
  id: string;
  date: string;
  type: 'SHOW_CAUSE' | 'PENALTY_IMPOSED' | 'DLP_RETENTION_WITHHELD' | 'SUSPENSION_WARNING' | 'COMMENDATION';
  title: string;
  authority: string;
  description: string;
  penaltyAmountLakhs?: number;
}

export interface Contractor {
  id: string;
  name: string;
  registrationNumber: string;
  class: 'Class-I Super Contractor' | 'Class-I PWD' | 'Class-II Municipal' | 'Specialized Highway Grade';
  registeredCity: string;
  directors: string[];
  integrityScore: number; // 0 (Worst) to 100 (Best)
  riskTier: RiskTier;
  monsoonFailureRate: number; // % of roads that developed major potholes within 1st monsoon
  dlpViolationRate: number; // % of defect complaints not resolved within mandatory 15-day DLP window
  wardMonopolyIndex: number; // % of tenders won in their primary operating ward (HHI concentration)
  primaryWard: string;
  primaryPincode: string;
  totalContractsValueCrores: number;
  totalRoadsBuiltCount: number;
  totalRoadLengthKm: number;
  activeDlpRoadsCount: number;
  activeDlpViolationsCount: number;
  resolvedComplaintsCount: number;
  unresolvedComplaintsCount: number;
  avgPotholeAppearanceMonths: number; // Avg time before first failure
  notices: ContractorNotice[];
  tags: string[];
}

export interface RoadDefectReport {
  id: string;
  workOrderId: string;
  pincode: string;
  roadName: string;
  wardId: string;
  wardName: string;
  city: string;
  contractorId: string;
  contractorName: string;
  executiveEngineerName?: string;
  reportedDate: string;
  defectType: DefectType;
  severity: SeverityLevel;
  isDlpCovered: boolean;
  daysSinceReported: number;
  description: string;
  photoUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  citizenUpvotes: number;
  status: 'OPEN_DLP_BREACH' | 'VERIFIED_BY_RWA' | 'NOTICE_SERVED' | 'RECTIFIED' | 'DEFAULTED';
  reporterName: string;
  isAnonymousDrop?: boolean;
}

export interface WardData {
  id: string;
  number: number;
  name: string;
  pincode: string;
  zone: string;
  city: string;
  totalRoadLengthKm: number;
  annualBudgetCrores: number;
  dominantContractor: {
    contractorId: string;
    name: string;
    directors?: string[];
    sharePercent: number;
    tendersWonCount: number;
  };
  executiveEngineer?: NamedOfficer;
  electedRepresentative?: NamedPolitician;
  monsoonDamageScore: number; // 1 (Best) - 10 (Critical disaster)
  activePotholesCount: number;
  dlpCoveredBreachesCount: number;
  coordinates: {
    centerLat: number;
    centerLng: number;
  };
}

export interface WhatsAppCardData {
  pincode: string;
  roadName: string;
  wardName: string;
  city: string;
  sanctionedAmount: string;
  contractorName: string;
  contractorDirectors: string;
  executiveEngineer: string;
  electedRep: string;
  officialClaim: string;
  groundReality: string;
  discrepancyNumber: string;
  cagOrDocProof: string;
  proofUrl: string;
}

export interface ActionDossier {
  contractorId: string;
  contractorName: string;
  contractorDirectors?: string[];
  executiveEngineer?: NamedOfficer;
  electedRep?: NamedPolitician;
  pincode?: string;
  wardName: string;
  zone: string;
  city: string;
  failedRoadsCount: number;
  totalWastedFundsCrores: number;
  activeDlpBreachesCount: number;
  workOrdersList: {
    tenderNumber: string;
    roadName: string;
    amountLakhs: number;
    dlpExpiryDate: string;
    failures: number;
    claimVsRealitySnippet?: string;
  }[];
  generatedDate: string;
  rtiDraftText?: string;
  vigilanceNoticeText?: string;
  wardResolutionText?: string;
  whatsAppShareText?: string;
  shareableSummary: string;
}

export interface AiAuditRequest {
  tenderText?: string;
  workOrderId?: string;
  contractorId?: string;
  pincode?: string;
  wardName?: string;
}

export interface AiAuditResponse {
  riskScore: number; // 0-100
  overallVerdict: string;
  redFlags: {
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    category: 'Bitumen Specification' | 'DLP Clause Breach' | 'Tender Cartelization' | 'Pricing Anomaly';
    title: string;
    explanation: string;
    ircClauseViolation?: string;
  }[];
  statutoryViolations: string[];
  namedAccountability: {
    contractorRole: string;
    officerRole: string;
    cagClauseRef?: string;
  };
  recommendedCitizenActions: string[];
  estimatedPublicLossLakhs?: number;
}
