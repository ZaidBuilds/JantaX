import type { ContractorProfile } from '../types/contractorIntelligence';
import { MOCK_CONTRACTORS } from '../data/mockContractors';
import { SHOWCASE_CONTRACTORS, synthesizeContractorProfile } from '../data/showcaseContractors';

const STORAGE_KEY = 'jantax_contractor_profiles_v1';

export function getStoredContractors(): ContractorProfile[] {
  const combinedMock = [...MOCK_CONTRACTORS, ...SHOWCASE_CONTRACTORS];
  if (typeof window === 'undefined') return combinedMock;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedMock));
      return combinedMock;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge showcase contractors if not present in existing localStorage
      const existingIds = new Set(parsed.map((c: ContractorProfile) => c.id));
      let updated = false;
      SHOWCASE_CONTRACTORS.forEach((sc) => {
        if (!existingIds.has(sc.id)) {
          parsed.push(sc);
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedMock));
    return combinedMock;
  } catch (e) {
    console.error("Failed to read contractor profiles", e);
    return combinedMock;
  }
}

export function getContractorById(id: string): ContractorProfile | undefined {
  if (!id) return undefined;
  const list = getStoredContractors();
  const found = list.find((c) => c.id === id);
  if (found) return found;

  const inShowcase = SHOWCASE_CONTRACTORS.find((c) => c.id === id);
  if (inShowcase) return inShowcase;

  // Synthesize deterministic profile for arbitrary contractor IDs
  return synthesizeContractorProfile(id);
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
