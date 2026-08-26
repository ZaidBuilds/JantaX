export type OfficialSystem = 
  | 'CPGRAMS (Central PG Portal)' 
  | 'UP Jan Sunwai (IPGRS)' 
  | 'Karnataka IPGRS (Janasevaka)' 
  | 'Delhi PWD Grievance Portal' 
  | 'Discom Jal Board Utility Portal';

export interface GrievanceDraft {
  relevantAuthorityName: string;
  department: string;
  nodalOfficerDesignation: string;
  subjectLine: string;
  structuredBodyText: string;
  packagedEvidenceUrls: string[];
  referenceSpecsRule?: string; // e.g. "IRC:SP:84-2019 Clause 4.2" or "NFSA 2013 Section 15"
  officialPortalUrl: string;
}

export interface OfficialResponseLog {
  id: string;
  responseDate: string;
  officerName: string;
  officerDesignation: string;
  department: string;
  responseText: string;
  statusChangeTo?: string;
  sourcePdfUrl?: string;
}

export interface OfficialAppealRecord {
  id: string;
  appealDate: string;
  appellateOfficerDesignation: string;
  appealReason: string;
  status: 'Under First Appeal Review' | 'Second Appeal' | 'Closed';
}

export interface ResolutionVerification {
  verificationStatus: 'True Resolution Verified' | 'Paper Closure Flagged' | 'Verification Pending';
  groundCheckScore: number; // 0 - 100
  lastVerifiedDate?: string;
  citizenFeedbackNote: string;
}

export interface OfficialTrackingRecord {
  reportId: string;
  official_system: OfficialSystem;
  reference_number: string; // e.g. "DARPG/E/2024/001928"
  submission_time: string;
  status: 'Under Process' | 'Disposed / Resolved' | 'Rejected' | 'Pending First Appeal';
  responses: OfficialResponseLog[];
  appeals: OfficialAppealRecord[];
  resolutionVerification: ResolutionVerification;
  isDirectApiSubmission: boolean; // false = JantaX Generated Draft; true = Official API submission
}
