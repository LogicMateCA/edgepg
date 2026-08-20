export declare function hexBytea(bytes: Uint8Array): string;
export declare function encodeBytea(bytes: Uint8Array, format: string): string;
export declare function decodeBytea(source: string, format: string): Uint8Array;
export declare function crc32(bytes: Uint8Array, castagnoli?: boolean): number;
export declare function sha224(bytes: Uint8Array): string;
