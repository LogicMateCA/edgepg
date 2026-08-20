import { type TriggerSequenceAction } from "./triggers";
import type { EdgePgValue } from "./types";
export interface TriggerSequenceMatch {
    actionId: string;
    rowOrdinal: number;
}
export interface TriggerSequenceReservation {
    ordinal: number;
    token: string;
    actionId: string;
    sequenceName: string;
    value: string;
}
export interface TriggerSequenceReservationPlan {
    token: string;
    reservations: TriggerSequenceReservation[];
}
export declare function prepareTriggerSequenceReservations(db: D1Database, sql: string, params: EdgePgValue[], tableName: string, event: "insert" | "update"): Promise<TriggerSequenceReservationPlan | undefined>;
export declare function triggerSequenceReservationStatements(db: D1Database, plan: TriggerSequenceReservationPlan): {
    before: D1PreparedStatement[];
    after: D1PreparedStatement[];
};
export declare function evaluateInsertTriggerSequenceActions(db: D1Database, sql: string, params: EdgePgValue[], actions: TriggerSequenceAction[]): Promise<TriggerSequenceMatch[]>;
export declare function evaluateUpdateTriggerSequenceActions(db: D1Database, sql: string, params: EdgePgValue[], tableName: string, actions: TriggerSequenceAction[]): Promise<TriggerSequenceMatch[]>;
export declare function rewriteBeforeInsertCandidates(db: D1Database, sql: string, tableName: string): Promise<string>;
export declare function rewriteBeforeUpdateCandidates(db: D1Database, sql: string, tableName: string): Promise<string>;
export declare function parseInsertValues(sql: string): {
    prefix: string;
    columns: string | null;
    values: string;
    suffix: string;
} | null;
export declare function splitValueRows(source: string): string[];
export declare function splitSqlList(source: string): string[];
export declare function parseIdentifier(source: string): string;
