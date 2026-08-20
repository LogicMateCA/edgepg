export function createD1TableVersionAdapter(database, {
  tableName = "web_accelerator_table_versions",
} = {}) {
  if (!database?.prepare || !database?.batch) {
    throw new TypeError("D1 version adapter requires a D1-compatible database");
  }
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName)) {
    throw new TypeError("invalid D1 version table name");
  }

  return {
    async initialize() {
      return database.prepare(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          table_name TEXT PRIMARY KEY,
          version INTEGER NOT NULL DEFAULT 1
        )
      `).run();
    },

    async snapshot(dependencies) {
      const names = normalize(dependencies);
      if (!names.length) return { complete: false, versions: {} };
      const placeholders = names.map(() => "?").join(", ");
      const result = await database.prepare(`
        SELECT table_name, version
        FROM ${tableName}
        WHERE table_name IN (${placeholders})
      `).bind(...names).all();
      const versions = Object.fromEntries((result.results || []).map((row) => [
        row.table_name,
        Number(row.version),
      ]));
      return {
        complete: names.every((name) => Number.isFinite(versions[name])),
        versions,
      };
    },

    prepareBumps(dependencies) {
      return normalize(dependencies).map((name) => database.prepare(`
        INSERT INTO ${tableName} (table_name, version)
        VALUES (?, 1)
        ON CONFLICT(table_name) DO UPDATE SET version = version + 1
      `).bind(name));
    },
  };
}

function normalize(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim()))].sort();
}
