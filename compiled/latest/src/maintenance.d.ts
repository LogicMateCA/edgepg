import type { QueryNotice, SemanticCommand } from "./types";
type MaintenanceCommand = Extract<SemanticCommand, {
    kind: "maintenance";
}>;
export interface ClusterPlan {
    tableName: string;
    tablePhysicalName: string;
    indexName: string;
    reindexTarget: string;
}
export interface MaintenanceTarget {
    name: string;
    physicalName: string;
    type: "table" | "view" | "materialized-view";
    columns: string[];
}
export interface MaintenanceTargetResolution {
    targets: MaintenanceTarget[];
    notices: QueryNotice[];
}
export interface EffectiveMaintenanceOptions {
    analyze: boolean;
    full: boolean;
    values: ReadonlyMap<string, boolean | number | string>;
}
export declare function executeMaintenanceCommand(db: D1Database, command: MaintenanceCommand, currentRole?: string): Promise<{
    notices?: undefined;
    command: string;
    rowCount: number;
} | {
    command: string;
    rowCount: number;
    notices: QueryNotice[];
}>;
export declare function effectiveMaintenanceOptions(command: MaintenanceCommand): EffectiveMaintenanceOptions;
export declare function resolveMaintenanceTargets(db: D1Database, command: MaintenanceCommand, currentRole: string, options?: EffectiveMaintenanceOptions): Promise<MaintenanceTargetResolution>;
export declare function prepareAnalyzeStatements(db: D1Database, targets: MaintenanceTarget[]): D1PreparedStatement[];
export declare function maintenanceProviderNotices(_command: MaintenanceCommand, options: EffectiveMaintenanceOptions): QueryNotice[];
export declare function resolveClusterPlans(db: D1Database, command: MaintenanceCommand): Promise<ClusterPlan[]>;
export declare function prepareClusterStatements(db: D1Database, plans: ClusterPlan[]): Promise<D1PreparedStatement[]>;
export {};
