/**
 * SourceConnector — canonical interface for every source (Phase 06)
 * Pipeline: SOURCE → FETCH → RAW STORAGE → CHANGE DETECTION → PARSE → EXTRACT → VALIDATE → NORMALIZE → ENTITY RESOLUTION → VERSION → DATABASE → QUALITY CHECK → PUBLISH
 */
export interface FetchResult {
  url: string;
  contentType: string;
  size: number;
  hash: string;
  buffer: Buffer;
  fetchedAt: Date;
}

export interface ParsedRow {
  [key: string]: any;
}

export interface NormalizedEntity {
  entityType: string; // e.g. School, PincodeBudget
  entityId: string; // stable external id (udiseCode, pincode)
  data: Record<string, any>;
  sourceId: string;
}

export interface ChangeSet {
  newRecords: NormalizedEntity[];
  updatedRecords: { before: NormalizedEntity; after: NormalizedEntity }[];
  deletedRecords: NormalizedEntity[];
  correctedRecords: { before: NormalizedEntity; after: NormalizedEntity }[];
  schemaChanged: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { row: number; field: string; message: string }[];
  warnings: { row: number; field: string; message: string }[];
}

export interface SyncObservability {
  sourceId: string;
  startedAt: Date;
  durationMs?: number;
  recordsFetched: number;
  recordsInserted: number;
  recordsUpdated: number;
  recordsDeleted: number;
  recordsRejected: number;
  validationFailures: number;
  parserFailures: number;
  sourceAvailability: 'ok' | 'failed' | 'stale';
  lastSync: Date;
  status: 'success' | 'failed' | 'partial';
  log: string[];
}

export interface SourceConnector {
  sourceId: string;
  // Schedules: daily|weekly|monthly|quarterly|annual|event-driven
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'event';
  fetch(): Promise<FetchResult>;
  validate(buffer: Buffer, contentType: string): Promise<ValidationResult>;
  parse(buffer: Buffer, contentType: string): Promise<ParsedRow[]>;
  normalize(rows: ParsedRow[]): Promise<NormalizedEntity[]>;
  detectChanges(normalized: NormalizedEntity[]): Promise<ChangeSet>;
  sync(changes: ChangeSet): Promise<{ inserted: number; updated: number; deleted: number }>;
}
