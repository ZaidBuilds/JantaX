import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';

type Row = Record<string, string | number | boolean | Date | null>;

/**
 * INSERT ... ON CONFLICT DO UPDATE in chunks. Per-row Prisma upserts take minutes for the
 * 165,000-office PIN directory; one statement per chunk takes seconds.
 */
export async function bulkUpsert(table: string, rows: Row[], opts: { conflict: string[]; chunkSize?: number; touchUpdatedAt?: boolean; casts?: Record<string, string>; keep?: string[] }): Promise<number> {
  if (!rows.length) return 0;
  const cols = Object.keys(rows[0]);
  if (opts.touchUpdatedAt && !cols.includes('updatedAt')) cols.push('updatedAt');
  const q = (c: string) => `"${c.replace(/"/g, '""')}"`;
  const updates = cols.filter((c) => !opts.conflict.includes(c) && !opts.keep?.includes(c)).map((c) => `${q(c)} = EXCLUDED.${q(c)}`);
  const size = opts.chunkSize ?? 2000;
  let written = 0;

  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const now = new Date();
    const values = chunk.map(
      (r) =>
        Prisma.sql`(${Prisma.join(
          cols.map((c) => {
            const v = c === 'updatedAt' && opts.touchUpdatedAt ? now : r[c] ?? null;
            // Enum columns need an explicit cast from the text parameter, e.g. { region: '"Region"' }.
            return opts.casts?.[c] ? Prisma.sql`${v}::${Prisma.raw(opts.casts[c])}` : Prisma.sql`${v}`;
          })
        )})`
    );
    written += await prisma.$executeRaw`
      INSERT INTO ${Prisma.raw(q(table))} (${Prisma.raw(cols.map(q).join(', '))})
      VALUES ${Prisma.join(values)}
      ON CONFLICT (${Prisma.raw(opts.conflict.map(q).join(', '))})
      DO ${Prisma.raw(updates.length ? `UPDATE SET ${updates.join(', ')}` : 'NOTHING')}`;
  }
  return written;
}
