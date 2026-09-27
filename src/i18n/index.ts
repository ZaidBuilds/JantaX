/**
 * English / Hindi for the whole interface.
 *
 * English is the source language: components are written in English, and the Hindi dictionary
 * (./hi.ts) is applied to the rendered page by ./domTranslator.ts when Hindi is selected. That keeps
 * one copy of every screen, reaches strings that live in constants and data labels as well as JSX,
 * and lets the coverage check list exactly which visible strings still lack Hindi.
 *
 * Code that builds text outside the page (document titles, alerts, share text) or that holds both
 * languages in data (nameHi fields) uses t() and pick() directly.
 */
type Dict = { HI: Record<string, string>; HI_KEEP: Set<string>; HI_PATTERNS: [RegExp, string | ((m: RegExpMatchArray) => string)][] };

/** The Hindi dictionary is a separate chunk, fetched only when someone picks Hindi. */
let dict: Dict | null = null;
let loading: Promise<void> | null = null;
export function loadHindi(): Promise<void> {
  if (dict) return Promise.resolve();
  loading ??= import('./hi').then((m) => {
    dict = { HI: m.HI, HI_KEEP: m.HI_KEEP, HI_PATTERNS: m.HI_PATTERNS };
  });
  return loading;
}
export const hindiReady = () => dict !== null;

const DEVANAGARI = /[\u0900-\u097F]/g;
const LATIN_LETTER = /[A-Za-z]/g;

export type Lang = 'en' | 'hi';

let current: Lang = 'en';
const listeners = new Set<() => void>();

export const getLang = (): Lang => current;

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  listeners.forEach((fn) => fn());
}

export function onLangChange(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Locale for dates and numbers. Digits stay Latin in both, as on Indian government sites. */
export const locale = (): string => (current === 'hi' ? 'hi-IN' : 'en-IN');

const NUMBER = /\d[\d,]*(?:\.\d+)?/g;

function fill(template: string, values: string[]) {
  return template.replace(/\{(\d+)\}/g, (_, i) => values[Number(i)] ?? '');
}

/**
 * Hindi for one English UI string, or null when the dictionary has none.
 * Tries the exact text, then the text with its numbers as {0}, {1}... ("Showing {0} of {1} records"),
 * then the regular-expression patterns for strings that carry names or places.
 */
export function lookupHindi(english: string): string | null {
  const key = english.replace(/\s+/g, ' ').trim();
  if (!key || !dict) return null;
  const { HI, HI_KEEP, HI_PATTERNS } = dict;
  // Already Hindi (a record's Hindi name, with an acronym or two in it): leave it.
  if ((key.match(DEVANAGARI)?.length ?? 0) >= (key.match(LATIN_LETTER)?.length ?? 0)) return key;
  const exact = HI[key];
  if (exact !== undefined) return exact;
  const numbers = key.match(NUMBER);
  if (numbers) {
    let i = 0;
    const shapeKey = key.replace(NUMBER, () => `{${i++}}`);
    const shape = HI[shapeKey];
    if (shape !== undefined) return fill(shape, numbers);
    if (HI_KEEP.has(shapeKey)) return key;
  }
  if (HI_KEEP.has(key)) return key;
  for (const [re, to] of HI_PATTERNS) {
    const m = key.match(re);
    if (m) return typeof to === 'string' ? key.replace(re, to) : to(m);
  }
  return null;
}

/** Translate an English string for code paths outside the rendered page. {name} placeholders are filled from vars. */
export function t(english: string, vars?: Record<string, string | number>): string {
  const base = current === 'hi' ? lookupHindi(english) ?? english : english;
  return vars ? base.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : base;
}

/** Choose between the two language versions a record carries, falling back to English. */
export function pick(en: string, hi?: string | null): string {
  return current === 'hi' && hi ? hi : en;
}

export function formatDate(value: string | number | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(locale(), opts);
}
