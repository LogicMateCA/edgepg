const MODES = new Set(["automatic", "rules"]);
const ACTIONS = new Set(["accelerate", "exclude"]);
const KINDS = new Set(["page", "section"]);

export const DEFAULT_READ_ACCELERATION_CONFIG = Object.freeze({
  schemaVersion: 1,
  enabled: false,
  mode: "automatic",
  defaultTtlSeconds: 60,
  revision: 0,
  rules: Object.freeze([]),
});

export function normalizeRoutePath(value) {
  const raw = String(value || "/").trim();
  let pathname;
  try {
    pathname = new URL(raw, "https://read-acceleration.invalid").pathname;
  } catch {
    pathname = raw.split(/[?#]/, 1)[0];
  }
  const normalized = `/${pathname}`.replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return normalized || "/";
}

export function normalizeReadAccelerationConfig(value = {}) {
  const rules = Array.isArray(value.rules) ? value.rules : [];
  return {
    schemaVersion: 1,
    enabled: value.enabled === true,
    mode: MODES.has(value.mode) ? value.mode : "automatic",
    defaultTtlSeconds: integerInRange(value.defaultTtlSeconds, 1, 86_400, 60),
    revision: integerInRange(value.revision, 0, Number.MAX_SAFE_INTEGER, 0),
    rules: rules.slice(0, 250).flatMap((rule, index) => {
      if (!rule || typeof rule !== "object") return [];
      const action = ACTIONS.has(rule.action) ? rule.action : null;
      const kind = KINDS.has(rule.kind) ? rule.kind : null;
      if (!action || !kind) return [];
      return [{
        id: String(rule.id || `rule-${index + 1}`).slice(0, 100),
        path: normalizeRoutePath(rule.path),
        kind,
        action,
        ...(rule.ttlSeconds == null ? {} : {
          ttlSeconds: integerInRange(rule.ttlSeconds, 1, 86_400, 60),
        }),
      }];
    }),
  };
}

export function evaluateRoute(requestOrPath, configValue) {
  const config = normalizeReadAccelerationConfig(configValue);
  const request = requestOrPath instanceof Request ? requestOrPath : null;
  const path = normalizeRoutePath(request ? new URL(request.url).pathname : requestOrPath);
  if (!config.enabled) return decision(false, "disabled", path, config);
  if (request && !["GET", "HEAD"].includes(request.method.toUpperCase())) {
    return decision(false, "method", path, config);
  }
  const rule = matchingRule(path, config.rules);
  if (rule?.action === "exclude") return decision(false, "rule_excluded", path, config, rule);
  if (rule?.action === "accelerate") return decision(true, "rule_accelerated", path, config, rule);
  if (config.mode === "rules") return decision(false, "rule_required", path, config);
  return decision(true, "automatic", path, config);
}

export class MemoryConfigurationStore {
  constructor(initial = DEFAULT_READ_ACCELERATION_CONFIG) {
    this.value = normalizeReadAccelerationConfig(initial);
  }

  async get() {
    return structuredClone(this.value);
  }

  async set(next, { expectedRevision } = {}) {
    if (expectedRevision != null && expectedRevision !== this.value.revision) {
      const error = new Error("configuration revision does not match");
      error.name = "ConfigurationConflictError";
      throw error;
    }
    this.value = normalizeReadAccelerationConfig({
      ...this.value,
      ...next,
      revision: this.value.revision + 1,
    });
    return this.get();
  }
}

export class RouteRegistry {
  constructor({ maxRoutes = 250, now = () => Date.now() } = {}) {
    this.maxRoutes = Number.isSafeInteger(maxRoutes) && maxRoutes > 0 ? maxRoutes : 250;
    this.now = now;
    this.routes = new Map();
  }

  observe(requestOrPath, result = {}) {
    const path = normalizeRoutePath(
      requestOrPath instanceof Request ? new URL(requestOrPath.url).pathname : requestOrPath,
    );
    const prior = this.routes.get(path);
    const next = {
      path,
      requests: (prior?.requests || 0) + 1,
      eligible: (prior?.eligible || 0) + (result.eligible === true ? 1 : 0),
      bypassed: (prior?.bypassed || 0) + (result.eligible === true ? 0 : 1),
      lastReason: String(result.reason || "unknown"),
      lastSeenAt: new Date(this.now()).toISOString(),
    };
    this.routes.delete(path);
    this.routes.set(path, next);
    while (this.routes.size > this.maxRoutes) {
      this.routes.delete(this.routes.keys().next().value);
    }
    return { ...next };
  }

  list() {
    return [...this.routes.values()].reverse().map((route) => ({ ...route }));
  }
}

function matchingRule(path, rules) {
  return rules
    .filter((rule) => rule.kind === "page"
      ? rule.path === path
      : path === rule.path || path.startsWith(`${rule.path === "/" ? "" : rule.path}/`))
    .sort((left, right) =>
      right.path.length - left.path.length
      || Number(right.kind === "page") - Number(left.kind === "page"))[0] || null;
}

function decision(eligible, reason, path, config, rule) {
  return {
    eligible,
    reason,
    path,
    ttlSeconds: rule?.ttlSeconds || config.defaultTtlSeconds,
    rule: rule ? { ...rule } : null,
    revision: config.revision,
  };
}

function integerInRange(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= minimum && number <= maximum
    ? number
    : fallback;
}
