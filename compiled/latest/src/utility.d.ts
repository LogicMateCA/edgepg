import type { SemanticCommand } from "./types";
type TruncateCommand = Extract<SemanticCommand, {
    kind: "truncate";
}>;
type ExplainCommand = Extract<SemanticCommand, {
    kind: "explain";
}>;
export declare function executeTruncateCommand(db: D1Database, command: TruncateCommand): Promise<{
    command: string;
    rowCount: number;
    tables: string[];
}>;
export declare function executeExplainCommand(db: D1Database, command: ExplainCommand, sql: string, params: unknown[]): Promise<{
    rows: {
        "QUERY PLAN": {
            Plan: {
                "Node Type": string;
                Plans: {
                    "Node Type": string;
                    "Plan Node Id": number;
                    "Parent Relationship": number;
                }[];
            };
            "Planning Time": number;
            "Execution Time"?: number | undefined;
        }[];
    }[];
    fields: {
        name: string;
        dataTypeID: number;
    }[];
    command: string;
} | {
    rows: {
        "QUERY PLAN": string;
    }[];
    fields: {
        name: string;
        dataTypeID: number;
    }[];
    command: string;
}>;
export {};
