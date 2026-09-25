import type { ParsedRow } from '../jobs/connector';
import { matchColumns, type Value } from './fields';
import { mapRow, toDatasetRow } from './datasetConnector';
import type { GeoResolver } from './geography';
import type { DatasetSpec } from './spec';

export interface Inspection {
  rows: number;
  columns: string[];
  /** Field id → the column it was read from. */
  mapped: Record<string, string>;
  missingRequired: string[];
  missingOptional: string[];
  /** Columns in the file that no field uses. */
  unused: string[];
  /** Rows that would be stored (have every key field). */
  keyed: number;
  /** Rows placed at the dataset's level (district/PIN for local data, state for state data). */
  placed: number;
  unreadable: Record<string, number>;
  sample: Record<string, Value>[];
}

/**
 * How a downloaded file lines up with a dataset spec, before anything is stored.
 * Used by `npm run data -- inspect <id>` to check a resource id or a hand-compiled file.
 */
export function inspectRows(
  spec: DatasetSpec,
  rows: Record<string, unknown>[],
  geo: GeoResolver,
  pins: Map<string, { districtId: string | null; state: string }> = new Map()
): Inspection {
  const columns = [...new Set(rows.slice(0, 200).flatMap((r) => Object.keys(r)))];
  const { mapped, missing, unused } = matchColumns(columns, spec.fields);
  const isRequired = (f: string) => spec.fields[f].required || spec.key.includes(f);
  const unreadable: Record<string, number> = {};
  const sample: Record<string, Value>[] = [];
  let keyed = 0;
  let placed = 0;
  for (const row of rows) {
    const { values, unreadable: bad } = mapRow(spec, mapped, row as ParsedRow);
    bad.forEach((f) => (unreadable[f] = (unreadable[f] ?? 0) + 1));
    const r = toDatasetRow(spec, values, geo, pins);
    if (!r) continue;
    keyed++;
    if (spec.level === 'national' || (spec.level === 'state' ? r.state : r.districtId || r.pincode)) placed++;
    if (sample.length < 3) sample.push({ ...values, _state: r.state, _districtId: r.districtId });
  }
  return {
    rows: rows.length,
    columns,
    mapped,
    missingRequired: missing.filter(isRequired),
    missingOptional: missing.filter((f) => !isRequired(f)),
    unused,
    keyed,
    placed,
    unreadable,
    sample,
  };
}
