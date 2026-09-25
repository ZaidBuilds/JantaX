import { describe, it, expect } from 'vitest';
import { localStore } from '../../../server/src/db/localStore';
import { dal } from '../../../server/src/db/dal';
import { runAllConnectors } from '../../../server/src/connectors/connectorRunner';
import { fetchPmgsyPackagesForPin } from '../../../server/src/connectors/pmgsyRoadConnector';
import { fetchUdiseSchoolsForPin } from '../../../server/src/connectors/udiseSchoolConnector';
import { fetchReraProjectsForPin } from '../../../server/src/connectors/reraProjectConnector';
import { getAuthenticRecordsForPin } from '../../core/data/authenticData';

describe('Pan-India 9-Postal-Zone Administrative Resolution', () => {
  const zoneTestPins = [
    { zone: '1 (North - Delhi)', pin: '110001', expectedState: 'Delhi', expectedDistrict: 'New Delhi' },
    { zone: '1 (North - Chandigarh)', pin: '160001', expectedState: 'Chandigarh', expectedDistrict: 'Chandigarh' },
    { zone: '1 (North - J&K)', pin: '190001', expectedState: 'Jammu and Kashmir', expectedDistrict: 'Srinagar' },
    { zone: '2 (North - Meerut)', pin: '250001', expectedState: 'Uttar Pradesh', expectedDistrict: 'Meerut' },
    { zone: '2 (North - Varanasi)', pin: '221001', expectedState: 'Uttar Pradesh', expectedDistrict: 'Varanasi' },
    { zone: '2 (North - Lucknow)', pin: '226001', expectedState: 'Uttar Pradesh', expectedDistrict: 'Lucknow' },
    { zone: '3 (West - Jaipur)', pin: '302001', expectedState: 'Rajasthan', expectedDistrict: 'Jaipur' },
    { zone: '3 (West - Ahmedabad)', pin: '380001', expectedState: 'Gujarat', expectedDistrict: 'Ahmedabad' },
    { zone: '4 (West/Central - Mumbai)', pin: '400001', expectedState: 'Maharashtra', expectedDistrict: 'Mumbai' },
    { zone: '4 (West/Central - Bhopal)', pin: '462001', expectedState: 'Madhya Pradesh', expectedDistrict: 'Bhopal' },
    { zone: '5 (South - Bengaluru)', pin: '560001', expectedState: 'Karnataka', expectedDistrict: 'Bengaluru Urban' },
    { zone: '5 (South - Hyderabad)', pin: '500001', expectedState: 'Telangana', expectedDistrict: 'Hyderabad' },
    { zone: '6 (South - Chennai)', pin: '600001', expectedState: 'Tamil Nadu', expectedDistrict: 'Chennai' },
    { zone: '6 (South - Kochi)', pin: '682001', expectedState: 'Kerala', expectedDistrict: 'Ernakulam' },
    { zone: '7 (East - Kolkata)', pin: '700001', expectedState: 'West Bengal', expectedDistrict: 'Kolkata' },
    { zone: '8 (East - Patna)', pin: '800001', expectedState: 'Bihar', expectedDistrict: 'Patna' },
  ];

  zoneTestPins.forEach(({ zone, pin, expectedState, expectedDistrict }) => {
    it(`resolves Zone ${zone} PIN ${pin} to ${expectedDistrict}, ${expectedState}`, () => {
      const record = localStore.getPincode(pin);
      expect(record).not.toBeNull();
      expect(record?.state).toBe(expectedState);
      expect(record?.district).toBe(expectedDistrict);
      expect(record?.parliamentaryConstituency).toBeDefined();
      expect(record?.assemblyConstituency).toBeDefined();
    });
  });

  it('guarantees deterministic non-crashing resolution for remote / unknown PINs', async () => {
    // Remote Leh/Ladakh PIN
    const remotePin = await dal.getPincode('194101');
    expect(remotePin).not.toBeNull();
    expect(remotePin.code).toBe('194101');
    expect(remotePin.counts.schools).toBeGreaterThanOrEqual(2);
    expect(remotePin.dataSource).toContain('GODL-India');

    // Remote Lakshadweep PIN
    const islandPin = await dal.getPincode('682555');
    expect(islandPin).not.toBeNull();
    expect(islandPin.code).toBe('682555');
    expect(islandPin.counts.infraProjects).toBeGreaterThanOrEqual(1);
  });
});

describe('Government Open Data Connectors Fleet', () => {
  it('runAllConnectors executes all 6 connectors and returns comprehensive status', async () => {
    const summary = await runAllConnectors('250001');
    expect(summary.syncedAt).toBeDefined();
    expect(summary.cpgramsStatus).toBe('OK');
    expect(summary.pmgsyStatus).toBe('OK');
    expect(summary.pmgsyCount).toBeGreaterThan(0);
    expect(summary.udiseStatus).toBe('OK');
    expect(summary.udiseCount).toBeGreaterThan(0);
    expect(summary.reraStatus).toBe('OK');
    expect(summary.reraCount).toBeGreaterThan(0);
  }, 15000);

  it('fetchPmgsyPackagesForPin dynamically maps state, district and DLP warranty', async () => {
    const packages = await fetchPmgsyPackagesForPin('250001');
    expect(packages.length).toBeGreaterThan(0);
    const p = packages[0];
    expect(p.packageNo).toBeDefined();
    expect(p.state).toBe('Uttar Pradesh');
    expect(p.district).toBe('Meerut');
    expect(p.dlpExpiryDate).toBeDefined();
    expect(p.source).toContain('OMMAS');
    expect(p.fetchedAt).toBeDefined();
  });

  it('fetchUdiseSchoolsForPin dynamically computes Pupil-Teacher Ratio and amenities', async () => {
    const schools = await fetchUdiseSchoolsForPin('110001');
    expect(schools.length).toBeGreaterThan(0);
    const s = schools[0];
    expect(s.udiseCode).toBeDefined();
    expect(s.ptr).toBeGreaterThan(0);
    expect(s.hasFunctionalTapWater).toBe(true);
    expect(s.cagObservationRef).toBeDefined();
    expect(s.source).toContain('UDISE+');
  });

  it('fetchReraProjectsForPin returns official RERA registration and delay tracking', async () => {
    const projects = await fetchReraProjectsForPin('250001');
    expect(projects.length).toBeGreaterThan(0);
    const r = projects[0];
    expect(r.reraNumber).toBeDefined();
    expect(r.promoterName).toBeDefined();
    expect(r.regulatoryStatus).toBeDefined();
    expect(r.source).toContain('Real Estate Regulatory Authority');
  });
});

describe('Resilient DAL & Authentic Client Snapshot', () => {
  it('dal.getRepresentatives returns authentic multi-tier elected representatives', async () => {
    const reps = await dal.getRepresentatives('110001');
    expect(reps.length).toBeGreaterThanOrEqual(2);
    const mp = reps.find((r) => r.tier === 'MP_LOK_SABHA');
    expect(mp).toBeDefined();
    expect(mp?.nameEn).toContain('Bansuri Swaraj');
    expect(mp?.party).toContain('BJP');
    expect(mp?.allocatedBudgetCr).toBe(5.0);
  });

  it('dal.getBudgetAudit returns audited CAG major heads and lapse calculations', async () => {
    const budget = await dal.getBudgetAudit('250001');
    expect(budget.length).toBeGreaterThanOrEqual(2);
    const roads = budget.find((b) => b.headOfAccount.includes('5054'));
    expect(roads).toBeDefined();
    expect(roads?.headOfAccount).toContain('Capital Outlay on Roads and Bridges');
    expect(roads?.unspentBalanceCr).toBeGreaterThan(0);
    expect(roads?.sourceReference).toContain('CAG');
  });

  it('dal.getLandRecords returns Tehsil offices and Bhu-Aadhaar parcels', async () => {
    const land = await dal.getLandRecords('250001');
    expect(land.tehsils.length).toBeGreaterThan(0);
    expect(land.parcels.length).toBeGreaterThan(0);
    const parcel = land.parcels[0];
    expect(parcel.ulpin).toHaveLength(14);
    expect(parcel.sourceUrl).toContain('upbhulekh.gov.in');
  });


  it('getAuthenticRecordsForPin returns 100% authentic records with zero random mocks', () => {
    const res = getAuthenticRecordsForPin('221001');
    expect(res.records.school).toBeDefined();
    expect(res.records.infra).toBeDefined();
    expect(res.records.rera).toBeDefined();
    expect(res.records.hospital).toBeDefined();
    expect(res.records.pds).toBeDefined();
    expect(res.records.grievance).toBeDefined();
    expect(res.records.budget).toBeDefined();

    // Verify school
    const sch = res.records.school![0];
    expect(sch.isSample).toBe(false);
    expect(sch.cagReportRef).toBeDefined();

    // Verify infra
    const inf = res.records.infra![0];
    expect(inf.isSample).toBe(false);
    expect(inf.packageNo).toBeDefined();
    expect(inf.isDlpActive).toBe(true);
  });
});
