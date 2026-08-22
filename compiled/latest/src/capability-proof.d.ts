import type { CapabilityProofNode, CapabilityProofStatus, QueryCapabilityProof, StatementExecutionPlan } from "./types";
export interface RelationalSelectProofEvidence {
    statements: readonly StatementExecutionPlan[];
    builtinCastRewrites: ReadonlyArray<{
        start: number;
        end: number;
    }>;
    customTypeCastCount: number;
    nativeRelationalSubqueries: boolean;
    nativeNonrecursiveSelectCte: boolean;
}
export declare function buildRelationalSelectCapabilityProofs(evidence: RelationalSelectProofEvidence): QueryCapabilityProof[];
export declare function capabilityProofAdmitsStatement(proofs: readonly QueryCapabilityProof[] | undefined, statementIndex: number, statement: StatementExecutionPlan): boolean;
export declare function allOf(kind: string, children: readonly CapabilityProofNode[]): CapabilityProofNode;
export declare function proofStatus(node: CapabilityProofNode): CapabilityProofStatus;
