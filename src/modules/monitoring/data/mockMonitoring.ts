import type { InternalAlert, DatasetSnapshot } from '../types/dataMonitoring';

export const MOCK_INTERNAL_ALERTS: InternalAlert[] = [
  {
    id: 'alt-udise-001',
    category: 'new_school_records',
    categoryLabel: 'New School Records & Infrastructure Audit',
    sourceId: 'src-udise',
    sourceName: 'UDISE+ Unified District Information System',
    summary: 'UDISE source changed during annual sync batch processing.',
    validation: {
      sourceId: 'src-udise',
      sourceName: 'UDISE+ Unified District Information System',
      totalRecordsProcessed: 145000,
      changedRecordsCount: 12421,
      rejectedRecordsCount: 213,
      schemaAnomaliesCount: 4,
      confidenceScore: 78,
      requiresHumanReview: true,
      quarantineReason: 'Schema anomalies detected (4 column datatype mismatches) & elevated rejection count (213 records).'
    },
    severity: 'critical',
    status: 'Quarantined',
    detectedAt: '2026-08-25 19:30 IST',
    assignedReviewer: 'Data Ops Team (Human Review Required)'
  },
  {
    id: 'alt-cppp-002',
    category: 'new_tenders',
    categoryLabel: 'New Highway & Urban Transit Tenders',
    sourceId: 'src-cppp',
    sourceName: 'Central Public Procurement Portal (CPPP)',
    summary: 'CPPP daily sync pulled new tender releases for Class 1 contractors.',
    validation: {
      sourceId: 'src-cppp',
      sourceName: 'Central Public Procurement Portal (CPPP)',
      totalRecordsProcessed: 420,
      changedRecordsCount: 42,
      rejectedRecordsCount: 0,
      schemaAnomaliesCount: 0,
      confidenceScore: 100,
      requiresHumanReview: false
    },
    severity: 'low',
    status: 'Approved & Published',
    detectedAt: '2026-08-25 18:05 IST'
  },
  {
    id: 'alt-maharera-003',
    category: 'new_rera_orders',
    categoryLabel: 'New RERA Tribunal Adjudication Decrees',
    sourceId: 'src-maharera',
    sourceName: 'MahaRERA Official Public Register',
    summary: 'MahaRERA daily crawl ingested new tribunal penalty decrees.',
    validation: {
      sourceId: 'src-maharera',
      sourceName: 'MahaRERA Official Public Register',
      totalRecordsProcessed: 150,
      changedRecordsCount: 15,
      rejectedRecordsCount: 1,
      schemaAnomaliesCount: 0,
      confidenceScore: 96,
      requiresHumanReview: false
    },
    severity: 'medium',
    status: 'Approved & Published',
    detectedAt: '2026-08-25 22:15 IST'
  },
  {
    id: 'alt-cag-004',
    category: 'new_documents',
    categoryLabel: 'New CAG Audit Report Tabled',
    sourceId: 'src-cag',
    sourceName: 'CAG Audit Reports Register',
    summary: 'CAG Audit Report No. 4 of 2024 parsed via Tabula OCR.',
    validation: {
      sourceId: 'src-cag',
      sourceName: 'CAG Audit Reports Register',
      totalRecordsProcessed: 85,
      changedRecordsCount: 12,
      rejectedRecordsCount: 0,
      schemaAnomaliesCount: 0,
      confidenceScore: 98,
      requiresHumanReview: false
    },
    severity: 'high',
    status: 'Approved & Published',
    detectedAt: '2026-08-20 10:30 IST'
  }
];

export const MOCK_DATASET_SNAPSHOTS: DatasetSnapshot[] = [
  {
    id: 'snap-udise-2026.08.20',
    moduleName: 'School Infrastructure (UDISE+)',
    versionTag: 'v2026.08.20-stable',
    createdAt: '2026-08-20 12:00 IST',
    recordCount: 145000,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isCurrentActive: true,
    notes: 'Known-good baseline dataset snapshot before UDISE August sync attempt.'
  },
  {
    id: 'snap-infra-2026.08.24',
    moduleName: 'Public Infrastructure Projects',
    versionTag: 'v2026.08.24-stable',
    createdAt: '2026-08-24 18:00 IST',
    recordCount: 12400,
    sha256Hash: 'f4c1d293847e1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a109',
    isCurrentActive: true,
    notes: 'Verified dataset matching MoSPI Q2 Flash Report.'
  },
  {
    id: 'snap-contractors-2026.08.22',
    moduleName: 'Contractor Performance Profiles',
    versionTag: 'v2026.08.22-stable',
    createdAt: '2026-08-22 15:00 IST',
    recordCount: 4250,
    sha256Hash: 'a8b7c6d5e4f31298471209384712039847102938471029384710293847102938',
    isCurrentActive: true,
    notes: 'Class 1 Heavy Infrastructure contractors verified snapshot.'
  }
];
