import { type EdgePgValue, type RelationRewrite, type SourceRewrite, type TypeRewrite } from "./types";
export declare class EdgePgCompatibilityError extends Error {
    readonly feature: string;
    readonly code = "0A000";
    constructor(message: string, feature: string);
}
export declare class EdgePgWriteFenceError extends Error {
    readonly fenceEpoch: string;
    readonly code = "55006";
    constructor(fenceEpoch: string);
}
export interface PlannedStatement {
    sql: string;
    params: D1Parameter[];
    command: string;
    returnsRows: boolean;
}
export declare function outermostSourceRewrites(rewrites: SourceRewrite[], source?: string): SourceRewrite[];
export declare function planDirectStatement(sql: string, values?: EdgePgValue[], relationRewrites?: RelationRewrite[], typeRewrites?: TypeRewrite[], sourceRewrites?: SourceRewrite[]): PlannedStatement;
type D1Parameter = string | number | null | ArrayBuffer;
export {};
