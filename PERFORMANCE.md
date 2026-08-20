# EdgePG performance record

Performance results are kept as a time series so each optimization can be compared against a fixed baseline without weakening correctness.

## Measurement policy

- Bind results to an exact release, product commit, and package SHA-256.
- Fix workload, data size, warmup, sample count, and concurrency.
- Report p50 and p95; never market a single sample as a trend.
- Preserve transaction, lock, SQLSTATE, result, and cleanup gates.
- Keep local workerd, real Cloudflare, comparator, and multi-region results separate.

## 0.8.1-rc.10 → rc.11 — COPY metadata optimization and correctness closure

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

rc.11 retains this optimization and closes the transport-level failed-transaction gap discovered during independent validation. The independent rc.11 gate committed 4,000 rows in two client chunks, then proved that an 8,001-row failure returns `22P02`, rejects the next statement with `25P02`, and rolls back every flushed chunk. The performance numbers above are the fixed rc.9→rc.10 A/B; they were not re-labeled as a new rc.11 speed measurement.

## 0.8.1-rc.9 — Transaction metadata optimization

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

## Real Cloudflare SQL baseline

A temporary `0.8.1-rc.6` Worker/D1 run observed Worker colo **YVR** (Calgary) and D1 service region **WNAM/SJC**. Fixture: 1,000 rows, 2 warmups, 10 measured samples.

| Workload | p50 | p95 | Result shape |
|---|---:|---:|---|
| Point read | 212 ms | 227 ms | 1 row |
| Tenant join | 304 ms | 386 ms | 1 row |
| Auth existence read | 213 ms | 248 ms | 1 row |
| JSON profile | 185 ms | 196 ms | 1 row |
| Range aggregate | 181 ms | 238 ms | 1 row |
| Prepared filter | 221 ms | 247 ms | 10 rows |
| Array filter | 172 ms | 214 ms | 1 aggregate row |
| Exact numeric order | 231 ms | 266 ms | 5 rows |
| Catalog probe | 2,488 ms | 2,842 ms | metadata-heavy path |

Temporary resources were deleted and absence was confirmed. This is a single-entry Cloudflare baseline, not a global latency claim.

## Global execution evidence

### Cross-region response parity

| Observed colos | Driver regions | Duration | Comparisons | Mismatch | Errors |
|---|---|---:|---:|---:|---:|
| SEA, MAD | WNAM, WEUR | 61.88 min | 14,840 | **0** | **0** |

This real Cloudflare shadow run proves deterministic candidate/origin response parity across two observed colos. The fixture did not perform business-data reads and recorded no per-colo D1 latency.

### Global business-data latency

⬜ **Not tested yet.** Global compute placement is valuable, but data location, consistency routing, cache hit rate, and origin distance decide the database result. EdgePG will not turn cross-region parity into an unsupported global latency claim.

## Historical Cloudflare accelerator A/B

Three synthetic dashboard runs used temporary Worker, D1, and KV resources. These results guide future acceleration work; they predate rc.10/rc.11 and are not presented as current-line SQL performance.

| Run | D1 baseline p50/p95 | KV p50/p95 | Strict versioned p50/p95 |
|---|---:|---:|---:|
| 1 | 23 / 58 ms | 2 / 3 ms | 18 / 22 ms |
| 2 | 21 / 32 ms | 2 / 2 ms | 16 / 21 ms |
| 3 | 16 / 42 ms | 2 / 3 ms | 13 / 20 ms |

Per run: baseline `n=12`, KV `n=12`, strict `n=10`, warmups excluded. Responses were byte-consistent and resources were removed.

## Fixed global benchmark matrix

The next multi-region run must publish all fields below before EdgePG claims global read performance:

| Release | Driver region | Observed colo | Data region | Workload | Mode | n | p50 | p95 | p99 | Correctness | Status |
|---|---|---|---|---|---|---:|---:|---:|---:|---|---|
| rc.11 | WNAM | — | — | business point read | direct | — | — | — | — | — | ⬜ |
| rc.11 | WEUR | — | — | business point read | direct | — | — | — | — | — | ⬜ |
| rc.11 | APAC | — | — | business point read | direct | — | — | — | — | — | ⬜ |

Required evidence: exact artifact identity, UTC time, observed `request.cf.colo`, actual data region, row count, warmup/measured samples, concurrency, p50/p95/p99/max, cache hit/miss and origin calls, D1 statements/rows, response checksum, and cleanup state.

## Optimization timeline

| Priority | Cluster | Status | Safety condition |
|---|---|---:|---|
| P0 | Catalog snapshot/materialization reuse | 🟨 | No stale catalog or transaction visibility |
| P0 | Common ORM transaction metadata calls | ✅ | DO coordination unchanged |
| P0 | COPY target metadata calls | ✅ | Atomic chunks and rollback unchanged |
| P1 | Cold-start/package loading tiers | 🟨 | Same exports and capability gates |
| P1 | Common read-path call amplification | 🟨 | One D1 path where semantics permit |
| P2 | Optional global read acceleration | 🟨 | Read-after-write and tenant isolation |
| P2 | Multi-region business-data benchmark | ⬜ | Fixed matrix above |
