/**
 * 3-Tier Cache System: Memory → LocalStorage → IndexedDB
 * Provides fast reads from memory, persistence via localStorage/IDB.
 */
import { openDB } from 'idb';

// ─── Memory Cache (L1) ───
const memoryCache = new Map();
const MEMORY_TTL = 5 * 60 * 1000; // 5 min

// ─── IndexedDB (L3) ───
const DB_NAME = 'islamapp_cache';
const DB_VERSION = 1;
const STORE_NAME = 'api_cache';

let dbPromise = null;
function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

// ─── Cache API ───

/**
 * Get a cached value. Checks memory → localStorage → IndexedDB.
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export async function cacheGet(key) {
  // L1: Memory
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.ts < MEMORY_TTL) {
    return mem.data;
  }

  // L2: LocalStorage (for small data)
  try {
    const ls = localStorage.getItem(`cache_${key}`);
    if (ls) {
      const parsed = JSON.parse(ls);
      if (Date.now() - parsed.ts < parsed.ttl) {
        memoryCache.set(key, { data: parsed.data, ts: Date.now() });
        return parsed.data;
      }
      localStorage.removeItem(`cache_${key}`);
    }
  } catch { /* ignore parse errors */ }

  // L3: IndexedDB (for large data)
  try {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, key);
    if (entry && Date.now() - entry.ts < entry.ttl) {
      memoryCache.set(key, { data: entry.data, ts: Date.now() });
      return entry.data;
    }
    if (entry) await db.delete(STORE_NAME, key);
  } catch { /* IDB unavailable */ }

  return null;
}

/**
 * Set a cached value across all 3 tiers.
 * @param {string} key
 * @param {any} data
 * @param {number} ttl  Time-to-live in ms (default 30 min)
 * @param {'small'|'large'} size  'small' uses localStorage, 'large' uses IndexedDB
 */
export async function cacheSet(key, data, ttl = 30 * 60 * 1000, size = 'small') {
  // L1: Always store in memory
  memoryCache.set(key, { data, ts: Date.now() });

  const entry = { data, ts: Date.now(), ttl };

  if (size === 'small') {
    // L2: LocalStorage
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch { /* quota exceeded, skip */ }
  } else {
    // L3: IndexedDB
    try {
      const db = await getDB();
      await db.put(STORE_NAME, entry, key);
    } catch { /* IDB unavailable */ }
  }
}

/**
 * Remove a cached key from all tiers.
 */
export async function cacheRemove(key) {
  memoryCache.delete(key);
  try { localStorage.removeItem(`cache_${key}`); } catch {}
  try { const db = await getDB(); await db.delete(STORE_NAME, key); } catch {}
}

/**
 * Clear all cached data across all tiers.
 */
export async function cacheClear() {
  memoryCache.clear();
  try {
    Object.keys(localStorage).filter(k => k.startsWith('cache_')).forEach(k => localStorage.removeItem(k));
  } catch {}
  try { const db = await getDB(); await db.clear(STORE_NAME); } catch {}
}

/**
 * Fetch with cache: returns cached data first, fetches in background.
 * Stale-while-revalidate pattern.
 * @param {string} cacheKey
 * @param {Function} fetcher  Async function that fetches fresh data
 * @param {object} opts  { ttl, size }
 * @returns {Promise<{ data: any, fromCache: boolean }>}
 */
export async function fetchWithCache(cacheKey, fetcher, opts = {}) {
  const { ttl = 30 * 60 * 1000, size = 'small' } = opts;

  const cached = await cacheGet(cacheKey);
  if (cached !== null) {
    // Revalidate in background
    fetcher().then(freshData => {
      if (freshData !== undefined && freshData !== null) {
        cacheSet(cacheKey, freshData, ttl, size);
      }
    }).catch(() => {});
    return { data: cached, fromCache: true };
  }

  // No cache, fetch fresh
  const data = await fetcher();
  if (data !== undefined && data !== null) {
    await cacheSet(cacheKey, data, ttl, size);
  }
  return { data, fromCache: false };
}
