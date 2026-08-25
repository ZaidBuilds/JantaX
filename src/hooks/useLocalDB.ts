import { useState, useEffect } from 'react';
import type { Project, CitizenReport } from '../core/types/Project';

const STORAGE_KEY = 'bharat_vikas_projects';

export const useLocalDB = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount, or fallback to mock data
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setProjects(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse stored projects, resetting to mock data.", e);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([] as any[]));
        setProjects([] as any[]);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([] as any[]));
      setProjects([] as any[]);
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
