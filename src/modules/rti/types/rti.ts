export type GovtLevel = 
  | 'Union Ministry' 
  | 'State Department' 
  | 'Municipal / Local Body' 
  | 'Public Sector Undertaking';

export interface OfficerDetails {
  name: string;
  nameHi: string;
  designation: string;
  designationHi: string;
  email: string;
  phone: string;
  officeAddress: string;
}

export interface Section8Exemption {
  clause: string;
  clauseTitle: string;
  clauseTitleHi: string;
  count: number;
  percentage: number;
}

export interface PublicAuthority {
  id: string; // e.g. "RTI-AUTH-MORTH"
  authorityName: string;
  authorityNameHi: string;
  parentMinistry: string;
  parentMinistryHi: string;
  governmentLevel: GovtLevel;
  pinCode: string;
  city: string;
  state: string;
  avgResponseDays: number; // statutory standard is 30 days
  totalRequestsReceivedAnnual: number;
  disposedWithin30DaysPercent: number;
  pendingBeyond30DaysPercent: number;
  rejectionRatePercent: number;
  firstAppealsFiled: number;
  firstAppealsUpheldPercent: number;
  topExemptions: Section8Exemption[];
  cpio: OfficerDetails;
  faa: OfficerDetails;
  onlineFilingSupported: boolean;
  onlinePortalUrl: string;
  lastQuarterSync: string;
  sourceUrl: string;
}

export interface RtiDraftTemplate {
  applicationType: 'Initial Request (Section 6(1))' | 'First Appeal (Section 19(1))' | 'Life & Liberty (Section 7(1))';
  title: string;
  titleHi: string;
  statutoryTimeline: string;
  feeRule: string;
  templateText: string;
  guidanceNotes: string[];
  officialPortalUrl: string;
}

export interface RtiFilter {
  query?: string;
  governmentLevel?: GovtLevel | 'All';
  maxResponseDays?: number;
  onlineFilingOnly?: boolean;
  pinCode?: string;
  sortBy?: 'speed_asc' | 'requests_desc' | 'rejection_asc';
}
