import {
  PublicRepresentative,
  SanctionedWork,
  LocalityGovernanceHierarchy,
} from '../types/representative';
import {
  SHOWCASE_REPRESENTATIVES,
  generateRepresentativesForPin,
  getGovernanceHierarchyForPin,
} from '../data/representativesData';

export const representativeService = {
  /**
   * Retrieves the full multi-tier governance hierarchy for a PIN code.
   */
  async getLocalityHierarchy(pincode: string): Promise<LocalityGovernanceHierarchy> {
    return getGovernanceHierarchyForPin(pincode);
  },

  /**
   * Retrieves all representatives serving this PIN code.
   */
  async getRepresentatives(pincode: string): Promise<PublicRepresentative[]> {
    return generateRepresentativesForPin(pincode);
  },

  /**
   * Retrieves a specific representative by ID.
   */
  async getRepresentativeById(repId: string): Promise<PublicRepresentative | undefined> {
    // Check in showcase first
    for (const pin in SHOWCASE_REPRESENTATIVES) {
      const match = SHOWCASE_REPRESENTATIVES[pin].find((r) => r.id === repId);
      if (match) return match;
    }
    // If repId has PIN embedded like "REP-GP-250001", extract PIN
    const parts = repId.split('-');
    const possiblePin = parts[parts.length - 1];
    if (possiblePin && /^\d{6}$/.test(possiblePin)) {
      const reps = generateRepresentativesForPin(possiblePin);
      return reps.find((r) => r.id === repId);
    }
    return undefined;
  },

  /**
   * Retrieves all sanctioned works across all representatives in this PIN code.
   */
  async getAllSanctionedWorks(pincode: string): Promise<SanctionedWork[]> {
    const reps = generateRepresentativesForPin(pincode);
    return reps.flatMap((r) => r.works);
  },

  /**
   * Finds all projects across all representatives awarded to a specific contractor.
   */
  async getWorksByContractor(contractorId: string): Promise<SanctionedWork[]> {
    const allWorks: SanctionedWork[] = [];
    for (const pin in SHOWCASE_REPRESENTATIVES) {
      for (const rep of SHOWCASE_REPRESENTATIVES[pin]) {
        for (const w of rep.works) {
          if (w.contractorId === contractorId || w.contractorName.toLowerCase().includes(contractorId.toLowerCase())) {
            allWorks.push(w);
          }
        }
      }
    }
    return allWorks;
  },
};

/**
 * Synchronous direct helper to get all sanctioned works for a PIN.
 */
export function getAllSanctionedWorks(pincode: string): SanctionedWork[] {
  const reps = generateRepresentativesForPin(pincode);
  return reps.flatMap((r) => r.works);
}
