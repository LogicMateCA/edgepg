import { RangeInputError, type CanonicalRange } from "./range-types";
export declare class MultirangeInputError extends Error {
    readonly detail?: string | undefined;
    readonly code = "22P02";
    constructor(message: string, detail?: string | undefined);
}
export declare function canonicalMultirangeInput(input: string, subtype: string): string;
export declare function canonicalMultirangeRanges(input: string, subtype: string): CanonicalRange[];
export declare function canonicalBuiltinMultirangeRanges(input: string, subtype: string, rangeType: string): CanonicalRange[];
export declare function validateBuiltinMultirangeInput(input: unknown, type: string, dateStyle?: string): void;
export declare function multirangeSemanticError(error: unknown): RangeInputError | null;
