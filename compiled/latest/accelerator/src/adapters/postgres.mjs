const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_$]*(?:\.[A-Za-z_][A-Za-z0-9_$]*)?$/;

export function createPostgresAdapter({
  query,
  versionTable = "web_accelerator.table_versions",
} = {}) {
  if (typeof query !== "function") {
    throw new TypeError("PostgreSQL adapter requires a query callback");
  }
  if (!IDENTIFIER.test(versionTable)) throw new TypeError("invalid PostgreSQL version table");

  return {
    kind: "postgres",
    capabilities: {
      public: true,
      observe: true,
      strict: true,
      strictRequiresVersionTable: true,
    },
    analyze: conservativePostgresDependencies,
    async snapshot(dependencies) {
      const names = [...new Set(dependencies)].sort();
      if (!names.length) return { complete: false, versions: {} };
      const result = await query(
        `SELECT table_name, version FROM ${versionTable} WHERE table_name = ANY($1::text[])`,
        [names],
      );
      const rows = Array.isArray(result) ? result : result?.rows || [];
      const versions = Object.fromEntries(rows
        .filter((row) => names.includes(row.table_name) && Number.isFinite(Number(row.version)))
        .map((row) => [row.table_name, Number(row.version)]));
      return {
        complete: names.every((name) =>
          Object.prototype.hasOwnProperty.call(versions, name)),
        versions,
      };
    },
  };
}

export function conservativePostgresDependencies(sql) {
  if (typeof sql !== "string" || !/^\s*(?:WITH\b[\s\S]+?\bSELECT\b|SELECT\b)/i.test(sql)) {
    return { complete: false, dependencies: [] };
  }
  if (/\b(?:EXECUTE|CALL|COPY|INSERT|UPDATE|DELETE|MERGE)\b/i.test(sql)) {
    return { complete: false, dependencies: [] };
  }
  const dependencies = [];
  const pattern = /\b(?:FROM|JOIN)\s+((?:"[^"]+"|[A-Za-z_][A-Za-z0-9_$]*)(?:\.(?:"[^"]+"|[A-Za-z_][A-Za-z0-9_$]*))?)/gi;
  for (const match of sql.matchAll(pattern)) {
    dependencies.push(match[1].replaceAll('"', ""));
  }
  const risky = /\b(?:WITH|pg_catalog|information_schema)\b/i.test(sql)
    || /\b(?:FROM|JOIN)\s*\(/i.test(sql);
  return {
    complete: dependencies.length > 0 && !risky,
    dependencies: [...new Set(dependencies)].sort(),
  };
}
