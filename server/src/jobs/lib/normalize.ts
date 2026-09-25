/** Helpers shared by connectors that read loosely formatted government datasets. */

/** Lower-case, alphanumerics only: "Office Name", "office_name" and "officename" all become "officename". */
export const fieldKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Key a row once, then read the first present field among several spellings. */
export function picker(row: Record<string, unknown>) {
  const keyed: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) keyed[fieldKey(k)] = v;
  return (...names: string[]): string => {
    for (const n of names) {
      const v = keyed[fieldKey(n)];
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
    }
    return '';
  };
}

export function pick(row: Record<string, unknown>, ...names: string[]): string {
  return picker(row)(...names);
}

/** Parse a number, treating the NA / blank / "-" markers used by Indian datasets as missing. */
export function num(v: string): number | null {
  if (!v || /^(na|n\/a|nil|-|null)$/i.test(v.trim())) return null;
  const n = Number(v.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** Text field with the dataset's "NA" style placeholders treated as missing. */
export function text(v: string): string {
  return /^(na|n\/a|nil|-|null|none)$/i.test(v.trim()) ? '' : v.trim();
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SMALL = new Set(['and', 'of', 'the', 'in', 'at', 'on']);

/** "KUMURAM BHEEM ASIFABAD" → "Kumuram Bheem Asifabad"; keeps "Y.S.R." style initials. */
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.replace(/(^|[.\-(/])([a-z])/g, (_, p, c) => p + c.toUpperCase())))
    .join(' ');
}

/** Most frequent value, used to pick a PIN's district when its offices disagree. */
export function mode(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let best = '';
  let n = 0;
  for (const [v, c] of counts) if (c > n || (c === n && v < best)) [best, n] = [v, c];
  return best;
}
