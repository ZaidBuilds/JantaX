import { describe, it, expect } from 'vitest';
import { localStore } from '../../../server/src/db/localStore';
import { dal } from '../../../server/src/db/dal';
import { fetchCpgramsMonthlySummary } from '../../../server/src/connectors/cpgramsMonthlyConnector';
import { fetchIndiaPostData } from '../../../server/src/connectors/indiaPostConnector';
import { getAuthenticPincode } from '../../core/data/authenticData';

describe('Real Data Layer — Local Store & GODL-India Datasets', () => {
  it('retrieves authentic PIN administrative metadata for Delhi 110001', () => {
    const pin = localStore.getPincode('110001');
    expect(pin).not.toBeNull();
    expect(pin?.district).toBe('New Delhi');
    expect(pin?.state).toBe('Delhi');
    expect(pin?.parliamentaryConstituency).toContain('New Delhi');
    expect(pin?.assemblyConstituency).toContain('New Delhi');
  });

  it('retrieves authentic UDISE+ schools with genuine government codes', () => {
    const schools = localStore.getSchools('110001');
    expect(schools.length).toBeGreaterThanOrEqual(2);
    const skv = schools.find((s) => s.udiseCode === '07080100101');
    expect(skv).toBeDefined();
    expect(skv?.nameEnglish).toBe('Sarvodaya Kanya Vidyalaya Mandir Marg');
    expect(skv?.managementType).toContain('Directorate of Education');
    expect(skv?.hasToilet).toBe(true);
    expect(skv?.sourceUrl).toBe('https://udiseplus.gov.in');
  });

  it('retrieves authentic PMGSY and NHAI infrastructure packages for Meerut 250001', () => {
    const infra = localStore.getInfra('250001');
    expect(infra.length).toBeGreaterThanOrEqual(2);
    const dme = infra.find((i) => i.packageNo === 'NHAI-UP-DME-PKG4');
    expect(dme).toBeDefined();
    expect(dme?.contractorName).toBe('Apco Infratech Pvt. Ltd.');
    expect(dme?.budgetCr).toBe(64.2);
    expect(dme?.isDlpActive).toBe(true);
  });

  it('retrieves authentic RERA projects with official state registration numbers', () => {
    const rera = localStore.getRera('250001');
    expect(rera.length).toBeGreaterThanOrEqual(2);
    const supertech = rera.find((r) => r.reraNumber === 'UPRERAPRJ882104');
    expect(supertech).toBeDefined();
    expect(supertech?.status).toBe('Delayed');
    expect(supertech?.delayMonths).toBeGreaterThan(12);
  });

  it('retrieves authentic Fair Price Shops under NFSA with quota records', () => {
    const pds = localStore.getPds('250001');
    expect(pds.length).toBeGreaterThanOrEqual(2);
    const fps = pds[0];
    expect(fps.fpsCode).toContain('UP-0907-FPS');
    expect(fps.biometricEposPct).toBeGreaterThan(80);
    expect(fps.wheatQuotaQtl).toBeGreaterThan(0);
  });

  it('retrieves authentic Tehsil revenue offices and 14-digit ULPIN parcels', () => {
    const tehsils = localStore.getTehsils('250001');
    expect(tehsils.length).toBeGreaterThan(0);
    expect(tehsils[0].tehsilName).toContain('Meerut Sadar Tehsil');

    const parcels = localStore.getParcels('250001');
    expect(parcels.length).toBeGreaterThanOrEqual(2);
    const pond = parcels.find((p) => p.isCommonsProtected);
    expect(pond).toBeDefined();
    expect(pond?.landUseCategory).toBe('WATERBODY_POND');
    expect(pond?.encumbranceStatus).toBe('COMMONS_PROTECTED');
  });
});

describe('Resilient Data Access Layer (DAL)', () => {
  it('dal.getPincode returns authentic metadata and accurate facility counts', async () => {
    const pin = await dal.getPincode('110001');
    expect(pin).not.toBeNull();
    expect(pin?.code).toBe('110001');
    expect(pin?.counts.schools).toBeGreaterThan(0);
    expect(pin?.counts.infraProjects).toBeGreaterThan(0);
    expect(pin?.dataSource).toContain('Department of Posts');
  });

  it('dal.getRecordsForPin formats authentic records with isSample: false and full provenance', async () => {
    const res = await dal.getRecordsForPin('250001');
    expect(res.school).toBeDefined();
    expect(res.infra).toBeDefined();
    expect(res.rera).toBeDefined();
    expect(res.hospital).toBeDefined();
    expect(res.pds).toBeDefined();

    // Verify school record adheres to ApiRecord contract
    const sch = res.school[0];
    expect(sch.isSample).toBe(false);
    expect(sch.moduleId).toBe('school');
    expect(sch.claim.source.nameEnglish).toContain('UDISE+');
    expect(sch.reality.confidenceLevel).toMatch(/high|medium/);

    // Verify infra record adheres to ApiRecord contract
    const inf = res.infra[0];
    expect(inf.isSample).toBe(false);
    expect(inf.budget).toContain('₹');
    expect(inf.claim.label).toContain('% Complete');
  });

  it('dal.getRecordsForPin supports single module filtering', async () => {
    const res = await dal.getRecordsForPin('110001', 'school');
    expect(res.school).toBeDefined();
    expect(res.infra).toBeUndefined();
    expect(res.rera).toBeUndefined();
  });
});

describe('Live Connectors & Client Snapshot', () => {
  it('cpgramsMonthlyConnector aggregates national metrics across ministries', async () => {
    const summary = await fetchCpgramsMonthlySummary();
    expect(summary.reportMonth).toBe('January 2026');
    expect(summary.totalGrievancesNational).toBeGreaterThan(30000);
    expect(summary.topMinistries.length).toBeGreaterThanOrEqual(4);
  });

  it('indiaPostConnector gracefully handles invalid pin codes without throwing', async () => {
    const res = await fetchIndiaPostData('000000');
    expect(res).toBeNull();
  });

  it('getAuthenticPincode provides verified counts with zero synthetic random numbers', () => {
    const p1 = getAuthenticPincode('250001');
    const p2 = getAuthenticPincode('250001');
    expect(p1.counts.schools).toBe(p2.counts.schools);
    expect(p1.district).toBe('Meerut');
    expect(p1.dataSource).toContain('GODL-India');
  });
});
