import type { SemanticCommand } from "./types";
export type DefaultPrivilegesCommand = Extract<SemanticCommand, {
    kind: "default-privileges";
}>;
export type DefaultPrivilegeObjectType = DefaultPrivilegesCommand["objectType"];
export declare function forgetDefaultPrivilegeCaches(db: D1Database): void;
export declare function executeDefaultPrivilegesCommand(db: D1Database, command: DefaultPrivilegesCommand, actor: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function defaultTablePrivilegeStatements(db: D1Database, owner: string, schema: string, name: string, physicalName: string): Promise<D1PreparedStatement[]>;
export declare function applyObjectDefaultPrivileges(db: D1Database, objectType: Exclude<DefaultPrivilegeObjectType, "table" | "schema">, owner: string, schema: string, name: string, physicalName: string): Promise<void>;
export declare function applySchemaDefaultPrivileges(db: D1Database, owner: string, schema: string): Promise<void>;
export declare function schemaDefaultPrivilegeStatements(db: D1Database, owner: string, schema: string): Promise<D1PreparedStatement[]>;
export declare function assertObjectPrivilege(db: D1Database, objectType: Exclude<DefaultPrivilegeObjectType, "table" | "schema">, physicalName: string, actor: string, privileges: string[]): Promise<void>;
export declare function ensureDefaultPrivilegeSchema(db: D1Database): Promise<void>;
