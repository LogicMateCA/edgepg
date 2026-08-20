import { createWebAccelerator } from "./accelerator.mjs";

const encoder = new TextEncoder();
const cache = new Map();
const FEATURES = new Set(["edgepg", "accelerator"]);
const MAX_LEASE_MS = 7 * 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export function createAcceleratorLicenseGate({
  projectId,
  publicKey,
  loadToken,
  refreshMs = 24 * 60 * 60 * 1000,
  now = () => Date.now(),
} = {}) {
  if (!projectId || !publicKey || typeof loadToken !== "function") {
    throw new TypeError("accelerator licensing requires projectId, publicKey, and loadToken");
  }
  const cacheKey = `${projectId}:${publicKey}`;
  return {
    async require(feature = "accelerator") {
      const timestamp = now();
      const current = cache.get(cacheKey);
      if (current
        && current.expiresAt > timestamp
        && timestamp - current.loadedAt < refreshMs) {
        assertFeature(current.lease, feature);
        return current.lease;
      }
      const token = await loadToken();
      if (typeof token !== "string" || !token) {
        throw new Error("commercial lease is missing");
      }
      const lease = await verifyCommercialLease(token, publicKey, projectId, timestamp);
      assertFeature(lease, feature);
      cache.set(cacheKey, {
        lease,
        expiresAt: Date.parse(lease.expiresAt),
        loadedAt: timestamp,
      });
      return lease;
    },
  };
}

export function createLicensedWebAccelerator({ licenseGate, ...options } = {}) {
  if (!licenseGate?.require) {
    throw new TypeError("licensed accelerator requires a commercial license gate");
  }
  const accelerator = createWebAccelerator(options);
  return {
    ...accelerator,
    async handle(input, handler) {
      try {
        await licenseGate.require("accelerator");
      } catch {
        return handler(bypassContext());
      }
      return accelerator.handle(input, handler);
    },
  };
}

export async function verifyCommercialLease(token, publicKey, expectedProjectId, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v2")
    throw new Error("invalid commercial lease");
  const signed = `${parts[0]}.${parts[1]}`;
  const key = await crypto.subtle.importKey(
    "raw",
    decodeBase64Url(publicKey),
    { name: "Ed25519" },
    false,
    ["verify"],
  );
  if (!await crypto.subtle.verify(
    "Ed25519",
    key,
    decodeBase64Url(parts[2]),
    encoder.encode(signed),
  )) throw new Error("invalid commercial lease signature");
  const lease = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
  if (lease?.version !== 2
    || lease.projectId !== expectedProjectId
    || !["trial", "subscription", "legacy"].includes(lease.accessSource)
    || !Array.isArray(lease.features)
    || lease.features.some((feature) => !FEATURES.has(feature))
    || !Number.isSafeInteger(lease.sequence)
    || lease.sequence < 1) {
    throw new Error("commercial lease does not match this project");
  }
  const issuedAt = Date.parse(lease.issuedAt);
  const expiresAt = Date.parse(lease.expiresAt);
  if (!Number.isFinite(issuedAt)
    || !Number.isFinite(expiresAt)
    || issuedAt > now + CLOCK_SKEW_MS
    || expiresAt <= issuedAt
    || expiresAt - issuedAt > MAX_LEASE_MS + CLOCK_SKEW_MS) {
    throw new Error("invalid commercial lease timestamps");
  }
  if (expiresAt <= now) throw new Error("commercial lease has expired");
  return lease;
}

export function clearAcceleratorLicenseCache() {
  cache.clear();
}

function assertFeature(lease, feature) {
  if (!lease.features.includes(feature))
    throw new Error(`${feature} access is not included in this lease`);
}

function bypassContext() {
  return {
    dependencies: new Set(),
    track() {},
  };
}

function decodeBase64Url(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
