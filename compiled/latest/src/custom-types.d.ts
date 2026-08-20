import type { CustomTypeAccessReference, CustomTypeAggregateReference, CustomTypeCastReference, CustomTypeColumnReference, CustomTypeComparisonReference, CustomTypeConstructorReference, CustomTypeFieldReference, CustomTypeOperatorReference, CustomTypeSortReference, CustomTypeValueExpression, CustomTypeWriteReference, EdgePgValue, MoneyNumericCastReference, PointSubscriptReference, PostgresCatalogTableReference, SemanticCommand, SourceRewrite, TemporalFormatReference, TemporalPartReference, TimetzZoneReference, TypeRewrite } from "./types";
import { type CompositeField } from "./composite-types";
import { EdgePgSemanticError, type SemanticExecutionResult } from "./semantic-error";
export { EdgePgSemanticError } from "./semantic-error";
export type { SemanticExecutionResult } from "./semantic-error";
export type CustomTypeCommand = Extract<SemanticCommand, {
    kind: "custom-type";
}>;
export declare function forgetArrayColumnSchemaMissing(db: D1Database): void;
export interface ResolvedCustomTypeColumn extends CustomTypeColumnReference {
    kind: "enum" | "domain" | "composite" | "range" | "multirange";
    values: string[];
    fields?: CompositeField[];
    baseType?: string;
    checkExpressions: string[];
    domainConstraints?: DomainConstraint[];
    notNull: boolean;
    defaultExpression?: string;
}
interface DomainConstraint {
    name: string;
    expression: string;
    validated: boolean;
}
interface CustomTypeCatalogSnapshot {
    domainMap?: Map<string, DomainRow>;
    typeMap?: Map<string, CustomTypeCatalogRow>;
}
type CustomTypeCatalogRow = Record<string, unknown> & {
    name: string;
    kind: string;
    values_json: string;
};
type CustomTypeExpressionRow = {
    kind: string;
    values_json: string;
};
export declare function executeCustomTypeCommand(db: D1Database, command: CustomTypeCommand, actor?: string): Promise<SemanticExecutionResult>;
export declare function executeDropDomainCommands(db: D1Database, commands: CustomTypeCommand[]): Promise<SemanticExecutionResult>;
export declare function executeDropTypeCommands(db: D1Database, commands: CustomTypeCommand[], actor?: string): Promise<SemanticExecutionResult>;
export declare function resolveCustomTypeColumns(db: D1Database, references: CustomTypeColumnReference[]): Promise<ResolvedCustomTypeColumn[]>;
export declare function customTypeRewrites(columns: ResolvedCustomTypeColumn[]): TypeRewrite[];
export declare function customTypeCastRewrites(db: D1Database, references: CustomTypeCastReference[], values: EdgePgValue[], sql?: string, catalog?: CustomTypeCatalogSnapshot, dateStyle?: string, currentTimeZone?: string, currentTimestamp?: string): Promise<SourceRewrite[]>;
export declare function canonicalInternalUnsignedInput(input: EdgePgValue, type: "xid" | "xid8" | "cid", maximum: bigint): string | null;
export declare function builtinTypeAlias(source: string): string;
export declare function customTypeWriteRewrites(db: D1Database, references: CustomTypeWriteReference[], values: EdgePgValue[], sql: string, dateStyle?: string, currentTimeZone?: string, currentTimestamp?: string): Promise<SourceRewrite[]>;
export declare function builtinTypeWriteRewrites(db: D1Database, references: CustomTypeWriteReference[], values: EdgePgValue[], sql: string, relationCache?: Map<string, {
    columns: string[];
    pgTypes: string[];
}>, dateStyle?: string, currentTimeZone?: string, currentTimestamp?: string): Promise<SourceRewrite[]>;
export declare function builtinTypeConstraintStatements(db: D1Database, table: PostgresCatalogTableReference): D1PreparedStatement[];
type BitTypeModifier = {
    varying: boolean;
    length?: number;
};
export declare function canonicalBitInput(value: unknown, modifier: BitTypeModifier, assignment: boolean): string;
export declare function canonicalTxidSnapshotInput(value: unknown): string | null;
export declare function customTypeConstructorRewrites(db: D1Database, references: CustomTypeConstructorReference[], values: EdgePgValue[]): Promise<SourceRewrite[]>;
export declare function customTypeAccessRewrites(db: D1Database, references: CustomTypeAccessReference[], values: EdgePgValue[]): Promise<SourceRewrite[]>;
export declare function builtinAccessResultTypeOids(db: D1Database, references: readonly CustomTypeAccessReference[], rewrites: readonly SourceRewrite[]): Promise<Map<string, number>>;
export declare function customTypeFieldRewrites(db: D1Database, references: CustomTypeFieldReference[]): Promise<{
    rewrites: SourceRewrite[];
    booleanResultNames: Set<string>;
    resultTypes: Map<string, string>;
}>;
export declare function customTypeOperatorRewrites(db: D1Database, references: CustomTypeOperatorReference[], values: EdgePgValue[], currentTimeZone?: string, currentTimestamp?: string): Promise<SourceRewrite[]>;
export declare function circleStorageCenterSql(source: string): string;
export declare function circleStorageOverlapSql(leftSource: string, rightSource: string): string;
export declare function pointSubscriptRewrites(db: D1Database, references: PointSubscriptReference[]): Promise<SourceRewrite[]>;
export declare function builtinBitOperatorRewritesRequired(db: D1Database, references: readonly CustomTypeOperatorReference[]): Promise<boolean>;
export declare function timestampDifferenceIntervalLiteral(left: string, right: string): string;
export declare function timetzZoneRewrites(db: D1Database, references: TimetzZoneReference[], currentTimeZone: string): Promise<SourceRewrite[]>;
export declare function temporalPartRewrites(db: D1Database, references: TemporalPartReference[], currentTimeZone: string): Promise<SourceRewrite[]>;
export declare function temporalFormatRewrites(db: D1Database, references: TemporalFormatReference[], currentTimeZone: string): Promise<SourceRewrite[]>;
export declare function postgresIntervalPartValue(source: string, unitSource: string): string;
export declare function evaluateDynamicTemporalFormat(marker: {
    operation?: unknown;
    value?: unknown;
    origin?: unknown;
    unit?: unknown;
    stride?: unknown;
    type?: unknown;
    offset?: unknown;
    zone?: unknown;
    args?: unknown;
    interval?: unknown;
    subtract?: unknown;
    days?: unknown;
}): string | boolean | null;
export declare function literalTimeZoneOffset(canonical: string, zone: string): number;
export declare function moneyNumericCastRewrites(db: D1Database, references: MoneyNumericCastReference[], values: EdgePgValue[]): Promise<SourceRewrite[]>;
export type ResolvedCustomTypeRowAlgebra = {
    name: string;
    operator: "+" | "-" | "*";
    kind: "range" | "multirange";
    subtype: string;
};
export declare function customTypeRowAlgebraRewrites(db: D1Database, references: CustomTypeOperatorReference[], values: EdgePgValue[]): Promise<{
    rewrites: SourceRewrite[];
    results: ResolvedCustomTypeRowAlgebra[];
}>;
export declare function decodeCustomTypeRowAlgebra<T extends Record<string, unknown>>(row: T, results: readonly ResolvedCustomTypeRowAlgebra[]): T;
export type ResolvedCustomTypeAggregate = CustomTypeAggregateReference & {
    inputKind: "range" | "multirange";
    resultKind: "range" | "multirange";
    subtype: string;
};
export type ResolvedNumericAggregate = Pick<CustomTypeAggregateReference, "function" | "name"> & {
    scale: number;
};
export declare function customTypeAggregateRewrites(db: D1Database, references: CustomTypeAggregateReference[], values?: EdgePgValue[]): Promise<{
    rewrites: SourceRewrite[];
    results: ResolvedCustomTypeAggregate[];
    numericResults: ResolvedNumericAggregate[];
}>;
export declare function decodeCustomTypeAggregateRow<T extends Record<string, unknown>>(row: T, aggregates: readonly ResolvedCustomTypeAggregate[]): T;
export declare function rangeIntersectionStorageSql(left: string, right: string, subtype: string): string;
export declare function rangeMergeMultirangeStorageSql(source: string, subtype: string): string;
export declare function multirangeIntersectionStorageSql(left: string, right: string, subtype: string): string;
export declare function rangeStorageOperatorSql(left: string, right: string, operator: CustomTypeOperatorReference["operator"], subtype: string): string;
export declare function evaluateCustomTypeValueExpression(db: D1Database, expression: CustomTypeValueExpression, values: EdgePgValue[], evaluateDynamic: (expression: Extract<CustomTypeValueExpression, {
    kind: "expression";
}>) => EdgePgValue | Promise<EdgePgValue>): Promise<EdgePgValue>;
export declare function cachedCustomTypeExpressionRow(db: D1Database, name: string): Promise<CustomTypeExpressionRow | null>;
export declare function customTypeSortRewrites(db: D1Database, references: CustomTypeSortReference[]): Promise<SourceRewrite[]>;
export declare function customTypeOrderingRequiresWorkspace(db: D1Database, sorts: CustomTypeSortReference[], comparisons: CustomTypeComparisonReference[]): Promise<boolean>;
export declare function postgresMinMaxSql(kind: "least" | "greatest", values: readonly string[], pgType: string): string;
export declare function postgresCatalogColumnTypes(db: D1Database, table: string): Promise<Map<string, string>>;
export declare function postgresCatalogColumnType(db: D1Database, table: string, column: string): Promise<string | null>;
export declare function rememberPostgresCatalogColumnTypes(db: D1Database, table: string, columns: readonly string[], pgTypes: readonly string[]): void;
export declare function customTypeComparisonRewrites(db: D1Database, references: CustomTypeComparisonReference[], values: EdgePgValue[], dateStyle?: string): Promise<SourceRewrite[]>;
export declare function createCustomTypedTable(db: D1Database, sql: string, columns: ResolvedCustomTypeColumn[], additionalStatements?: D1PreparedStatement[]): Promise<SemanticExecutionResult>;
export declare function applyCustomTypedColumns(db: D1Database, sql: string, columns: ResolvedCustomTypeColumn[], additionalStatements?: D1PreparedStatement[], command?: string): Promise<SemanticExecutionResult>;
export declare function customTypeColumnStatements(db: D1Database, columns: ResolvedCustomTypeColumn[], options?: {
    includeUsageRows?: boolean;
}): D1PreparedStatement[];
export declare function resolveStructuredCustomTypeResultNames(db: D1Database, tableNames: string[], references: Array<{
    name: string;
    typePhysicalName: string;
}>): Promise<Set<string> & {
    timestamptzNames: Set<string>;
}>;
export declare function decodeStructuredCustomTypeRow<T extends Record<string, unknown>>(row: T, names: ReadonlySet<string> & {
    timestamptzNames?: ReadonlySet<string>;
}, dateStyle?: string, timeZone?: string): T;
export declare function customTypeConstraintError(error: unknown): EdgePgSemanticError | null;
interface StoredDomain {
    base_type: string;
    definition: string;
    constraints_json: string;
    not_null: number;
    default_expression: string | null;
    owner_name: string;
}
interface DomainRow extends StoredDomain {
    [key: string]: unknown;
    name: string;
}
interface DomainUsage {
    table_name: string;
    column_name: string;
    type_name: string;
}
export declare function affectedDomainUsage(db: D1Database, name: string): Promise<DomainUsage[]>;
export declare function forgetCustomTypeWriteMetadata(db: D1Database, ...tables: string[]): void;
export declare function forgetCachedCustomTypeMap(db: D1Database): void;
export declare function ensureEnumSchema(db: D1Database): Promise<void>;
export declare function ensureDomainSchema(db: D1Database): Promise<void>;
export declare function ensureCustomTypeCatalogSchema(db: D1Database): Promise<void>;
