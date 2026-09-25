import type { GovtSourceDetail, SyncStatusItem, EvidenceTier, ScoringFormulaItem, CorrectionRequest } from '../types/transparency';

/** Registry of sources. Only the first two are connected or connectable today; the rest are planned. */
export const MOCK_GOVT_SOURCES: GovtSourceDetail[] = [
  {
    id: 'src-india-post-pincode',
    sourceName: 'All India Pincode Directory',
    publishingEntity: 'Department of Posts (India Post)',
    ministryOrDepartment: 'Ministry of Communications',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['PIN code', 'Post office name and type', 'Delivery status', 'District and state', 'Office coordinates'],
    updateFrequency: 'Monthly on data.gov.in',
    expectedRefreshInterval: '30d',
    processingPipeline: 'data.gov.in API or CSV download -> validate PIN format, "NA" placeholders and coordinates -> normalise -> upsert 165,521 offices -> one static file per 3-digit PIN prefix',
    knownLimitations: '715 offices are published with district and state "NA": 609 are filled from offices sharing their PIN, 106 are skipped. 14,617 offices have no usable coordinates. Current snapshot came via the india-pincode npm package (Mar 2026), not yet refreshed from data.gov.in.',
    licenseAndUsageRules: 'Government Open Data License - India (GODL)',
    officialUrl: 'https://www.data.gov.in/catalog/all-india-pincode-directory',
    lastSuccessfulSync: 'Snapshot of Mar 2026',
    status: 'Connected'
  },
  {
    id: 'src-cpcb-aqi',
    sourceName: 'Real time Air Quality Index from various locations',
    publishingEntity: 'Central Pollution Control Board',
    ministryOrDepartment: 'Ministry of Environment, Forest and Climate Change',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['Station', 'Pollutant (PM2.5, PM10, NO2, SO2, CO, Ozone, NH3)', 'Min, max and average index value', 'Last update time'],
    updateFrequency: 'Hourly',
    expectedRefreshInterval: '1h',
    processingPipeline: 'data.gov.in API every hour -> validate station, pollutant and timestamp -> match each station to its nearest PIN -> keep 30 days of readings',
    knownLimitations: 'Needs a free data.gov.in API key on the JantaX data service. Stations cover cities far better than rural districts, so many PINs are tens of kilometres from the nearest monitor.',
    licenseAndUsageRules: 'Government Open Data License - India (GODL)',
    officialUrl: 'https://www.data.gov.in/resource/real-time-air-quality-index-various-locations',
    lastSuccessfulSync: 'Waiting for an API key',
    status: 'Connector ready'
  },
  {
    id: 'src-cppp',
    sourceName: 'Central Public Procurement Portal (CPPP)',
    publishingEntity: 'National Informatics Centre (NIC) & Ministry of Finance',
    ministryOrDepartment: 'Department of Expenditure',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['Tenders Issued', 'Work Orders Executed', 'Contractor Awarded Value', 'Completion Timelines'],
    updateFrequency: 'Daily at 18:00 IST',
    expectedRefreshInterval: '24h',
    processingPipeline: 'Planned: Automated JSON API sync -> Entity Extraction -> Contractor GSTIN Match -> Immutable SHA-256 Hash Log',
    knownLimitations: 'Some state-level local body tenders below ₹10 Lakhs are published on regional gazettes with 48h update lag.',
    licenseAndUsageRules: 'National Data Sharing & Accessibility Policy (NDSAP) / GODL-India License',
    officialUrl: 'https://eprocure.gov.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  },
  {
    id: 'src-cag',
    sourceName: 'Comptroller and Auditor General of India (CAG) Audit Reports',
    publishingEntity: 'Office of the Comptroller and Auditor General of India',
    ministryOrDepartment: 'Constitutional Audit Authority',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['Public Expenditure Audits', 'Fiscal Overrun Figures', 'Physical Asset Verifications', 'Ministry Performance Observations'],
    updateFrequency: 'Quarterly & Parliamentary Tabled Sessions',
    expectedRefreshInterval: '90d',
    processingPipeline: 'Planned: PDF Tabular Extraction (Tabula Parser v0.8) -> Paragraph Excerpt Normalization -> Source Citation Tagging',
    knownLimitations: 'Audit reports cover closed financial years; real-time operational status is supplemented via ground truth verification.',
    licenseAndUsageRules: 'Fair Use Quotation & Statutory Public Record (Constitution of India Article 151)',
    officialUrl: 'https://cag.gov.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  },
  {
    id: 'src-udise',
    sourceName: 'UDISE+ Unified District Information System for Education',
    publishingEntity: 'Department of School Education & Literacy',
    ministryOrDepartment: 'Ministry of Education',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['School Infrastructure (Toilets, Electricity, Drinking Water)', 'Teacher Ratios', 'Enrollment Statistics'],
    updateFrequency: 'Annual Official Release',
    expectedRefreshInterval: '365d',
    processingPipeline: 'Planned: CSV Batch Ingestion -> Pincode Aggregation -> School Code Mapping',
    knownLimitations: 'Annual reporting cycle reflects status at time of survey.',
    licenseAndUsageRules: 'GODL-India License',
    officialUrl: 'https://udiseplus.gov.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  },
  {
    id: 'src-maharera',
    sourceName: 'MahaRERA Real Estate Regulatory Authority',
    publishingEntity: 'Government of Maharashtra',
    ministryOrDepartment: 'Housing Department Maharashtra',
    governmentLevel: 'State Government',
    dataAttributesCovered: ['Promoter Registrations', 'Promised vs Revised Completion Dates', 'RERA Tribunal Order Decrees'],
    updateFrequency: 'Daily Realtime Sync',
    expectedRefreshInterval: '24h',
    processingPipeline: 'Planned: MahaOnline Public API -> Project ID Matching -> Tribunal PDF Parser',
    knownLimitations: 'Appeal stays granted by High Courts require manual legal tracking.',
    licenseAndUsageRules: 'State Public Domain Open Data Portal',
    officialUrl: 'https://maharera.mahaonline.gov.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  },
  {
    id: 'src-uprera',
    sourceName: 'UP RERA Official Public Register',
    publishingEntity: 'Uttar Pradesh Real Estate Regulatory Authority',
    ministryOrDepartment: 'Housing & Urban Planning Department UP',
    governmentLevel: 'State Government',
    dataAttributesCovered: ['Project Sanctions', 'Promoter Extensions', 'Adjudication Bench Orders'],
    updateFrequency: 'Daily at 20:00 IST',
    expectedRefreshInterval: '24h',
    processingPipeline: 'Planned: UP-RERA Scraper API -> Order Summary Extraction -> Promoters Score Card Update',
    knownLimitations: 'Some historical orders from 2017 are scanned images requiring OCR extraction.',
    licenseAndUsageRules: 'State Public Domain Record',
    officialUrl: 'https://up-rera.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  },
  {
    id: 'src-cpgrams',
    sourceName: 'CPGRAMS Centralized Public Grievance Redress System',
    publishingEntity: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    ministryOrDepartment: 'Ministry of Personnel, Public Grievances and Pensions',
    governmentLevel: 'Union Government',
    dataAttributesCovered: ['Grievance Reference Status', 'Nodal Officer Responses', 'Disposal Timelines'],
    updateFrequency: 'Hourly Status Webhook / Pull',
    expectedRefreshInterval: '1h',
    processingPipeline: 'Planned: DARPG Gateway JSON Pull -> Grievance ID Mapping -> Response Timeline Formatting',
    knownLimitations: 'First Appeals filed offline require manual reference number linking.',
    licenseAndUsageRules: 'GODL-India License',
    officialUrl: 'https://pgportal.gov.in',
    lastSuccessfulSync: 'Never',
    status: 'Not connected'
  }
];

export const MOCK_SYNC_STATUSES: SyncStatusItem[] = [
  { id: 'src-india-post-pincode', sourceName: 'All India Pincode Directory', publishingEntity: 'Department of Posts', updateFrequency: 'Monthly', lastChecked: '25 Sep 2026', lastSuccessfulSync: 'Snapshot of Mar 2026', status: 'Connected', totalRecordsIngested: 165521 },
  { id: 'src-cpcb-aqi', sourceName: 'CPCB real-time air quality', publishingEntity: 'Central Pollution Control Board', updateFrequency: 'Hourly', lastChecked: 'Not yet', lastSuccessfulSync: 'Waiting for an API key', status: 'Connector ready', totalRecordsIngested: 0 },
  { id: 'src-cppp', sourceName: 'Central Public Procurement Portal (CPPP)', publishingEntity: 'Ministry of Finance', updateFrequency: 'Daily', lastChecked: 'Never', lastSuccessfulSync: 'Never', status: 'Not connected', totalRecordsIngested: 0 },
  { id: 'src-cag', sourceName: 'CAG Audit Reports Register', publishingEntity: 'CAG of India', updateFrequency: 'Quarterly', lastChecked: 'Never', lastSuccessfulSync: 'Never', status: 'Not connected', totalRecordsIngested: 0 },
  { id: 'src-maharera', sourceName: 'MahaRERA Public Portal', publishingEntity: 'Government of Maharashtra', updateFrequency: 'Daily', lastChecked: 'Never', lastSuccessfulSync: 'Never', status: 'Not connected', totalRecordsIngested: 0 },
  { id: 'src-uprera', sourceName: 'UP RERA Portal', publishingEntity: 'Government of Uttar Pradesh', updateFrequency: 'Daily', lastChecked: 'Never', lastSuccessfulSync: 'Never', status: 'Not connected', totalRecordsIngested: 0 },
  { id: 'src-cpgrams', sourceName: 'CPGRAMS DARPG Portal', publishingEntity: 'DARPG', updateFrequency: 'Monthly', lastChecked: 'Never', lastSuccessfulSync: 'Never', status: 'Not connected', totalRecordsIngested: 0 },
];

export const MOCK_EVIDENCE_TIERS: EvidenceTier[] = [
  {
    tierNumber: 1,
    tierName: 'Official Primary Government Record',
    confidenceRange: '100% Verified',
    description: 'Gazette notifications, CAG Audit Reports tabled in Parliament/Assemblies, CPPP signed work orders, RERA Judicial Tribunal decrees.',
    sourceTypes: ['CAG PDF Audits', 'CPPP Gazette', 'RERA Decrees', 'MoSPI Flash Reports'],
    verificationCriteria: ['Official digital signature or gazette publication number', 'Tabled in constitutional body', 'Public Domain Government URL']
  },
  {
    tierNumber: 2,
    tierName: 'Official Government API & Department Portal Data',
    confidenceRange: '95% - 99%',
    description: 'Direct API feeds from UDISE+, HMIS, CPCB AQI stations, DARPG CPGRAMS, PFMS payment releases.',
    sourceTypes: ['UDISE+ Portal', 'HMIS Health Registry', 'CPCB AQI Feed', 'PFMS Treasury Release'],
    verificationCriteria: ['Direct authenticated JSON API or CSV export from government servers', 'Timestamps verified via HTTPS headers']
  },
  {
    tierNumber: 3,
    tierName: 'JantaX Derived Calculations & Indices',
    confidenceRange: '90% - 95%',
    description: 'Calculated project delay months, cost overrun percentages, contractor overall scores, and builder track record indices.',
    sourceTypes: ['Delay Calculation Engine', 'Overrun Index', 'Scorecard Algorithms'],
    verificationCriteria: ['Explicit exposure of mathematical formula', 'Traceable back to Tier 1 and Tier 2 primary data inputs']
  },
  {
    tierNumber: 4,
    tierName: 'Verified Community Ground Reports',
    confidenceRange: '75% - 95%',
    description: 'Geo-tagged, EXIF-validated citizen photo drops and ground check consensus.',
    sourceTypes: ['Citizen EXIF Photo Drops', 'Ground Check Consensus Form'],
    verificationCriteria: ['EXIF GPS coordinates match project PIN bounding box within 500m', 'Automated media moderation check', 'Multi-user upvote consensus (>= 10 upvotes = 90% confidence)']
  }
];

export const MOCK_SCORING_FORMULAS: ScoringFormulaItem[] = [
  {
    id: 'score-infra',
    indexName: 'Infrastructure Ground Truth Score',
    targetModule: 'Public Works & Infrastructure (/projects)',
    formulaTex: 'Score = 100 - (0.4 \\times DelayMonths) - (0.3 \\times CostOverrun\\%) + (0.3 \\times CitizenConsensus)',
    descriptionText: 'Evaluates public infrastructure execution performance by penalizing delay duration and cost overruns while weighting physical ground check consensus.',
    parameters: [
      { name: 'DelayMonths', description: 'Months elapsed past original contractual target date', weightPct: 40 },
      { name: 'CostOverrun%', description: 'Percentage increase from original awarded contract value', weightPct: 30 },
      { name: 'CitizenConsensus', description: 'Ground truth photo verification consensus score (0-100)', weightPct: 30 }
    ],
    exampleCalculation: 'Project with 12 months delay, 10% cost overrun, and 85% citizen consensus: Score = 100 - (0.4 * 12) - (0.3 * 10) + (0.3 * 85) = 100 - 4.8 - 3 + 25.5 = 117.7 -> Normalized to 92.'
  },
  {
    id: 'score-contractor',
    indexName: 'Contractor Performance Index',
    targetModule: 'Contractor Intelligence (/contractors)',
    formulaTex: 'Score = (0.3 \\times CompletionRate) + (0.3 \\times OnTimeDelivery) + (0.3 \\times QualityScore) - (10 \\times ActiveDebarments) - (2 \\times PenaltyOrders)',
    descriptionText: 'Rates contracting entities based on track record of completed projects, milestone timeliness, quality audit reports, and official competent authority penalty decrees.',
    parameters: [
      { name: 'CompletionRate', description: 'Percentage of awarded projects completed & handed over', weightPct: 30 },
      { name: 'OnTimeDelivery', description: 'Percentage delivered without contractual extension', weightPct: 30 },
      { name: 'QualityScore', description: 'Quality audit core-cut score (0-100)', weightPct: 30 },
      { name: 'ActiveDebarments', description: 'Active debarment notices from competent authorities', weightPct: -10 },
      { name: 'PenaltyOrders', description: 'Documented penalty orders from competent bodies', weightPct: -2 }
    ],
    exampleCalculation: 'Contractor with 90% completion, 80% on-time, 95% quality, 0 debarments, 1 penalty: Score = (0.3*90) + (0.3*80) + (0.3*95) - (10*0) - (2*1) = 27 + 24 + 28.5 - 2 = 77.5 -> 78%.'
  },
  {
    id: 'score-rera',
    indexName: 'RERA Builder Track Record Score',
    targetModule: 'RERA Intelligence (/rera)',
    formulaTex: 'Score = (0.5 \\times DeliveredUnits\\%) + (0.3 \\times OnTimeProjects\\%) - (5 \\times ReraTribunalOrders)',
    descriptionText: 'Measures promoter reliability in delivering housing units as promised to allottees according to state RERA registrations and tribunal adjudications.',
    parameters: [
      { name: 'DeliveredUnits%', description: 'Ratio of units with possession handed over to total registered units', weightPct: 50 },
      { name: 'OnTimeProjects%', description: 'Percentage of projects completed within original promised RERA target date', weightPct: 30 },
      { name: 'ReraTribunalOrders', description: 'Documented compensation/refund orders by RERA Tribunal', weightPct: -5 }
    ],
    exampleCalculation: 'Promoter with 92% units delivered, 85% on-time projects, 1 tribunal order: Score = (0.5*92) + (0.3*85) - (5*1) = 46 + 25.5 - 5 = 66.5 -> 67%.'
  }
];

export const MOCK_CORRECTIONS_LOG: CorrectionRequest[] = [
  {
    id: 'corr-001',
    requestType: 'Official Data Challenge',
    submitterName: 'Shri R.K. Mehta (Legal Counsel)',
    organization: 'Larsen & Toubro Heavy Infrastructure Wing',
    email: 'legal.infra@example.com',
    entityId: 'cont-lt-infra',
    claimDetails: 'Challenging penalty order #PEN-44 listing date. Enclosing High Court stay order copy.',
    supportingGazetteUrl: 'https://nhai.gov.in/orders/stay-order-2024.pdf',
    status: 'Accepted & Updated',
    submittedAt: '2026-08-21 14:00 IST',
    resolutionNote: 'Penalty record updated with High Court stay order citation.'
  },
  {
    id: 'corr-002',
    requestType: 'Citizen Correction Request',
    submitterName: 'Amit Verma',
    email: 'amit.v@example.com',
    entityId: 'proj-delhi-elevated-01',
    claimDetails: 'Ground photo location tag was Mayur Vihar phase 1 exit ramp, not phase 2.',
    status: 'Accepted & Updated',
    submittedAt: '2026-08-22 11:30 IST',
    resolutionNote: 'Pincode landmark corrected to Mayur Vihar Phase 1.'
  }
];
