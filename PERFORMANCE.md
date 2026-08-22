# EdgePG performance record

Performance results are kept as a time series so each optimization can be compared against a fixed baseline without weakening correctness.

## Measurement policy

- Bind results to an exact release, product commit, and package SHA-256.
- Fix workload, data size, warmup, sample count, and concurrency.
- Report p50 and p95; never market a single sample as a trend.
- Preserve transaction, lock, SQLSTATE, result, and cleanup gates.
- Keep local workerd, real Cloudflare, comparator, and multi-region results separate.

## Daily read/write baseline — current line

The 0.8.2 final CPU planner benchmark completed with zero errors: query p50/p95 `1.351/1.835 ms`, write `0.699/0.901 ms`, prepared `1.045/1.391 ms`, and transaction planning `1.021/1.398 ms`. The independent real Cloudflare retained fixture measured the production-shaped four-row migration at `8.083 s` for rollback and `9.339 s` for commit. These results identify their specific fixtures and are not a global SLA.

The ordinary workload baseline is presented before optimization deltas. It answers the practical question: how long do common reads, writes and transactions take in the isolated EdgePG runtime?

Exact `0.8.1-rc.10` package baseline, retained by rc.18; local workerd + D1 + Coordinator DO; 1,000 rows; 2 warmups; 5 measured samples.

The rc.18 retained-catalog hot-path comparison used the same local workerd fixture with 10 warmups and 40 measured samples. Catalog-probe D1 operations/statements fell from `3/7` to `1/1`, while p50/p95 fell from `7/8 ms` to `3/4 ms`. Candidate common reads measured point `4/6 ms`, tenant join `5/6 ms`, and auth existence `4/6 ms` p50/p95. COPY measured `29/34 ms` versus `30/35 ms`, with 4,000 committed rows and zero rows after injected rollback. These figures are fixed-fixture evidence, not a global latency claim.

The rc.19 prepared/ORM comparison used the same local workerd harness with 5 warmups and 40 samples. SQL PREPARE/EXECUTE p50/p95 improved from `11/15 ms` to `7/9 ms`, prepared filters from `9/10 ms` to `5/6 ms`, and three EXECUTEs reduced D1 operations/statements from `15/24` to `9/18`. rc.19 common reads measured point `4/6 ms`, join `4/5 ms`, auth existence `4/6 ms`, and catalog `3/5 ms`. Transaction p50/p95 was `50/84 ms`; no transaction speedup is claimed.

The rc.20 correctness comparison used the same local workerd harness with 5 warmups and 40 samples. Prepared SQL remained `7/9 ms`; point read remained `4/6 ms`; tenant join measured `5/6 ms`; auth existence `4/5 ms`; catalog `3/4 ms`; single write `14/18 ms`; transaction `46/68 ms`. Three prepared EXECUTEs remained at 9 D1 operations, 18 statements and zero DO fetches. No performance gain is claimed for rc.20.

The rc.15 retained-catalog correctness gate also ran 100 hot samples with two complete auth queries per sample on the same fixture: rc.14 p50/p95 `12/13 ms`; rc.15 `12/14 ms`. The one-millisecond p95 difference is not presented as an optimization or regression claim.

The rc.17 aggregate-combination gate used the exact fixed auth-style query on local workerd with D1 and the Coordinator Durable Object. After warmup, 30 samples measured p50/p95 `29.651/31.2 ms` (min `28.364`, max `33.351`). Separate 20-sample ordinary reads measured point `6/9 ms`, join `8/9 ms`, and auth-existence `6/8 ms` p50/p95. rc.15 has no successful sample for this exact aggregate combination because `bool_or` reached D1 as an unsupported function, so this is correctness-plus-current-performance evidence rather than a before/after speedup claim.

### Reads

| Workload | Category | p50 | p95 | Result shape |
|---|---|---:|---:|---|
| Point read | Primary-key lookup | 8 ms | 11 ms | 1 row |
| Tenant join | Common relational read | 9 ms | 11 ms | 1 row |
| Auth existence | Session/auth lookup | 8 ms | 11 ms | 1 boolean row |
| JSON profile | JSON field projection | 8 ms | 11 ms | 1 row |
| Range aggregate | Filter + aggregate | 10 ms | 12 ms | 1 aggregate row |
| Prepared filter | Bound parameters | 12 ms | 13 ms | 10 rows |
| Array filter | Array predicate | 12 ms | 13 ms | 1 aggregate row |
| Exact numeric order | Numeric precision + sort | 12 ms | 15 ms | 5 rows |
| Catalog probe | Local metadata discovery | 7 ms | 9 ms | 1 row |

### Writes, transactions and bulk paths

| Workload | p50 | p95 | Contract retained |
|---|---:|---:|---|
| Ordinary write | 23 ms | 34 ms | Persisted value and row count |
| Upsert | 13 ms | 21 ms | Conflict update and RETURNING |
| Explicit transaction | 50 ms | 79 ms | Coordinator ordering and atomic commit |
| Client COPY, 3 × 250 rows | 31 ms | 32 ms | Chunked transaction followed by rollback |

Two additional fixed scenarios were measured as totals rather than distributions:

| Scenario | Total | Scope |
|---|---:|---|
| Eight concurrent clients | 96 ms | 8 results returned |
| Transactional batch-500 | 305 ms | 20 × 25-row INSERT statements in one transaction |

This local baseline is not a Cloudflare edge-latency claim. Its purpose is to expose runtime regressions and call amplification under repeatable conditions.

## Hot business reads — real Cloudflare

The current hot-read record uses one temporary Worker/D1 fixture with 1,000 rows and a fixed San Jose probe colocated with the Worker and D1 primary in **SJC/WNAM**. Each workload reused one connected client. Setup, cold start, connect, and close are excluded.

| Workload | rc.12 p50/p95 (`n=100`) | rc.13 p50/p95 (`n=50`) | Directional change |
|---|---:|---:|---:|
| Point read | 76 / 160 ms | **28 / 39 ms** | p50 −63%, p95 −76% |
| Tenant join | 75 / 107 ms | **26 / 33 ms** | p50 −65%, p95 −69% |
| Auth existence | 60 / 124 ms | **43 / 63 ms** | p50 −28%, p95 −49% |
| JSON profile | 64 / 96 ms | **30 / 51 ms** | p50 −53%, p95 −47% |

The workload shape and location were fixed, but sample counts differ, so this is a directional before/after record rather than a laboratory-perfect A/B. rc.15 retains the rc.13 implementation; it does not relabel these measurements as a new rc.15 benchmark. Temporary resources were deleted and absence was confirmed.

For context, an earlier YVR→SJC non-colocated rc.6 run measured 172–304 ms p50 across common reads and 2,488 ms for a metadata-heavy catalog probe. That older network shape is retained as historical evidence, not as the current hot-read headline.

## Optimization deltas

### 0.8.1-rc.12 → rc.13 — hot read path

The real Cloudflare comparison above reduced repeated relation/catalog work while preserving the same D1 primary and query results. Fixed-shape p95 improved by 47–76% across the four measured business reads. Independent Service Binding validation also measured a warm three-statement pure-SELECT batch at `92/109 ms` total p50/p95 and a catalog-inclusive batch at `125/189 ms`, with transaction semantics retained.

### 0.8.1-rc.10 → rc.11 — COPY metadata optimization and correctness closure

Same local workerd fixture: five measured samples after two warmups; three 250-row chunks inside one explicit transaction.

| Metric | rc.9 | rc.10 | Change |
|---|---:|---:|---:|
| p50 | 40 ms | 31 ms | **−22.5%** |
| p95 | 42 ms | 32 ms | **−23.8%** |
| average | 40.6 ms | 31.2 ms | **−23.2%** |

The 4,000-row/two-chunk diagnostic:

| Metric | rc.9 | rc.10 | Change |
|---|---:|---:|---:|
| D1 operations | 4 | 2 | **−50.0%** |
| D1 statements | 6 | 3 | **−50.0%** |
| D1 rows read | 12 | 6 | **−50.0%** |
| Durable Object fetches | 4 | 4 | unchanged |

Correctness remained intact: 4,000 rows committed, the failure case left zero rows, affected COPY/PGWire/commit tests passed `27/27`, and the 12,000-row wide-row atomic case passed.

rc.17 retains this optimization and the rc.11 transport-level failed-transaction closure. The independent PGWire gate committed 4,000 rows in two client chunks, then proved that an 8,001-row failure returns `22P02`, rejects the next statement with `25P02`, and rolls back every flushed chunk. Direct runtime `Client.copyRows` is not covered by that claim and remains a separate historical boundary. The performance numbers above remain the fixed rc.9→rc.10 A/B.

### 0.8.1-rc.9 — Transaction metadata optimization

Same local workerd benchmark: 1,000 source rows; 20 statements of 25 rows in one transaction; 10 samples after 3 warmups.

| Batch-500 metric | rc.8 | rc.9 | Change |
|---|---:|---:|---:|
| Total | 462 ms | 316 ms | **−31.6%** |
| D1 operations | 123 | 43 | **−65.0%** |
| D1 statements | 163 | 63 | **−61.3%** |
| D1 duration | 261 ms | 101 ms | **−61.3%** |
| D1 rows read | 240 | 120 | **−50.0%** |
| Durable Object fetches | 22 | 22 | unchanged |

The gain came from eliminating duplicate metadata resolution. Transaction coordination was not bypassed.

## Global execution evidence

### Cross-region response parity

| Observed colos | Driver regions | Duration | Comparisons | Mismatch | Errors |
|---|---|---:|---:|---:|---:|
| SEA, MAD | WNAM, WEUR | 61.88 min | 14,840 | **0** | **0** |

This real Cloudflare shadow run proves deterministic candidate/origin response parity across two observed colos. The fixture did not perform business-data reads and recorded no per-colo D1 latency.

### Global business-data latency

✅ A fixed rc.12 experiment measured D1 primary and read-replica routes from WNAM, WEUR, and APAC. The fixture used one temporary Worker, one 1,000-row D1 database, one probe per region, eight business-read workloads, five warmups, and 20 measured samples per primary/replica route. Response checksums matched and cleanup was confirmed.

| Driver region | Primary p50/p95 | Replica p50/p95 | Interpretation |
|---|---:|---:|---|
| WNAM | 140 / 280 ms | 152 / 295 ms | Already near the SJC primary; replica routing offered no advantage |
| WEUR | 793 / 824 ms | **174 / 206 ms** | Local FRA replicas materially reduced read latency |
| APAC | 536 / 557 ms | **136 / 149 ms** | Local KIX replicas materially reduced read latency |

Per-workload p95 evidence:

| Workload | WEUR primary → replica | APAC primary → replica |
|---|---:|---:|
| Point read | 811 → 117 ms | 464 → 81 ms |
| Tenant join | 699 → 112 ms | 478 → 74 ms |
| Auth existence | 693 → 89 ms | 495 → 77 ms |
| JSON profile | 696 → 126 ms | 478 → 78 ms |
| Range aggregate | 870 → 415 ms | 589 → 320 ms |
| Prepared filter | 1,034 → 135 ms | 729 → 131 ms |
| Array filter | 893 → 443 ms | 610 → 334 ms |
| Exact numeric order | 896 → 211 ms | 615 → 100 ms |

Across the eight workloads, the experiment's average p95 reduction was about **75.6% in WEUR** and **74.0% in APAC**. This is a single-probe, fixed-fixture experiment—not a global average, production SLA, or guarantee that every query benefits. WNAM is intentionally shown because it demonstrates that replication should not be marketed as universally faster.

## Historical Cloudflare accelerator A/B

Three synthetic dashboard runs used temporary Worker, D1, and KV resources. These results guide future acceleration work; they predate rc.10/rc.11 and are not presented as current-line SQL performance.

| Run | D1 baseline p50/p95 | KV p50/p95 | Strict versioned p50/p95 |
|---|---:|---:|---:|
| 1 | 23 / 58 ms | 2 / 3 ms | 18 / 22 ms |
| 2 | 21 / 32 ms | 2 / 2 ms | 16 / 21 ms |
| 3 | 16 / 42 ms | 2 / 3 ms | 13 / 20 ms |

Per run: baseline `n=12`, KV `n=12`, strict `n=10`, warmups excluded. Responses were byte-consistent and resources were removed.

## Global benchmark discipline

Every future multi-region update must retain exact artifact identity, UTC time, observed `request.cf.colo`, actual D1 region/colo, row count, warmup/measured samples, concurrency, p50/p95/p99/max, route, response checksum, and cleanup state. A result is never promoted from experiment to SLA without repeated probes, dates, workloads, and production-grade statistical controls.

## Optimization timeline

| Priority | Cluster | Status | Safety condition |
|---|---|---:|---|
| P0 | Catalog snapshot/materialization reuse | 🟨 | No stale catalog or transaction visibility |
| P0 | Common ORM transaction metadata calls | ✅ | DO coordination unchanged |
| P0 | COPY target metadata calls | ✅ | Atomic chunks and rollback unchanged |
| P1 | Cold-start/package loading tiers | 🟨 | Same exports and capability gates |
| P1 | Common read-path call amplification | 🟨 | One D1 path where semantics permit |
| P2 | Optional global read acceleration | 🟨 | Read-after-write and tenant isolation |
| P2 | Multi-region business-data benchmark | ✅ experiment | Repeat over time before any SLA claim |
