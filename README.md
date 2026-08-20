# EdgePG

### PostgreSQL-compatible database runtime for Cloudflare

EdgePG brings PostgreSQL client, SQL, transaction, catalog, and migration compatibility to Cloudflare applications backed by D1 and Durable Objects. Existing web applications can keep familiar `pg` APIs, ORM workflows, and PostgreSQL operational tooling without putting a separate connector in the application hot path.

[Open All2CF Database](https://app.all2cf.com/databases) · [Tests & commands](TESTING.md) · [Functions & operators](FUNCTIONS.md) · [Compatibility](COMPATIBILITY.md) · [Performance](PERFORMANCE.md) · [Roadmap](ROADMAP.md) · [Releases](CHANGELOG.md)

> **Commercial release repository.** This repository publishes immutable EdgePG packages, release manifests, compatibility status, performance results, and the public roadmap. Product source code is not published here.

## Why EdgePG

- **Keep PostgreSQL workflows.** Use PostgreSQL-shaped SQL, errors, result metadata, transactions, `pg` Client/Pool, and common ORM patterns.
- **Built for Cloudflare.** Ordinary application reads and writes use Worker bindings; Durable Objects coordinate transaction and lock paths that require shared ordering.
- **Fail closed.** Unsupported semantics return an explicit PostgreSQL-compatible error instead of silently executing a lossy SQLite approximation.
- **Standard migration tools.** Client-streamed `COPY`, PostgreSQL catalog surfaces, and `pg_dump`/`pg_restore` compatibility are product gates.
- **Evidence-led releases.** Every published result identifies its release, environment, scope, and limitations.

## Current candidate

| Field | Exact value |
|---|---|
| Release | `edgepg@0.8.1-rc.14` |
| Product commit | `5eb7469c795593ad62e850b720a94fe0fb1800c9` |
| Package SHA-256 | `06da999e695d96634edadbe05a21124c5f9b3ee42e9575bdb78b6f6a01ac3897` |
| Package size | `1,212,502` bytes |
| Source fingerprint | `1a00755bf915f533d717b4fcdbbebe46d182082ff2a0fadf7657d871fb9a8bd0` |
| Channel | Prerelease |

Verify the downloaded package before installation:

```bash
sha256sum edgepg-0.8.1-rc.14.tgz
npm install ./edgepg-0.8.1-rc.14.tgz
```

[Download the immutable rc.14 package](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.14/edgepg-0.8.1-rc.14.tgz) · [Browse compiled files](compiled/latest/) · [Compiled ZIP](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.14/edgepg-0.8.1-rc.14-compiled.zip) · [Per-file manifest](compiled/manifests/0.8.1-rc.14-files.json) · [Checksums](releases/COMPILED-SHA256SUMS)

### What changed in rc.14

PostgreSQL boolean aggregates are now supported through the generic planner: `bool_or`, `bool_and`, and the `every` synonym. PostgreSQL 18.4 oracle, local workerd, transaction, installed-package, Service Binding, and production probes cover mixed/NULL/empty inputs, grouping, nullable joins, prepared values, metadata OID 16, and failed-session recovery. See the [function-level ledger](FUNCTIONS.md).

### Distribution formats

| Format | Purpose | Source exposure |
|---|---|---|
| npm `.tgz` | Canonical installable package | Compiled runtime only |
| Compiled `.zip` | Conventional archive for inspection and tooling | Same compiled files as the npm package |
| Browsable compiled tree | File-by-file Git history and release diffs | `.js`, `.mjs`, `.wasm`, generated `.d.ts` and package metadata only |
| Per-file JSON manifest | Path, byte size, kind and SHA-256 for all 196 files | No file contents |

Original TypeScript/TSX/Rust source, source maps, tests, internal evidence, build scripts and credentials are not published.

## PostgreSQL test coverage

EdgePG maintains two independent PostgreSQL ledgers. Official regression files measure exact PostgreSQL 18.4 output; command-family gates measure the supported contract and explicit fail-closed boundary for every documented SQL command family.

| Evidence collection | Passed / classified | Remaining | What it proves |
|---|---:|---:|---|
| PostgreSQL 18.4 official regression files | 38 exact + 16 applicable-prefix | 144 pending; 33 architecture boundary | Unmodified official SQL/output where marked exact |
| PostgreSQL 18 command families | **183 / 183 golden** | 0 unclassified families | Every command family has a tested compatible or fail-closed contract |
| PGWire/COPY affected suite | **53 / 53** | 0 in affected suite | Protocol, chunking, metadata and failed-transaction behavior |

The official inventory is deliberately conservative: a targeted fixture can close a product bug, but it cannot turn an entire PostgreSQL regression file green. [See all 231 official files and all 183 command families →](TESTING.md)

### Web application P0

Status legend: ✅ passed · 🟨 partial/in progress · ⬜ not tested · ➖ not applicable · ⚠️ supported subset

| Product area | Status | Current result |
|---|---:|---|
| PostgreSQL client and result contract | ✅ | `pg` Client/Pool, parameters, metadata, SQLSTATE, prepared queries |
| Web SQL core | ✅ | CRUD, RETURNING, joins, aggregates, CTEs, set operations, windows |
| Transactions and concurrency | ✅ | Commit, rollback, savepoints, locks, advisory locks, failed-state recovery |
| Web data types | ✅ | JSON/JSONB, arrays, bigint/numeric precision, temporal types |
| Constraints and migrations | ✅ | PK/unique/FK/CHECK, defaults, identity/sequences, common schema DDL |
| ORM paths | ✅ | Drizzle, Sequelize, TypeORM common compatibility paths |
| Application frameworks | ✅ | Auth.js PostgreSQL Adapter and Better Auth HTTP flows |
| PostgreSQL tooling | ✅ | Catalog discovery, client COPY, retained backup/restore paths |
| COPY correctness | ✅ | 53/53 PGWire tests; independent 4,000-row commit and 8,001-row failure rollback |
| Full PostgreSQL server internals | ➖ | Physical WAL, backend processes, filesystem tablespaces, arbitrary C extensions |
| GIS module | ⬜ | Planned after plugin/core decoupling |
| Global business-data latency matrix | ✅ | WNAM/WEUR/APAC fixed-fixture primary/replica experiment completed; disclosed as experimental, not an SLA |

The complete P0–P4 status is maintained in [COMPATIBILITY.md](COMPATIBILITY.md).

## Daily workload performance

### Current-line local workerd baseline

Exact `0.8.1-rc.10` local package baseline, retained by rc.14: local workerd + D1 + Coordinator DO, 1,000 rows, 2 warmups and 5 measured samples. These numbers isolate EdgePG/runtime behavior; they are not public-Internet latency.

| Daily workload | p50 | p95 |
|---|---:|---:|
| Point read | 8 ms | 11 ms |
| Tenant join | 9 ms | 11 ms |
| Auth existence read | 8 ms | 11 ms |
| JSON profile read | 8 ms | 11 ms |
| Range aggregate | 10 ms | 12 ms |
| Prepared filter | 12 ms | 13 ms |
| Array filter | 12 ms | 13 ms |
| Exact numeric ordering | 12 ms | 15 ms |
| Catalog probe | 7 ms | 9 ms |
| Ordinary write | 23 ms | 34 ms |
| Upsert | 13 ms | 21 ms |
| Explicit transaction | 50 ms | 79 ms |
| Client-streamed COPY, 3 × 250 rows | 31 ms | 32 ms |

Additional fixed scenarios: eight concurrent clients completed in 96 ms total; the 500-row transactional batch completed in 305 ms. Those are scenario totals, not p50/p95 distributions.

### Real Cloudflare hot-read baseline

Temporary `0.8.1-rc.13` Worker/D1; fixed San Jose probe colocated with the Worker and D1 primary in **SJC/WNAM**; 1,000 rows, 10 warmups and 50 measured samples per workload. Timings measure `query()` after connect and exclude setup, cold start, connect, and close.

| Workload | p50 | p95 |
|---|---:|---:|
| Point read | 28 ms | 39 ms |
| Tenant join | 26 ms | 33 ms |
| Auth existence read | 43 ms | 63 ms |
| JSON profile | 30 ms | 51 ms |

The previous fixed-shape rc.12 run measured `76/160`, `75/107`, `60/124`, and `64/96 ms` respectively. Sample counts differ (`100` vs `50`), so this is a directional before/after record rather than a laboratory-perfect A/B. Temporary resources were deleted and absence was confirmed.

## Optimization record

### COPY — rc.9 → rc.10

Same local workerd fixture, five measured samples after two warmups:

| Metric | rc.9 | rc.10 | Improvement |
|---|---:|---:|---:|
| p50 | 40 ms | 31 ms | **22.5%** |
| p95 | 42 ms | 32 ms | **23.8%** |
| average | 40.6 ms | 31.2 ms | **23.2%** |
| 4,000-row D1 operations | 4 | 2 | **50.0% fewer** |

Durable Object fetches remained unchanged, so the optimization removed duplicate metadata work without bypassing transaction coordination.

The optimization is retained in rc.14. Its independent PGWire gate also proves PostgreSQL failed-transaction behavior: an invalid COPY value returns `22P02`, the next statement returns `25P02`, and `ROLLBACK` restores the session with zero rows committed from the failed COPY.

### Cross-region parity

| Observed colos | Duration | Comparisons | Mismatches | Candidate errors |
|---|---:|---:|---:|---:|
| SEA + MAD | 61.88 min | 14,840 | **0** | **0** |

This proves response parity across two real Cloudflare colos. Separately, a fixed WNAM/WEUR/APAC read-replica experiment showed average p95 reductions of about **75.6% in WEUR** and **74.0% in APAC**, while WNAM showed no advantage because it was already near the primary. See [PERFORMANCE.md](PERFORMANCE.md) for the full methodology and per-workload numbers; these are experimental measurements, not a global latency SLA.

## Runtime shape

```text
Application Worker
    │
    ├── ordinary query / result adaptation ──► D1
    │
    ├── coordinated transaction / lock ──────► Durable Object ──► D1
    │
    └── optional read acceleration ──────────► Worker memory / KV ──► origin

External PostgreSQL clients ──► Database Worker / PGWire connector
Backup and restore tooling ───► PostgreSQL-compatible catalog + COPY surfaces
```

## Development stages

| Stage | Objective |
|---|---|
| **P0** | Web application correctness: SQL, transactions, types, migrations, backup/restore |
| **P1** | Framework and operational breadth: ORM/Auth, retained upgrades, tooling |
| **P2** | Advanced PostgreSQL semantics and precise fail-closed boundaries |
| **P3** | Optional vector/GIS/acceleration modules and performance optimization |
| **P4** | Explicit server-internal boundaries that do not map to Workers/D1 |

Passing a higher stage never replaces the lower-stage correctness contract.

## Community

- [Ask a question or share an idea](../../discussions)
- [Report a public bug](../../issues/new?template=bug.yml)
- [Request a feature](../../issues/new?template=feature.yml)
- [All2CF Support](https://app.all2cf.com/?support=ticket&source=github-edgepg) for private or customer-specific help

EdgePG is an independent LogicMate product. It is not affiliated with or endorsed by Cloudflare, Inc. or the PostgreSQL Global Development Group. Names are used only to describe compatibility and deployment targets.
