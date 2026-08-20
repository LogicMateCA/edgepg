export interface CatalogName {
    schema: string;
    name: string;
    explicitlyQualified: boolean;
}
export declare const PG18_BUILTIN_CAST_ROWS: readonly [readonly [10000, 20, 21, 714, "a", "f"], readonly [10001, 20, 23, 480, "a", "f"], readonly [10002, 20, 700, 652, "i", "f"], readonly [10003, 20, 701, 482, "i", "f"], readonly [10004, 20, 1700, 1781, "i", "f"], readonly [10005, 21, 20, 754, "i", "f"], readonly [10006, 21, 23, 313, "i", "f"], readonly [10007, 21, 700, 236, "i", "f"], readonly [10008, 21, 701, 235, "i", "f"], readonly [10009, 21, 1700, 1782, "i", "f"], readonly [10010, 23, 20, 481, "i", "f"], readonly [10011, 23, 21, 314, "a", "f"], readonly [10012, 23, 700, 318, "i", "f"], readonly [10013, 23, 701, 316, "i", "f"], readonly [10014, 23, 1700, 1740, "i", "f"], readonly [10015, 700, 20, 653, "a", "f"], readonly [10016, 700, 21, 238, "a", "f"], readonly [10017, 700, 23, 319, "a", "f"], readonly [10018, 700, 701, 311, "i", "f"], readonly [10019, 700, 1700, 1742, "a", "f"], readonly [10020, 701, 20, 483, "a", "f"], readonly [10021, 701, 21, 237, "a", "f"], readonly [10022, 701, 23, 317, "a", "f"], readonly [10023, 701, 700, 312, "a", "f"], readonly [10024, 701, 1700, 1743, "a", "f"], readonly [10025, 1700, 20, 1779, "a", "f"], readonly [10026, 1700, 21, 1783, "a", "f"], readonly [10027, 1700, 23, 1744, "a", "f"], readonly [10028, 1700, 700, 1745, "i", "f"], readonly [10029, 1700, 701, 1746, "i", "f"], readonly [10034, 23, 16, 2557, "e", "f"], readonly [10035, 16, 23, 2558, "e", "f"], readonly [10037, 20, 26, 1287, "i", "f"], readonly [10038, 21, 26, 313, "i", "f"], readonly [10039, 23, 26, 0, "e", "b"], readonly [10040, 26, 20, 1288, "a", "f"], readonly [10041, 26, 23, 0, "a", "b"], readonly [10125, 25, 1042, 0, "i", "b"], readonly [10126, 25, 1043, 0, "i", "b"], readonly [10127, 1042, 25, 401, "i", "f"], readonly [10128, 1042, 1043, 401, "i", "f"], readonly [10129, 1043, 25, 0, "i", "b"], readonly [10130, 1043, 1042, 0, "i", "b"], readonly [10131, 18, 25, 946, "i", "f"], readonly [10132, 18, 1042, 860, "a", "f"], readonly [10133, 18, 1043, 946, "a", "f"], readonly [10134, 19, 25, 406, "i", "f"], readonly [10135, 19, 1042, 408, "a", "f"], readonly [10136, 19, 1043, 1401, "a", "f"], readonly [10137, 25, 18, 944, "a", "f"], readonly [10138, 1042, 18, 944, "a", "f"], readonly [10139, 1043, 18, 944, "a", "f"], readonly [10140, 25, 19, 407, "i", "f"], readonly [10141, 1042, 19, 409, "i", "f"], readonly [10142, 1043, 19, 1400, "i", "f"], readonly [10143, 21, 17, 6367, "e", "f"], readonly [10144, 23, 17, 6368, "e", "f"], readonly [10145, 20, 17, 6369, "e", "f"], readonly [10146, 17, 21, 6370, "e", "f"], readonly [10147, 17, 23, 6371, "e", "f"], readonly [10148, 17, 20, 6372, "e", "f"], readonly [10149, 18, 23, 77, "e", "f"], readonly [10150, 23, 18, 78, "e", "f"], readonly [10158, 1082, 1114, 2024, "i", "f"], readonly [10159, 1082, 1184, 1174, "i", "f"], readonly [10160, 1083, 1186, 1370, "i", "f"], readonly [10161, 1083, 1266, 2047, "i", "f"], readonly [10162, 1114, 1082, 2029, "a", "f"], readonly [10163, 1114, 1083, 1316, "a", "f"], readonly [10164, 1114, 1184, 2028, "i", "f"], readonly [10165, 1184, 1082, 1178, "a", "f"], readonly [10166, 1184, 1083, 2019, "a", "f"], readonly [10167, 1184, 1114, 2027, "a", "f"], readonly [10168, 1184, 1266, 1388, "a", "f"], readonly [10169, 1186, 1083, 1419, "a", "f"], readonly [10170, 1266, 1083, 2046, "a", "f"], readonly [10197, 16, 25, 2971, "a", "f"], readonly [10202, 16, 1043, 2971, "a", "f"], readonly [10207, 16, 1042, 2971, "a", "f"], readonly [10210, 1042, 1042, 668, "i", "f"], readonly [10211, 1043, 1043, 669, "i", "f"], readonly [10212, 1083, 1083, 1968, "i", "f"], readonly [10213, 1114, 1114, 1961, "i", "f"], readonly [10214, 1184, 1184, 1967, "i", "f"], readonly [10215, 1186, 1186, 1200, "i", "f"], readonly [10216, 1266, 1266, 1969, "i", "f"], readonly [10219, 1700, 1700, 1703, "i", "f"], readonly [10220, 114, 3802, 0, "a", "i"], readonly [10221, 3802, 114, 0, "a", "i"], readonly [10222, 3802, 16, 3556, "e", "f"], readonly [10223, 3802, 1700, 3449, "e", "f"], readonly [10224, 3802, 21, 3450, "e", "f"], readonly [10225, 3802, 23, 3451, "e", "f"], readonly [10226, 3802, 20, 3452, "e", "f"], readonly [10227, 3802, 700, 3453, "e", "f"], readonly [10228, 3802, 701, 2580, "e", "f"]];
export declare const PG18_BUILTIN_BTREE_OPCLASS_ROWS: readonly [readonly [1978, "int4_ops", 1976, 23], readonly [1979, "int2_ops", 1976, 21], readonly [3122, "date_ops", 434, 1082], readonly [3123, "float8_ops", 1970, 701], readonly [3124, "int8_ops", 1976, 20], readonly [3125, "numeric_ops", 1988, 1700], readonly [3126, "text_ops", 1994, 25], readonly [3127, "timestamptz_ops", 434, 1184], readonly [3128, "timestamp_ops", 434, 1114], readonly [10012, "float4_ops", 1970, 700], readonly [10022, "interval_ops", 1982, 1186], readonly [10038, "time_ops", 1996, 1083], readonly [10041, "timetz_ops", 2000, 1266], readonly [10065, "uuid_ops", 2968, 2950]];
export interface OwnerReference {
    kind: "name" | "current-role" | "current-user" | "session-user";
    name?: string;
}
export interface OperatorSignature extends CatalogName {
    leftType: string | null;
    rightType: string | null;
}
export interface RoutineReference extends CatalogName {
    argumentTypes?: string[];
}
export interface OperatorFamilyIdentity extends CatalogName {
    accessMethod: string;
}
export type OperatorFamilyMember = {
    kind: "operator";
    strategy: number;
    operator?: OperatorSignature;
    leftType?: string;
    rightType?: string;
    purpose: "search" | "order";
    sortFamily?: CatalogName;
} | {
    kind: "function";
    support: number;
    function?: RoutineReference;
    leftType?: string;
    rightType?: string;
};
export type OperatorTypeCommand = {
    kind: "operator";
    action: "create";
    identity: OperatorSignature;
    function: RoutineReference;
    commutator?: CatalogName;
    negator?: CatalogName;
    restrictFunction?: RoutineReference;
    joinFunction?: RoutineReference;
    canHash: boolean;
    canMerge: boolean;
    definition: string;
} | {
    kind: "operator";
    action: "alter";
    identity: OperatorSignature;
    restrictFunction?: RoutineReference | null;
    joinFunction?: RoutineReference | null;
    definition: string;
} | {
    kind: "operator";
    action: "owner" | "set-schema";
    identity: OperatorSignature;
    owner?: OwnerReference;
    newSchema?: string;
    definition: string;
} | {
    kind: "operator";
    action: "drop";
    targets: OperatorSignature[];
    ifExists: boolean;
    cascade: boolean;
    definition: string;
} | {
    kind: "operator-family";
    action: "create";
    identity: OperatorFamilyIdentity;
    definition: string;
} | {
    kind: "operator-family";
    action: "alter-members";
    identity: OperatorFamilyIdentity;
    memberAction: "add" | "drop";
    members: OperatorFamilyMember[];
    definition: string;
} | {
    kind: "operator-family";
    action: "rename" | "owner" | "set-schema";
    identity: OperatorFamilyIdentity;
    newName?: string;
    owner?: OwnerReference;
    newSchema?: string;
    definition: string;
} | {
    kind: "operator-family";
    action: "drop";
    targets: OperatorFamilyIdentity[];
    ifExists: boolean;
    cascade: boolean;
    definition: string;
} | {
    kind: "operator-class";
    action: "create";
    identity: OperatorFamilyIdentity;
    inputType: string;
    family?: CatalogName;
    isDefault: boolean;
    storageType?: string;
    members: OperatorFamilyMember[];
    definition: string;
} | {
    kind: "operator-class";
    action: "rename" | "owner" | "set-schema";
    identity: OperatorFamilyIdentity;
    newName?: string;
    owner?: OwnerReference;
    newSchema?: string;
    definition: string;
} | {
    kind: "operator-class";
    action: "drop";
    targets: OperatorFamilyIdentity[];
    ifExists: boolean;
    cascade: boolean;
    definition: string;
} | {
    kind: "cast";
    action: "create";
    sourceType: string;
    targetType: string;
    sourceExplicitlyQualified: boolean;
    targetExplicitlyQualified: boolean;
    method: "function" | "inout" | "binary";
    context: "explicit" | "assignment" | "implicit";
    function?: RoutineReference;
    definition: string;
} | {
    kind: "cast";
    action: "drop";
    sourceType: string;
    targetType: string;
    sourceExplicitlyQualified: boolean;
    targetExplicitlyQualified: boolean;
    ifExists: boolean;
    cascade: boolean;
    definition: string;
} | {
    kind: "collation";
    action: "create";
    identity: CatalogName;
    from?: CatalogName;
    provider?: string;
    locale?: string;
    lcCollate?: string;
    lcCtype?: string;
    rules?: string;
    version?: string;
    deterministic?: boolean;
    ifNotExists: boolean;
    definition: string;
} | {
    kind: "collation";
    action: "refresh" | "rename" | "owner" | "set-schema";
    identity: CatalogName;
    newName?: string;
    owner?: OwnerReference;
    newSchema?: string;
    definition: string;
} | {
    kind: "collation";
    action: "drop";
    targets: CatalogName[];
    ifExists: boolean;
    cascade: boolean;
    definition: string;
};
export declare function operatorTypeCommands(ast: unknown, sql: string): OperatorTypeCommand[];
export declare function ensureOperatorTypeCatalogSchema(db: D1Database): Promise<void>;
export declare function operatorTypeCatalogViewSql(): {
    pgAm: string;
    pgOperator: string;
    pgOpfamily: string;
    pgOpclass: string;
    pgAmop: string;
    pgAmproc: string;
    pgCast: string;
    pgCollation: string;
};
