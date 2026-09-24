import { SchemeProject, LocalitySchemesSummary, SchemeCategory } from '../types/scheme';
import { SHOWCASE_SCHEMES, generateSchemesForPin, getSchemesSummaryForPin } from '../data/schemesData';

export const schemeService = {
  /**
   * Retrieves summary of all Central and State schemes active in a PIN code.
   */
  async getLocalitySchemesSummary(pincode: string): Promise<LocalitySchemesSummary> {
    return getSchemesSummaryForPin(pincode);
  },

  /**
   * Retrieves all scheme projects in a PIN code.
   */
  async getSchemeProjects(pincode: string): Promise<SchemeProject[]> {
    return generateSchemesForPin(pincode);
  },

  /**
   * Retrieves a specific scheme project by ID.
   */
  async getProjectById(projectId: string): Promise<SchemeProject | undefined> {
    for (const pin in SHOWCASE_SCHEMES) {
      const match = SHOWCASE_SCHEMES[pin].find((p) => p.id === projectId);
      if (match) return match;
    }
    const parts = projectId.split('-');
    const possiblePin = parts[2];
    if (possiblePin && /^\d{6}$/.test(possiblePin)) {
      const projects = generateSchemesForPin(possiblePin);
      return projects.find((p) => p.id === projectId);
    }
    return undefined;
  },

  /**
   * Filter scheme projects by category.
   */
  async getProjectsByCategory(pincode: string, category: SchemeCategory): Promise<SchemeProject[]> {
    const all = generateSchemesForPin(pincode);
    return all.filter((p) => p.category === category);
  },
};

/**
 * Synchronous direct helper to get all scheme projects for a PIN.
 */
export function getAllSchemeProjects(pincode: string): SchemeProject[] {
  return generateSchemesForPin(pincode);
}
