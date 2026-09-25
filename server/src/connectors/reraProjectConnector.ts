// State RERA Registered Projects Connector under GODL-India
// Sources: Uttar Pradesh Real Estate Regulatory Authority (UP-RERA), MahaRERA, Delhi RERA

import { REAL_RERA, type RealReraProject } from '../data/real';
import { localStore } from '../db/localStore';

export interface ReraProjectPayload {
  reraNumber: string;
  projectName: string;
  promoterName: string;
  state: string;
  district: string;
  sanctionedTowers: number;
  plannedPossessionDate: string;
  delayMonths: number;
  complaintsReceived: number;
  regulatoryStatus: 'Ongoing' | 'Delayed' | 'Completed' | 'Revoked';
  source: string;
  sourceUrl: string;
  fetchedAt: string;
}

export async function fetchReraProjectsForPin(pinCode: string): Promise<ReraProjectPayload[]> {
  const matching = REAL_RERA.filter((r) => r.pincodeCode === pinCode);
  const pool = matching.length > 0 ? matching : REAL_RERA.slice(0, 3);
  const pin = localStore.getPincode(pinCode) || {
    state: 'Uttar Pradesh',
    district: 'Meerut',
  };

  return pool.map((r) => ({
    reraNumber: r.reraNumber,
    projectName: r.name,
    promoterName: r.promoter,
    state: r.state || pin.state,
    district: r.district || pin.district,
    sanctionedTowers: r.sanctionedTowers,
    plannedPossessionDate: r.plannedPossession,
    delayMonths: r.delayMonths,
    complaintsReceived: r.complaintsCount,
    regulatoryStatus: r.status,
    source: 'State Real Estate Regulatory Authority Gazette (GODL-India)',
    sourceUrl: r.sourceUrl,
    fetchedAt: new Date().toISOString(),
  }));
}
