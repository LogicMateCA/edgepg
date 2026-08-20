import { EdgePgSemanticError } from "./semantic-error";
import type { EdgePgValue } from "./types";
export declare function relationalConstraintError(error: unknown): EdgePgSemanticError | null;
export declare function relationalConstraintErrorForStatement(database: D1Database, error: unknown, sql: string, params: EdgePgValue[]): Promise<EdgePgSemanticError | null>;
