import { useState, useEffect } from 'react';
import type { Project, CitizenReport } from '../../core/types/Project';

const STORAGE_KEY = 'bharat_vikas_projects';

export const useLocalDB = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Default mock infra projects for first load (when storage empty)
  const getDefaultProjects = (): Project[] => [
    {
      id: 'infra-mock-1', pinCode: '110001', nameEnglish: 'Construction of Elevated Corridor - Phase 2', nameHindi: 'एलिवेटेड कॉरिडोर निर्माण - चरण 2', nameRegional: 'Elevated Corridor', sector: 'Roads', state: 'Delhi', district: 'New Delhi', status: 'Construction', statusHindi: 'निर्माणाधीन', statusRegional: 'Construction', budgetOriginal: 245, budgetAnticipated: 298, expenditureToDate: 180, startDate: '2022-03-15', originalCompletionDate: '2024-06-30', anticipatedCompletionDate: '2025-03-31', progressPhysical: 62, progressFinancial: 60, clearances: { landAcquisition: 90, forestClearance: 'Approved', environmentalClearance: 'Approved', utilityShifting: 'In Progress' }, delayReasons: ['Land acquisition delay', 'Monsoon disruption'], delaySummary: 'Delayed due to land & monsoon', delaySummaryHindi: 'भूमि और मानसून से विलंब', citizenReports: [{ id: 'rep-1', timestamp: new Date().toISOString(), userName: 'Rohit', ratingValue: 2, comment: 'Dust and traffic jam due to construction', upvotes: 4 }], leadContractor: 'M/s Sample Contractor A', responsibleOfficer: 'EE, PWD Delhi', responsibleOfficerDesignation: 'Executive Engineer', ministry: 'Ministry of Road Transport', implementingAgency: 'NHAI'
    },
    {
      id: 'infra-mock-2', pinCode: '110001', nameEnglish: 'Upgradation of District Water Supply Scheme', nameHindi: 'जिला जल आपूर्ति योजना उन्नयन', nameRegional: 'Water Supply', sector: 'Water', state: 'Delhi', district: 'New Delhi', status: 'Delayed', statusHindi: 'विलंबित', statusRegional: 'Delayed', budgetOriginal: 85, budgetAnticipated: 112, expenditureToDate: 45, startDate: '2021-11-01', originalCompletionDate: '2023-08-15', anticipatedCompletionDate: '2024-12-31', progressPhysical: 38, progressFinancial: 40, clearances: { landAcquisition: 100, forestClearance: 'N/A', environmentalClearance: 'Approved', utilityShifting: 'Pending' }, delayReasons: ['Contractor dispute', 'Funds reallocation'], delaySummary: 'Funds and contractor issues', delaySummaryHindi: 'फंड और ठेकेदार समस्या', citizenReports: [], leadContractor: 'Delhi Jal Board Contractor', responsibleOfficer: 'SE, DJB', responsibleOfficerDesignation: 'Superintendent Engineer', ministry: 'Ministry of Jal Shakti', implementingAgency: 'Delhi Jal Board'
    },
    {
      id: 'infra-mock-3', pinCode: '250001', nameEnglish: 'PMGSY Rural Road - Niloha to Khaspur', nameHindi: 'पीएमजीएसवाई ग्रामीण सड़क', nameRegional: 'Rural Road', sector: 'Roads', state: 'Uttar Pradesh', district: 'Meerut', status: 'Completed', statusHindi: 'पूर्ण', statusRegional: 'Completed', budgetOriginal: 12, budgetAnticipated: 13, expenditureToDate: 13, startDate: '2023-01-10', originalCompletionDate: '2023-09-30', anticipatedCompletionDate: '2023-09-30', progressPhysical: 100, progressFinancial: 100, clearances: { landAcquisition: 100, forestClearance: 'Completed', environmentalClearance: 'Approved', utilityShifting: 'Completed' }, delayReasons: [], delaySummary: 'On time completion', delaySummaryHindi: 'समय पर पूर्ण', citizenReports: [], leadContractor: 'Chaudhary Road Builders', responsibleOfficer: 'EE, PWD Meerut', responsibleOfficerDesignation: 'Executive Engineer', ministry: 'Ministry of Rural Development', implementingAgency: 'UPPWD'
    },
    {
      id: 'infra-mock-4', pinCode: '560001', nameEnglish: 'Bengaluru Metro Phase 2 - KR Puram Extension', nameHindi: 'बेंगलुरु मेट्रो चरण 2', nameRegional: 'Metro', sector: 'Urban', state: 'Karnataka', district: 'Bengaluru', status: 'Construction', statusHindi: 'निर्माणाधीन', statusRegional: 'Construction', budgetOriginal: 1250, budgetAnticipated: 1480, expenditureToDate: 890, startDate: '2020-06-01', originalCompletionDate: '2024-12-31', anticipatedCompletionDate: '2026-06-30', progressPhysical: 58, progressFinancial: 60, clearances: { landAcquisition: 82, forestClearance: 'In Progress', environmentalClearance: 'Approved', utilityShifting: 'In Progress' }, delayReasons: ['Utility shifting', 'Land'], delaySummary: 'Utility & land delays', delaySummaryHindi: 'यूटिलिटी और भूमि विलंब', citizenReports: [], leadContractor: 'BEML & Sample Contractor E JV', responsibleOfficer: 'Director, BMRCL', responsibleOfficerDesignation: 'Director Projects', ministry: 'Ministry of Housing', implementingAgency: 'BMRCL'
    },
    {
      id: 'infra-mock-5', pinCode: '400001', nameEnglish: 'Mumbai Coastal Road - Package 3', nameHindi: 'मुंबई कोस्टल रोड', nameRegional: 'Coastal Road', sector: 'Roads', state: 'Maharashtra', district: 'Mumbai', status: 'Construction', statusHindi: 'निर्माणाधीन', statusRegional: 'Construction', budgetOriginal: 800, budgetAnticipated: 920, expenditureToDate: 540, startDate: '2021-10-12', originalCompletionDate: '2024-03-31', anticipatedCompletionDate: '2025-08-31', progressPhysical: 64, progressFinancial: 58, clearances: { landAcquisition: 75, forestClearance: 'Approved', environmentalClearance: 'Approved', utilityShifting: 'Pending' }, delayReasons: ['Environmental clearance litig'], delaySummary: 'Clearance litigation', delaySummaryHindi: 'मंजूरी मुकदमा', citizenReports: [], leadContractor: 'Sample Contractor A Construction', responsibleOfficer: 'MC, BMC', responsibleOfficerDesignation: 'Municipal Commissioner', ministry: 'Ministry of Urban Affairs', implementingAgency: 'BMC'
    }
  ];

  // Load projects from localStorage on mount, or fallback to mock data
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        } else {
          const mocks = getDefaultProjects();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mocks));
          setProjects(mocks);
        }
      } catch (e) {
        console.error("Failed to parse stored projects, resetting to mock data.", e);
        const mocks = getDefaultProjects();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mocks));
        setProjects(mocks);
      }
    } else {
      const mocks = getDefaultProjects();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mocks));
      setProjects(mocks);
    }
  }, []);

  // Save projects to localStorage whenever the state changes
  const saveToStorage = (updatedProjects: Project[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // Add a crowdsourced report
  const addCitizenReport = (
    projectId: string,
    newReportData: { userName: string; ratingValue: number; comment: string; imageUrl?: string }
  ) => {
    const report: CitizenReport = {
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: newReportData.userName.trim() || "Anonymous Citizen",
      ratingValue: newReportData.ratingValue,
      comment: newReportData.comment,
      imageUrl: newReportData.imageUrl,
      upvotes: 0
    };

    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          citizenReports: [report, ...p.citizenReports]
        };
      }
      return p;
    });

    saveToStorage(updatedProjects);
  };

  // Upvote a citizen report
  const upvoteReport = (projectId: string, reportId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          citizenReports: p.citizenReports.map((r) => {
            if (r.id === reportId) {
              return { ...r, upvotes: r.upvotes + 1 };
            }
            return r;
          })
        };
      }
      return p;
    });

    saveToStorage(updatedProjects);
  };

  // Helper: Reset database to mock data
  const resetDB = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([] as any[]));
    setProjects([] as any[]);
  };
  
  // Helper: Overwrite database with custom projects
  const importProjects = (imported: Project[]) => {
    saveToStorage(imported);
  };

  return {
    projects,
    addCitizenReport,
    upvoteReport,
    resetDB,
    importProjects
  };
};
