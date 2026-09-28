import { describe, it, expect } from 'vitest';
import { policeService } from '../../modules/police/services/policeService';
import { epfoService } from '../../modules/epfo/services/epfoService';
import { fssaiService } from '../../modules/fssai/services/fssaiService';

describe('Final Civic Domains: Police (M16), EPFO (M18), FSSAI (M19)', () => {
  describe('Module 16: Police & e-FIR Services', () => {
    it('resolves jurisdictional police stations with SHO and CCTNS sync for any PIN', async () => {
      const stations = await policeService.getPoliceStationsByPin('110001');
      expect(stations.length).toBeGreaterThan(0);

      const s = stations[0];
      expect(s.stationName).toBeDefined();
      expect(s.shoName).toBeDefined();
      expect(s.controlRoomPhone).toBe('112');
      expect(s.cctnsStatus).toMatch(/ONLINE_ACTIVE|PARTIAL_SYNC/);
      expect(s.sanctionedStrength).toBeGreaterThan(0);
      expect(s.postedStrength).toBeGreaterThan(0);
      expect(s.sourceAuthority).toContain('CCTNS');
    });

    it('returns statutory Zero-FIR rights with Section 199 BNS refusal penalty', () => {
      const guide = policeService.getZeroFirGuide();
      expect(guide.keyRights.length).toBe(4);
      expect(guide.officerRefusalPenalty).toContain('Section 199 BNS');
      expect(guide.statutoryBasis).toContain('Lalita Kumari');
    });

    it('returns online e-FIR eligible categories with digital police portals', () => {
      const categories = policeService.getEFirCategories();
      expect(categories.length).toBeGreaterThanOrEqual(4);
      const theft = categories.find((c) => c.category.includes('Vehicle Theft'));
      expect(theft).toBeDefined();
      expect(theft?.isOnlineEligible).toBe(true);
      expect(theft?.statePortalUrl).toContain('digitalpolice.gov.in');
    });
  });

  describe('Module 18: EPFO & Pension Settlement Services', () => {
    it('returns regional EPFO office with 20-day statutory SLA and commissioner details', async () => {
      const offices = await epfoService.getEpfoOfficesByPin('250001');
      expect(offices.length).toBeGreaterThan(0);

      const o = offices[0];
      expect(o.statutorySlaDays).toBe(20);
      expect(o.actualAverageSettlementDays).toBeGreaterThan(0);
      expect(o.regionalCommissioner).toBeDefined();
      expect(o.contactEmail).toContain('@epfindia.gov.in');
      expect(o.claimsSettledThisMonth).toBeGreaterThan(1000);
      expect(o.rejectionRatePct).toBeGreaterThan(0);
    });

    it('returns Form 19, 10C, 31 claim details and rejection traps', () => {
      const claims = epfoService.getClaimTypes();
      expect(claims.length).toBe(4);

      const form31 = claims.find((c) => c.formNumber.includes('Form 31'));
      expect(form31).toBeDefined();
      expect(form31?.autoSettlementLimit).toBe(100000);
      expect(form31?.commonRejectionReasons.length).toBeGreaterThan(0);
    });

    it('provides 3-tier grievance escalation hierarchy with statutory windows', () => {
      const levels = epfoService.getEscalationLevels();
      expect(levels.length).toBe(3);
      expect(levels[0].portalUrl).toContain('epfigms.gov.in');
      expect(levels[2].portalUrl).toContain('pgportal.gov.in');
    });
  });

  describe('Module 19: FSSAI Food Hygiene & Inspection Services', () => {
    it('returns local food outlets with FoSCoS 14-digit licenses and hygiene ratings', async () => {
      const outlets = await fssaiService.getEstablishmentsByPin('560001');
      expect(outlets.length).toBeGreaterThan(0);

      const e = outlets[0];
      expect(e.licenseNumber.length).toBe(14);
      expect(e.businessName).toBeDefined();
      expect(e.licenseStatus).toMatch(/ACTIVE_VALID|EXPIRED|SUSPENDED/);
      expect(e.hygieneRating).toBeGreaterThanOrEqual(0);
      expect(e.hygieneRating).toBeLessThanOrEqual(5);
      expect(e.designatedOfficer).toBeDefined();
      expect(e.inspectionFindings).toBeDefined();
    });

    it('provides DART household testing guides for milk, honey, turmeric, and ghee', () => {
      const tests = fssaiService.getRapidTests();
      expect(tests.length).toBe(4);

      const milk = tests.find((t) => t.foodItem.includes('Milk'));
      expect(milk).toBeDefined();
      expect(milk?.suspectedAdulterant).toContain('Detergent');
      expect(milk?.healthRisk).toBeDefined();
    });
  });
});
