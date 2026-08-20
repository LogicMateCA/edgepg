export function createControlPlane({
  authenticate,
  getMetrics,
  purge,
  prewarm,
  getConfig,
  saveConfig,
  getRoutes,
  testRoute,
  basePath = "/__web-accelerator",
  maxBodyBytes = 16 * 1024,
} = {}) {
  if (typeof authenticate !== "function") {
    throw new TypeError("control plane requires authenticate(request)");
  }
  if (typeof getMetrics !== "function") {
    throw new TypeError("control plane requires getMetrics(request)");
  }

  return {
    async fetch(request) {
      if (!(request instanceof Request)) {
        throw new TypeError("control plane requires a Request");
      }
      const url = new URL(request.url);
      if (!url.pathname.startsWith(`${basePath}/`)) return json({ error: "not_found" }, 404);

      let authorized = false;
      try {
        authorized = await authenticate(request) === true;
      } catch {
        authorized = false;
      }
      if (!authorized) return json({ error: "unauthorized" }, 401);

      try {
        if (url.pathname === `${basePath}/metrics` && request.method === "GET") {
          return json({ ok: true, metrics: await getMetrics(request) });
        }
        if (url.pathname === `${basePath}/config` && request.method === "GET") {
          if (typeof getConfig !== "function") return json({ error: "not_configured" }, 501);
          return json({ ok: true, config: await getConfig(request) });
        }
        if (url.pathname === `${basePath}/config` && request.method === "PUT") {
          if (typeof saveConfig !== "function") return json({ error: "not_configured" }, 501);
          const payload = await body(request, maxBodyBytes);
          return json({ ok: true, config: await saveConfig(payload, request) });
        }
        if (url.pathname === `${basePath}/routes` && request.method === "GET") {
          if (typeof getRoutes !== "function") return json({ error: "not_configured" }, 501);
          return json({ ok: true, routes: await getRoutes(request) });
        }
        if (url.pathname === `${basePath}/test` && request.method === "POST") {
          if (typeof testRoute !== "function") return json({ error: "not_configured" }, 501);
          const payload = await body(request, maxBodyBytes);
          return json({ ok: true, decision: await testRoute(payload, request) });
        }
        if (url.pathname === `${basePath}/purge` && request.method === "POST") {
          if (typeof purge !== "function") return json({ error: "not_configured" }, 501);
          const payload = await body(request, maxBodyBytes);
          return json({
            ok: true,
            action: "purge",
            result: await purge(payload, request),
          });
        }
        if (url.pathname === `${basePath}/prewarm` && request.method === "POST") {
          if (typeof prewarm !== "function") return json({ error: "not_configured" }, 501);
          const payload = await body(request, maxBodyBytes);
          return json({
            ok: true,
            action: "prewarm",
            result: await prewarm(payload, request),
          });
        }
        return json({ error: "not_found" }, 404);
      } catch (error) {
        if (error instanceof ControlRequestError) {
          return json({ error: error.code }, error.status);
        }
        if (error instanceof Error && error.name === "ConfigurationConflictError") {
          return json({ error: "configuration_conflict" }, 409);
        }
        return json({ error: "operation_failed" }, 500);
      }
    },
  };
}

async function body(request, maxBodyBytes) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBodyBytes) {
    throw new ControlRequestError("payload_too_large", 413);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBodyBytes) {
    throw new ControlRequestError("payload_too_large", 413);
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new ControlRequestError("invalid_json", 400);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ControlRequestError("invalid_payload", 400);
  }
  return value;
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

class ControlRequestError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}
