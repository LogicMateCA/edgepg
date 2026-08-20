import { responseCacheKey } from "./key.mjs";
import { evaluateRequest } from "./policy.mjs";

export function createCacheController({
  accelerator,
  cache,
  mode = "observe",
  buildId = "development",
  varyHeaders = [],
  resolveIdentity = async () => null,
  resolveDependencies = async () => [],
  dependencyAdapter,
} = {}) {
  if (!accelerator?.handle) throw new TypeError("cache controller requires an accelerator");
  if (!cache?.get || !cache?.set) throw new TypeError("cache controller requires a cache store");

  async function resolve(request) {
    if (!(request instanceof Request)) throw new TypeError("cache operation requires a Request");
    const identity = await resolveIdentity(request);
    if (identity === null || identity === undefined) {
      return { cacheable: false, reason: "identity_unknown" };
    }
    const decision = evaluateRequest(request, { mode, identity, varyHeaders });
    if (!decision.cacheable) {
      return { cacheable: false, reason: decision.reason };
    }

    let versions = {};
    if (mode === "strict") {
      if (!dependencyAdapter?.snapshot) {
        return { cacheable: false, reason: "version_adapter_missing" };
      }
      const dependencies = normalize(await resolveDependencies(request));
      if (!dependencies.length) {
        return { cacheable: false, reason: "dependencies_unknown" };
      }
      const snapshot = await dependencyAdapter.snapshot(dependencies, request);
      if (!snapshot?.complete || !snapshot.versions
        || !dependencies.every((name) =>
          Object.prototype.hasOwnProperty.call(snapshot.versions, name))) {
        return { cacheable: false, reason: "version_incomplete" };
      }
      versions = snapshot.versions;
    }

    return {
      cacheable: true,
      key: await responseCacheKey({
        request,
        mode,
        buildId,
        identity,
        varyHeaders,
        versions,
      }),
    };
  }

  async function purge(request) {
    const target = await resolve(request);
    if (!target.cacheable) return { purged: false, reason: target.reason };
    if (!cache.delete) return { purged: false, reason: "delete_unsupported" };
    await cache.delete(target.key);
    return { purged: true };
  }

  return {
    resolve,
    purge,

    async prewarm({ request, executionContext } = {}, handler) {
      const result = await purge(request);
      if (!result.purged) return { warmed: false, reason: result.reason };
      const response = await accelerator.handle({ request, executionContext }, handler);
      return { warmed: true, response };
    },
  };
}

function normalize(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim()))].sort();
}
