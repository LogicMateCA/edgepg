export function withCacheTimeout(cache, {
  readTimeoutMs = 40,
  writeTimeoutMs = 100,
  mutationTimeoutMs = 250,
} = {}) {
  if (!cache?.get || !cache?.set) {
    throw new TypeError("withCacheTimeout requires a cache store");
  }

  return {
    get(key) {
      return deadline(cache.get(key), readTimeoutMs, "cache get");
    },
    set(key, value, options) {
      return deadline(cache.set(key, value, options), writeTimeoutMs, "cache set");
    },
    delete(key) {
      if (!cache.delete) return Promise.resolve(false);
      return deadline(cache.delete(key), mutationTimeoutMs, "cache delete");
    },
    clear() {
      if (!cache.clear) return Promise.resolve(false);
      return deadline(cache.clear(), mutationTimeoutMs, "cache clear");
    },
  };
}

function deadline(value, timeoutMs, operation) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return Promise.resolve(value);
  let timeout;
  return Promise.race([
    Promise.resolve(value),
    new Promise((_, reject) => {
      timeout = setTimeout(() => {
        const error = new Error(`${operation} timed out after ${timeoutMs} ms`);
        error.name = "CacheTimeoutError";
        reject(error);
      }, timeoutMs);
    }),
  ]).finally(() => clearTimeout(timeout));
}
