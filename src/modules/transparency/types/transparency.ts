export interface GovtSourceDetail {
  id: string;
  sourceName: string;
  publishingEntity: string;
  ministryOrDepartment: string;
  governmentLevel: 'Union Government' | 'State Government' | 'Local Municipal Authority';
  dataAttributesCovered: string[];
  updateFrequency: string; // e.g., "Daily at 18:00 IST", "Monthly Gazette Release", "Annual UDISE+ Audit"
  expectedRefreshInterval: string; // e.g. "24h", "30d"
  processingPipeline: string;
  knownLimitations: string;
  licenseAndUsageRules: string; // e.g. "NDSAP GODL-India License", "CAG Public Audit Fair Use Clause 4.2"
  officialUrl: string;
  lastSuccessfulSync: string;
  status: 'Active Sync' | 'Sync Delayed' | 'Degraded Sync';
}

export interface SyncStatusItem {
  id: string;
  sourceName: string;
  publishingEntity: string;
  updateFrequency: string;
  lastChecked: string;
  lastSuccessfulSync: string;
  status: 'Active Sync' | 'Sync Delayed' | 'Degraded Sync';
  totalRecordsIngested: number;
  syncHealthPct: number;
}

export interface EvidenceTier {
  tierNumber: 1 | 2 | 3 | 4;
  tierName: string;
  confidenceRange: string; // e.g. "95% - 100%"
  description: string;
  sourceTypes: string[];
  verificationCriteria: string[];
}

export interface ScoringFormulaItem {
  id: string;
  indexName: string;
  targetModule: string;
  formulaTex: string;
  descriptionText: string;
  parameters: Array<{ name: string; description: string; weightPct: number }>;
  exampleCalculation: string;
}

export interface CorrectionRequest {
  id: string;
  requestType: 'Citizen Correction Request' | 'Official Data Challenge';
  submitterName: string;
  organization?: string;
  email: string;
  entityId: string; // e.g. project ID, contractor ID, or report ID
  claimDetails: string;
  supportingGazetteUrl?: string;
  status: 'Under Review' | 'Accepted & Updated' | 'Rejected';
  submittedAt: string;
  resolutionNote?: string;
}
