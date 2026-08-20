const DEFAULT_HEADERS = ["content-type", "content-language", "content-encoding"];

export function createShadowHandler({
  origin,
  candidate,
  onObservation = () => {},
  sampleRate = 1,
  random = Math.random,
  compareHeaders = DEFAULT_HEADERS,
} = {}) {
  if (typeof origin !== "function") throw new TypeError("shadow origin must be a function");
  if (typeof candidate !== "function") throw new TypeError("shadow candidate must be a function");
  if (!(sampleRate >= 0 && sampleRate <= 1)) {
    throw new RangeError("sampleRate must be between 0 and 1");
  }

  return async function shadow(request, ...args) {
    if (!(request instanceof Request)) throw new TypeError("shadow requires a Request");
    const eligible = (request.method === "GET" || request.method === "HEAD")
      && random() < sampleRate;
    if (!eligible) return origin(request, ...args);

    const originPromise = origin(request.clone(), ...args);
    const candidatePromise = Promise.resolve()
      .then(() => candidate(request.clone(), ...args))
      .then(
        (response) => ({ response }),
        (error) => ({ error }),
      );
    const originResponse = await originPromise;
    if (!(originResponse instanceof Response)) {
      throw new TypeError("shadow origin must return a Response");
    }

    try {
      const candidateResult = await candidatePromise;
      if (candidateResult.error) throw candidateResult.error;
      const candidateResponse = candidateResult.response;
      if (!(candidateResponse instanceof Response)) {
        throw new TypeError("shadow candidate must return a Response");
      }
      const comparison = await compareResponses(
        originResponse.clone(),
        candidateResponse,
        compareHeaders,
      );
      safelyObserve(onObservation, {
        outcome: comparison.match ? "match" : "mismatch",
        ...comparison,
      });
    } catch (error) {
      safelyObserve(onObservation, {
        outcome: "candidate_error",
        error: error instanceof Error ? error.name : "Error",
      });
    }
    return originResponse;
  };
}

export async function compareResponses(origin, candidate, compareHeaders = DEFAULT_HEADERS) {
  const [originBody, candidateBody] = await Promise.all([
    origin.arrayBuffer(),
    candidate.arrayBuffer(),
  ]);
  const [originHash, candidateHash] = await Promise.all([
    sha256(originBody),
    sha256(candidateBody),
  ]);
  const originHeaders = selectedHeaders(origin.headers, compareHeaders);
  const candidateHeaders = selectedHeaders(candidate.headers, compareHeaders);
  const reasons = [];
  if (origin.status !== candidate.status) reasons.push("status");
  if (originHash !== candidateHash) reasons.push("body");
  if (JSON.stringify(originHeaders) !== JSON.stringify(candidateHeaders)) reasons.push("headers");

  return {
    match: reasons.length === 0,
    reasons,
    origin: {
      status: origin.status,
      bodyHash: originHash,
      bodyBytes: originBody.byteLength,
      headers: originHeaders,
    },
    candidate: {
      status: candidate.status,
      bodyHash: candidateHash,
      bodyBytes: candidateBody.byteLength,
      headers: candidateHeaders,
    },
  };
}

function selectedHeaders(headers, names) {
  return Object.fromEntries([...new Set(names.map((name) => name.toLowerCase()))]
    .sort()
    .flatMap((name) => {
      const value = headers.get(name);
      return value === null ? [] : [[name, value]];
    }));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", value);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safelyObserve(observer, event) {
  try {
    Promise.resolve(observer(event)).catch(() => {});
  } catch {
    // Observability must never affect the origin response.
  }
}
