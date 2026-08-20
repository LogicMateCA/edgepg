import type { DependencyAdapter } from "./index.d.ts";

export function createEdgePgAdapter(options: {
  plan(sql: string): unknown | Promise<unknown>;
  getVersions(
    dependencies: string[],
    request?: Request,
  ): unknown | Promise<unknown>;
}): DependencyAdapter & {
  kind: "edgepg";
  capabilities: Record<string, boolean>;
  analyze(sql: string): Promise<{
    complete: boolean;
    dependencies: string[];
  }>;
};
