const encoder = new TextEncoder();

export async function responseCacheKey({
  request,
  mode,
  buildId,
  identity,
  varyHeaders = [],
  versions = {},
}) {
  const url = new URL(request.url);
  // URLSearchParams preserves duplicate parameter order. That order can be
  // application-significant, so it must remain part of the cache identity.
  const params = [...url.searchParams.entries()];
  const descriptor = {
    namespace: "web-accelerator:v1",
    method: request.method.toUpperCase(),
    origin: url.origin,
    path: url.pathname,
    query: params,
    mode,
    buildId,
    identity: identity || "public",
    vary: Object.fromEntries(varyHeaders.map((name) => [
      name.toLowerCase(),
      request.headers.get(name) || "",
    ])),
    versions: Object.fromEntries(Object.entries(versions)
      .sort(([left], [right]) => left.localeCompare(right))),
  };
  return `wa:v1:${await sha256(stableStringify(descriptor))}`;
}

export function stableStringify(value) {
  return JSON.stringify(normalize(value));
}

async function sha256(value) {
  const cryptoApi = globalThis.crypto?.subtle
    ? globalThis.crypto
    : (await import("node:crypto")).webcrypto;
  const bytes = await cryptoApi.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalize(value) {
  if (typeof value === "bigint") return { $bigint: String(value) };
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, normalize(item)]));
  }
  return value;
}
