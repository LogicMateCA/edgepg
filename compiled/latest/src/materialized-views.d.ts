import { EdgePgSemanticError, type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
export type MaterializedViewCommand = Extract<SemanticCommand, {
    kind: "materialized-view";
}>;
export declare function materializedViewStorageName(physicalName: string, populated: boolean): string;
export declare function shouldSnapshotMaterializedViewCatalog(relations: readonly string[], workspaceCatalogPresent: boolean): boolean;
export declare function executeMaterializedViewCommand(db: D1Database, command: MaterializedViewCommand, compiledQuerySql?: string, currentRole?: string): Promise<SemanticExecutionResult>;
export declare function executeDropMaterializedViewCommands(db: D1Database, commands: MaterializedViewCommand[], currentRole?: string): Promise<SemanticExecutionResult>;
export declare function materializedViewReadError(db: D1Database, error: unknown): Promise<EdgePgSemanticError | null>;
export declare function ensureMaterializedViewSchema(db: D1Database): Promise<void>;
