# EdgePG release history

Every package release is immutable and identified by version, product commit, byte size, SHA-256, and source fingerprint.

## 0.8.1-rc.18 — 2026-08-20

### Improved

- Replaced per-relation role-owner initialization with one set-based catalog operation while preserving existing owners.
- Consolidated physical table/view/index discovery into one set-based catalog probe without changing schema-move, quoted-identifier, catalog-only, or missing-catalog behavior.
- Reused metadata already read by the current prepared query for result OID resolution and cleared stale physical mappings when the replacement mapping is empty.
- Retained the rc.17 nullable boolean and filtered array aggregate corrections without adding cross-request result caching or weakening transaction, lock, SQLSTATE, or RPC semantics.

### Verified

- Targeted role/schema `13/13`, affected Worker `116/116`, full Worker `1100/1100`, TypeScript, exact installed package, exports, customer Worker dry run, COPY commit/rollback, local Service Binding, isolated real Cloudflare, Connector, and retained production read-only probes passed.
- Production Database Worker was upgraded in place while retaining its Worker, D1, Durable Objects, R2, URL, role, and synchronization state.

### Performance

- Matched local workerd fixture, 10 warmups plus 40 samples: catalog-probe D1 operations/statements fell from `3/7` to `1/1`, and p50/p95 fell from `7/8 ms` to `3/4 ms`.
- The same candidate measured point read `4/6 ms`, tenant join `5/6 ms`, and auth-existence `4/6 ms` p50/p95. These are fixture measurements, not a public-Internet SLA.

## 0.8.1-rc.17 — 2026-08-20

### Fixed

- Lowered boolean aggregate arguments whose PostgreSQL AST is a nullable-expression node, including `bool_or(value IS NOT NULL)`, instead of leaking `bool_or` into D1.
- Unified `FILTER` and window-modifier consumption for `bool_or`, `bool_and`, `every`, and `array_agg` combinations.
- Preserved `text[]` OID 1009 through nested `COALESCE(array_agg(...), '{}')` and decoded the canonical empty array as `[]`.

### Verified

- PostgreSQL 18.4 oracle comparison for empty, hit, and no-child auth-style aggregate queries.
- Physical-table fixture without an inline SQLite primary key, with primary-key metadata retained only in the EdgePG catalog.
- Targeted `3/3`, Worker package `1096/1096`, TypeScript, exact package install, Wrangler dry run, local workerd, isolated real Cloudflare Service Binding, Connector, and production probes.
- Production Database Worker was upgraded in place without changing its retained D1, Durable Objects, R2, URL, or role.

### Performance

- Exact fixed query, local workerd, 30 warm samples: p50/p95 `29.651/31.2 ms`.
- Ordinary fixed reads, 20 samples each: point `6/9 ms`, join `8/9 ms`, auth-existence `6/8 ms` p50/p95. These are fixture measurements, not a public-Internet SLA.

### Known boundary

- Direct runtime `Client.copyRows` commits zero rows in both exact rc.15 and rc.17. This is a retained historical boundary, not an rc.17 regression. Connector/PGWire COPY remains separately verified.

## 0.8.1-rc.15 — 2026-08-20

### Fixed

- Validated retained `current_*` catalog rows against physical D1 table metadata during install and in-place upgrade.
- Repaired malformed or width-inconsistent retained catalog JSON in bounded batches before ordinary query execution.
- Converted any remaining post-install catalog corruption into deterministic SQLSTATE `XX000` instead of allowing a raw JSON parser error to escape through Workers RPC.

### Verified

- Exact rc.14→rc.15 same-D1/same-DO upgrade reproduced full Better Auth/Drizzle single-parameter and two-parameter `AND` query failures before upgrade, then passed empty/hit results, nullable fields, OIDs 25/1184, and same-session recovery after in-place upgrade.
- PostgreSQL 18.4 oracle, catalog unit `43/43`, Worker package `1094/1094`, real Better Auth 1.6.25 Hono lifecycle, Drizzle migration/query/transaction, installed package, Worker dry-run, Service Binding, Connector, transaction, SQLSTATE, and concurrency gates passed.
- The production Database Worker retained its existing Worker, D1, Durable Objects, R2, and URL; `All2CFDatabase.openSession`, auth-shaped queries, boolean aggregates, read-only transaction, `42P01` recovery, and eight concurrent clients passed.

### Performance and distribution

- Same fixture, 100 hot samples with two complete auth queries per sample: rc.14 p50/p95 `12/13 ms`; rc.15 `12/14 ms`. This correctness release shows no material hot-query regression.
- Published the immutable npm TGZ, compiled ZIP, browsable 196-file compiled tree, per-file manifest, release identity, deployment/rollback instructions, and public evidence summary. Original source, source maps, tests, and internal evidence remain excluded.

## Repository licensing — 2026-08-20

- Added PolyForm Strict 1.0.0 for personal and noncommercial use.
- Added PolyForm Free Trial 1.0.0 for individual or company evaluation lasting fewer than 32 consecutive calendar days.
- Clarified that commercial use requires a separate written LogicMate license.
- Preserved the immutable rc.14 package and its published SHA-256; the license files will be embedded directly in the next package release.

## 0.8.1-rc.14 — 2026-08-20

### Fixed

- Implemented PostgreSQL `bool_or(boolean)`, `bool_and(boolean)`, and `every(boolean)` through generic aggregate lowering rather than query- or application-specific rewriting.
- Preserved PostgreSQL NULL and empty-input behavior and boolean RowDescription OID 16.

### Verified

- PostgreSQL 18.4 oracle: mixed true/false/NULL, all-NULL, empty input, `GROUP BY`, nullable `LEFT JOIN`, prepared parameters, `FILTER`, `DISTINCT`, and `every` synonym.
- Targeted runtime `2/2`, transaction regression `54/54`, Worker compiler `19/19`, installed-package identity and entrypoint imports.
- Isolated Service Binding and formal production probes passed function semantics, transaction behavior, `42P01`, same-session recovery, and cleanup.

### Retained

- rc.13 real Cloudflare hot-read improvements and rc.10/rc.11 COPY optimization/correctness closure.
- Existing Web P0, ORM, migration, archive and client compatibility evidence. The complete upstream `aggregates` regression file remains pending and is not represented as green.

### Distribution

- Published the immutable npm TGZ, compiled ZIP, browsable 196-file compiled tree, per-file SHA-256 manifest, release identity, test/function ledgers, and updated performance record.
- rc.14 changes 12 compiled files; 184 compiled files are byte-identical to rc.11 and remain visible through Git history.

## 0.8.1-rc.11 — 2026-08-20

### Fixed

- Synchronized PGWire COPY parser failures with the active transaction workspace.
- An invalid COPY value now aborts the explicit transaction: the COPY returns `22P02`, subsequent statements return `25P02`, and `ROLLBACK` restores the session.
- Previously flushed COPY chunks cannot be committed after a later row fails validation.

### Retained

- rc.10 COPY target-metadata deduplication and its measured `22.5%` p50 / `23.8%` p95 local improvement.
- PostgreSQL bigint, numeric, array, result-OID, transaction, Auth-compatible, RPC-limit, concurrency, and Connector behavior.

### Independently verified

- 4,000 rows committed in two client chunks with exact row count and maximum ID.
- An 8,001-row, five-chunk COPY failed in the middle with `22P02`; the next statement returned `25P02`; rollback left zero rows.
- `bigint` maximum, exact `numeric`, `text[]`, and OIDs `20/23/1009/1700` round-tripped without precision loss.
- Installed-package identity, Service Binding, Connector, baseline, concurrency, and cleanup gates passed.

### Distribution

- Published the canonical npm package and a conventional compiled ZIP.
- Added a browsable compiled-only tree and a permanent per-file SHA-256 manifest.
- Confirmed the public tree contains no original TypeScript/TSX/Rust source, source maps, tests, internal evidence, environment files or credentials.

## 0.8.1-rc.10 — 2026-08-20

### Changed

- Reused resolved COPY target metadata inside one uninterrupted COPY lifecycle.
- Added precise invalidation around ordinary SQL and transaction runtime changes.
- Preserved one Coordinator request for every COPY row chunk.

### Improved

- Local three-chunk COPY p50: `40 ms → 31 ms` (`22.5%`).
- p95: `42 ms → 32 ms` (`23.8%`).
- 4,000-row diagnostic D1 operations/statements/rows-read: `50%` fewer.
- Durable Object fetch count: unchanged.

### Verified

- Worker typecheck and installed-package gate.
- COPY/PGWire/commit tests `27/27`.
- 12,000-row atomic commit and mid-chunk rollback.
- Temporary PostgreSQL/network cleanup.

rc.10 was an optimization checkpoint and was superseded by rc.11 before public promotion after the failed-transaction gap was found.

## 0.8.1-rc.9

- Deduplicated safe transaction metadata resolution.
- Batch-500 total improved `462 ms → 316 ms` (`31.6%`).
- D1 operations improved `123 → 43` while DO fetches remained `22`.
- Transaction, Drizzle, and Prisma affected paths passed.

## 0.8.1-rc.2

- Reduced repeated D1 metadata operations across common query, write, and transaction paths.
- Real Cloudflare operation-count improvements were confirmed; absolute latency variance was disclosed separately.

## 0.8.1-rc.1

- Slimmed the installable package while preserving runtime exports and installed-package behavior.

Older compatibility milestones are retained in [COMPATIBILITY.md](COMPATIBILITY.md).
