import { type SemanticExecutionResult } from "./semantic-error";
import { type ResolvedRoutineParameter } from "./routine-types";
import type { EdgePgPlPgSqlParser, RoutineCallReference, SemanticCommand, SourceRewrite } from "./types";
type RoutineCommand = Extract<SemanticCommand, {
    kind: "routine";
}>;
export declare function executeRoutineCommand(db: D1Database, command: RoutineCommand, currentRole?: string, parsePlPgSql?: EdgePgPlPgSqlParser): Promise<SemanticExecutionResult>;
export declare function prepareRoutineCommandForTransfer(db: D1Database, command: RoutineCommand, parsePlPgSql?: EdgePgPlPgSqlParser): Promise<RoutineCommand>;
export declare function routineDependencyDropStatementsForOid(db: D1Database, row: {
    routine_oid: number;
    display_name: string;
}, cascade: boolean, objectType?: "function" | "aggregate"): Promise<D1PreparedStatement[]>;
export declare function resolveProcedureCall(db: D1Database, command: Extract<SemanticCommand, {
    kind: "procedure-call";
}>, argumentTypeOids: number[], currentRole?: string): Promise<ResolvedProcedureCall>;
export declare function routineCallRewrites(db: D1Database, calls: RoutineCallReference[], currentRole?: string, sessionSettings?: Record<string, string>, aggregateTableHints?: Map<number, string>): Promise<SourceRewrite[]>;
export declare function rewriteRoutineCurrentSettings(expression: string, sessionSettings: Record<string, string>, configJson?: string): string;
export declare function resolveCastRoutine(db: D1Database, identity: {
    schema: string;
    name: string;
    explicitlyQualified: boolean;
}, sourceTypeOid: number, targetTypeOid: number, sourceSql: string, currentRole: string, searchPath: string[]): Promise<{
    routineOid: number;
    schema: string;
    name: string;
    expression: string;
}>;
export declare function resolveRoutineDependencyOids(db: D1Database, calls: RoutineCallReference[], currentRole?: string): Promise<number[]>;
export declare function resolveRoutineResultTypeOids(db: D1Database, calls: RoutineCallReference[], currentRole?: string, tableHints?: Map<number, string>): Promise<Map<string, number>>;
export interface ResolvedRoutineBinding {
    parameterIndex: number;
    sourceIndex?: number;
    name?: string;
    mode: ResolvedRoutineParameter["mode"];
    typeOid: number;
    actualTypeOid?: number;
    sql: string;
    fromDefault: boolean;
}
export interface ResolvedProcedureCall {
    statements: string[];
    routineOid: number;
    boundArguments: ResolvedRoutineBinding[];
    outputParameters: Array<{
        name: string;
        mode: "out" | "inout" | "table";
        typeOid: number;
        parameterIndex: number;
    }>;
    outputExpressions: Array<{
        name: string;
        typeOid: number;
        sql: string;
    }>;
}
export declare function ensureRoutineCatalogSchema(db: D1Database): Promise<void>;
export {};
