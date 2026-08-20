# EdgePG release history

Every package release is immutable and identified by version, product commit, byte size, SHA-256, and source fingerprint.

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
