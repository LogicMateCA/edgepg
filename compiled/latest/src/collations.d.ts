import { type SemanticExecutionResult } from "./semantic-error";
import { type CatalogName, type OperatorTypeCommand } from "./operator-types";
import type { SourceRewrite } from "./types";
export type CollationCommand = Extract<OperatorTypeCommand, {
    kind: "collation";
}>;
export interface CollationReference {
    start: number;
    end: number;
    identity: CatalogName;
    dependency?: {
        kind: "column" | "index";
        schema: string;
        relation: string;
        physicalName: string;
        column?: string;
        indexName?: string;
    };
}
export interface ResolvedCollations {
    rewrites: SourceRewrite[];
    dependencies: Array<{
        reference: CollationReference;
        oid: number;
    }>;
}
export declare function ensureCollationSchema(db: D1Database): Promise<void>;
export declare function executeCollationCommand(db: D1Database, command: CollationCommand, currentRole?: string, sessionUser?: string, searchPath?: string[]): Promise<SemanticExecutionResult>;
export declare function resolveCollationReferences(db: D1Database, references: CollationReference[], currentRole: string, searchPath?: string[]): Promise<ResolvedCollations>;
export declare function collationDependencyStatements(db: D1Database, resolved: ResolvedCollations): D1PreparedStatement[];
export declare function collationReferences(ast: unknown, sql: string): CollationReference[];
