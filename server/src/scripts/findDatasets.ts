#!/usr/bin/env tsx
/**
 * Search the data.gov.in catalog for resource IDs.
 *
 * Usage:
 *   npm run data:find -- "air quality" "PMGSY"
 *   npm run data:find -- "hospital" --live          (only datasets updated in last 30 days)
 *   npm run data:find -- --probe <resource-id> district_name=Meerut
 */

import 'dotenv/config';
import { fetchOgdById, ogdKey } from '../connectors/ogdClient';

interface CatalogRecord {
  index_name: string;
  title: string;
  org?: string[];
  updated_date?: string;
}

const args = process.argv.slice(2);
const liveOnly = args.includes('--live');
const probeIdx = args.indexOf('--probe');

async function search(term: string): Promise<void> {
  const u = new URL('https://api.data.gov.in/lists');
  u.searchParams.set('api-key', ogdKey());
  u.searchParams.set('format', 'json');
  u.searchParams.set('limit', '25');
  u.searchParams.set('filters[active]', '1');
  u.searchParams.set('notfilters[source]', 'visualize.data.gov.in');
  u.searchParams.set('filters[title]', term);
  u.searchParams.set('sort[updated]', 'desc');

  const res = await fetch(u, { signal: AbortSignal.timeout(30000) });
  const body = (await res.json()) as { total?: number; records?: CatalogRecord[] };
  const cutoff = Date.now() - 30 * 24 * 3600 * 1000;

  const rows = (body.records ?? []).filter(
    (r) => !liveOnly || (r.updated_date && Date.parse(r.updated_date) > cutoff),
  );

  console.log(`\n### "${term}" — ${rows.length} shown`);
  for (const r of rows) {
    const org = (r.org ?? []).slice(-1)[0] ?? '';
    console.log(`${r.index_name} | ${r.updated_date?.slice(0, 10) ?? '?'} | ${org} | ${r.title}`);
  }
}

async function probe(id: string, filterArgs: string[]): Promise<void> {
  const filters = Object.fromEntries(filterArgs.map((f) => f.split('=') as [string, string]));
  const r = await fetchOgdById(id, { filters, max: 3 });
  console.log(`\n=== ${r.title}`);
  console.log(`total=${r.total} updated=${r.updatedDate?.slice(0, 10)} sampleKey=${r.sampleKey}`);
  console.log('fields:', Object.keys(r.records[0] ?? {}).join(', '));
  for (const rec of r.records) console.log(JSON.stringify(rec));
}

async function main(): Promise<void> {
  if (probeIdx >= 0) {
    const id = args[probeIdx + 1];
    if (!id) throw new Error('--probe needs a resource id');
    await probe(id, args.slice(probeIdx + 2).filter((a) => a.includes('=')));
    return;
  }
  const terms = args.filter((a) => !a.startsWith('--'));
  if (terms.length === 0) {
    console.log('Usage: npm run data:find -- "<keyword>" [more keywords] [--live]');
    return;
  }
  for (const t of terms) await search(t);
}

main().catch((e: Error) => {
  console.error('❌', e.message);
  process.exit(1);
});
