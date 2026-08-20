import { type SemanticExecutionResult } from "./semantic-error";
import type { RowSecurityTableReference, SemanticCommand, SourceRewrite } from "./types";
type RowSecurityCommand = Extract<SemanticCommand, {
    kind: "row-security";
}>;
export interface RowSecuritySession {
    sessionUser: string;
    currentRole: string;
    settings: ReadonlyMap<string, string>;
}
export interface MergeRowSecurityPredicates {
    select: string;
    selectNew: string;
    updateUsing: string;
    deleteUsing: string;
}
export declare function rowSecuritySelectPredicate(db: D1Database, tableName: string, session: RowSecuritySession): Promise<string | undefined>;
export declare function rowSecurityMergePredicates(db: D1Database, tableName: string, session: RowSecuritySession): Promise<MergeRowSecurityPredicates | undefined>;
export declare function executeRowSecurityCommand(db: D1Database, command: RowSecurityCommand, ownerRole: string, currentRole?: string, schemaFenceHeld?: boolean): Promise<SemanticExecutionResult>;
export declare function rowSecurityRewrites(db: D1Database, references: RowSecurityTableReference[], session: RowSecuritySession, schemaReady?: boolean): Promise<{
    rewrites: SourceRewrite[];
    consumedRelationStarts: Set<number>;
    guardedMutation: boolean;
}>;
export declare function executeGuardedRowSecurityMutation<T = Record<string, unknown>>(db: D1Database, statement: D1PreparedStatement, session: RowSecuritySession): Promise<D1Result<T>>;
export declare function rowSecurityMutationContext(db: D1Database, session: RowSecuritySession): {
    before: D1PreparedStatement[];
    after: D1PreparedStatement[];
};
export declare function ensureRowSecuritySchema(db: D1Database): Promise<void>;
export {};
