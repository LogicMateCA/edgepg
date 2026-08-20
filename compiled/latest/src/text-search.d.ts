import type { CatalogName, OwnerReference, RoutineReference } from "./operator-types";
import { type SemanticExecutionResult } from "./semantic-error";
import type { EdgePgValue, SourceRewrite } from "./types";
export type TextSearchInput = {
    kind: "literal";
    value: string | null;
    source: string;
} | {
    kind: "parameter";
    number: number;
    source: string;
} | {
    kind: "expression";
    source: string;
};
export type TextSearchExpression = {
    kind: "function";
    function: "to_tsvector" | "to_tsquery" | "plainto_tsquery" | "phraseto_tsquery" | "websearch_to_tsquery" | "ts_debug";
    arguments: TextSearchInput[];
    rangeFunction: boolean;
} | {
    kind: "match";
    left: TextSearchExpression | TextSearchInput;
    right: TextSearchExpression | TextSearchInput;
};
export interface TextSearchExpressionReference {
    start: number;
    end: number;
    expression: TextSearchExpression;
    resultTypeOid: 16 | 3614 | 3615 | 2249;
}
export interface TextSearchOption {
    name: string;
    value: string;
    position: number;
}
export interface TextSearchParserCallbacks {
    start: RoutineReference;
    gettoken: RoutineReference;
    end: RoutineReference;
    lextypes: RoutineReference;
    headline?: RoutineReference;
}
export interface TextSearchAuthorizationPlan {
    requiresSuperuser: boolean;
    requiresOwnership: boolean;
    requiredSchemaPrivilege?: "create";
    requiresNewOwnerMembership: boolean;
    requiresNewOwnerSchemaCreate: boolean;
}
export declare const TEXT_SEARCH_SQLSTATE_PRIORITY: Readonly<{
    readonly missingSchema: "3F000";
    readonly permissionDenied: "42501";
    readonly duplicateObject: "23505";
    readonly undefinedObject: "42704";
    readonly undefinedCallback: "42883";
    readonly invalidOptionOrToken: "22023";
    readonly dependentObjects: "2BP01";
}>;
export declare const TEXT_SEARCH_VALIDATION_PRIORITY: readonly ["missingSchema", "permissionDenied", "duplicateObject", "undefinedObject", "undefinedCallback", "invalidOptionOrToken", "dependentObjects"];
export type TextSearchCommand = {
    kind: "text-search-configuration";
    action: "create";
    identity: CatalogName;
    source: {
        kind: "parser" | "copy";
        identity: CatalogName;
    };
    definition: string;
} | {
    kind: "text-search-configuration";
    action: "mapping-add" | "mapping-alter" | "mapping-replace-dictionary" | "mapping-drop";
    identity: CatalogName;
    tokenTypes: string[];
    dictionaries: CatalogName[];
    override: boolean;
    replace: boolean;
    ifExists: boolean;
    definition: string;
} | TextSearchLifecycleCommand<"text-search-configuration", true> | TextSearchDropCommand<"text-search-configuration"> | {
    kind: "text-search-dictionary";
    action: "create";
    identity: CatalogName;
    template: CatalogName;
    options: TextSearchOption[];
    definition: string;
} | {
    kind: "text-search-dictionary";
    action: "alter-options";
    identity: CatalogName;
    options: TextSearchOption[];
    definition: string;
} | TextSearchLifecycleCommand<"text-search-dictionary", true> | TextSearchDropCommand<"text-search-dictionary"> | {
    kind: "text-search-parser";
    action: "create";
    identity: CatalogName;
    callbacks: TextSearchParserCallbacks;
    requiresSuperuser: true;
    definition: string;
} | TextSearchLifecycleCommand<"text-search-parser", false> | TextSearchDropCommand<"text-search-parser"> | {
    kind: "text-search-template";
    action: "create";
    identity: CatalogName;
    init?: RoutineReference;
    lexize: RoutineReference;
    requiresSuperuser: true;
    definition: string;
} | TextSearchLifecycleCommand<"text-search-template", false> | TextSearchDropCommand<"text-search-template">;
type TextSearchLifecycleCommand<K extends TextSearchCommandKind, HasOwner extends boolean> = {
    kind: K;
    action: "rename" | "set-schema" | (HasOwner extends true ? "owner" : never);
    identity: CatalogName;
    newName?: string;
    newSchema?: string;
    owner?: HasOwner extends true ? OwnerReference : never;
    requiresSuperuser: HasOwner extends true ? false : true;
    definition: string;
};
type TextSearchDropCommand<K extends TextSearchCommandKind> = {
    kind: K;
    action: "drop";
    targets: CatalogName[];
    ifExists: boolean;
    cascade: boolean;
    requiresSuperuser: K extends "text-search-parser" | "text-search-template" ? true : false;
    definition: string;
};
type TextSearchCommandKind = "text-search-configuration" | "text-search-dictionary" | "text-search-parser" | "text-search-template";
export declare class TextSearchPlanningError extends Error {
    readonly code: string;
    readonly status = 400;
    constructor(code: string, message: string);
}
export declare function textSearchCommands(ast: unknown, sql: string): TextSearchCommand[];
export declare function textSearchAuthorization(command: TextSearchCommand): TextSearchAuthorizationPlan;
export declare function textSearchExpressionReferences(ast: unknown, sql: string): TextSearchExpressionReference[];
export declare function textSearchExpressionRewrites(db: D1Database, references: TextSearchExpressionReference[], values: EdgePgValue[], settings: Readonly<Record<string, string>>, currentRole: string): Promise<SourceRewrite[]>;
export declare function executeTextSearchCommand(db: D1Database, command: TextSearchCommand, currentRole?: string, sessionUser?: string): Promise<SemanticExecutionResult>;
export declare function ensureTextSearchCatalogSchema(db: D1Database): Promise<void>;
export declare function textSearchCatalogViewSql(): {
    pgTsParser: string;
    pgTsTemplate: string;
    pgTsDict: string;
    pgTsConfig: string;
    pgTsConfigMap: string;
};
export {};
