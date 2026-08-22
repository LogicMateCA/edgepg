import type { PostgresTableRebuildReference, QueryNotice } from "./types";
export declare function prepareTableRebuild(database: D1Database, plan: PostgresTableRebuildReference): Promise<D1PreparedStatement[]>;
export interface DropColumnsRebuildPlan {
    physicalName: string;
    schema: string;
    name: string;
    columns: string[];
    generatedColumns?: Array<{
        column: string;
        expressionSql: string;
        stored: boolean;
    }>;
    excludedObjectNamePrefixes?: string[];
}
export declare function prepareDropColumnsRebuild(database: D1Database, plan: DropColumnsRebuildPlan): Promise<D1PreparedStatement[]>;
export declare function executeWorkspaceTableRebuild(sql: SqlStorage, plan: PostgresTableRebuildReference): {
    applied: boolean;
    notices: QueryNotice[];
};
export declare function sqliteType(pgType?: string): "BLOB" | "INTEGER" | "REAL" | "TEXT";
