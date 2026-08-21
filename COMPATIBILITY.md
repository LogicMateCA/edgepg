# EdgePG compatibility matrix

This is the public capability and development ledger. Every area is marked so future work can be planned without turning an untested feature into an implied promise.

For the exhaustive PostgreSQL 18.4 official-file inventory and all 183 SQL command families, see [TESTING.md](TESTING.md). Named built-ins and operators are listed in [FUNCTIONS.md](FUNCTIONS.md). This page tracks product capability stages rather than duplicating those ledgers.

| Mark | Meaning |
|---:|---|
| ✅ | Passed with retained evidence |
| 🟨 | Partial or actively expanding |
| ⬜ | Not tested / not started |
| ➖ | Not applicable to the Worker/D1 architecture |
| ⚠️ | Supported subset with explicit fail-closed boundaries |

## P0 — Web application correctness

| Capability | Status | Current result |
|---|---:|---|
| `SELECT`, parameters, ordering, limit/offset | ✅ | PostgreSQL result rows, fields, common type OIDs, and full auth/session parameter projections on retained catalogs |
| `INSERT` / `UPDATE` / `DELETE` | ✅ | Scalar, prepared, transactional, and common source-query forms |
| `RETURNING` | ✅ | Aliases, OLD/NEW transitions, bigint precision, zero-row metadata |
| Transactions | ✅ | BEGIN/COMMIT/ROLLBACK, failed state, disconnect release |
| Savepoints | ✅ | Rollback recovery and state restoration |
| Row and advisory locks | ✅ | Contention, NOWAIT, commit/rollback/disconnect release |
| Constraints | ✅ | Primary, unique, foreign key, CHECK, NOT NULL, deferred cases |
| Defaults and identity/sequences | ✅ | Transaction behavior and 64-bit sequence precision |
| Joins and subqueries | ✅ | LEFT/inner joins, scalar/correlated subqueries, cardinality errors |
| Web aggregates and GROUP BY | ✅ | Common `count`/`sum`/`avg`, nullable-expression boolean aggregates, JSON/array aggregation, nested COALESCE, FILTER, DISTINCT and PK functional dependency; the official `aggregates` file remains pending |
| CTE, union, recursive, window | ✅ | Common Web query shapes and bounded recursion; the official `window` file remains pending |
| JSON/JSONB | ✅ | Common operators, builders, aggregates, validation, result decoding |
| Arrays | ✅ | Constructors, casts, aggregates, multidimensional and bigint arrays |
| bigint/numeric | ✅ | Exact text transport outside JavaScript safe integer range |
| Temporal types | ✅ | date/time/timetz/timestamp/timestamptz/interval common paths |
| Schema migration | ✅ | Common table/index/view/constraint/rename/schema lifecycle |
| node-postgres Client/Pool | ✅ | Query, parameters, transaction, result, error/SQLSTATE |
| Client COPY | ✅ | COPY FROM STDIN/TO STDOUT, chunks, atomic commit/rollback, `22P02 → 25P02` failed-state recovery |
| PostgreSQL catalog discovery | ✅ | Common `pg_catalog` and `information_schema` consumers |
| PostgreSQL archive migration | ✅ | Standard `pg_dump -Fc` and fresh `pg_restore` paths |

## P0 framework matrix

| Framework | Status | Verified scope / remaining breadth |
|---|---:|---|
| node-postgres | ✅ | Client/Pool, SQL, parameters, JSON, transactions, errors |
| Drizzle ORM | ✅ | Schema, CRUD, filters, pagination, aggregates, JSON, transactions |
| Sequelize | ✅ | Common differential and live application paths |
| TypeORM | ✅ | Common differential and live application paths |
| Prisma | 🟨 | Live and interactive/concurrent transactions; wider native differential planned |
| Kysely | 🟨 | Common differential path; relation/concurrency breadth planned |
| Knex | 🟨 | Common live path; wider differential/concurrency planned |
| Objection.js | 🟨 | Common live path; wider differential/concurrency planned |
| MikroORM | 🟨 | Common live path; wider differential/concurrency planned |
| Slonik | 🟨 | Common live path; wider differential/concurrency planned |
| Auth.js PostgreSQL Adapter | ✅ | 21 reliability checks and session behavior |
| Better Auth + Hono | ✅ | Full email/password HTTP flow and rollback behavior |

## P1 — Operational and framework breadth

| Capability | Status | Current result / next target |
|---|---:|---|
| ORM/tool catalog introspection | ✅ | Common migrations and discovery |
| Sequence/identity catalog consistency | ✅ | Catalog rows and exact bigint values |
| Views and materialized views | ✅ | Lifecycle, reads, comments, transaction rollback |
| RLS policy lifecycle | ✅ | Create/alter/comment/drop and transaction behavior |
| Inheritance and common partition routing | ✅ | Catalog and row-routing cases |
| Retained in-place upgrades | ✅ | Exact rc.14→rc.15 same-D1/same-DO catalog validation and repair, plus archive restore paths |
| Full ORM native PostgreSQL differential | 🟨 | Complete per-framework matrix remains open |
| Multi-organization SaaS concurrency | 🟨 | Targeted gates passed; broader load matrix planned |
| OAuth/token-refresh concurrency | 🟨 | Application evidence exists; expanded stress planned |

## P2 — Advanced PostgreSQL semantics

| Capability | Status | Current result / boundary |
|---|---:|---|
| `MERGE` | ✅ | Common sources, actions, RETURNING, transactions, atomic errors |
| Composite/range/multirange/enum/domain | ✅ | Supported subsets preserve identity and result OIDs |
| JSONPath | ⚠️ | Supported static predicates pass; unsafe dynamic patterns fail closed |
| Text search | ✅ | Common `@@` predicates |
| Triggers and PL/pgSQL | 🟨 | Full capability entrypoint; core path remains slim and fails closed |
| Roles, grants, RLS, default privileges | ✅ | Observable compatibility layer and transaction behavior |
| LISTEN/NOTIFY and cursors | 🟨 | Supported targeted contract; breadth continues |
| Two-phase transactions | 🟨 | Supported DML contract; schema-changing variants fail closed |
| FDW | ⚠️ | Metadata/lifecycle supported; row execution requires an explicit adapter |

## P3 — Optional capabilities and performance

| Capability | Status | Current result / next target |
|---|---:|---|
| Vector module | 🟨 | Dedicated module exists; current-line consolidated gate planned |
| GIS module | ⬜ | Planned after plugin/core decoupling |
| Read accelerator | 🟨 | Real Cloudflare synthetic A/B and cross-region parity |
| Transaction metadata dedup | ✅ | Lower latency and fewer D1 operations; DO calls unchanged |
| COPY metadata dedup | ✅ | Lower latency and 50% fewer diagnostic D1 metadata calls |
| Retained catalog hot path | ✅ | Set-based owner initialization and physical-object discovery; catalog probe reduced from 3/7 to 1/1 D1 operations/statements |
| Package slimming | ✅ | Installed artifact reduced while exports remain compatible |
| Cold-start tiering | 🟨 | Additional WASM/capability loading measurements planned |
| Multi-region business-data benchmark | ✅ | WNAM/WEUR/APAC fixed-fixture primary/replica experiment completed; not an SLA |

## P4 — Architecture boundaries

| PostgreSQL server surface | Status | EdgePG position |
|---|---:|---|
| Physical WAL and binary replication internals | ➖ | Not applicable |
| PostgreSQL background VACUUM processes | ➖ | D1 owns physical storage maintenance |
| Server filesystem and server-side file COPY | ➖ | Client STDIN/STDOUT remains supported |
| Physical tablespace placement | ➖ | Catalog compatibility only |
| PostgreSQL backend process identity/layout | ➖ | Not applicable to isolates |
| Arbitrary native C extensions | ➖ | Dedicated EdgePG modules are required |
| Superuser and cluster administration | ➖ | Managed control-plane boundary |
| Physical execution-plan equivalence | ➖ | Results and errors are the compatibility contract |

## PostgreSQL official test inventory

PostgreSQL 18.4's retained inventory contains 231 scheduled regression files. The last complete applicability classification recorded:

| Classification | Count | Meaning |
|---|---:|---|
| Exact official pass | 38 | Unmodified SQL and expected output matched |
| Applicable prefix pass / backend-only tail excluded | 16 | Client-visible prefix matched; server C/backend tail excluded |
| Architecture boundary | 33 | Explicitly outside the dependency runtime |
| Pending current-engine classification | 144 | Must be assessed in later P1–P3 work |

This official-file count is intentionally separate from the Web P0 matrix. A simplified fixture is never counted as a complete official-file pass.

[Open the complete 231-file inventory →](TESTING.md#postgresql-184-official-regression-inventory)

## PostgreSQL command inventory

The generated PostgreSQL 18 command ledger contains 183 command families with retained local and Cloudflare golden coverage:

| Priority | Command families | Golden |
|---|---:|---:|
| P0 | 15 | 15 |
| P1 | 16 | 16 |
| P2 | 40 | 40 |
| P3 | 112 | 112 |

Command-family coverage confirms the supported command contract; it does not imply every grammar combination in every official regression file passes.

[Open all 183 command-family names →](TESTING.md#postgresql-command-family-ledger)
