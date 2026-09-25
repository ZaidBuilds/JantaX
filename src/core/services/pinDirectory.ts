import { useEffect, useState } from 'react';

/**
 * India Post's All India Pincode Directory, served as static JSON from /data/pins
 * (one file per 3-digit prefix, written by `npm run data -- export-pins`). Works with no API.
 */

export interface PostOfficeEntry {
  name: string;
  /** BO branch, PO/SO sub, HO head office, as published. */
  type: string;
  delivery: boolean;
}

export interface PinRecord {
  pin: string;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
  offices: PostOfficeEntry[];
}

export interface DirectorySource {
  name: string;
  organization: string;
  url: string;
  license: string;
  licenseUrl?: string;
  publishedAt: string | null;
  syncedAt: string;
  via?: string;
}

type RawPin = { d: string; s: string; c?: [number, number]; o: [string, string, number][] };

const base = () => `${(import.meta.env?.BASE_URL as string | undefined) ?? '/'}data/pins/`;
const chunks = new Map<string, Record<string, RawPin> | null>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
let meta: Promise<{ source: DirectorySource; pins: number; offices: number } | null> | null = null;

function toRecord(pin: string, r: RawPin): PinRecord {
  return {
    pin,
    district: r.d,
    state: r.s,
    lat: r.c?.[0] ?? null,
    lng: r.c?.[1] ?? null,
    offices: r.o.map(([name, type, delivery]) => ({ name, type, delivery: delivery === 1 })),
  };
}

function loadPrefix(prefix: string): Promise<void> {
  if (chunks.has(prefix)) return Promise.resolve();
  let p = inflight.get(prefix);
  if (!p) {
    p = fetch(`${base()}${prefix}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((json) => {
        // A missing file means no PIN starts with this prefix; a network failure is retried next time.
        if (json !== null || typeof navigator === "undefined" || navigator.onLine) chunks.set(prefix, json);
        inflight.delete(prefix);
        listeners.forEach((l) => l());
      });
    inflight.set(prefix, p);
  }
  return p;
}

/**
 * Synchronous read of an already-loaded PIN: a record, `null` when the directory has no such PIN,
 * or `undefined` when its file has not been loaded yet.
 */
export function getCachedPin(pin: string): PinRecord | null | undefined {
  if (!/^[1-9]\d{5}$/.test(pin)) return null;
  const chunk = chunks.get(pin.slice(0, 3));
  if (chunk === undefined) return undefined;
  const raw = chunk?.[pin];
  return raw ? toRecord(pin, raw) : null;
}

export async function lookupPin(pin: string): Promise<PinRecord | null> {
  if (!/^[1-9]\d{5}$/.test(pin)) return null;
  await loadPrefix(pin.slice(0, 3));
  return getCachedPin(pin) ?? null;
}

export function prefetchPin(pin: string): void {
  if (/^[1-9]\d{5}$/.test(pin)) void loadPrefix(pin.slice(0, 3));
}

export function directorySource() {
  meta ??= fetch(`${base()}index.json`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return meta;
}

/** Subscribe to directory loads, so synchronous readers can re-render once a file arrives. */
export function onDirectoryLoad(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export type PinLookup =
  | { status: 'loading'; record: null }
  | { status: 'found'; record: PinRecord }
  | { status: 'missing'; record: null }
  | { status: 'invalid'; record: null };

export function usePinRecord(pin: string): PinLookup {
  const read = (): PinLookup => {
    if (!/^[1-9]\d{5}$/.test(pin)) return { status: 'invalid', record: null };
    const hit = getCachedPin(pin);
    if (hit === undefined) return { status: 'loading', record: null };
    return hit ? { status: 'found', record: hit } : { status: 'missing', record: null };
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    setState(read());
    const off = onDirectoryLoad(() => setState(read()));
    prefetchPin(pin);
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);
  return state;
}

export function useDirectorySource() {
  const [src, setSrc] = useState<DirectorySource | null>(null);
  useEffect(() => {
    let alive = true;
    directorySource().then((m) => alive && setSrc(m?.source ?? null));
    return () => {
      alive = false;
    };
  }, []);
  return src;
}
