import { num, text } from '../jobs/lib/normalize';
import type { FieldSpec, FieldType } from './spec';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Dates as published in Indian datasets → "YYYY-MM-DD" (or "YYYY-MM" when only a month is given). */
export function parseDate(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/); // day first, as used in India
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})[- ]([A-Za-z]{3})[a-z]*[- ,]+(\d{4})$/);
  if (m && MONTHS.includes(m[2].toLowerCase())) return `${m[3]}-${String(MONTHS.indexOf(m[2].toLowerCase()) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = s.match(/^([A-Za-z]{3})[a-z]*[- ,]+(\d{4})$/);
  if (m && MONTHS.includes(m[1].toLowerCase())) return `${m[2]}-${String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0')}`;
  if (/^\d{5}$/.test(s)) {
    // Excel serial date.
    const d = new Date(Date.UTC(1899, 11, 30) + Number(s) * 86400_000);
    return d.toISOString().slice(0, 10);
  }
  return null;
}

export type Value = string | number | boolean | null;

/** Convert one raw cell to the field's type. Returns undefined when a non-empty value cannot be read. */
export function convert(raw: string, type: FieldType): Value | undefined {
  const t = text(raw);
  if (!t) return null;
  switch (type) {
    case 'text':
      return t;
    case 'url':
      return /^https?:\/\//i.test(t) ? t : undefined;
    case 'number':
    case 'percent': {
      const n = num(t.replace(/[%₹]|rs\.?|inr/gi, '').trim());
      return n === null ? undefined : n;
    }
    case 'int': {
      const n = num(t.replace(/[%₹]/g, ''));
      return n === null ? undefined : Math.round(n);
    }
    case 'bool':
      if (/^(yes|y|true|1|available|functional)$/i.test(t)) return true;
      if (/^(no|n|false|0|not available|non[- ]?functional)$/i.test(t)) return false;
      return undefined;
    case 'pincode': {
      const m = t.match(/\b([1-9]\d{5})\b/);
      return m ? m[1] : undefined;
    }
    case 'date':
      return parseDate(t) ?? undefined;
  }
}

/** Column names in a download, matched to spec fields: which field reads from which column. */
export function matchColumns(columns: string[], fields: Record<string, FieldSpec>) {
  const key = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');
  const byKey = new Map(columns.map((c) => [key(c), c]));
  const mapped: Record<string, string> = {};
  const missing: string[] = [];
  const used = new Set<string>();
  for (const [id, f] of Object.entries(fields)) {
    // A column feeds one field only; earlier fields in the spec win.
    const hit = [id, ...f.from].map(key).find((k) => byKey.has(k) && !used.has(byKey.get(k)!));
    if (hit) {
      mapped[id] = byKey.get(hit)!;
      used.add(mapped[id]);
    } else missing.push(id);
  }
  return { mapped, missing, unused: columns.filter((c) => !used.has(c)) };
}
