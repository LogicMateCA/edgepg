import type { PostgresCatalogTableReference, RelationRewrite, ResultColumnReference, SourceRewrite, TableConstraintCommand, TableInheritanceAlterationReference, TableInheritanceReference } from "./types";
export type TableInheritanceEdge = {
    parent_physical_name: string;
    child_physical_name: string;
    ordinal: number;
};
export declare function ensureTableInheritanceSchema(db: D1Database): Promise<void>;
export declare function tableInheritanceEdgesStatement(db: D1Database): D1PreparedStatement;
export declare function inheritedCreateTableSql(db: D1Database, reference: TableInheritanceReference, own: PostgresCatalogTableReference): Promise<string>;
export declare function registerTableInheritance(db: D1Database, reference: TableInheritanceReference, own: PostgresCatalogTableReference): Promise<void>;
export declare function alterTableInheritance(db: D1Database, reference: TableInheritanceAlterationReference): Promise<{
    command: string;
    rowCount: number;
    notices: Array<{
        severity: "NOTICE";
        code: "00000";
        message: string;
    }>;
}>;
export declare function inheritedTableConstraintCommands(db: D1Database, reference: TableInheritanceReference, ownCommands: TableConstraintCommand[]): Promise<TableConstraintCommand[]>;
export declare function inheritedNotNullMetadataStatements(db: D1Database, reference: TableInheritanceReference, commands: TableConstraintCommand[]): D1PreparedStatement[];
export declare function tableInheritanceSourceRewrites(db: D1Database, references: RelationRewrite[], sql: string, resultColumns?: ResultColumnReference[], tableoidReferences?: Array<{
    start: number;
    end: number;
}>, prefetchedEdges?: TableInheritanceEdge[]): Promise<{
    rewrites: SourceRewrite[];
    consumedLocations: Set<number>;
    consumedTableoidStarts: Set<number>;
}>;
export declare function tableInheritanceMutationRelations(db: D1Database, parentPhysicalName: string): Promise<{
    schema_name: string;
    table_name: string;
    physical_name: string;
}[] | {
    schema_name: string;
    table_name: string;
    physical_name: string;
    columns_json: string;
}[]>;
