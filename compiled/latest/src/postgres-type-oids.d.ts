export declare function postgresArrayTypeOid(elementOid: number): number;
export declare function postgresArrayElementTypeOid(arrayOid: number): number;
export declare function postgresTypeOid(source: unknown, options?: {
    internalChar?: boolean;
}): number;
