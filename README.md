# EdgePG

### PostgreSQL-compatible database runtime for Cloudflare

EdgePG brings PostgreSQL client, SQL, transaction, catalog, and migration compatibility to Cloudflare applications backed by D1 and Durable Objects. Existing web applications can keep familiar `pg` APIs, ORM workflows, and PostgreSQL operational tooling without putting a separate connector in the application hot path.

[Open All2CF Database](https://app.all2cf.com/databases) · [Tests & commands](TESTING.md) · [Compatibility](COMPATIBILITY.md) · [Performance](PERFORMANCE.md) · [Roadmap](ROADMAP.md) · [Releases](CHANGELOG.md)

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
| Release | `edgepg@0.8.1-rc.11` |
| Product commit | `799a5055fd678af5c143ce419c770ab6d7409554` |
| Package SHA-256 | `c0922a0e8649f324747b3311e5d9b23e661acde5ac97f18fae657dd12f7a08bd` |
| Package size | `1,211,548` bytes |
| Source fingerprint | `f61fa73cac8aa5c27f16ec7b2189e296cdd3af6b82a71db70c6556169edc56d2` |
| Channel | Prerelease |

Verify the downloaded package before installation:

```bash
sha256sum edgepg-0.8.1-rc.11.tgz
npm install ./edgepg-0.8.1-rc.11.tgz
```

[Download the immutable rc.11 package](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.11/edgepg-0.8.1-rc.11.tgz) · [Release manifest](releases/0.8.1-rc.11.json) · [Checksums](releases/SHA256SUMS)

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
| Global business-data latency matrix | ⬜ | Multi-region parity is proven; multi-region database latency is not yet measured |

The complete P0–P4 status is maintained in [COMPATIBILITY.md](COMPATIBILITY.md).

## Daily workload performance

### Current-line local workerd baseline

Exact `0.8.1-rc.10` package, retained by rc.11: local workerd + D1 + Coordinator DO, 1,000 rows, 2 warmups and 5 measured samples. These numbers isolate EdgePG/runtime behavior; they are not public-Internet latency.

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

### Real Cloudflare read baseline

Temporary `0.8.1-rc.6` Worker/D1; observed Worker colo **YVR**, D1 service region **WNAM/SJC**; 1,000 rows, 2 warmups and 10 measured samples.

| Workload | p50 | p95 |
|---|---:|---:|
| Point read | 212 ms | 227 ms |
| Tenant join | 304 ms | 386 ms |
| Auth existence read | 213 ms | 248 ms |
| JSON profile | 185 ms | 196 ms |
| Range aggregate | 181 ms | 238 ms |
| Prepared filter | 221 ms | 247 ms |
| Array filter | 172 ms | 214 ms |
| Exact numeric order | 231 ms | 266 ms |
| Catalog probe | 2,488 ms | 2,842 ms |

The catalog row is intentionally separate: it is a metadata-heavy path, not a normal business read. Temporary Cloudflare resources were deleted and absence was confirmed.

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

The optimization is retained in rc.11. Its independent PGWire gate also proves PostgreSQL failed-transaction behavior: an invalid COPY value returns `22P02`, the next statement returns `25P02`, and `ROLLBACK` restores the session with zero rows committed from the failed COPY.

### Cross-region parity

| Observed colos | Duration | Comparisons | Mismatches | Candidate errors |
|---|---:|---:|---:|---:|
| SEA + MAD | 61.88 min | 14,840 | **0** | **0** |

This proves response parity across two real Cloudflare colos. It is not presented as a database-latency benchmark. See [PERFORMANCE.md](PERFORMANCE.md) for methodology, ordinary read/write baselines, historical accelerator A/B, and the planned WNAM/WEUR/APAC measurement matrix.

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
