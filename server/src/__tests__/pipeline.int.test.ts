// @vitest-environment node
/**
 * Runs the connectors and a catalogued dataset through the real sync engine against Postgres.
 * Opt-in: set TEST_DATABASE_URL to a migrated database this test may write to (CI does).
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

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
    for (const sourceId of ['india-post-pincode-directory', 'cpcb-realtime-aqi', 'jjm-district-coverage', 'lgd-districts', 'cppp-awards']) {
      const raws = await prisma.rawDocument.findMany({ where: { sourceId }, select: { id: true } });
      const parsed = await prisma.parsedDocument.findMany({ where: { rawDocumentId: { in: raws.map((r) => r.id) } }, select: { id: true } });
      await prisma.validationResult.deleteMany({ where: { parsedDocumentId: { in: parsed.map((p) => p.id) } } });
      await prisma.parsedDocument.deleteMany({ where: { id: { in: parsed.map((p) => p.id) } } });
      await prisma.rawDocument.deleteMany({ where: { sourceId } });
    }
    await prisma.datasetRecord.deleteMany();
    await prisma.districtAlias.deleteMany();
    await prisma.district.deleteMany();
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

  it('builds the district spine from the PIN directory', async () => {
    expect(await prisma.district.findMany({ orderBy: { id: 'asc' }, select: { id: true, pinCount: true } })).toEqual([
      { id: 'delhi:new-delhi', pinCount: 1 },
      { id: 'maharashtra:mumbai', pinCount: 1 },
    ]);
    expect(await prisma.pincode.findUnique({ where: { code: '400001' }, select: { districtId: true } })).toEqual({ districtId: 'maharashtra:mumbai' });
  });

  describe('catalogued dataset (Jal Jeevan Mission, synthetic figures)', () => {
    const write = (name: string, lines: string[]) => {
      const file = path.join(dir, name);
      fs.writeFileSync(file, lines.join('\n'));
      return file;
    };
    const header = 'State Name,District Name,Total Rural Households,Households with Tap Connection,% Coverage,As on Date';
    const records = () => prisma.datasetRecord.findMany({ where: { datasetId: 'jjm-district-coverage' }, orderBy: { entityKey: 'asc' } });

    it('stores rows with their place resolved and provenance recorded', async () => {
      const file = write('jjm.csv', [
        'District-wise household tap connections (synthetic test data)',
        header,
        'NCT of Delhi,New Delhi District,1000,900,90%,31/03/2024',
        'MAHARASHTRA,Mumbai,2000,1500,75,31/03/2024',
        'Maharashtra,Pune,3000,2400,80,31/03/2024',
      ]);
      const obs = await runSyncJob(createConnector('jjm-district-coverage', { file }));
      expect(obs.status).toBe('success');
      const rows = await records();
      expect(rows.map((r) => [r.entityKey, r.state, r.districtId])).toEqual([
        ['Delhi|delhi:new-delhi', 'Delhi', 'delhi:new-delhi'],
        ['Maharashtra|maharashtra:mumbai', 'Maharashtra', 'maharashtra:mumbai'],
        ['Maharashtra|pune', 'Maharashtra', null],
      ]);
      expect(rows[1].data).toMatchObject({ state: 'MAHARASHTRA', households: 2000, tapConnections: 1500, coveragePct: 75, asOn: '2024-03-31' });
      expect(rows[1].observedAt?.toISOString()).toBe('2024-03-31T00:00:00.000Z');
      expect(await prisma.source.findUnique({ where: { sourceId: 'jjm-district-coverage' } })).toMatchObject({
        status: 'active',
        organization: 'Department of Drinking Water and Sanitation',
        license: expect.stringContaining('GODL'),
      });
      expect(obs.log.some((l) => /Only 2 of 3 rows matched a district/.test(l))).toBe(true);
    });

    it('updates the same rows when a release spells places differently', async () => {
      const respelt = write('jjm-respelt.csv', [header, 'Delhi,New Delhi,1000,950,95,30/04/2024', 'Maharashtra,MUMBAI ,2000,1600,80,30/04/2024', 'maharashtra,Pune,3000,2500,83,30/04/2024']);
      const obs = await runSyncJob(createConnector('jjm-district-coverage', { file: respelt }));
      expect(obs).toMatchObject({ status: 'success', recordsInserted: 0, recordsUpdated: 3, recordsDeleted: 0 });
      expect((await records()).map((r) => r.data)).toMatchObject([{ coveragePct: 95 }, { coveragePct: 80 }, { coveragePct: 83 }]);
    });

    it('keeps rows when a snapshot looks partial, and replaces them when it is complete', async () => {
      const partial = write('jjm-partial.csv', [header, 'Delhi,New Delhi,1000,960,96,31/05/2024']);
      await runSyncJob(createConnector('jjm-district-coverage', { file: partial }));
      expect(await records()).toHaveLength(3);

      const full = write('jjm-full.csv', [header, 'Delhi,New Delhi,1000,960,96,31/05/2024', 'Maharashtra,Mumbai,2000,1700,85,31/05/2024', 'Maharashtra,Thane,3000,2500,83,31/05/2024']);
      const obs = await runSyncJob(createConnector('jjm-district-coverage', { file: full }));
      expect(obs).toMatchObject({ status: 'success', recordsInserted: 1, recordsUpdated: 2, recordsDeleted: 1 });
      expect((await records()).map((r) => r.entityKey)).toEqual(['Delhi|delhi:new-delhi', 'Maharashtra|maharashtra:mumbai', 'Maharashtra|thane']);
    });

    it('rejects a file without a required column and keeps the published rows', async () => {
      const bad = write('jjm-bad.csv', ['State Name,District Name,Coverage', 'Delhi,New Delhi,95']);
      const obs = await runSyncJob(createConnector('jjm-district-coverage', { file: bad }));
      expect(obs.status).toBe('failed');
      expect(obs.log.join('\n')).toMatch(/Columns not found for households/);
      expect(await records()).toHaveLength(3);
    });

    it('attaches LGD codes to the spine and remembers other spellings', async () => {
      const file = write('lgd.csv', [
        'District Code,District Name (In English),State Code,State Name (In English)',
        '90001,New Delhi,7,Delhi',
        '90002,Bombay City,27,Maharashtra',
        '90003,Mumbay,27,Maharashtra',
      ]);
      const obs = await runSyncJob(createConnector('lgd-districts', { file }));
      expect(obs.status).toBe('success');
      expect(await prisma.district.findMany({ orderBy: { id: 'asc' }, select: { id: true, lgdCode: true } })).toEqual([
        { id: 'delhi:new-delhi', lgdCode: 90001 },
        { id: 'maharashtra:mumbai', lgdCode: 90003 },
      ]);
      expect(await prisma.districtAlias.findMany({ select: { key: true, districtId: true, source: true } })).toEqual([
        { key: 'maharashtra:mumbay', districtId: 'maharashtra:mumbai', source: 'lgd' },
      ]);
    });
  });

  describe('data API', () => {
    let base = '';
    let close: () => void = () => undefined;
    let adminToken = '';

    beforeAll(async () => {
      const express = (await import('express')).default;
      const { requireAuth, signToken } = await import('../middleware/auth');
      const dataRoutes = (await import('../routes/data')).default;
      const app = express();
      app.use(requireAuth);
      app.use(express.json());
      app.use('/api', dataRoutes);
      const server = app.listen(0);
      await new Promise((r) => server.once('listening', r));
      base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api`;
      close = () => server.close();
      adminToken = signToken({ id: 'test-admin', email: 'admin@test.invalid', role: 'ADMIN' });
    });
    afterAll(() => close());

    const get = async (p: string) => {
      const res = await fetch(base + p);
      return { status: res.status, cache: res.headers.get('cache-control'), body: (await res.json()) as any };
    };

    it('lists the catalog with each dataset\'s state', async () => {
      const { status, cache, body } = await get('/data/catalog?module=utility');
      expect(status).toBe(200);
      expect(cache).toMatch(/max-age=60/);
      const jjm = body.datasets.find((d: any) => d.id === 'jjm-district-coverage');
      // The last upload (the file missing a column) failed: still serving the published rows, and saying why.
      expect(jjm).toMatchObject({ state: 'failing', rows: 3, publisher: 'Department of Drinking Water and Sanitation', lastError: expect.stringMatching(/Columns not found/) });
      expect(jjm.columns[0]).toEqual({ id: 'households', label: 'Rural households', type: 'int', unit: null });
      expect(body.datasets.find((d: any) => d.id === 'power-supply-hours')).toMatchObject({ state: expect.stringMatching(/needs-setting|ready/), rows: 0 });
      const all = (await get('/data/catalog')).body;
      expect(all.feeds.find((f: any) => f.id === 'india-post-pincode-directory')).toMatchObject({ state: 'live', rows: 3, publisher: 'Department of Posts' });
    });

    it('serves a PIN its district\'s rows, with provenance', async () => {
      const { body } = await get('/data/jjm-district-coverage?pin=110001');
      expect(body).toMatchObject({ matched: 'district', total: 1, scope: { level: 'pincode', districtId: 'delhi:new-delhi' } });
      expect(body.rows[0]).toMatchObject({ coveragePct: 96, _place: { districtId: 'delhi:new-delhi' } });
      expect(body.dataset.source).toMatchObject({ publisher: 'Department of Drinking Water and Sanitation', license: expect.stringContaining('GODL') });
      expect((await get('/data/jjm-district-coverage?state=MAHARASHTRA')).body).toMatchObject({ matched: 'state', total: 2 });
    });

    it('rejects bad input', async () => {
      expect((await get('/data/nope')).status).toBe(404);
      expect((await get('/data/jjm-district-coverage?pin=12')).status).toBe(400);
      expect((await get('/data/jjm-district-coverage?pin=999999')).status).toBe(404);
      expect((await get('/data/jjm-district-coverage?state=Atlantis')).status).toBe(400);
    });

    it('gathers everything known for a PIN', async () => {
      const { body } = await get('/area/110001?module=utility');
      expect(body.place).toMatchObject({ district: 'New Delhi', districtId: 'delhi:new-delhi', state: 'Delhi', lgdCode: 90001 });
      const byId = Object.fromEntries(body.datasets.map((d: any) => [d.id, d]));
      expect(byId['jjm-district-coverage']).toMatchObject({ matched: 'district', total: 1, status: 'failing' });
      expect(byId['power-supply-hours']).toMatchObject({ matched: 'none', rows: [], missing: expect.any(String) });
    });

    it('imports an uploaded file for admins only', async () => {
      const csv = [
        'tenderId,title,organisation,contractor,awardValue,awardDate,state,district,sourceUrl',
        'TEST/2024/1,Resurfacing (synthetic),Test PWD,Example Builders,1200000,15/01/2024,Delhi,New Delhi,https://example.invalid/aoc/1',
      ].join('\n');
      const post = (q: string, token?: string) =>
        fetch(`${base}/admin/data/cppp-awards/import${q}`, { method: 'POST', body: csv, headers: { 'content-type': 'text/csv', ...(token ? { authorization: `Bearer ${token}` } : {}) } });
      expect((await post('')).status).toBe(401);
      const dry = await post('?dryRun=1', adminToken);
      expect(await dry.json()).toMatchObject({ rows: 1, keyed: 1, placed: 1, missingRequired: [] });
      expect(await prisma.datasetRecord.count({ where: { datasetId: 'cppp-awards' } })).toBe(0);
      const real = await post('', adminToken);
      expect(real.status).toBe(200);
      const { body } = await get('/data/cppp-awards?pin=110001');
      expect(body.rows[0]).toMatchObject({ contractor: 'Example Builders', awardValue: 1200000, awardDate: '2024-01-15' });
    });
  });

  it('never lets a new account choose its own role', async () => {
    const express = (await import('express')).default;
    const authRoutes = (await import('../routes/auth')).default;
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    const server = app.listen(0);
    await new Promise((r) => server.once('listening', r));
    const email = `role-test-${Date.now()}@test.invalid`;
    try {
      const res = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password: 'long-enough-password', role: 'ADMIN' }),
      });
      expect(res.status).toBe(201);
      expect(((await res.json()) as { user: { role: string } }).user.role).toBe('CITIZEN');
    } finally {
      server.close();
      await prisma.user.deleteMany({ where: { email } });
    }
  });
});
