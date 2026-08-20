const REQUIRED_FIELDS = [
  "database",
  "tenant",
  "role",
  "user",
  "searchPath",
  "rlsContext",
  "permissionContext",
];

export function createIdentityResolver(fields = {}) {
  return async function resolveIdentity(request) {
    const identity = {};
    for (const field of REQUIRED_FIELDS) {
      const source = fields[field];
      const value = typeof source === "function" ? await source(request) : source;
      if (!known(value)) return null;
      identity[field] = value;
    }
    return identity;
  };
}

export function isCompleteIdentity(identity) {
  return identity !== null
    && typeof identity === "object"
    && REQUIRED_FIELDS.every((field) => known(identity[field]));
}

function known(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0 && value.every(known);
  if (typeof value === "object") {
    const values = Object.values(value);
    return values.length > 0 && values.every(known);
  }
  return false;
}
