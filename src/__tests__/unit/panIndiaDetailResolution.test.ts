import { describe, it, expect } from 'vitest';
import { api } from '../../core/services/api';
import { getProjectById } from '../../modules/infra/services/projectService';
import { getReraProjectById } from '../../modules/rera/services/reraService';
import { getStationById } from '../../modules/pollution/services/pollutionService';
import { getWardById } from '../../modules/nagar/services/nagarService';
import { getBoothById } from '../../modules/booth/services/boothService';
import { getCourtById } from '../../modules/courts/services/courtsService';
import { getAuthorityById } from '../../modules/rti/services/rtiService';
import { getRepresentativeById, getWorkById } from '../../modules/mplads/services/mpladsService';
import { dal } from '../../../server/src/db/dal';

describe('Pan-India Real Data & Detail Route Resolution (PS: SIH26202)', () => {
  it('resolves authentic School detail for Pune (411001) via DAL', async () => {
    const record = await dal.getRecordById('school', 'sch-411001-1');
    expect(record).toBeDefined();
    expect(record?.location.pinCode).toBe('411001');
    expect(record?.location.district).toBe('Pune');
    expect(record?.location.state).toBe('Maharashtra');
    expect(record?.titleEnglish).toContain('Pune');
  });

  it('resolves authentic Infrastructure detail for Coimbatore (641001) via DAL', async () => {
    const record = await dal.getRecordById('infra', 'infra-641001-1');
    expect(record).toBeDefined();
    expect(record?.location.pinCode).toBe('641001');
    expect(record?.location.district).toBe('Coimbatore');
    expect(record?.location.state).toBe('Tamil Nadu');
    expect(record?.contractorName).toContain('Coimbatore');
  });

  it('resolves authentic School detail on client fallback via api.getRecord', async () => {
    const res: any = await api.getRecord('school', 'auth-sch-834001-1');
    expect(res).toBeDefined();
    expect(res.record).toBeDefined();
    expect(res.record.location.district).toBe('Ranchi');
    expect(res.record.location.state).toBe('Jharkhand');
  });

  it('resolves authentic Infrastructure detail on client via getProjectById for Srinagar (190001)', () => {
    const proj = getProjectById('infra-190001-1');
    expect(proj).toBeDefined();
    expect(proj?.pinCode).toBe('190001');
    expect(proj?.district).toBe('Srinagar');
    expect(proj?.state).toBe('Jammu & Kashmir');
    expect(proj?.leadContractor).toContain('Srinagar');
  });

  it('resolves authentic RERA Housing project detail for Ranchi (834001)', () => {
    const rera = getReraProjectById('rera-834001-1');
    expect(rera).toBeDefined();
    expect(rera?.pinCode).toBe('834001');
    expect(rera?.district).toBe('Ranchi');
    expect(rera?.state).toBe('Jharkhand');
    expect(rera?.builderName).toContain('Ranchi');
  });

  it('resolves authentic CAAQMS Air Monitoring Station for Bengaluru (560001)', () => {
    const station = getStationById('cpcb-aqi-560001');
    expect(station).toBeDefined();
    expect(station?.pinCode).toBe('560001');
    expect(station?.city).toContain('Bengaluru');
    expect(station?.state).toBe('Karnataka');
    expect(station?.operator).toContain('Karnataka Pollution Control Board');
  });

  it('resolves authentic Municipal Ward for Kolkata (700001)', () => {
    const ward = getWardById('ward-700001-1');
    expect(ward).toBeDefined();
    expect(ward?.pinCode).toBe('700001');
    expect(ward?.district).toBe('Kolkata');
    expect(ward?.state).toBe('West Bengal');
    expect(ward?.corporationName).toBe('Kolkata Municipal Corporation');
  });

  it('resolves authentic Polling Booth for Ahmedabad (380001)', () => {
    const booth = getBoothById('booth-380001-1');
    expect(booth).toBeDefined();
    expect(booth?.pinCode).toBe('380001');
    expect(booth?.district).toBe('Ahmedabad');
    expect(booth?.state).toBe('Gujarat');
  });

  it('resolves authentic Court Complex for Kochi (682001)', () => {
    const court = getCourtById('court-682001-1');
    expect(court).toBeDefined();
    expect(court?.pinCode).toBe('682001');
    expect(court?.district).toBe('Ernakulam');
    expect(court?.state).toBe('Kerala');
    expect(court?.complexName).toContain('Ernakulam');
  });

  it('resolves authentic RTI Public Authority for Guwahati (781001)', () => {
    const auth = getAuthorityById('rti-781001-1');
    expect(auth).toBeDefined();
    expect(auth?.pinCode).toBe('781001');
    expect(auth?.city).toContain('Kamrup');
    expect(auth?.state).toBe('Assam');
  });

  it('resolves authentic MPLADS Representative & Work for Hyderabad (500001)', () => {
    const rep = getRepresentativeById('rep-mp-500001');
    expect(rep).toBeDefined();
    expect(rep?.state).toBe('Telangana');

    const work = getWorkById('mplads-500001-1');
    expect(work).toBeDefined();
    expect(work?.pinCode).toBe('500001');
    expect(work?.locationName).toContain('Hyderabad');
  });
});
