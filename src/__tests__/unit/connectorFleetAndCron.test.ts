import { describe, it, expect } from 'vitest';
import { scheduler } from '../../../server/src/jobs/scheduler';
import { startIngestionCron } from '../../../server/src/jobs/cron';
import { runAllConnectors } from '../../../server/src/connectors/connectorRunner';
import { dal } from '../../../server/src/db/dal';

describe('Track 3 & 4: Connector Fleet, Ingestion Scheduler & Resilient DAL Verification', () => {
  it('registers all 6 authentic Indian government connectors in the scheduler via startIngestionCron', () => {
    const { scheduler: sched } = startIngestionCron();
    
    // Check canonical connector registrations
    expect(sched.get('src_cpcb_aqi')).toBeDefined();
    expect(sched.get('src_darpg_202408')).toBeDefined();
    expect(sched.get('src_mord_pmgsy')).toBeDefined();
    expect(sched.get('src_udise_plus')).toBeDefined();
    expect(sched.get('src_rera_national')).toBeDefined();
    expect(sched.get('src_indiapost_live')).toBeDefined();
  });

  it('resolves friendly aliases for all 6 connectors without error', () => {
    expect(scheduler.get('cpcb-aqi')?.sourceId).toBe('src_cpcb_aqi');
    expect(scheduler.get('darpg-cpgrams')?.sourceId).toBe('src_darpg_202408');
    expect(scheduler.get('pmgsy-roads')?.sourceId).toBe('src_mord_pmgsy');
    expect(scheduler.get('udise-plus')?.sourceId).toBe('src_udise_plus');
    expect(scheduler.get('state-rera')?.sourceId).toBe('src_rera_national');
    expect(scheduler.get('india-post')?.sourceId).toBe('src_indiapost_live');
  });

  it('runs sync job for pmgsyLiveConnector and returns success observability even when DB is offline', async () => {
    const pmgsy = scheduler.get('pmgsy-roads')!;
    expect(pmgsy).toBeDefined();
    const obs = await scheduler.run('pmgsy-roads');
    expect(obs).toBeDefined();
    expect(obs?.sourceId).toBe('src_mord_pmgsy');
    expect(obs?.status).toBe('success');
    expect(obs?.recordsFetched).toBeGreaterThan(0);
  });

  it('runs sync job for udiseLiveConnector and returns success observability', async () => {
    const udise = scheduler.get('udise-plus')!;
    expect(udise).toBeDefined();
    const obs = await scheduler.run('udise-plus');
    expect(obs).toBeDefined();
    expect(obs?.sourceId).toBe('src_udise_plus');
    expect(obs?.status).toBe('success');
    expect(obs?.recordsFetched).toBeGreaterThan(0);
  });

  it('runs sync job for reraLiveConnector and returns success observability', async () => {
    const rera = scheduler.get('state-rera')!;
    expect(rera).toBeDefined();
    const obs = await scheduler.run('state-rera');
    expect(obs).toBeDefined();
    expect(obs?.sourceId).toBe('src_rera_national');
    expect(obs?.status).toBe('success');
    expect(obs?.recordsFetched).toBeGreaterThan(0);
  });

  it('returns multi-domain public records including pollution and budget in dal.getRecordsForPin', async () => {
    const records = await dal.getRecordsForPin('110001');
    expect(records).toBeDefined();
    expect(records.school).toBeDefined();
    expect(records.hospital).toBeDefined();
    expect(records.pollution).toBeDefined();
    expect(records.budget).toBeDefined();
    expect(Array.isArray(records.pollution)).toBe(true);
    expect(Array.isArray(records.budget)).toBe(true);
    expect(records.budget?.length).toBeGreaterThan(0);
    expect(records.budget?.[0]?.headOfAccount).toContain('2202');
  });
});
