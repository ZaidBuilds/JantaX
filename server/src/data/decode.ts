import zlib from 'zlib';
import { readSheet } from 'read-excel-file/node';
import { parseCsvRows } from '../jobs/lib/csv';

export type Format = 'csv' | 'json' | 'xlsx';

export function formatOf(pathOrType: string): Format {
  if (/xlsx|spreadsheetml|excel/i.test(pathOrType)) return 'xlsx';
  if (/csv/i.test(pathOrType)) return 'csv';
  return 'json';
}

/**
 * Government spreadsheets often put a title, notes or merged cells above the real header.
 * Use the first row, within the first 20, whose cells are mostly filled with text.
 */
export function findHeaderRow(rows: unknown[][]): number {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const cells = rows[i];
    const filled = cells.filter((c) => c !== null && c !== undefined && String(c).trim() !== '');
    const texty = filled.filter((c) => typeof c === 'string' && !/^\d+(\.\d+)?$/.test(c.trim()));
    if (filled.length >= 2 && filled.length >= cells.length * 0.6 && texty.length >= filled.length * 0.8) return i;
  }
  return 0;
}

export function rowsToObjects(rows: unknown[][]): Record<string, string>[] {
  const h = findHeaderRow(rows);
  const header = rows[h].map((c, i) => (c === null || c === undefined || String(c).trim() === '' ? `column_${i + 1}` : String(c).replace(/\s+/g, ' ').trim()));
  return rows
    .slice(h + 1)
    // Drop blank rows, and footnotes ("Source: …", "Note: …") that fill a single cell of a wide table.
    .filter((r) => r.filter((c) => c !== null && c !== undefined && String(c).trim() !== '').length >= (header.length >= 3 ? 2 : 1))
    .map((r) =>
      Object.fromEntries(
        header.map((k, i) => {
          const v = r[i];
          return [k, v === null || v === undefined ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).trim()];
        })
      )
    );
}

/** Any supported download → one plain object per row. */
export async function decodeRows(buffer: Buffer, format: Format, gzip = false): Promise<Record<string, unknown>[]> {
  const bytes = gzip ? zlib.gunzipSync(buffer) : buffer;
  if (format === 'xlsx') return rowsToObjects((await readSheet(bytes)) as unknown[][]);
  const text = bytes.toString('utf8');
  if (format === 'csv') {
    const rows = parseCsvRows(text);
    return rows.length ? rowsToObjects(rows) : [];
  }
  const json = JSON.parse(text);
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.records)) return json.records; // data.gov.in
  if (Array.isArray(json.result?.records)) return json.result.records; // CKAN datastore
  if (Array.isArray(json.data)) return json.data;
  throw new Error('JSON download has no records array');
}
