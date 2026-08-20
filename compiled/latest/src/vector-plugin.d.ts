import type { EdgePgPlugin } from "./types";
import { vectorEngine } from "./vector-wasm";
export type EdgePgVectorMetric = "euclidean" | "cosine" | "dot-product";
export interface EdgePgVectorPluginEvent {
    kind: "vector-query" | "vector-sync";
    table: string;
    column: string;
    metric?: EdgePgVectorMetric;
    mode?: "exact-scan" | "vectorize-candidates";
    rows?: number;
    candidates?: number;
    pending?: number;
}
export interface EdgePgVectorPluginConfig {
    euclidean?: VectorizeIndex;
    cosine?: VectorizeIndex;
    dotProduct?: VectorizeIndex;
    exactScanThreshold?: number;
    candidateMultiplier?: number;
    diagnostics?: (event: EdgePgVectorPluginEvent) => void;
}
export declare function vectorPlugin(config?: EdgePgVectorPluginConfig): EdgePgPlugin;
export { vectorEngine };
