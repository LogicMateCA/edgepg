import { type CompositeField } from "./composite-types";
export declare function compositeRangeSubtype(name: string, fields: CompositeField[]): string;
export declare function compositeRangeSubtypeName(subtype: string): string | undefined;
export declare function compositeRangeSubtypeFields(subtype: string): CompositeField[] | undefined;
export declare class RangeInputError extends Error {
    readonly code: "22P02" | "22000" | "22003" | "22007" | "22008" | "22009" | "22023" | "42601";
    readonly detail?: string | undefined;
    readonly hint?: string | undefined;
    constructor(code: "22P02" | "22000" | "22003" | "22007" | "22008" | "22009" | "22023" | "42601", message: string, detail?: string | undefined, hint?: string | undefined);
}
export declare function rangeInputFromConstructor(lower: unknown, upper: unknown, bounds: unknown, subtype: string): string;
export type CanonicalRange = {
    empty: boolean;
    lower: string | null;
    upper: string | null;
    lowerInclusive: boolean;
    upperInclusive: boolean;
};
export declare function canonicalRangeInput(input: string, subtype: string): string;
export declare function canonicalRangeParts(input: string, subtype: string): CanonicalRange;
export declare function validateBuiltinRangeInput(input: unknown, type: string, dateStyle?: string): void;
export declare function canonicalBuiltinRangeParts(input: string, type: string, dateStyle?: string): CanonicalRange;
export declare function formatCanonicalRange(range: CanonicalRange): string;
export declare function compareRangeBounds(left: string, right: string, subtype: string): number;
export declare function canonicalRangeScalarInput(value: unknown, subtype: string, dateStyle?: string): string;
export declare function roundCanonicalTimestampPrecision(value: string, precision?: number): string;
export declare function postgresDatePartValue(canonical: string, unitSource: string): string | null;
export declare function postgresTimestampPartValue(canonical: string, unitSource: string, offsetSeconds?: number): string | null;
export declare function postgresTimestampToChar(canonical: string, format: string, offsetSeconds?: number): string;
export declare function postgresIntervalToChar(monthsSource: string, daysSource: string, microsSource: string, format: string): string;
export declare function shiftedTimestampDisplay(canonical: string, offsetSeconds: number): string;
export declare function supportedRangeSubtype(subtype: string): boolean;
export declare function postgresMskAbbreviationOffsetMinutes(year: bigint, month: number, day: number, hour: number): 240 | undefined;
