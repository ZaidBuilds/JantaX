import { describe, it, expect } from 'vitest';
import {
  getAllAuthorities,
  getAuthorityById,
  getAuthoritiesByPin,
  getAuthoritiesSummaryForPin,
  compareAuthorities,
  getRtiTemplates,
  getRtiTemplateByType,
} from '../../modules/rti/services/rtiService';

describe('RTI Clock & Statutory Accountability Module — Unit & Integration Test Suite', () => {
  it('should retrieve all public authorities with valid statutory compliance metrics', () => {
    const authorities = getAllAuthorities();
    expect(authorities.length).toBeGreaterThan(0);

    authorities.forEach((a) => {
      expect(a.id).toBeDefined();
      expect(a.authorityName).toBeTruthy();
      expect(a.parentMinistry).toBeTruthy();
      expect(a.governmentLevel).toBeTruthy();
      expect(a.avgResponseDays).toBeGreaterThan(0);
      expect(Math.round(a.disposedWithin30DaysPercent + a.pendingBeyond30DaysPercent)).toBe(100);
      expect(a.rejectionRatePercent).toBeGreaterThanOrEqual(0);
      expect(a.cpio.name).toBeTruthy();
      expect(a.cpio.email).toBeTruthy();
      expect(a.faa.name).toBeTruthy();
      expect(a.faa.email).toBeTruthy();
      expect(a.topExemptions.length).toBeGreaterThan(0);
    });
  });

  it('should retrieve a public authority by unique ID', () => {
    const auth = getAuthorityById('RTI-AUTH-MORTH');
    expect(auth).toBeDefined();
    expect(auth?.authorityName).toContain('Road Transport');
    expect(auth?.avgResponseDays).toBe(22);
    expect(auth?.cpio.name).toBe('Ajay Kumar Verma');

    const notFound = getAuthorityById('NONEXISTENT-AUTH-999');
    expect(notFound).toBeUndefined();
  });

  it('should filter authorities by statutory 30-day compliance', () => {
    const compliant = getAllAuthorities({ maxResponseDays: 30 });
    expect(compliant.length).toBeGreaterThan(0);
    compliant.forEach((a) => {
      expect(a.avgResponseDays).toBeLessThanOrEqual(30);
    });
  });

  it('should search authorities by ministry, CPIO name, and keyword', () => {
    const transport = getAllAuthorities({ query: 'Transport' });
    expect(transport.length).toBeGreaterThan(0);

    const cpioSearch = getAllAuthorities({ query: 'Verma' });
    expect(cpioSearch.length).toBeGreaterThan(0);

    const pinAuthorities = getAllAuthorities({ pinCode: '110001' });
    expect(pinAuthorities.length).toBeGreaterThan(0);
    pinAuthorities.forEach((a) => expect(a.pinCode).toBe('110001'));
  });

  it('should sort authorities by response speed ascending', () => {
    const sorted = getAllAuthorities({ sortBy: 'speed_asc' });
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].avgResponseDays).toBeLessThanOrEqual(sorted[i + 1].avgResponseDays);
    }
  });

  it('should generate accurate PIN locality authority summary', () => {
    const summary = getAuthoritiesSummaryForPin('110001');
    expect(summary.pinCode).toBe('110001');
    expect(summary.primaryAuthority).toBeDefined();
    expect(summary.avgResponseDays).toBeGreaterThan(0);
    expect(summary.primaryCpio).toBeDefined();
  });

  it('should support side-by-side public authority comparison', () => {
    const compared = compareAuthorities(['RTI-AUTH-MORTH', 'RTI-AUTH-NHAI']);
    expect(compared.length).toBe(2);
    expect(compared[0].id).toBe('RTI-AUTH-MORTH');
    expect(compared[1].id).toBe('RTI-AUTH-NHAI');
  });

  it('should provide statutory RTI draft templates for Section 6(1), First Appeal 19(1), and 48-Hr Life & Liberty', () => {
    const templates = getRtiTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(3);

    const sec6 = getRtiTemplateByType('Initial Request');
    expect(sec6).toBeDefined();
    expect(sec6?.statutoryTimeline).toContain('30 Days');
    expect(sec6?.templateText).toContain('Section 6(1)');

    const appeal = getRtiTemplateByType('First Appeal');
    expect(appeal).toBeDefined();
    expect(appeal?.templateText).toContain('Section 19(1)');

    const lifeLiberty = getRtiTemplateByType('Life & Liberty');
    expect(lifeLiberty).toBeDefined();
    expect(lifeLiberty?.statutoryTimeline).toContain('48 Hours');
  });
});
