import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getReportCorroborations, 
  corroborateReport, 
  getCitizenKarma, 
  awardKarma, 
  QUORUM_THRESHOLD 
} from '../../modules/reporting/services/citizenTrustService';
import { 
  calculateLiquidatedDamages, 
  getLiquidatedDamagesLedger, 
  getLedgerSummaryMetrics 
} from '../../modules/contractor/services/liquidatedDamagesService';
import { 
  generateCertifiedDocketHtml, 
  CertifiedDocketData 
} from '../../modules/accountability/services/docketExportService';

describe('Phase 5: Spatial Lens, Citizen Quorum, Liquidated Damages & Docket Engine', () => {

  describe('1. Citizen Quorum & Community Corroboration Engine', () => {
    const testReportId = 'rep-test-phase5-quorum';

    it('identifies unreached quorum when corroborations are below threshold (3)', () => {
      const status = getReportCorroborations(testReportId);
      expect(status.corroborationCount).toBe(0);
      expect(status.quorumReached).toBe(false);
      expect(status.priorityLevel).toBe('Standard Citizen Report');
    });

    it('triggers automated priority escalation when 3 residents corroborate', () => {
      // Corroboration 1
      const res1 = corroborateReport({
        reportId: testReportId,
        citizenPin: '250001',
        citizenName: 'Resident 1',
        comment: 'Pothole observed on-ground.'
      });
      expect(res1.quorumStatus.corroborationCount).toBe(1);
      expect(res1.quorumStatus.quorumReached).toBe(false);
      expect(res1.isNewQuorumUnlocked).toBe(false);

      // Corroboration 2
      const res2 = corroborateReport({
        reportId: testReportId,
        citizenPin: '250001',
        citizenName: 'Resident 2',
        comment: 'Water logging confirmed.'
      });
      expect(res2.quorumStatus.corroborationCount).toBe(2);
      expect(res2.quorumStatus.quorumReached).toBe(false);
      expect(res2.isNewQuorumUnlocked).toBe(false);

      // Corroboration 3 (Reaches Quorum Threshold)
      const res3 = corroborateReport({
        reportId: testReportId,
        citizenPin: '250001',
        citizenName: 'Resident 3',
        comment: 'Bus axle damaged here today.'
      });
      expect(res3.quorumStatus.corroborationCount).toBe(3);
      expect(res3.quorumStatus.quorumReached).toBe(true);
      expect(res3.isNewQuorumUnlocked).toBe(true);
      expect(res3.quorumStatus.priorityLevel).toBe('Community Quorum Verified (High Priority)');
    });
  });

  describe('2. Citizen Auditor Karma & Reputation System', () => {
    const auditorName = 'TestAuditor_Phase5';

    it('initializes profile and attributes baseline points', () => {
      const profile = getCitizenKarma(auditorName);
      expect(profile.userIdOrName).toBe(auditorName);
      expect(profile.karmaPoints).toBeGreaterThanOrEqual(60);
      expect(profile.tier).toBe('Verified Local Resident (Tier 2)');
    });

    it('awards +15 karma on corroboration and +25 on ground rectification verification', () => {
      const base = getCitizenKarma(auditorName).karmaPoints;

      const p1 = awardKarma(auditorName, 'corroborated');
      expect(p1.karmaPoints).toBe(base + 15);

      const p2 = awardKarma(auditorName, 'rectification_verified');
      expect(p2.karmaPoints).toBe(base + 15 + 25);
    });

    it('elevates to Civic Sentinel (Tier 1) when karma exceeds 150 points', () => {
      awardKarma(auditorName, 'rectification_verified');
      awardKarma(auditorName, 'rectification_verified');
      const profile = awardKarma(auditorName, 'rectification_verified');

      expect(profile.karmaPoints).toBeGreaterThanOrEqual(150);
      expect(profile.tier).toBe('Civic Sentinel (Tier 1)');
    });

    it('deducts 30 karma points when a report is flagged as spam', () => {
      const current = getCitizenKarma(auditorName).karmaPoints;
      const penalized = awardKarma(auditorName, 'flagged_spam');
      expect(penalized.karmaPoints).toBe(current - 30);
    });
  });

  describe('3. Contractor Liquidated Damages & CPWD Section 16 Engine', () => {
    it('calculates linear delay damages below the statutory 10% ceiling', () => {
      // Contract ₹4.80 Cr (480 Lakhs), 50 days delay @ 0.05%/day = 480 * 0.0005 * 50 = 12.0 Lakhs
      const result = calculateLiquidatedDamages(4.80, 50, 0.05);
      expect(result.accruedLakhs).toBe(12.0);
      expect(result.maxCapLakhs).toBe(48.0);
      expect(result.isCapped).toBe(false);
    });

    it('strictly caps damages at 10% of total awarded budget when delays are severe', () => {
      // Contract ₹4.80 Cr (480 Lakhs), 300 days delay @ 0.05%/day = 72 Lakhs, capped at 48.0 Lakhs
      const result = calculateLiquidatedDamages(4.80, 300, 0.05);
      expect(result.accruedLakhs).toBe(48.0);
      expect(result.maxCapLakhs).toBe(48.0);
      expect(result.isCapped).toBe(true);
    });

    it('returns 0 damages for zero or negative delay days', () => {
      const result = calculateLiquidatedDamages(5.0, 0);
      expect(result.accruedLakhs).toBe(0);
    });

    it('aggregates public ledger default arrears and deductions correctly', () => {
      const ledger = getLiquidatedDamagesLedger();
      expect(ledger.length).toBeGreaterThan(0);

      const metrics = getLedgerSummaryMetrics();
      expect(metrics.totalOverdueProjects).toBe(ledger.length);
      expect(metrics.totalAccruedDamagesCr).toBeGreaterThan(0);
      expect(metrics.pendingExchequerRecoveryCr).toBeGreaterThan(0);
    });
  });

  describe('4. Official Statutory PDF Docket Generator', () => {
    const dummyDocket: CertifiedDocketData = {
      docketId: 'JX-DOC-250001-998811',
      title: 'Section 6(1) RTI: Meerut Cantt Pavement Defects',
      subtitle: 'Inspection of Measurement Book under IRC SP:98',
      statutoryAct: 'Right to Information Act, 2005 (Section 6(1))',
      department: 'UP Public Works Department',
      authorityName: 'Superintending Engineer, Meerut Circle',
      pinCode: '250001',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      dateOfIssue: '24 September 2026',
      sha256Seal: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      verificationUrl: 'https://jantax.gov.in/verify/docket/250001',
      bodyText: 'Certified copies of bitumen core-cut tests are demanded for work order PWD-8819.',
      statutoryClausesCited: [
        'Section 6(1) of RTI Act 2005',
        'IRC:SP:84-2019 Schedule K Liquidated Damages'
      ],
      exhibitsList: ['Work Order #PWD-8819', 'GPS Photo Evidence'],
      auditorName: 'Mohd Zaid',
      auditorKarmaTier: 'Civic Sentinel (Tier 1)'
    };

    it('generates well-formed HTML containing formal bureaucratic markers and cryptographic seal', () => {
      const html = generateCertifiedDocketHtml(dummyDocket);

      expect(html).toContain('OFFICIAL STATUTORY CIVIC DOCKET');
      expect(html).toContain('JX-DOC-250001-998811');
      expect(html).toContain('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
      expect(html).toContain('IRC:SP:84-2019 Schedule K Liquidated Damages');
      expect(html).toContain('Mohd Zaid');
      expect(html).toContain('@media print');
    });
  });

});
