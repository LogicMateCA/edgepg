import { type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
export type EventTriggerCommand = Extract<SemanticCommand, {
    kind: "event-trigger";
}>;
export declare function ensureEventTriggerSchema(db: D1Database): Promise<void>;
export declare function executeEventTriggerCommand(db: D1Database, command: EventTriggerCommand, currentRole?: string): Promise<SemanticExecutionResult>;
export declare function eventTriggerRoutineDropStatements(db: D1Database, routineOid: number, displayName: string, cascade: boolean): Promise<D1PreparedStatement[]>;
export interface EventTriggerDispatchInput {
    tag: string;
    sql?: string;
    requestId?: string;
    transactionId?: string | null;
    replicationRole?: "origin" | "replica";
    nestingDepth?: number;
}
export interface EventTriggerDispatchResult {
    requestId: string;
    callbacks: Array<{
        trigger: string;
        event: "ddl_command_start" | "ddl_command_end";
        tag: string;
    }>;
    commandCount: number;
}
export declare function executeEventTriggerCallbacks(db: D1Database, input: EventTriggerDispatchInput): Promise<EventTriggerDispatchResult>;
export declare function assertEventTriggerDispatchSupported(db: D1Database, tag: string, replicationRole?: "origin" | "replica"): Promise<void>;
declare const eventContextBrand: unique symbol;
export interface EventTriggerDdlCommandRecord {
    readonly commandTag: string;
    readonly objectType: string;
    readonly schemaName: string | null;
    readonly objectIdentity: string;
    readonly classId: number;
    readonly objectId: number;
    readonly subObjectId: number;
    readonly inExtension: boolean;
}
export interface EventTriggerDroppedObjectRecord extends EventTriggerDdlCommandRecord {
    readonly original: boolean;
    readonly normal: boolean;
    readonly temporary: boolean;
    readonly addressNames: readonly string[];
    readonly addressArguments: readonly string[];
}
export interface EventTriggerRequestContext {
    readonly requestId: string;
    readonly transactionId: string | null;
    readonly event: "ddl_command_start" | "ddl_command_end" | "sql_drop" | "table_rewrite";
    readonly tag: string;
    readonly replicationRole: "origin" | "replica";
    readonly nestingDepth: number;
    readonly ddlCommands: readonly Readonly<EventTriggerDdlCommandRecord>[];
    readonly droppedObjects: readonly Readonly<EventTriggerDroppedObjectRecord>[];
    readonly [eventContextBrand]: true;
}
export declare function createEventTriggerRequestContext(input: Omit<EventTriggerRequestContext, typeof eventContextBrand | "ddlCommands" | "droppedObjects"> & {
    ddlCommands?: readonly EventTriggerDdlCommandRecord[];
    droppedObjects?: readonly EventTriggerDroppedObjectRecord[];
}): EventTriggerRequestContext;
export declare function assertEventTriggerContext(value: unknown): asserts value is EventTriggerRequestContext;
export declare function eventTriggerDdlCommands(context: unknown): never;
export declare function pgEventTriggerViewSql(): string;
export declare function pgEventTriggerSharedDependViewSql(): string;
export declare function pgEventTriggerSharedDependUnionSql(): string;
export declare function pgEventTriggerDependUnionSql(): string;
export declare function pgEventTriggerWorkspaceDependViewSql(): string;
export {};
