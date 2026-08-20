import type { QueryNotice, SemanticCommand } from "./types";
import { type ExclusionReindexEntry } from "./table-constraints";
type IndexCommand = Extract<SemanticCommand, {
    kind: "index";
}>;
type ReindexCommand = Extract<IndexCommand, {
    action: "reindex";
}>;
export interface ReindexPlan {
    targets: string[];
    exclusions?: ExclusionReindexEntry[];
    original: string;
    tablePhysicalName?: string;
}
export declare function executeIndexCommand(db: D1Database, command: IndexCommand, currentRole?: string): Promise<{
    command: string;
    rowCount: number;
    notices: QueryNotice[] | undefined;
} | {
    notices?: undefined;
    command: string;
    rowCount: number;
}>;
export declare function resolveReindexPlan(db: D1Database, command: ReindexCommand): Promise<ReindexPlan>;
export declare function validateReindexOptions(command: ReindexCommand): void;
export declare function reindexNotices(command: ReindexCommand): QueryNotice[] | undefined;
export declare function reindexStatements(db: D1Database, plan: ReindexPlan): D1PreparedStatement[];
export declare function executeDropIndexCommands(db: D1Database, commands: IndexCommand[], catalogKnown?: boolean): Promise<{
    command: string;
    rowCount: number;
    notices: QueryNotice[] | undefined;
}>;
export {};
