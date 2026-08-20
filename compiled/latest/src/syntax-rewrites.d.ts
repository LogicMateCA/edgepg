import type { SourceRewrite } from "./types";
export declare function deleteUsingRewrites(ast: unknown, sql: string): SourceRewrite[];
export declare function sqliteOffsetRewrites(ast: unknown, sql: string): SourceRewrite[];
export declare function publicSchemaColumnRewrites(ast: unknown, sql: string): SourceRewrite[];
export declare function mutationTargetColumnRewrites(ast: unknown, sql: string): SourceRewrite[];
export declare function sqliteIlikeRewrites(ast: unknown, sql: string): SourceRewrite[];
