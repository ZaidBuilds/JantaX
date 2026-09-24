/**
 * JantaX Pan-India Contractor Performance & Liquidated Damages Ledger Service
 * Implements statutory delay calculations under CPWD Works Manual 2019 (Clause 2),
 * NHAI EPC Schedule K, and State PWD contracts. Capped at 10% statutory ceiling.
 */

export interface LiquidatedDamageEntry {
  id: string;
  contractorId: string;
  contractorName: string;
  cinNumber: string;
  workOrderNumber: string;
  projectName: string;
  department: string;
  state: string;
  pinCode: string;
  sanctionedBudgetCr: number;
  scheduledCompletionDate: string;
  actualOrCurrentDate: string;
  delayDays: number;
  accruedDamagesLakhs: number;
  maxPermissibleDamagesLakhs: number; // 10% cap of sanctioned budget
  recoveryStatus: 'Pending Recovery' | 'Deducted from Running Bill' | 'Disputed in Arbitration' | 'Recovery Notice Served';
  clauseReference: string;
  issuingOfficer: string;
  penaltyDemandNoticeUrl?: string;
}

export interface LedgerSummaryMetrics {
  totalOverdueProjects: number;
  totalAccruedDamagesCr: number;
  totalDeductedCr: number;
  pendingExchequerRecoveryCr: number;
  arbitrationDisputedCount: number;
}

/**
 * Calculates statutory liquidated damages based on delay days.
 * Standard CPWD formula: 0.1% per day up to a max ceiling of 10% of contract value.
 */
export function calculateLiquidatedDamages(
  sanctionedBudgetCr: number,
  delayDays: number,
  dailyRatePct = 0.05
): { accruedLakhs: number; maxCapLakhs: number; isCapped: boolean } {
  const budgetLakhs = sanctionedBudgetCr * 100;
  const maxCapLakhs = Math.round(budgetLakhs * 0.10 * 100) / 100; // 10% ceiling
  const rawDamages = Math.round((budgetLakhs * (dailyRatePct / 100) * Math.max(0, delayDays)) * 100) / 100;

  const isCapped = rawDamages >= maxCapLakhs;
  const accruedLakhs = isCapped ? maxCapLakhs : rawDamages;

  return { accruedLakhs, maxCapLakhs, isCapped };
}

export const MOCK_DAMAGES_LEDGER: LiquidatedDamageEntry[] = [
  {
    id: 'ld-001',
    contractorId: 'c-01',
    contractorName: 'Rajdeep Infrastructure Pvt Ltd',
    cinNumber: 'U45201UP2008PTC035124',
    workOrderNumber: 'PWD-MTC-2023-8819',
    projectName: 'Meerut Arterial Ring Road Pavement Upgradation',
    department: 'UP Public Works Department (Roads Wing)',
    state: 'Uttar Pradesh',
    pinCode: '250001',
    sanctionedBudgetCr: 4.80,
    scheduledCompletionDate: '2024-03-31',
    actualOrCurrentDate: '2024-11-15',
    delayDays: 229,
    accruedDamagesLakhs: 48.0, // Capped at 10%
    maxPermissibleDamagesLakhs: 48.0,
    recoveryStatus: 'Recovery Notice Served',
    clauseReference: 'CPWD Works Manual 2019 Clause 2 (Delay Penalties)',
    issuingOfficer: 'Er. R. K. Saxena, Superintending Engineer, Meerut Circle',
    penaltyDemandNoticeUrl: 'https://jantax.gov.in/docs/sample_notice_pwd_8819.pdf'
  },
  {
    id: 'ld-002',
    contractorId: 'c-02',
    contractorName: 'Kaveri Urban Constructions Ltd',
    cinNumber: 'U45203KA2012PLC049912',
    workOrderNumber: 'BBMP-ENG-SWD-2023-412',
    projectName: 'Stormwater Primary Drain Retaining Wall & Culvert Overhaul',
    department: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    state: 'Karnataka',
    pinCode: '560001',
    sanctionedBudgetCr: 6.50,
    scheduledCompletionDate: '2024-06-30',
    actualOrCurrentDate: '2024-12-10',
    delayDays: 163,
    accruedDamagesLakhs: 52.98,
    maxPermissibleDamagesLakhs: 65.0,
    recoveryStatus: 'Deducted from Running Bill',
    clauseReference: 'KTPP Act Section 14 & KWD Form 27 Clause 3',
    issuingOfficer: 'Executive Engineer (Major Stormwater Drains), BBMP'
  },
  {
    id: 'ld-003',
    contractorId: 'c-03',
    contractorName: 'Yamuna Pavement Tech LLP',
    cinNumber: 'AAH-4991',
    workOrderNumber: 'DEL-PWD-DIV4-2024-102',
    projectName: 'Outer Ring Road Flyover Expansion Joint Rectification',
    department: 'Delhi Public Works Department (Flyover Project Circle)',
    state: 'Delhi',
    pinCode: '110001',
    sanctionedBudgetCr: 3.20,
    scheduledCompletionDate: '2024-05-15',
    actualOrCurrentDate: '2024-09-30',
    delayDays: 138,
    accruedDamagesLakhs: 22.08,
    maxPermissibleDamagesLakhs: 32.0,
    recoveryStatus: 'Pending Recovery',
    clauseReference: 'IRC:SP:84-2019 Schedule K Liquidated Damages',
    issuingOfficer: 'Chief Engineer (Flyovers Zone), Delhi PWD'
  },
  {
    id: 'ld-004',
    contractorId: 'c-04',
    contractorName: 'Patliputra Civil Works & Sons',
    cinNumber: 'U45200BR2015PTC021980',
    workOrderNumber: 'RWD-PAT-MMGSY-2023-77',
    projectName: 'Danapur-Khagaul Rural Connectivity Link Road',
    department: 'Rural Works Department (RWD), Bihar',
    state: 'Bihar',
    pinCode: '800001',
    sanctionedBudgetCr: 2.40,
    scheduledCompletionDate: '2023-12-31',
    actualOrCurrentDate: '2024-10-20',
    delayDays: 294,
    accruedDamagesLakhs: 24.0, // Capped at 10%
    maxPermissibleDamagesLakhs: 24.0,
    recoveryStatus: 'Disputed in Arbitration',
    clauseReference: 'Bihar Public Works Department Code Section 21',
    issuingOfficer: 'Superintending Engineer, RWD Patna Circle'
  },
  {
    id: 'ld-005',
    contractorId: 'c-05',
    contractorName: 'Brahmaputra Engineering Syndicate',
    cinNumber: 'U45202AS2011PLC011244',
    workOrderNumber: 'GMC-ENG-ROAD-2024-301',
    projectName: 'GS Road Multi-Utility Ducting & Drainage Channel',
    department: 'Guwahati Municipal Corporation',
    state: 'Assam',
    pinCode: '781001',
    sanctionedBudgetCr: 5.10,
    scheduledCompletionDate: '2024-04-30',
    actualOrCurrentDate: '2024-10-15',
    delayDays: 168,
    accruedDamagesLakhs: 42.84,
    maxPermissibleDamagesLakhs: 51.0,
    recoveryStatus: 'Recovery Notice Served',
    clauseReference: 'GMC Act 1971 Works Regulations',
    issuingOfficer: 'Commissioner, Guwahati Municipal Corporation'
  }
];

export function getLiquidatedDamagesLedger(filter?: {
  state?: string;
  recoveryStatus?: string;
  query?: string;
}): LiquidatedDamageEntry[] {
  let list = MOCK_DAMAGES_LEDGER;

  if (filter?.state && filter.state !== 'All') {
    list = list.filter((item) => item.state.toLowerCase() === filter.state?.toLowerCase());
  }

  if (filter?.recoveryStatus && filter.recoveryStatus !== 'All') {
    list = list.filter((item) => item.recoveryStatus === filter.recoveryStatus);
  }

  if (filter?.query && filter.query.trim().length > 0) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.contractorName.toLowerCase().includes(q) ||
        item.projectName.toLowerCase().includes(q) ||
        item.workOrderNumber.toLowerCase().includes(q) ||
        item.pinCode.includes(q)
    );
  }

  return list;
}

export function getLedgerSummaryMetrics(): LedgerSummaryMetrics {
  const list = MOCK_DAMAGES_LEDGER;
  const totalOverdueProjects = list.length;
  
  let totalAccruedLakhs = 0;
  let totalDeductedLakhs = 0;
  let disputedCount = 0;

  for (const item of list) {
    totalAccruedLakhs += item.accruedDamagesLakhs;
    if (item.recoveryStatus === 'Deducted from Running Bill') {
      totalDeductedLakhs += item.accruedDamagesLakhs;
    }
    if (item.recoveryStatus === 'Disputed in Arbitration') {
      disputedCount += 1;
    }
  }

  const pendingRecoveryLakhs = Math.max(0, totalAccruedLakhs - totalDeductedLakhs);

  return {
    totalOverdueProjects,
    totalAccruedDamagesCr: Math.round((totalAccruedLakhs / 100) * 100) / 100,
    totalDeductedCr: Math.round((totalDeductedLakhs / 100) * 100) / 100,
    pendingExchequerRecoveryCr: Math.round((pendingRecoveryLakhs / 100) * 100) / 100,
    arbitrationDisputedCount: disputedCount
  };
}
