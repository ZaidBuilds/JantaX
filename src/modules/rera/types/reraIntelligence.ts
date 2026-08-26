export type ReraStatePortal = 'MahaRERA (Maharashtra)' | 'UP RERA (Uttar Pradesh)' | 'Karnataka RERA (K-RERA)' | 'Delhi RERA' | 'Haryana RERA (HRERA)';

export type ProvenanceBadge = 'Official RERA Record' | 'JantaX-Derived Calculation' | 'Community Report';

export interface ReraOrder {
  id: string;
  orderNumber: string;
  adjudicationDate: string;
  benchName: string; // e.g. "MahaRERA Bench 2 Mumbai", "UP RERA Bench Noida"
  complainantType: 'Homebuyer Association' | 'Individual Allottee' | 'Suo Moto Authority Review';
  summaryNeutral: string; // e.g. "Promoter directed to refund booking amount with 10.25% SBI MCLR interest for failure to hand over possession by agreed date."
  complianceStatus: 'Complied' | 'Under Execution' | 'Pending Appeals';
  sourcePdfUrl: string;
  sourceTitle: string;
  provenance: ProvenanceBadge;
}

export interface ReraProject {
  id: string;
  reraRegistrationNumber: string;
  statePortal: ReraStatePortal;
  projectName: string;
  projectNameHindi?: string;
  builderId: string;
  builderName: string;
  locationName: string;
  district: string;
  state: string;
  pinCode: string;
  projectType: 'Residential Apartments' | 'Commercial Complex' | 'Integrated Township' | 'Plotted Development';
  totalUnits: number;
  soldUnits: number;
  promisedCompletionDate: string;
  revisedCompletionDate: string;
  extensionsGranted: number;
  documentedDelayMonths: number;
  status: 'On Track' | 'Extended' | 'Delayed' | 'Under Review' | 'Completed' | 'Possession Handed Over';
  statusProvenances: {
    officialStatus: ProvenanceBadge;
    delayCalculation: ProvenanceBadge;
  };
  orders: ReraOrder[];
  originalSource: {
    name: string;
    url: string;
    lastUpdated: string;
  };
}

export interface BuilderProfile {
  id: string;
  builderName: string;
  promoterRegistrationId: string;
  incorporationYear: number;
  headquarters: string;
  directors: string[];
  totalRegisteredProjects: number;
  completedProjectsCount: number;
  delayedProjectsCount: number;
  totalUnitsDelivered: number;
  totalOrdersCount: number;
  trackRecordScore: number; // 0 - 100
  projects: ReraProject[];
  officialSource: {
    name: string;
    url: string;
    lastUpdated: string;
  };
}
