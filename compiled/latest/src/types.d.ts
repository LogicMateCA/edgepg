import type { OperatorTypeCommand } from "./operator-types";
import type { TextSearchCommand, TextSearchExpressionReference } from "./text-search";
import type { CollationReference } from "./collations";
export type EdgePgScalar = string | number | boolean | null | ArrayBuffer | Uint8Array | Date;
export type EdgePgValue = EdgePgScalar | EdgePgValue[] | {
    [key: string]: EdgePgValue;
};
export interface EdgePgBindings {
    DB: D1Database;
    COORDINATOR?: DurableObjectNamespace;
    EDGEPG_WRITE_FENCE?: string;
    [name: string]: unknown;
}
export interface EdgePgAuthenticationContext {
    principal: string;
    method: "trusted" | "password";
    provider: string;
    credentialReference?: string;
    sessionId?: string;
}
export interface EdgePgPasswordAuthenticationProvider {
    verify(input: {
        principal: string;
        database: string;
        credentialReference: string;
    }): Promise<boolean>;
}
export type EdgePgDiagnosticsEvent = {
    kind: "route";
    binding?: string;
    mode: "direct" | "primary" | "replica";
    requestedMode: "primary" | "replica";
    readReplication: boolean;
    sessionConstraint: "disabled" | "first-primary" | "first-unconstrained" | "bookmark";
    bookmarkPresent: boolean;
} | {
    kind: "d1";
    binding?: string;
    operation: "run" | "all" | "raw" | "first" | "batch" | "exec";
    statementCount: number;
    sql?: string;
    durationMs: number;
    rows?: number;
    meta?: Record<string, unknown>;
    error?: string;
} | {
    kind: "durable-object";
    binding?: string;
    operation: "get" | "fetch";
    durationMs: number;
    status?: number;
    error?: string;
};
export type EdgePgDiagnosticsSink = (event: EdgePgDiagnosticsEvent) => void;
export type EdgePgPlPgSqlParser = (definition: string) => unknown | Promise<unknown>;
export interface EdgePgConfig {
    bindings?: EdgePgBindings;
    databaseBinding?: string;
    coordinatorBinding?: string;
    writeFenceBinding?: string;
    planner?: SqlPlanner;
    user?: string;
    role?: string;
    database?: string;
    databaseOwner?: string;
    authentication?: EdgePgAuthenticationContext;
    passwordProvider?: EdgePgPasswordAuthenticationProvider;
    connectionString?: string;
    settings?: Record<string, string>;
    readReplication?: boolean;
    advancedTables?: string[];
    bookmark?: string;
    notificationSessionId?: string;
    preserveNotificationSessionOnClose?: boolean;
    diagnostics?: EdgePgDiagnosticsSink;
    plpgsqlParser?: EdgePgPlPgSqlParser;
    plugins?: readonly EdgePgPlugin[];
}
export interface EdgePgNotification {
    processId: number;
    channel: string;
    payload: string;
}
export type ExecutionRoute = "direct-d1" | "rewrite-d1" | "coordinated-do" | "vectorize" | "spatial";
export type ImplementationStatus = "implemented" | "partial" | "planned";
export interface StatementExecutionPlan {
    statement: string;
    level: 1 | 2 | 3;
    route: ExecutionRoute;
    capability: string;
    implementation: ImplementationStatus;
    features: string[];
}
export type CapabilityProofStatus = "proven" | "conditional" | "unsupported" | "blocked";
export type CapabilityProofMode = "native" | "rewritten" | "coordinated";
export type CapabilityProofObligation = {
    kind: "catalog-snapshot";
    relations: string[];
    columns: string[];
} | {
    kind: "result-type-metadata";
    outputs: string[];
} | {
    kind: "transaction-workspace";
    reason: string;
} | {
    kind: "plugin";
    capability: string;
} | {
    kind: "parameter-shape";
    parameters: number[];
};
export interface CapabilityProofReason {
    capability: string;
    message: string;
    sqlState: "0A000" | "XX000";
    start?: number;
    end?: number;
}
export interface CapabilityProofNode {
    kind: string;
    status: CapabilityProofStatus;
    mode?: CapabilityProofMode;
    route?: ExecutionRoute;
    evidence: string[];
    obligations?: CapabilityProofObligation[];
    reason?: CapabilityProofReason;
    children?: CapabilityProofNode[];
}
export interface QueryCapabilityProof {
    version: 1;
    statementIndex: number;
    statement: string;
    capability: string;
    status: CapabilityProofStatus;
    mode?: CapabilityProofMode;
    route?: ExecutionRoute;
    root: CapabilityProofNode;
    obligations: CapabilityProofObligation[];
    reasons: CapabilityProofReason[];
}
export interface CapabilityAdmissionShadow {
    version: 1;
    scope: "builtin-cast-select" | "bounded-scalar-count-select";
    statementIndex: number;
    legacyAdmitted: boolean;
    proofAdmitted: boolean;
    parity: boolean;
    rewriteSpans: Array<{
        start: number;
        end: number;
    }>;
}
export interface SetOperationAllReference {
    operation: "intersect" | "except";
    leftSql: string;
    rightSql: string;
    outputNames: string[];
    outputTypeOids: Array<number | null>;
    orderBy: Array<{
        resultIndex: number;
        direction: "asc" | "desc";
        nulls: "first" | "last";
    }>;
    limit?: {
        kind: "literal";
        value: number | null;
    } | {
        kind: "parameter";
        index: number;
    };
    offset?: {
        kind: "literal";
        value: number | null;
    } | {
        kind: "parameter";
        index: number;
    };
}
export interface QueryExecutionPlan {
    version: 1;
    executable: boolean;
    statements: StatementExecutionPlan[];
    capabilityProofs?: QueryCapabilityProof[];
    capabilityAdmissionShadows?: CapabilityAdmissionShadow[];
    notices?: QueryNotice[];
    relationRewrites?: RelationRewrite[];
    runtimeResultTypeOidCache?: Map<string, Map<string, number>>;
    joinAliasColumnReferences?: JoinAliasColumnReference[];
    temporaryRelationReferences?: RelationRewrite[];
    temporaryRegclassReferences?: TemporaryRegclassReference[];
    semanticCommands?: SemanticCommand[];
    customTypeColumns?: CustomTypeColumnReference[];
    customTypeCasts?: CustomTypeCastReference[];
    customTypeWrites?: CustomTypeWriteReference[];
    updateWholeRowAssignments?: UpdateWholeRowAssignmentReference[];
    numericInsertValues?: NumericInsertValuesReference;
    extensionCastExpressions?: ExtensionCastExpressionReference[];
    extensionCastWrites?: ExtensionCastWriteReference[];
    customTypeSorts?: CustomTypeSortReference[];
    customTypeComparisons?: CustomTypeComparisonReference[];
    customTypeResultReferences?: CustomTypeResultReference[];
    customTypeConstructors?: CustomTypeConstructorReference[];
    customTypeAccesses?: CustomTypeAccessReference[];
    customTypeFields?: CustomTypeFieldReference[];
    pointSubscripts?: PointSubscriptReference[];
    customTypeOperators?: CustomTypeOperatorReference[];
    structuredInsertSelect?: StructuredInsertSelectReference;
    dataModifyingCte?: DataModifyingCteReference;
    numericInsertSelect?: NumericInsertSelectReference;
    numericRounds?: NumericRoundReference[];
    numericValuesQuery?: NumericValuesQueryReference;
    userOperatorExpressions?: UserOperatorExpressionReference[];
    customTypeAggregates?: CustomTypeAggregateReference[];
    customTypeBooleanResultNames?: string[];
    builtinResultTransforms?: Array<{
        kind: "cash_words" | "checked_money" | "money_numeric" | "checked_integer" | "checked_float" | "checked_point" | "checked_geometry" | "float_send" | "numeric_to_char" | "numeric_to_number" | "format" | "text_cast" | "text_concat" | "temporal_part" | "temporal_format" | "temporal_difference" | "unicode_normalize" | "unicode_is_normalized" | "unicode_assigned" | "derived_whole_row";
        name: string;
        sourceOid?: number;
        sourceColumn?: string;
        sourceTables?: string[];
        staticText?: string;
    }>;
    bpcharLengthExpressions?: Array<{
        start: number;
        end: number;
        sourceSql: string;
        tablePhysicalNames: string[];
        column: string;
    }>;
    minMaxExpressions?: MinMaxExpressionReference[];
    timetzZoneExpressions?: TimetzZoneReference[];
    temporalPartExpressions?: TemporalPartReference[];
    temporalFormatExpressions?: TemporalFormatReference[];
    moneyNumericCasts?: MoneyNumericCastReference[];
    routineCalls?: RoutineCallReference[];
    textSearchExpressions?: TextSearchExpressionReference[];
    collationReferences?: CollationReference[];
    rowSecurityTables?: RowSecurityTableReference[];
    onConflictWholeRows?: OnConflictWholeRowReference[];
    onConflictInference?: OnConflictInferenceReference[];
    onConflictConstraints?: OnConflictConstraintReference[];
    onConflictColumns?: OnConflictColumnReference[];
    onConflictDoNothingUnqualified?: boolean;
    onConflictUpdateCardinality?: boolean;
    mutationReturningTransition?: MutationReturningTransitionReference;
    sessionExpressions?: SessionExpressionReference[];
    inputValidationFunctions?: InputValidationReference[];
    regObjectFunctions?: RegObjectFunctionReference[];
    schemaPrivilegeFunctions?: SchemaPrivilegeFunctionReference[];
    viewDefinitionFunctions?: ViewDefinitionFunctionReference[];
    arrayColumns?: ArrayColumnReference[];
    arrayRewrites?: SourceRewrite[];
    arrayParameterIndices?: number[];
    arrayParameterTypes?: Record<number, string>;
    arrayResultNames?: string[];
    arrayBooleanResultNames?: string[];
    boundedArraySubquery?: boolean;
    defaultRewrites?: SourceRewrite[];
    zeroColumnLateralValues?: Array<{
        start: number;
        end: number;
        sourceAlias: string;
        sourceRelation: string;
    }>;
    zeroColumnSelect?: boolean;
    rangeSeriesRelationalRewrite?: boolean;
    targetSeriesZipRewrite?: boolean;
    correlatedSeriesPaginationRewrite?: boolean;
    withTiesRewrite?: boolean;
    boundedScalarCountProjection?: boolean;
    nativeRelationalSubqueries?: boolean;
    nativeNonrecursiveSelectCte?: boolean;
    boundedLinearRecursiveCte?: {
        resultIndex: number;
        anchor: number;
        anchorParameterIndex?: number;
        step: number;
        inclusive: boolean;
        literalBound?: number;
        boundParameterIndex?: number;
        maxIterations: number;
        resultTypeOid?: number;
    };
    boundedSingleRowCteScalarProjection?: {
        resultIndex: number;
        outputName: string;
        hasAlias: boolean;
        explicitTypeOid: number;
        explicitTypeName: string;
    };
    setOperationAll?: SetOperationAllReference;
    unicodeStringConstants?: boolean;
    deleteUsing?: boolean;
    deleteUnsupportedFeature?: "where-current-of" | "returning-aliases";
    rowLocking?: RowLockingReference;
    mutationRowLocking?: {
        tablePhysicalName: string;
        alias?: string;
        sourceClauseSql?: string;
        predicateSql?: string;
    };
    insertDefaults?: InsertDefaultReference[];
    sequenceFunctions?: SequenceFunctionReference[];
    sequenceColumns?: SequenceColumnReference[];
    sequenceInsert?: SequenceInsertReference;
    sequenceUpdateDefaults?: SequenceUpdateDefaultReference;
    resultColumns?: ResultColumnReference[];
    groupingValidations?: GroupingValidationReference[];
    postgresCatalogTable?: PostgresCatalogTableReference;
    createTableLike?: CreateTableLikeReference;
    tableInheritance?: TableInheritanceReference;
    tableInheritanceAlteration?: TableInheritanceAlterationReference;
    tableInheritanceMutation?: TableInheritanceMutationReference;
    partitioning?: PartitioningReference;
    partitionTableoidReferences?: Array<{
        start: number;
        end: number;
        sortByRelationOid?: boolean;
    }>;
    postgresCatalogAlteration?: PostgresCatalogAlterationReference;
    postgresTableRebuild?: PostgresTableRebuildReference;
    postgresCatalogObject?: PostgresCatalogObjectReference;
    createTableConstraints?: TableConstraintCommand[];
}
export interface MutationReturningTransitionReference {
    tablePhysicalName: string;
    operation: "insert" | "update" | "delete" | "upsert";
    projections: MutationReturningProjection[];
}
export type MutationReturningProjection = {
    outputName: string;
    expression: MutationReturningExpression;
};
export type MutationReturningExpression = {
    kind: "column";
    source: "old" | "new";
    column: string;
} | {
    kind: "record";
    source: "old" | "new";
} | {
    kind: "literal";
    value: string | number | boolean | null;
} | {
    kind: "text-cast";
    expression: MutationReturningExpression;
} | {
    kind: "concat";
    left: MutationReturningExpression;
    right: MutationReturningExpression;
} | {
    kind: "coalesce";
    expressions: MutationReturningExpression[];
};
export interface RowLockingReference {
    implementation: "implemented" | "planned";
    strength: "key-share" | "share" | "no-key-update" | "update";
    waitPolicy: "block" | "error";
    tablePhysicalName: string;
    keyColumn?: string;
    keyValue?: {
        kind: "parameter";
        index: number;
    } | {
        kind: "literal";
        value: EdgePgValue;
    };
    predicateSql?: string;
    joinRelations?: Array<{
        tablePhysicalName: string;
        alias: string;
        outputName: string;
    }>;
    joinProjection?: {
        start: number;
        end: number;
    };
    rewrite?: SourceRewrite;
}
export interface CreateTableLikeReference {
    schema: string;
    name: string;
    physicalName: string;
    sourceSchema: string;
    sourceName: string;
    sourcePhysicalName: string;
    ifNotExists?: boolean;
    persistence?: "permanent" | "temporary";
    includingConstraints: boolean;
    includingDefaults: boolean;
    includingIndexes: boolean;
    additionalNotNull?: Array<{
        column: string;
        name?: string;
        noInherit: boolean;
    }>;
    unsupportedOptions: number;
}
export interface TableInheritanceReference {
    schema: string;
    name: string;
    physicalName: string;
    definition: string;
    parents: Array<{
        schema: string;
        name: string;
        physicalName: string;
    }>;
}
export interface TableInheritanceAlterationReference {
    action: "attach" | "detach";
    childSchema: string;
    childName: string;
    childPhysicalName: string;
    parentSchema: string;
    parentName: string;
    parentPhysicalName: string;
}
export interface TableInheritanceMutationReference {
    command: "UPDATE" | "DELETE";
    hasSource: boolean;
    sourceLocations: number[];
    sourceShapeSupported: boolean;
    schema: string;
    name: string;
    physicalName: string;
    alias?: string;
    mode: "include" | "only";
    start: number;
    end: number;
}
export interface PartitioningReference {
    action: "create-parent" | "create-partition" | "attach-partition" | "detach-partition";
    schema: string;
    name: string;
    physicalName: string;
    parentSchema?: string;
    parentName?: string;
    parentPhysicalName?: string;
    strategy?: "range" | "list" | "hash";
    keyExpressions?: string[];
    bound?: {
        default?: boolean;
        strategy?: "range" | "list" | "hash";
        lower?: PartitionBoundDatum[];
        upper?: PartitionBoundDatum[];
        values?: PartitionBoundDatum[];
        modulus?: number;
        remainder?: number;
    };
    baseSql?: string;
    definition: string;
}
export type PartitionBoundDatum = {
    kind: "value";
    value: EdgePgValue;
} | {
    kind: "minvalue" | "maxvalue";
} | {
    kind: "expression";
    sql: string;
};
export type OnConflictWholeRowReference = {
    kind: "compare";
    start: number;
    end: number;
    operator: "=" | "<>";
    leftRelation: string;
    rightRelation: string;
} | {
    kind: "text";
    start: number;
    end: number;
    relation: string;
} | {
    kind: "null";
    start: number;
    end: number;
    relation: string;
    negated: boolean;
} | {
    kind: "expand" | "row-expand";
    start: number;
    end: number;
    relation: string;
};
export interface OnConflictInferenceReference {
    predicateStart: number;
    predicateEnd: number;
    indexElementKeys: string[];
    predicate: unknown;
}
export interface OnConflictConstraintReference {
    name: string;
    action: "nothing" | "update";
    clauseStart: number;
    clauseEnd: number;
}
export interface OnConflictColumnReference {
    kind: "arbiter" | "excluded";
    column: string;
    start: number;
}
export interface GroupingValidationReference {
    tablePhysicalName: string;
    tableLabel: string;
    groupedColumns: string[];
    groupedTargetAliases?: Array<{
        alias: string;
        column: string;
    }>;
    selectedColumn: string;
    selectedLabel: string;
    aggregateCandidate?: RoutineCallReference;
    position?: number;
    resolvedPrimaryConstraint?: string;
}
export interface PostgresCatalogAlterationReference {
    schema?: string;
    name: string;
    definition: string;
    shapeChanges: PostgresCatalogShapeChange[];
}
export interface PostgresTableRebuildReference {
    schema: string;
    name: string;
    physicalName: string;
    definition: string;
    action: "set-not-null" | "drop-not-null" | "alter-type" | "set-default" | "drop-default" | "drop-column";
    column: string;
    tableIfExists?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
    constraintName?: string;
    notValid?: boolean;
    noInherit?: boolean;
    recurse?: boolean;
    constraintSqlStatements?: string[];
    pgType?: string;
    usingColumn?: string;
    usingSql?: string;
    defaultSql?: string;
    generatedColumns?: PostgresGeneratedColumnReference[];
}
export interface PostgresGeneratedColumnReference {
    column: string;
    expressionSql: string;
    stored: boolean;
}
export type PostgresCatalogShapeChange = {
    action: "add";
    column: string;
    pgType: string;
    notNull?: boolean;
    defaultSql?: string;
    notNullConstraintName?: string;
    notNullNoInherit?: boolean;
} | {
    action: "drop";
    column: string;
} | {
    action: "rename";
    column: string;
    newColumn: string;
} | {
    action: "type";
    column: string;
    pgType: string;
} | {
    action: "set-not-null" | "drop-not-null" | "set-default" | "drop-default";
    column: string;
    defaultSql?: string;
    notValid?: boolean;
};
export interface PostgresCatalogObjectReference {
    phase: "pre_data" | "post_data";
    kind: "index" | "view";
    schema: string;
    name: string;
    implicitName?: boolean;
    indexColumns?: string[];
    indexUnique?: boolean;
    indexOnly?: boolean;
    indexNullsNotDistinct?: boolean;
    indexConcurrently?: boolean;
    indexIfNotExists?: boolean;
    definition: string;
    viewDefinition?: string;
    compactViewDefinition?: string;
    relationNatts?: number;
    relationPgTypes?: string[];
    relationCollations?: string[];
    dependencies?: string[];
    routineDependencies?: number[];
    reloptions?: string[];
}
export interface PostgresCatalogTableReference {
    schema: string;
    name: string;
    physicalName: string;
    ifNotExists?: boolean;
    definition: string;
    columns: string[];
    pgTypes: string[];
    notNull?: boolean[];
    defaults?: Array<string | null>;
    exportKey: string[];
    generatedColumns?: PostgresGeneratedColumnReference[];
    reloptions?: string[];
    persistence?: "permanent" | "temporary" | "unlogged-equivalent" | "foreign";
    onCommit?: "preserve" | "delete" | "drop";
    foreignServerName?: string;
    foreignOptions?: string[];
    foreignColumnOptions?: Record<string, string[]>;
}
export interface ArrayColumnReference {
    tableName: string;
    tablePhysicalName: string;
    column: string;
    elementType: string;
    dimensions: number;
    start: number;
    end: number;
}
export interface PointSubscriptReference {
    start: number;
    end: number;
    tablePhysicalNames: string[];
    column: string;
    source: string;
    derivedPoint?: {
        function: "poly_center";
        argument: CustomTypeOperatorOperand;
    };
    index: 0 | 1;
    outputName?: string;
    orderBy?: {
        direction: "asc" | "desc";
        nulls: "first" | "last";
    };
}
export interface SessionExpressionReference {
    kind: "current-user" | "session-user" | "current-role" | "current-database" | "database-encoding" | "current-catalog" | "current-schema" | "current-setting" | "set-config";
    start: number;
    end: number;
    outputName?: string;
    rangeFunction?: boolean;
    arguments: Array<{
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    } | {
        kind: "expression";
    }>;
}
export interface TimetzZoneReference {
    start: number;
    end: number;
    tablePhysicalNames: string[];
    column: string;
    sourceSql: string;
    target: {
        kind: "local";
    } | {
        kind: "zone" | "interval";
        value: string;
    };
    resultName?: string;
}
export interface TemporalPartReference {
    start: number;
    end: number;
    tablePhysicalNames: string[];
    column: string;
    sourceSql: string;
    unit: string;
    resultName?: string;
    appendResultAlias?: boolean;
    rounded?: boolean;
    outputScale?: number;
}
export type TemporalValueReference = {
    kind: "current";
    sql: string;
} | {
    kind: "column";
    tablePhysicalNames: string[];
    column: string;
    sql: string;
    explicitType?: string;
} | {
    kind: "interval";
    monthsSql: string;
    daysSql: string;
    microsSql: string;
} | {
    kind: "literal";
    type: "date" | "timestamp" | "timestamptz";
    value: string;
    sql: string;
};
export interface TemporalFormatReference {
    operation?: "to-char" | "date-trunc" | "date-bin" | "date-trunc-bin-equal" | "at-time-zone" | "make-timestamptz" | "date-add" | "date-subtract" | "to-timestamp" | "generate-series-timestamptz";
    start: number;
    end: number;
    format?: string;
    unit?: string;
    unitSql?: string;
    unitValues?: string[];
    zone?: string;
    stride?: string;
    strideSql?: string;
    strideValues?: string[];
    origin?: TemporalValueReference;
    resultName?: string;
    appendResultAlias?: boolean;
    argumentsSql?: string[];
    maximumRows?: number;
    targetSeriesInsertion?: number;
    targetSeriesHasFrom?: boolean;
    comparisonOperator?: string;
    comparisonValue?: string;
    comparisonFunctionOnLeft?: boolean;
    source: TemporalValueReference;
}
export interface MoneyNumericCastReference {
    start: number;
    end: number;
    resultName?: string;
    appendResultAlias?: boolean;
    source: {
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    } | {
        kind: "column";
        tablePhysicalNames: string[];
        column: string;
    };
}
export interface InputValidationReference {
    kind: "is-valid" | "error-info";
    start: number;
    end: number;
    outputName?: string;
    appendResultAlias?: boolean;
    rangeFunction: boolean;
    arguments: Array<{
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    } | {
        kind: "expression";
        source: string;
    }>;
}
export interface RegObjectFunctionReference {
    kind: "regoper" | "regoperator" | "regproc" | "regprocedure" | "regclass" | "regtype" | "regcollation" | "regrole" | "regnamespace" | "regtypemod";
    missingOk: boolean;
    start: number;
    end: number;
    inputPosition: number;
    outputName: string;
    appendResultAlias: boolean;
    directResult: boolean;
    argument: {
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    } | {
        kind: "expression";
        source: string;
    };
}
export interface SchemaPrivilegeFunctionReference {
    objectType: "schema" | "database";
    start: number;
    end: number;
    outputName?: string;
    implicitAlias?: boolean;
    arguments: Array<{
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    } | {
        kind: "expression";
        source: string;
        pgType?: "boolean" | "oid" | "integer" | "text" | "name" | "unknown";
        column?: {
            qualifier?: string;
            name: string;
        };
    }>;
}
export interface ViewDefinitionFunctionReference {
    start: number;
    end: number;
    outputName?: string;
    arguments: Array<{
        kind: "parameter";
        number: number;
        pgType?: "boolean" | "oid" | "integer" | "text" | "name" | "unknown";
    } | {
        kind: "literal";
        value: string | number | boolean | null;
        pgType?: "boolean" | "oid" | "integer" | "text" | "name" | "unknown";
    } | {
        kind: "expression";
        source: string;
        pgType?: "boolean" | "oid" | "integer" | "text" | "name" | "unknown";
    }>;
}
export interface RowSecurityTableReference {
    schema?: string;
    name: string;
    physicalName: string;
    relation: string;
    start: number;
    end: number;
    alias?: string;
    command: "select" | "insert" | "update" | "delete";
    target: boolean;
    filterInsertion?: number;
    hasWhere?: boolean;
    columns?: string[];
}
export type RoutineParameterMode = "in" | "out" | "inout" | "variadic" | "table";
export interface RoutineParameterSpec {
    name?: string;
    mode: RoutineParameterMode;
    typeName: string;
    defaultSql?: string;
}
export interface RoutineSignatureSpec {
    objectType: "function" | "procedure" | "routine";
    schema: string;
    explicitlyQualified?: boolean;
    argumentsUnspecified?: boolean;
    name: string;
    physicalName: string;
    inputArgumentTypes: string[];
}
export interface RoutineArgumentReference {
    source: string;
    name?: string;
    start: number;
    end: number;
}
export interface RoutineCallReference {
    schema?: string;
    name: string;
    physicalName: string;
    resultName?: string;
    appendResultAlias?: boolean;
    rangeFunction?: boolean;
    setReturningContext?: {
        insertion: number;
        hasFrom: boolean;
        relationAlias: string;
        outputName: string;
    };
    outerMutationReference?: string;
    argumentValues?: CustomTypeValueExpression[];
    start: number;
    end: number;
    arguments: string[];
    argumentReferences?: RoutineArgumentReference[];
}
export interface CustomTypeComparisonReference {
    tablePhysicalNames: string[];
    column: string;
    columnStart: number;
    columnEnd: number;
    columnSource: string;
    expressionStart: number;
    expressionEnd: number;
    operator: "=" | "<>" | "!=" | "<" | "<=" | ">" | ">=";
    inputStart: number;
    inputEnd: number;
    inputSource: string;
    input: {
        kind: "parameter";
        number: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
    };
}
export interface CustomTypeSortReference {
    tablePhysicalNames: string[];
    column: string;
    source: string;
    start: number;
    end: number;
    direction: "asc" | "desc";
    nulls: "first" | "last";
}
export interface CustomTypeResultReference {
    name: string;
    typePhysicalName: string;
    array?: boolean;
}
export type CustomTypeValueExpression = ({
    kind: "parameter";
    number: number;
} | {
    kind: "literal";
    value: string | number | boolean | null;
    pgType?: string;
} | {
    kind: "cast";
    typePhysicalName: string;
    declaredType?: string;
    input: CustomTypeValueExpression;
    sourceOperand?: CustomTypeOperatorOperand;
} | {
    kind: "constructor";
    typePhysicalName: string;
    arguments: CustomTypeValueExpression[];
} | {
    kind: "array";
    elements: CustomTypeValueExpression[];
    pgType?: string;
} | {
    kind: "expression";
}) & {
    source?: string;
};
export interface CustomTypeConstructorReference {
    start: number;
    end: number;
    typePhysicalName: string;
    arguments: CustomTypeValueExpression[];
}
export type CustomTypeAccessFunction = "lower" | "upper" | "isempty" | "lower_inc" | "upper_inc" | "lower_inf" | "upper_inf" | "enum_first" | "enum_last" | "enum_range" | "trunc" | "round" | "ceil" | "ceiling" | "floor" | "sign" | "sqrt" | "ln" | "exp" | "sinh" | "cosh" | "tanh" | "asinh" | "acosh" | "atanh" | "erf" | "erfc" | "gamma" | "lgamma" | "macaddr8_set7bit" | "range_merge" | "unnest" | "row_to_json" | "row_to_json_upper" | "bpchar_to_text" | "bpchar_to_varchar" | "area" | "height" | "width" | "center" | "point" | "radius" | "diameter" | "npoints" | "ishorizontal" | "isvertical" | "slope" | "isopen" | "isclosed" | "popen" | "pclose" | "box" | "bound_box" | "diagonal" | "polygon" | "circle" | "poly_center";
export interface CustomTypeAccessReference {
    function: CustomTypeAccessFunction;
    start: number;
    end: number;
    outputName?: string;
    implicitAlias?: boolean;
    argument: CustomTypeOperatorOperand;
    secondArgument?: CustomTypeOperatorOperand;
    derivedTypePhysicalName?: string;
    setReturning?: {
        kind: "target";
        insertion: number;
        hasFrom: boolean;
        relationAlias: string;
    } | {
        kind: "range";
        outputName: string;
    };
}
export interface CustomTypeFieldReference {
    start: number;
    end: number;
    tablePhysicalNames: string[];
    tablePhysicalName?: string;
    sourceQualifier?: string;
    column: string;
    path: string[];
    outputName?: string;
}
export type CustomTypeOperator = "=" | "<>" | "!=" | "<" | "<=" | ">" | ">=" | "@>" | "<@" | "&&" | "<<" | ">>" | "|>>" | "<<|" | "&<|" | "|&>" | "~=" | "<->" | "?" | "?|" | "?&" | "?-" | "?||" | "?-|" | "?#" | "##" | "#-" | "<^" | ">^" | "@-@" | "&" | "|" | "#" | "~" | "@" | "@@" | "^" | "|/" | "||/" | "&<" | "&>" | "-|-" | "+" | "*" | "/" | "%" | "-";
export type CustomTypeOperatorOperand = CustomTypeValueExpression | {
    kind: "column";
    tablePhysicalNames: string[];
    column: string;
    source?: string;
} | {
    kind: "operator";
    operator: CustomTypeOperator;
    left: CustomTypeOperatorOperand;
    right: CustomTypeOperatorOperand;
    source?: string;
};
export interface CustomTypeOperatorReference {
    operator: CustomTypeOperator;
    start: number;
    end: number;
    operatorPosition?: number;
    left: CustomTypeOperatorOperand;
    right: CustomTypeOperatorOperand;
    resultName?: string;
    appendResultAlias?: boolean;
    unary?: boolean;
    storageTarget?: {
        tablePhysicalName: string;
        column: string;
    };
}
export interface UserOperatorExpressionReference {
    schema: string;
    name: string;
    start: number;
    end: number;
    leftSql?: string;
    rightSql: string;
    leftTypeOid?: number;
    rightTypeOid?: number;
    resultName?: string;
}
export interface CustomTypeAggregateReference {
    function: "range_agg" | "range_intersect_agg" | "min" | "max" | "abs" | "avg" | "stddev" | "variance";
    name: string;
    implicitAlias?: boolean;
    start: number;
    end: number;
    tablePhysicalNames: string[];
    argument?: CustomTypeOperatorOperand;
    column?: string;
    derivedTypePhysicalName?: string;
    distinct: boolean;
}
export interface CustomTypeCastReference {
    typeName: string;
    typePhysicalName: string;
    typeSchema: string;
    explicitlyQualified?: boolean;
    resultName?: string;
    appendResultAlias?: boolean;
    enumOrderExpression?: string;
    enumOrderStart?: number;
    castLocation: number;
    typeLocation: number;
    typeEnd: number;
    dimensions?: number;
    expressionStart?: number;
    expressionEnd?: number;
    syntax: "postgres" | "cast" | "typed-literal";
    structuredInput?: CustomTypeValueExpression;
    sourceOperand?: CustomTypeOperatorOperand;
    input: {
        kind: "parameter";
        number: number;
        start: number;
        end: number;
    } | {
        kind: "literal";
        value: string | number | boolean | null;
        start: number;
        end: number;
    } | {
        kind: "expression";
        typeHint?: MergeSourceTypeHint;
    };
}
export interface ExtensionCastExpressionReference {
    sourceType: string;
    sourceExplicitlyQualified: boolean;
    targetType: string;
    targetExplicitlyQualified: boolean;
    start: number;
    end: number;
    sourceStart: number;
    sourceEnd: number;
    context: "explicit" | "implicit";
    resultName?: string;
}
export interface ExtensionCastWriteReference {
    tablePhysicalName: string;
    columns: string[];
    values: Array<{
        columnIndex: number;
        sourceType: string;
        sourceExplicitlyQualified: boolean;
        start: number;
        end: number;
        sourceStart: number;
        sourceEnd: number;
    }>;
}
export interface CustomTypeWriteReference {
    operation: "insert" | "update";
    tableName: string;
    tablePhysicalName: string;
    columns: string[];
    rows: Array<Array<CustomTypeCastReference["input"] | null>>;
    insertTargetIndirection?: {
        columnsStart: number;
        columnsEnd: number;
        targets: Array<{
            name: string;
            path: Array<{
                kind: "field";
                name: string;
            } | {
                kind: "index";
                index: number;
            }>;
        }>;
        rows: Array<{
            start: number;
            end: number;
            values: CustomTypeValueExpression[];
        }>;
    };
}
export interface UpdateWholeRowAssignmentReference {
    tableName: string;
    tablePhysicalName: string;
    column: string;
    sourceRelation: string;
    start: number;
    end: number;
}
export type NumericWriteExpressionReference = {
    kind: "literal";
    value: string;
} | {
    kind: "source";
    sql: string;
    tablePhysicalNames: string[];
    column?: string;
} | {
    kind: "operator";
    operator: "+" | "-" | "*" | "/";
    left: NumericWriteExpressionReference;
    right: NumericWriteExpressionReference;
} | {
    kind: "round";
    input: NumericWriteExpressionReference;
    scale: number;
};
export interface NumericInsertValuesReference {
    tablePhysicalName: string;
    columns: string[];
    rows: Array<Array<{
        start: number;
        end: number;
        expression?: NumericValuesExpression;
        rowWrapper?: boolean;
    }>>;
}
export interface NumericInsertSelectReference {
    tablePhysicalName: string;
    columns: string[];
    targets: Array<{
        start: number;
        end: number;
        expression?: NumericWriteExpressionReference;
    }>;
}
export interface StructuredInsertSelectReference {
    tablePhysicalName: string;
    columns: string[];
    targets: Array<{
        start: number;
        end: number;
        expression?: CustomTypeValueExpression;
        typePhysicalName?: string;
    }>;
}
export interface DataModifyingCteReference {
    name: string;
    columns: string[];
    innerSql: string;
    outerSql: string;
    placeholder: string;
}
export interface NumericRoundReference {
    start: number;
    end: number;
    tablePhysicalNames: string[];
    column: string;
    sourceSql: string;
    scale: number;
    appendImplicitAlias?: boolean;
}
export type NumericValuesExpression = {
    kind: "source";
    name: string;
} | {
    kind: "null";
} | {
    kind: "literal";
    value: string;
} | {
    kind: "unary";
    operator: "+" | "-";
    input: NumericValuesExpression;
} | {
    kind: "operator";
    operator: "+" | "-" | "*" | "/" | "%" | "^";
    left: NumericValuesExpression;
    right: NumericValuesExpression;
} | {
    kind: "function";
    function: "div" | "abs" | "floor" | "ceil" | "ceiling" | "sign" | "numeric_inc" | "round" | "trunc" | "sqrt" | "exp" | "ln" | "log" | "log10" | "power" | "width_bucket" | "scale" | "min_scale" | "trim_scale" | "gcd" | "lcm" | "factorial" | "mod" | "pg_lsn";
    arguments: NumericValuesExpression[];
};
export interface NumericValuesQueryReference {
    values: string[];
    bindings: string[];
    series?: {
        start: number;
        step: number;
        count: number;
    };
    seriesExpressions?: Array<{
        binding: string;
        start: NumericValuesExpression;
        end: NumericValuesExpression;
        step?: NumericValuesExpression;
        outputOid: 23 | 1700;
    }>;
    formattedSeriesValidation?: {
        format: string;
        name: string;
    };
    table?: {
        physicalName: string;
        columns: string[];
    };
    tableAggregate?: {
        function: "variance" | "stddev" | "avg" | "min" | "max";
        column: string;
        name: string;
        multiplier?: NumericValuesExpression;
        trimScale?: boolean;
    };
    derived?: {
        constants: Record<string, NumericValuesExpression>;
        columns: string[];
        rows: NumericValuesExpression[][];
    };
    targets: Array<{
        name: string;
        expression: NumericValuesExpression;
        predicate?: never;
        aggregate?: "sum" | "avg" | "min" | "max";
        textSubstring?: {
            start: number;
            length: number;
        };
        integerOutput?: boolean;
        floatOutput?: boolean;
        pgLsnOutput?: boolean;
        booleanOutput?: never;
    } | {
        name: string;
        predicate: NumericValuesPredicate;
        expression?: never;
        aggregate?: never;
        booleanOutput: true;
        textSubstring?: never;
        integerOutput?: never;
        floatOutput?: never;
        pgLsnOutput?: never;
    }>;
    nonzeroFilter?: string;
    filter?: NumericValuesPredicate;
    orderBy?: {
        binding: string;
        direction: "asc" | "desc";
    };
}
export type NumericValuesPredicate = {
    kind: "comparison";
    operator: "=" | "<>" | "!=" | "<" | "<=" | ">" | ">=";
    left: NumericValuesExpression;
    right: NumericValuesExpression;
} | {
    kind: "boolean";
    operator: "and" | "or";
    arguments: NumericValuesPredicate[];
} | {
    kind: "null";
    expression: NumericValuesExpression;
    negated: boolean;
};
export interface SourceRewrite {
    start: number;
    end: number;
    replacement: string;
    parameterValue?: EdgePgValue;
    similarPatternParameter?: {
        number: number;
        escape: string;
    };
    composition?: "mutation-returning-source" | "join-alias-column-list";
}
export declare const SOURCE_REWRITE_PARAMETER = "__edgepg_source_parameter__";
export interface TemporaryRegclassReference {
    start: number;
    end: number;
    schema: string;
    relation: string;
    qualified: boolean;
    resultAlias: string;
}
export interface SequenceFunctionReference {
    action: "nextval" | "currval" | "lastval" | "setval";
    start: number;
    end: number;
    arguments: string[];
    resultName?: string;
    resultIndex?: number;
    hasAlias?: boolean;
}
export interface SequenceColumnReference {
    tableName: string;
    tablePhysicalName: string;
    column: string;
    sequenceName: string;
    sequencePhysicalName: string;
    mode: "serial" | "always" | "default";
    dataType: "smallint" | "integer" | "bigint";
    increment?: number | string;
    minValue?: number | string | null;
    maxValue?: number | string | null;
    startValue?: number | string;
    cache?: number | string;
    cycle?: boolean;
    existing?: boolean;
}
export interface SequenceInsertReference {
    tableName: string;
    tablePhysicalName: string;
    columns: string[];
    override: "system" | "user" | "none";
    values: boolean;
    defaultValues: boolean;
}
export interface SequenceUpdateDefaultReference {
    tableName: string;
    tablePhysicalName: string;
    assignments: Array<{
        column: string;
        start?: number;
        end?: number;
    }>;
}
export interface InsertDefaultReference {
    tablePhysicalName: string;
    column?: string;
    ordinal?: number;
    start: number;
    end: number;
}
export interface ResultColumnReference {
    column: string;
    outputName: string;
    hasAlias: boolean;
    tablePhysicalNames: string[];
    start: number;
    end: number;
    pgTypeHint?: "count" | "sum" | "min" | "max" | "avg" | "stddev" | "variance" | "array_agg";
    pgCommonTypeHint?: MergeSourceTypeHint;
    explicitTypeOid?: number;
    explicitTypeName?: string;
    relationRecordPhysicalName?: string;
    jsonSourceColumn?: string;
    temporalZoneSourceColumn?: string;
    explicitCollation?: string;
    explicitTypeModifier?: number;
    arrayTextCast?: boolean;
    preparedParameterIndex?: number;
    resultIndex?: number;
}
export interface MinMaxExpressionReference {
    kind: "least" | "greatest";
    start: number;
    end: number;
    arguments: string[];
    commonTypeHint: MergeSourceTypeHint;
    resultName?: string;
    appendResultAlias?: boolean;
}
export interface CustomTypeColumnReference {
    tableName: string;
    tablePhysicalName: string;
    column: string;
    typeName: string;
    typePhysicalName: string;
    typeSchema: string;
    location: number;
    dimensions?: number;
    hasDefault?: boolean;
}
export interface TypeRewrite {
    schema: string;
    name: string;
    replacement: string;
    location: number;
}
export type TableConstraintCommand = {
    kind: "table-check-constraint";
    action: "add" | "drop" | "rename" | "validate" | "alter-inheritability" | "alter-deferrability";
    tableName: string;
    tablePhysicalName: string;
    name: string;
    generatedName?: boolean;
    newName?: string;
    constraintType?: "check" | "unique" | "primary" | "foreign" | "exclusion" | "not-null";
    columns?: string[];
    exclusionOperators?: string[];
    exclusionOperandTypes?: Array<string | null>;
    exclusionPredicateAst?: unknown;
    columnTypes?: Record<string, string>;
    nullsNotDistinct?: boolean;
    usingIndexName?: string;
    referencedTableName?: string;
    referencedTablePhysicalName?: string;
    referencedColumns?: string[];
    matchType?: "simple" | "full";
    updateAction?: "no-action" | "restrict" | "cascade" | "set-null" | "set-default";
    deleteAction?: "no-action" | "restrict" | "cascade" | "set-null" | "set-default";
    deferrable?: boolean;
    initiallyDeferred?: boolean;
    noInherit?: boolean;
    isLocal?: boolean;
    inheritedCount?: number;
    enforced?: boolean;
    expressionAst?: unknown;
    columnDefaults?: Record<string, string>;
    notValid?: boolean;
    tableIfExists?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
    recurse?: boolean;
    definition: string;
};
export interface MergeActionPlan {
    match: "matched" | "not-matched-by-source" | "not-matched-by-target";
    command: "insert" | "update" | "delete" | "nothing";
    override: "none" | "system" | "user";
    condition?: unknown;
    assignments: Array<{
        column: string;
        value: unknown;
    }>;
    columns: string[];
    values: unknown[];
    defaultValues?: boolean;
}
export interface MergeReturningPlan {
    name?: string;
    value: unknown;
    subquerySql?: string;
    subqueryRelations?: MergeSourceRelationPlan[];
    subqueryCorrelations?: Array<{
        marker: string;
        kind: "target" | "source" | "old" | "new";
        column: string;
    }>;
}
export interface MergeSourceRelationPlan {
    physicalName: string;
    marker: string;
}
export interface MergeSourceTypeHint {
    type?: string;
    aggregate?: "count" | "sum";
    relationPhysicalName?: string;
    relationStarPhysicalName?: string;
    relationStarExcludedColumns?: string[];
    relationColumnOrdinal?: number;
    column?: string;
    unknownLiteral?: boolean;
    commonTypes?: MergeSourceTypeHint[];
}
export type SemanticCommand = OperatorTypeCommand | TextSearchCommand | {
    kind: "event-trigger-transition";
    action: "ddl-commands" | "dropped-objects";
} | {
    kind: "event-trigger";
    action: "create" | "enable" | "rename" | "owner" | "drop";
    name: string;
    eventName?: "ddl_command_start" | "ddl_command_end" | "sql_drop" | "table_rewrite" | "login";
    functionSchema?: string;
    functionName?: string;
    tags?: string[];
    enabled?: "O" | "D" | "R" | "A";
    newName?: string;
    owner?: string;
    ifExists?: boolean;
    cascade?: boolean;
} | {
    kind: "event";
    action: "listen" | "notify" | "unlisten";
    channel?: string;
    payload?: string;
    channelInput?: {
        kind: "literal";
        value: string;
    } | {
        kind: "parameter";
        index: number;
    } | {
        kind: "null";
    };
    payloadInput?: {
        kind: "literal";
        value: string;
    } | {
        kind: "parameter";
        index: number;
    } | {
        kind: "null";
    };
    functionResultName?: string;
} | {
    kind: "set-constraints";
    names: Array<{
        name: string;
        schema?: string;
    }>;
    all: boolean;
    deferred: boolean;
} | {
    kind: "system-setting";
    action: "set" | "reset" | "reset-all";
    name?: string;
    value?: string;
} | {
    kind: "system-record";
    tag: "ALTER LARGE OBJECT";
    recordKind: "large_object";
    key: string;
    owner?: string;
    definition: string;
} | {
    kind: "merge";
    targetName: string;
    targetPhysicalName: string;
    targetAlias: string;
    sourceSql: string;
    sourceAlias: string;
    sourceColumns: string[];
    sourceTables: string[];
    sourceRelations: MergeSourceRelationPlan[];
    joinCondition: unknown;
    actions: MergeActionPlan[];
    returning: MergeReturningPlan[];
    returningOldAlias: string;
    returningNewAlias: string;
    targetPgTypes?: string[];
    sourcePgTypes?: string[];
    sourceTypeHints?: MergeSourceTypeHint[];
    compositeTypes?: Record<string, Array<{
        name: string;
        type: string;
    }>>;
} | TableConstraintCommand | {
    kind: "rename-table";
    schema: string;
    relation: string;
    name: string;
    physicalName: string;
    newName: string;
    newPhysicalName: string;
    newSchema?: string;
} | {
    kind: "table-owner";
    schema: string;
    name: string;
    physicalName: string;
    owner: string;
} | {
    kind: "alter-table-add-columns";
    schema: string;
    name: string;
    physicalName: string;
    definition: string;
    tableIfExists?: boolean;
    columns: Array<{
        name: string;
        pgType: string;
        sqliteType: string;
        notNull?: boolean;
        defaultSql?: string;
        backfillDefault?: boolean;
        notNullConstraintName?: string;
        notNullNoInherit?: boolean;
        ifNotExists?: boolean;
    }>;
    constraints?: TableConstraintCommand[];
} | {
    kind: "alter-table-not-null-columns";
    schema: string;
    name: string;
    physicalName: string;
    definition: string;
    changes: PostgresTableRebuildReference[];
} | {
    kind: "alter-table-persistence";
    schema: string;
    name: string;
    physicalName: string;
    persistence: "permanent" | "unlogged-equivalent";
} | {
    kind: "alter-table-options";
    schema: string;
    name: string;
    physicalName: string;
    action: "set" | "reset";
    options: string[];
    resolvedOptions?: string[];
} | {
    kind: "alter-table-replica-identity";
    schema: string;
    name: string;
    physicalName: string;
    replicaIdentity: "d" | "f" | "n";
} | {
    kind: "view";
    action: "rename" | "rename-column" | "owner" | "set-schema";
    schema: string;
    relation: string;
    name: string;
    physicalName: string;
    newName?: string;
    newPhysicalName?: string;
    owner?: string;
    newSchema?: string;
    oldColumn?: string;
    newColumn?: string;
} | {
    kind: "materialized-view";
    action: "create" | "refresh" | "rename" | "owner" | "set-schema" | "drop";
    name: string;
    schema: string;
    relation: string;
    physicalName: string;
    newName?: string;
    newPhysicalName?: string;
    owner?: string;
    newSchema?: string;
    querySql?: string;
    withData?: boolean;
    concurrently?: boolean;
    ifExists?: boolean;
    columns?: string[];
    unsupportedOptions?: boolean;
    cascade?: boolean;
} | {
    kind: "custom-type";
    action: "create-enum" | "alter-enum" | "rename-type" | "owner" | "set-schema" | "drop-type" | "create-domain" | "alter-domain" | "rename-domain" | "drop-domain" | "create-composite" | "alter-composite" | "create-range";
    name: string;
    physicalName: string;
    schema?: string;
    qualified?: boolean;
    newName?: string;
    newPhysicalName?: string;
    values?: string[];
    oldValue?: string;
    newValue?: string;
    neighbor?: string;
    after?: boolean;
    ifExists?: boolean;
    baseType?: string;
    checkExpressions?: string[];
    domainConstraints?: Array<{
        name: string;
        expression: string;
        validated: boolean;
    }>;
    notNull?: boolean;
    defaultExpression?: string;
    domainAction?: "set-default" | "drop-default" | "set-not-null" | "drop-not-null" | "add-constraint" | "drop-constraint" | "rename-constraint" | "validate-constraint" | "owner" | "set-schema";
    constraintName?: string;
    newConstraintName?: string;
    checkExpression?: string;
    notValid?: boolean;
    cascade?: boolean;
    owner?: string;
    newSchema?: string;
    fields?: Array<{
        name: string;
        type: string;
    }>;
    compositeChanges?: Array<{
        action: "add" | "drop" | "alter-type" | "rename";
        name: string;
        type?: string;
        newName?: string;
        ifExists?: boolean;
    }>;
    rangeSubtype?: string;
    rangeCollation?: string;
    rangeCanonical?: string;
    rangeSubtypeDiff?: string;
    multirangeName?: string;
    multirangePhysicalName?: string;
    multirangeNameExplicit?: boolean;
    definition: string;
} | {
    kind: "drop-relations";
    objectType: "table" | "view";
    identities: Array<{
        schema: string;
        relation: string;
        name: string;
        physicalName: string;
        qualified?: boolean;
    }>;
    ifExists: boolean;
    cascade: boolean;
} | {
    kind: "catalog-object";
    objectType: "access_method" | "database" | "tablespace" | "extension" | "publication" | "subscription" | "rule" | "statistics" | "transform" | "foreign_data_wrapper" | "foreign_server" | "user_mapping" | "foreign_table" | "foreign_schema_import";
    action: "create" | "alter" | "rename" | "owner" | "drop";
    name: string;
    newName?: string;
    owner?: string;
    connectionLimit?: number;
    schemaName?: string;
    schemaQualified?: boolean;
    version?: string;
    ifNotExists?: boolean;
    allTables?: boolean;
    publicationTables?: Array<{
        schema: string;
        name: string;
        physicalName: string;
    }>;
    publicationAction?: "set" | "add" | "drop";
    publish?: string[];
    connectionInfo?: string;
    subscriptionPublications?: string[];
    subscriptionEnabled?: boolean;
    subscriptionSlotName?: string | null;
    ruleEvent?: "select" | "insert" | "update" | "delete" | "unknown";
    ruleInstead?: boolean;
    ruleReplace?: boolean;
    ruleActionsJson?: string;
    statisticsTypes?: string[];
    statisticsExpressions?: string[];
    statisticsTarget?: number;
    transformTypeName?: string;
    transformLanguage?: string;
    transformFromFunction?: string;
    transformToFunction?: string;
    replace?: boolean;
    accessMethodType?: "i" | "t";
    fdwName?: string;
    serverName?: string;
    foreignOptions?: string[];
    foreignColumnOptions?: Record<string, string[]>;
    foreignOptionChanges?: Array<{
        target: "table" | "column";
        column?: string;
        action: "add" | "set" | "drop";
        name: string;
        value?: string;
    }>;
    userName?: string;
    tableSchemaName?: string;
    tableName?: string;
    physicalName?: string;
    columns?: string[];
    pgTypes?: string[];
    shapeChanges?: PostgresCatalogShapeChange[];
    newSchema?: string;
    newPhysicalName?: string;
    remoteSchema?: string;
    importListType?: "all" | "limit-to" | "except";
    importTables?: string[];
    handler?: string;
    ifExists?: boolean;
    cascade?: boolean;
    definition: string;
} | {
    kind: "language";
    action: "create" | "rename" | "drop";
    name: string;
    newName?: string;
    baseLanguage?: "sql" | "plpgsql";
    handler?: string;
    trusted?: boolean;
    replace?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
    definition: string;
} | {
    kind: "comment";
    objectType: string;
    identity: string[];
    argumentTypes?: string[];
    comment: string | null;
} | {
    kind: "security-label";
    objectType: string;
    identity: string[];
    provider: string;
    label: string | null;
} | {
    kind: "table-lock";
    tables: Array<{
        name: string;
        physicalName: string;
    }>;
    mode: "access-share" | "row-share" | "row-exclusive" | "share-update-exclusive" | "share" | "share-row-exclusive" | "exclusive" | "access-exclusive";
    nowait: boolean;
} | {
    kind: "advisory-xact-lock";
    locks: Array<{
        argumentSources: string[];
        outputName: string;
        try: boolean;
    }>;
} | {
    kind: "anonymous-block";
    language: "plpgsql";
    statements: Array<string | {
        sql: string;
        ignoreSqlStates: string[];
    } | {
        notice: string;
    }>;
} | {
    kind: "procedure-call";
    schema?: string;
    name: string;
    physicalName: string;
    arguments: string[];
    argumentReferences?: RoutineArgumentReference[];
} | {
    kind: "role";
    action: "create" | "alter" | "settings" | "rename" | "drop" | "membership" | "drop-owned" | "reassign-owned";
    roleType?: "role" | "user" | "group";
    roles: string[];
    newName?: string;
    newOwner?: string;
    members?: string[];
    memberOf?: string[];
    adminMembers?: string[];
    membershipAction?: "add" | "drop";
    ifExists?: boolean;
    cascade?: boolean;
    options?: Record<string, string | number | boolean | null>;
    database?: string;
    settingsTag?: "ALTER ROLE" | "ALTER DATABASE";
    setting?: {
        action: "set" | "set-current" | "reset" | "reset-all";
        name?: string;
        value?: string;
    };
} | {
    kind: "privilege";
    action: "grant" | "revoke" | "revoke-grant-option" | "grant-role" | "revoke-role" | "revoke-role-admin";
    objectType?: string;
    relations?: Array<{
        schema: string;
        name: string;
        physicalName: string;
    }>;
    types?: Array<{
        schema: string;
        name: string;
        physicalName: string;
    }>;
    schemas?: string[];
    databases?: string[];
    allInSchemas?: string[];
    parameters?: string[];
    routineTargets?: RoutineSignatureSpec[];
    privileges?: string[];
    columnPrivileges?: Array<{
        privilege: string;
        columns: string[];
    }>;
    roles?: string[];
    grantees: string[];
    grantOption?: boolean;
    inheritOption?: boolean;
    setOption?: boolean;
    cascade?: boolean;
} | {
    kind: "default-privileges";
    action: "grant" | "revoke";
    roles: string[];
    schemas: string[];
    objectType: "table" | "sequence" | "function" | "type" | "schema";
    privileges: string[];
    grantees: string[];
    grantOption: boolean;
    cascade: boolean;
} | {
    kind: "routine";
    action: "create" | "rename" | "owner" | "set-schema" | "configure" | "drop";
    objectType: "function" | "procedure" | "routine";
    name: string;
    physicalName: string;
    schema?: string;
    newName?: string;
    newPhysicalName?: string;
    owner?: string;
    newSchema?: string;
    signature?: RoutineSignatureSpec;
    parameters?: RoutineParameterSpec[];
    inputArgumentTypes?: string[];
    inputDefaultCount?: number;
    variadicInputIndex?: number;
    targets?: RoutineSignatureSpec[];
    requiresAtomicExecution?: boolean;
    argumentNames: string[];
    argumentTypes: string[];
    returnType?: string;
    returnsSet?: boolean;
    language?: string;
    body?: string;
    replace?: boolean;
    settings?: Record<string, string>;
    resetSettings?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
    plpgsqlAstJson?: string;
    plpgsqlParseError?: {
        code: string;
        message: string;
    };
    definition: string;
} | {
    kind: "trigger";
    action: "create" | "drop" | "rename";
    name: string;
    physicalName: string;
    triggerName?: string;
    newName?: string;
    tableName: string;
    tablePhysicalName: string;
    tableQualified?: boolean;
    tableSchema?: string;
    tableDisplayName?: string;
    functionName?: string;
    functionPhysicalName?: string;
    timing?: "before" | "after" | "instead";
    events?: Array<"insert" | "update" | "delete" | "truncate">;
    columns?: string[];
    row?: boolean;
    transitionOldTable?: string;
    transitionNewTable?: string;
    arguments?: string[];
    hasWhen?: boolean;
    constraint?: boolean;
    deferrable?: boolean;
    initiallyDeferred?: boolean;
    ifExists?: boolean;
    definition: string;
} | {
    kind: "trigger-state";
    tableName: string;
    tablePhysicalName: string;
    triggerName: string;
    enabled: boolean;
} | {
    kind: "row-security";
    action: "enable" | "disable" | "force" | "no-force" | "create-policy" | "alter-policy" | "drop-policy";
    tableName: string;
    tablePhysicalName: string;
    tableSchema?: string;
    policyName?: string;
    permissive?: boolean;
    command?: "all" | "select" | "insert" | "update" | "delete";
    roles?: string[];
    usingAst?: unknown;
    checkAst?: unknown;
    usingExpression?: string;
    checkExpression?: string;
    ifExists?: boolean;
    definition: string;
} | {
    kind: "discard";
    mode: "all" | "plans" | "sequences" | "temp";
} | {
    kind: "session";
    action: "set" | "set-current" | "set-default" | "reset" | "reset-all" | "show" | "load-library";
    name: string;
    value?: string;
    local: boolean;
} | {
    kind: "cursor";
    action: "declare" | "fetch" | "move" | "close";
    name?: string;
    querySql?: string;
    count?: number;
    direction?: "forward" | "backward" | "absolute" | "relative";
    hold?: boolean;
    unsupported?: string;
} | {
    kind: "prepared";
    action: "prepare" | "execute" | "deallocate";
    name?: string;
    querySql?: string;
    sourceSql?: string;
    parameterTypes?: string[];
    resultTypes?: string[];
    parameterCount?: number;
    arguments?: string[];
} | {
    kind: "index";
    action: "drop" | "rename" | "owner" | "set-options" | "reset-options" | "attach-partition";
    targetType: "index" | "table";
    name: string;
    physicalName: string;
    schema?: string;
    relation?: string;
    qualified?: boolean;
    newName?: string;
    newPhysicalName?: string;
    owner?: string;
    options?: string[];
    ifExists?: boolean;
    concurrently?: boolean;
    cascade?: boolean;
    childName?: string;
    childPhysicalName?: string;
} | {
    kind: "index";
    action: "depends-extension";
    targetType: "index";
    name: string;
    physicalName: string;
    schema?: string;
    relation?: string;
    qualified?: boolean;
    extensionName: string;
    ifExists?: boolean;
} | {
    kind: "index";
    action: "reindex";
    targetType: "index" | "table" | "schema" | "database" | "system";
    name: string;
    physicalName?: string;
    schema?: string;
    relation?: string;
    qualified?: boolean;
    concurrently?: boolean;
    verbose?: boolean;
    tablespace?: string;
} | {
    kind: "sequence";
    action: "create" | "alter" | "rename" | "drop";
    name: string;
    physicalName: string;
    schema?: string;
    qualified?: boolean;
    temporary?: boolean;
    newName?: string;
    newPhysicalName?: string;
    ifExists?: boolean;
    cascade?: boolean;
    dataType?: "smallint" | "integer" | "bigint";
    increment?: number | string;
    minValue?: number | string | null;
    maxValue?: number | string | null;
    startValue?: number | string;
    restartValue?: number | string | null;
    cache?: number | string;
    cycle?: boolean;
} | {
    kind: "sequence-column";
    action: "add" | "alter" | "drop";
    tableName: string;
    tablePhysicalName: string;
    column: string;
    sequencePhysicalName?: string;
    ifExists?: boolean;
    mode?: "always" | "default";
    increment?: number | string;
    minValue?: number | string | null;
    maxValue?: number | string | null;
    startValue?: number | string;
    restartValue?: number | string | null;
    cache?: number | string;
    cycle?: boolean;
} | {
    kind: "schema";
    action: "create" | "rename" | "owner" | "drop";
    name: string;
    newName?: string;
    owner?: string;
    ifExists?: boolean;
    cascade?: boolean;
    hasElements?: boolean;
    elementSchemas?: string[];
} | {
    kind: "schema-create-table";
    schema: string;
    declaredTableSchema?: string;
    owner?: string;
    ifExists?: boolean;
    tableName: string;
    tablePhysicalName: string;
    definition: string;
    columns: Array<{
        name: string;
        pgType: string;
        sqliteType: string;
    }>;
} | {
    kind: "schema-create-tables";
    schema: string;
    owner?: string;
    ifExists?: boolean;
    tables: Array<{
        declaredTableSchema?: string;
        tableName: string;
        tablePhysicalName: string;
        definition: string;
        columns: Array<{
            name: string;
            pgType: string;
            sqliteType: string;
        }>;
    }>;
} | {
    kind: "select-into";
    name: string;
    schema: string;
    tableName: string;
    physicalName: string;
    querySql: string;
    temporary: boolean;
    unlogged: boolean;
} | {
    kind: "create-table-as";
    name: string;
    schema: string;
    tableName: string;
    physicalName: string;
    querySql: string;
    columns: string[];
    withData: boolean;
    ifNotExists: boolean;
    temporary: boolean;
    unlogged: boolean;
    onCommit?: "preserve" | "delete" | "drop";
    unsupportedOptions: boolean;
} | {
    kind: "maintenance";
    action: "analyze" | "vacuum" | "checkpoint" | "cluster";
    tables: Array<{
        name: string;
        physicalName: string;
        columns: string[];
    }>;
    options: Array<{
        name: string;
        value: boolean | number | string | null;
        valueType: "implicit" | "boolean" | "integer" | "string";
        position: number;
    }>;
    indexName?: string;
    indexPhysicalName?: string;
} | {
    kind: "truncate";
    tables: Array<{
        name: string;
        physicalName: string;
    }>;
    restartIdentity: boolean;
    cascade: boolean;
} | {
    kind: "explain";
    querySql: string;
    analyze: boolean;
    format: "text" | "json";
    options: string[];
} | {
    kind: "transaction";
    action: "begin" | "commit" | "rollback" | "savepoint" | "rollback-to" | "release" | "prepare" | "commit-prepared" | "rollback-prepared";
    name?: string;
    mode?: TransactionMode;
    chain?: boolean;
} | {
    kind: "transaction-mode";
    scope: "transaction" | "session";
    mode: TransactionMode;
};
export interface TransactionMode {
    isolation?: "read committed" | "repeatable read" | "serializable";
    readOnly?: boolean;
    deferrable?: boolean;
}
export interface RelationRewrite {
    schema: string;
    relation: string;
    physical: string;
    location: number;
    qualified?: boolean;
    explicitAlias?: boolean;
    alias?: string;
    replacement?: string;
    aliasColumns?: string[];
    sourceEnd?: number;
    inheritanceMode?: "include" | "only";
    sourceStart?: number;
}
export interface JoinAliasColumnReference {
    alias: string;
    columns: string[];
    start: number;
    joinEnd: number;
    end: number;
    leaves: Array<{
        schema: string;
        relation: string;
        alias?: string;
        aliasColumns?: string[];
        location: number;
        sourceEnd?: number;
    }>;
}
export type SqlPlanner = (sql: string) => Promise<QueryExecutionPlan>;
export interface EdgePgPluginPlanContext {
    sql: string;
    plan: QueryExecutionPlan;
}
export interface EdgePgPluginExecutionContext extends EdgePgPluginPlanContext {
    values: EdgePgValue[];
    rowMode?: "array";
    database: D1Database;
    currentRole: string;
    sessionUser: string;
    transactionActive: boolean;
    assertTablePrivileges(references: Array<{
        physicalName: string;
        relation: string;
        privilege: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE";
        columns?: string[];
    }>): Promise<void>;
}
export interface EdgePgPlugin {
    readonly name: string;
    transformPlan?(context: EdgePgPluginPlanContext): QueryExecutionPlan | Promise<QueryExecutionPlan>;
    execute?(context: EdgePgPluginExecutionContext): QueryResult<Record<string, unknown>> | undefined | Promise<QueryResult<Record<string, unknown>> | undefined>;
}
export interface QueryConfig<T extends Record<string, unknown> = Record<string, unknown>> {
    text: string;
    values?: EdgePgValue[];
    name?: string;
    rowMode?: "array";
    types?: {
        getTypeParser(oid: number, format?: string): (value: string) => unknown;
    };
    _result?: T;
}
export interface FieldDef {
    name: string;
    dataTypeID: number;
    tableID: number;
    columnID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: "text";
}
export interface QueryNotice {
    severity: "WARNING" | "NOTICE" | "INFO";
    code: string;
    message: string;
    detail?: string;
    hint?: string;
}
export interface QueryResult<T extends Record<string, unknown> = Record<string, unknown>> {
    command: string;
    rowCount: number | null;
    oid: number;
    rows: T[];
    fields: FieldDef[];
    notices?: QueryNotice[];
}
export type QueryInput<T extends Record<string, unknown>> = string | QueryConfig<T>;
