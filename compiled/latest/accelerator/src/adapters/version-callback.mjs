export function createVersionCallbackAdapter({ load } = {}) {
  if (typeof load !== "function") {
    throw new TypeError("version callback adapter requires load(dependencies, request)");
  }

  return {
    async snapshot(dependencies, request) {
      const names = normalize(dependencies);
      if (!names.length) return { complete: false, versions: {} };
      const loaded = await load(names, request);
      const versions = loaded instanceof Map
        ? Object.fromEntries(loaded)
        : { ...(loaded || {}) };
      return {
        complete: names.every((name) =>
          Object.prototype.hasOwnProperty.call(versions, name)
          && validVersion(versions[name])),
        versions: Object.fromEntries(Object.entries(versions)
          .filter(([name, value]) => names.includes(name) && validVersion(value))),
      };
    },
  };
}

function normalize(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim()))].sort();
}

function validVersion(value) {
  return (typeof value === "number" && Number.isFinite(value))
    || (typeof value === "string" && value.length > 0);
}
