// PMGSY package connector — DISABLED (returns no rows).
//
// Package-level PMGSY data (package no., contractor, DLP dates) lives on
// OMMAS (omms.nic.in) with no public API. The old version generated template
// road packages and contractor names for any PIN, which is fabricated data,
// so it now returns [].
//
// Real PMGSY data for any PIN's district: server/src/live/roads.ts → /api/live/:pin/infra
// (MoRD PMGSY Physical & Financial Progress, updated daily).

export interface PmgsyPackagePayload {
  packageNo: string;
  roadName: string;
  roadNameHi: string;
  state: string;
  district: string;
  block: string;
  sanctionYear: string;
  lengthKm: number;
  sanctionCostLakhs: number;
  maintenanceCostLakhs: number;
  contractorName: string;
  completionDate: string;
  dlpExpiryDate: string;
  isDlpActive: boolean;
  status: 'COMPLETED' | 'ONGOING' | 'DELAYED';
  source: string;
  sourceUrl: string;
  fetchedAt: string;
}

export async function fetchPmgsyPackagesForPin(_pinCode: string): Promise<PmgsyPackagePayload[]> {
  return [];
}
