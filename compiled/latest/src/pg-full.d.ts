import { Client as CoreClient, createDiagnosticsCollector, DatabaseError, Pool as CorePool, TypeOverrides, types } from "./pg";
import type { EdgePgConfig } from "./types";
type PoolConfig = EdgePgConfig & {
    max?: number;
};
export declare class Client extends CoreClient {
    constructor(config?: EdgePgConfig);
}
export declare class Pool extends CorePool {
    constructor(config?: PoolConfig);
}
export { builtins, EdgePgCompatibilityError, EdgePgWriteFenceError, PgEventEmitter, } from "./pg";
export { createDiagnosticsCollector, DatabaseError, TypeOverrides, types, };
export type { DiagnosticsCollector, DiagnosticsSummary, } from "./pg";
export type { EdgePgConfig, EdgePgDiagnosticsEvent, EdgePgDiagnosticsSink, FieldDef, QueryConfig, QueryResult, } from "./types";
declare const _default: {
    Client: typeof Client;
    createDiagnosticsCollector: typeof createDiagnosticsCollector;
    DatabaseError: typeof DatabaseError;
    Pool: typeof Pool;
    TypeOverrides: typeof TypeOverrides;
    types: {
        builtins: {
            readonly BOOL: 16;
            readonly BYTEA: 17;
            readonly CHAR: 18;
            readonly INT8: 20;
            readonly INT2: 21;
            readonly INT4: 23;
            readonly REGPROC: 24;
            readonly TEXT: 25;
            readonly OID: 26;
            readonly TID: 27;
            readonly XID: 28;
            readonly CID: 29;
            readonly JSON: 114;
            readonly XML: 142;
            readonly PG_NODE_TREE: 194;
            readonly SMGR: 210;
            readonly PATH: 602;
            readonly POLYGON: 604;
            readonly CIDR: 650;
            readonly FLOAT4: 700;
            readonly FLOAT8: 701;
            readonly ABSTIME: 702;
            readonly RELTIME: 703;
            readonly TINTERVAL: 704;
            readonly CIRCLE: 718;
            readonly MACADDR8: 774;
            readonly MONEY: 790;
            readonly MACADDR: 829;
            readonly INET: 869;
            readonly ACLITEM: 1033;
            readonly BPCHAR: 1042;
            readonly VARCHAR: 1043;
            readonly DATE: 1082;
            readonly TIME: 1083;
            readonly TIMESTAMP: 1114;
            readonly TIMESTAMPTZ: 1184;
            readonly INTERVAL: 1186;
            readonly TIMETZ: 1266;
            readonly BIT: 1560;
            readonly VARBIT: 1562;
            readonly NUMERIC: 1700;
            readonly REFCURSOR: 1790;
            readonly REGPROCEDURE: 2202;
            readonly REGOPER: 2203;
            readonly REGOPERATOR: 2204;
            readonly REGCLASS: 2205;
            readonly REGTYPE: 2206;
            readonly UUID: 2950;
            readonly TXID_SNAPSHOT: 2970;
            readonly PG_LSN: 3220;
            readonly PG_NDISTINCT: 3361;
            readonly PG_DEPENDENCIES: 3402;
            readonly TSVECTOR: 3614;
            readonly TSQUERY: 3615;
            readonly GTSVECTOR: 3642;
            readonly REGCONFIG: 3734;
            readonly REGDICTIONARY: 3769;
            readonly JSONB: 3802;
            readonly REGNAMESPACE: 4089;
            readonly REGROLE: 4096;
        };
        getTypeParser(oid: number, format?: string): (value: string) => unknown;
        setTypeParser(oid: number, format: string | ((value: string) => unknown), parser?: (value: string) => unknown): void;
        arrayParser: {
            create(source: string, transform?: (value: string) => unknown): {
                parse: () => unknown[];
            };
        };
    };
};
export default _default;
