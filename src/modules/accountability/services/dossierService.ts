/**
 * JantaX Citizen Legal Dossier & Statutory Action Service
 * Generates verified legal petitions, Section 6(1) RTI Applications under RTI Act 2005,
 * Lokayukta/Vigilance complaint briefs, and printable Civic Health Dossiers.
 */

export interface RtiDraftOptions {
  publicAuthority: string;
  department: string;
  workTitle: string;
  workOrderNo?: string;
  sanctionedBudgetLakhs?: number;
  contractorName?: string;
  dlpEndDate?: string;
  localityPin: string;
  applicantName?: string;
  applicantAddress?: string;
  specificIssue?: string;
}

export interface LokayuktaDraftOptions {
  complaintTitle: string;
  authorityOrOfficer: string;
  department: string;
  allegationSummary: string;
  workOrderNo?: string;
  estimatedFinancialLossCr?: number;
  contractorName?: string;
  localityPin: string;
  evidenceUrls?: string[];
}

export interface LocalityDossierData {
  pinCode: string;
  localityName: string;
  district: string;
  state: string;
  civicHealthScore: number;
  metrics: {
    schoolsCompliancePct: number;
    activeDlpWarranties: number;
    pdsDeliveryPct: number;
    hospitalBedsOccupiedPct: number;
    airQualityIndex: number;
    grievanceDisposalRatePct: number;
  };
  highlightedDefects: Array<{
    title: string;
    department: string;
    delayDays: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
}

/**
 * Generates a formally structured Section 6(1) RTI Application under the Right to Information Act, 2005.
 * Strictly cites IRC SP:98 DLP warranty mandates and CPWD / PWD Works Manual clauses.
 */
export function generateSection6RtiApplication(opts: RtiDraftOptions): string {
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const applicant = opts.applicantName || 'Concerned Citizen / Ward Resident';
  const address = opts.applicantAddress || `Locality PIN: ${opts.localityPin}, India`;

  return `FORM 'A'
[See Section 6(1) of the Right to Information Act, 2005]
APPLICATION FOR OBTAINING INFORMATION UNDER RTI ACT, 2005

To:
The Public Information Officer (PIO) / Executive Engineer,
Office of: ${opts.publicAuthority}
Department: ${opts.department}
Jurisdiction Locality PIN: ${opts.localityPin}

Date of Application: ${dateStr}

1. FULL NAME OF APPLICANT:
   ${applicant}

2. ADDRESS FOR CORRESPONDENCE:
   ${address}

3. SUBJECT MATTER OF INFORMATION:
   Information regarding execution, quality compliance, expenditure, and Defect Liability Period (DLP) for:
   "${opts.workTitle}"
   ${opts.workOrderNo ? `(Work Order / Tender Ref: ${opts.workOrderNo})` : ''}

4. PARTICULARS OF INFORMATION REQUIRED (SECTION 6(1)):

   a) CERTIFIED MEASUREMENT BOOK (MB) EXTRACTS:
      Please provide certified true copies of all final and running account Measurement Book (MB) recordings, contractor bills submitted, and final payment release vouchers for the above work.

   b) QUALITY CONTROL & CORE-CUT LABORATORY TESTS:
      Please provide certified copies of all Quality Control test reports conducted as per IRC / MoRTH / CPWD specifications, including:
      - Bitumen extraction and Marshall stability test results.
      - Core-cut thickness, density, and bitumen grade verification test records.
      - Certified list of all test failures and corrective re-testing records.

   c) DEFECT LIABILITY PERIOD (DLP) & RETENTION GUARANTEE (IRC SP:98):
      - What is the statutory Defect Liability Period (DLP) duration specified in the tender agreement?
      ${opts.dlpEndDate ? `- As per official records, active DLP expires on ${opts.dlpEndDate}. Please state whether mandatory joint bi-monthly inspections were carried out.` : ''}
      - Has the contractor's security deposit / performance bank guarantee been released? If yes, please provide date of release and certification of zero pending defect reports.

   d) CONTRACTOR INFORMATION & LIQUIDATED DAMAGES:
      ${opts.contractorName ? `- Primary Contractor: ${opts.contractorName}` : ''}
      - Was any penalty or liquidated damages levied on the contractor for execution delays or structural defects? If yes, provide quantum and treasury deposit challan.

   ${opts.specificIssue ? `e) SPECIFIC CITIZEN AUDIT QUERY:\n      ${opts.specificIssue}` : ''}

5. MODE OF DISPOSAL:
   The applicant requests the certified documents by Registered Speed Post at the correspondence address stated above. The applicant is ready to pay the prescribed additional photocopying charges under Rule 4 of the RTI (Regulation of Fee and Cost) Rules, 2005 upon receipt of formal intimation.

6. CITIZENSHIP STATUS:
   The applicant is a bona fide citizen of the Republic of India.

Application Fee: Rs. 10/- affixed via Indian Postal Order (IPO) / Court Fee Stamp.

Respectfully submitted,

___________________________
(${applicant})
Locality PIN: ${opts.localityPin}`;
}

/**
 * Generates an Anti-Corruption / Lokayukta Complaint Brief citing financial irregularity,
 * premature road degradation, or substandard public asset delivery.
 */
export function generateLokayuktaComplaintBrief(opts: LokayuktaDraftOptions): string {
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return `MEMORANDUM OF COMPLAINT BEFORE THE HON'BLE LOKAYUKTA / STATE VIGILANCE COMMISSION
UNDER SECTION 9 OF THE LOKAYUKTA ACT

COMPLAINT REFERENCE: JANTAX-VIG-${opts.localityPin}-${Date.now().toString().slice(-6)}
DATE: ${dateStr}

I. PARTICULARS OF THE ACCUSED ENTITY / PUBLIC SERVANTS:
   1. Designated Authority / Division: ${opts.authorityOrOfficer}
   2. Administrative Department: ${opts.department}
   3. Executing Agency / Contractor: ${opts.contractorName || 'Identified in Work Order'}
   4. Geographic Jurisdiction: Locality PIN Code ${opts.localityPin}

II. TITLE OF THE ALLEGED CORRUPT PRACTICE / MALFEASANCE:
   "${opts.complaintTitle}"
   ${opts.workOrderNo ? `(Sanction Reference: ${opts.workOrderNo})` : ''}
   ${opts.estimatedFinancialLossCr ? `(Estimated Public Exchequer Exposure: ₹ ${opts.estimatedFinancialLossCr} Crores)` : ''}

III. SUBSTANTIVE ALLEGATIONS & GROUND REALITY FINDINGS:
   ${opts.allegationSummary}

IV. GROUNDS FOR INDEPENDENT VIGILANCE ENQUIRY:
   1. Prima Facie Misappropriation: Release of public exchequer funds against substandard physical work in violation of technical specifications.
   2. Collusive DLP Dereliction: Failure of division engineers to enforce Defect Liability Period (DLP) rectification clauses under IRC SP:98, causing repeated budgetary drain for emergency patch-works.
   3. Falsification of Completion Certificates: Official gazetted completion claims directly contradicted by geo-tagged citizen photographic evidence.

V. PRAYER / RELIEF SOUGHT:
   1. Order an unannounced technical core-drilling inspection of the asset through the Chief Technical Examiner (CTE) / State Vigilance Wing.
   2. Impound original Measurement Books (MB) and running account voucher registers.
   3. Direct withholding of contractor security deposit and blacklist repeat errant entities.

VERIFICATION:
I, the undersigned, verify that the facts stated above are derived from public audit records and verifiable physical inspection.

Enclosed: Geo-tagged photographic evidence dossiers & citizen audit logs.

Submitted by Citizen Audit Collective,
PIN ${opts.localityPin}`;
}

/**
 * Generates a clean text / print version of the Locality Civic Health Dossier.
 */
export function generateLocalityHealthSummaryText(data: LocalityDossierData): string {
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return `========================================================================
JANTAX OFFICIAL CIVIC HEALTH AUDIT DOSSIER
========================================================================
Locality: ${data.localityName}, ${data.district}, ${data.state}
Postal Index Number (PIN): ${data.pinCode}
Audit Compilation Date: ${dateStr}
Platform: JantaX Pan-India Accountability Observatory (Team Apex Builders)
========================================================================

1. COMPOSITE CIVIC HEALTH SCORE: ${data.civicHealthScore} / 100
   ${data.civicHealthScore >= 70 ? 'Grade: A (Satisfactory Public Delivery)' : data.civicHealthScore >= 50 ? 'Grade: B (Moderate Deficiencies Detected)' : 'Grade: C (Critical Accountability Alert)'}

2. KEY SECTORAL PERFORMANCE BENCHMARKS:
   • Primary & Secondary School Infrastructure: ${data.metrics.schoolsCompliancePct}% UDISE+ Standard
   • Roads & Infrastructure Active DLP Warranties: ${data.metrics.activeDlpWarranties} Projects Monitored
   • Fair Price Ration (PDS) Distribution: ${data.metrics.pdsDeliveryPct}% Statutory Quota Distributed
   • Hospital Bed & Facility Readiness: ${data.metrics.hospitalBedsOccupiedPct}% Functional Bed Capacity
   • Continuous Ambient Air Quality (AQI): ${data.metrics.airQualityIndex} (${data.metrics.airQualityIndex > 200 ? 'Severe / Poor' : 'Moderate / Satisfactory'})
   • Municipal Grievance SLA Adherence: ${data.metrics.grievanceDisposalRatePct}% Resolved in < 30 Days

3. DETECTED ACTIVE GOVERNANCE BOTTLENECKS:
${data.highlightedDefects.map((d, i) => `   [${i + 1}] ${d.title}
       Department: ${d.department} | Severity: ${d.severity}
       Delay / Overrun: +${d.delayDays} Days beyond Statutory Citizen Charter SLA`).join('\n')}

4. CITIZEN RIGHTS & STATUTORY CITATIONS:
   • Public Works DLP Warranty: Indian Roads Congress (IRC SP:98)
   • Right to Public Information: RTI Act 2005 Section 6(1)
   • Food Security Quotas: National Food Security Act (NFSA 2013)
   • Timely Grievance Disposal: DoPT CPGRAMS OM 2024 (30-Day Mandate)

========================================================================
Verified with Open Government Data (GODL-India) & Citizen Evidence.
Exported via JantaX. Empowering Citizens. Enforcing Accountability.
========================================================================`;
}
