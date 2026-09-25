// @vitest-environment node
/**
 * Runs both connectors through the real sync engine against Postgres.
 * Opt-in: set TEST_DATABASE_URL to a migrated database this test may write to (CI does).
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { beforeAll, describe, expect, it } from 'vitest';

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)('sync pipeline against Postgres', () => {
  // Imported lazily so the Prisma client picks up the test database.
  let prisma: typeof import('../prisma').prisma;
  let runSyncJob: typeof import('../jobs/syncEngine').runSyncJob;
  let createConnector: typeof import('../jobs/registry').createConnector;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jantax-sync-'));
  const csv = path.join(dir, 'directory.csv');

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    ({ prisma } = await import('../prisma'));
    ({ runSyncJob } = await import('../jobs/syncEngine'));
    ({ createConnector } = await import('../jobs/registry'));
    for (const sourceId of ['india-post-pincode-directory', 'cpcb-realtime-aqi']) {
      const raws = await prisma.rawDocument.findMany({ where: { sourceId }, select: { id: true } });
      const parsed = await prisma.parsedDocument.findMany({ where: { rawDocumentId: { in: raws.map((r) => r.id) } }, select: { id: true } });
      await prisma.validationResult.deleteMany({ where: { parsedDocumentId: { in: parsed.map((p) => p.id) } } });
      await prisma.parsedDocument.deleteMany({ where: { id: { in: parsed.map((p) => p.id) } } });
      await prisma.rawDocument.deleteMany({ where: { sourceId } });
    }
    await prisma.airReading.deleteMany();
    await prisma.airStation.deleteMany();
    await prisma.postOffice.deleteMany();

    fs.writeFileSync(
      csv,
      [
        'circlename,regionname,divisionname,officename,pincode,officetype,delivery,district,statename,latitude,longitude',
        'Delhi Circle,Delhi Region,New Delhi Central,Connaught Place SO,110001,PO,Non Delivery,NEW DELHI,DELHI,28.6315,77.2167',
        'Delhi Circle,Delhi Region,New Delhi Central,Janpath SO,110001,PO,Non Delivery,NA,NA,28.6250,77.2190',
        'Maharashtra Circle,Mumbai Region,Mumbai GPO,Mumbai G.P.O.,400001,HO,Delivery,MUMBAI,MAHARASHTRA,18.9398,72.8355',
        'Chattisgarh Circle,Raipur Region,Bastar Division,Gumodhi B.O,494111,BO,Delivery,NA,NA,NA,NA',
      ].join('\n')
    );
  });

  it('loads the PIN directory, filling "NA" locations and skipping unplaceable offices', async () => {
    const obs = await runSyncJob(createConnector('india-post-pincode-directory', { file: csv }));
    expect(obs.status).toBe('success');
    expect(await prisma.postOffice.count()).toBe(3);
    expect(await prisma.postOffice.findUnique({ where: { id: '110001:janpath-so' } })).toMatchObject({ district: 'New Delhi', state: 'Delhi' });
    const pin = await prisma.pincode.findUnique({ where: { code: '110001' } });
    expect(pin).toMatchObject({ district: 'New Delhi', state: 'Delhi', region: 'NORTH' });
    expect(pin?.lat).toBeCloseTo(28.628, 2);
    expect(await prisma.source.findUnique({ where: { sourceId: 'india-post-pincode-directory' } })).toMatchObject({ status: 'active' });
  });

  it('skips an identical download, and re-writes it when forced', async () => {
    const again = await runSyncJob(createConnector('india-post-pincode-directory', { file: csv }));
    expect(again.log.some((l) => /identical to the last successful sync/.test(l))).toBe(true);
    const forced = await runSyncJob(createConnector('india-post-pincode-directory', { file: csv }), { force: true });
    expect(forced.recordsUpdated).toBe(3);
  });

  it('loads CPCB readings and matches each station to its nearest PIN', async () => {
    const fixture = path.join(__dirname, '../jobs/__fixtures__/cpcb-aqi.fixture.json');
    const obs = await runSyncJob(createConnector('cpcb-realtime-aqi', { file: fixture }));
    expect(obs.status).toBe('success');
    expect(await prisma.airReading.count()).toBe(12);
    const stations = await prisma.airStation.findMany({ orderBy: { id: 'asc' }, select: { id: true, nearestPin: true } });
    expect(stations).toEqual([
      { id: 'delhi-delhi-anand-vihar-delhi-dpcc', nearestPin: '110001' },
      { id: 'delhi-delhi-ito-delhi-cpcb', nearestPin: '110001' },
      { id: 'maharashtra-mumbai-colaba-mumbai-mpcb', nearestPin: '400001' },
    ]);
  });

  it('marks a connector without its API key as not configured and leaves data alone', async () => {
    const before = process.env.DATA_GOV_IN_API_KEY;
    delete process.env.DATA_GOV_IN_API_KEY;
    const obs = await runSyncJob(createConnector('cpcb-realtime-aqi'));
    process.env.DATA_GOV_IN_API_KEY = before;
    expect(obs.status).toBe('failed');
    expect(await prisma.source.findUnique({ where: { sourceId: 'cpcb-realtime-aqi' } })).toMatchObject({ status: 'not_configured' });
    expect(await prisma.airReading.count()).toBe(12);
  });
});
