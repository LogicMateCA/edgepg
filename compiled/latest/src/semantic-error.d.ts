import type { QueryNotice } from "./types";
export interface SemanticExecutionResult {
    command: string;
    rowCount: number;
    notices?: QueryNotice[];
}
export declare class EdgePgSemanticError extends Error {
    readonly code: string;
    readonly status: number;
    readonly detail?: string | undefined;
    readonly hint?: string | undefined;
    readonly column?: string | undefined;
    readonly constraint?: string | undefined;
    readonly dataType?: string | undefined;
    readonly table?: string | undefined;
    readonly schema?: string | undefined;
    readonly position?: number | undefined;
    readonly context?: string | undefined;
    readonly notices?: Array<{
        severity: "NOTICE" | "WARNING" | "INFO";
        code: string;
        message: string;
    }> | undefined;
    readonly severity = "ERROR";
    constructor(code: string, message: string, status?: number, detail?: string | undefined, hint?: string | undefined, column?: string | undefined, constraint?: string | undefined, dataType?: string | undefined, table?: string | undefined, schema?: string | undefined, position?: number | undefined, context?: string | undefined, notices?: Array<{
        severity: "NOTICE" | "WARNING" | "INFO";
        code: string;
        message: string;
    }> | undefined);
}
