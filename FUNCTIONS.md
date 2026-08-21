# EdgePG function and operator coverage

This is the public, function-level companion to the [official regression and SQL command ledger](TESTING.md). A check means the named function or operator passed the stated PostgreSQL-compatible scenarios; it does **not** imply that the complete upstream regression file containing that function is green.

| Mark | Meaning |
|---:|---|
| ✅ | Passed with retained result, metadata, error, and transaction evidence |
| ⚠️ | A documented common subset passed; unsupported shapes fail closed |
| ➖ | PostgreSQL server-internal behavior is outside the Worker/D1 architecture |
| ⬜ | Not yet promoted to the named-function ledger |

## Aggregates

| Function | Status | Verified contract | Latest retained release |
|---|---:|---|---|
| `bool_or(boolean)` | ✅ | mixed true/false/NULL, all-NULL, empty input, `GROUP BY`, nullable `LEFT JOIN` expressions, prepared parameters, `FILTER`, `DISTINCT`, transaction, OID 16 | retained in `0.8.1-rc.19` |
| `bool_and(boolean)` | ✅ | same matrix as `bool_or`; PostgreSQL NULL/empty semantics and OID 16 | retained in `0.8.1-rc.19` |
| `every(boolean)` | ✅ | PostgreSQL synonym of `bool_and`, including NULL/empty and grouped forms | retained in `0.8.1-rc.19` |
| `count(*)`, `count(expr)` | ✅ | grouped, correlated scalar, empty input, cast to integer, bigint result metadata | retained in `0.8.1-rc.18` |
| `sum(...)`, `avg(...)` | ✅ | common grouped/window forms, integer/numeric result OIDs and NULL input | retained in `0.8.1-rc.18` |
| `array_agg(...)` | ✅ | ordered, `DISTINCT`, nested arrays, `FILTER` inside `COALESCE`, empty input/decode, dimensional validation and array OIDs | retained in `0.8.1-rc.18` |
| `json_agg(...)`, `jsonb_agg(...)` | ✅ | `ORDER BY`, `FILTER`, `DISTINCT`, correlated aggregates, empty fallback and OIDs 114/3802 | retained in `0.8.1-rc.18` |

The PostgreSQL `aggregates` official regression file remains in the pending whole-file ledger. The rows above are exact named-function claims, not a whole-file claim.

## JSON, JSONB and SQL/JSON

| Function/operator | Status | Verified contract |
|---|---:|---|
| `jsonb_build_object(...)` | ✅ | scalar and correlated object construction, aggregate composition, decoded object results |
| `jsonb_set(...)` | ✅ | create-missing true/false, update/rollback, JSONB OID 3802 |
| `json_each`, `jsonb_each` | ✅ | row expansion and result shape |
| `json_each_text`, `jsonb_each_text` | ✅ | text row expansion and metadata |
| `json_array_elements`, `jsonb_array_elements` | ✅ | array expansion and exact row counts |
| `JSON_VALUE` | ⚠️ | static paths and typed integer/text results; dynamic paths fail closed |
| `JSON_QUERY` | ⚠️ | static array/object results with JSON OID 114; dynamic paths fail closed |
| `JSON_EXISTS` | ⚠️ | static true/false predicates with boolean OID 16; dynamic paths fail closed |
| `->`, `->>`, `#>`, `#>>` | ✅ | object/array extraction, text vs JSON/JSONB result identity |
| `@>`, `<@`, `?`, `?|`, `?&` | ✅ | prepared containment/existence, NULL and missing-key behavior |
| JSONB `-`, `#-`, `||` | ⚠️ | safe key/path deletion and object merge; non-equivalent merge shapes fail closed |
| JSONPath `@?`, `@@` | ⚠️ | static numeric/string/boolean predicates; dynamic or regex-only paths fail closed with `0A000` |

## Arrays and records

| Function/operator | Status | Verified contract |
|---|---:|---|
| `ARRAY[...]` and `ARRAY(SELECT ...)` | ✅ | scalar, text, integer, bigint and multidimensional arrays; empty typed arrays |
| `cardinality(anyarray)` | ✅ | multidimensional element count and integer metadata |
| array casts | ✅ | prepared `integer[]`, `bigint[]`, `text[][]`; exact 64-bit values |
| row/composite constructors | ✅ | `ROW(...)`, whole-row values, duplicate field names and composite OID 2249/custom relation OIDs |
| array/domain validation | ✅ | ragged/dimension mismatch `2202E`; domain failure `23514`; no partial writes |

## Temporal and numeric functions

| Function/expression | Status | Verified contract |
|---|---:|---|
| `now()`, `CURRENT_TIMESTAMP` | ✅ | query expressions and retained default-expression semantics |
| `date_part(...)` | ✅ | float8 result OID 701 |
| `EXTRACT(...)` | ✅ | numeric result OID 1700 |
| `date_bin(...)` | ⚠️ | static interval/origin forms |
| `AT TIME ZONE` | ✅ | timestamp/timestamptz and timetz result identity; timetz OID 1266 |
| date/time arithmetic | ✅ | date + integer, timestamptz + interval, timestamp subtraction and boundary interval text |
| bigint/numeric casts | ✅ | exact values beyond JavaScript's safe integer range and numeric text precision |

## Catalog, identity and coordination functions

| Function/expression | Status | Verified contract |
|---|---:|---|
| `to_regclass(text)` | ✅ | qualified/unqualified, existing/missing, literal/prepared, NULL tests, regclass OID 2205 |
| `format_type(oid, typmod)` | ✅ | PostgreSQL catalog discovery and dump-introspection shapes |
| `array_to_string(...)` | ✅ | catalog arrays, `pg_catalog` qualification and escaped delimiters |
| `pg_get_indexdef(oid)` | ✅ | renamed/schema-moved, partial/unique and canonical index definitions |
| `pg_get_constraintdef(oid, boolean)` | ✅ | catalog/dump constraint discovery |
| `hashtext(text)` | ✅ | literal, prepared, column, Unicode, long text, NULL strictness, OID 23 |
| `pg_advisory_xact_lock(...)` | ✅ | bigint/two-int key spaces, contention, reentrancy, commit/rollback/disconnect release |
| `pg_try_advisory_xact_lock(...)` | ✅ | immediate acquisition result and transaction release |
| `CURRENT_USER`, `SESSION_USER`, `CURRENT_ROLE` | ✅ | projections, DML expressions and EXPLAIN-visible shapes |

## Text and predicate operators

| Operator | Status | Verified contract |
|---|---:|---|
| `LIKE`, `NOT LIKE`, `ILIKE`, `NOT ILIKE` | ✅ | ordinary predicates, prepared patterns, casts and partial-index predicates |
| PostgreSQL deparser operators `~~`, `!~~`, `~~*`, `!~~*` | ✅ | native pg_restore/index DDL path, mapped to the corresponding LIKE family |
| `SIMILAR TO`, `NOT SIMILAR TO` | ⚠️ | LIKE-compatible dynamic patterns; unsupported regex-only dynamic patterns fail closed |
| text-search `@@` | ✅ | common text-search predicate and disambiguation from JSONPath `@@` |

## Explicit boundaries

- Physical WAL, backend-process, filesystem, tablespace-placement and arbitrary native C-extension functions are architecture boundaries rather than Web compatibility targets.
- PL/pgSQL parsing is available through the explicit `edgepg/full` or `edgepg/plpgsql` capability. The slim core entry fails closed when that parser is not loaded.
- A function is added here only after a retained exact gate. Broader built-in discovery remains part of the P1/P2 official-file refresh.
