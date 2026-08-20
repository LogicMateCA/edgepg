import { KVCache, MemoryCache, TieredCache } from "./cache.mjs";

export function createCloudflareCache({
  cache,
  cacheOrigin,
  kv,
  prefix,
  memoryEntries = 256,
  memoryBytes = 16 * 1024 * 1024,
} = {}) {
  const memory = new MemoryCache({
    maxEntries: memoryEntries,
    maxBytes: memoryBytes,
  });
  let persistent = null;
  if (cache) persistent = new CacheApiCache(cache, { prefix, origin: cacheOrigin });
  if (kv) {
    const kvCache = new KVCache(kv, { prefix });
    persistent = persistent ? new TieredCache(persistent, kvCache) : kvCache;
  }
  return persistent ? new TieredCache(memory, persistent) : memory;
}

export class CacheApiCache {
  constructor(cache, {
    prefix = "wa:",
    now = Date.now,
    origin,
  } = {}) {
    if (!cache?.match || !cache?.put) {
      throw new TypeError("CacheApiCache requires a Cache-compatible binding");
    }
    if (!origin) throw new TypeError("CacheApiCache requires the Worker's cache origin");
    this.cache = cache;
    this.prefix = prefix;
    this.now = now;
    const parsedOrigin = new URL(origin);
    if (!["http:", "https:"].includes(parsedOrigin.protocol)) {
      throw new TypeError("CacheApiCache origin must use HTTP or HTTPS");
    }
    this.origin = parsedOrigin.origin;
  }

  async get(key) {
    const stored = await this.getWithMetadata(key);
    return stored?.value ?? null;
  }

  async getWithMetadata(key) {
    const request = this.request(key);
    const response = await this.cache.match(request);
    if (!response) return null;
    const stored = await response.json();
    const remainingMs = Number(stored?.expiresAt) - this.now();
    if (!stored || typeof stored !== "object"
      || !Number.isFinite(Number(stored.expiresAt))
      || remainingMs <= 0) {
      await this.cache.delete?.(request);
      return null;
    }
    return {
      value: stored.value ?? null,
      ttlSeconds: remainingMs / 1000,
      expiresAt: Number(stored.expiresAt),
    };
  }

  async set(key, value, { ttlSeconds }) {
    const logicalTtl = Math.max(1, Number(ttlSeconds));
    return this.setUntil(key, value, this.now() + logicalTtl * 1000);
  }

  async setUntil(key, value, expiresAt) {
    const remainingMs = expiresAt - this.now();
    if (!Number.isFinite(expiresAt) || remainingMs <= 0) return false;
    await this.cache.put(this.request(key), new Response(JSON.stringify({
      expiresAt,
      value,
    }), {
      headers: {
        "content-type": "application/json",
        "cache-control": `public, max-age=${Math.ceil(remainingMs / 1000)}`,
      },
    }));
    return true;
  }

  async delete(key) {
    await this.cache.delete?.(this.request(key));
  }

  request(key) {
    return new Request(`${this.origin}/__web-accelerator-cache/${encodeURIComponent(
      `${this.prefix}${key}`,
    )}`);
  }
}
