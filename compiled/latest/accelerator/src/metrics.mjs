export class MemoryMetrics {
  constructor() {
    this.counts = new Map();
    this.latencies = [];
    this.events = [];
  }

  emit(event) {
    const key = `${event.outcome}:${event.reason || "none"}`;
    this.counts.set(key, (this.counts.get(key) || 0) + 1);
    if (Number.isFinite(event.durationMs)) this.latencies.push(event.durationMs);
    this.events.push({ ...event });
    if (this.events.length > 100) this.events.shift();
  }

  snapshot() {
    const sorted = [...this.latencies].sort((left, right) => left - right);
    const outcomes = {};
    for (const [key, count] of this.counts) {
      const outcome = key.split(":", 1)[0];
      outcomes[outcome] = (outcomes[outcome] || 0) + count;
    }
    const hits = outcomes.hit || 0;
    const misses = outcomes.miss || 0;
    return {
      counts: Object.fromEntries(this.counts),
      outcomes,
      hitRate: hits + misses ? hits / (hits + misses) : 0,
      latency: sorted.length ? {
        measured: sorted.length,
        p50Ms: percentile(sorted, 0.5),
        p95Ms: percentile(sorted, 0.95),
      } : { measured: 0 },
      recent: this.events.map((event) => ({ ...event })),
    };
  }
}

export const noopMetrics = { emit() {} };

function percentile(sorted, value) {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * value))];
}
