export type ChangeCategory = 
  | 'new_documents'
  | 'new_reports'
  | 'updated_datasets'
  | 'changed_statistics'
  | 'new_tenders'
  | 'new_rera_orders'
  | 'new_school_records'
  | 'new_govt_notifications';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'Pending Review' | 'Approved & Published' | 'Quarantined' | 'Rolled Back';

export interface SyncValidationResult {
  sourceId: string;
  sourceName: string;
  totalRecordsProcessed: number;
  changedRecordsCount: number;
  rejectedRecordsCount: number;
  schemaAnomaliesCount: number;
  confidenceScore: number; // 0 - 100
  requiresHumanReview: boolean;
  quarantineReason?: string;
}

export interface InternalAlert {
  id: string;
  category: ChangeCategory;
  categoryLabel: string;
  sourceId: string;
  sourceName: string;
  summary: string;
  validation: SyncValidationResult;
  severity: AlertSeverity;
  status: AlertStatus;
  detectedAt: string;
  assignedReviewer?: string;
}

export interface DatasetSnapshot {
  id: string;
  moduleName: string;
  versionTag: string;
  createdAt: string;
  recordCount: number;
  sha256Hash: string;
  isCurrentActive: boolean;
  notes: string;
}
