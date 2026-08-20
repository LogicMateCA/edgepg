import type { RoutineParameterMode, RoutineParameterSpec } from "./types";
export interface ResolvedRoutineParameter extends RoutineParameterSpec {
    mode: RoutineParameterMode;
    typeOid: number;
}
export interface RoutineCandidateScore {
    cost: number;
    exactMatches: number;
}
export declare function routineArrayElementOid(oid: number): number | undefined;
export declare function routineRangeSubtypeOid(oid: number): number | undefined;
export declare function routineMultirangeSubtypeOid(oid: number): number | undefined;
export declare function routineArrayOidForElement(oid: number): number | undefined;
export declare function routineRangeOidForSubtype(oid: number): number | undefined;
export declare function routineMultirangeOidForSubtype(oid: number): number | undefined;
export declare function routineTypeNameForOid(oid: number): string | undefined;
export declare function canonicalRoutineTypeName(value: string): {
    name: string;
    array: boolean;
};
export declare function resolveRoutineTypeOid(db: D1Database, value: string): Promise<number>;
export declare function resolveRoutineParameters(db: D1Database, parameters: RoutineParameterSpec[]): Promise<ResolvedRoutineParameter[]>;
export declare function routineInputParameter(parameter: Pick<ResolvedRoutineParameter, "mode">): boolean;
export declare function routineOutputParameter(parameter: Pick<ResolvedRoutineParameter, "mode">): boolean;
export declare function routineCandidateScore(expectedOids: number[], actualOids: number[]): RoutineCandidateScore | null;
export declare function compareRoutineScores(left: RoutineCandidateScore, right: RoutineCandidateScore): number;
export declare function inferRoutineExpressionOid(source: string): number;
