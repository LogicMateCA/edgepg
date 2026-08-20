import { type SemanticExecutionResult } from "./semantic-error";
import type { EdgePgValue, FieldDef, QueryResult } from "./types";
export type ConversionEncoding = "SQL_ASCII" | "UTF8" | "EUC_KR" | "LATIN1" | "WIN1252";
export type ConversionCommand = {
    action: "create";
    schema: string;
    name: string;
    qualified: boolean;
    searchPath: string[];
    sourceEncoding: string;
    destinationEncoding: string;
    callbackSchema: string;
    callbackName: string;
    callbackQualified: boolean;
    callbackSearchPath: string[];
    isDefault: boolean;
    definition: string;
} | {
    action: "rename";
    schema: string;
    name: string;
    qualified: boolean;
    searchPath: string[];
    newName: string;
    definition: string;
} | {
    action: "owner";
    schema: string;
    name: string;
    qualified: boolean;
    searchPath: string[];
    owner: string;
    definition: string;
} | {
    action: "set-schema";
    schema: string;
    name: string;
    qualified: boolean;
    searchPath: string[];
    newSchema: string;
    definition: string;
} | {
    action: "drop";
    targets: Array<{
        schema: string;
        name: string;
        qualified: boolean;
        searchPath: string[];
    }>;
    ifExists: boolean;
    cascade: boolean;
    definition: string;
};
export interface ConversionScalarQuery {
    targets: Array<{
        name: string;
        functionName: "convert" | "convert_from" | "convert_to";
        args: unknown[];
        encodeHex: boolean;
    }>;
}
interface CallbackProvider {
    oid: number;
    schema: string;
    name: string;
    provider: "utf8-latin1" | "latin1-utf8" | "utf8-win1252" | "win1252-utf8";
    builtin: boolean;
}
export declare function parseConversionCommand(sql: string, searchPath?: string[]): Promise<ConversionCommand | undefined>;
export declare function parseConversionScalarQuery(sql: string): Promise<ConversionScalarQuery | undefined>;
export declare function executeConversionCommand(db: D1Database, command: ConversionCommand, currentRole?: string): Promise<SemanticExecutionResult>;
export declare function executeConversionScalarQuery<T extends Record<string, unknown>>(db: D1Database, query: ConversionScalarQuery, values: EdgePgValue[], rowMode?: "array", searchPath?: string[], currentRole?: string): Promise<QueryResult<T>>;
export declare function ensureConversionCatalogSchema(db: D1Database): Promise<void>;
export declare function conversionCatalogViewSql(): string;
export declare function conversionSharedDependViewSql(extraUnion?: string): string;
export declare function conversionDependencyUnionSql(): string;
export declare const CONVERSION_TRANSACTION_TABLES: readonly string[];
export declare function conversionResultToWire(result: QueryResult<Record<string, unknown>>): {
    rows: {
        [k: string]: unknown;
    }[];
    command: string;
    rowCount: number | null;
    oid: number;
    fields: FieldDef[];
    notices?: import("./types").QueryNotice[];
};
export declare function conversionResultFromWire<T extends Record<string, unknown>>(result: Record<string, unknown>, rowMode?: "array"): QueryResult<T>;
export declare function conversionProviderFromRoutineDefinition(definition: string, language: string): CallbackProvider["provider"] | undefined;
export declare function convertBuiltinBytes(input: Uint8Array, source: ConversionEncoding, destination: ConversionEncoding): Uint8Array<ArrayBuffer>;
export {};
