# EdgePG test and command coverage

This page separates three different claims that are easy to confuse:

1. **Official PostgreSQL regression files** — unmodified PostgreSQL 18.4 SQL and expected output.
2. **PostgreSQL command families** — the observable contract for each documented SQL command family.
3. **Web application gates** — protocols, transactions, ORMs, authentication libraries, migration tools, and backup/restore paths used by applications.

A small fixture is never counted as a complete official-file pass. A command-family golden means the documented EdgePG contract and its fail-closed boundary passed; it does not mean every grammar permutation in the corresponding PostgreSQL manual page is implemented.

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
| CRUD and relational SQL | ✅ | Reads, writes, RETURNING, joins, subqueries, aggregates, CTEs, set operations and windows |
| Concurrency | ✅ | Row/advisory locks, NOWAIT, commit/rollback/disconnect release and failed state |
| Types | ✅ | JSON/JSONB, arrays, bigint/numeric precision and temporal types |
| Migration/catalog | ✅ | Common schema DDL, constraints, sequences, views, RLS, `pg_catalog` and `information_schema` |
| ORM | ✅ / 🟨 | Drizzle, Sequelize and TypeORM common paths passed; wider Prisma/Kysely/Knex matrices continue |
| Authentication | ✅ | Auth.js PostgreSQL Adapter and Better Auth application flows |
| COPY/PGWire | ✅ | 53/53 PGWire tests plus independent chunked commit and atomic failure rollback |
| Backup/restore | ✅ | Standard PostgreSQL 18 `pg_dump -Fc` and isolated fresh `pg_restore` paths |
| Full server internals | ➖ | WAL, backend processes, physical tablespaces, server files and arbitrary C extensions |

See [COMPATIBILITY.md](COMPATIBILITY.md) for the P0–P4 product ledger and [PERFORMANCE.md](PERFORMANCE.md) for daily workload measurements.
