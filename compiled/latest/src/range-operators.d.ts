import { type CanonicalRange } from "./range-types";
export type RangeSet = {
    kind: "range" | "multirange";
    ranges: CanonicalRange[];
};
export declare function rangeSetFromText(kind: RangeSet["kind"], input: string, subtype: string): RangeSet;
export declare function rangeSetCompare(left: RangeSet, right: RangeSet, subtype: string): number;
export declare function rangeSetContains(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetContainsElement(left: RangeSet, element: string, subtype: string): boolean;
export declare function rangeSetOverlaps(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetBefore(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetAfter(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetOverleft(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetOverright(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetAdjacent(left: RangeSet, right: RangeSet, subtype: string): boolean;
export declare function rangeSetUnion(left: RangeSet, right: RangeSet, subtype: string): RangeSet;
export declare function rangeSetIntersect(left: RangeSet, right: RangeSet, subtype: string): RangeSet;
export declare function rangeSetMinus(left: RangeSet, right: RangeSet, subtype: string): RangeSet;
export declare function formatRangeSet(value: RangeSet): string;
