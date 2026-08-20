# EdgePG release history

Every package release is immutable and identified by version, product commit, byte size, SHA-256, and source fingerprint.

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
