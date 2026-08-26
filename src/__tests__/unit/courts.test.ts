import { describe, it, expect } from 'vitest';
import {
  getAllCourts,
  getCourtById,
  getCourtsByPin,
  getCourtSummaryForPin,
  compareCourts,
  getCnrSteps,
} from '../../modules/courts/services/courtsService';

describe('Courts / Judicial Delay Module — Unit & Integration Test Suite', () => {
  it('should retrieve all court complexes with valid NJDG pendency and judge vacancy metrics', () => {
    const courts = getAllCourts();
    expect(courts.length).toBeGreaterThan(0);

    courts.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.complexName).toBeTruthy();
      expect(c.pinCode).toHaveLength(6);
      expect(c.district).toBeTruthy();
      expect(c.state).toBeTruthy();
      expect(c.sanctionedJudges).toBe(c.workingJudges + c.vacantJudges);
      expect(c.civilPending + c.criminalPending).toBe(c.totalPendingCases);
      expect(c.pendingOver5Years).toBeLessThanOrEqual(c.totalPendingCases);
      expect(c.pendingOver10Years).toBeLessThanOrEqual(c.pendingOver5Years);
      expect(c.stageBreakdown.length).toBeGreaterThan(0);
      expect(c.dlsaContactPhone).toBeTruthy();
    });
  });

  it('should retrieve a court complex by unique ID', () => {
    const court = getCourtById('COURT-DL-PHC01');
    expect(court).toBeDefined();
    expect(court?.complexName).toContain('Patiala House');
    expect(court?.district).toBe('New Delhi');
    expect(court?.sanctionedJudges).toBe(38);

    const notFound = getCourtById('NONEXISTENT-COURT-999');
    expect(notFound).toBeUndefined();
  });

  it('should filter courts by high judge vacancy rate (>25%)', () => {
    const highVacancyCourts = getAllCourts({ minVacancyRate: 25 });
    expect(highVacancyCourts.length).toBeGreaterThan(0);
    highVacancyCourts.forEach((c) => {
      expect(c.vacancyPercentage).toBeGreaterThanOrEqual(25);
    });
  });

  it('should search courts by keyword, PIN, and state', () => {
    const patiala = getAllCourts({ query: 'Patiala' });
    expect(patiala.length).toBeGreaterThan(0);

    const pinCourts = getAllCourts({ pinCode: '110001' });
    expect(pinCourts.length).toBeGreaterThan(0);
    pinCourts.forEach((c) => expect(c.pinCode).toBe('110001'));
  });

  it('should sort courts by total pendency descending', () => {
    const sorted = getAllCourts({ sortBy: 'pendency_desc' });
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].totalPendingCases).toBeGreaterThanOrEqual(sorted[i + 1].totalPendingCases);
    }
  });

  it('should generate accurate PIN locality court summary', () => {
    const summary = getCourtSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.court).toBeDefined();
    expect(summary.totalPendingCases).toBeGreaterThan(0);
    expect(summary.judgeVacancyRate).toBeGreaterThanOrEqual(0);
    expect(summary.primaryStageBottleneck).toBeTruthy();
  });

  it('should support side-by-side court complex comparison', () => {
    const compared = compareCourts(['COURT-DL-PHC01', 'COURT-DL-THC02']);
    expect(compared.length).toBe(2);
    expect(compared[0].id).toBe('COURT-DL-PHC01');
    expect(compared[1].id).toBe('COURT-DL-THC02');
  });

  it('should provide complete 16-digit CNR search guide steps with eCourts URL', () => {
    const steps = getCnrSteps();
    expect(steps.length).toBe(3);
    expect(steps[0].title).toContain('CNR');
    expect(steps[0].example).toContain('DLHC01');
    expect(steps[1].example).toContain('services.ecourts.gov.in');
  });
});
