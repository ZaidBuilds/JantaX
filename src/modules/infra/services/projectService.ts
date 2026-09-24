import type { InfraProject, CitizenReport, NeutralStatus } from '../types/projectInfra';
import { MOCK_INFRA_PROJECTS } from '../data/mockProjects';
import { api } from '../../../core/services/api';

const STORAGE_KEY = 'jantax_infra_projects_v2';

/**
 * Maps the database ProjectStatus enum onto the UI's neutral status vocabulary.
 * The wording stays deliberately non-accusatory (Rule 22): a project is
 * "Delayed" or "Under Review", never "failed" or "corrupt".
 */
function toNeutralStatus(status: string): NeutralStatus {
  switch ((status || '').toUpperCase()) {
    case 'COMPLETED':
      return 'Completed';
    case 'DELAYED':
      return 'Delayed';
    case 'STALLED':
    case 'ONGOING':
    default:
      return 'Under Review';
  }
}

/**
 * Fetches real InfraProject records for a PIN from the API.
 *
 * The database model (prisma `InfraProject`) holds 15 fields. The UI type is
 * much richer — tenders, work orders, extensions, payments, clearances. That
 * detail is NOT stored anywhere, so those collections are returned EMPTY and
 * the UI must render "not published" for them. Do not synthesise them: an
 * invented tender or payment row against a real public project is fabricated
 * procurement data (Rule 40).
 *
 * Returns null when the API is unreachable, so callers can decide whether to
 * fall back to clearly-labelled demonstration fixtures.
 */
export async function fetchProjectsForPin(pinCode: string): Promise<InfraProject[] | null> {
  try {
    const res: any = await api.getRecords(pinCode, 'infra');
    const rows: any[] = res?.records?.infra ?? [];

    return rows.map((r): InfraProject => {
      const budgetLakhs = Number(r.budget) || 0;
      const physical = typeof r.groundTruthScore === 'number' ? r.groundTruthScore : 0;
      const claimed = typeof r.claimCompletionPct === 'number' ? r.claimCompletionPct : 0;

      return {
        id: r.id,
        pinCode: r.pincodeCode || pinCode,
        nameEnglish: r.titleEnglish || '',
        nameHindi: r.titleHindi || '',
        sector: 'Roads & Highways',
        state: r.location?.state || '',
        district: r.location?.district || '',
        locationName: r.location?.district || '',
        coordinates: { lat: 0, lng: 0 },
        status: toNeutralStatus(r.status),
        statusHindi: '',
        ministry: r.ministry || r.department || '',
        implementingAgency: r.implementingAgency || r.department || '',
        sanctioningBody: r.department || '',
        responsibleOfficer: r.responsibleOfficer || '',
        responsibleOfficerDesignation: '',
        leadContractor: '',
        contractorDetails: {} as InfraProject['contractorDetails'],
        budgetOriginalLakhs: budgetLakhs,
        budgetAnticipatedLakhs: budgetLakhs,
        contractValueOriginalLakhs: budgetLakhs,
        contractValueRevisedLakhs: budgetLakhs,
        expenditureToDateLakhs: 0,
        progressPhysical: physical,
        progressFinancial: claimed,
        startDate: r.startDate || '',
        originalCompletionDate: r.expectedCompletion || '',
        anticipatedCompletionDate: r.expectedCompletion || '',
        clearances: {
          landAcquisition: 0,
          forestClearance: 'N/A',
          environmentalClearance: 'N/A',
          utilityShifting: 'N/A',
        },
        neutralDelaySummary: '',
        neutralDelaySummaryHindi: '',
        // Not stored in the database — must render as "not published".
        tenders: [],
        workOrders: [],
        extensions: [],
        payments: [],
        evidenceDocuments: [],
        history: [],
        groundTruth: {} as InfraProject['groundTruth'],
        originalSource: {
          name: r.department || 'Public Works Department',
          url: r.sourceUrl || '',
          lastUpdated: r.updatedAt || '',
        },
      };
    });
  } catch {
    return null;
  }
}

export function getStoredProjects(): InfraProject[] {
  if (typeof window === 'undefined') return MOCK_INFRA_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INFRA_PROJECTS));
      return MOCK_INFRA_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INFRA_PROJECTS));
    return MOCK_INFRA_PROJECTS;
  } catch (e) {
    console.error("Failed to load projects from storage", e);
    return MOCK_INFRA_PROJECTS;
  }
}

export function saveStoredProjects(projects: InfraProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to save projects to storage", e);
  }
}

export function getProjectById(id: string): InfraProject | undefined {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id);
}

export interface ProjectFilterParams {
  query?: string;
  state?: string;
  sector?: string;
  status?: NeutralStatus | string;
  contractor?: string;
  authority?: string;
  pinCode?: string;
  sortBy?: 'budget_desc' | 'budget_asc' | 'progress_desc' | 'progress_asc' | 'recent';
}

export function searchProjects(params: ProjectFilterParams): InfraProject[] {
  let list = getStoredProjects();

  if (params.pinCode && params.pinCode.trim()) {
    const p = params.pinCode.trim();
    list = list.filter((item) => item.pinCode.includes(p));
  }

  if (params.state && params.state.trim() && params.state !== 'All') {
    const s = params.state.trim().toLowerCase();
    list = list.filter((item) => item.state.toLowerCase() === s);
  }

  if (params.sector && params.sector.trim() && params.sector !== 'All') {
    const sec = params.sector.trim().toLowerCase();
    list = list.filter((item) => item.sector.toLowerCase().includes(sec));
  }

  if (params.status && params.status.trim() && params.status !== 'All') {
    const stat = params.status.trim().toLowerCase();
    list = list.filter((item) => item.status.toLowerCase() === stat);
  }

  if (params.contractor && params.contractor.trim() && params.contractor !== 'All') {
    const c = params.contractor.trim().toLowerCase();
    list = list.filter((item) => item.leadContractor.toLowerCase().includes(c));
  }

  if (params.authority && params.authority.trim() && params.authority !== 'All') {
    const a = params.authority.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.ministry.toLowerCase().includes(a) ||
        item.implementingAgency.toLowerCase().includes(a)
    );
  }

  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.nameEnglish.toLowerCase().includes(q) ||
        item.nameHindi.includes(q) ||
        item.pinCode.includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.leadContractor.toLowerCase().includes(q) ||
        item.implementingAgency.toLowerCase().includes(q) ||
        item.tenders.some((t) => t.tenderNumber.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)) ||
        item.workOrders.some((w) => w.workOrderNumber.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (params.sortBy) {
    list = [...list].sort((a, b) => {
      switch (params.sortBy) {
        case 'budget_desc':
          return b.budgetAnticipatedLakhs - a.budgetAnticipatedLakhs;
        case 'budget_asc':
          return a.budgetAnticipatedLakhs - b.budgetAnticipatedLakhs;
        case 'progress_desc':
          return b.progressPhysical - a.progressPhysical;
        case 'progress_asc':
          return a.progressPhysical - b.progressPhysical;
        case 'recent':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });
  }

  return list;
}

export function addCitizenReportToProject(
  projectId: string,
  reportData: { userName: string; ratingValue: number; comment: string; imageUrl?: string }
): InfraProject | undefined {
  const projects = getStoredProjects();
  let updatedProject: InfraProject | undefined;

  const updatedProjects = projects.map((p) => {
    if (p.id === projectId) {
      const newReport: CitizenReport = {
        id: `cr-${Date.now()}`,
        userName: reportData.userName.trim() || 'Anonymous Citizen Audit',
        ratingValue: reportData.ratingValue,
        comment: reportData.comment,
        imageUrl: reportData.imageUrl,
        upvotes: 0,
        timestamp: new Date().toISOString()
      };
      const updatedReports = [newReport, ...p.groundTruth.citizenReports];
      // Recalculate average physical score based on reports
      const avgScore = Math.round(
        updatedReports.reduce((acc, curr) => acc + curr.ratingValue, 0) / updatedReports.length
      );

      updatedProject = {
        ...p,
        groundTruth: {
          ...p.groundTruth,
          physicalScore: avgScore,
          citizenReports: updatedReports
        }
      };
      return updatedProject;
    }
    return p;
  });

  saveStoredProjects(updatedProjects);
  return updatedProject;
}

export function upvoteCitizenReport(projectId: string, reportId: string): InfraProject | undefined {
  const projects = getStoredProjects();
  let updatedProject: InfraProject | undefined;

  const updatedProjects = projects.map((p) => {
    if (p.id === projectId) {
      const updatedReports = p.groundTruth.citizenReports.map((r) => {
        if (r.id === reportId) {
          return { ...r, upvotes: r.upvotes + 1 };
        }
        return r;
      });

      updatedProject = {
        ...p,
        groundTruth: {
          ...p.groundTruth,
          citizenReports: updatedReports
        }
      };
      return updatedProject;
    }
    return p;
  });

  saveStoredProjects(updatedProjects);
  return updatedProject;
}
