import type { QueryNotice, SemanticCommand } from "./types";
export type SchemaCommand = Extract<SemanticCommand, {
    kind: "schema";
}>;
export type SchemaPhysicalObject = {
    type: "table" | "view" | "index";
    name: string;
    sql: string | null;
};
export type SchemaPhysicalMutation = {
    kind: "rename-table";
    from: string;
    to: string;
} | {
    kind: "drop-table";
    name: string;
} | {
    kind: "create-object";
    objectType: "view" | "index";
    name: string;
    sql: string;
} | {
    kind: "drop-object";
    objectType: "view" | "index";
    name: string;
};
export declare function executeSchemaCommand(db: D1Database, command: SchemaCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
    notices?: QueryNotice[];
}>;
export declare function createSchemaStatements(db: D1Database, command: SchemaCommand, currentRole: string): Promise<D1PreparedStatement[]>;
export declare function changeSchemaOwner(db: D1Database, schema: string, oldOwner: string, newOwner: string): Promise<void>;
export declare function ensureSchemaCatalog(db: D1Database): Promise<void>;
export declare function schemaPhysicalObjects(db: D1Database, schema: string): Promise<SchemaPhysicalObject[]>;
export declare function schemaPhysicalMutations(command: SchemaCommand, objects: SchemaPhysicalObject[]): SchemaPhysicalMutation[];
