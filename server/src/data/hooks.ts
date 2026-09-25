import { prisma } from '../prisma';
import { addDistrictAlias, loadGeoResolver } from './districts';
import type { DatasetSpec } from './spec';

interface SyncedRow {
  data: Record<string, unknown>;
}

/** Extra work some datasets do after their rows are stored. */
export async function runAfterSync(spec: DatasetSpec, rows: SyncedRow[]) {
  if (spec.id === 'lgd-districts') await applyLgdCodes(rows);
}

/**
 * Attach official LGD district codes to the spine, and keep LGD's spelling as an alias whenever it
 * differs from India Post's. LGD districts the directory does not have yet are reported, not guessed.
 */
async function applyLgdCodes(rows: SyncedRow[]) {
  const geo = await loadGeoResolver();
  const linkedDistricts = new Set<string>();
  const unmatched: string[] = [];
  let aliases = 0;
  for (const { data } of rows) {
    const code = Number(data.lgdCode);
    const name = String(data.district ?? '');
    const state = String(data.state ?? '');
    const r = geo.resolve(state, name);
    if (!Number.isInteger(code) || r.level !== 'district' || linkedDistricts.has(r.districtId)) {
      unmatched.push(`${name} (${state})`);
      continue;
    }
    linkedDistricts.add(r.districtId);
    await prisma.district.updateMany({ where: { lgdCode: code, NOT: { id: r.districtId } }, data: { lgdCode: null } });
    await prisma.district.update({ where: { id: r.districtId }, data: { lgdCode: code } });
    if (r.match !== 'exact') {
      await addDistrictAlias(r.state, name, r.districtId, 'lgd');
      aliases++;
    }
  }
  console.log(
    `[lgd] ${linkedDistricts.size} districts linked to LGD codes, ${aliases} spellings added as aliases, ${unmatched.length} LGD districts not matched` +
      (unmatched.length ? `: ${unmatched.slice(0, 25).join('; ')}${unmatched.length > 25 ? '…' : ''}` : '')
  );
}
