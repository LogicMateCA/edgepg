import { responseCacheKey } from "./key.mjs";
import { noopMetrics } from "./metrics.mjs";
import { evaluateRequest, evaluateResponse } from "./policy.mjs";
import { entryToResponse, responseToEntry } from "./response.mjs";
import { evaluateRoute } from "./route-policy.mjs";

const VALID_MODES = new Set(["fresh", "observe", "public", "strict"]);

export function createWebAccelerator({
  cache,
  mode = "observe",
  buildId = "development",
  ttlSeconds = 60,
  maxBodyBytes = 512 * 1024,
  varyHeaders = [],
  resolveIdentity = async () => null,
  resolveDependencies = async () => [],
  dependencyAdapter,
  versionTimeoutMs = 100,
  metrics = noopMetrics,
  now = () => performance.now(),
  coalesce = true,
  resolveConfiguration,
  routeRegistry,
} = {}) {
  if (!VALID_MODES.has(mode)) throw new TypeError(`unsupported accelerator mode ${mode}`);
  if (!cache?.get || !cache?.set) throw new TypeError("accelerator requires a cache store");
  const inFlight = new Map();

  return {
    mode,
    async handle({ request, executionContext } = {}, handler) {
      if (!(request instanceof Request)) throw new TypeError("handle requires a Request");
      if (typeof handler !== "function") throw new TypeError("handle requires a handler");
      const startedAt = now();
      let effectiveTtlSeconds = ttlSeconds;
      let effectiveBuildId = buildId;
      if (typeof resolveConfiguration === "function") {
        try {
          const routeDecision = evaluateRoute(request, await resolveConfiguration(request));
          routeRegistry?.observe?.(request, routeDecision);
          if (!routeDecision.eligible) {
            metrics.emit(event("bypass", routeDecision.reason, startedAt, now));
            return handler(createContext());
          }
          effectiveTtlSeconds = routeDecision.ttlSeconds;
          effectiveBuildId = `${buildId}:read-config:${routeDecision.revision}`;
        } catch (error) {
          routeRegistry?.observe?.(request, { eligible: false, reason: "configuration_error" });
          metrics.emit(event("error", "configuration", startedAt, now, error));
          return handler(createContext());
        }
      }
      let identity = null;
      try {
        identity = await resolveIdentity(request);
      } catch (error) {
        metrics.emit(event("error", "identity", startedAt, now, error));
        return handler(createContext());
      }
      if (identity === null || identity === undefined) {
        metrics.emit(event("bypass", "identity_unknown", startedAt, now));
        return handler(createContext());
      }

      const decision = evaluateRequest(request, { mode, identity, varyHeaders });
      if (!decision.cacheable) {
        const response = await handler(createContext());
        metrics.emit(event(mode === "observe" ? "observe" : "bypass",
          decision.reason, startedAt, now));
        return response;
      }

      let dependencies = [];
      let before = { complete: true, versions: {} };
      if (mode === "strict") {
        if (!dependencyAdapter?.snapshot) {
          metrics.emit(event("bypass", "version_adapter_missing", startedAt, now));
          return handler(createContext());
        }
        try {
          dependencies = normalizeDependencies(await resolveDependencies(request));
          if (!dependencies.length) {
            metrics.emit(event("bypass", "dependencies_unknown", startedAt, now));
            return handler(createContext());
          }
          before = await versionSnapshot(
            dependencyAdapter,
            dependencies,
            request,
            versionTimeoutMs,
          );
          if (!validSnapshot(before, dependencies)) {
            metrics.emit(event("bypass", "version_incomplete", startedAt, now));
            return handler(createContext());
          }
        } catch (error) {
          metrics.emit(event("error", "version_before", startedAt, now, error));
          return handler(createContext());
        }
      }

      const key = await responseCacheKey({
        request,
        mode,
        buildId: effectiveBuildId,
        identity,
        varyHeaders,
        versions: before.versions,
      });

      try {
        const cached = await cache.get(key);
        if (cached) {
          metrics.emit(event("hit", null, startedAt, now));
          return entryToResponse(cached);
        }
      } catch (error) {
        metrics.emit(event("error", "cache_get", startedAt, now, error));
        return handler(createContext());
      }

      if (coalesce && inFlight.has(key)) {
        const shared = await inFlight.get(key);
        if (shared) {
          metrics.emit(event("coalesced", null, startedAt, now));
          return entryToResponse(shared);
        }
        return handler(createContext());
      }

      let settleFlight;
      let flight;
      if (coalesce) {
        flight = new Promise((resolve) => {
          settleFlight = resolve;
        });
        inFlight.set(key, flight);
      }

      try {
        const context = createContext();
        const response = await handler(context);
        const responseDecision = evaluateResponse(response, { varyHeaders });
        if (!responseDecision.cacheable) {
          metrics.emit(event("bypass", responseDecision.reason, startedAt, now));
          return response;
        }
        if (mode === "strict" && !isSubset(context.dependencies, dependencies)) {
          metrics.emit(event("bypass", "observed_dependency_mismatch", startedAt, now));
          return response;
        }

        if (mode === "strict") {
          try {
            const after = await versionSnapshot(
              dependencyAdapter,
              dependencies,
              request,
              versionTimeoutMs,
            );
            if (!validSnapshot(after, dependencies)
              || !sameVersions(before.versions, after.versions)) {
              metrics.emit(event("stale_reject", "version_changed", startedAt, now));
              return response;
            }
          } catch (error) {
            metrics.emit(event("error", "version_after", startedAt, now, error));
            return response;
          }
        }

        const entry = await responseToEntry(response, { maxBodyBytes });
        if (!entry) {
          metrics.emit(event("bypass", "payload_too_large", startedAt, now));
          return response;
        }

        settleFlight?.(entry);
        const write = cache.set(key, entry, { ttlSeconds: effectiveTtlSeconds }).catch((error) => {
          metrics.emit(event("error", "cache_set", startedAt, now, error));
        });
        if (executionContext?.waitUntil) executionContext.waitUntil(write);
        else await write;
        metrics.emit(event("miss", null, startedAt, now));
        return response;
      } finally {
        settleFlight?.(null);
        if (flight && inFlight.get(key) === flight) inFlight.delete(key);
      }
    },
  };
}

function createContext() {
  const dependencies = new Set();
  return {
    dependencies,
    track(...values) {
      for (const value of values.flat()) {
        if (typeof value === "string" && value.trim()) dependencies.add(value.trim());
      }
    },
  };
}

function normalizeDependencies(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim()))].sort();
}

function validSnapshot(snapshot, dependencies) {
  return snapshot?.complete === true
    && snapshot.versions
    && dependencies.every((dependency) =>
      Object.prototype.hasOwnProperty.call(snapshot.versions, dependency));
}

function isSubset(observed, declared) {
  const allowed = new Set(declared);
  return [...observed].every((dependency) => allowed.has(dependency));
}

function sameVersions(left, right) {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => key === rightKeys[index] && left[key] === right[key]);
}

function versionSnapshot(adapter, dependencies, request, timeoutMs) {
  const snapshot = Promise.resolve().then(() =>
    adapter.snapshot(dependencies, request));
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return snapshot;
  let timeout;
  return Promise.race([
    snapshot,
    new Promise((_, reject) => {
      timeout = setTimeout(() => {
        const error = new Error(
          `version snapshot timed out after ${timeoutMs} ms`,
        );
        error.name = "VersionTimeoutError";
        reject(error);
      }, timeoutMs);
    }),
  ]).finally(() => clearTimeout(timeout));
}

function event(outcome, reason, startedAt, now, error) {
  return {
    outcome,
    reason: reason || undefined,
    durationMs: Math.max(0, now() - startedAt),
    error: error instanceof Error ? error.name : undefined,
  };
}
