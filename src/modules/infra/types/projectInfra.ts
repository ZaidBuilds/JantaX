export type NeutralStatus = 
  | 'Delayed' 
  | 'Extended' 
  | 'Incomplete' 
  | 'Under Review' 
  | 'Completed' 
  | 'Verified';

export interface TenderRecord {
  id: string;
  tenderNumber: string;
  title: string;
  publishingPortal: string; // e.g. "Central Public Procurement Portal (CPPP)", "GeM", "UP e-Procurement"
  issueDate: string;
  closingDate: string;
  estimatedCostLakhs: number;
  sourceUrl: string;
  sourceTitle: string;
}

export interface WorkOrderRecord {
  id: string;
  workOrderNumber: string;
  issueDate: string;
  awardedContractor: string;
  awardedValueLakhs: number;
  signingAuthority: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface ContractorRecord {
  id: string;
  name: string;
  registrationNumber: string;
  jvPartners?: string[];
  pastProjectsCount: number;
  rating?: number;
}

export interface ExtensionRecord {
  id: string;
  grantDate: string;
  grantedMonths: number;
  revisedCompletionDate: string;
  neutralReason: string; // e.g. "Monsoon disruption and high flood level adjustment", "Utility line relocation procedures"
  approvingAuthority: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface PaymentRecord {
  id: string;
  disbursementDate: string;
  amountLakhs: number;
  milestone: string;
  paymentStatus: 'Disbursed' | 'Under Review' | 'Held';
  sourceUrl: string;
  sourceTitle: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  documentType: 'MoSPI Flash Report' | 'CAG Audit Report' | 'CPPP Tender Award' | 'Work Order' | 'RTI Response' | 'Press Release' | 'GeM Contract';
  publishDate: string;
  issuingBody: string;
  url: string;
  fileSize: string;
  summary: string;
}

export interface HistorySource {
  title: string;
  url: string;
  publisher: string;
  documentRef?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  titleHindi?: string;
  eventType: 'Tender' | 'Work Order' | 'Extension' | 'Milestone' | 'Payment' | 'Inspection' | 'Completion';
  neutralDescription: string;
  statusBadge: NeutralStatus;
  source: HistorySource;
}

export interface CitizenReport {
  id: string;
  userName: string;
  ratingValue: number;
  comment: string;
  imageUrl?: string;
  upvotes: number;
  timestamp: string;
}

export interface GeoTaggedPhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  lat: number;
  lng: number;
}

export interface GroundTruthRecord {
  physicalScore: number; // 0 - 100
  verificationStatus: 'Verified' | 'Under Review' | 'Incomplete' | 'Pending Verification';
  lastVerifiedDate: string;
  verifiedBy: string;
  physicalStatusNote: string;
  geoTaggedPhotos: GeoTaggedPhoto[];
  citizenReports: CitizenReport[];
}

export interface InfraProject {
  id: string;
  pinCode: string;
  nameEnglish: string;
  nameHindi: string;
  sector: 'Roads & Highways' | 'Urban Transit' | 'Water & Sewage' | 'Bridges & Culverts' | 'Power & Energy' | 'Social Infra';
  state: string;
  district: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: NeutralStatus;
  statusHindi: string;
  ministry: string;
  implementingAgency: string;
  sanctioningBody: string;
  responsibleOfficer: string;
  responsibleOfficerDesignation: string;
  leadContractor: string;
  contractorDetails: ContractorRecord;
  
  // Financial metrics (all in Lakhs for precision)
  budgetOriginalLakhs: number;
  budgetAnticipatedLakhs: number;
  contractValueOriginalLakhs: number;
  contractValueRevisedLakhs: number;
  expenditureToDateLakhs: number;
  progressPhysical: number; // 0 - 100
  progressFinancial: number; // 0 - 100
  
  // Dates
  startDate: string;
  originalCompletionDate: string;
  anticipatedCompletionDate: string;
  
  clearances: {
    landAcquisition: number; // percentage
    forestClearance: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'N/A';
    environmentalClearance: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'N/A';
    utilityShifting: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'N/A';
  };
  
  neutralDelaySummary: string;
  neutralDelaySummaryHindi: string;
  
  tenders: TenderRecord[];
  workOrders: WorkOrderRecord[];
  extensions: ExtensionRecord[];
  payments: PaymentRecord[];
  evidenceDocuments: EvidenceDocument[];
  history: TimelineEvent[];
  groundTruth: GroundTruthRecord;
  
  originalSource: {
    name: string;
    url: string;
    lastUpdated: string;
    publicationRef?: string;
  };
}
