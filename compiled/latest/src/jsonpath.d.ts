export declare class JsonPathInputError extends Error {
    readonly code: "0A000" | "22P02" | "42601" | "42804";
    readonly detail?: string | undefined;
    constructor(code: "0A000" | "22P02" | "42601" | "42804", message: string, detail?: string | undefined);
}
export declare function canonicalJsonPathInput(value: unknown): string | null;
