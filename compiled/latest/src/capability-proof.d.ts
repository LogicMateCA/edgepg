import type { CapabilityProofNode, CapabilityProofStatus, QueryCapabilityProof, CapabilityAdmissionShadow, StatementExecutionPlan } from "./types";
export interface RelationalSelectProofEvidence {
    statements: readonly StatementExecutionPlan[];
    builtinCastRewrites: ReadonlyArray<{
        start: number;
        end: number;
    }>;
    customTypeCastCount: number;
    nativeRelationalSubqueries: boolean;
    nativeNonrecursiveSelectCte: boolean;
    boundedScalarCountProjection: boolean;
}
export declare function buildRelationalSelectCapabilityProofs(evidence: RelationalSelectProofEvidence): QueryCapabilityProof[];
export declare function capabilityProofAdmitsStatement(proofs: readonly QueryCapabilityProof[] | undefined, statementIndex: number, statement: StatementExecutionPlan): boolean;
export declare function capabilityShadowOwnsAdmission(shadows: readonly CapabilityAdmissionShadow[] | undefined, statementIndex: number, scope: CapabilityAdmissionShadow["scope"]): boolean;
export declare function allOf(kind: string, children: readonly CapabilityProofNode[]): CapabilityProofNode;
export declare function proofStatus(node: CapabilityProofNode): CapabilityProofStatus;
