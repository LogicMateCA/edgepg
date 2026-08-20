import { type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
export type CatalogObjectCommand = Extract<SemanticCommand, {
    kind: "catalog-object";
}>;
export declare function ensureCatalogObjectSchema(db: D1Database): Promise<void>;
export declare function executeCatalogObjectCommand(db: D1Database, command: CatalogObjectCommand, currentRole?: string): Promise<SemanticExecutionResult>;
export declare function catalogObjectExists(db: D1Database, objectType: CatalogObjectCommand["objectType"], name: string): Promise<boolean>;
