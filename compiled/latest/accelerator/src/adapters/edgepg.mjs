export function createEdgePgAdapter({ plan, getVersions } = {}) {
  if (typeof plan !== "function" || typeof getVersions !== "function") {
    throw new TypeError("EdgePG adapter requires public plan and getVersions callbacks");
  }
  return {
    kind: "edgepg",
    capabilities: {
      public: true,
      observe: true,
      strict: true,
      bookmark: true,
    },
    async analyze(sql) {
      const executionPlan = await plan(sql);
      const dependencies = [...new Set((executionPlan?.relationRewrites || [])
        .map((relation) => relation.physical)
        .filter((value) => typeof value === "string" && value))].sort();
      const unsafe = !executionPlan?.executable
        || executionPlan.statements?.length !== 1
        || executionPlan.statements[0]?.statement !== "SelectStmt"
        || executionPlan.semanticCommands?.length
        || executionPlan.routineCalls?.length
        || executionPlan.sequenceFunctions?.length
        || executionPlan.rowSecurityTables?.length;
      return { complete: dependencies.length > 0 && !unsafe, dependencies };
    },
    async snapshot(dependencies, request) {
      const result = await getVersions([...dependencies], request);
      const versions = result instanceof Map
        ? Object.fromEntries(result)
        : { ...(result?.versions || result || {}) };
      return {
        complete: dependencies.every((dependency) =>
          Object.prototype.hasOwnProperty.call(versions, dependency)),
        versions,
      };
    },
  };
}
