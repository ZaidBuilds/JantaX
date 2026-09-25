/**
 * Data pipeline CLI.
 *
 *   npm run data -- sources
 *   npm run data -- sync <sourceId> [--file path] [--force] [--dry-run] [--max N]
 *   npm run data -- export-pins [--out public/data/pins] [--via "how the data was obtained"]
 */
import 'dotenv/config';
import { prisma } from '../prisma';
import { createConnector, CONNECTORS } from '../jobs/registry';
import { runSyncJob } from '../jobs/syncEngine';
import { nextRunAt } from '../jobs/scheduler';
import { exportPinChunks } from '../jobs/exportPins';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);

  if (cmd === 'sources' || !cmd) {
    for (const id of Object.keys(CONNECTORS)) {
      const c = createConnector(id);
      const row = await prisma.source.findUnique({ where: { sourceId: id } }).catch(() => null);
      console.log(`${id}
  schedule      ${c.schedule} (next ${nextRunAt(c.schedule)?.toISOString() ?? 'n/a'})
  config        ${c.missingConfig?.() ?? 'ok'}
  status        ${row?.status ?? 'not yet run'}${row?.lastSuccessfulSync ? `, last sync ${row.lastSuccessfulSync.toISOString()}` : ''}`);
    }
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
