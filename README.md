# EdgePG

### PostgreSQL-compatible database runtime for Cloudflare

EdgePG brings PostgreSQL client, SQL, transaction, catalog, and migration compatibility to Cloudflare applications backed by D1 and Durable Objects. Existing web applications can keep familiar `pg` APIs, ORM workflows, and PostgreSQL operational tooling without putting a separate connector in the application hot path.

[Manual deployment](DEPLOYMENT.md) · [Tests & commands](TESTING.md) · [Functions & operators](FUNCTIONS.md) · [Compatibility](COMPATIBILITY.md) · [Performance](PERFORMANCE.md) · [Roadmap](ROADMAP.md) · [Releases](CHANGELOG.md) · [License](LICENSE.md)

> **Commercial release repository.** This repository publishes immutable EdgePG packages, release manifests, compatibility status, performance results, and the public roadmap. Product source code is not published here.
>
> **License.** Personal and noncommercial use is permitted under PolyForm Strict 1.0.0. Individuals and companies may evaluate EdgePG for fewer than 32 consecutive days under PolyForm Free Trial 1.0.0. Commercial use requires a separate written LogicMate license. See [LICENSE.md](LICENSE.md).

## Why EdgePG

- **Keep PostgreSQL workflows.** Use PostgreSQL-shaped SQL, errors, result metadata, transactions, `pg` Client/Pool, and common ORM patterns.
- **Built for Cloudflare.** Ordinary application reads and writes use Worker bindings; Durable Objects coordinate transaction and lock paths that require shared ordering.
- **Fail closed.** Unsupported semantics return an explicit PostgreSQL-compatible error instead of silently executing a lossy SQLite approximation.
- **Standard migration tools.** Client-streamed `COPY`, PostgreSQL catalog surfaces, and `pg_dump`/`pg_restore` compatibility are product gates.
- **Evidence-led releases.** Every published result identifies its release, environment, scope, and limitations.

## Current candidate

| Field | Exact value |
|---|---|
| Release | `edgepg@0.8.1-rc.17` |
| Product commit | `5b77fc4e5ad39b444e1d68fa96594bde70ad6581` |
| Package SHA-256 | `0a24585bae66358e4f76329876dc58ced739f07ce5472a24b75082db96a9260f` |
| Package size | `1,213,933` bytes |
| Source fingerprint | `b37ddec0c8f3e479461e8669c66c143244b5a15937a74b9238f44f7c5e4a9347` |
| Channel | Prerelease |

Verify the downloaded package before installation:

```bash
sha256sum edgepg-0.8.1-rc.17.tgz
npm install ./edgepg-0.8.1-rc.17.tgz
```

[Download the immutable rc.17 package](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.17/edgepg-0.8.1-rc.17.tgz) · [Browse compiled files](compiled/latest/) · [Compiled ZIP](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.17/edgepg-0.8.1-rc.17-compiled.zip) · [Per-file manifest](compiled/manifests/0.8.1-rc.17-files.json) · [Checksums](releases/COMPILED-SHA256SUMS)

EdgePG does not provide an installer that creates or changes Cloudflare resources on your behalf. Follow the [manual Cloudflare deployment guide](DEPLOYMENT.md) to verify the package, create or select your own D1 database, add the Durable Object binding, inspect the bundle, and deploy your Worker.

### What changed in rc.17

Boolean and array aggregates now compile correctly when combined with nullable expressions, `FILTER`, `DISTINCT`, `COALESCE`, `LEFT JOIN`, `GROUP BY`, and prepared predicates. In particular, `bool_or(a.password IS NOT NULL)` no longer leaks an unsupported function into D1. The exact auth-style combination passes PostgreSQL 18.4 oracle comparison, local and real Cloudflare Service Binding gates, and the formal production probe. rc.17 retains the rc.15 in-place catalog validation and repair.

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

Exact `0.8.1-rc.10` local package baseline, retained by rc.17: local workerd + D1 + Coordinator DO, 1,000 rows, 2 warmups and 5 measured samples. The rc.17 exact aggregate-combination query used 30 warm samples and measured p50/p95 `29.651/31.2 ms`; ordinary point, join, and auth-existence reads measured `6/9`, `8/9`, and `6/8 ms` over 20 samples. These numbers isolate a fixed local runtime fixture; they are not public-Internet latency.

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

The optimization is retained in rc.17. Its independent PGWire gate also proves PostgreSQL failed-transaction behavior: an invalid COPY value returns `22P02`, the next statement returns `25P02`, and `ROLLBACK` restores the session with zero rows committed from the failed COPY. Direct runtime `Client.copyRows` remains a separately tracked historical boundary and is not claimed fixed by rc.17.

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
- [Commercial licensing](COMMERCIAL-LICENSE.md)

EdgePG is an independent LogicMate product. It is not affiliated with or endorsed by Cloudflare, Inc. or the PostgreSQL Global Development Group. Names are used only to describe compatibility and deployment targets.
