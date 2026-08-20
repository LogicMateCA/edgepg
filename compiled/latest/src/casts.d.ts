import { type SemanticExecutionResult } from "./semantic-error";
import { type OperatorTypeCommand } from "./operator-types";
import type { EdgePgValue, ExtensionCastExpressionReference, ExtensionCastWriteReference, SourceRewrite } from "./types";
type CastCommand = Extract<OperatorTypeCommand, {
    kind: "cast";
}>;
export interface ResolvedType {
    oid: number;
    displayName: string;
    physicalName?: string;
    builtin: boolean;
    storage: "integer" | "real" | "text" | "blob" | "other";
    domainBase?: string;
}
export type ExtensionCastRelationPgTypes = {
    columns: string[];
    pgTypes: string[];
};
export declare function forgetExtensionCastMetadataCaches(db: D1Database, ...tables: string[]): void;
export declare function forgetExtensionCastTypeMetadata(db: D1Database): void;
export declare function executeCastCommand(db: D1Database, command: CastCommand, actor: string, searchPath: string[]): Promise<SemanticExecutionResult>;
export declare function extensionCastExpressionRewrites(db: D1Database, references: ExtensionCastExpressionReference[], values: EdgePgValue[], sql: string, actor: string, searchPath: string[]): Promise<SourceRewrite[]>;
export declare function extensionCastWriteRewrites(db: D1Database, references: ExtensionCastWriteReference[], values: EdgePgValue[], sql: string, actor: string, searchPath: string[], requestCache?: Map<string, ExtensionCastRelationPgTypes>): Promise<SourceRewrite[]>;
export declare function ensureCastSchemas(db: D1Database): Promise<void>;
export declare function resolveType(db: D1Database, value: string, explicitlyQualified: boolean, searchPath: string[]): Promise<ResolvedType>;
export {};
