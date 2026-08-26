import type { CitizenReport, ReportCategory, ModerationState, EvidenceItem } from '../types/citizenReport';
import type { OfficialTrackingRecord, GrievanceDraft } from '../types/officialAction';
import { MOCK_CITIZEN_REPORTS, MOCK_OFFICIAL_TRACKING } from '../data/mockReports';

import { sanitizeReportForPublicView, sanitizeInput } from '../../security/services/securityService';
import { getCurrentUserRole } from '../../security/services/rbacService';

const REPORTS_KEY = 'jantax_citizen_reports_v1';
const TRACKING_KEY = 'jantax_official_tracking_v1';

export function getStoredReports(): CitizenReport[] {
  const role = getCurrentUserRole();
  let list = MOCK_CITIZEN_REPORTS;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(REPORTS_KEY);
      if (!raw) {
        localStorage.setItem(REPORTS_KEY, JSON.stringify(MOCK_CITIZEN_REPORTS));
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      }
    } catch (e) {
      console.error("Failed to load citizen reports", e);
    }
  }
  return list.map(r => sanitizeReportForPublicView(r, role));
}

export function saveStoredReports(reports: CitizenReport[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save citizen reports", e);
  }
}

export function getReportById(id: string): CitizenReport | undefined {
  const reports = getStoredReports();
  return reports.find((r) => r.id === id);
}

export function checkDuplicateReport(pinCode: string, category: ReportCategory, description: string): CitizenReport | undefined {
  const reports = getStoredReports();
  const descLower = description.toLowerCase().trim();
  return reports.find((r) => {
    if (r.location.pinCode === pinCode && r.category === category) {
      const existingDesc = r.description.toLowerCase();
      // Check word overlap
      const words = descLower.split(' ').filter(w => w.length > 3);
      const matches = words.filter(w => existingDesc.includes(w));
      if (words.length > 0 && (matches.length / words.length) > 0.5) {
        return true;
      }
    }
    return false;
  });
}

export function calculateSpamScore(title: string, description: string): number {
  let score = 0;
  const text = (title + ' ' + description).toLowerCase();

  // Spam signals
  if (text.length < 15) score += 40;
  if (/http|www|\.com|\.xyz/i.test(text)) score += 30;
  if (/(buy|cheap|discount|cash|loan|casino|crypto)/i.test(text)) score += 50;
  if (/(.)\1{4,}/.test(text)) score += 25; // Repeated characters like "aaaaa"

  return Math.min(100, score);
}

export function createCitizenReport(newReport: {
  title: string;
  category: ReportCategory;
  description: string;
  pinCode: string;
  landmark: string;
  district: string;
  state: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  evidenceFiles?: Array<{ url: string; fileName: string; fileSize: string; mediaType: 'image' | 'video' }>;
}): { report: CitizenReport; duplicate?: CitizenReport } {
  const reports = getStoredReports();
  const duplicate = checkDuplicateReport(newReport.pinCode, newReport.category, newReport.description);

  const spamScore = calculateSpamScore(newReport.title, newReport.description);
  const moderationState: ModerationState = spamScore > 40 ? 'Flagged for Review' : 'Pending Review';

  const evidenceItems: EvidenceItem[] = (newReport.evidenceFiles || []).map((file, idx) => ({
    id: `ev-${Date.now()}-${idx}`,
    mediaType: file.mediaType,
    url: file.url,
    fileName: file.fileName,
    fileSize: file.fileSize,
    uploadedAt: new Date().toISOString(),
    moderationStatus: 'Pending Moderation'
  }));

  const report: CitizenReport = {
    id: `rep-${Date.now()}`,
    title: newReport.title,
    category: newReport.category,
    description: newReport.description,
    location: {
      pinCode: newReport.pinCode,
      landmark: newReport.landmark,
      district: newReport.district,
      state: newReport.state
    },
    isAnonymous: newReport.isAnonymous,
    reporterName: newReport.isAnonymous ? undefined : newReport.reporterName,
    reporterContact: newReport.isAnonymous ? undefined : newReport.reporterContact,
    evidence: evidenceItems,
    moderationState,
    spamScore,
    duplicateRefId: duplicate ? duplicate.id : undefined,
    abuseCount: 0,
    createdAt: new Date().toISOString(),
    upvotes: 0
  };

  const updatedReports = [report, ...reports];
  saveStoredReports(updatedReports);

  return { report, duplicate };
}

export function reportAbuse(reportId: string, reason: string, details: string): CitizenReport | undefined {
  const reports = getStoredReports();
  let updatedReport: CitizenReport | undefined;

  const updated = reports.map((r) => {
    if (r.id === reportId) {
      const newAbuseCount = r.abuseCount + 1;
      const newModerationState = newAbuseCount >= 3 ? ('Flagged for Review' as ModerationState) : r.moderationState;
      updatedReport = {
        ...r,
        abuseCount: newAbuseCount,
        moderationState: newModerationState
      };
      return updatedReport;
    }
    return r;
  });

  saveStoredReports(updated);
  return updatedReport;
}

// --- PHASE 24: OFFICIAL ACTION HELPERS ---

export function getOfficialTracking(reportId: string): OfficialTrackingRecord | undefined {
  if (typeof window === 'undefined') return MOCK_OFFICIAL_TRACKING[reportId];
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    const store = raw ? JSON.parse(raw) : MOCK_OFFICIAL_TRACKING;
    return store[reportId] || MOCK_OFFICIAL_TRACKING[reportId];
  } catch {
    return MOCK_OFFICIAL_TRACKING[reportId];
  }
}

export function generateGrievanceDraft(report: CitizenReport): GrievanceDraft {
  let relevantAuthorityName = 'Public Works Department / Municipal Corporation';
  let department = 'Infrastructure & Civic Maintenance';
  let nodalOfficerDesignation = 'Executive Engineer / Nodal Officer';
  let referenceSpecsRule = 'IRC:SP:84-2019 Highway Maintenance Norms';
  let officialPortalUrl = 'https://pgportal.gov.in';

  switch (report.category) {
    case 'Road':
    case 'Public works':
      relevantAuthorityName = 'Public Works Department (PWD) / NHAI';
      department = 'Road Maintenance & Highway Operations';
      nodalOfficerDesignation = 'Executive Engineer (B&R), PWD';
      referenceSpecsRule = 'IRC:SP:84-2019 Pavement Safety Standards';
      officialPortalUrl = 'https://pgportal.gov.in';
      break;
    case 'School':
      relevantAuthorityName = 'Department of School Education & Literacy';
      department = 'UDISE+ School Infrastructure Division';
      nodalOfficerDesignation = 'District Basic Education Officer (BSA)';
      referenceSpecsRule = 'Right to Education (RTE) Act 2009 Section 19';
      officialPortalUrl = 'https://pgportal.gov.in';
      break;
    case 'Healthcare':
      relevantAuthorityName = 'Department of Health & Family Welfare';
      department = 'National Health Mission (NHM) Facility Wing';
      nodalOfficerDesignation = 'Chief Medical Officer (CMO)';
      referenceSpecsRule = 'Indian Public Health Standards (IPHS) 2022 Guidelines';
      officialPortalUrl = 'https://jansunwai.up.nic.in';
      break;
    case 'Water':
    case 'Sanitation':
      relevantAuthorityName = 'Jal Board / Municipal Water Supply Undertaking';
      department = 'Jal Jeevan Mission & Drainage Infrastructure';
      nodalOfficerDesignation = 'Superintending Engineer (SE), Jal Board';
      referenceSpecsRule = 'CPHEEO Manual on Water Supply and Treatment';
      officialPortalUrl = 'https://pgportal.gov.in';
      break;
    case 'Electricity':
      relevantAuthorityName = 'State Electricity Distribution Company (DISCOM)';
      department = 'Power Distribution Operations';
      nodalOfficerDesignation = 'Superintending Engineer (Discom)';
      referenceSpecsRule = 'Electricity Act 2003 Consumer Service Standards';
      officialPortalUrl = 'https://pgportal.gov.in';
      break;
    default:
      relevantAuthorityName = 'District Magistrate / Nodal Grievance Cell';
      department = 'General Public Grievances';
      nodalOfficerDesignation = 'Additional District Magistrate (ADM Complaints)';
      officialPortalUrl = 'https://pgportal.gov.in';
  }

  const subjectLine = `FORMAL GRIEVANCE: Substandard Infrastructure Defect in ${report.category} Category at PIN ${report.location.pinCode}`;

  const structuredBodyText = 
`To,
The Nodal Officer / ${nodalOfficerDesignation},
${relevantAuthorityName}, ${report.location.district}, ${report.location.state}.

SUBJECT: ${subjectLine}

Sir/Madam,

I am bringing to your urgent attention a verified civic defect in the ${report.category} infrastructure located at:
- Landmark: ${report.location.landmark}
- PIN Code: ${report.location.pinCode}
- District / State: ${report.location.district}, ${report.location.state}

ISSUE DESCRIPTION & GROUND OBSERVATION:
${report.description}

STATUTORY & STANDARD GOVERNING NORM:
This defect breaches standard operational guidelines defined under ${referenceSpecsRule}.

ATTACHED EVIDENCE PACK:
${report.evidence.map((ev, i) => `${i + 1}. Media Evidence URL: ${ev.url} (${ev.fileName})`).join('\n')}

REQUESTED OFFICIAL ACTION:
1. Immediate site inspection by the designated Assistant Engineer / Junior Engineer.
2. Formal issue of rectification work order within 7 working days.
3. Update of status on CPGRAMS / State Public Grievance Portal.

Thank you.

Dated: ${new Date(report.createdAt).toLocaleDateString()}
Report Generated via JantaX Public Data Transparency Portal (ID: ${report.id})`;

  return {
    relevantAuthorityName,
    department,
    nodalOfficerDesignation,
    subjectLine,
    structuredBodyText,
    packagedEvidenceUrls: report.evidence.map(e => e.url),
    referenceSpecsRule,
    officialPortalUrl
  };
}

export function verifyResolution(reportId: string, isResolved: boolean, feedbackNote: string): OfficialTrackingRecord | undefined {
  const currentTracking = getOfficialTracking(reportId);
  if (!currentTracking) return undefined;

  const updatedTracking: OfficialTrackingRecord = {
    ...currentTracking,
    resolutionVerification: {
      verificationStatus: isResolved ? 'True Resolution Verified' : 'Paper Closure Flagged',
      groundCheckScore: isResolved ? 95 : 20,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      citizenFeedbackNote: feedbackNote
    }
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(TRACKING_KEY);
      const store = raw ? JSON.parse(raw) : MOCK_OFFICIAL_TRACKING;
      store[reportId] = updatedTracking;
      localStorage.setItem(TRACKING_KEY, JSON.stringify(store));
    } catch {}
  }

  return updatedTracking;
}
