import type { ReraProject, BuilderProfile } from '../types/reraIntelligence';
import { MOCK_RERA_PROJECTS, MOCK_BUILDERS } from '../data/mockRera';

const PROJECTS_KEY = 'jantax_rera_projects_v1';
const BUILDERS_KEY = 'jantax_rera_builders_v1';

export function getStoredReraProjects(): ReraProject[] {
  if (typeof window === 'undefined') return MOCK_RERA_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(MOCK_RERA_PROJECTS));
      return MOCK_RERA_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(MOCK_RERA_PROJECTS));
    return MOCK_RERA_PROJECTS;
  } catch (e) {
    console.error("Failed to read RERA projects", e);
    return MOCK_RERA_PROJECTS;
  }
}

export function getStoredBuilders(): BuilderProfile[] {
  if (typeof window === 'undefined') return MOCK_BUILDERS;
  try {
    const raw = localStorage.getItem(BUILDERS_KEY);
    if (!raw) {
      localStorage.setItem(BUILDERS_KEY, JSON.stringify(MOCK_BUILDERS));
      return MOCK_BUILDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    localStorage.setItem(BUILDERS_KEY, JSON.stringify(MOCK_BUILDERS));
    return MOCK_BUILDERS;
  } catch (e) {
    console.error("Failed to read RERA builders", e);
    return MOCK_BUILDERS;
  }
}

export function getReraProjectById(id: string): ReraProject | undefined {
  const projects = getStoredReraProjects();
  return projects.find((p) => p.id === id);
}

export function getBuilderById(id: string): BuilderProfile | undefined {
  const builders = getStoredBuilders();
  return builders.find((b) => b.id === id);
}

export interface ReraSearchFilterParams {
  query?: string;
  statePortal?: string;
  status?: string;
  projectType?: string;
  sortBy?: 'delay_desc' | 'units_desc' | 'recent';
}

export function searchReraProjects(params: ReraSearchFilterParams): ReraProject[] {
  let list = getStoredReraProjects();

  if (params.statePortal && params.statePortal.trim() && params.statePortal !== 'All') {
    const sp = params.statePortal.toLowerCase();
    list = list.filter((p) => p.statePortal.toLowerCase().includes(sp));
  }

  if (params.status && params.status.trim() && params.status !== 'All') {
    const st = params.status.toLowerCase();
    list = list.filter((p) => p.status.toLowerCase() === st);
  }

  if (params.projectType && params.projectType.trim() && params.projectType !== 'All') {
    const pt = params.projectType.toLowerCase();
    list = list.filter((p) => p.projectType.toLowerCase().includes(pt));
  }

  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.projectName.toLowerCase().includes(q) ||
        p.reraRegistrationNumber.toLowerCase().includes(q) ||
        p.builderName.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q) ||
        p.pinCode.includes(q) ||
        p.district.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    list = [...list].sort((a, b) => {
      switch (params.sortBy) {
        case 'delay_desc':
          return b.documentedDelayMonths - a.documentedDelayMonths;
        case 'units_desc':
          return b.totalUnits - a.totalUnits;
        case 'recent':
        default:
          return new Date(b.promisedCompletionDate).getTime() - new Date(a.promisedCompletionDate).getTime();
      }
    });
  }

  return list;
}
