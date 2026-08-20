import { type SemanticExecutionResult } from "./semantic-error";
import { type OperatorTypeCommand } from "./operator-types";
import type { SourceRewrite, UserOperatorExpressionReference } from "./types";
type OperatorCommand = Extract<OperatorTypeCommand, {
    kind: "operator";
}>;
export declare function executeOperatorTypeCommand(db: D1Database, command: OperatorTypeCommand, actor: string, searchPath: string[]): Promise<SemanticExecutionResult>;
export declare function executeOperatorCommand(db: D1Database, command: OperatorCommand, actor: string, searchPath: string[]): Promise<SemanticExecutionResult>;
export declare function userOperatorExpressionRewrites(db: D1Database, references: UserOperatorExpressionReference[]): Promise<{
    rewrites: SourceRewrite[];
    booleanResultNames: Set<string>;
    resultTypeOids: Map<string, number>;
}>;
export {};
