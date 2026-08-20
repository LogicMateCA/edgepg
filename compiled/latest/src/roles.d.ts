import { type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
type RoleCommand = Extract<SemanticCommand, {
    kind: "role";
}>;
type PrivilegeCommand = Extract<SemanticCommand, {
    kind: "privilege";
}>;
type CustomTypeCommand = Extract<SemanticCommand, {
    kind: "custom-type";
}>;
type SchemaCommand = Extract<SemanticCommand, {
    kind: "schema";
}>;
type Privilege = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE" | "REFERENCES" | "TRIGGER" | "MAINTAIN";
type SchemaPrivilege = "USAGE" | "CREATE";
export type DatabasePrivilege = "CREATE" | "CONNECT" | "TEMPORARY";
export interface DatabasePrivilegeRequest {
    privilege: DatabasePrivilege;
    grantOption: boolean;
}
export interface SchemaPrivilegeRequest {
    privilege: SchemaPrivilege;
    grantOption: boolean;
}
interface TableOwnerReference {
    schema: string;
    name: string;
    physicalName: string;
}
export interface RoleAdmission {
    sessionId: string;
    role: string;
    database: string;
}
export declare function executeRoleCommand(db: D1Database, command: RoleCommand, actor: string, sessionUser?: string, settings?: ReadonlyMap<string, string>): Promise<SemanticExecutionResult>;
export declare function executePrivilegeCommand(db: D1Database, command: PrivilegeCommand, actor: string, sessionUser?: string): Promise<SemanticExecutionResult>;
export declare function resolveTablePrivilegeRelations(db: D1Database, command: PrivilegeCommand, actor: string): Promise<{
    schema: string;
    name: string;
    physicalName: string;
}[]>;
export declare function assertTablePrivileges(db: D1Database, references: Array<{
    physicalName: string;
    relation: string;
    privilege: Privilege;
    columns?: string[];
}>, currentRole: string, options?: {
    catalogPresent?: boolean;
}): Promise<void>;
export declare function assertTableOwner(db: D1Database, physicalName: string, relation: string, currentRole: string): Promise<void>;
export declare function assertMaterializedViewRefreshAuthority(db: D1Database, physicalName: string, relation: string, currentRole: string): Promise<void>;
export declare function assertViewOwnerSourcePrivileges(db: D1Database, physicalNames: string[], options?: {
    catalogPresent?: boolean;
}): Promise<void>;
export declare function forgetViewOwnerSourceRows(db: D1Database): void;
export declare function assertReindexPrivileges(db: D1Database, command: {
    targetType: "index" | "table" | "schema" | "database" | "system";
    name: string;
}, currentRole: string, tablePhysicalName?: string): Promise<void>;
export declare function assertDomainCommandPrivileges(db: D1Database, command: CustomTypeCommand, actor: string, sessionUser?: string, database?: string, databaseOwner?: string): Promise<void>;
export declare function assertTypeCommandPrivileges(db: D1Database, command: CustomTypeCommand, actor: string, sessionUser?: string, database?: string, databaseOwner?: string): Promise<void>;
export declare function registerTableOwnerStatement(db: D1Database, table: {
    schema: string;
    name: string;
    physicalName: string;
}, owner: string): D1PreparedStatement;
export declare function canMaintainRelation(db: D1Database, physicalName: string, currentRole: string): Promise<boolean>;
export declare function canSetRole(db: D1Database, sessionUser: string, target: string): Promise<boolean>;
export declare function canSetSessionAuthorization(db: D1Database, authenticatedUser: string, target: string): Promise<boolean>;
export declare function ensureRoleSchema(db: D1Database, database?: string, owner?: string): Promise<void>;
export declare function ensureTableOwnershipSchema(db: D1Database, database?: string, owner?: string): Promise<void>;
export declare function assertCreateTableSchemaPrivilege(db: D1Database, actor: string, schema: string, database?: string, owner?: string): Promise<void>;
export declare function forgetRoleSchema(db: D1Database): void;
export declare function prepareTableOwnerStatement(db: D1Database, table: TableOwnerReference, owner: string): D1PreparedStatement;
export declare function admitRoleSession(db: D1Database, role: string, database: string, authenticationMethod: "trusted" | "password", requestedSessionId?: string): Promise<RoleAdmission>;
export declare function refreshRoleSession(db: D1Database, admission: RoleAdmission): Promise<void>;
export declare function releaseRoleSession(db: D1Database, sessionId: string): Promise<void>;
export declare function loadRoleSettings(db: D1Database, role: string, database?: string): Promise<Map<string, string>>;
export declare function forgetRoleSettings(db: D1Database): void;
export declare function rememberMissingRoleSettingsSchema(db: D1Database): void;
export declare const gucDefaults: Readonly<Record<string, string>>;
export declare function gucDisplayName(name: string): string;
export declare function gucSettingDefault(name: string): string;
export declare function validateGucSettingName(name: string): void;
export declare function normalizeGucSettingValue(name: string, input: string): string;
export declare function hasDatabasePrivilege(db: D1Database, actor: string, database: string, privilege: DatabasePrivilege, grantOption?: boolean): Promise<boolean>;
export declare function assertDatabasePrivilege(db: D1Database, actor: string, database: string, privilege: DatabasePrivilege): Promise<void>;
export declare function hasSchemaPrivilege(db: D1Database, actor: string, schema: string, privilege: SchemaPrivilege, grantOption?: boolean): Promise<boolean>;
export declare function assertSchemaPrivilege(db: D1Database, actor: string, schema: string, privilege: SchemaPrivilege): Promise<void>;
export declare function assertSchemaCommandPrivileges(db: D1Database, command: SchemaCommand, currentRole: string, sessionUser?: string, database?: string): Promise<void>;
export declare function evaluateSchemaPrivilege(db: D1Database, currentRole: string, inputs: Array<string | number | boolean | null>): Promise<boolean | null>;
export declare function evaluateDatabasePrivilege(db: D1Database, currentRole: string, inputs: Array<string | number | boolean | null>): Promise<boolean | null>;
export declare function parseDatabasePrivilegeText(privilegeInput: string): DatabasePrivilegeRequest[];
export declare function parseSchemaPrivilegeText(privilegeInput: string): SchemaPrivilegeRequest[];
export declare function roleOwnsObject(db: D1Database, actor: string, owner: string): Promise<boolean>;
export {};
