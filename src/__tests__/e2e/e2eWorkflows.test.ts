import { describe, it, expect } from 'vitest';
import { createCitizenReport, getReportById, reportAbuse, generateGrievanceDraft, verifyResolution } from '../../modules/reporting/services/reportingService';
import { MOCK_CITIZEN_REPORTS } from '../../modules/reporting/data/mockReports';

describe('E2E Workflow Verification Tests across Critical User Journeys', () => {
  let createdReportId: string = '';

  it('E2E Workflow 1: Evidence Submission & Multi-Step Report Filing Flow', () => {
    const { report, duplicate } = createCitizenReport({
      title: 'E2E Test Pothole Hazard',
      category: 'Road',
      description: 'Deep road cavity observed during E2E verification test',
      pinCode: '110001',
      landmark: 'Mayur Vihar Ramp Junction',
      district: 'New Delhi',
      state: 'Delhi',
      isAnonymous: true,
      evidenceFiles: [
        { url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7', fileName: 'e2e_pothole.jpg', fileSize: '2.1 MB', mediaType: 'image' }
      ]
    });

    expect(report.id).toBeDefined();
    expect(report.category).toBe('Road');
    expect(report.evidence).toHaveLength(1);
    expect(report.moderationState).toBe('Pending Review');
    createdReportId = report.id;
  });

  it('E2E Workflow 2: Report Retrieval, Moderation & Abuse Reporting Flow', () => {
    const report = getReportById(createdReportId || 'rep-001');
    expect(report).toBeDefined();

    // Trigger Abuse Reporting
    const updated = reportAbuse(report!.id, 'Inaccurate Location', 'E2E test location verification');
    expect(updated?.abuseCount).toBeGreaterThan(0);
  });

  it('E2E Workflow 3: Official Grievance Action Layer & Draft Generation Flow', () => {
    const report = MOCK_CITIZEN_REPORTS[0];
    const draft = generateGrievanceDraft(report);

    expect(draft.relevantAuthorityName).toContain('Public Works Department');
    expect(draft.subjectLine).toContain('FORMAL GRIEVANCE');
    expect(draft.structuredBodyText).toContain('Mayur Vihar');
    expect(draft.officialPortalUrl).toBe('https://pgportal.gov.in');
  });

  it('E2E Workflow 4: Citizen Ground Resolution Verification Flow', () => {
    const reportId = 'rep-002';
    const updatedTracking = verifyResolution(reportId, true, 'E2E physical ground check verified Doctor present on time.');

    expect(updatedTracking).toBeDefined();
    expect(updatedTracking?.resolutionVerification.verificationStatus).toBe('True Resolution Verified');
    expect(updatedTracking?.resolutionVerification.groundCheckScore).toBe(95);
  });
});
