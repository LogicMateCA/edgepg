export type CacheMode = "fresh" | "observe" | "public" | "strict";

export interface SecurityIdentity {
  database: unknown;
  tenant: unknown;
  role: unknown;
  user: unknown;
  searchPath: unknown;
  rlsContext: unknown;
  permissionContext: unknown;
}

export interface CacheStore<T = unknown> {
  get(key: string): Promise<T | null>;
  getWithMetadata?(key: string): Promise<{
    value: T;
    ttlSeconds: number;
    expiresAt: number | null;
  } | null>;
  set(key: string, value: T, options: { ttlSeconds: number }): Promise<boolean | void>;
  setUntil?(key: string, value: T, expiresAt: number): Promise<boolean | void>;
  delete?(key: string): Promise<unknown>;
  clear?(): Promise<unknown>;
}

export interface ExecutionContextLike {
  waitUntil?(promise: Promise<unknown>): void;
}

export interface DependencySnapshot {
  complete: boolean;
  versions: Record<string, string | number>;
}

export interface DependencyAdapter {
  snapshot(dependencies: string[], request?: Request): Promise<DependencySnapshot>;
}

export interface CacheContext {
  dependencies: Set<string>;
  track(...dependencies: Array<string | string[]>): void;
}

export interface MetricsSink {
  emit(event: {
    outcome: string;
    reason?: string;
    durationMs: number;
    error?: string;
  }): void;
}

export interface AcceleratorOptions {
  cache: CacheStore;
  mode?: CacheMode;
  buildId?: string;
  ttlSeconds?: number;
  maxBodyBytes?: number;
  varyHeaders?: string[];
  resolveIdentity?: (request: Request) => unknown | Promise<unknown>;
  resolveDependencies?: (request: Request) => string[] | Promise<string[]>;
  dependencyAdapter?: DependencyAdapter;
  versionTimeoutMs?: number;
  metrics?: MetricsSink;
  now?: () => number;
  coalesce?: boolean;
  resolveConfiguration?: (
    request: Request,
  ) => ReadAccelerationConfig | Promise<ReadAccelerationConfig>;
  routeRegistry?: Pick<RouteRegistry, "observe">;
}

export interface WebAccelerator {
  mode: CacheMode;
  handle(
    input: { request: Request; executionContext?: ExecutionContextLike },
    handler: (context: CacheContext) => Response | Promise<Response>,
  ): Promise<Response>;
}

export function createWebAccelerator(options: AcceleratorOptions): WebAccelerator;

export interface CommercialLicenseGate {
  require(feature?: "edgepg" | "accelerator"): Promise<{
    version: 2;
    projectId: string;
    accessSource: "trial" | "subscription" | "legacy";
    features: Array<"edgepg" | "accelerator">;
    issuedAt: string;
    expiresAt: string;
    sequence: number;
  }>;
}

export function createAcceleratorLicenseGate(options: {
  projectId: string;
  publicKey: string;
  loadToken(): string | Promise<string>;
  refreshMs?: number;
  now?: () => number;
}): CommercialLicenseGate;

export function createLicensedWebAccelerator(
  options: AcceleratorOptions & { licenseGate: CommercialLicenseGate },
): WebAccelerator;

export function clearAcceleratorLicenseCache(): void;

export function verifyCommercialLease(
  token: string,
  publicKey: string,
  expectedProjectId: string,
  now?: number,
): ReturnType<CommercialLicenseGate["require"]>;

export type ReadAccelerationMode = "automatic" | "rules";
export type ReadAccelerationRuleAction = "accelerate" | "exclude";
export type ReadAccelerationRuleKind = "page" | "section";

export interface ReadAccelerationRule {
  id: string;
  path: string;
  kind: ReadAccelerationRuleKind;
  action: ReadAccelerationRuleAction;
  ttlSeconds?: number;
}

export interface ReadAccelerationConfig {
  schemaVersion?: 1;
  enabled: boolean;
  mode: ReadAccelerationMode;
  defaultTtlSeconds?: number;
  revision?: number;
  rules: ReadAccelerationRule[];
}

export interface RouteDecision {
  eligible: boolean;
  reason: string;
  path: string;
  ttlSeconds: number;
  rule: ReadAccelerationRule | null;
  revision: number;
}

export const DEFAULT_READ_ACCELERATION_CONFIG: Readonly<ReadAccelerationConfig>;
export function normalizeRoutePath(value: string): string;
export function normalizeReadAccelerationConfig(
  value?: Partial<ReadAccelerationConfig>,
): Required<ReadAccelerationConfig>;
export function evaluateRoute(
  requestOrPath: Request | string,
  config: Partial<ReadAccelerationConfig>,
): RouteDecision;

export class MemoryConfigurationStore {
  constructor(initial?: Partial<ReadAccelerationConfig>);
  get(): Promise<Required<ReadAccelerationConfig>>;
  set(
    next: Partial<ReadAccelerationConfig>,
    options?: { expectedRevision?: number },
  ): Promise<Required<ReadAccelerationConfig>>;
}

export class RouteRegistry {
  constructor(options?: { maxRoutes?: number; now?: () => number });
  observe(
    requestOrPath: Request | string,
    result?: { eligible?: boolean; reason?: string },
  ): {
    path: string;
    requests: number;
    eligible: number;
    bypassed: number;
    lastReason: string;
    lastSeenAt: string;
  };
  list(): Array<{
    path: string;
    requests: number;
    eligible: number;
    bypassed: number;
    lastReason: string;
    lastSeenAt: string;
  }>;
}

export class MemoryCache<T = unknown> implements CacheStore<T> {
  constructor(options?: {
    maxEntries?: number;
    maxBytes?: number;
    now?: () => number;
  });
  get(key: string): Promise<T | null>;
  getWithMetadata(key: string): Promise<{ value: T; ttlSeconds: number; expiresAt: number } | null>;
  set(key: string, value: T, options: { ttlSeconds: number }): Promise<boolean>;
  setUntil(key: string, value: T, expiresAt: number): Promise<boolean>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface KVNamespaceLike {
  get(key: string, type: "json"): Promise<unknown>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<unknown>;
  delete?(key: string): Promise<unknown>;
}

export interface CacheApiLike {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<unknown>;
  delete?(request: Request): Promise<boolean | unknown>;
}

export class CacheApiCache<T = unknown> implements CacheStore<T> {
  constructor(cache: CacheApiLike, options: {
    origin: string;
    prefix?: string;
    now?: () => number;
  });
  get(key: string): Promise<T | null>;
  getWithMetadata(key: string): Promise<{ value: T; ttlSeconds: number; expiresAt: number } | null>;
  set(key: string, value: T, options: { ttlSeconds: number }): Promise<boolean>;
  setUntil(key: string, value: T, expiresAt: number): Promise<boolean>;
  delete(key: string): Promise<void>;
}

export class KVCache<T = unknown> implements CacheStore<T> {
  constructor(namespace: KVNamespaceLike, options?: {
    prefix?: string;
    now?: () => number;
  });
  get(key: string): Promise<T | null>;
  getWithMetadata(key: string): Promise<{ value: T; ttlSeconds: number; expiresAt: number | null } | null>;
  setUntil(key: string, value: T, expiresAt: number): Promise<boolean>;
  set(key: string, value: T, options: { ttlSeconds: number }): Promise<boolean>;
  delete(key: string): Promise<void>;
}

export class TieredCache<T = unknown> implements CacheStore<T> {
  constructor(memory: CacheStore<T>, persistent: CacheStore<T>);
  get(key: string): Promise<T | null>;
  getWithMetadata(key: string): Promise<{ value: T; ttlSeconds: number; expiresAt: number } | null>;
  set(key: string, value: T, options: { ttlSeconds: number }): Promise<boolean>;
  setUntil(key: string, value: T, expiresAt: number): Promise<boolean>;
  delete(key: string): Promise<void>;
}

export function createCloudflareCache(options?: {
  cache?: CacheApiLike;
  cacheOrigin?: string;
  kv?: KVNamespaceLike;
  prefix?: string;
  memoryEntries?: number;
  memoryBytes?: number;
}): CacheStore;

export class MemoryMetrics implements MetricsSink {
  emit(event: Parameters<MetricsSink["emit"]>[0]): void;
  snapshot(): {
    counts: Record<string, number>;
    latency: { measured: number; p50Ms?: number; p95Ms?: number };
    recent: Array<Record<string, unknown>>;
  };
}

export function createAnalyticsEngineMetrics(
  dataset: {
    writeDataPoint(point: {
      blobs: string[];
      doubles: number[];
      indexes: string[];
    }): unknown;
  },
  options?: { service?: string; environment?: string },
): MetricsSink;

export function createCompositeMetrics(...sinks: MetricsSink[]): MetricsSink;

export class ShadowReleaseGate {
  constructor(options?: { minimumComparisons?: number });
  emit(event: ShadowObservation): void;
  snapshot(): {
    pass: boolean;
    minimumComparisons: number;
    comparisons: number;
    matches: number;
    mismatches: number;
    candidateErrors: number;
    reasons: Record<string, number>;
  };
}

export function createControlPlane(options: {
  authenticate(request: Request): boolean | Promise<boolean>;
  getMetrics(request: Request): unknown | Promise<unknown>;
  purge?: (
    payload: Record<string, unknown>,
    request: Request,
  ) => unknown | Promise<unknown>;
  prewarm?: (
    payload: Record<string, unknown>,
    request: Request,
  ) => unknown | Promise<unknown>;
  basePath?: string;
  maxBodyBytes?: number;
}): {
  fetch(request: Request): Promise<Response>;
};

export function withCacheTimeout<T>(
  cache: CacheStore<T>,
  options?: {
    readTimeoutMs?: number;
    writeTimeoutMs?: number;
    mutationTimeoutMs?: number;
  },
): CacheStore<T>;

export function createFetchHandler(options: {
  accelerator: WebAccelerator;
  origin: (
    request: Request,
    env: unknown,
    executionContext: ExecutionContextLike | undefined,
    cacheContext: CacheContext,
  ) => Response | Promise<Response>;
}): (
  request: Request,
  env?: unknown,
  executionContext?: ExecutionContextLike,
) => Promise<Response>;

export function createPagesHandler<T extends {
  request: Request;
  waitUntil?(promise: Promise<unknown>): void;
}>(options: {
  accelerator: WebAccelerator;
  origin: (context: T, cacheContext: CacheContext) => Response | Promise<Response>;
}): (context: T) => Promise<Response>;

export function createRouteHandler<T>(options: {
  accelerator: WebAccelerator;
  route: (
    request: Request,
    routeContext: T,
    cacheContext: CacheContext,
  ) => Response | Promise<Response>;
  getExecutionContext?: (
    request: Request,
    routeContext: T,
  ) => ExecutionContextLike | undefined;
}): (request: Request, routeContext: T) => Promise<Response>;

export interface ShadowObservation {
  outcome: "match" | "mismatch" | "candidate_error";
  match?: boolean;
  reasons?: string[];
  error?: string;
  origin?: Record<string, unknown>;
  candidate?: Record<string, unknown>;
}

export function createShadowHandler<T extends unknown[]>(options: {
  origin: (request: Request, ...args: T) => Response | Promise<Response>;
  candidate: (request: Request, ...args: T) => Response | Promise<Response>;
  onObservation?: (event: ShadowObservation) => unknown;
  sampleRate?: number;
  random?: () => number;
  compareHeaders?: string[];
}): (request: Request, ...args: T) => Promise<Response>;

export function compareResponses(
  origin: Response,
  candidate: Response,
  compareHeaders?: string[],
): Promise<{
  match: boolean;
  reasons: string[];
  origin: Record<string, unknown>;
  candidate: Record<string, unknown>;
}>;

export function createIdentityResolver(fields: Record<
  keyof SecurityIdentity,
  unknown | ((request?: Request) => unknown | Promise<unknown>)
>): (request?: Request) => Promise<SecurityIdentity | null>;

export function isCompleteIdentity(identity: unknown): identity is SecurityIdentity;

export function createVersionCallbackAdapter(options: {
  load(
    dependencies: string[],
    request?: Request,
  ): Record<string, string | number> | Map<string, string | number>
    | Promise<Record<string, string | number> | Map<string, string | number>>;
}): DependencyAdapter;

export function createD1TableVersionAdapter(
  database: {
    prepare(sql: string): {
      bind(...values: unknown[]): unknown;
      run(): Promise<unknown>;
      all(): Promise<{ results?: Array<Record<string, unknown>> }>;
    };
    batch(statements: unknown[]): Promise<unknown>;
  },
  options?: { tableName?: string },
): DependencyAdapter & {
  initialize(): Promise<unknown>;
  prepareBumps(dependencies: string[]): unknown[];
};

export function createCacheController(options: AcceleratorOptions & {
  accelerator: WebAccelerator;
}): {
  resolve(request: Request): Promise<{
    cacheable: boolean;
    reason?: string;
    key?: string;
  }>;
  purge(request: Request): Promise<{ purged: boolean; reason?: string }>;
  prewarm(
    input: { request: Request; executionContext?: ExecutionContextLike },
    handler: (context: CacheContext) => Response | Promise<Response>,
  ): Promise<{ warmed: boolean; reason?: string; response?: Response }>;
};

export interface DataCacheOptions {
  tags?: string | string[];
  request?: Request;
  ttl?: number;
}

export function createDataCache(options: {
  cache: CacheStore;
  namespace?: string;
  ttlSeconds?: number;
  resolveIdentity(request?: Request): unknown | Promise<unknown>;
  tagAdapter?: DependencyAdapter;
  bumpTags?: (tags: string[], request?: Request) => unknown | Promise<unknown>;
}): {
  get<T>(key: unknown, options?: DataCacheOptions): Promise<T | undefined>;
  set<T>(key: unknown, value: T, options?: DataCacheOptions): Promise<boolean>;
  invalidateTag(tags: string | string[], request?: Request): Promise<boolean>;
  cachedQuery<T>(
    key: unknown,
    loader: () => T | Promise<T>,
    options?: DataCacheOptions,
  ): Promise<T>;
};

export function observeDatabaseClient<T extends { query(...args: unknown[]): unknown }>(
  client: T,
  options: {
    analyze(sql: string): unknown | Promise<unknown>;
    currentContext(): CacheContext | null | undefined;
  },
): T;

export function evaluateRequest(
  request: Request,
  options: Record<string, unknown>,
): { cacheable: boolean; reason?: string };
export function evaluateResponse(
  response: Response,
  options?: { varyHeaders?: string[] },
): {
  cacheable: boolean;
  reason?: string;
};
export function responseCacheKey(options: Record<string, unknown>): Promise<string>;
export function stableStringify(value: unknown): string;
