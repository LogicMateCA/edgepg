import type { SemanticCommand } from "./types";
type DropRelationsCommand = Extract<SemanticCommand, {
    kind: "drop-relations";
}>;
type RenameTableCommand = Extract<SemanticCommand, {
    kind: "rename-table";
}>;
type ViewCommand = Extract<SemanticCommand, {
    kind: "view";
}>;
type TableOwnerCommand = Extract<SemanticCommand, {
    kind: "table-owner";
}>;
type AlterTableAddColumnsCommand = Extract<SemanticCommand, {
    kind: "alter-table-add-columns";
}>;
type AlterTablePersistenceCommand = Extract<SemanticCommand, {
    kind: "alter-table-persistence";
}>;
type AlterTableOptionsCommand = Extract<SemanticCommand, {
    kind: "alter-table-options";
}>;
type AlterTableReplicaIdentityCommand = Extract<SemanticCommand, {
    kind: "alter-table-replica-identity";
}>;
export declare function executeRenameTable(db: D1Database, command: RenameTableCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function executeTableOwner(db: D1Database, command: TableOwnerCommand, currentRole?: string, sessionUser?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function executeAlterTableAddColumns(db: D1Database, command: AlterTableAddColumnsCommand, catalogStatements?: D1PreparedStatement[], currentRole?: string): Promise<{
    command: string;
    rowCount: number;
    notices?: {
        severity: "NOTICE";
        code: string;
        message: string;
    }[] | undefined;
}>;
export declare function prepareAlterTableAddColumns(db: D1Database, command: AlterTableAddColumnsCommand, catalogStatements?: D1PreparedStatement[], currentRole?: string): Promise<D1PreparedStatement[]>;
export declare function resolveAlterTableAddColumnsCommand(db: D1Database, command: AlterTableAddColumnsCommand, currentRole?: string): Promise<{
    command: {
        kind: "alter-table-add-columns";
        schema: string;
        name: string;
        physicalName: string;
        definition: string;
        tableIfExists?: boolean;
        constraints?: import("./types").TableConstraintCommand[];
        columns: {
            name: string;
            pgType: string;
            sqliteType: string;
            notNull?: boolean;
            defaultSql?: string;
            backfillDefault?: boolean;
            notNullConstraintName?: string;
            notNullNoInherit?: boolean;
            ifNotExists?: boolean;
        }[];
    };
    notices: {
        severity: "NOTICE";
        code: string;
        message: string;
    }[];
}>;
export declare function prepareResolvedAlterTableAddColumns(db: D1Database, command: AlterTableAddColumnsCommand, catalogStatements?: D1PreparedStatement[]): D1PreparedStatement[];
export declare function alterTableAddColumnSqlStatements(command: AlterTableAddColumnsCommand): string[];
export declare function executeAlterTablePersistence(db: D1Database, command: AlterTablePersistenceCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function executeAlterTableOptions(db: D1Database, command: AlterTableOptionsCommand, currentRole?: string, requirePhysicalTable?: boolean): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function executeAlterTableReplicaIdentity(db: D1Database, command: AlterTableReplicaIdentityCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function executeViewCommand(db: D1Database, command: ViewCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function prepareViewCommandStatements(db: D1Database, command: ViewCommand, currentRole?: string): Promise<D1PreparedStatement[]>;
export declare function executeDropRelations(db: D1Database, command: DropRelationsCommand): Promise<{
    command: string;
    rowCount: number;
    notices: {
        severity: "NOTICE";
        code: string;
        message: string;
    }[] | undefined;
}>;
export declare function prepareDropRelationStatements(db: D1Database, command: DropRelationsCommand): Promise<D1PreparedStatement[]>;
export {};
