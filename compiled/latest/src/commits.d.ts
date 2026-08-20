import type { EdgePgValue } from "./types";
import type { TriggerSequenceReservationPlan } from "./candidate-rows";
export interface CommittedMutationInput {
    originalSql: string;
    compiledSql: string;
    params: EdgePgValue[];
    statement: D1PreparedStatement;
    command: string;
    tables: string[];
    tablesClosed?: boolean;
    beforeStatements?: D1PreparedStatement[];
    afterStatements?: D1PreparedStatement[];
    rowCountFromPendingChanges?: boolean;
    rowCountFromResultRows?: boolean;
    captureChanges?: boolean;
    requiresChangeCapture?: boolean;
    versionOnlyCommit?: boolean;
    versionTriggerTables?: string[];
}
export interface CommittedMutationResult<T extends Record<string, unknown> = Record<string, unknown>> {
    transactionId: string;
    result: D1Result<T>;
    capturedChanges?: CapturedMutationChange[];
}
export interface CapturedMutationChange {
    kind: "insert" | "update" | "delete";
    table: string;
    old: Record<string, unknown> | null;
    new: Record<string, unknown> | null;
}
export type TransactionRowChange = {
    kind: "insert";
    table: string;
    values: Record<string, EdgePgValue>;
} | {
    kind: "update";
    table: string;
    rowId?: number;
    keys: Record<string, EdgePgValue>;
    values: Record<string, EdgePgValue>;
} | {
    kind: "delete";
    table: string;
    rowId?: number;
    keys: Record<string, EdgePgValue>;
    values?: Record<string, EdgePgValue>;
};
export interface TransactionBulkInsert {
    table: string;
    columns: string[];
    rowCount: number;
    chunks: string[];
}
export declare const TRANSACTION_BULK_INSERT_MINIMUM_ROWS = 1000;
export declare const TRANSACTION_BULK_INSERT_MAX_COLUMNS = 50;
export declare function compactTransactionInsertChanges(changes: TransactionRowChange[], minimumRows: number, maximumColumns: number): {
    changes: TransactionRowChange[];
    bulkInserts: TransactionBulkInsert[];
};
export interface OptimisticCommitInput {
    versions: Map<string, number>;
    changes: TransactionRowChange[];
    bulkInserts?: TransactionBulkInsert[];
    triggerSequences?: TriggerSequenceReservationPlan;
    prepared?: {
        gid: string;
        fenceToken: string;
    };
    afterStatements?: D1PreparedStatement[];
    triggerTables?: string[];
    skipConstraintCatalogs?: boolean;
    versionTriggerTables?: string[];
    forceTransactionClaim?: boolean;
}
export interface RawOptimisticCommitInput {
    statements: Array<{
        sql: string;
        params: EdgePgValue[];
    }>;
    writtenTables: string[];
    versionTriggerTables?: string[];
}
export interface CommitSchemaCache {
    ready: boolean;
    tableVersionsReady?: boolean;
}
export declare function prepareTransactionRowChanges(db: D1Database, changes: TransactionRowChange[]): D1PreparedStatement[];
export declare function transactionRowChangesJson(changes: TransactionRowChange[], bulkInserts?: TransactionBulkInsert[]): string;
export declare function tableVersionTriggerSetupStatements(db: D1Database, table: string): D1PreparedStatement[];
export declare function knownVersionTriggerTables(db: D1Database, tables: string[]): string[];
export declare function versionTriggerProbeNeeded(db: D1Database, table: string): boolean;
export declare function rememberAbsentVersionTriggerTables(db: D1Database, tables: string[]): void;
export declare function versionTriggerProbeNames(table: string): string[];
export declare function rememberVersionTriggerProbeResults(db: D1Database, table: string, foundNames: ReadonlySet<string>): void;
export declare function executeVersionTriggeredMutation<T extends Record<string, unknown> = Record<string, unknown>>(db: D1Database, input: {
    table: string;
    statement: D1PreparedStatement;
    rowCountStatement?: D1PreparedStatement;
    rowCountFromResultRows?: boolean;
}): Promise<CommittedMutationResult<T> | undefined>;
export declare function executeCommittedMutation<T extends Record<string, unknown> = Record<string, unknown>>(db: D1Database, input: CommittedMutationInput, schemaCache?: CommitSchemaCache): Promise<CommittedMutationResult<T>>;
export declare function forgetCommittedMutationClosures(db: D1Database): void;
export declare function executeOptimisticCommit(db: D1Database, input: OptimisticCommitInput, schemaCache?: CommitSchemaCache): Promise<{
    transactionId: string;
    committed: boolean;
    changeResults: D1Result<unknown>[];
}>;
export declare function executeRawOptimisticCommit(db: D1Database, input: RawOptimisticCommitInput, schemaCache?: CommitSchemaCache): Promise<{
    transactionId: string;
    committed: boolean;
    changeResults: D1Result<unknown>[];
}>;
export declare function boundedTransactionBulkInsertChunks(chunks: string[]): string[];
export declare function readTableVersions(db: D1Database, tables: string[]): Promise<Map<string, number>>;
export declare function ensureTableVersionSchema(db: D1Database): Promise<void>;
export declare function ensureCommitSchema(db: D1Database): Promise<void>;
export declare function ensureChangeCapture(db: D1Database, table: string): Promise<void>;
export declare function rememberChangeCapture(db: D1Database, table: string, columnNames: string[]): void;
export declare function forgetChangeCapture(db: D1Database, table: string): void;
export declare function prepareChangeCaptureDrop(db: D1Database, table: string): D1PreparedStatement[];
export declare function prepareChangeCaptureRefresh(db: D1Database, table: string, columnNames: string[], options?: {
    dropExisting?: boolean;
}): D1PreparedStatement[];
export declare function mutationTarget(sql: string): string | undefined;
