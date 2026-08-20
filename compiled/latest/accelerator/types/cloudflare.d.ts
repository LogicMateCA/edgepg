import type { CacheStore, KVNamespaceLike } from "./index.d.ts";

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
  getWithMetadata(key: string): Promise<{
    value: T;
    ttlSeconds: number;
    expiresAt: number;
  } | null>;
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
