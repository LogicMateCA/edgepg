import { type TransactionRowChange } from "./commits";
type Phase = "idle" | "active" | "failed";
export declare class EdgePgTransactionSession {
    private phaseValue;
    private readonly versions;
    private readonly changes;
    private readonly savepoints;
    get phase(): Phase;
    get pendingChanges(): TransactionRowChange[];
    get tableVersions(): Map<string, number>;
    begin(): {
        command: string;
        alreadyActive: boolean;
    };
    observeTable(table: string, version: number): void;
    record(change: TransactionRowChange): void;
    fail(): void;
    savepoint(name: string): {
        command: string;
    };
    rollbackTo(name: string): {
        command: string;
    };
    release(name: string): {
        command: string;
    };
    rollback(): {
        command: string;
    };
    commit(db: D1Database): Promise<{
        command: string;
        committed: boolean;
        transactionId: undefined;
    } | {
        command: string;
        committed: boolean;
        transactionId: string;
    }>;
    private requireTransaction;
    private requireUsable;
    private findSavepoint;
    private reset;
}
export {};
