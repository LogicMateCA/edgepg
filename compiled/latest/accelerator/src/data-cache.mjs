import { isCompleteIdentity } from "./identity.mjs";
import { stableStringify } from "./key.mjs";

export function createDataCache({
  cache,
  namespace = "data",
  ttlSeconds = 60,
  resolveIdentity,
  tagAdapter,
  bumpTags,
} = {}) {
  if (!cache?.get || !cache?.set) throw new TypeError("data cache requires a cache store");
  if (typeof resolveIdentity !== "function") {
    throw new TypeError("data cache requires resolveIdentity");
  }
  const inFlight = new Map();

  async function target(key, tags, request) {
    const identity = await resolveIdentity(request);
    if (!isCompleteIdentity(identity)) return null;
    const normalizedTags = normalizeTags(tags);
    let versions = {};
    if (normalizedTags.length) {
      if (!tagAdapter?.snapshot) return null;
      const snapshot = await tagAdapter.snapshot(normalizedTags, request);
      if (!snapshot?.complete) return null;
      versions = snapshot.versions;
    }
    return digest(stableStringify({
      namespace,
      key,
      identity,
      tags: normalizedTags,
      versions,
    }));
  }

  async function get(key, { tags = [], request } = {}) {
    try {
      const cacheKey = await target(key, tags, request);
      if (!cacheKey) return undefined;
      const stored = await cache.get(cacheKey);
      return stored?.kind === "web-accelerator-data" ? stored.value : undefined;
    } catch {
      return undefined;
    }
  }

  async function set(key, value, { tags = [], request, ttl = ttlSeconds } = {}) {
    try {
      const cacheKey = await target(key, tags, request);
      if (!cacheKey) return false;
      await cache.set(cacheKey, { kind: "web-accelerator-data", value }, {
        ttlSeconds: ttl,
      });
      return true;
    } catch {
      return false;
    }
  }

  return {
    get,
    set,

    async invalidateTag(tags, request) {
      const normalized = normalizeTags(tags);
      if (!normalized.length || typeof bumpTags !== "function") return false;
      try {
        await bumpTags(normalized, request);
        return true;
      } catch {
        return false;
      }
    },

    async cachedQuery(key, loader, options = {}) {
      if (typeof loader !== "function") throw new TypeError("cachedQuery requires a loader");
      const hit = await get(key, options);
      if (hit !== undefined) return hit;

      let flightKey;
      try {
        flightKey = await target(key, options.tags || [], options.request);
      } catch {
        flightKey = null;
      }
      if (!flightKey) return loader();
      if (inFlight.has(flightKey)) return inFlight.get(flightKey);

      const load = (async () => {
        const value = await loader();
        const afterKey = await target(key, options.tags || [], options.request)
          .catch(() => null);
        if (afterKey === flightKey) {
          try {
            await cache.set(flightKey, {
              kind: "web-accelerator-data",
              value,
            }, {
              ttlSeconds: options.ttl ?? ttlSeconds,
            });
          } catch {
            // The loader result remains authoritative when the cache write fails.
          }
        }
        return value;
      })();
      inFlight.set(flightKey, load);
      try {
        return await load;
      } finally {
        if (inFlight.get(flightKey) === load) inFlight.delete(flightKey);
      }
    },
  };
}

function normalizeTags(tags) {
  const values = Array.isArray(tags) ? tags : [tags];
  return [...new Set(values
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim()))].sort();
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
