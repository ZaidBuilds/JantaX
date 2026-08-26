import type { ContractorProfile } from '../types/contractorIntelligence';
import { MOCK_CONTRACTORS } from '../data/mockContractors';

const STORAGE_KEY = 'jantax_contractor_profiles_v1';

export function getStoredContractors(): ContractorProfile[] {
  if (typeof window === 'undefined') return MOCK_CONTRACTORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CONTRACTORS));
      return MOCK_CONTRACTORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CONTRACTORS));
    return MOCK_CONTRACTORS;
  } catch (e) {
    console.error("Failed to read contractor profiles", e);
    return MOCK_CONTRACTORS;
  }
}

export function getContractorById(id: string): ContractorProfile | undefined {
  const list = getStoredContractors();
  return list.find((c) => c.id === id);
}

export interface ContractorFilterParams {
  query?: string;
  category?: string;
  minScore?: number;
  hasPenalties?: boolean;
  hasDebarments?: boolean;
  sortBy?: 'score_desc' | 'value_desc' | 'contracts_desc' | 'completion_desc';
}

export function searchContractors(params: ContractorFilterParams): ContractorProfile[] {
  let list = getStoredContractors();

  if (params.category && params.category.trim() && params.category !== 'All') {
    const cat = params.category.toLowerCase();
    list = list.filter((c) => c.category.toLowerCase().includes(cat));
  }

  if (params.minScore !== undefined && params.minScore > 0) {
    list = list.filter((c) => c.performanceIndicators.overallScore >= (params.minScore || 0));
  }

  if (params.hasPenalties) {
    list = list.filter((c) => c.penalties.length > 0);
  }

  if (params.hasDebarments) {
    list = list.filter((c) => c.debarmentRecords.some((d) => d.status === 'Active Debarment'));
  }

  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.registrationNumber.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q) ||
        c.directors.some((d) => d.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (params.sortBy) {
    list = [...list].sort((a, b) => {
      switch (params.sortBy) {
        case 'value_desc':
          return b.performanceIndicators.totalAwardedValueCr - a.performanceIndicators.totalAwardedValueCr;
        case 'contracts_desc':
          return b.performanceIndicators.totalContractsCount - a.performanceIndicators.totalContractsCount;
        case 'completion_desc':
          return b.performanceIndicators.completionRatePct - a.performanceIndicators.completionRatePct;
        case 'score_desc':
        default:
          return b.performanceIndicators.overallScore - a.performanceIndicators.overallScore;
      }
    });
  }

  return list;
}
