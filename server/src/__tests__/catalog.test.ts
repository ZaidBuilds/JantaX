// @vitest-environment node
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { CATALOG } from '../data/catalog';
import { accessSetting } from '../data/spec';
import { GeoResolver, canonicalState, districtId, districtKey, districtTokenKey } from '../data/geography';
import { convert, matchColumns, parseDate } from '../data/fields';
import { decodeRows, findHeaderRow, formatOf } from '../data/decode';
import { mapRow, missingSetting, toDatasetRow } from '../data/datasetConnector';
import { inspectRows } from '../data/inspect';
import { catalogMarkdown, templateCsv, templatePath } from '../data/templates';
import { MODULE_GROUPS } from '../../../src/ui/modules';

const root = path.resolve(__dirname, '../../..');
const fixture = (name: string) => fs.readFileSync(path.join(__dirname, 'fixtures', name));

// A slice of the spine with the spellings India Post really uses.
const SPINE = [
  ['Odisha', 'Khordha'],
  ['Haryana', 'Gurugram'],
  ['Karnataka', 'Bengaluru Urban'],
  ['Uttar Pradesh', 'Prayagraj'],
  ['West Bengal', '24 Paraganas North'],
  ['West Bengal', '24 Paraganas South'],
  ['West Bengal', 'Medinipur West'],
  ['West Bengal', 'Maldah'],
  ['Assam', 'Kamrup'],
  ['Assam', 'Kamrup Metro'],
  ['Telangana', 'Kumuram Bheem Asifabad'],
  ['Tamil Nadu', 'Tirunelveli'],
  ['Delhi', 'New Delhi'],
  ['Maharashtra', 'Mumbai'],
].map(([state, name]) => ({ id: districtId(state, name), name, state }));
const geo = new GeoResolver(SPINE);

describe('dataset catalog', () => {
  const uiModules = new Set(MODULE_GROUPS.flatMap((g) => g.modules));

  it('has unique ids and settings', () => {
    const ids = CATALOG.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const settings = CATALOG.map(accessSetting).filter(Boolean);
    expect(new Set(settings).size).toBe(settings.length);
    for (const s of settings) expect(s).toMatch(/^[A-Z][A-Z0-9_]+$/);
  });

  it('gives every module screen at least one official dataset', () => {
    const covered = new Set(CATALOG.map((s) => s.module));
    // Pollution is served by the CPCB air quality connector.
    const missing = [...uiModules].filter((m) => m !== 'pollution' && !covered.has(m));
    expect(missing).toEqual([]);
  });

  it.each(CATALOG.map((s) => [s.id, s] as const))('%s is internally consistent', (_id, spec) => {
    const fields = Object.keys(spec.fields);
    expect(spec.module === 'geography' || uiModules.has(spec.module)).toBe(true);
    for (const k of spec.key) expect(fields).toContain(k);
    for (const f of Object.values(spec.geo ?? {})) expect(fields).toContain(f);
    if (spec.period) expect(fields).toContain(spec.period);
    for (const c of spec.show.columns) expect(fields).toContain(c);
    if (spec.show.sort) expect(fields).toContain(spec.show.sort.field);
    expect(spec.sourceUrl).toMatch(/^https:\/\//);
    expect(spec.attribution.length).toBeGreaterThan(10);

    // Place fields match the level the dataset claims.
    if (spec.level === 'district') expect(spec.geo?.district).toBeTruthy();
    if (spec.level === 'pincode') expect(spec.geo?.pincode).toBeTruthy();
    if (spec.level === 'point') expect(spec.geo?.latlng || (spec.geo?.lat && spec.geo?.lng)).toBeTruthy();
    if (spec.level !== 'national') expect(spec.geo?.state).toBeTruthy();

    // No column name is claimed by two fields.
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const seen = new Map<string, string>();
    for (const [id, f] of Object.entries(spec.fields)) {
      for (const name of new Set([id, ...f.from].map(norm))) {
        expect(seen.get(name) ?? id, `"${name}" is used by ${seen.get(name)} and ${id}`).toBe(id);
        seen.set(name, id);
      }
    }

    // Hand-compiled datasets must say where each row came from.
    if (spec.access.kind === 'file') {
      expect(spec.access.template).toBe(`data/templates/${spec.id}.csv`);
      if (['cag-audit-findings', 'cppp-awards', 'ward-services', 'candidate-affidavits'].includes(spec.id)) {
        expect(spec.fields.sourceUrl?.required).toBe(true);
      }
    }
  });

  it('ships import templates and docs that match the specs (npm run data -- templates)', () => {
    for (const spec of CATALOG) {
      expect(fs.readFileSync(path.join(root, templatePath(spec)), 'utf8'), templatePath(spec)).toBe(templateCsv(spec));
    }
    expect(fs.readFileSync(path.join(root, 'docs/DATASETS.md'), 'utf8')).toBe(catalogMarkdown(CATALOG));
  });

  it('lists every dataset setting in .env.example and the data-sync workflow', () => {
    const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
    const workflow = fs.readFileSync(path.join(root, '.github/workflows/data-sync.yml'), 'utf8');
    for (const setting of CATALOG.map(accessSetting).filter(Boolean) as string[]) {
      expect(env, `.env.example lacks ${setting}`).toMatch(new RegExp(`^${setting}=`, 'm'));
      expect(workflow, `data-sync.yml lacks ${setting}`).toContain(`${setting}: \${{ vars.${setting} }}`);
    }
    for (const spec of CATALOG.filter((s) => s.access.kind === 'file')) expect(env).toContain(spec.id);
  });

  it('says what is missing before a dataset can sync', () => {
    const byKind = (k: string) => CATALOG.find((s) => s.access.kind === k)!;
    const saved = { key: process.env.DATA_GOV_IN_API_KEY };
    delete process.env.DATA_GOV_IN_API_KEY;
    expect(missingSetting(byKind('ogd'))).toMatch(/DATA_GOV_IN_API_KEY/);
    expect(missingSetting(byKind('file'))).toMatch(/--file/);
    expect(missingSetting(byKind('file'), { file: 'x.csv' })).toBeNull();
    expect(missingSetting(byKind('ckan'))).toMatch(/OBI_STATE_BUDGET_RESOURCE/);
    process.env.DATA_GOV_IN_API_KEY = 'test-key';
    const ogd = byKind('ogd');
    expect(missingSetting(ogd)).toMatch(new RegExp(accessSetting(ogd)!));
    if (saved.key === undefined) delete process.env.DATA_GOV_IN_API_KEY;
    else process.env.DATA_GOV_IN_API_KEY = saved.key;
  });
});

describe('geography spine', () => {
  const at = (state: string | null, district: string) => {
    const r = geo.resolve(state, district);
    return r.level === 'district' ? r.districtId : r.level;
  };

  it('canonicalises state names', () => {
    expect(canonicalState('ORISSA')).toBe('Odisha');
    expect(canonicalState('NCT of Delhi')).toBe('Delhi');
    expect(canonicalState('Pondicherry')).toBe('Puducherry');
    expect(canonicalState('Atlantis')).toBeNull();
  });

  it('matches renamed, reordered and misspelt districts', () => {
    expect(at('Orissa', 'KHORDHA')).toBe('odisha:khordha');
    expect(at('Haryana', 'Gurgaon')).toBe('haryana:gurugram');
    expect(at('Karnataka', 'Bangalore Urban')).toBe('karnataka:bengaluru-urban');
    expect(at('Uttar Pradesh', 'Allahabad')).toBe('uttar-pradesh:prayagraj');
    expect(at('West Bengal', 'North 24 Parganas')).toBe('west-bengal:24-paraganas-north');
    expect(at('West Bengal', 'Dakshin 24 Parganas')).toBe('west-bengal:24-paraganas-south');
    expect(at('West Bengal', 'Paschim Medinipur')).toBe('west-bengal:medinipur-west');
    expect(at('West Bengal', 'Malda')).toBe('west-bengal:maldah');
    expect(at('Tamil Nadu', 'Tirunelvelli')).toBe('tamil-nadu:tirunelveli');
    expect(at('Delhi', 'New Delhi District')).toBe('delhi:new-delhi');
  });

  it('keeps look-alike districts apart and refuses to guess', () => {
    expect(at('Assam', 'Kamrup')).toBe('assam:kamrup');
    expect(at('Assam', 'Kamrup Metropolitan')).toBe('assam:kamrup-metro');
    expect(at('Haryana', 'Faridabad')).toBe('state');
    expect(at(null, 'Nowhere')).toBe('none');
  });

  it('recovers a missing state from a unique district name', () => {
    expect(geo.resolve('', 'Kumuram Bheem Asifabad')).toMatchObject({ state: 'Telangana', districtId: 'telangana:kumuram-bheem-asifabad' });
  });

  it('uses stored aliases first', () => {
    const withAlias = new GeoResolver(SPINE, [{ key: 'maharashtra:bombay', districtId: 'maharashtra:mumbai' }]);
    expect(withAlias.resolve('Maharashtra', 'Bombay')).toMatchObject({ districtId: 'maharashtra:mumbai', match: 'alias' });
  });

  it('builds word-order-free keys', () => {
    expect(districtTokenKey('24 Paraganas North')).toBe(districtTokenKey('Uttar 24 Paraganas'));
    expect(districtTokenKey('Dinajpur Dakshin')).toBe(districtTokenKey('South Dinajpur'));
    expect(districtKey('Gurgaon')).toBe(districtKey('Gurugram'));
  });
});

describe('field parsing', () => {
  it('reads Indian date formats', () => {
    expect(parseDate('2024-03-31T00:00:00')).toBe('2024-03-31');
    expect(parseDate('31/03/2024')).toBe('2024-03-31');
    expect(parseDate('5-4-2024')).toBe('2024-04-05');
    expect(parseDate('31 Mar 2024')).toBe('2024-03-31');
    expect(parseDate('March, 2024')).toBe('2024-03');
    expect(parseDate('45382')).toBe('2024-03-31');
    expect(parseDate('FY 2023-24')).toBeNull();
  });

  it('converts values and flags unreadable ones', () => {
    expect(convert('1,23,456', 'int')).toBe(123456);
    expect(convert('₹ 12.5', 'number')).toBe(12.5);
    expect(convert('Rs. 1,200', 'number')).toBe(1200);
    expect(convert('87.3%', 'percent')).toBe(87.3);
    expect(convert('NA', 'int')).toBeNull();
    expect(convert('', 'text')).toBeNull();
    expect(convert('lots', 'int')).toBeUndefined();
    expect(convert('Near bus stand, 560001', 'pincode')).toBe('560001');
    expect(convert('Functional', 'bool')).toBe(true);
    expect(convert('eprocure.gov.in', 'url')).toBeUndefined();
  });

  it('maps columns by alias, ignoring case and punctuation, one column per field', () => {
    const fields = {
      state: { from: ['state name'], type: 'text' as const, label: 'State' },
      spent: { from: ['expenditure'], type: 'number' as const, label: 'Spent' },
      total: { from: ['expenditure', 'total'], type: 'number' as const, label: 'Total' },
    };
    const r = matchColumns(['STATE_NAME', 'Expenditure', 'Remarks'], fields);
    expect(r.mapped).toEqual({ state: 'STATE_NAME', spent: 'Expenditure' });
    expect(r.missing).toEqual(['total']);
    expect(r.unused).toEqual(['Remarks']);
  });
});

describe('decoding downloads', () => {
  it('detects formats', () => {
    expect(formatOf('data.xlsx')).toBe('xlsx');
    expect(formatOf('text/csv')).toBe('csv');
    expect(formatOf('application/json')).toBe('json');
  });

  it('skips title rows above the header', () => {
    expect(findHeaderRow([['Table 4.2 District wise'], [], ['State', 'District', 'Total'], ['Bihar', 'Patna', 12]])).toBe(2);
    expect(findHeaderRow([['State', 'District'], ['Bihar', 'Patna']])).toBe(0);
  });

  it('reads CSV with a preamble and footnote', async () => {
    const csv = 'District wise PHCs (synthetic)\n\nState,District,PHCs\nBihar,Patna,40\nNote: provisional,,\n';
    expect(await decodeRows(Buffer.from(csv), 'csv')).toEqual([{ State: 'Bihar', District: 'Patna', PHCs: '40' }]);
  });

  it('reads data.gov.in, CKAN and plain JSON shapes', async () => {
    const rec = [{ a: 1 }];
    for (const body of [rec, { records: rec }, { result: { records: rec } }, { data: rec }]) {
      expect(await decodeRows(Buffer.from(JSON.stringify(body)), 'json')).toEqual(rec);
    }
    await expect(decodeRows(Buffer.from('{"x":1}'), 'json')).rejects.toThrow(/no records/);
  });

  it('reads a government-style XLSX with a title row and footnote', async () => {
    const rows = await decodeRows(fixture('synthetic-udise-district.xlsx'), 'xlsx');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ 'State Name': 'Orissa', 'District Name': 'Khordha', 'Total Teachers': '14,210' });
  });
});

describe('dataset rows', () => {
  const udise = CATALOG.find((s) => s.id === 'udise-district-schools')!;

  it('inspects a file against its spec without storing anything', async () => {
    const rows = await decodeRows(fixture('synthetic-udise-district.xlsx'), 'xlsx');
    const r = inspectRows(udise, rows, geo);
    expect(r).toMatchObject({ rows: 3, keyed: 3, placed: 3, missingRequired: [], unused: ['Sl. No.'] });
    expect(r.mapped).toMatchObject({ state: 'State Name', district: 'District Name', totalSchools: 'Total Schools', teachers: 'Total Teachers' });
    expect(r.sample.map((s) => s._districtId)).toEqual(['odisha:khordha', 'haryana:gurugram', 'west-bengal:medinipur-west']);
    expect(r.sample[1].girlsToilet).toBeNull();
  });

  it('reports required columns a file lacks', () => {
    // Year is part of the row key, so a file without it cannot be stored.
    const r = inspectRows(udise, [{ State: 'Bihar', District: 'Patna' }], geo);
    expect(r.missingRequired).toEqual(['year', 'totalSchools']);
    expect(r.keyed).toBe(0);
  });

  it('builds stable ids, resolves place and period, and drops rows without a key', () => {
    const cols = { state: 'State', district: 'District', year: 'Year', totalSchools: 'Schools' };
    const row = (o: Record<string, string>) => toDatasetRow(udise, mapRow(udise, cols, o).values, geo, new Map());
    const a = row({ State: 'Orissa', District: 'Khordha', Year: '2023-24', Schools: '10' })!;
    const b = row({ State: 'Orissa', District: 'Khordha', Year: '2023-24', Schools: '11' })!;
    expect(a.id).toBe(b.id);
    expect(a).toMatchObject({ state: 'Odisha', districtId: 'odisha:khordha', period: '2023-24', observedAt: null });
    expect(row({ State: 'Orissa', District: '', Year: '2023-24', Schools: '10' })).toBeNull();
  });

  it('dates rows only from date-typed periods', () => {
    const jjm = CATALOG.find((s) => s.id === 'jjm-district-coverage')!;
    const cols = { state: 'State', district: 'District', households: 'HH', asOn: 'As on' };
    const r = toDatasetRow(jjm, mapRow(jjm, cols, { State: 'Delhi', District: 'New Delhi', HH: '5', 'As on': '31/03/2024' }).values, geo, new Map())!;
    expect(r.period).toBe('2024-03-31');
    expect(r.observedAt?.toISOString()).toBe('2024-03-31T00:00:00.000Z');
    const power = CATALOG.find((s) => s.id === 'power-supply-hours')!;
    const p = toDatasetRow(power, mapRow(power, { state: 'S', period: 'P' }, { S: 'Delhi', P: '2011-12' }).values, geo, new Map())!;
    expect(p).toMatchObject({ period: '2011-12', observedAt: null });
  });

  it('places PIN-level rows through the PIN directory and keeps coordinates only inside India', () => {
    const nhp = CATALOG.find((s) => s.id === 'nhp-hospital-directory')!;
    const cols = { name: 'n', address: 'a', state: 's', pincode: 'p', latlng: 'll' };
    const pins = new Map([['400001', { districtId: 'maharashtra:mumbai', state: 'Maharashtra' }]]);
    const r = toDatasetRow(nhp, mapRow(nhp, cols, { n: 'Test Hospital', a: 'Fort', s: 'Maharashtra', p: '400001', ll: '18.94, 72.83' }).values, geo, pins)!;
    expect(r).toMatchObject({ districtId: 'maharashtra:mumbai', pincode: '400001', lat: 18.94, lng: 72.83 });
    const far = toDatasetRow(nhp, mapRow(nhp, cols, { n: 'X', a: 'Y', s: 'Maharashtra', p: '', ll: '51.5, -0.12' }).values, geo, pins)!;
    expect(far).toMatchObject({ lat: null, lng: null, districtId: null, state: 'Maharashtra' });
  });
});
