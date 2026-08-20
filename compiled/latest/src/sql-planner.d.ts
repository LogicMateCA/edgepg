import type { QueryExecutionPlan } from "./types";
export declare function planSql(sql: string): Promise<QueryExecutionPlan>;
export declare function compileRoutineArrayExpression(expression: string): Promise<string>;
export type { ExecutionRoute, QueryExecutionPlan, StatementExecutionPlan, } from "./types";
