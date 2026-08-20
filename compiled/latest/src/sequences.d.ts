import { EdgePgSemanticError } from "./semantic-error";
import type { EdgePgValue, QueryNotice, ResultColumnReference, SemanticCommand, SequenceColumnReference, SequenceFunctionReference, SequenceInsertReference, SequenceUpdateDefaultReference, SourceRewrite } from "./types";
type SequenceCommand = Extract<SemanticCommand, {
    kind: "sequence";
}>;
type SequenceColumnCommand = Extract<SemanticCommand, {
    kind: "sequence-column";
}>;
export interface SequenceSessionState {
    current: Map<string, string>;
    last?: string;
    defaults?: Map<string, Array<{
        column_name: string;
        sequence_name: string;
        mode: "serial" | "always" | "default";
    }>>;
    bigintColumns?: Map<string, Set<string>>;
}
export type SequenceDefaultRow = {
    column_name: string;
    sequence_name: string;
    mode: "serial" | "always" | "default";
};
export declare function generatedAlwaysInsertError(column: string): EdgePgSemanticError;
export declare function sequenceDefaultsSchemaKnownMissing(db: D1Database): boolean;
export declare function rememberSequenceDefaultsSchemaMissing(db: D1Database): void;
export declare function forgetSequenceDefaults(db: D1Database, ...tables: string[]): void;
export declare function rememberSequenceDefaults(db: D1Database, tablePhysicalName: string, rows: ReadonlyArray<SequenceDefaultRow>): void;
export declare function executeSequenceCommand(db: D1Database, command: SequenceCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
    notices?: QueryNotice[];
}>;
export declare function executeSequenceColumnCommand(db: D1Database, command: SequenceColumnCommand, extraStatements?: D1PreparedStatement[]): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function sequenceFunctionRewrites(db: D1Database, references: SequenceFunctionReference[], values: EdgePgValue[], state: SequenceSessionState, currentRole?: string): Promise<SourceRewrite[]>;
export declare function allocateSequenceTargetRows(db: D1Database, reference: SequenceFunctionReference, count: number, values: EdgePgValue[], state: SequenceSessionState, currentRole?: string): Promise<string[]>;
export declare function sequenceDefaultExpressionSql(db: D1Database, expression: string, state: SequenceSessionState, currentRole?: string): Promise<string>;
export declare function sequenceInsertSelectDefaultExpressionSql(db: D1Database, expression: string, state: SequenceSessionState, perRowValues: ReadonlyMap<string, string>, perRowLastValue?: string, currentRole?: string): Promise<string>;
export declare function bigintSequenceResultRewrites(db: D1Database, references: ResultColumnReference[], sql: string, state: SequenceSessionState): Promise<{
    rewrites: SourceRewrite[];
    outputNames: Set<string>;
}>;
export declare function bigintSequenceColumns(db: D1Database, table: string): Promise<string[]>;
export declare function prepareSequenceColumns(db: D1Database, columns: SequenceColumnReference[]): Promise<D1PreparedStatement[]>;
export declare function sequenceInsertRewrites(db: D1Database, reference: SequenceInsertReference | undefined, sql: string, state: SequenceSessionState): Promise<SourceRewrite[]>;
export declare function sequenceUpdateDefaultHasDefaults(db: D1Database, reference: SequenceUpdateDefaultReference, state: SequenceSessionState): Promise<boolean>;
export declare function sequenceUpdateDefaultRewrites(db: D1Database, reference: SequenceUpdateDefaultReference | undefined, state: SequenceSessionState): Promise<SourceRewrite[]>;
export declare function executeSequenceInsertSelect(db: D1Database, reference: SequenceInsertReference | undefined, sql: string, params: unknown[], state: SequenceSessionState, rewriteInsert?: (sql: string, context: {
    targetColumns: string[];
    sequenceColumns: ReadonlyMap<string, string>;
    lastSequenceColumn?: string;
}) => Promise<string>): Promise<D1Result<Record<string, unknown>> | null>;
export declare function sequenceInsertHasDefaults(db: D1Database, reference: SequenceInsertReference, state: SequenceSessionState): Promise<boolean>;
export declare function implicitSequenceInsertSelectTargetColumns(db: D1Database, reference: SequenceInsertReference, state: SequenceSessionState): Promise<string[]>;
export declare function validateSequenceInsertSelectWithoutTargetColumns(db: D1Database, reference: SequenceInsertReference, state: SequenceSessionState): Promise<boolean>;
export declare function transactionSequenceInsertSelectLayout(sql: string): {
    targetPrefix: string;
    afterTarget: string;
    sourceSql: string;
    conflictSql: string;
    returningSql: string;
};
export declare function allocateSequenceValue(db: D1Database, tableName: string, physicalName: string): Promise<string>;
export declare function ensureSequenceSchema(db: D1Database): Promise<void>;
export declare function ensureSequenceDefaultsSchema(db: D1Database): Promise<void>;
export declare function insertValuesLayout(sql: string): {
    columnClose: number;
    rows: {
        close: number;
        items: Array<{
            start: number;
            end: number;
        }>;
    }[];
};
export declare function insertValuesRowsLayout(sql: string): {
    columnClose: number;
    rows: {
        close: number;
        items: Array<{
            start: number;
            end: number;
        }>;
    }[];
};
export {};
