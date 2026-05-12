/** Lightweight in-memory TTL cache used by the GitHub API service. */
export class Cache {
  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this._store = new Map();
    this._defaultTtl = defaultTtlMs;
  }

  set(key, value, ttlMs = this._defaultTtl) {
    this._store.set(key, { value, expires: Date.now() + ttlMs });
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this._store.delete(key);
  }

  /** Invalidate all entries whose keys start with the given prefix. */
  invalidatePrefix(prefix) {
    for (const key of this._store.keys()) {
      if (key.startsWith(prefix)) this._store.delete(key);
    }
  }

  clear() {
    this._store.clear();
  }

  get size() {
    return this._store.size;
  }
}

export const apiCache = new Cache();
