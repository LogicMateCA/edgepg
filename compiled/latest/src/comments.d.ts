import type { SemanticCommand } from "./types";
type CommentCommand = Extract<SemanticCommand, {
    kind: "comment";
}>;
export declare function executeCommentCommand(db: D1Database, command: CommentCommand, actor?: string): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function ensureCommentSchema(db: D1Database): Promise<void>;
export {};
