// Tiny in-memory TTL cache with in-flight de-duplication.
// Government APIs are slow; this keeps repeat PIN lookups instant.

interface Entry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const MAX_ENTRIES = 5000;

export const HOUR = 3600 * 1000;

export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const p = load()
    .then((value) => {
      if (store.size >= MAX_ENTRIES) {
        const oldest = store.keys().next().value;
        if (oldest !== undefined) store.delete(oldest);
      }
      store.set(key, { value, expires: Date.now() + ttlMs });
      return value;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, p);
  return p;
}
