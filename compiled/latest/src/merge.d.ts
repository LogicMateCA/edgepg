import type { MergeReturningPlan } from "./types";
export interface MergeExpressionContext {
    targetAlias: string;
    sourceAlias: string;
    targetSqlAlias?: string;
    sourceSqlAlias?: string;
    aliases?: Record<string, string>;
    targetColumns?: readonly string[];
    sourceColumns?: readonly string[];
    mergeAction?: string;
    targetTypes?: readonly string[];
    sourceTypes?: readonly string[];
    compositeTypes?: Record<string, Array<{
        name: string;
        type: string;
    }>>;
}
export interface CompiledMergeReturning {
    name: string;
    value: unknown;
    scalarSubquerySql?: string;
    scalarSubqueryCorrelations?: MergeReturningPlan["subqueryCorrelations"];
    pgType?: string;
    wholeRow?: {
        kind: "target" | "source" | "old" | "new";
        columns: string[];
        types: string[];
    };
    compositeField?: {
        kind: "target" | "source" | "old" | "new";
        column: string;
        path: Array<{
            field: string;
            fieldIndex: number;
            fieldType: string;
            fieldCount: number;
        }>;
    };
}
export declare function compileMergeExpression(value: unknown, context: MergeExpressionContext): string;
export declare function compileMergeReturning(returning: MergeReturningPlan[], context: MergeExpressionContext, targetColumns: string[], sourceColumns: string[]): CompiledMergeReturning[];
export declare function postgresParametersToSqlite(sql: string): string;
