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
import { HI, HI_PATTERNS } from './hi';

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
  if (!key) return null;
  const exact = HI[key];
  if (exact !== undefined) return exact;
  const numbers = key.match(NUMBER);
  if (numbers) {
    let i = 0;
    const shape = HI[key.replace(NUMBER, () => `{${i++}}`)];
    if (shape !== undefined) return fill(shape, numbers);
  }
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
