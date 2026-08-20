export declare function encodeRangeStorage(input: string, subtype: string, builtinType?: string): string;
export declare function encodeMultirangeStorage(input: string, subtype: string, builtinRangeType?: string): string;
export declare function decodeRangeStorage(value: unknown, options?: {
    timestamptz?: boolean;
    dateStyle?: string;
    timeZone?: string;
}): unknown;
