# EdgePG engineering roadmap

Work advances by semantic cluster. Each completed cluster creates one consolidated verification record instead of publishing every intermediate development build.

## Release discipline

1. Fix the complete root-cause cluster.
2. Run affected correctness and performance gates.
3. Produce one immutable candidate with exact identity.
4. Run one consolidated independent consumer gate.
5. Update compatibility, performance, and roadmap records.
6. Promote only when lower-stage correctness remains intact.

## P0 — Web application correctness

**Goal:** keep PostgreSQL client behavior, SQL, transactions, migrations, backup/restore, and observable errors for mainstream web applications.

- [x] Core CRUD, parameters, result metadata, and SQLSTATEs
- [x] Transactions, savepoints, locks, rollback, and recovery
- [x] Common relational queries and Web data types
- [x] Constraints, identity/sequences, defaults, and migration DDL
- [x] Client-streamed COPY with atomic failure rollback
- [x] PostgreSQL catalog and retained backup/restore paths
- [ ] Regenerate the full 231-file official applicability matrix on the current engine
- [ ] Promote official files only after complete unmodified SQL/output comparison; targeted fixtures remain Web P0 evidence

## P1 — Application and operational breadth

**Goal:** retained upgrades and real framework suites pass across supported deployment paths.

- [x] node-postgres Client/Pool common contract
- [x] Drizzle, Sequelize, and TypeORM common paths
- [x] Auth.js and Better Auth real application flows
- [x] Retained catalog upgrade fixtures
- [ ] Complete Prisma native PostgreSQL differential corpus
- [ ] Complete ORM concurrency and SQLSTATE matrix
- [ ] Expand multi-organization SaaS and OAuth refresh stress tests

## P2 — Advanced PostgreSQL semantics

**Goal:** advanced surfaces have either a verified compatible subset or an exact fail-closed boundary.

- [x] Common MERGE, composite, range/multirange, enum, domain, RLS, and text-search paths
- [x] Supported static JSONPath subset
- [x] Catalog-visible roles, privileges, views, materialized views, and partitions
- [ ] Expand procedural-language coverage without loading it into the core hot path
- [ ] Refresh LISTEN/NOTIFY, cursor, two-phase, and advanced security breadth
- [ ] Complete explicit adapter documentation for FDW execution

## P3 — Optional modules and performance

**Goal:** optional capability cost is isolated and every optimization preserves P0 correctness.

- [x] Slim installable package with stable exports
- [x] Transaction metadata deduplication
- [x] COPY target metadata deduplication
- [x] Common hot-read relation/catalog deduplication
- [x] Cross-region response parity at SEA/MAD
- [x] WNAM/WEUR/APAC business-data read-replica experiment
- [ ] Current-line vector module consolidated gate
- [ ] GIS module after core/plugin decoupling
- [ ] Repeat multi-region measurements across dates/probes before any SLA claim
- [ ] Continue safe catalog hot-path materialization optimization
- [ ] Cold-start tiering and WASM loading measurements

## P4 — Explicit architecture boundaries

**Goal:** never market an architecture-excluded PostgreSQL server behavior as compatible.

- [x] Physical WAL and binary replication internals marked not applicable
- [x] PostgreSQL background process/filesystem behavior marked not applicable
- [x] Arbitrary native C extensions excluded; dedicated modules required
- [x] Physical execution-plan equivalence excluded from the compatibility contract
- [ ] Revisit an exclusion only when Cloudflare provides a safe equivalent primitive

## Product timeline

| Milestone | Outcome | Status |
|---|---|---:|
| `0.8.0` | Broad PostgreSQL/Web compatibility expansion | ✅ |
| `0.8.1-rc.1` | Package slimming | ✅ |
| `0.8.1-rc.2` | Common-path D1 operation reduction | ✅ |
| `0.8.1-rc.6` | Catalog/application performance evidence | ✅ |
| `0.8.1-rc.9` | Transaction metadata deduplication | ✅ |
| `0.8.1-rc.10` | COPY target metadata deduplication | ✅ |
| `0.8.1-rc.11` | COPY failed-transaction correctness closure | ✅ |
| `0.8.1-rc.12` | Fixed global primary/read-replica experiment | ✅ |
| `0.8.1-rc.13` | Common Cloudflare hot-read optimization | ✅ |
| `0.8.1-rc.14` | PostgreSQL `bool_or` / `bool_and` / `every` compatibility | ✅ |
| `0.8.1-rc.15` | Retained catalog validation and auth parameter-query repair | ✅ |
| `0.8.1-rc.17` | Nullable boolean and filtered array aggregate combinations | ✅ |
| `0.8.1-rc.18` | Retained catalog and prepared-result metadata hot-path consolidation | ✅ |
| `0.8.1-rc.19` | Prepared/ORM query-local metadata reuse | ✅ |
| `0.8.1-rc.20` | Nullable prepared JOIN and CASE ordering admission | ✅ |
| `0.8.2` | Retained Web/Auth/ORM/migration compatibility release | ✅ |
| `0.8.3` | Unified row-lock identity, retained catalog reconciliation and source-aware DML release | ✅ |
| Next stable line | Official-file refresh and remaining safe capability-proof families | 🟨 |

Documentation-only updates do not change an existing package identity. A new RC is created only when the product package changes.

The exhaustive official-file and command-family ledger is maintained in [TESTING.md](TESTING.md); performance baselines and optimization history are maintained independently in [PERFORMANCE.md](PERFORMANCE.md).
