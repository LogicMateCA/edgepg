export function createAnalyticsEngineMetrics(dataset, {
  service = "web-accelerator",
  environment = "production",
} = {}) {
  if (!dataset?.writeDataPoint) {
    throw new TypeError("Analytics Engine metrics require writeDataPoint");
  }

  return {
    emit(event = {}) {
      try {
        const result = dataset.writeDataPoint({
          blobs: [
            String(service),
            String(environment),
            clean(event.outcome),
            clean(event.reason),
            clean(event.error),
          ],
          doubles: [
            finite(event.durationMs),
            finite(event.cacheAgeMs),
            finite(event.payloadBytes),
          ],
          indexes: [clean(event.outcome) || "unknown"],
        });
        Promise.resolve(result).catch(() => {});
      } catch {
        // Telemetry is never part of request correctness.
      }
    },
  };
}

export function createCompositeMetrics(...sinks) {
  const active = sinks.flat().filter((sink) => typeof sink?.emit === "function");
  return {
    emit(event) {
      for (const sink of active) {
        try {
          Promise.resolve(sink.emit(event)).catch(() => {});
        } catch {
          // One sink must not suppress another sink or affect a request.
        }
      }
    },
  };
}

export class ShadowReleaseGate {
  constructor({ minimumComparisons = 10000 } = {}) {
    if (!Number.isInteger(minimumComparisons) || minimumComparisons < 1) {
      throw new TypeError("minimumComparisons must be a positive integer");
    }
    this.minimumComparisons = minimumComparisons;
    this.comparisons = 0;
    this.matches = 0;
    this.mismatches = 0;
    this.candidateErrors = 0;
    this.reasons = new Map();
  }

  emit(event = {}) {
    if (event.outcome === "match") {
      this.comparisons += 1;
      this.matches += 1;
    } else if (event.outcome === "mismatch") {
      this.comparisons += 1;
      this.mismatches += 1;
      for (const reason of event.reasons || ["unknown"]) {
        this.reasons.set(reason, (this.reasons.get(reason) || 0) + 1);
      }
    } else if (event.outcome === "candidate_error") {
      this.candidateErrors += 1;
    }
  }

  snapshot() {
    return {
      pass: this.comparisons >= this.minimumComparisons
        && this.mismatches === 0
        && this.candidateErrors === 0,
      minimumComparisons: this.minimumComparisons,
      comparisons: this.comparisons,
      matches: this.matches,
      mismatches: this.mismatches,
      candidateErrors: this.candidateErrors,
      reasons: Object.fromEntries(this.reasons),
    };
  }
}

function clean(value) {
  if (value === null || value === undefined) return "";
  return String(value).slice(0, 256);
}

function finite(value) {
  return Number.isFinite(value) ? Number(value) : 0;
}
