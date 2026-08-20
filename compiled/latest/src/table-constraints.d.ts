import type { PostgresTableRebuildReference, SemanticCommand, TableConstraintCommand } from "./types";
type CheckCommand = Extract<SemanticCommand, {
    kind: "table-check-constraint";
}>;
type SetConstraintsCommand = Extract<SemanticCommand, {
    kind: "set-constraints";
}>;
type CheckCompileContext = {
    tablePhysicalName: string;
    displayTableName: string;
};
export declare function forgetTableConstraintMetadataCaches(db: D1Database, ...tables: string[]): void;
export declare function validateSetConstraintsCommand(db: D1Database, command: SetConstraintsCommand, searchPath: string[]): Promise<void>;
export declare function executeTableCheckConstraint(db: D1Database, command: CheckCommand, extraStatements?: D1PreparedStatement[]): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function alterConstraintDeferrability(db: D1Database, command: CheckCommand): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function prepareCreateTableConstraints(db: D1Database, commands: TableConstraintCommand[], validationDb?: D1Database, includeMetadata?: boolean): Promise<D1PreparedStatement[]>;
export declare function notNullConstraintDescendants(db: D1Database, physicalName: string): Promise<{
    physical_name: string;
    table_name: string;
    inherited_count: number;
}[]>;
export declare function postgresCheckConstraintDefinition(value: unknown, context: CheckCompileContext): string;
export declare function ensureTableConstraintSchema(db: D1Database): Promise<void>;
export declare function prepareNotNullConstraintAlterationSql(db: D1Database, plan: PostgresTableRebuildReference): Promise<string[]>;
export declare function prepareAddedColumnNotNullConstraintSql(db: D1Database, input: {
    physicalName: string;
    displayName: string;
    column: string;
    constraintName: string;
    noInherit?: boolean;
}): Promise<string[]>;
export declare function notNullConstraintTriggerSql(physicalName: string, displayName: string, column: string): string[];
export declare function notNullConstraintTriggerNames(physicalName: string, column: string): readonly [`__edgepg_not_null_${string}_insert`, `__edgepg_not_null_${string}_update`];
export interface ExclusionReindexEntry {
    tablePhysicalName: string;
    constraintName: string;
    validationSql: string;
}
export declare function exclusionReindexEntries(db: D1Database, filters?: {
    schema?: string;
    constraintName?: string;
    tablePhysicalName?: string;
}): Promise<ExclusionReindexEntry[]>;
export declare function tableConstraintBatchError(error: unknown, command: TableConstraintCommand): unknown;
export {};
