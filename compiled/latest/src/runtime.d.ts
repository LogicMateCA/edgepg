import { EdgePgRuntime as CoreEdgePgRuntime, prepareRuleExecution, singleRowVersionTriggerMutation, singleRowVersionTriggerMutationShape, versionTriggerMutationRequiresPrimaryOnlyTable, versionTriggerPrimaryKeyOnlyTable, versionTriggerSingleColumnPrimaryKey } from "./runtime-core";
import type { EdgePgConfig } from "./types";
export declare class EdgePgRuntime extends CoreEdgePgRuntime {
    constructor(config?: EdgePgConfig);
}
export { prepareRuleExecution, singleRowVersionTriggerMutation, singleRowVersionTriggerMutationShape, versionTriggerMutationRequiresPrimaryOnlyTable, versionTriggerPrimaryKeyOnlyTable, versionTriggerSingleColumnPrimaryKey, };
