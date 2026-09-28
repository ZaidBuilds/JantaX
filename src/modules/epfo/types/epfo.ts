export interface EpfoOffice {
  id: string; // e.g. "EPFO-RO-DL-CENTRAL"
  officeName: string;
  officeNameHi: string;
  pinCode: string;
  district: string;
  state: string;
  officeType: 'Regional Office (RO)' | 'District Office (DO)' | 'Zonal Office';
  regionalCommissioner: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  statutorySlaDays: number; // 20 days per EPFO Citizen Charter
  actualAverageSettlementDays: number;
  claimsSettledThisMonth: number;
  pendingClaimsCount: number;
  rejectionRatePct: number;
  grievancesPendingOver30Days: number;
  autoSettlementEnabled: boolean; // Auto-mode under IT 2.0
  sourceAuthority: string;
  sourceUrl: string;
}

export interface EpfoClaimType {
  formNumber: string;
  title: string;
  titleHi: string;
  purpose: string;
  statutoryDays: number;
  autoSettlementLimit: number; // e.g. ₹1,00,000 for Form 31
  commonRejectionReasons: string[];
}

export interface EpfoEscalationLevel {
  level: number;
  designation: string;
  designationHi: string;
  statutoryWindowDays: number;
  actionAuthority: string;
  portalUrl: string;
}
