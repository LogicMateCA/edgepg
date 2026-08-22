# EdgePG test and command coverage

This page separates three different claims that are easy to confuse:

1. **Official PostgreSQL regression files** — unmodified PostgreSQL 18.4 SQL and expected output.
2. **PostgreSQL command families** — the observable contract for each documented SQL command family.
3. **Web application gates** — protocols, transactions, ORMs, authentication libraries, migration tools, and backup/restore paths used by applications.

A small fixture is never counted as a complete official-file pass. A command-family golden means the documented EdgePG contract and its fail-closed boundary passed; it does not mean every grammar permutation in the corresponding PostgreSQL manual page is implemented.

Current public release: `edgepg@0.8.5`. Function-level results are maintained separately in [FUNCTIONS.md](FUNCTIONS.md).

## How results are compared

Applicable differential tests compare more than returned values:

| Contract surface | Compared result |
|---|---|
| Rows | Order, NULL behavior, exact bigint/numeric text, arrays and JSON values |
| RowDescription | Field names, PostgreSQL type OIDs, duplicate names and zero-row metadata |
| Command result | Command tag and row count |
| Errors | SQLSTATE, message identity and failed-transaction behavior |
| Transactions | Visibility, atomicity, locks, savepoints, commit, rollback and disconnect release |
| Catalog/tooling | `pg_catalog`, `information_schema`, `COPY`, `pg_dump -Fc` and `pg_restore` |

## PostgreSQL 18.4 official regression inventory

Source: PostgreSQL `REL_18_STABLE` default `parallel_schedule`. The retained applicability ledger contains exactly **231 scheduled files**.

| Classification | Files | Meaning |
|---|---:|---|
| ✅ Exact official pass | 38 | Unmodified SQL and expected output matched PostgreSQL 18.4 |
| ⚠️ Applicable prefix passed | 16 | Client-visible prefix matched; backend/C-only tail is excluded |
| ➖ Architecture boundary | 33 | Requires server internals that do not map to a Worker/D1 dependency runtime |
| 🟨 Pending current-engine classification | 144 | Still requires current-engine official-file review; no pass is implied |
| **Total** | **231** | Complete scheduled inventory |

The inventory classification was recorded against an earlier `0.8.0` engine checkpoint. Later candidates add substantial Web P0 coverage, but the counts are not increased until the complete official file is rerun and its output is classified.

<details>
<summary><strong>38 exact official passes</strong></summary>

`boolean`, `char`, `name`, `varchar`, `text`, `int2`, `int4`, `int8`, `oid`, `bit`, `numeric`, `enum`, `money`, `regproc`, `md5`, `numerology`, `point`, `lseg`, `line`, `path`, `circle`, `date`, `time`, `timetz`, `multirangetypes`, `comments`, `unicode`, `euc_kr`, `copyselect`, `create_schema`, `drop_if_exists`, `roleattributes`, `select_implicit`, `select_having`, `delete`, `async`, `functional_deps`, `prepare`.

</details>

<details>
<summary><strong>16 applicable-prefix passes</strong></summary>

`float4`, `float8`, `txid`, `uuid`, `rangetypes`, `pg_lsn`, `strings`, `box`, `polygon`, `macaddr`, `macaddr8`, `regex`, `type_sanity`, `select_distinct_on`, `guc`, `limit`.

</details>

<details>
<summary><strong>33 architecture-boundary files</strong></summary>

`misc_sanity`, `mvcc`, `stats_import`, `copyencoding`, `create_function_c`, `create_am`, `sanity_check`, `prepared_xacts`, `init_privs`, `security_label`, `lock`, `replica_identity`, `tablesample`, `join_hash`, `brin_bloom`, `brin_multi`, `dbsize`, `tidscan`, `tidrangescan`, `amutils`, `select_parallel`, `write_parallel`, `vacuum_parallel`, `maintain_every`, `publication`, `subscription`, `bitmapops`, `combocid`, `indirect_toast`, `numa`, `compression`, `compression_pglz`, `tablespace`.

These files are not silently discarded. Client-visible equivalents are tested separately where they exist, while physical WAL, backend processes, server filesystems, parallel backend execution, native access methods and physical storage placement remain explicit architecture boundaries.

</details>

<details>
<summary><strong>144 pending current-engine classifications</strong></summary>

`test_setup`, `timestamp`, `timestamptz`, `interval`, `inet`, `geometry`, `horology`, `tstypes`, `opr_sanity`, `expressions`, `xid`, `database`, `encoding`, `copy`, `copydml`, `insert`, `insert_conflict`, `create_misc`, `create_operator`, `create_procedure`, `create_table`, `create_type`, `create_index`, `create_index_spgist`, `create_view`, `index_including`, `index_including_gist`, `create_aggregate`, `create_function_sql`, `create_cast`, `constraints`, `triggers`, `select`, `inherit`, `typed_table`, `vacuum`, `updatable_views`, `hash_func`, `errors`, `infinite_recurse`, `select_into`, `select_distinct`, `subselect`, `union`, `case`, `join`, `aggregates`, `transactions`, `random`, `portals`, `arrays`, `btree_index`, `hash_index`, `update`, `namespace`, `brin`, `gin`, `gist`, `spgist`, `privileges`, `collate`, `matview`, `rowsecurity`, `object_address`, `groupingsets`, `drop_operator`, `password`, `identity`, `generated_stored`, `create_table_like`, `alter_generic`, `alter_operator`, `misc`, `merge`, `misc_functions`, `sysviews`, `tsrf`, `tid`, `collate.utf8`, `collate.icu.utf8`, `incremental_sort`, `create_role`, `without_overlaps`, `generated_virtual`, `rules`, `psql`, `psql_crosstab`, `psql_pipeline`, `stats_ext`, `collate.linux.utf8`, `collate.windows.win1252`, `select_views`, `portals_p2`, `foreign_key`, `cluster`, `dependency`, `tsearch`, `tsdicts`, `foreign_data`, `window`, `xmlmap`, `advisory_lock`, `equivclass`, `json`, `jsonb`, `json_encoding`, `jsonpath`, `jsonpath_encoding`, `jsonb_jsonpath`, `sqljson`, `sqljson_queryfuncs`, `sqljson_jsontable`, `plancache`, `plpgsql`, `copy2`, `temp`, `domain`, `rangefuncs`, `conversion`, `truncate`, `alter_table`, `sequence`, `polymorphism`, `rowtypes`, `returning`, `largeobject`, `with`, `xml`, `partition_join`, `partition_prune`, `reloptions`, `hash_part`, `indexing`, `partition_aggregate`, `partition_info`, `tuplesort`, `explain`, `memoize`, `stats`, `predicate`, `oidjoins`, `event_trigger`, `event_trigger_login`, `fast_default`.

Many individual semantics from these files already pass Web P0 gates. They remain pending here because a partial scenario does not convert an entire official file to green.

</details>

## PostgreSQL command-family ledger

The PostgreSQL 18 documentation lists **183 SQL command families**. EdgePG maintains a golden contract for every family, including either compatible behavior or an exact fail-closed/architecture boundary.

| Priority | Families | Golden | Product stage |
|---|---:|---:|---|
| P0 | 15 | 15 | Daily Web SQL and transaction essentials |
| P1 | 16 | 16 | Common migration, schema and operational commands |
| P2 | 40 | 40 | Advanced transaction, security, procedural and tooling commands |
| P3 | 112 | 112 | Broad PostgreSQL administration and extension-facing surface |
| **Total** | **183** | **183** | Command-family contract, not all grammar combinations |

<details open>
<summary><strong>P0 — 15 daily command families</strong></summary>

`BEGIN`, `COMMIT`, `CREATE INDEX`, `CREATE SCHEMA`, `CREATE TABLE`, `DELETE`, `DROP INDEX`, `DROP SCHEMA`, `DROP TABLE`, `INSERT`, `ROLLBACK`, `SELECT`, `SHOW`, `UPDATE`, `VALUES`.

</details>

<details>
<summary><strong>P1 — 16 common operational command families</strong></summary>

`ALTER INDEX`, `ALTER SEQUENCE`, `ALTER TABLE`, `CREATE SEQUENCE`, `CREATE TABLE AS`, `CREATE VIEW`, `DROP SEQUENCE`, `DROP VIEW`, `EXPLAIN`, `MERGE`, `RESET`, `SAVEPOINT`, `SELECT INTO`, `SET`, `START TRANSACTION`, `TRUNCATE`.

</details>

<details>
<summary><strong>P2 — 40 advanced Web/operational command families</strong></summary>

`ABORT`, `ANALYZE`, `CALL`, `CLOSE`, `COMMENT`, `COMMIT PREPARED`, `COPY`, `CREATE DOMAIN`, `CREATE MATERIALIZED VIEW`, `CREATE POLICY`, `CREATE ROLE`, `CREATE TYPE`, `DEALLOCATE`, `DECLARE`, `DISCARD`, `DO`, `DROP DOMAIN`, `DROP MATERIALIZED VIEW`, `DROP POLICY`, `DROP ROLE`, `DROP TYPE`, `END`, `EXECUTE`, `FETCH`, `GRANT`, `LISTEN`, `LOCK`, `MOVE`, `NOTIFY`, `PREPARE`, `PREPARE TRANSACTION`, `REFRESH MATERIALIZED VIEW`, `RELEASE SAVEPOINT`, `REVOKE`, `ROLLBACK PREPARED`, `ROLLBACK TO SAVEPOINT`, `SET CONSTRAINTS`, `SET TRANSACTION`, `UNLISTEN`, `VACUUM`.

</details>

<details>
<summary><strong>P3 — 112 broad PostgreSQL command families</strong></summary>

`ALTER AGGREGATE`, `ALTER COLLATION`, `ALTER CONVERSION`, `ALTER DATABASE`, `ALTER DEFAULT PRIVILEGES`, `ALTER DOMAIN`, `ALTER EVENT TRIGGER`, `ALTER EXTENSION`, `ALTER FOREIGN DATA WRAPPER`, `ALTER FOREIGN TABLE`, `ALTER FUNCTION`, `ALTER GROUP`, `ALTER LANGUAGE`, `ALTER LARGE OBJECT`, `ALTER MATERIALIZED VIEW`, `ALTER OPERATOR`, `ALTER OPERATOR CLASS`, `ALTER OPERATOR FAMILY`, `ALTER POLICY`, `ALTER PROCEDURE`, `ALTER PUBLICATION`, `ALTER ROLE`, `ALTER ROUTINE`, `ALTER RULE`, `ALTER SCHEMA`, `ALTER SERVER`, `ALTER STATISTICS`, `ALTER SUBSCRIPTION`, `ALTER SYSTEM`, `ALTER TABLESPACE`, `ALTER TEXT SEARCH CONFIGURATION`, `ALTER TEXT SEARCH DICTIONARY`, `ALTER TEXT SEARCH PARSER`, `ALTER TEXT SEARCH TEMPLATE`, `ALTER TRIGGER`, `ALTER TYPE`, `ALTER USER`, `ALTER USER MAPPING`, `ALTER VIEW`, `CHECKPOINT`, `CLUSTER`, `CREATE ACCESS METHOD`, `CREATE AGGREGATE`, `CREATE CAST`, `CREATE COLLATION`, `CREATE CONVERSION`, `CREATE DATABASE`, `CREATE EVENT TRIGGER`, `CREATE EXTENSION`, `CREATE FOREIGN DATA WRAPPER`, `CREATE FOREIGN TABLE`, `CREATE FUNCTION`, `CREATE GROUP`, `CREATE LANGUAGE`, `CREATE OPERATOR`, `CREATE OPERATOR CLASS`, `CREATE OPERATOR FAMILY`, `CREATE PROCEDURE`, `CREATE PUBLICATION`, `CREATE RULE`, `CREATE SERVER`, `CREATE STATISTICS`, `CREATE SUBSCRIPTION`, `CREATE TABLESPACE`, `CREATE TEXT SEARCH CONFIGURATION`, `CREATE TEXT SEARCH DICTIONARY`, `CREATE TEXT SEARCH PARSER`, `CREATE TEXT SEARCH TEMPLATE`, `CREATE TRANSFORM`, `CREATE TRIGGER`, `CREATE USER`, `CREATE USER MAPPING`, `DROP ACCESS METHOD`, `DROP AGGREGATE`, `DROP CAST`, `DROP COLLATION`, `DROP CONVERSION`, `DROP DATABASE`, `DROP EVENT TRIGGER`, `DROP EXTENSION`, `DROP FOREIGN DATA WRAPPER`, `DROP FOREIGN TABLE`, `DROP FUNCTION`, `DROP GROUP`, `DROP LANGUAGE`, `DROP OPERATOR`, `DROP OPERATOR CLASS`, `DROP OPERATOR FAMILY`, `DROP OWNED`, `DROP PROCEDURE`, `DROP PUBLICATION`, `DROP ROUTINE`, `DROP RULE`, `DROP SERVER`, `DROP STATISTICS`, `DROP SUBSCRIPTION`, `DROP TABLESPACE`, `DROP TEXT SEARCH CONFIGURATION`, `DROP TEXT SEARCH DICTIONARY`, `DROP TEXT SEARCH PARSER`, `DROP TEXT SEARCH TEMPLATE`, `DROP TRANSFORM`, `DROP TRIGGER`, `DROP USER`, `DROP USER MAPPING`, `IMPORT FOREIGN SCHEMA`, `LOAD`, `REASSIGN OWNED`, `REINDEX`, `SECURITY LABEL`, `SET ROLE`, `SET SESSION AUTHORIZATION`.

</details>

## Web application and tooling gates

| Gate collection | Status | Covered contract |
|---|---:|---|
| node-postgres | ✅ | Client/Pool, prepared parameters, rows, fields/OIDs, errors and transactions |
| CRUD and relational SQL | ✅ | Reads, writes, RETURNING, joins, subqueries and common Web aggregate/CTE/set/window shapes |
| Concurrency | ✅ | Row/advisory locks, NOWAIT, commit/rollback/disconnect release and failed state |
| Types | ✅ | JSON/JSONB, arrays, bigint/numeric precision and temporal types |
| Migration/catalog | ✅ | Common schema DDL, constraints, sequences, views, RLS, `pg_catalog` and `information_schema` |
| ORM | ✅ / 🟨 | Drizzle, Sequelize and TypeORM common paths passed; wider Prisma/Kysely/Knex matrices continue |
| Authentication | ✅ | Auth.js PostgreSQL Adapter and Better Auth application flows |
| COPY/PGWire | ✅ | 53/53 PGWire tests plus independent chunked commit and atomic failure rollback |
| Backup/restore | ✅ | Standard PostgreSQL 18 `pg_dump -Fc` and isolated fresh `pg_restore` paths |
| Full server internals | ➖ | WAL, backend processes, physical tablespaces, server files and arbitrary C extensions |

## 0.8.5 final release gate

- Exact TGZ `61a5c6681d0e0340f2442076d52921c946496e05fa7496578473005840a615fd`; formal full-capability build `ff06333aab920deb0f62a14da21385f6d22f26b526d4dbc79591c17b477589f2`.
- Real Cloudflare DROP专项 `2.209s`, ADD rollback专项 `17.082s`, and complete retained two-Worker gate passed; complete-gate ADD rollback measured `4.936s`.
- TRIGGER USER, role bootstrap, LIKE/typed/lock/DML/Auth/ORM/RPC/concurrency, restart persistence and cleanup passed.

## 0.8.4 final release gate

- Exact TGZ `d0685e29a1d58028ad31918fa1601f4c6cb43c4092fca925a0ce5e82768a8435`; formal full-capability Database Worker build `05ec991fdb429a3e3424cdff3945406daf479e41553da0c0d7fae7db3f78550a`.
- Twelve official root clusters and 46/46 official-gap cases passed locally; exact package install/exports and customer Worker dry run passed.
- Real Cloudflare retained two-Worker LIKE INCLUDING ALL, typed tables, catalog/restart, rules, NULL ordering and existing lock/DML baselines passed.
- Independent DISABLE/ENABLE TRIGGER ALL requests and restart returned ALTER TABLE; unrelated managed trigger remained functional.
- Better Auth 1.7, Auth.js, Drizzle, Prisma, node-postgres, SQLSTATE, RPC limits, concurrency and cleanup passed.

## 0.8.3 final release gate

- Exact artifact identity: product `5a0afa35f6e0892145b03e2fc8a02f1b22d0d8b8`, TGZ SHA-256 `1266a3b0aafcd13b2fbb1c517c729771bc2059f69b40bdaf37326c2dff7ab61f`, source fingerprint `af2c85c1c78fe01c3c5fa455207e405522932b192aa9787539635894a344df04`.
- Real Cloudflare rc.20→0.8.3 retained upgrade, two application Workers, cross-session transaction-created relation and `information_schema.columns` visibility, plus restart persistence passed.
- Ordinary, joined, non-primary-key, composite-primary-key and duplicate no-primary-key row locks shared one namespace with prepared UPDATE/DELETE; `NOWAIT` returned `55P03` and rollback, commit and real closeSession released locks.
- `FOR UPDATE OF` alias scoping passed; unsupported outer-join locking returned fail-closed `0A000`.
- Explicit-transaction `UPDATE ... FROM` and `DELETE ... USING` rollback/commit and source-column RETURNING OIDs `[23,25,23,23]` passed.
- Retained CHECK no-op/enforcement, stale `pg_index`/`pg_indexes` repair, Better Auth 1.7, Auth.js, Drizzle, Prisma, node-postgres, migration, RPC, Connector and concurrency passed.
- Temporary Workers, D1, Durable Objects and R2 resources were removed and API absence confirmed.

## 0.8.2 final release gate

- Worker package `1114/1114`; dependency core, pack/install/exports and customer Worker dry run passed.
- PostgreSQL 18.4 and local workerd combination matrix `48/48`.
- Real Cloudflare same-isolate retained gate and independent two-Worker All2CFDatabase retained gate passed.
- Better Auth 1.7 HTTP lifecycle, Auth.js PostgreSQL Adapter, Drizzle 0.45.2, Prisma 7.8 and node-postgres 8.22 retained upgrades passed.
- Original four-row migration rollback/commit, NOT NULL, unique index, `23505`, restart persistence, RPC limits, Connector and concurrency passed.
- Temporary Workers, D1, Durable Objects and R2 resources were removed and API absence confirmed.

## rc.20 affected release gate

| Gate | Result | Exact scope |
|---|---:|---|
| Nullable organization lookup | ✅ | Empty/hit, `$2` NULL/non-NULL, archived exclusion, CASE priority, repeated same session, OIDs 25/25 |
| Worker package | ✅ 1104/1104 | Nullable join/order, prepared/Auth, boolean aggregate and domain/range/multirange regressions |
| Installed package / Drizzle | ✅ | Exact TGZ, exports, customer Worker dry run and unchanged business source |
| Service Binding / Connector | ✅ | Local, isolated Cloudflare and retained production exact SQL; transaction, `42P01`, limits, concurrency and PGWire |
| COPY atomicity | ✅ | 4,000 committed rows; injected failure rolled back to zero |
| Cleanup | ✅ | Isolated Workers, D1, R2 and retained probe removed |

The rc.20 fix adds JOIN to the existing builtin-cast bounded SELECT admission. It adds no SQL/application special case and does not weaken unsupported-shape fail-closed behavior.

## rc.19 affected release gate

| Gate | Result | Exact scope |
|---|---:|---|
| Worker package | ✅ 1103/1103 | Full package plus prepared-result, auth parameter, domain, range and multirange scenarios |
| Installed package / Drizzle | ✅ | Exact TGZ, exports, customer Worker dry run and Drizzle-shaped workload with unchanged business source |
| Service Binding / Connector | ✅ | Prepared/Auth reads, result OIDs, transaction, `42P01`, RPC limits, concurrency and PGWire |
| Retained production probe | ✅ | Exact identity, 23 public tables, 20 prepared catalog reads, boolean aggregates/OIDs, read-only transaction and `42P01` |
| COPY atomicity | ✅ | 4,000 committed rows in two chunks; injected failure rolled back to zero |
| Cleanup | ✅ | Isolated Workers, D1, R2 and retained probe removed and API absence confirmed |

The rc.19 gate adds only query-local metadata reuse. No cross-request cache was added; invalidation, transaction, lock, SQLSTATE and RPC-limit behavior remain unchanged.

## rc.18 affected release gate

| Gate | Result | Exact scope |
|---|---:|---|
| Role/schema targeted | ✅ 13/13 | Existing owner preservation, catalog-only relations, schema moves, quoted identifiers and missing-catalog behavior |
| Affected / full Worker | ✅ | `116/116`; `1100/1100` |
| Exact package and Worker | ✅ | reproducible TGZ, fresh install/exports, TypeScript and customer Worker dry run |
| COPY regression | ✅ | 4,000 committed rows; injected failure rolled back to zero |
| Service Binding / Connector | ✅ | query metadata, transaction, Auth, SQLSTATE, limits, concurrency and PGWire |
| Retained production probe | ✅ | exact identity, database/schema/user, 23 public tables, boolean aggregates/OID 16, read-only transaction and `42P01` |
| Cleanup | ✅ | isolated Workers, D1 and R2 removed and API absence confirmed |

The rc.18 gate adds no cross-request result cache. Transaction, lock, SQLSTATE, RPC-limit and storage architecture semantics are unchanged.

## rc.17 affected release gate

| Gate | Result | Exact scope |
|---|---:|---|
| PostgreSQL 18.4 oracle | ✅ | auth-style `bool_or` plus `array_agg DISTINCT FILTER`, empty/hit/no-child |
| Retained-equivalent shape | ✅ | physical table without inline PK; EdgePG primary-key catalog metadata only |
| Boolean aggregate matrix | ✅ | true/false/NULL, all-NULL, empty, grouped, LEFT JOIN, prepared, FILTER, DISTINCT, OID 16 |
| Array aggregate combination | ✅ | nested `COALESCE`, DISTINCT/FILTER placement, empty `{}` decode, OID 1009 |
| Targeted / Worker package | ✅ | `3/3`; `1096/1096` |
| Exact package and Worker | ✅ | fresh install, Wrangler dry run, local workerd D1/DO |
| Independent Service Binding | ✅ | local and isolated real Cloudflare; query, transaction, Auth, SQLSTATE, limits, concurrency, Connector |
| Formal production probe | ✅ | exact retained Database Worker identity; three consecutive auth-style probes |
| Cleanup | ✅ | isolated Workers, D1 and R2 removed and absence confirmed |

The rc.17 gate does not claim direct runtime `Client.copyRows` correctness. That historical path committed zero rows in both exact rc.15 and rc.17; Connector/PGWire COPY is a separate verified surface.

## rc.15 affected release gate

| Layer | Result | Scope |
|---|---:|---|
| Exact retained upgrade | ✅ | Same D1/DO: rc.14 failure reproduced after cold restart, then rc.15 in-place repair without rebuilding persistence |
| Auth parameter queries | ✅ | Full session projection `WHERE token=$1`; account projection `WHERE account_id=$1 AND provider_id=$2`; empty and hit rows |
| Result metadata | ✅ | Nullable text OID 25, `timestamptz` OID 1184, prepared values and same-session recovery |
| Catalog regression | ✅ 43/43 | Physical PRAGMA validation, attnums, types, defaults, not-null and retained JSON repair |
| Worker package | ✅ 1094/1094 | Exact package regression plus real Better Auth and Drizzle lifecycle gates |
| Production Service Binding | ✅ | Exact identity, `openSession`, auth queries, boolean OID 16, read-only transaction, `42P01` recovery, 8 concurrent clients |
| Cleanup | ✅ | Temporary production probe deleted and API absence confirmed |

The rc.15 gate does not claim that every malformed user-created catalog state is recoverable. If validation still fails after the bounded repair, the query fails closed with SQLSTATE `XX000`.

## rc.14 affected release gate

| Layer | Result | Scope |
|---|---:|---|
| PostgreSQL 18.4 oracle | ✅ | `bool_or`, `bool_and`, `every`; mixed/NULL/empty, grouping, nullable join, prepared, `FILTER`, `DISTINCT` |
| Targeted runtime | ✅ 2/2 | Exact production-shaped `VALUES`, aliases, OID 16, explicit transaction |
| Transaction regression | ✅ 54/54 | No regression in transaction and failed-state behavior |
| Worker compiler | ✅ 19/19 | Real workerd compiler/runtime cases |
| Installed package | ✅ | Exact TGZ identity and all public entrypoint imports |
| Service Binding / production probe | ✅ | Function semantics, metadata, `42P01`, same-session recovery |

This closes the named boolean-aggregate defect. The complete PostgreSQL `aggregates` regression file remains pending because unrelated aggregate grammar and server behaviors have not all been promoted.

## Named functions and operators

The function ledger tracks exact names and boundaries for aggregates, JSON/JSONB, arrays, temporal expressions, catalog functions, advisory locks, LIKE/SIMILAR predicates and PostgreSQL deparser operators.

[Open the function and operator checklist →](FUNCTIONS.md)

See [COMPATIBILITY.md](COMPATIBILITY.md) for the P0–P4 product ledger and [PERFORMANCE.md](PERFORMANCE.md) for daily workload measurements.
