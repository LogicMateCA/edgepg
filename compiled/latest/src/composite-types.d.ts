export type CompositeField = {
    name: string;
    type: string;
};
export declare class CompositeInputError extends Error {
    readonly detail?: string | undefined;
    constructor(message: string, detail?: string | undefined);
}
export declare function canonicalCompositeInput(input: string, fields: CompositeField[]): string;
export declare function parseCompositeInput(input: string, fieldCount: number): Array<string | null>;
export declare function canonicalCompositeFieldValue(value: string, type: string): string;
export declare function compositeFieldOutput(value: string): string;
