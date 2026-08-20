import type { EdgePgValue, PartitioningReference, PostgresCatalogAlterationReference, FieldDef, PostgresCatalogObjectReference, ResultColumnReference, SourceRewrite, TableConstraintCommand } from "./types";
export type PartitionCatalogDescription = {
    oid: number;
    relationName: string;
    relkind: "p" | "r";
    bound: string | null;
};
export type PartitionWorkspaceObject = {
    type: "view" | "trigger";
    name: string;
    sql: string;
};
export declare function partitionTransactionWorkspace(db: D1Database, requestedTables: string[]): Promise<{
    tables: string[];
    objects: PartitionWorkspaceObject[];
}>;
export declare function resolvePartitionReturningTableoids(db: D1Database, parentPhysicalName: string, rows: Array<Record<string, unknown> | EdgePgValue[]>, fields: FieldDef[], plannedIndexes?: number[]): Promise<void>;
export declare function ensurePartitionSchema(db: D1Database): Promise<void>;
export declare function registerPartitionedTable(db: D1Database, reference: PartitioningReference): Promise<void>;
export declare function dropPartitionRelations(db: D1Database, identities: Array<{
    schema: string;
    relation: string;
    physicalName: string;
}>): Promise<Set<string>>;
export declare function partitionLeafPhysicalNames(db: D1Database, physicalName: string): Promise<string[] | null>;
export declare function partitionKeyDefinitionByOid(db: D1Database, oid: number): Promise<string | null>;
export declare function partitionConstraintDefinitionByChildOid(db: D1Database, oid: number): Promise<string | null>;
export declare function partitionParentByChildOid(db: D1Database, oid: number): Promise<PartitionCatalogDescription | null>;
export declare function partitionParentsByChildOid(db: D1Database, oid: number): Promise<PartitionCatalogDescription[]>;
export declare function partitionChildrenByParentOid(db: D1Database, oid: number): Promise<PartitionCatalogDescription[]>;
export declare function partitionQueryRewrites(db: D1Database, sql: string, resultColumns: ResultColumnReference[], tableoidReferences?: Array<{
    start: number;
    end: number;
    sortByRelationOid?: boolean;
}>): Promise<SourceRewrite[]>;
export declare function partitionInsertSql(db: D1Database, sql: string): Promise<string>;
export declare function createTablePartition(db: D1Database, reference: PartitioningReference, owner: string): Promise<void>;
export declare function attachTablePartition(db: D1Database, reference: PartitioningReference): Promise<void>;
export declare function detachTablePartition(db: D1Database, reference: PartitioningReference): Promise<void>;
export declare function alterPartitionedTableColumns(db: D1Database, alteration: PostgresCatalogAlterationReference): Promise<boolean>;
export declare function isPartitionedRelation(db: D1Database, schema: string, name: string): Promise<boolean>;
export declare function preparePartitionedIndex(db: D1Database, object: PostgresCatalogObjectReference): Promise<boolean>;
export declare function attachPartitionIndex(db: D1Database, parentName: string, childName: string): Promise<void>;
export declare function partitionConstraintCommands(db: D1Database, commands: TableConstraintCommand[]): Promise<TableConstraintCommand[]>;
