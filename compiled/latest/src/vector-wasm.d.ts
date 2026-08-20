export declare const vectorEngine: {
    readonly parse: (value: string) => string;
    readonly values: (value: string) => number[];
    readonly cloudflareValues: (value: string) => number[];
    readonly dimensions: (value: string) => number;
    readonly norm: (value: string) => number;
    readonly l2: (left: string, right: string) => number;
    readonly l1: (left: string, right: string) => number;
    readonly negativeInnerProduct: (left: string, right: string) => number;
    readonly cosine: (left: string, right: string) => number;
    readonly add: (left: string, right: string) => string;
    readonly subtract: (left: string, right: string) => string;
    readonly multiply: (left: string, right: string) => string;
    readonly concat: (left: string, right: string) => string;
};
