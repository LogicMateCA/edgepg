import type { QueryExecutionPlan } from "./types";
export declare function readReplicaRequiresPrimary(plan: QueryExecutionPlan, readReplication: boolean, advancedManifestDefined: boolean, advancedTables: ReadonlySet<string>, sql?: string): boolean;
