export declare function errorMessage(error: unknown): string;
export declare function errorDiagnostic(error: unknown): {
    [k: string]: {} | null;
};
export declare function postgresErrorCode(error: unknown, fallback?: string | undefined): string;
