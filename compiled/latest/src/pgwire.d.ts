import type { EdgePgConfig, EdgePgValue, FieldDef, QueryResult } from "./types";
type StartupParameters = Record<string, string>;
type WireQueryResult = QueryResult<Record<string, unknown>>;
interface PgWireClient {
    connect(): Promise<void>;
    query(input: {
        text: string;
        values: EdgePgValue[];
        rowMode: "array";
        types?: {
            getTypeParser(oid: number, format?: string): (value: string) => unknown;
        };
    }): Promise<WireQueryResult>;
    describe?(sql: string): Promise<FieldDef[]>;
    copyRows?(relationSql: string, columns: string[], rows: EdgePgValue[][]): Promise<number>;
    markTransactionFailed?(code: string, message: string): Promise<void>;
    sessionSetting?(name: string): string | undefined;
    end(): Promise<void>;
}
interface PgWireTransport {
    send(data: Uint8Array): void;
    close(code?: number, reason?: string): void;
}
export interface EdgePgPgWireOptions extends EdgePgConfig {
    token: string;
    pgUser?: string;
    pgDatabase?: string;
    maxMessageBytes?: number;
}
export interface EdgePgPgWireHandler {
    (request: Request): Promise<Response>;
}
export declare function createPgWireWebSocketHandler(options: EdgePgPgWireOptions): EdgePgPgWireHandler;
export declare class PgWireSession {
    private readonly transport;
    private readonly createClient;
    private buffer;
    private startupComplete;
    private client?;
    private readonly statements;
    private readonly portals;
    private transactionStatus;
    private databaseName;
    private userName;
    private ignoreUntilSync;
    private operation;
    private closed;
    private readonly maxMessageBytes;
    private copyIn?;
    private copyFailureDrain;
    private extraFloatDigits;
    private byteaOutput;
    private dateStyle;
    private startupDateStyle;
    private intervalStyle;
    private timeZone;
    private standardConformingStrings;
    private clientMinMessages;
    constructor(transport: PgWireTransport, createClient: (startup: StartupParameters) => Promise<PgWireClient> | PgWireClient, options?: {
        maxMessageBytes?: number;
    });
    feed(chunk: Uint8Array): Promise<void>;
    close(): Promise<void>;
    private consume;
    private take;
    private handleStartup;
    private handleMessage;
    private simpleQuery;
    private simpleQueryStatements;
    private copyOut;
    private beginCopyIn;
    private copyData;
    private copyDone;
    private copyFail;
    private failCopy;
    private bufferCopyRow;
    private flushCopyRows;
    private parse;
    private bind;
    private describe;
    private execute;
    private closePrepared;
    private runQuery;
    private sendResult;
    private sendNotices;
    private updateFloatOutputSetting;
    private updateDateStyleSetting;
    private updateTimeZoneSetting;
    private updateIntervalStyleSetting;
    private updateStandardConformingStringsSetting;
    private updateByteaOutputSetting;
    private updateClientMinMessagesSetting;
    private sendError;
    private sendReady;
    private updateTransactionStatus;
    private protocolFailure;
}
export {};
