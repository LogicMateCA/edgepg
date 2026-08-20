import { EdgePgSemanticError, type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
type TriggerCommand = Extract<SemanticCommand, {
    kind: "trigger";
}>;
export interface MergeStatementTriggerProgram {
    name: string;
    timing: "before" | "after";
    event: "insert" | "update" | "delete";
    sql: string;
    tables: string[];
    oldTable?: string;
    newTable?: string;
}
export interface TruncateStatementTriggerProgram {
    name: string;
    table: string;
    timing: "before" | "after";
    statements: string[];
    tables: string[];
}
export interface CandidateRowAssignment {
    column: string;
    expression: string;
}
export interface CandidateReturnNullGuard {
    expression: string;
    assignmentCount: number;
}
export interface BeforeInsertCandidateProgram {
    name: string;
    assignments: CandidateRowAssignment[];
    returnNullGuards?: CandidateReturnNullGuard[];
    predicate?: string;
    columns?: string[];
}
export interface TriggerSequenceAction {
    id: string;
    predicate: string;
    sequences: Array<{
        column: string;
        logicalName: string;
        physicalName: string;
    }>;
}
export declare function executeTriggerCommand(db: D1Database, command: TriggerCommand): Promise<SemanticExecutionResult>;
export declare function triggerCatalogSyncStatements(source: D1Database, target: D1Database, tableName: string): Promise<{
    before: D1PreparedStatement[];
    after: D1PreparedStatement[];
}>;
export declare function triggerExecutionError(error: unknown): EdgePgSemanticError | null;
export declare function triggerRefreshStatements(db: D1Database, routineName: string, astJson: string | null): Promise<D1PreparedStatement[]>;
export declare function dropTriggerDependencyStatements(db: D1Database, routineName: string, cascade: boolean): Promise<D1PreparedStatement[]>;
export declare function beforeInsertCandidatePrograms(db: D1Database, tableName: string): Promise<BeforeInsertCandidateProgram[]>;
export declare function beforeUpdateCandidatePrograms(db: D1Database, tableName: string): Promise<BeforeInsertCandidateProgram[]>;
export declare function triggerSequenceActions(db: D1Database, tableName: string, event: "insert" | "update"): Promise<TriggerSequenceAction[]>;
export declare function assignmentExpression(source: string): string | undefined;
export declare function triggerDependencyTables(db: D1Database, tableName: string, pendingCommand?: TriggerCommand): Promise<string[]>;
export declare function insteadOfTriggerDependencyTables(db: D1Database, tableName: string, event: "insert" | "update" | "delete"): Promise<string[] | null>;
export declare function assertInsteadOfTriggerDependenciesNativeSafe(db: D1Database, tables: string[]): Promise<void>;
export declare function raiseConditionSqlState(condition: string): string;
export declare function mergeStatementTriggerPrograms(db: D1Database, tableName: string, events: ReadonlySet<"insert" | "update" | "delete">): Promise<MergeStatementTriggerProgram[]>;
export declare function truncateStatementTriggerPrograms(db: D1Database, tableNames: string[]): Promise<TruncateStatementTriggerProgram[]>;
export {};
