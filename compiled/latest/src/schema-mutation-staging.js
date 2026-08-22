import{quoteCatalogIdentifier as r}from"./sql-quoting";async function i(a){const t=(await a.prepare(`SELECT name,sql FROM sqlite_master
    WHERE type='view' AND sql IS NOT NULL
      AND name IN ('pg_catalog__pg_attribute','information_schema__columns')
    ORDER BY CASE name WHEN 'pg_catalog__pg_attribute' THEN 0 ELSE 1 END`).all()).results;return{dropSql:[...t].reverse().map(e=>`DROP VIEW ${r(e.name)}`),restoreSql:t.map(e=>e.sql)}}export{i as stagedCatalogViewSqlForSchemaMutation};
