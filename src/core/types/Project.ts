export interface CitizenReport {
  id: string;
  userName: string;
  ratingValue: number;
  comment: string;
  imageUrl?: string;
  upvotes: number;
  timestamp: string;
}

export interface Clearances {
  landAcquisition: number;
  forestClearance: "Pending" | "Approved" | "In Progress" | "Completed" | "N/A";
  environmentalClearance: "Pending" | "Approved" | "In Progress" | "Completed" | "N/A";
  utilityShifting: "Pending" | "Approved" | "In Progress" | "Completed" | "N/A";
}

export interface Project {
  id: string;
  pinCode: string;
  nameEnglish: string;
  nameHindi: string;
  nameRegional: string;
  sector: string;
  state: string;
  district: string;
  status: string;
  statusHindi: string;
  statusRegional: string;
  budgetOriginal: number;
  budgetAnticipated: number;
  expenditureToDate: number;
  startDate: string;
  originalCompletionDate: string;
  anticipatedCompletionDate: string;
  progressPhysical: number;
  progressFinancial: number;
  clearances: Clearances;
  delayReasons: string[];
  delaySummary: string;
  delaySummaryHindi: string;
  citizenReports: CitizenReport[];
  leadContractor: string;
  responsibleOfficer: string;
  responsibleOfficerDesignation: string;
  ministry: string;
  implementingAgency: string;
}
