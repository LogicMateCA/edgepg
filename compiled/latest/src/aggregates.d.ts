import { type SemanticExecutionResult } from "./semantic-error";
import type { RoutineArgumentReference, RoutineCallReference, SourceRewrite } from "./types";
export type AggregateCommand = {
    action: "create";
    schema: string;
    name: string;
    physicalName: string;
    inputType: string;
    transitionFunction: string;
    stateType: string;
    initcond: string | null;
    definition: string;
} | {
    action: "rename";
    schema: string;
    name: string;
    physicalName: string;
    inputType: string;
    newName: string;
    newPhysicalName: string;
} | {
    action: "drop";
    targets: Array<{
        schema: string;
        name: string;
        physicalName: string;
        inputType: string;
        explicitlyQualified: boolean;
    }>;
    ifExists: boolean;
    cascade: boolean;
};
export declare function parseAggregateCommand(sql: string): Promise<AggregateCommand | undefined>;
export declare function executeAggregateCommand(db: D1Database, command: AggregateCommand, currentRole?: string): Promise<SemanticExecutionResult>;
export declare function ensureAggregateCatalogSchema(db: D1Database): Promise<void>;
export declare function aggregateCallRewrite(db: D1Database, call: RoutineCallReference, references: RoutineArgumentReference[], currentRole: string, tablePhysicalName?: string): Promise<SourceRewrite | undefined>;
