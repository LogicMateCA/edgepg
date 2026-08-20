import type { DependencyAdapter } from "./index.d.ts";

export interface Analysis {
  complete: boolean;
  dependencies: string[];
}

export function conservativePostgresDependencies(sql: string): Analysis;

export function createPostgresAdapter(options: {
  query(
    sql: string,
    params: unknown[],
  ): unknown[] | { rows?: unknown[] } | Promise<unknown[] | { rows?: unknown[] }>;
  versionTable?: string;
}): DependencyAdapter & {
  kind: "postgres";
  capabilities: Record<string, boolean>;
  analyze(sql: string): Analysis;
};
