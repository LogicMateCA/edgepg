import type { SemanticCommand } from "./types";
export type SystemRecordCommand = Extract<SemanticCommand, {
    kind: "system-record";
}>;
export declare function executeSystemRecordCommand(db: D1Database, command: SystemRecordCommand, currentRole?: string, sessionUser?: string): Promise<{
    command: "ALTER LARGE OBJECT";
    rowCount: number;
}>;
export declare function ensureSystemRecordSchema(db: D1Database): Promise<void>;
