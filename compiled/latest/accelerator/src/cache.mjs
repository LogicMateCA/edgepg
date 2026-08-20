export class MemoryCache {
  constructor({ maxEntries = 256, maxBytes = 16 * 1024 * 1024, now = Date.now } = {}) {
    this.maxEntries = maxEntries;
    this.maxBytes = maxBytes;
    this.now = now;
    this.entries = new Map();
    this.bytes = 0;
  }

  async get(key) {
    const stored = await this.getWithMetadata(key);
    return stored?.value ?? null;
  }

  async getWithMetadata(key) {
    const stored = this.entries.get(key);
    if (!stored) return null;
    const remainingMs = stored.expiresAt - this.now();
    if (remainingMs <= 0) {
      this.remove(key, stored);
      return null;
    }
    this.entries.delete(key);
    this.entries.set(key, stored);
    return {
      value: structuredClone(stored.value),
      ttlSeconds: remainingMs / 1000,
      expiresAt: stored.expiresAt,
    };
  }

  async set(key, value, { ttlSeconds }) {
    return this.setUntil(key, value, this.now() + Math.max(1, ttlSeconds) * 1000);
  }

  async setUntil(key, value, expiresAt) {
    if (!Number.isFinite(expiresAt) || expiresAt <= this.now()) return false;
    const size = estimateBytes(value);
    if (size > this.maxBytes) return false;
    const current = this.entries.get(key);
    if (current) this.remove(key, current);
    this.entries.set(key, {
      value: structuredClone(value),
      expiresAt,
      size,
    });
    this.bytes += size;
    this.evict();
    return true;
  }

  async delete(key) {
    const stored = this.entries.get(key);
    if (stored) this.remove(key, stored);
  }

  async clear() {
    this.entries.clear();
    this.bytes = 0;
  }

  remove(key, stored) {
    this.entries.delete(key);
    this.bytes -= stored.size;
  }

  evict() {
    while (this.entries.size > this.maxEntries || this.bytes > this.maxBytes) {
      const oldest = this.entries.entries().next().value;
      if (!oldest) break;
      this.remove(oldest[0], oldest[1]);
    }
  }
}

export class KVCache {
  constructor(namespace, { prefix = "wa:", now = Date.now } = {}) {
    if (!namespace?.get || !namespace?.put) {
      throw new TypeError("KVCache requires a KV-compatible namespace");
    }
    this.namespace = namespace;
    this.prefix = prefix;
    this.now = now;
  }

  async get(key) {
    const stored = await this.getWithMetadata(key);
    return stored?.value ?? null;
  }

  async getWithMetadata(key) {
    const stored = await this.namespace.get(`${this.prefix}${key}`, "json");
    if (!stored || typeof stored !== "object") return null;
    const remainingMs = stored.expiresAt - this.now();
    if (!Number.isFinite(stored.expiresAt) || remainingMs <= 0) return null;
    return {
      value: stored.value ?? null,
      ttlSeconds: remainingMs / 1000,
      expiresAt: stored.expiresAt,
    };
  }

  async set(key, value, { ttlSeconds }) {
    const logicalTtl = Math.max(1, ttlSeconds);
    return this.setUntil(key, value, this.now() + logicalTtl * 1000);
  }

  async setUntil(key, value, expiresAt) {
    const remainingMs = expiresAt - this.now();
    if (!Number.isFinite(expiresAt) || remainingMs <= 0) return false;
    await this.namespace.put(`${this.prefix}${key}`, JSON.stringify({
      expiresAt,
      value,
    }), {
      expirationTtl: Math.max(60, Math.ceil(remainingMs / 1000)),
    });
    return true;
  }

  async delete(key) {
    await this.namespace.delete?.(`${this.prefix}${key}`);
  }
}

export class TieredCache {
  constructor(memory, persistent) {
    this.memory = memory;
    this.persistent = persistent;
  }

  async get(key) {
    const stored = await this.getWithMetadata(key);
    return stored?.value ?? null;
  }

  async getWithMetadata(key) {
    const local = await readWithMetadata(this.memory, key);
    if (local) return local;
    const remote = await readWithMetadata(this.persistent, key);
    if (!remote) return null;
    if (Number.isFinite(remote.expiresAt)
      && typeof this.memory.setUntil === "function") {
      await this.memory.setUntil(key, remote.value, remote.expiresAt);
    }
    return remote;
  }

  async set(key, value, options) {
    await Promise.all([
      this.memory.set(key, value, options),
      this.persistent.set(key, value, options),
    ]);
    return true;
  }

  async setUntil(key, value, expiresAt) {
    const writes = [this.memory, this.persistent]
      .filter((cache) => typeof cache.setUntil === "function")
      .map((cache) => cache.setUntil(key, value, expiresAt));
    if (!writes.length) return false;
    await Promise.all(writes);
    return true;
  }

  async delete(key) {
    await Promise.allSettled([
      this.memory.delete(key),
      this.persistent.delete(key),
    ]);
  }
}

function estimateBytes(value) {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

async function readWithMetadata(cache, key) {
  if (typeof cache.getWithMetadata === "function") return cache.getWithMetadata(key);
  const value = await cache.get(key);
  return value === null || value === undefined
    ? null
    : { value, ttlSeconds: 0, expiresAt: null };
}
