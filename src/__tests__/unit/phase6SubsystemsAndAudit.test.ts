import { describe, it, expect } from 'vitest';
import {
  calculateFundUtilization,
  computeUtilizationSummary,
  getFundUtilizationForPin,
} from '../../modules/budget/services/fundUtilizationService';
import {
  calculateShadowRatio,
  getCandidateExpendituresForPin,
  ECI_CEILING_LS_LAKHS,
  ECI_CEILING_VS_LAKHS,
} from '../../modules/election/services/shadowExpenditureService';
import {
  calculateQuotaFulfillment,
  detectGhostCards,
  generateDgroPetition,
  getPdsAuditForPin,
} from '../../modules/ration/services/pdsAuditService';
import { computeWeightedScore } from '../../pages/components/DualPinBenchmark';

describe('Phase 6: Deep Civic Subsystem Intelligence — Fund Utilization, Shadow Expenditure, PDS Audit & Locality Benchmarking', () => {

  // ═══════════════════════════════════════════════════════════════
  // 1. CAG Fund Utilization & Lapsing Balance Auditor
  // ═══════════════════════════════════════════════════════════════

  describe('1. CAG Fund Utilization & Lapsing Balance Auditor', () => {

    it('calculates normal utilization (≥75%) without lapsing when fiscal year is active', () => {
      const result = calculateFundUtilization(100, 82, false);
      expect(result.utilizationPct).toBe(82);
      expect(result.unspentCr).toBe(18);
      expect(result.isLapsed).toBe(false);
      expect(result.severity).toBe('Normal');
    });

    it('flags under-utilized heads (50-74%) and marks as lapsed when fiscal year ends', () => {
      const result = calculateFundUtilization(50, 30, true);
      expect(result.utilizationPct).toBe(60);
      expect(result.unspentCr).toBe(20);
      expect(result.isLapsed).toBe(true);
      expect(result.severity).toBe('Under-utilized');
    });

    it('flags critical lapse (<50%) and aggregates summary metrics correctly', () => {
      const result = calculateFundUtilization(100, 35, true);
      expect(result.utilizationPct).toBe(35);
      expect(result.severity).toBe('Critical Lapse');
      expect(result.isLapsed).toBe(true);

      // Verify aggregation
      const entries = getFundUtilizationForPin('250001');
      expect(entries.length).toBeGreaterThan(0);
      const summary = computeUtilizationSummary(entries);
      expect(summary.totalSanctionedCr).toBeGreaterThan(0);
      expect(summary.totalActualCr).toBeGreaterThan(0);
      expect(summary.overallUtilizationPct).toBeGreaterThan(0);
      expect(summary.overallUtilizationPct).toBeLessThanOrEqual(100);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. ADR Shadow Candidate Expenditure Watchdog
  // ═══════════════════════════════════════════════════════════════

  describe('2. ADR Shadow Candidate Expenditure Watchdog', () => {

    it('identifies within-limit candidates (ratio ≤ 0.80) and validates ECI ceiling constants', () => {
      expect(ECI_CEILING_LS_LAKHS).toBe(95);
      expect(ECI_CEILING_VS_LAKHS).toBe(40);

      const result = calculateShadowRatio(60, ECI_CEILING_LS_LAKHS);
      expect(result.ratio).toBeLessThanOrEqual(0.80);
      expect(result.isOverLimit).toBe(false);
      expect(result.severity).toBe('Within Limit');
    });

    it('flags borderline candidates (ratio 0.81-1.00) correctly', () => {
      const result = calculateShadowRatio(85, ECI_CEILING_LS_LAKHS);
      expect(result.ratio).toBeGreaterThan(0.80);
      expect(result.ratio).toBeLessThanOrEqual(1.00);
      expect(result.isOverLimit).toBe(false);
      expect(result.severity).toBe('Borderline');
    });

    it('flags over-limit candidates (ratio > 1.0) and retrieves multi-candidate data', () => {
      const result = calculateShadowRatio(180, ECI_CEILING_LS_LAKHS);
      expect(result.ratio).toBeGreaterThan(1.0);
      expect(result.isOverLimit).toBe(true);
      expect(result.severity).toBe('Over Limit');

      // Verify multi-candidate retrieval
      const candidates = getCandidateExpendituresForPin('250001');
      expect(candidates.length).toBeGreaterThanOrEqual(2);
      expect(candidates[0].breakdownCategories.length).toBeGreaterThan(0);
      expect(candidates.some(c => c.electionType === 'Lok Sabha')).toBe(true);
      expect(candidates.some(c => c.electionType === 'Vidhan Sabha')).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. NFSA PDS Quota Audit & DGRO Petition Engine
  // ═══════════════════════════════════════════════════════════════

  describe('3. NFSA PDS Quota Audit & DGRO Petition Engine', () => {

    it('calculates full quota fulfillment (≥90%) and partial (60-89%) correctly', () => {
      const full = calculateQuotaFulfillment(1000, 950);
      expect(full.fulfillmentPct).toBe(95);
      expect(full.shortfallKg).toBe(50);
      expect(full.severity).toBe('Full');

      const partial = calculateQuotaFulfillment(1000, 700);
      expect(partial.fulfillmentPct).toBe(70);
      expect(partial.shortfallKg).toBe(300);
      expect(partial.severity).toBe('Partial');

      const critical = calculateQuotaFulfillment(1000, 400);
      expect(critical.fulfillmentPct).toBe(40);
      expect(critical.severity).toBe('Critical');
    });

    it('detects ghost card suspects when >10% of registered beneficiaries never collected', () => {
      // No flag: 8% suspect
      const safe = detectGhostCards(100, 92);
      expect(safe.suspectCount).toBe(8);
      expect(safe.pctSuspect).toBe(8);
      expect(safe.isFlag).toBe(false);

      // Flag: 25% suspect
      const flagged = detectGhostCards(200, 150);
      expect(flagged.suspectCount).toBe(50);
      expect(flagged.pctSuspect).toBe(25);
      expect(flagged.isFlag).toBe(true);

      // Verify PIN data generation
      const auditEntries = getPdsAuditForPin('110001');
      expect(auditEntries.length).toBeGreaterThan(0);
      expect(auditEntries[0].fpsLicenseNo).toContain('FPS-');
    });

    it('generates a valid DGRO petition containing NFSA Section 15 reference and petitioner details', () => {
      const petition = generateDgroPetition({
        petitionerName: 'Test Citizen',
        pinCode: '250001',
        fpsLicenseNo: 'FPS-250001-101',
        complaintNature: 'Rice quota not distributed for 3 months',
        nfsaSectionRef: 'Section 15, NFSA 2013',
        dateOfIncident: '2025-09-10',
      });

      expect(petition).toContain('Section 15');
      expect(petition).toContain('NFSA 2013');
      expect(petition).toContain('Test Citizen');
      expect(petition).toContain('FPS-250001-101');
      expect(petition).toContain('250001');
      expect(petition).toContain('Rice quota not distributed');
      expect(petition).toContain('DGRO');
      expect(petition).toContain('जिला शिकायत निवारण अधिकारी');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. Dual-PIN 6-Pillar Weighted Locality Benchmarking
  // ═══════════════════════════════════════════════════════════════

  describe('4. Dual-PIN 6-Pillar Weighted Locality Benchmarking', () => {

    const metricsDelhi = {
      pin: '110001',
      location: { state: 'Delhi', district: 'New Delhi', region: 'North', isValid: true } as any,
      civicHealthScore: 84,
      schoolsCount: 8,
      schoolHealthPct: 88,
      studentTeacherRatio: '24:1',
      hospitalBedsUsable: 420,
      hospitalDoctorVacancyPct: 12,
      infraCompletionPct: 88,
      activeDlpRoadsCount: 6,
      repFundUtilizationPct: 82,
      repAverageCostHikePct: 9.2,
      aqiValue: 284,
      aqiCategory: 'Poor',
      grievanceDisposalDays: 28,
    };

    const metricsMeerut = {
      pin: '250001',
      location: { state: 'UP', district: 'Meerut', region: 'North', isValid: true } as any,
      civicHealthScore: 76,
      schoolsCount: 4,
      schoolHealthPct: 78,
      studentTeacherRatio: '36:1',
      hospitalBedsUsable: 190,
      hospitalDoctorVacancyPct: 32,
      infraCompletionPct: 68,
      activeDlpRoadsCount: 2,
      repFundUtilizationPct: 74,
      repAverageCostHikePct: 16.4,
      aqiValue: 210,
      aqiCategory: 'Moderate',
      grievanceDisposalDays: 46,
    };

    it('computes weighted composite scores using 6-pillar formula with correct weights', () => {
      const scoreDelhi = computeWeightedScore(metricsDelhi);
      const scoreMeerut = computeWeightedScore(metricsMeerut);

      // Delhi has better education, healthcare, infra, governance — should score higher
      expect(scoreDelhi).toBeGreaterThan(scoreMeerut);
      // Both should be reasonable percentages (0-100 range)
      expect(scoreDelhi).toBeGreaterThan(0);
      expect(scoreDelhi).toBeLessThanOrEqual(100);
      expect(scoreMeerut).toBeGreaterThan(0);
      expect(scoreMeerut).toBeLessThanOrEqual(100);
    });

    it('calculates correct delta differences between two PINs', () => {
      const scoreDelhi = computeWeightedScore(metricsDelhi);
      const scoreMeerut = computeWeightedScore(metricsMeerut);
      const delta = Math.round(Math.abs(scoreDelhi - scoreMeerut) * 10) / 10;

      // Delta should be a positive number > 0 since the metrics differ
      expect(delta).toBeGreaterThan(0);
      // Individual pillar deltas
      expect(Math.abs(metricsDelhi.schoolHealthPct - metricsMeerut.schoolHealthPct)).toBe(10);
      expect(Math.abs(metricsDelhi.hospitalDoctorVacancyPct - metricsMeerut.hospitalDoctorVacancyPct)).toBe(20);
      expect(Math.abs(metricsDelhi.infraCompletionPct - metricsMeerut.infraCompletionPct)).toBe(20);
    });
  });
});
