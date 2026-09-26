/**
 * Data pipeline CLI.
 *
 *   npm run data -- sources                      custom connectors (PIN directory, air quality)
 *   npm run data -- datasets [--module id]       every catalogued dataset: state, rows, what is missing
 *   npm run data -- inspect <id> [--file path] [--max N]
 *                                                fetch or read a file and show how its columns map, without storing
 *   npm run data -- sync <id> [--file path] [--force] [--dry-run] [--max N]
 *   npm run data -- sync-all [--due] [--force]   run every source that has what it needs (--due: only those due)
 *   npm run data -- build-districts              rebuild the district spine from the PIN directory
 *   npm run data -- templates [--check]          write data/templates/*.csv and docs/DATASETS.md from the catalog
 *   npm run data -- export-pins [--out public/data/pins] [--via "how the data was obtained"]
 *   npm run data -- set-role <email> <ADMIN|MODERATOR|CITIZEN>
 *                                                admins can trigger syncs and upload files from the web
 */
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../prisma';
import { createConnector, CONNECTORS } from '../jobs/registry';
import { runSyncJob } from '../jobs/syncEngine';
import { nextRunAt } from '../jobs/scheduler';
import { exportPinChunks } from '../jobs/exportPins';
import type { Schedule } from '../jobs/connector';
import { CATALOG, SPECS } from '../data/catalog';
import { datasetStatuses } from '../data/status';
import { inspectRows } from '../data/inspect';
import { loadGeoResolver, buildDistrictsFromPins } from '../data/districts';
import { pinDistrictMap } from '../data/datasetConnector';
import { catalogMarkdown, templateCsv, templatePath } from '../data/templates';

/** Minimum age of the last success before a scheduled source is fetched again. File imports are never due. */
const DUE_AFTER_HOURS: Record<Schedule, number> = { hourly: 0.8, daily: 20, weekly: 6 * 24, monthly: 25 * 24, quarterly: 80 * 24, annual: 330 * 24, event: Infinity };
function isDue(schedule: Schedule, lastSuccess: Date | null, now = Date.now()) {
  if (schedule === 'event') return false;
  return !lastSuccess || now - lastSuccess.getTime() >= DUE_AFTER_HOURS[schedule] * 3600_000;
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);

  if (cmd === 'sources' || !cmd) {
    for (const id of Object.keys(CONNECTORS).filter((id) => !SPECS.has(id))) {
      const c = createConnector(id);
      const row = await prisma.source.findUnique({ where: { sourceId: id } }).catch(() => null);
      console.log(`${id}
  schedule      ${c.schedule} (next ${nextRunAt(c.schedule)?.toISOString() ?? 'n/a'})
  config        ${c.missingConfig?.() ?? 'ok'}
  status        ${row?.status ?? 'not yet run'}${row?.lastSuccessfulSync ? `, last sync ${row.lastSuccessfulSync.toISOString()}` : ''}`);
    }
    console.log(`\n${CATALOG.length} catalogued datasets: npm run data -- datasets`);
    return;
  }

  if (cmd === 'datasets') {
    const module = flag(args, 'module');
    const list = await datasetStatuses(module ? CATALOG.filter((s) => s.module === module) : CATALOG);
    for (const d of list) {
      console.log(`${d.id}  [${d.state}]  ${d.module} · ${d.level} · ${d.schedule}
  ${d.title}
  rows ${d.rows}${d.lastSync ? `, last sync ${d.lastSync}` : ''}${d.nextRun ? `, next ${d.nextRun}` : ''}${d.setting ? `\n  setting ${d.setting}` : ''}${d.missing ? `\n  needs   ${d.missing}` : ''}${d.lastError ? `\n  error   ${d.lastError}` : ''}`);
    }
    const by = list.reduce<Record<string, number>>((a, d) => ((a[d.state] = (a[d.state] ?? 0) + 1), a), {});
    console.log(`\n${list.length} datasets: ${Object.entries(by).map(([k, v]) => `${v} ${k}`).join(', ')}`);
    return;
  }

  if (cmd === 'inspect') {
    const id = args.find((a) => !a.startsWith('--') && a !== flag(args, 'file') && a !== flag(args, 'max'));
    const spec = id ? SPECS.get(id) : undefined;
    if (!spec) throw new Error(`Usage: inspect <dataset id> [--file path] [--max N]. Known: ${CATALOG.map((s) => s.id).join(', ')}`);
    const file = flag(args, 'file');
    const connector = createConnector(spec.id, { file, maxRecords: Number(flag(args, 'max') ?? 500) });
    const missing = connector.missingConfig?.();
    if (missing) throw new Error(missing);
    const fetched = await connector.fetch();
    const rows = await connector.parse(fetched.buffer, fetched.contentType);
    const r = inspectRows(spec, rows, await loadGeoResolver(), await pinDistrictMap(spec));
    const pct = (n: number) => (r.rows ? `${Math.round((n / r.rows) * 100)}%` : '0%');
    console.log(`${spec.id}: ${spec.title}
source    ${fetched.url} (${fetched.size} bytes${fetched.publishedAt ? `, published ${fetched.publishedAt}` : ''})
rows      ${r.rows} read, ${r.keyed} with a full key (${pct(r.keyed)}), ${r.placed} placed at ${spec.level} level (${pct(r.placed)})
columns   ${r.columns.join(' | ')}

mapped
${Object.entries(r.mapped).map(([f, c]) => `  ${f.padEnd(24)} <- ${c}`).join('\n') || '  (none)'}
${r.missingRequired.length ? `\nMISSING (required): ${r.missingRequired.join(', ')}\n  Add the column names to the spec's "from" list in server/src/data/catalog/, or rename them in the file.` : ''}${r.missingOptional.length ? `\nnot in file (optional): ${r.missingOptional.join(', ')}` : ''}${r.unused.length ? `\nunused columns: ${r.unused.join(', ')}` : ''}${Object.keys(r.unreadable).length ? `\nunreadable values: ${Object.entries(r.unreadable).map(([f, n]) => `${f} ×${n}`).join(', ')}` : ''}

sample
${JSON.stringify(r.sample, null, 2)}`);
    if (r.missingRequired.length) process.exitCode = 1;
    return;
  }

  if (cmd === 'sync-all') {
    // --due: only sources whose last success is older than their schedule (for an hourly cron).
    const dueOnly = args.includes('--due');
    const statuses = await datasetStatuses();
    const ids = [...Object.keys(CONNECTORS).filter((id) => !SPECS.has(id)), ...statuses.filter((d) => !d.missing).map((d) => d.id)];
    const last = new Map((await prisma.source.findMany({ where: { sourceId: { in: ids } }, select: { sourceId: true, lastSuccessfulSync: true } })).map((s) => [s.sourceId, s.lastSuccessfulSync]));
    let failed = 0;
    for (const id of ids) {
      const connector = createConnector(id);
      const missing = connector.missingConfig?.();
      if (missing) {
        console.log(`skip     ${id}: ${missing.split('. ')[0]}`);
        continue;
      }
      if (dueOnly && !isDue(connector.schedule, last.get(id) ?? null)) continue;
      const obs = await runSyncJob(connector, { force: args.includes('--force') });
      console.log(`${obs.status.padEnd(8)} ${id}  +${obs.recordsInserted} ~${obs.recordsUpdated} -${obs.recordsDeleted}${obs.status === 'failed' ? `  ${obs.log[obs.log.length - 1] ?? ''}` : ''}`);
      if (obs.status === 'failed') failed++;
    }
    const needsSetting = statuses.filter((d) => d.missing && d.access !== 'file').map((d) => d.id);
    const needsFile = statuses.filter((d) => d.missing && d.access === 'file').map((d) => d.id);
    if (needsSetting.length) console.log(`\nWaiting on a setting (${needsSetting.length}): ${needsSetting.join(', ')}`);
    if (needsFile.length) console.log(`File import only (${needsFile.length}): ${needsFile.join(', ')}`);
    if (needsSetting.length || needsFile.length) console.log('Details: npm run data -- datasets');
    if (failed) process.exitCode = 1;
    return;
  }

  if (cmd === 'build-districts') {
    const res = await buildDistrictsFromPins();
    console.log(`Built ${res.districts} districts from ${res.pins} PIN codes`);
    return;
  }

  if (cmd === 'templates') {
    const check = args.includes('--check');
    const files: [string, string][] = [
      ...CATALOG.map((s): [string, string] => [templatePath(s), templateCsv(s)]),
      ['docs/DATASETS.md', catalogMarkdown(CATALOG)],
    ];
    const stale: string[] = [];
    for (const [file, body] of files) {
      const current = await fs.readFile(file, 'utf8').catch(() => null);
      if (current === body) continue;
      if (check) stale.push(file);
      else {
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, body);
        console.log(`wrote ${file}`);
      }
    }
    if (check && stale.length) {
      console.error(`Out of date: ${stale.join(', ')}. Run: npm run data -- templates`);
      process.exitCode = 1;
    } else if (check) console.log(`${files.length} generated files are up to date`);
    return;
  }

  if (cmd === 'sync') {
    const id = args.find((a) => !a.startsWith('--') && a !== flag(args, 'file') && a !== flag(args, 'max'));
    if (!id) throw new Error('Usage: sync <sourceId> [--file path] [--force] [--dry-run] [--max N]');
    const max = flag(args, 'max');
    const connector = createConnector(id, { file: flag(args, 'file'), maxRecords: max ? Number(max) : undefined });

    if (args.includes('--dry-run')) {
      const missing = connector.missingConfig?.();
      if (missing) throw new Error(missing);
      const fetched = await connector.fetch();
      const rows = await connector.parse(fetched.buffer, fetched.contentType);
      const validation = await connector.validate(fetched.buffer, fetched.contentType);
      const entities = await connector.normalize(rows);
      console.log(JSON.stringify({
        url: fetched.url,
        bytes: fetched.size,
        rows: rows.length,
        entities: entities.length,
        valid: validation.isValid,
        errors: validation.errors.slice(0, 5),
        warnings: validation.warnings.slice(0, 5),
        sample: entities.slice(0, 3).map((e) => e.data),
      }, null, 2));
      return;
    }

    const obs = await runSyncJob(connector, { force: args.includes('--force') });
    console.log(JSON.stringify({ ...obs, log: undefined }, null, 2));
    if (obs.status === 'failed') process.exitCode = 1;
    return;
  }

  if (cmd === 'set-role') {
    const [email, role] = args;
    if (!email || !['ADMIN', 'MODERATOR', 'CITIZEN'].includes(role)) throw new Error('Usage: set-role <email> <ADMIN|MODERATOR|CITIZEN>');
    const user = await prisma.user.update({ where: { email }, data: { role: role as 'ADMIN' | 'MODERATOR' | 'CITIZEN' } }).catch(() => null);
    if (!user) throw new Error(`No account for ${email}. Register it in the app first.`);
    console.log(`${user.email} is now ${user.role}. Sign in again to get a token with the new role.`);
    return;
  }

  if (cmd === 'export-pins') {
    const out = flag(args, 'out') || 'public/data/pins';
    const res = await exportPinChunks(out, flag(args, 'via'));
    console.log(`Wrote ${res.pins} PINs (${res.offices} offices) into ${res.files} files under ${out}`);
    return;
  }

  throw new Error(`Unknown command "${cmd}"`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
