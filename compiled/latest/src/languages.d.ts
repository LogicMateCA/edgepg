import { type SemanticExecutionResult } from "./semantic-error";
import type { SemanticCommand } from "./types";
type LanguageCommand = Extract<SemanticCommand, {
    kind: "language";
}>;
export declare function executeLanguageCommand(db: D1Database, command: LanguageCommand): Promise<SemanticExecutionResult>;
export declare function resolveRoutineLanguage(db: D1Database, declaredLanguage: string): Promise<"plpgsql" | "sql">;
export declare function ensureLanguageSchema(db: D1Database): Promise<void>;
export {};
