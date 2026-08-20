import type { SemanticCommand } from "./types";
export type SecurityLabelCommand = Extract<SemanticCommand, {
    kind: "security-label";
}>;
export declare function executeSecurityLabelCommand(db: D1Database, command: SecurityLabelCommand): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function ensureSecurityLabelSchema(db: D1Database): Promise<void>;
