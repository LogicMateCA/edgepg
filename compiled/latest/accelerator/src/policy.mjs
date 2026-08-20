const CACHEABLE_TYPES = [
  "application/json",
  "application/ld+json",
  "text/html",
  "text/plain",
  "text/x-component",
];

export function evaluateRequest(request, { mode, identity, varyHeaders = [] }) {
  if (mode === "fresh") return { cacheable: false, reason: "mode_fresh" };
  if (mode === "observe") return { cacheable: false, reason: "mode_observe" };
  if (!["GET", "HEAD"].includes(request.method.toUpperCase())) {
    return { cacheable: false, reason: "method" };
  }
  if (request.headers.has("range")) return { cacheable: false, reason: "range" };
  if (/\bno-store\b/i.test(request.headers.get("cache-control") || "")) {
    return { cacheable: false, reason: "request_no_store" };
  }

  const hasCredentials = request.headers.has("authorization") || request.headers.has("cookie");
  if (mode === "public" && hasCredentials) {
    return { cacheable: false, reason: "public_credentials" };
  }
  if (mode === "strict" && hasCredentials && !identity) {
    return { cacheable: false, reason: "identity_unknown" };
  }
  if (request.headers.has("cookie") && !identity
    && !varyHeaders.some((name) => name.toLowerCase() === "cookie")) {
    return { cacheable: false, reason: "cookie_unscoped" };
  }
  return { cacheable: true };
}

export function evaluateResponse(response, { varyHeaders = [] } = {}) {
  if (response.status !== 200) return { cacheable: false, reason: "response_status" };
  if (response.headers.has("set-cookie")) return { cacheable: false, reason: "set_cookie" };
  const control = response.headers.get("cache-control") || "";
  if (/\b(?:private|no-store)\b/i.test(control)) {
    return { cacheable: false, reason: "response_private" };
  }
  const responseVary = (response.headers.get("vary") || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
  if (responseVary.includes("*")) {
    return { cacheable: false, reason: "vary_star" };
  }
  const keyedHeaders = new Set(varyHeaders.map((name) => name.trim().toLowerCase()));
  if (responseVary.some((name) => !keyedHeaders.has(name))) {
    return { cacheable: false, reason: "vary_unkeyed" };
  }
  const type = (response.headers.get("content-type") || "application/octet-stream")
    .split(";")[0].trim().toLowerCase();
  if (!CACHEABLE_TYPES.includes(type)) {
    return { cacheable: false, reason: "content_type" };
  }
  return { cacheable: true };
}
