import{quoteCatalogIdentifier as Oe}from"./sql-quoting";import{ensureRoleSchema as K}from"./roles";import{ensureCustomTypeCatalogSchema as ye}from"./custom-types";import{ensureRowSecuritySchema as Q}from"./row-security";import{ensureTableConstraintSchema as re}from"./table-constraints";import{ensureMaterializedViewSchema as Ce}from"./materialized-views";import{ensureEventTriggerSchema as be,pgEventTriggerDependUnionSql as He,pgEventTriggerSharedDependUnionSql as Re,pgEventTriggerViewSql as je}from"./event-triggers";import{compactViewDefinition as le}from"./view-definitions";import{ensureDefaultPrivilegeSchema as fe}from"./default-privileges";import{ensureAggregateCatalogSchema as he}from"./aggregates";import{ensureOperatorTypeCatalogSchema as Ie,operatorTypeCatalogViewSql as We}from"./operator-types";import{ensureCollationSchema as De}from"./collations";import{ensureTextSearchCatalogSchema as Ue,textSearchCatalogViewSql as we}from"./text-search";import{conversionCatalogViewSql as ve,conversionDependencyUnionSql as Me,conversionSharedDependViewSql as Fe,ensureConversionCatalogSchema as $e}from"./conversions";import{ensureSequenceDefaultsSchema as pe,ensureSequenceSchema as ce}from"./sequences";import{d1CacheKey as f}from"./d1-cache-key";import{PG18_TYPE_IO_CATALOG_ROWS as xe,PG18_TYPE_IO_PROC_ROWS as Xe}from"./postgres-builtins";const X=32,F=3e8,ge=6e8,Z=6e4,Be=12e4,Je=125e3,qe=50,Ne=`CREATE INDEX IF NOT EXISTS __edgepg_pg_tables_table_name
  ON __edgepg_pg_tables(table_name, schema_name)`,ee=`CREATE TABLE IF NOT EXISTS __edgepg_pg_objects (
  phase TEXT NOT NULL CHECK (phase IN ('pre_data', 'post_data')),
  kind TEXT NOT NULL,
  schema_name TEXT NOT NULL DEFAULT '',
  object_name TEXT NOT NULL,
  relation_oid INTEGER,
  relation_natts INTEGER NOT NULL DEFAULT 0,
  owner_name TEXT NOT NULL DEFAULT 'edgepg',
  definition TEXT NOT NULL,
  view_definition TEXT,
  compact_view_definition TEXT,
  relation_pg_types_json TEXT NOT NULL DEFAULT '[]',
  relation_collations_json TEXT NOT NULL DEFAULT '[]',
  dependencies_json TEXT NOT NULL DEFAULT '[]',
  routine_dependencies_json TEXT NOT NULL DEFAULT '[]',
  reloptions_json TEXT NOT NULL DEFAULT '[]',
  ordinal INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (phase, kind, schema_name, object_name)
)`,h=new WeakSet,H=new WeakMap,u=new WeakSet,A=new WeakSet,L=new WeakSet,R=new WeakMap,$=new WeakMap;function kn(e){const n=f(e);return A.has(n)&&L.has(n)}async function Ge(e,n={}){const t=f(e);if(A.has(t)){if(!n.validate&&G(R,t))return;if(await B(e,"__edgepg_pg_tables")){R.set(t,Date.now());return}q(e)}if(await Ye(e)){A.add(t),R.set(t,Date.now());return}if(await B(e,"__edgepg_pg_tables")){await ke(e,{views:!1}),A.add(t),R.set(t,Date.now());return}n.roleSchemaReady||await K(e),await re(e),await e.batch([e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_pg_tables (
      relation_oid INTEGER UNIQUE,
      schema_name TEXT NOT NULL,
      table_name TEXT NOT NULL,
      physical_name TEXT NOT NULL UNIQUE,
      definition TEXT NOT NULL,
      persistence TEXT NOT NULL DEFAULT 'permanent',
      columns_json TEXT NOT NULL,
      pg_types_json TEXT NOT NULL,
      current_columns_json TEXT,
      current_pg_types_json TEXT,
      current_attnums_json TEXT,
      max_attnum INTEGER NOT NULL DEFAULT 0,
      current_not_null_json TEXT,
      current_defaults_json TEXT,
      generated_columns_json TEXT NOT NULL DEFAULT '[]',
      export_key_json TEXT NOT NULL DEFAULT '[]',
      reloptions_json TEXT NOT NULL DEFAULT '[]',
      replica_identity TEXT NOT NULL DEFAULT 'd',
      foreign_server_name TEXT,
      foreign_options_json TEXT NOT NULL DEFAULT '[]',
      foreign_column_options_json TEXT NOT NULL DEFAULT '{}',
      alterations_json TEXT NOT NULL DEFAULT '[]',
      shape_changes_json TEXT NOT NULL DEFAULT '[]',
      ordinal INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (schema_name, table_name)
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_oid_allocator (
      id INTEGER PRIMARY KEY CHECK(id=1), next_oid INTEGER NOT NULL)`),e.prepare(`INSERT OR IGNORE INTO __edgepg_oid_allocator(id,next_oid)
      VALUES (1, COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384))`),e.prepare(`UPDATE __edgepg_oid_allocator SET next_oid=MAX(next_oid,
      COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384)) WHERE id=1`),e.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_pg_tables_relation_oid
      ON __edgepg_pg_tables(relation_oid)`),e.prepare(Ne),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_table_inheritance (
      child_physical_name TEXT NOT NULL,
      parent_physical_name TEXT NOT NULL,
      child_schema_name TEXT NOT NULL,
      child_table_name TEXT NOT NULL,
      parent_schema_name TEXT NOT NULL,
      parent_table_name TEXT NOT NULL,
      inherited_columns_json TEXT NOT NULL,
      local_columns_json TEXT NOT NULL,
      ordinal INTEGER NOT NULL,
      PRIMARY KEY(child_physical_name,parent_physical_name)
    )`),e.prepare(`CREATE INDEX IF NOT EXISTS __edgepg_table_inheritance_parent
      ON __edgepg_table_inheritance(parent_physical_name,ordinal)`),e.prepare(`CREATE TRIGGER IF NOT EXISTS __edgepg_pg_tables_assign_oid
      AFTER INSERT ON __edgepg_pg_tables WHEN NEW.relation_oid IS NULL BEGIN
        UPDATE __edgepg_pg_tables SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
          WHERE schema_name=NEW.schema_name AND table_name=NEW.table_name;
        UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1;
      END`),...k(e,"postgres-catalog-table-storage")]),A.add(t),R.set(t,Date.now())}async function Pn(e,n={}){const t=f(e);if(L.has(t)){if(!n.validate&&G($,t))return;if(await J(e)){C(t);return}q(e)}if(u.has(t)||await ne(e)){u.add(t),A.add(t),L.add(t),C(t);return}await Ge(e,n),await ze(e),L.add(t),C(t)}async function ke(e,n={}){const t=f(e),a=n.views!==!1;if(!(a&&h.has(t)&&!n.validate&&Date.now()-(H.get(t)||0)<Z)&&!(!a&&u.has(t)&&!n.validate&&G($,t))){if(!n.validate&&a&&await me(e)){h.add(t),H.set(t,Date.now()),u.add(t),A.add(t),L.add(t),C(t);return}if(!n.validate&&!a&&await ne(e)){u.add(t),A.add(t),L.add(t),C(t);return}await Ve(e,()=>Pe(e,n))}}async function Pe(e,n={}){const t=f(e),a=n.views!==!1;if(a&&h.has(t)){const p=H.get(t)||0;if(!n.validate&&Date.now()-p<Z)return;if(await Q(e),await Se(e)){H.set(t,Date.now());return}q(e)}if(a&&(await Q(e),await ce(e),await pe(e),await e.batch([e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_table_inheritance (
        child_physical_name TEXT NOT NULL,parent_physical_name TEXT NOT NULL,
        child_schema_name TEXT NOT NULL,child_table_name TEXT NOT NULL,
        parent_schema_name TEXT NOT NULL,parent_table_name TEXT NOT NULL,
        inherited_columns_json TEXT NOT NULL,local_columns_json TEXT NOT NULL,
        ordinal INTEGER NOT NULL,PRIMARY KEY(child_physical_name,parent_physical_name))`),e.prepare(`CREATE INDEX IF NOT EXISTS __edgepg_table_inheritance_parent
        ON __edgepg_table_inheritance(parent_physical_name,ordinal)`)])),a&&await me(e)){h.add(t),H.set(t,Date.now()),u.add(t),A.add(t),L.add(t),C(t);return}const o=u.has(t)?!a&&!n.validate&&G($,t)?!0:await J(e):await ne(e);if(u.has(t)&&!o&&q(e),!a&&o){u.add(t),A.add(t),L.add(t),C(t);return}if(o)u.add(t),A.add(t),L.add(t);else{await K(e),await fe(e),await ye(e),await Q(e),await re(e),await he(e),await Ie(e),await De(e),await Ue(e),await $e(e),await ce(e),await pe(e),await e.batch([e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_pg_tables (
      relation_oid INTEGER UNIQUE,
      schema_name TEXT NOT NULL,
      table_name TEXT NOT NULL,
      physical_name TEXT NOT NULL UNIQUE,
      definition TEXT NOT NULL,
      persistence TEXT NOT NULL DEFAULT 'permanent',
      columns_json TEXT NOT NULL,
      pg_types_json TEXT NOT NULL,
      current_columns_json TEXT,
      current_pg_types_json TEXT,
      current_attnums_json TEXT,
      max_attnum INTEGER NOT NULL DEFAULT 0,
      current_not_null_json TEXT,
      current_defaults_json TEXT,
      generated_columns_json TEXT NOT NULL DEFAULT '[]',
      export_key_json TEXT NOT NULL DEFAULT '[]',
      reloptions_json TEXT NOT NULL DEFAULT '[]',
      replica_identity TEXT NOT NULL DEFAULT 'd',
      foreign_server_name TEXT,
      foreign_options_json TEXT NOT NULL DEFAULT '[]',
      foreign_column_options_json TEXT NOT NULL DEFAULT '{}',
      alterations_json TEXT NOT NULL DEFAULT '[]',
      shape_changes_json TEXT NOT NULL DEFAULT '[]',
      ordinal INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (schema_name, table_name)
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_pg_extensions (
      name TEXT PRIMARY KEY,
      schema_name TEXT NOT NULL,
      version TEXT,
      owner_name TEXT NOT NULL DEFAULT 'edgepg'
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_publications (
      name TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL DEFAULT 'edgepg',
      all_tables INTEGER NOT NULL,
      tables_json TEXT NOT NULL,
      publish_json TEXT NOT NULL,
      definition TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_subscriptions (
      name TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL DEFAULT 'edgepg',
      connection_info TEXT NOT NULL,
      publications_json TEXT NOT NULL,
      enabled INTEGER NOT NULL,
      slot_name TEXT,
      options_json TEXT NOT NULL,
      definition TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_rules (
      rule_name TEXT NOT NULL,
      schema_name TEXT NOT NULL,
      table_name TEXT NOT NULL,
      table_physical_name TEXT NOT NULL,
      event_name TEXT NOT NULL,
      is_instead INTEGER NOT NULL,
      owner_name TEXT NOT NULL DEFAULT 'edgepg',
      definition TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      actions_json TEXT NOT NULL DEFAULT '[]',
      PRIMARY KEY(table_physical_name,rule_name)
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_partitioned_tables (
      physical_name TEXT PRIMARY KEY,
      schema_name TEXT NOT NULL,
      table_name TEXT NOT NULL,
      strategy TEXT NOT NULL CHECK(strategy IN ('range','list','hash')),
      key_expressions_json TEXT NOT NULL,
      definition TEXT NOT NULL
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_partitions (
      child_physical_name TEXT PRIMARY KEY,
      parent_physical_name TEXT NOT NULL,
      child_schema_name TEXT NOT NULL,
      child_table_name TEXT NOT NULL,
      bound_json TEXT NOT NULL,
      definition TEXT NOT NULL,
      ordinal INTEGER NOT NULL,
      FOREIGN KEY(parent_physical_name) REFERENCES __edgepg_partitioned_tables(physical_name) ON DELETE CASCADE
    )`),e.prepare(`CREATE INDEX IF NOT EXISTS __edgepg_partitions_parent
      ON __edgepg_partitions(parent_physical_name,ordinal)`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_statistics (
      schema_name TEXT NOT NULL,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL DEFAULT 'edgepg',
      table_schema TEXT NOT NULL,
      table_name TEXT NOT NULL,
      table_physical_name TEXT NOT NULL,
      stat_types_json TEXT NOT NULL,
      expressions_json TEXT NOT NULL,
      stattarget INTEGER NOT NULL DEFAULT -1,
      definition TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(schema_name,name)
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_transforms (
      type_name TEXT NOT NULL,
      type_oid INTEGER NOT NULL,
      language_name TEXT NOT NULL,
      from_function_name TEXT,
      from_function_oid INTEGER,
      to_function_name TEXT,
      to_function_oid INTEGER,
      definition TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(type_name,language_name)
    )`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_pg_sequences (
      schema_name TEXT NOT NULL,
      name TEXT NOT NULL,
      definition TEXT NOT NULL,
      last_value TEXT NOT NULL,
      is_called INTEGER NOT NULL,
      PRIMARY KEY (schema_name, name)
    )`),e.prepare(ee),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_comments(
      object_type TEXT NOT NULL,identity_json TEXT NOT NULL,argument_types_json TEXT NOT NULL DEFAULT '[]',
      comment TEXT NOT NULL,updated_at TEXT NOT NULL,
      PRIMARY KEY(object_type,identity_json,argument_types_json))`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_security_labels(
      object_type TEXT NOT NULL,identity_json TEXT NOT NULL,provider TEXT NOT NULL,
      label TEXT NOT NULL,updated_at TEXT NOT NULL,
      PRIMARY KEY(object_type,identity_json,provider))`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_triggers (
      name TEXT PRIMARY KEY, display_name TEXT NOT NULL, table_name TEXT NOT NULL, function_name TEXT NOT NULL,
      native_names_json TEXT NOT NULL, command_json TEXT, definition TEXT NOT NULL, updated_at TEXT NOT NULL)`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_policies (
      table_name TEXT NOT NULL, display_table_name TEXT NOT NULL, policy_name TEXT NOT NULL,
      permissive INTEGER NOT NULL, command_name TEXT NOT NULL, roles_json TEXT NOT NULL,
      using_ast_json TEXT, check_ast_json TEXT, using_expression TEXT, check_expression TEXT,
      definition TEXT NOT NULL, updated_at TEXT NOT NULL,
      PRIMARY KEY (table_name, policy_name))`),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_languages(
      name TEXT PRIMARY KEY,base_language TEXT NOT NULL CHECK(base_language IN ('sql','plpgsql')),
      trusted INTEGER NOT NULL,definition TEXT NOT NULL,updated_at TEXT NOT NULL)`),e.prepare(`INSERT OR IGNORE INTO __edgepg_languages VALUES
      ('sql','sql',1,'CREATE LANGUAGE sql',CURRENT_TIMESTAMP)`),e.prepare(`INSERT OR IGNORE INTO __edgepg_languages VALUES
      ('plpgsql','plpgsql',1,'CREATE LANGUAGE plpgsql',CURRENT_TIMESTAMP)`)]);const p=await e.prepare("PRAGMA table_info('__edgepg_pg_tables')").all();p.results.some(_=>_.name==="relation_oid")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN relation_oid INTEGER").run(),p.results.some(_=>_.name==="alterations_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN alterations_json TEXT NOT NULL DEFAULT '[]'").run(),p.results.some(_=>_.name==="shape_changes_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN shape_changes_json TEXT NOT NULL DEFAULT '[]'").run(),p.results.some(_=>_.name==="current_columns_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN current_columns_json TEXT").run(),p.results.some(_=>_.name==="current_pg_types_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN current_pg_types_json TEXT").run(),p.results.some(_=>_.name==="current_attnums_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN current_attnums_json TEXT").run(),p.results.some(_=>_.name==="max_attnum")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN max_attnum INTEGER NOT NULL DEFAULT 0").run(),p.results.some(_=>_.name==="current_not_null_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN current_not_null_json TEXT").run(),p.results.some(_=>_.name==="current_defaults_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN current_defaults_json TEXT").run(),p.results.some(_=>_.name==="generated_columns_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN generated_columns_json TEXT NOT NULL DEFAULT '[]'").run(),p.results.some(_=>_.name==="persistence")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN persistence TEXT NOT NULL DEFAULT 'permanent'").run(),p.results.some(_=>_.name==="reloptions_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN reloptions_json TEXT NOT NULL DEFAULT '[]'").run(),p.results.some(_=>_.name==="replica_identity")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN replica_identity TEXT NOT NULL DEFAULT 'd'").run(),p.results.some(_=>_.name==="foreign_server_name")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN foreign_server_name TEXT").run(),p.results.some(_=>_.name==="foreign_options_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN foreign_options_json TEXT NOT NULL DEFAULT '[]'").run(),p.results.some(_=>_.name==="foreign_column_options_json")||await e.prepare("ALTER TABLE __edgepg_pg_tables ADD COLUMN foreign_column_options_json TEXT NOT NULL DEFAULT '{}'").run();const T=await e.prepare("PRAGMA table_info('__edgepg_pg_objects')").all();T.results.some(_=>_.name==="dependencies_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN dependencies_json TEXT NOT NULL DEFAULT '[]'").run(),T.results.some(_=>_.name==="routine_dependencies_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN routine_dependencies_json TEXT NOT NULL DEFAULT '[]'").run(),T.results.some(_=>_.name==="view_definition")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN view_definition TEXT").run(),T.results.some(_=>_.name==="compact_view_definition")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN compact_view_definition TEXT").run(),T.results.some(_=>_.name==="relation_oid")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_oid INTEGER").run(),T.results.some(_=>_.name==="owner_name")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN owner_name TEXT NOT NULL DEFAULT 'edgepg'").run(),T.results.some(_=>_.name==="relation_natts")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_natts INTEGER NOT NULL DEFAULT 0").run(),T.results.some(_=>_.name==="relation_pg_types_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_pg_types_json TEXT NOT NULL DEFAULT '[]'").run(),T.results.some(_=>_.name==="relation_collations_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_collations_json TEXT NOT NULL DEFAULT '[]'").run(),T.results.some(_=>_.name==="reloptions_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN reloptions_json TEXT NOT NULL DEFAULT '[]'").run();const j=(await e.prepare(`SELECT phase,schema_name,object_name,view_definition
    FROM __edgepg_pg_objects WHERE kind='view' AND view_definition IS NOT NULL
      AND compact_view_definition IS NULL`).all()).results;for(const _ of j)await e.prepare(`UPDATE __edgepg_pg_objects
    SET compact_view_definition=?4 WHERE phase=?1 AND kind='view' AND schema_name=?2 AND object_name=?3`).bind(_.phase,_.schema_name,_.object_name,le(_.view_definition)).run();await Cn(e),await e.prepare(`UPDATE __edgepg_pg_tables SET relation_oid=16383+ordinal
    WHERE relation_oid IS NULL`).run(),await e.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_pg_tables_relation_oid
    ON __edgepg_pg_tables(relation_oid)`).run(),await e.prepare(Ne).run(),await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_oid_allocator (
    id INTEGER PRIMARY KEY CHECK(id=1), next_oid INTEGER NOT NULL)`).run(),await e.prepare(`INSERT OR IGNORE INTO __edgepg_oid_allocator(id,next_oid)
    VALUES (1, COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384))`).run(),await e.prepare(`UPDATE __edgepg_oid_allocator SET next_oid=MAX(next_oid,
    COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384)) WHERE id=1`).run(),await e.prepare(`CREATE TRIGGER IF NOT EXISTS __edgepg_pg_tables_assign_oid
    AFTER INSERT ON __edgepg_pg_tables WHEN NEW.relation_oid IS NULL BEGIN
      UPDATE __edgepg_pg_tables SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
        WHERE schema_name=NEW.schema_name AND table_name=NEW.table_name;
      UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1;
    END`).run(),await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_schemas (
    name TEXT PRIMARY KEY, owner_name TEXT NOT NULL, oid INTEGER UNIQUE,
    acl_initialized INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();const w=await e.prepare("PRAGMA table_info('__edgepg_schemas')").all();w.results.some(_=>_.name==="oid")||await e.prepare("ALTER TABLE __edgepg_schemas ADD COLUMN oid INTEGER").run(),w.results.some(_=>_.name==="acl_initialized")||await e.prepare("ALTER TABLE __edgepg_schemas ADD COLUMN acl_initialized INTEGER NOT NULL DEFAULT 0").run(),await e.prepare(`INSERT OR IGNORE INTO __edgepg_schemas(name, owner_name, oid) VALUES
    ('public', 'edgepg', 2200), ('pg_catalog', 'edgepg', 11), ('information_schema', 'edgepg', 13207)`).run(),await e.prepare(`UPDATE __edgepg_schemas SET oid=CASE name
    WHEN 'public' THEN 2200 WHEN 'pg_catalog' THEN 11 WHEN 'information_schema' THEN 13207 END
    WHERE oid IS NULL AND name IN ('public','pg_catalog','information_schema')`).run();const Y=(await e.prepare("SELECT name FROM __edgepg_schemas WHERE oid IS NULL ORDER BY name").all()).results;for(const _ of Y)await e.prepare(`UPDATE __edgepg_schemas
    SET oid=COALESCE((SELECT MAX(oid)+1 FROM __edgepg_schemas), 20000) WHERE name=?1`).bind(_.name).run();await K(e),await Ce(e),await be(e),await e.prepare(`UPDATE __edgepg_oid_allocator SET next_oid=MAX(next_oid,
    COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_objects WHERE kind IN ('view','index')),16384)) WHERE id=1`).run();const x=(await e.prepare(`SELECT phase,kind,schema_name,object_name
    FROM __edgepg_pg_objects WHERE kind IN ('view','index') AND relation_oid IS NULL
    ORDER BY ordinal,schema_name,object_name`).all()).results;for(const _ of x)await e.batch([e.prepare(`UPDATE __edgepg_pg_objects SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
      WHERE phase=?1 AND kind=?2 AND schema_name=?3 AND object_name=?4`).bind(_.phase,_.kind,_.schema_name,_.object_name),e.prepare("UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1")]);await e.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_pg_objects_relation_oid
    ON __edgepg_pg_objects(relation_oid) WHERE relation_oid IS NOT NULL`).run(),await e.prepare("DROP TRIGGER IF EXISTS __edgepg_pg_objects_assign_oid").run(),await e.prepare(`CREATE TRIGGER IF NOT EXISTS __edgepg_pg_objects_assign_oid
    AFTER INSERT ON __edgepg_pg_objects WHEN NEW.kind IN ('view','index') AND NEW.relation_oid IS NULL BEGIN
      UPDATE __edgepg_pg_objects SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
        WHERE phase=NEW.phase AND kind=NEW.kind AND schema_name=NEW.schema_name AND object_name=NEW.object_name;
      UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1;
    END`).run(),await e.prepare("CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_schemas_oid ON __edgepg_schemas(oid)").run(),await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_rls_tables (
    table_name TEXT PRIMARY KEY, display_name TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 0,
    forced INTEGER NOT NULL DEFAULT 0, owner_role TEXT NOT NULL, updated_at TEXT NOT NULL)`).run(),await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_catalog_objects(
    object_type TEXT NOT NULL,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL DEFAULT 'edgepg',
    fdw_name TEXT,
    options_json TEXT NOT NULL DEFAULT '[]',
    definition TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(object_type,name))`).run();const v=await e.prepare("PRAGMA table_info('__edgepg_catalog_objects')").all();v.results.some(_=>_.name==="owner_name")||await e.prepare("ALTER TABLE __edgepg_catalog_objects ADD COLUMN owner_name TEXT NOT NULL DEFAULT 'edgepg'").run(),v.results.some(_=>_.name==="fdw_name")||await e.prepare("ALTER TABLE __edgepg_catalog_objects ADD COLUMN fdw_name TEXT").run(),v.results.some(_=>_.name==="options_json")||await e.prepare("ALTER TABLE __edgepg_catalog_objects ADD COLUMN options_json TEXT NOT NULL DEFAULT '[]'").run(),(await e.prepare("PRAGMA table_info('__edgepg_pg_extensions')").all()).results.some(_=>_.name==="owner_name")||await e.prepare("ALTER TABLE __edgepg_pg_extensions ADD COLUMN owner_name TEXT NOT NULL DEFAULT 'edgepg'").run(),await Ke(e),u.add(t),A.add(t),L.add(t)}if(!a)return;await I(e,["pg_catalog__pg_class","pg_catalog__pg_inherits","pg_catalog__pg_partitioned_table","pg_catalog__pg_sequence","pg_catalog__pg_namespace","pg_catalog__pg_type","pg_catalog__pg_enum","pg_catalog__pg_depend","pg_catalog__pg_depend_base","pg_catalog__pg_event_trigger","pg_catalog__pg_conversion","pg_catalog__pg_shdepend","pg_catalog__pg_rewrite","pg_catalog__pg_range","pg_catalog__pg_statistic_ext","pg_catalog__pg_transform","pg_catalog__pg_index","pg_catalog__pg_indexes","pg_catalog__pg_attribute","pg_catalog__pg_attrdef","pg_catalog__pg_constraint","pg_catalog__pg_am","pg_catalog__pg_operator","pg_catalog__pg_opfamily","pg_catalog__pg_opclass","pg_catalog__pg_amop","pg_catalog__pg_amproc","pg_catalog__pg_cast","pg_catalog__pg_collation","pg_catalog__pg_ts_parser","pg_catalog__pg_ts_template","pg_catalog__pg_ts_dict","pg_catalog__pg_ts_config","pg_catalog__pg_ts_config_map","pg_catalog__pg_description","pg_catalog__pg_seclabels","pg_catalog__pg_seclabel","pg_catalog__pg_extension","pg_catalog__pg_publication","pg_catalog__pg_publication_tables","pg_catalog__pg_subscription","pg_catalog__pg_authid","pg_catalog__pg_roles","pg_catalog__pg_auth_members","pg_catalog__pg_database","pg_catalog__pg_tablespace","pg_catalog__pg_foreign_data_wrapper","pg_catalog__pg_foreign_server","pg_catalog__pg_user_mappings","pg_catalog__pg_user_mapping","pg_catalog__pg_foreign_table","pg_catalog__pg_db_role_setting","pg_catalog__pg_parameter_acl","pg_catalog__pg_default_acl","pg_catalog__pg_proc","pg_catalog__pg_aggregate","pg_catalog__pg_policies","pg_catalog__pg_matviews","information_schema__tables","information_schema__columns","information_schema__sequences","information_schema__schemata","information_schema__role_table_grants","information_schema__table_privileges","information_schema__role_column_grants","information_schema__column_privileges","information_schema__table_constraints","information_schema__key_column_usage"].map(p=>e.prepare(`DROP VIEW IF EXISTS ${p}`))),await I(e,[e.prepare(_n()),e.prepare(on()),e.prepare(En()),e.prepare(je()),e.prepare(sn())]),await e.prepare(`CREATE VIEW pg_catalog__pg_class AS
    SELECT tables.relation_oid AS oid, tables.table_name AS relname, schemas.oid AS relnamespace,
      ${F}+tables.relation_oid AS reltype,
      COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=owner.owner_name),10) AS relowner,
      CASE WHEN EXISTS (SELECT 1 FROM __edgepg_partitioned_tables AS partitioned
        WHERE partitioned.physical_name=tables.physical_name) THEN 'p'
        WHEN tables.persistence='foreign' THEN 'f' ELSE 'r' END AS relkind,
      CASE tables.persistence WHEN 'temporary' THEN 't' WHEN 'unlogged' THEN 'u' ELSE 'p' END AS relpersistence,
      CASE WHEN tables.persistence='foreign' THEN 0 ELSE 2 END AS relam,
      CASE WHEN EXISTS (SELECT 1 FROM __edgepg_partitions AS partition
        WHERE partition.child_physical_name=tables.physical_name) THEN 1 ELSE 0 END AS relispartition,
      json_array_length(COALESCE(tables.current_columns_json,tables.columns_json)) AS relnatts,
      CASE WHEN json_array_length(tables.export_key_json)>0 OR EXISTS (
        SELECT 1 FROM __edgepg_unique_constraints AS unique_constraint
        WHERE unique_constraint.table_name=tables.physical_name
      ) OR EXISTS (
        SELECT 1 FROM __edgepg_pg_objects AS index_object,
          json_each(index_object.dependencies_json) AS index_dependency
        WHERE index_object.kind='index'
          AND CAST(index_dependency.value AS TEXT)=tables.physical_name
      ) THEN 1 ELSE 0 END AS relhasindex,
      CASE WHEN rls.enabled=1 THEN 1 ELSE 0 END AS relrowsecurity,
      CASE WHEN rls.forced=1 THEN 1 ELSE 0 END AS relforcerowsecurity,
      1 AS relispopulated,
      CASE WHEN json_array_length(tables.reloptions_json)>0 THEN tables.reloptions_json ELSE NULL END AS reloptions,
      tables.replica_identity AS relreplident,
      0 AS reltablespace,0 AS reltoastrelid,0 AS reloftype,
      (SELECT count(*) FROM __edgepg_check_constraints AS check_constraint
        WHERE check_constraint.table_name=tables.physical_name) AS relchecks,
      EXISTS(SELECT 1 FROM __edgepg_rules AS rule WHERE rule.table_physical_name=tables.physical_name) AS relhasrules,
      EXISTS(SELECT 1 FROM __edgepg_triggers AS trigger WHERE trigger.table_name=tables.physical_name) AS relhastriggers,
      0 AS relpages,0 AS reltuples,0 AS relallvisible,0 AS relallfrozen
    FROM __edgepg_pg_tables AS tables JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    LEFT JOIN __edgepg_table_owners AS owner ON owner.physical_name=tables.physical_name
    LEFT JOIN __edgepg_rls_tables AS rls ON rls.table_name=tables.physical_name
    UNION ALL
    SELECT materialized.relation_oid,materialized.relation_name,schemas.oid,
      ${F}+materialized.relation_oid,
      COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=materialized.owner_name),10),
      'm','p',2,0,materialized.relation_natts,
      CASE WHEN EXISTS (SELECT 1 FROM sqlite_master AS object
        WHERE object.type='index' AND object.tbl_name=materialized.name) THEN 1 ELSE 0 END,
      0,0,materialized.populated,NULL,'n',0,0,0,0,0,0,0,0,0,0
    FROM __edgepg_materialized_views AS materialized
    JOIN __edgepg_schemas AS schemas ON schemas.name=materialized.schema_name
    WHERE materialized.relation_name<>''
    UNION ALL
    SELECT object.relation_oid,object.object_name,schemas.oid,
      CASE object.kind WHEN 'view' THEN ${F}+object.relation_oid ELSE 0 END,
      COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=object.owner_name),10),
      CASE object.kind WHEN 'index' THEN 'i' ELSE 'v' END,'p',
      CASE object.kind WHEN 'index' THEN 403 ELSE 0 END,0,
      CASE object.kind WHEN 'index' THEN (SELECT count(*) FROM pragma_index_info(
        CASE WHEN object.schema_name='public' THEN object.object_name
          ELSE object.schema_name || '__' || object.object_name END)) ELSE object.relation_natts END,0,0,0,1,
      CASE WHEN object.kind IN ('index','view') AND json_array_length(object.reloptions_json)>0 THEN object.reloptions_json ELSE NULL END,
      'n',0,0,0,0,0,0,0,0,0,0
    FROM __edgepg_pg_objects AS object JOIN __edgepg_schemas AS schemas ON schemas.name=object.schema_name
    WHERE object.kind IN ('view','index') AND object.relation_oid IS NOT NULL
    UNION ALL
    SELECT 80000+unique_constraint.rowid,unique_constraint.constraint_name,schemas.oid,0,10,
      'i','p',403,0,json_array_length(unique_constraint.columns_json),0,0,0,1,NULL,'n',
      0,0,0,0,0,0,0,0,0,0
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    UNION ALL
    SELECT sequences.rowid+40000,
      CASE WHEN instr(sequences.name,'__')>0 THEN substr(sequences.name,instr(sequences.name,'__')+2) ELSE sequences.name END,
      schemas.oid,0,10,'S','p',0,0,0,0,0,0,1,NULL,'n',0,0,0,0,0,0,0,0,0,0
    FROM __edgepg_sequences AS sequences
    JOIN __edgepg_schemas AS schemas ON schemas.name=CASE WHEN instr(sequences.name,'__')>0
      THEN substr(sequences.name,1,instr(sequences.name,'__')-1) ELSE 'public' END`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_inherits AS
    SELECT child.relation_oid AS inhrelid,parent.relation_oid AS inhparent,
      1 AS inhseqno,0 AS inhdetachpending
    FROM __edgepg_partitions AS partition
    JOIN __edgepg_pg_tables AS child ON child.physical_name=partition.child_physical_name
    JOIN __edgepg_pg_tables AS parent ON parent.physical_name=partition.parent_physical_name
    UNION ALL
    SELECT child.relation_oid,parent.relation_oid,inheritance.ordinal,0
    FROM __edgepg_table_inheritance AS inheritance
    JOIN __edgepg_pg_tables AS child ON child.physical_name=inheritance.child_physical_name
    JOIN __edgepg_pg_tables AS parent ON parent.physical_name=inheritance.parent_physical_name`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_partitioned_table AS
    SELECT tables.relation_oid AS partrelid,
      CASE partitioned.strategy WHEN 'range' THEN 'r' WHEN 'list' THEN 'l' ELSE 'h' END AS partstrat,
      json_array_length(partitioned.key_expressions_json) AS partnatts,
      partitioned.key_expressions_json AS partattrs,
      NULL AS partclass,NULL AS partcollation,partitioned.key_expressions_json AS partexprs
    FROM __edgepg_partitioned_tables AS partitioned
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=partitioned.physical_name`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_sequence AS
    SELECT CAST(rowid+40000 AS INTEGER) AS seqrelid,
      CASE data_type WHEN 'smallint' THEN 21 WHEN 'integer' THEN 23 ELSE 20 END AS seqtypid,
      CAST(start_value AS TEXT) AS seqstart,CAST(increment_value AS TEXT) AS seqincrement,
      CAST(max_value AS TEXT) AS seqmax,CAST(min_value AS TEXT) AS seqmin,
      CAST(cache_value AS TEXT) AS seqcache,cycle AS seqcycle
    FROM __edgepg_sequences`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_rewrite AS
    SELECT rules.rowid+33000 AS oid,
      rules.rule_name AS rulename,
      tables.relation_oid AS ev_class,
      CASE rules.event_name WHEN 'select' THEN '1' WHEN 'update' THEN '2'
        WHEN 'insert' THEN '3' WHEN 'delete' THEN '4' ELSE '0' END AS ev_type,
      'O' AS ev_enabled,
      rules.is_instead AS is_instead,
      NULL AS ev_qual,
      rules.definition AS ev_action
    FROM __edgepg_rules AS rules
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=rules.table_physical_name
    UNION ALL
    SELECT 500000+object.relation_oid AS oid,'_RETURN' AS rulename,
      object.relation_oid AS ev_class,'1' AS ev_type,'O' AS ev_enabled,
      1 AS is_instead,NULL AS ev_qual,object.definition AS ev_action
    FROM __edgepg_pg_objects AS object
    WHERE object.kind='view' AND object.relation_oid IS NOT NULL`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_statistic_ext AS
    SELECT statistics.rowid+34000 AS oid,
      statistics.name AS stxname,
      COALESCE((SELECT namespace.oid FROM pg_catalog__pg_namespace AS namespace
        WHERE namespace.nspname=statistics.schema_name),2200) AS stxnamespace,
      COALESCE((SELECT role.rowid+20000 FROM __edgepg_roles AS role
        WHERE role.name=statistics.owner_name),10) AS stxowner,
      tables.relation_oid AS stxrelid,
      (SELECT CASE WHEN count(*)=0 THEN ''
        ELSE group_concat(CAST(column_entry.key AS INTEGER)+1, ' ') END
       FROM json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_entry
       JOIN json_each(statistics.expressions_json) AS expression_entry ON expression_entry.value=column_entry.value) AS stxkeys,
      CASE WHEN statistics.stattarget < 0 THEN NULL ELSE statistics.stattarget END AS stxstattarget,
      '{' || (SELECT group_concat(CASE value WHEN 'dependencies' THEN 'f' WHEN 'ndistinct' THEN 'd'
        WHEN 'mcv' THEN 'm' ELSE value END, ',') FROM json_each(statistics.stat_types_json)) || '}' AS stxkind,
      NULL AS stxexprs
    FROM __edgepg_statistics AS statistics
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=statistics.table_physical_name`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_transform AS
    SELECT transforms.rowid+35000 AS oid,
      transforms.type_oid AS trftype,
      COALESCE((SELECT language.rowid+62000 FROM __edgepg_languages AS language
        WHERE language.name=transforms.language_name),0) AS trflang,
      COALESCE(transforms.from_function_oid,0) AS trffromsql,
      COALESCE(transforms.to_function_oid,0) AS trftosql
    FROM __edgepg_transforms AS transforms`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_matviews AS
    SELECT materialized.schema_name AS schemaname,materialized.relation_name AS matviewname,
      materialized.owner_name AS matviewowner,NULL AS tablespace,
      CASE WHEN EXISTS (SELECT 1 FROM sqlite_master AS object
        WHERE object.type='index' AND object.tbl_name=materialized.name) THEN 1 ELSE 0 END AS hasindexes,
      materialized.populated AS ispopulated,materialized.definition_compact_sql AS definition
    FROM __edgepg_materialized_views AS materialized WHERE materialized.relation_name<>''`).run(),await e.prepare(An()).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_enum AS
    SELECT identities.oid * 1000 + CAST(label.key AS INTEGER) + 1 AS oid,
      identities.oid AS enumtypid,
      CAST(COALESCE(json_extract(types.sort_orders_json,'$[' || label.key || ']'),
        CAST(label.key AS REAL)+1) AS REAL) AS enumsortorder,
      CAST(label.value AS TEXT) AS enumlabel
    FROM __edgepg_types AS types
    JOIN __edgepg_type_identities AS identities ON identities.name=types.name
    JOIN json_each(types.values_json) AS label
    WHERE types.kind='enum' AND identities.oid IS NOT NULL`).run();const g=D("domain.base_type");await e.prepare(`CREATE VIEW pg_catalog__pg_depend_base AS
    SELECT 1247 AS classid,identity.array_oid AS objid,0 AS objsubid,
      1247 AS refclassid,identity.oid AS refobjid,0 AS refobjsubid,'i' AS deptype
    FROM __edgepg_type_identities AS identity
    WHERE identity.oid IS NOT NULL AND identity.array_oid IS NOT NULL
    UNION ALL
    SELECT 1247,domain_identity.oid,0,1247,
      COALESCE(NULLIF(${W(g,!1)},0),
        CASE WHEN ${g} LIKE '%[]'
          THEN base_identity.array_oid ELSE base_identity.oid END),
      0,'n'
    FROM __edgepg_domains AS domain
    JOIN __edgepg_type_identities AS domain_identity ON domain_identity.name=domain.name
    LEFT JOIN __edgepg_type_identities AS base_identity
      ON base_identity.name=replace(replace(${g},'.','__'),'[]','')
    WHERE domain_identity.oid IS NOT NULL
    UNION ALL
    SELECT CAST(json_extract(dependency.value,'$.classid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.objid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.objsubid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.refclassid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.refobjid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.refobjsubid') AS INTEGER),
      CAST(json_extract(dependency.value,'$.deptype') AS TEXT)
    FROM __edgepg_pg_tables AS table_catalog
    JOIN json_each(COALESCE(table_catalog.current_columns_json,table_catalog.columns_json)) AS column_name
    LEFT JOIN __edgepg_type_columns AS type_column
      ON type_column.table_name=table_catalog.physical_name
      AND type_column.column_name=CAST(column_name.value AS TEXT)
    LEFT JOIN __edgepg_type_identities AS type_identity ON type_identity.name=type_column.type_name
    LEFT JOIN __edgepg_sequence_defaults AS sequence_default
      ON sequence_default.table_name=table_catalog.physical_name
      AND sequence_default.column_name=CAST(column_name.value AS TEXT)
    LEFT JOIN __edgepg_sequences AS sequence ON sequence.name=sequence_default.sequence_name
    JOIN json_each(json_array(
      CASE WHEN type_identity.oid IS NULL THEN NULL ELSE json_object(
        'classid',1259,'objid',table_catalog.relation_oid,'objsubid',CAST(column_name.key AS INTEGER)+1,
        'refclassid',1247,'refobjid',type_identity.oid,'refobjsubid',0,'deptype','n') END,
      CASE WHEN sequence.rowid IS NULL THEN NULL ELSE json_object(
        'classid',1259,'objid',CAST(sequence.rowid+40000 AS INTEGER),'objsubid',0,
        'refclassid',1259,'refobjid',table_catalog.relation_oid,
        'refobjsubid',CAST(column_name.key AS INTEGER)+1,
        'deptype',CASE sequence_default.mode WHEN 'serial' THEN 'a' ELSE 'i' END) END
    )) AS dependency ON dependency.value IS NOT NULL
    WHERE table_catalog.relation_oid IS NOT NULL
    UNION ALL
    SELECT
      CASE json_extract(dependency_group.value,'$.kind') WHEN 'routine' THEN 1259 ELSE 2618 END,
      CASE json_extract(dependency_group.value,'$.kind') WHEN 'routine' THEN object.relation_oid
        ELSE 500000+object.relation_oid END,0,
      CASE json_extract(dependency_group.value,'$.kind') WHEN 'routine' THEN 1255 ELSE 1259 END,
      CASE json_extract(dependency_group.value,'$.kind') WHEN 'relation' THEN dependency_table.relation_oid
        ELSE CAST(dependency.value AS INTEGER) END,0,
      CASE json_extract(dependency_group.value,'$.kind') WHEN 'internal' THEN 'i' ELSE 'n' END
    FROM __edgepg_pg_objects AS object
    JOIN json_each(json_array(
      json_object('kind','internal','values',json_array(object.relation_oid)),
      json_object('kind','relation','values',json(object.dependencies_json)),
      json_object('kind','routine','values',json(object.routine_dependencies_json))
    )) AS dependency_group
    JOIN json_each(json_extract(dependency_group.value,'$.values')) AS dependency
    LEFT JOIN __edgepg_pg_tables AS dependency_table
      ON json_extract(dependency_group.value,'$.kind')='relation'
      AND dependency_table.physical_name=CAST(dependency.value AS TEXT)
    WHERE object.kind='view' AND object.relation_oid IS NOT NULL
      AND (json_extract(dependency_group.value,'$.kind')<>'relation'
        OR dependency_table.relation_oid IS NOT NULL)
    UNION ALL
    SELECT classid,objid,objsubid,refclassid,refobjid,refobjsubid,deptype FROM (
      SELECT 1255 AS classid,aggregate.aggregate_oid AS objid,0 AS objsubid,
        CASE CAST(dependency.key AS INTEGER) WHEN 0 THEN 1255 ELSE 1247 END AS refclassid,
        CAST(dependency.value AS INTEGER) AS refobjid,0 AS refobjsubid,'n' AS deptype
      FROM __edgepg_aggregates AS aggregate,
        json_each(json_array(aggregate.transition_oid,aggregate.transition_type_oid)) AS dependency
      UNION ALL
      SELECT classid,objid,objsubid,refclassid,refobjid,refobjsubid,deptype
      FROM __edgepg_text_search_dependencies
      UNION ALL
      ${Me()}
      UNION ALL
      SELECT classid,objid,objsubid,refclassid,refobjid,refobjsubid,deptype
      FROM __edgepg_operator_type_dependencies
    )`).run(),await I(e,[e.prepare(`CREATE VIEW pg_catalog__pg_depend AS
      SELECT * FROM pg_catalog__pg_depend_base
      ${He()}`),e.prepare(ve()),e.prepare(Fe(Re()))]),await e.prepare(un()).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_index AS
    SELECT tables.relation_oid AS indrelid,80000+unique_constraint.rowid AS indexrelid,
      CASE unique_constraint.kind WHEN 'primary' THEN 1 ELSE 0 END AS indisprimary,
      1 AS indisunique,0 AS indisclustered,1 AS indisvalid,1 AS indisready,
      CASE unique_constraint.is_deferrable WHEN 1 THEN 0 ELSE 1 END AS indimmediate,
      (SELECT group_concat(CAST(table_column.key AS INTEGER)+1,' ')
       FROM json_each(unique_constraint.columns_json) AS constraint_column
       JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column
         ON table_column.value=constraint_column.value) AS indkey,
      NULL AS indexprs,NULL AS indpred,0 AS indisreplident,
      json_array_length(unique_constraint.columns_json) AS indnkeyatts,
      json_array_length(unique_constraint.columns_json) AS indnatts,
      unique_constraint.nulls_not_distinct AS indnullsnotdistinct
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    UNION ALL
    SELECT tables.relation_oid,object.relation_oid,0,
      CASE WHEN upper(trim(object.definition)) LIKE 'CREATE UNIQUE INDEX%' THEN 1 ELSE 0 END,
      0,1,1,1,
      (SELECT group_concat(CAST(table_column.key AS INTEGER)+1,' ')
       FROM pragma_index_info(CASE WHEN object.schema_name='public' THEN object.object_name
         ELSE object.schema_name || '__' || object.object_name END) AS index_column
       JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column
         ON table_column.value=index_column.name),
      NULL,NULL,0,
      (SELECT count(*) FROM pragma_index_info(CASE WHEN object.schema_name='public' THEN object.object_name
        ELSE object.schema_name || '__' || object.object_name END)),
      (SELECT count(*) FROM pragma_index_info(CASE WHEN object.schema_name='public' THEN object.object_name
        ELSE object.schema_name || '__' || object.object_name END)),0
    FROM __edgepg_pg_objects AS object
    JOIN json_each(object.dependencies_json) AS dependency
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=CAST(dependency.value AS TEXT)
    WHERE object.kind='index' AND object.relation_oid IS NOT NULL`).run(),await e.prepare(yn()).run();const l=D("pg_type.value"),E=W(l),c=oe("pg_type.value"),N=ae("type_catalog"),s=D("COALESCE(json_extract(object.relation_pg_types_json, '$[' || view_column.cid || ']'), view_column.type)"),i=W(s),r=ae("view_type_catalog"),O=D("index_pg_type.value"),b=W(O),m=ae("index_type_catalog");await e.prepare(`CREATE VIEW pg_catalog__pg_attribute AS
    SELECT tables.relation_oid AS attrelid,
      COALESCE(CAST(json_extract(tables.current_attnums_json, '$[' || column_name.key || ']') AS INTEGER),
        CAST(column_name.key AS INTEGER)+1) AS attnum,
      CAST(column_name.value AS TEXT) AS attname, ${E} AS atttypid,
      ${c} AS atttypmod,${N},
      COALESCE((SELECT dependency.collation_oid FROM __edgepg_collation_dependencies AS dependency
        WHERE dependency.dependent_kind='column' AND dependency.physical_name=tables.physical_name
          AND dependency.column_name=column_name.value LIMIT 1),type_catalog.typcollation,0) AS attcollation,
      (SELECT COUNT(*) FROM __edgepg_table_inheritance AS inheritance
        JOIN json_each(inheritance.inherited_columns_json) AS inherited_column
        WHERE inheritance.child_physical_name=tables.physical_name
          AND inherited_column.value=column_name.value) AS attinhcount,
      CASE WHEN EXISTS(SELECT 1 FROM __edgepg_table_inheritance AS inheritance
          WHERE inheritance.child_physical_name=tables.physical_name)
        THEN EXISTS(SELECT 1 FROM __edgepg_table_inheritance AS inheritance
          JOIN json_each(inheritance.local_columns_json) AS local_column
          WHERE inheritance.child_physical_name=tables.physical_name
            AND local_column.value=column_name.value)
        ELSE 1 END AS attislocal,
      CASE WHEN COALESCE(json_extract(tables.current_not_null_json,
          '$[' || column_name.key || ']'), 0)=1
        OR EXISTS (SELECT 1 FROM __edgepg_not_null_constraints AS not_null_constraint
          WHERE not_null_constraint.table_name=tables.physical_name
            AND not_null_constraint.column_name=column_name.value)
        OR EXISTS (SELECT 1 FROM __edgepg_unique_constraints AS primary_constraint,
            json_each(primary_constraint.columns_json) AS primary_column
          WHERE primary_constraint.table_name=tables.physical_name
            AND primary_constraint.kind='primary'
            AND primary_column.value=column_name.value)
        THEN 1 ELSE 0 END AS attnotnull,
      CASE WHEN json_type(tables.current_defaults_json, '$[' || column_name.key || ']') IS NULL
        OR json_type(tables.current_defaults_json, '$[' || column_name.key || ']')='null' THEN 0 ELSE 1 END AS atthasdef,
      0 AS attisdropped,
      CASE WHEN tables.persistence='foreign'
        THEN (SELECT column_options.value FROM json_each(COALESCE(tables.foreign_column_options_json,'{}')) AS column_options
          WHERE column_options.key=column_name.value)
        ELSE NULL END AS attfdwoptions,
      '' AS attidentity, '' AS attgenerated, '' AS attcompression
    FROM __edgepg_pg_tables AS tables
    JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_name
    JOIN json_each(COALESCE(tables.current_pg_types_json,tables.pg_types_json)) AS pg_type ON pg_type.key=column_name.key
    LEFT JOIN pg_catalog__pg_type AS type_catalog ON type_catalog.oid=${E}
    UNION ALL
    SELECT object.relation_oid AS attrelid, CAST(view_column.cid AS INTEGER)+1 AS attnum,
      view_column.name AS attname,
      ${i} AS atttypid,
      ${oe("view_column.type")} AS atttypmod,
      ${r},COALESCE((SELECT collation.oid FROM __edgepg_collations AS collation
        WHERE collation.collation_name=json_extract(object.relation_collations_json,'$[' || view_column.cid || ']')
        ORDER BY CASE WHEN collation.schema_name='pg_catalog' THEN 0 ELSE 1 END,collation.oid LIMIT 1),
        view_type_catalog.typcollation,0) AS attcollation,0 AS attinhcount,1 AS attislocal,
      0 AS attnotnull,0 AS atthasdef,0 AS attisdropped,NULL AS attfdwoptions,
      '' AS attidentity,'' AS attgenerated,'' AS attcompression
    FROM __edgepg_pg_objects AS object
    JOIN pragma_table_info(CASE WHEN object.schema_name='public' THEN object.object_name
      ELSE object.schema_name || '__' || object.object_name END) AS view_column
    LEFT JOIN pg_catalog__pg_type AS view_type_catalog ON view_type_catalog.oid=${i}
    WHERE object.kind='view' AND object.relation_oid IS NOT NULL
      AND CAST(view_column.cid AS INTEGER)<object.relation_natts
      AND substr(view_column.name,1,9)<>'__edgepg_'
    UNION ALL
    SELECT object.relation_oid,CAST(index_column.seqno AS INTEGER)+1,index_column.name,
      ${b},${oe("index_pg_type.value")},${m},
      COALESCE(index_type_catalog.typcollation,0),0,1,
      0,0,0,NULL,'','',''
    FROM __edgepg_pg_objects AS object
    JOIN pragma_index_info(CASE WHEN object.schema_name='public' THEN object.object_name
      ELSE object.schema_name || '__' || object.object_name END) AS index_column
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=(
      SELECT CAST(dependency.value AS TEXT) FROM json_each(object.dependencies_json) AS dependency LIMIT 1)
    JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column
      ON table_column.value=index_column.name
    JOIN json_each(COALESCE(tables.current_pg_types_json,tables.pg_types_json)) AS index_pg_type
      ON index_pg_type.key=table_column.key
    LEFT JOIN pg_catalog__pg_type AS index_type_catalog ON index_type_catalog.oid=${b}
    WHERE object.kind='index' AND object.relation_oid IS NOT NULL AND index_column.name IS NOT NULL`).run(),await e.prepare(en()).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_constraint AS
    SELECT 30000 + row_number() OVER (ORDER BY unique_constraint.table_name, unique_constraint.constraint_name) AS oid,
      unique_constraint.constraint_name AS conname,
      CASE unique_constraint.kind WHEN 'primary' THEN 'p' ELSE 'u' END AS contype,
      tables.relation_oid AS conrelid, schemas.oid AS connamespace,
      (SELECT json_group_array(CAST(table_column.key AS INTEGER)+1)
       FROM json_each(unique_constraint.columns_json) AS constraint_column
       JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column ON table_column.value=constraint_column.value) AS conkey,
      NULL AS confkey, NULL AS confrelid,
      unique_constraint.is_deferrable AS condeferrable,
      unique_constraint.is_initially_deferred AS condeferred,
      NULL AS confdeltype, NULL AS confupdtype,
      0 AS conparentid,1 AS convalidated,0 AS connoinherit,1 AS conislocal,
      80000+unique_constraint.rowid AS conindid,0 AS coninhcount,0 AS conperiod,2606 AS tableoid
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    UNION ALL
    SELECT 40000 + row_number() OVER (ORDER BY check_constraint.table_name, check_constraint.constraint_name),
      check_constraint.constraint_name,'c',tables.relation_oid,schemas.oid,NULL,NULL,NULL,
      0,0,NULL,NULL,0,1,check_constraint.no_inherit,1,0,0,0,2606
    FROM __edgepg_check_constraints AS check_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=check_constraint.table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    UNION ALL
    SELECT 50000 + row_number() OVER (ORDER BY foreign_constraint.table_name, foreign_constraint.constraint_name),
      foreign_constraint.constraint_name,'f',tables.relation_oid,schemas.oid,
      (SELECT json_group_array(CAST(table_column.key AS INTEGER)+1)
       FROM json_each(foreign_constraint.columns_json) AS constraint_column
       JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column ON table_column.value=constraint_column.value),
      (SELECT json_group_array(CAST(table_column.key AS INTEGER)+1)
       FROM json_each(foreign_constraint.referenced_columns_json) AS constraint_column
       JOIN json_each(COALESCE(referenced.current_columns_json,referenced.columns_json)) AS table_column ON table_column.value=constraint_column.value),
      referenced.relation_oid,
      foreign_constraint.is_deferrable,foreign_constraint.is_initially_deferred,
      CASE foreign_constraint.delete_action WHEN 'cascade' THEN 'c' WHEN 'set-null' THEN 'n'
        WHEN 'set-default' THEN 'd' WHEN 'restrict' THEN 'r' ELSE 'a' END,
      CASE foreign_constraint.update_action WHEN 'cascade' THEN 'c' WHEN 'set-null' THEN 'n'
        WHEN 'set-default' THEN 'd' WHEN 'restrict' THEN 'r' ELSE 'a' END,
      0,1,0,1,0,0,0,2606
    FROM __edgepg_foreign_constraints AS foreign_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=foreign_constraint.table_name
    JOIN __edgepg_pg_tables AS referenced ON referenced.physical_name=foreign_constraint.referenced_table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    UNION ALL
    SELECT 60000 + row_number() OVER (ORDER BY exclusion_constraint.table_name, exclusion_constraint.constraint_name),
      exclusion_constraint.constraint_name,'x',tables.relation_oid,schemas.oid,
      (SELECT json_group_array(CAST(table_column.key AS INTEGER)+1)
       FROM json_each(exclusion_constraint.columns_json) AS constraint_column
       JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column
         ON table_column.value=constraint_column.value),
      NULL,NULL,exclusion_constraint.is_deferrable,exclusion_constraint.is_initially_deferred,
      NULL,NULL,0,1,0,1,0,0,0,2606
    FROM __edgepg_exclusion_constraints AS exclusion_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=exclusion_constraint.table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
    UNION ALL
    SELECT 70000 + row_number() OVER (ORDER BY not_null_constraint.table_name, not_null_constraint.constraint_name),
      not_null_constraint.constraint_name,'n',tables.relation_oid,schemas.oid,
      (SELECT json_group_array(CAST(table_column.key AS INTEGER)+1)
       FROM json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS table_column
       WHERE table_column.value=not_null_constraint.column_name),
      NULL,NULL,0,0,NULL,NULL,0,not_null_constraint.validated,not_null_constraint.no_inherit,
      not_null_constraint.is_local,0,not_null_constraint.inherited_count,0,2606
    FROM __edgepg_not_null_constraints AS not_null_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=not_null_constraint.table_name
    JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name`).run();const d=We();await I(e,[e.prepare(d.pgAm),e.prepare(d.pgOperator),e.prepare(d.pgOpfamily),e.prepare(d.pgOpclass),e.prepare(d.pgAmop),e.prepare(d.pgAmproc),e.prepare(d.pgCast),e.prepare(d.pgCollation)]);const S=we();await I(e,[e.prepare(S.pgTsParser),e.prepare(S.pgTsTemplate),e.prepare(S.pgTsDict),e.prepare(S.pgTsConfig),e.prepare(S.pgTsConfigMap)]),await e.prepare(`CREATE VIEW pg_catalog__pg_description AS
    SELECT objoid,classoid,objsubid,description FROM (
      SELECT comments.comment AS description,
        CASE comments.object_type
          WHEN 'OBJECT_SCHEMA' THEN 2615
          WHEN 'OBJECT_TYPE' THEN 1247
          WHEN 'OBJECT_DOMAIN' THEN 1247
          WHEN 'OBJECT_FUNCTION' THEN 1255
          WHEN 'OBJECT_PROCEDURE' THEN 1255
          WHEN 'OBJECT_ROUTINE' THEN 1255
          WHEN 'OBJECT_AGGREGATE' THEN 1255
          WHEN 'OBJECT_LANGUAGE' THEN 2612
          WHEN 'OBJECT_POLICY' THEN 3256
          WHEN 'OBJECT_TRIGGER' THEN 2620
          WHEN 'OBJECT_TABCONSTRAINT' THEN 2606
          WHEN 'OBJECT_COLLATION' THEN 3456
          WHEN 'OBJECT_CONVERSION' THEN 2607
          WHEN 'OBJECT_CAST' THEN 2605
          WHEN 'OBJECT_OPERATOR' THEN 2617
          WHEN 'OBJECT_OPCLASS' THEN 2616
          WHEN 'OBJECT_OPFAMILY' THEN 2753
          WHEN 'OBJECT_ACCESS_METHOD' THEN 2601
          WHEN 'OBJECT_EVENT_TRIGGER' THEN 3466
          WHEN 'OBJECT_DATABASE' THEN 1262
          WHEN 'OBJECT_TABLESPACE' THEN 1213
          WHEN 'OBJECT_EXTENSION' THEN 3079
          WHEN 'OBJECT_FDW' THEN 2328
          WHEN 'OBJECT_FOREIGN_SERVER' THEN 1417
          WHEN 'OBJECT_USER_MAPPING' THEN 1418
          WHEN 'OBJECT_STATISTIC_EXT' THEN 3381
          WHEN 'OBJECT_TSDICTIONARY' THEN 3600
          WHEN 'OBJECT_TSPARSER' THEN 3601
          WHEN 'OBJECT_TSCONFIGURATION' THEN 3602
          WHEN 'OBJECT_TSTEMPLATE' THEN 3764
          ELSE 1259 END AS classoid,
        CASE WHEN comments.object_type='OBJECT_COLUMN' THEN
          COALESCE((SELECT CAST(column_entry.key AS INTEGER)+1
            FROM __edgepg_pg_tables AS tables
            JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_entry
            WHERE column_entry.value=json_extract(comments.identity_json,'$[' || (json_array_length(comments.identity_json)-1) || ']')
              AND ((json_array_length(comments.identity_json)>2
                    AND tables.schema_name=json_extract(comments.identity_json,'$[0]')
                    AND tables.table_name=json_extract(comments.identity_json,'$[1]'))
                OR (json_array_length(comments.identity_json)=2
                    AND tables.schema_name='public'
                    AND tables.table_name=json_extract(comments.identity_json,'$[0]')))
            LIMIT 1),0)
        ELSE 0 END AS objsubid,
        CASE
          WHEN comments.object_type IN ('OBJECT_TABLE','OBJECT_VIEW','OBJECT_INDEX','OBJECT_MATVIEW','OBJECT_SEQUENCE','OBJECT_COLUMN') THEN
            (SELECT relation.oid FROM pg_catalog__pg_class AS relation
             JOIN pg_catalog__pg_namespace AS namespace ON namespace.oid=relation.relnamespace
             WHERE comments.object_type=CASE relation.relkind
                WHEN 'r' THEN CASE WHEN comments.object_type='OBJECT_COLUMN' THEN 'OBJECT_COLUMN' ELSE 'OBJECT_TABLE' END
                WHEN 'm' THEN 'OBJECT_MATVIEW' WHEN 'i' THEN 'OBJECT_INDEX'
                WHEN 'S' THEN 'OBJECT_SEQUENCE' ELSE 'OBJECT_VIEW' END
               AND ((comments.object_type='OBJECT_COLUMN'
                    AND ((json_array_length(comments.identity_json)>2
                          AND namespace.nspname=json_extract(comments.identity_json,'$[0]')
                          AND relation.relname=json_extract(comments.identity_json,'$[1]'))
                      OR (json_array_length(comments.identity_json)=2
                          AND namespace.nspname='public'
                          AND relation.relname=json_extract(comments.identity_json,'$[0]'))))
                 OR (comments.object_type<>'OBJECT_COLUMN'
                    AND (comments.identity_json=json_array(namespace.nspname,relation.relname)
                      OR (namespace.nspname='public' AND comments.identity_json=json_array(relation.relname)))))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_SCHEMA' THEN
            (SELECT oid FROM __edgepg_schemas WHERE name=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type IN ('OBJECT_TYPE','OBJECT_DOMAIN') THEN
            (SELECT oid FROM __edgepg_type_identities WHERE name=
              CASE WHEN json_array_length(comments.identity_json)>1
                THEN json_extract(comments.identity_json,'$[0]') || '__' || json_extract(comments.identity_json,'$[1]')
                ELSE json_extract(comments.identity_json,'$[0]') END LIMIT 1)
          WHEN comments.object_type IN ('OBJECT_FUNCTION','OBJECT_PROCEDURE','OBJECT_ROUTINE') THEN
            (SELECT routine_oid FROM __edgepg_routines WHERE name=
              CASE WHEN json_array_length(comments.identity_json)>1
                THEN json_extract(comments.identity_json,'$[0]') || '__' || json_extract(comments.identity_json,'$[1]')
                ELSE json_extract(comments.identity_json,'$[0]') END
              AND argument_types_json=comments.argument_types_json LIMIT 1)
          WHEN comments.object_type='OBJECT_AGGREGATE' THEN
            (SELECT aggregate.aggregate_oid FROM __edgepg_aggregates AS aggregate
             WHERE aggregate.aggregate_oid=CAST(json_extract(comments.identity_json,'$[0]') AS INTEGER) LIMIT 1)
          WHEN comments.object_type='OBJECT_LANGUAGE' THEN
            (SELECT language.rowid+62000 FROM __edgepg_languages AS language
             WHERE language.name=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_POLICY' THEN
            (SELECT policy.rowid+61000 FROM __edgepg_policies AS policy
             WHERE policy.policy_name=json_extract(comments.identity_json,'$[' || (json_array_length(comments.identity_json)-1) || ']')
               AND ((json_array_length(comments.identity_json)=2
                    AND (policy.display_table_name=json_extract(comments.identity_json,'$[0]')
                      OR policy.display_table_name='public.' || json_extract(comments.identity_json,'$[0]')))
                 OR (json_array_length(comments.identity_json)=3
                    AND policy.display_table_name=json_extract(comments.identity_json,'$[0]') || '.' || json_extract(comments.identity_json,'$[1]')))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_TRIGGER' THEN
            (SELECT trigger.rowid+60000 FROM __edgepg_triggers AS trigger
             WHERE (json_array_length(comments.identity_json)=2
                 AND (trigger.display_name=json_extract(comments.identity_json,'$[0]') || '.' || json_extract(comments.identity_json,'$[1]')
                   OR trigger.display_name='public.' || json_extract(comments.identity_json,'$[0]') || '.' || json_extract(comments.identity_json,'$[1]')))
               OR (json_array_length(comments.identity_json)=3
                 AND trigger.display_name=json_extract(comments.identity_json,'$[0]') || '.' || json_extract(comments.identity_json,'$[1]') || '.' || json_extract(comments.identity_json,'$[2]'))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_TABCONSTRAINT' THEN
            (SELECT constraint_catalog.oid FROM pg_catalog__pg_constraint AS constraint_catalog
             JOIN pg_catalog__pg_class AS relation ON relation.oid=constraint_catalog.conrelid
             JOIN pg_catalog__pg_namespace AS namespace ON namespace.oid=relation.relnamespace
             WHERE constraint_catalog.conname=json_extract(comments.identity_json,'$[' || (json_array_length(comments.identity_json)-1) || ']')
               AND (comments.identity_json=json_array(namespace.nspname,relation.relname,constraint_catalog.conname)
                 OR (namespace.nspname='public' AND comments.identity_json=json_array(relation.relname,constraint_catalog.conname)))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_COLLATION' THEN
            (SELECT collation.oid FROM __edgepg_collations AS collation
             WHERE comments.identity_json=json_array(collation.schema_name,collation.collation_name)
               OR (collation.schema_name='public' AND comments.identity_json=json_array(collation.collation_name))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_CONVERSION' THEN
            (SELECT conversion.oid FROM __edgepg_conversions AS conversion
             WHERE comments.identity_json=json_array(conversion.schema_name,conversion.conversion_name)
               OR (conversion.schema_name='public' AND comments.identity_json=json_array(conversion.conversion_name))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_CAST' THEN
            (SELECT cast_entry.oid FROM __edgepg_casts AS cast_entry
             WHERE CAST(json_extract(comments.identity_json,'$[0]') AS INTEGER)=cast_entry.source_type_oid
               AND CAST(json_extract(comments.identity_json,'$[1]') AS INTEGER)=cast_entry.target_type_oid
             LIMIT 1)
          WHEN comments.object_type='OBJECT_OPERATOR' THEN
            (SELECT operator.oid FROM __edgepg_operators AS operator
             WHERE operator.oid=CAST(json_extract(comments.identity_json,'$[0]') AS INTEGER) LIMIT 1)
          WHEN comments.object_type='OBJECT_OPCLASS' THEN
            (SELECT class.oid FROM __edgepg_operator_classes AS class
             WHERE class.oid=CAST(json_extract(comments.identity_json,'$[0]') AS INTEGER) LIMIT 1)
          WHEN comments.object_type='OBJECT_OPFAMILY' THEN
            (SELECT family.oid FROM __edgepg_operator_families AS family
             WHERE family.oid=CAST(json_extract(comments.identity_json,'$[0]') AS INTEGER) LIMIT 1)
          WHEN comments.object_type='OBJECT_DATABASE' THEN
            (SELECT database.oid FROM __edgepg_databases AS database
             WHERE database.name=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_TABLESPACE' THEN
            (SELECT tablespace.oid FROM pg_catalog__pg_tablespace AS tablespace
             WHERE tablespace.spcname=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_EXTENSION' THEN
            (SELECT extension.oid FROM pg_catalog__pg_extension AS extension
             WHERE extension.extname=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_FDW' THEN
            (SELECT fdw.oid FROM pg_catalog__pg_foreign_data_wrapper AS fdw
             WHERE fdw.fdwname=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_FOREIGN_SERVER' THEN
            (SELECT server.oid FROM pg_catalog__pg_foreign_server AS server
             WHERE server.srvname=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_USER_MAPPING' THEN
            (SELECT mapping.rowid+72000 FROM __edgepg_catalog_objects AS mapping
             WHERE mapping.object_type='user_mapping'
               AND mapping.name=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_FOREIGN_TABLE' THEN
            (SELECT relation.oid FROM pg_catalog__pg_class AS relation
             JOIN pg_catalog__pg_namespace AS namespace ON namespace.oid=relation.relnamespace
             WHERE relation.relkind='f'
               AND (comments.identity_json=json_array(namespace.nspname,relation.relname)
                OR (namespace.nspname='public' AND comments.identity_json=json_array(relation.relname)))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_STATISTIC_EXT' THEN
            (SELECT stats.oid FROM pg_catalog__pg_statistic_ext AS stats
             JOIN pg_catalog__pg_namespace AS namespace ON namespace.oid=stats.stxnamespace
             WHERE comments.identity_json=json_array(namespace.nspname,stats.stxname)
               OR (namespace.nspname='public' AND comments.identity_json=json_array(stats.stxname))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_ACCESS_METHOD' THEN
            (SELECT am.oid FROM __edgepg_access_methods AS am
             WHERE am.amname=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_EVENT_TRIGGER' THEN
            (SELECT event.oid FROM __edgepg_event_triggers AS event
             WHERE event.name=json_extract(comments.identity_json,'$[0]') LIMIT 1)
          WHEN comments.object_type='OBJECT_TSPARSER' THEN
            (SELECT parser.oid FROM __edgepg_ts_parsers AS parser
             WHERE comments.identity_json=json_array(parser.schema_name,parser.parser_name)
               OR (parser.schema_name='public' AND comments.identity_json=json_array(parser.parser_name))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_TSTEMPLATE' THEN
            (SELECT template.oid FROM __edgepg_ts_templates AS template
             WHERE comments.identity_json=json_array(template.schema_name,template.template_name)
               OR (template.schema_name='public' AND comments.identity_json=json_array(template.template_name))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_TSDICTIONARY' THEN
            (SELECT dictionary.oid FROM __edgepg_ts_dictionaries AS dictionary
             WHERE comments.identity_json=json_array(dictionary.schema_name,dictionary.dictionary_name)
               OR (dictionary.schema_name='public' AND comments.identity_json=json_array(dictionary.dictionary_name))
             LIMIT 1)
          WHEN comments.object_type='OBJECT_TSCONFIGURATION' THEN
            (SELECT configuration.oid FROM __edgepg_ts_configurations AS configuration
             WHERE comments.identity_json=json_array(configuration.schema_name,configuration.configuration_name)
               OR (configuration.schema_name='public' AND comments.identity_json=json_array(configuration.configuration_name))
             LIMIT 1)
        END AS objoid
      FROM __edgepg_comments AS comments
    ) WHERE objoid IS NOT NULL`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_seclabel AS
    SELECT objoid,classoid,objsubid,provider,label FROM (
      SELECT
        CASE labels.object_type
          WHEN 'OBJECT_TABLE' THEN (SELECT tables.relation_oid FROM __edgepg_pg_tables AS tables
            WHERE tables.table_name=CASE WHEN json_array_length(labels.identity_json)=1 THEN json_extract(labels.identity_json,'$[0]')
              ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-1) || ']') END
              AND tables.schema_name=CASE
                WHEN json_array_length(labels.identity_json)=1 THEN 'public'
                ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-2) || ']') END LIMIT 1)
          WHEN 'OBJECT_COLUMN' THEN (SELECT tables.relation_oid FROM __edgepg_pg_tables AS tables
            WHERE tables.table_name=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-2) || ']')
              AND tables.schema_name=CASE
                WHEN json_array_length(labels.identity_json)=2 THEN 'public'
                ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-3) || ']') END LIMIT 1)
          WHEN 'OBJECT_SCHEMA' THEN (SELECT namespace.oid FROM pg_catalog__pg_namespace AS namespace
            WHERE namespace.nspname=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-1) || ']') LIMIT 1)
          WHEN 'OBJECT_DATABASE' THEN (SELECT database.oid FROM pg_catalog__pg_database AS database
            WHERE database.datname=json_extract(labels.identity_json,'$[0]') LIMIT 1)
          WHEN 'OBJECT_ACCESS_METHOD' THEN (SELECT access_method.oid FROM pg_catalog__pg_am AS access_method
            WHERE access_method.amname=json_extract(labels.identity_json,'$[0]') LIMIT 1)
          WHEN 'OBJECT_EVENT_TRIGGER' THEN (SELECT event_trigger.oid FROM pg_catalog__pg_event_trigger AS event_trigger
            WHERE event_trigger.evtname=json_extract(labels.identity_json,'$[0]') LIMIT 1)
          WHEN 'OBJECT_COLLATION' THEN (SELECT collation.oid FROM pg_catalog__pg_collation AS collation
            WHERE collation.collname=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-1) || ']')
              AND collation.collnamespace=(SELECT oid FROM pg_catalog__pg_namespace WHERE nspname=CASE
                WHEN json_array_length(labels.identity_json)=1 THEN 'public'
                ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-2) || ']') END) LIMIT 1)
          WHEN 'OBJECT_CONVERSION' THEN (SELECT conversion.oid FROM pg_catalog__pg_conversion AS conversion
            WHERE conversion.conname=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-1) || ']')
              AND conversion.connamespace=(SELECT oid FROM pg_catalog__pg_namespace WHERE nspname=CASE
                WHEN json_array_length(labels.identity_json)=1 THEN 'public'
                ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-2) || ']') END) LIMIT 1)
        END AS objoid,
        CASE labels.object_type
          WHEN 'OBJECT_SCHEMA' THEN 2615
          WHEN 'OBJECT_DATABASE' THEN 1262
          WHEN 'OBJECT_ACCESS_METHOD' THEN 2601
          WHEN 'OBJECT_EVENT_TRIGGER' THEN 3466
          WHEN 'OBJECT_COLLATION' THEN 3456
          WHEN 'OBJECT_CONVERSION' THEN 2607
          ELSE 1259
        END AS classoid,
        CASE labels.object_type WHEN 'OBJECT_COLUMN' THEN COALESCE((SELECT CAST(column_name.key AS INTEGER)+1
          FROM __edgepg_pg_tables AS tables
          JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_name
          WHERE tables.table_name=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-2) || ']')
              AND tables.schema_name=CASE
                WHEN json_array_length(labels.identity_json)=2 THEN 'public'
                ELSE json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-3) || ']') END
            AND column_name.value=json_extract(labels.identity_json,'$[' || (json_array_length(labels.identity_json)-1) || ']') LIMIT 1),0)
          ELSE 0 END AS objsubid,
        labels.provider,labels.label
      FROM __edgepg_security_labels AS labels
    ) WHERE objoid IS NOT NULL`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_seclabels AS
    SELECT label,provider,classoid,objoid,objsubid FROM pg_catalog__pg_seclabel`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_roles AS
    SELECT rowid+20000 AS oid,name AS rolname,is_superuser AS rolsuper,inherit_role AS rolinherit,
      create_role AS rolcreaterole,create_db AS rolcreatedb,can_login AS rolcanlogin,
      replication AS rolreplication,connection_limit AS rolconnlimit,NULL AS rolpassword,
      valid_until AS rolvaliduntil,bypass_rls AS rolbypassrls,
      (SELECT CASE WHEN count(*)=0 THEN NULL ELSE json_group_array(setting_name || '=' || setting_value) END
       FROM (SELECT setting_name,setting_value FROM __edgepg_role_settings AS setting
         WHERE setting.role_name=__edgepg_roles.name AND setting.database_name='' ORDER BY setting_name)) AS rolconfig
    FROM __edgepg_roles`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_authid AS
    SELECT rowid+20000 AS oid,name AS rolname,is_superuser AS rolsuper,inherit_role AS rolinherit,
      create_role AS rolcreaterole,create_db AS rolcreatedb,can_login AS rolcanlogin,
      replication AS rolreplication,bypass_rls AS rolbypassrls,connection_limit AS rolconnlimit,
      NULL AS rolpassword,valid_until AS rolvaliduntil
    FROM __edgepg_roles`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_extension AS
    SELECT rowid+30000 AS oid,
      name AS extname,
      COALESCE((SELECT role.rowid+20000 FROM __edgepg_roles AS role
        WHERE role.name=__edgepg_pg_extensions.owner_name),10) AS extowner,
      COALESCE((SELECT namespace.oid FROM pg_catalog__pg_namespace AS namespace
        WHERE namespace.nspname=__edgepg_pg_extensions.schema_name),2200) AS extnamespace,
      1 AS extrelocatable,
      version AS extversion,
      NULL AS extconfig,
      NULL AS extcondition
    FROM __edgepg_pg_extensions`).run(),await e.prepare(ln()).run(),await e.prepare(pn()).run(),await e.prepare(cn()).run(),await I(e,[e.prepare(rn()),e.prepare(gn()),e.prepare(Nn()),e.prepare(mn()),e.prepare(Sn()),e.prepare(Tn()),e.prepare(dn())]),await e.prepare(`CREATE VIEW pg_catalog__pg_db_role_setting AS
    SELECT CASE WHEN database_name='' THEN 0 ELSE COALESCE((SELECT oid FROM __edgepg_databases WHERE name=database_name),0) END AS setdatabase,
      CASE WHEN role_name='' THEN 0 ELSE COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=role_name),0) END AS setrole,
      '{' || group_concat(setting_name || '=' || setting_value, ',') || '}' AS setconfig
    FROM (SELECT role_name,database_name,setting_name,setting_value FROM __edgepg_role_settings
      ORDER BY role_name,database_name,setting_name)
    GROUP BY role_name,database_name`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_parameter_acl AS
    SELECT MIN(rowid)+50000 AS oid,parameter_name AS parname,
      '{' || group_concat(grantee || '=' || CASE privilege_type WHEN 'SET' THEN 's' ELSE 'A' END
        || CASE WHEN is_grantable=1 THEN '*' ELSE '' END || '/' || grantor, ',') || '}' AS paracl
    FROM __edgepg_parameter_privileges GROUP BY parameter_name`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_auth_members AS
    SELECT membership.rowid+30000 AS oid,role.rowid+20000 AS roleid,member.rowid+20000 AS member,
      grantor.rowid+20000 AS grantor,membership.admin_option,membership.inherit_option,membership.set_option
    FROM __edgepg_role_memberships AS membership
    JOIN __edgepg_roles AS role ON role.name=membership.role_name
    JOIN __edgepg_roles AS member ON member.name=membership.member_name
    JOIN __edgepg_roles AS grantor ON grantor.name=membership.grantor`).run(),await e.prepare(`CREATE VIEW pg_catalog__pg_policies AS
    SELECT CASE WHEN instr(display_table_name,'.')>0 THEN substr(display_table_name,1,instr(display_table_name,'.')-1)
        ELSE 'public' END AS schemaname,
      CASE WHEN instr(display_table_name,'.')>0 THEN substr(display_table_name,instr(display_table_name,'.')+1)
        ELSE display_table_name END AS tablename,
      policy_name AS policyname,
      CASE WHEN permissive=1 THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END AS permissive,
      (SELECT '{' || COALESCE(group_concat(CAST(value AS TEXT),','),'') || '}' FROM json_each(roles_json)) AS roles,
      upper(command_name) AS cmd, using_expression AS qual, check_expression AS with_check
    FROM __edgepg_policies`).run(),await e.prepare(`CREATE VIEW information_schema__tables AS
    SELECT schema_name AS table_schema, table_name, 'BASE TABLE' AS table_type
    FROM __edgepg_pg_tables`).run(),await e.prepare(`CREATE VIEW information_schema__role_table_grants AS
    SELECT grantor,grantee,'app' AS table_catalog,schema_name AS table_schema,table_name,
      privilege_type,CASE WHEN is_grantable=1 THEN 'YES' ELSE 'NO' END AS is_grantable,
      'NO' AS with_hierarchy FROM __edgepg_table_privileges`).run(),await e.prepare(`CREATE VIEW information_schema__table_privileges AS
    SELECT * FROM information_schema__role_table_grants`).run(),await e.prepare(`CREATE VIEW information_schema__role_column_grants AS
    SELECT grantor,grantee,'app' AS table_catalog,schema_name AS table_schema,table_name,column_name,
      privilege_type,CASE WHEN is_grantable=1 THEN 'YES' ELSE 'NO' END AS is_grantable
    FROM __edgepg_column_privileges`).run(),await e.prepare(`CREATE VIEW information_schema__column_privileges AS
    SELECT * FROM information_schema__role_column_grants`).run(),await e.prepare(Ze()).run(),await e.prepare(`CREATE VIEW information_schema__sequences AS
    SELECT 'app' AS sequence_catalog,
      CASE WHEN instr(sequence.name,'__')>0 THEN substr(sequence.name,1,instr(sequence.name,'__')-1)
        ELSE 'public' END AS sequence_schema,
      CASE WHEN instr(sequence.name,'__')>0 THEN substr(sequence.name,instr(sequence.name,'__')+2)
        ELSE sequence.name END AS sequence_name,
      sequence.data_type AS data_type,
      CASE sequence.data_type WHEN 'smallint' THEN 16 WHEN 'integer' THEN 32 ELSE 64 END AS numeric_precision,
      2 AS numeric_precision_radix,0 AS numeric_scale,
      CAST(sequence.start_value AS TEXT) AS start_value,
      CAST(sequence.min_value AS TEXT) AS minimum_value,
      CAST(sequence.max_value AS TEXT) AS maximum_value,
      CAST(sequence.increment_value AS TEXT) AS increment,
      CASE sequence.cycle WHEN 1 THEN 'YES' ELSE 'NO' END AS cycle_option
    FROM __edgepg_sequences AS sequence
    WHERE NOT EXISTS (SELECT 1 FROM __edgepg_sequence_defaults AS sequence_default
      WHERE sequence_default.sequence_name=sequence.name)`).run(),await e.prepare(`CREATE VIEW information_schema__schemata AS
    SELECT 'app' AS catalog_name, name AS schema_name, owner_name AS schema_owner,
      NULL AS default_character_set_catalog, NULL AS default_character_set_schema,
      NULL AS default_character_set_name, NULL AS sql_path
    FROM __edgepg_schemas`).run(),await e.prepare(`CREATE VIEW information_schema__table_constraints AS
    SELECT 'app' AS constraint_catalog, tables.schema_name AS constraint_schema,
      unique_constraint.constraint_name, 'app' AS table_catalog, tables.schema_name AS table_schema,
      tables.table_name, CASE unique_constraint.kind WHEN 'primary' THEN 'PRIMARY KEY' ELSE 'UNIQUE' END AS constraint_type,
      CASE unique_constraint.is_deferrable WHEN 1 THEN 'YES' ELSE 'NO' END AS is_deferrable,
      CASE unique_constraint.is_initially_deferred WHEN 1 THEN 'YES' ELSE 'NO' END AS initially_deferred,
      'YES' AS enforced, CASE unique_constraint.nulls_not_distinct WHEN 1 THEN 'NO' ELSE 'YES' END AS nulls_distinct
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    UNION ALL
    SELECT 'app', tables.schema_name, foreign_constraint.constraint_name, 'app', tables.schema_name,
      tables.table_name, 'FOREIGN KEY',
      CASE foreign_constraint.is_deferrable WHEN 1 THEN 'YES' ELSE 'NO' END,
      CASE foreign_constraint.is_initially_deferred WHEN 1 THEN 'YES' ELSE 'NO' END,
      CASE foreign_constraint.validated WHEN 1 THEN 'YES' ELSE 'NO' END, NULL
    FROM __edgepg_foreign_constraints AS foreign_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=foreign_constraint.table_name
    UNION ALL
    SELECT 'app', tables.schema_name, check_constraint.constraint_name, 'app', tables.schema_name,
      tables.table_name, 'CHECK', 'NO', 'NO',
      CASE check_constraint.enforced WHEN 1 THEN 'YES' ELSE 'NO' END, NULL
    FROM __edgepg_check_constraints AS check_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=check_constraint.table_name
    UNION ALL
    SELECT 'app', tables.schema_name, exclusion_constraint.constraint_name, 'app', tables.schema_name,
      tables.table_name, 'EXCLUDE',
      CASE exclusion_constraint.is_deferrable WHEN 1 THEN 'YES' ELSE 'NO' END,
      CASE exclusion_constraint.is_initially_deferred WHEN 1 THEN 'YES' ELSE 'NO' END,
      'YES', NULL
    FROM __edgepg_exclusion_constraints AS exclusion_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=exclusion_constraint.table_name`).run(),await e.prepare(`CREATE VIEW information_schema__key_column_usage AS
    SELECT 'app' AS constraint_catalog, tables.schema_name AS constraint_schema,
      unique_constraint.constraint_name, 'app' AS table_catalog, tables.schema_name AS table_schema,
      tables.table_name, CAST(constraint_column.value AS TEXT) AS column_name,
      CAST(constraint_column.key AS INTEGER)+1 AS ordinal_position, NULL AS position_in_unique_constraint
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    JOIN json_each(unique_constraint.columns_json) AS constraint_column
    UNION ALL
    SELECT 'app', tables.schema_name, foreign_constraint.constraint_name, 'app', tables.schema_name,
      tables.table_name, CAST(constraint_column.value AS TEXT), CAST(constraint_column.key AS INTEGER)+1,
      CAST(constraint_column.key AS INTEGER)+1
    FROM __edgepg_foreign_constraints AS foreign_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=foreign_constraint.table_name
    JOIN json_each(foreign_constraint.columns_json) AS constraint_column`).run(),await Qe(e),h.add(t),H.set(t,Date.now()),u.add(t),A.add(t),L.add(t),C(t)}async function Ve(e,n){const t=crypto.randomUUID(),a=Date.now()+Je;for(await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_catalog_install_leases (
    name TEXT PRIMARY KEY,owner TEXT NOT NULL,expires_at INTEGER NOT NULL)`).run();;){const o=Date.now();if(await e.prepare(`INSERT INTO __edgepg_catalog_install_leases(name,owner,expires_at)
      VALUES('postgres-catalog',?1,?2)
      ON CONFLICT(name) DO UPDATE SET owner=excluded.owner,expires_at=excluded.expires_at
      WHERE __edgepg_catalog_install_leases.expires_at<=?3`).bind(t,o+Be,o).run(),(await e.prepare(`SELECT owner FROM __edgepg_catalog_install_leases
      WHERE name='postgres-catalog'`).first())?.owner===t)break;if(o>=a)throw new Error("timed out waiting for PostgreSQL catalog initialization");await new Promise(l=>setTimeout(l,qe))}try{await n()}finally{await e.prepare(`DELETE FROM __edgepg_catalog_install_leases
      WHERE name='postgres-catalog' AND owner=?1`).bind(t).run()}}async function me(e){try{const n=await e.prepare(`SELECT schema_version FROM __edgepg_catalog_meta
      WHERE key='postgres-catalog'`).first();return Number(n?.schema_version||0)===X&&await Se(e)}catch(n){if(/no such table:\s*__edgepg_catalog_meta/iu.test(n instanceof Error?n.message:String(n)))return!1;throw n}}async function ne(e){try{const n=await e.prepare(`SELECT key,schema_version FROM __edgepg_catalog_meta
      WHERE key IN ('postgres-catalog','postgres-catalog-storage')
      ORDER BY CASE key WHEN 'postgres-catalog' THEN 0 ELSE 1 END LIMIT 1`).first();return Number(n?.schema_version||0)===X&&await J(e)}catch(n){if(/no such table:\s*__edgepg_catalog_meta/iu.test(n instanceof Error?n.message:String(n)))return!1;throw n}}async function Ye(e){try{const n=await e.prepare(`SELECT key,schema_version FROM __edgepg_catalog_meta
      WHERE key IN ('postgres-catalog','postgres-catalog-storage','postgres-catalog-table-storage')
      ORDER BY CASE key WHEN 'postgres-catalog' THEN 0 WHEN 'postgres-catalog-storage' THEN 1 ELSE 2 END LIMIT 1`).first();return Number(n?.schema_version||0)===X&&await B(e,"__edgepg_pg_tables")}catch(n){if(/no such table:\s*__edgepg_catalog_meta/iu.test(n instanceof Error?n.message:String(n)))return!1;throw n}}async function B(e,n){return!!await e.prepare(`SELECT 1 AS present FROM sqlite_master
    WHERE type='table' AND name=?1`).bind(n).first()}async function te(e,n){return!!await e.prepare(`SELECT 1 AS present FROM sqlite_master
    WHERE type='view' AND name=?1`).bind(n).first()}async function J(e){const n=await e.prepare(`SELECT name FROM sqlite_master
    WHERE type='table' AND name IN (?1,?2)`).bind("__edgepg_pg_tables","__edgepg_pg_objects").all(),t=new Set((n.results||[]).map(a=>a.name));return t.has("__edgepg_pg_tables")&&t.has("__edgepg_pg_objects")}async function Se(e){return await J(e)&&await te(e,"pg_catalog__pg_class")&&await te(e,"pg_catalog__pg_policies")&&await te(e,"information_schema__columns")}function q(e){const n=f(e);h.delete(n),H.delete(n),u.delete(n),A.delete(n),L.delete(n),R.delete(n),$.delete(n)}function G(e,n){return Date.now()-(e.get(n)||0)<Z}function C(e){const n=Date.now();R.set(e,n),$.set(e,n)}async function ze(e){if(!await B(e,"__edgepg_pg_objects")){await e.batch([e.prepare(ee),e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_oid_allocator (
        id INTEGER PRIMARY KEY CHECK(id=1), next_oid INTEGER NOT NULL)`),e.prepare(`INSERT OR IGNORE INTO __edgepg_oid_allocator(id,next_oid)
        VALUES (1, MAX(
          COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384),
          COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_objects WHERE kind IN ('view','index')),16384)))`),e.prepare(`UPDATE __edgepg_oid_allocator SET next_oid=MAX(next_oid,
        COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384),
        COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_objects WHERE kind IN ('view','index')),16384)) WHERE id=1`),e.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_pg_objects_relation_oid
        ON __edgepg_pg_objects(relation_oid) WHERE relation_oid IS NOT NULL`),e.prepare("DROP TRIGGER IF EXISTS __edgepg_pg_objects_assign_oid"),e.prepare(`CREATE TRIGGER IF NOT EXISTS __edgepg_pg_objects_assign_oid
        AFTER INSERT ON __edgepg_pg_objects WHEN NEW.kind IN ('view','index') AND NEW.relation_oid IS NULL BEGIN
          UPDATE __edgepg_pg_objects SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
            WHERE phase=NEW.phase AND kind=NEW.kind AND schema_name=NEW.schema_name AND object_name=NEW.object_name;
          UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1;
        END`)]);return}await e.prepare(ee).run();const n=await e.prepare("PRAGMA table_info('__edgepg_pg_objects')").all();n.results.some(o=>o.name==="dependencies_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN dependencies_json TEXT NOT NULL DEFAULT '[]'").run(),n.results.some(o=>o.name==="routine_dependencies_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN routine_dependencies_json TEXT NOT NULL DEFAULT '[]'").run(),n.results.some(o=>o.name==="view_definition")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN view_definition TEXT").run(),n.results.some(o=>o.name==="compact_view_definition")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN compact_view_definition TEXT").run(),n.results.some(o=>o.name==="relation_oid")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_oid INTEGER").run(),n.results.some(o=>o.name==="owner_name")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN owner_name TEXT NOT NULL DEFAULT 'edgepg'").run(),n.results.some(o=>o.name==="relation_natts")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_natts INTEGER NOT NULL DEFAULT 0").run(),n.results.some(o=>o.name==="relation_pg_types_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_pg_types_json TEXT NOT NULL DEFAULT '[]'").run(),n.results.some(o=>o.name==="relation_collations_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN relation_collations_json TEXT NOT NULL DEFAULT '[]'").run(),n.results.some(o=>o.name==="reloptions_json")||await e.prepare("ALTER TABLE __edgepg_pg_objects ADD COLUMN reloptions_json TEXT NOT NULL DEFAULT '[]'").run();const t=(await e.prepare(`SELECT phase,schema_name,object_name,view_definition
    FROM __edgepg_pg_objects WHERE kind='view' AND view_definition IS NOT NULL
      AND compact_view_definition IS NULL`).all()).results;for(const o of t)await e.prepare(`UPDATE __edgepg_pg_objects
    SET compact_view_definition=?4 WHERE phase=?1 AND kind='view' AND schema_name=?2 AND object_name=?3`).bind(o.phase,o.schema_name,o.object_name,le(o.view_definition)).run();await e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_oid_allocator (
    id INTEGER PRIMARY KEY CHECK(id=1), next_oid INTEGER NOT NULL)`).run(),await e.prepare(`INSERT OR IGNORE INTO __edgepg_oid_allocator(id,next_oid)
    VALUES (1, MAX(
      COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384),
      COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_objects WHERE kind IN ('view','index')),16384)))`).run(),await e.prepare(`UPDATE __edgepg_oid_allocator SET next_oid=MAX(next_oid,
    COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_tables),16384),
    COALESCE((SELECT MAX(relation_oid)+1 FROM __edgepg_pg_objects WHERE kind IN ('view','index')),16384)) WHERE id=1`).run();const a=(await e.prepare(`SELECT phase,kind,schema_name,object_name
    FROM __edgepg_pg_objects WHERE kind IN ('view','index') AND relation_oid IS NULL
    ORDER BY ordinal,schema_name,object_name`).all()).results;for(const o of a)await e.batch([e.prepare(`UPDATE __edgepg_pg_objects SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
      WHERE phase=?1 AND kind=?2 AND schema_name=?3 AND object_name=?4`).bind(o.phase,o.kind,o.schema_name,o.object_name),e.prepare("UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1")]);await e.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS __edgepg_pg_objects_relation_oid
    ON __edgepg_pg_objects(relation_oid) WHERE relation_oid IS NOT NULL`).run(),await e.prepare("DROP TRIGGER IF EXISTS __edgepg_pg_objects_assign_oid").run(),await e.prepare(`CREATE TRIGGER IF NOT EXISTS __edgepg_pg_objects_assign_oid
    AFTER INSERT ON __edgepg_pg_objects WHEN NEW.kind IN ('view','index') AND NEW.relation_oid IS NULL BEGIN
      UPDATE __edgepg_pg_objects SET relation_oid=(SELECT next_oid FROM __edgepg_oid_allocator WHERE id=1)
        WHERE phase=NEW.phase AND kind=NEW.kind AND schema_name=NEW.schema_name AND object_name=NEW.object_name;
      UPDATE __edgepg_oid_allocator SET next_oid=next_oid+1 WHERE id=1;
    END`).run()}async function Vn(e){await e.batch(k(e,"postgres-catalog-table-storage"))}async function Ke(e){await e.batch(k(e,"postgres-catalog-storage"))}async function Qe(e){await e.batch(k(e,"postgres-catalog"))}function k(e,n){return[e.prepare(`CREATE TABLE IF NOT EXISTS __edgepg_catalog_meta (
      key TEXT PRIMARY KEY,
      schema_version INTEGER NOT NULL,
      installed_at TEXT NOT NULL
    )`),e.prepare(`INSERT INTO __edgepg_catalog_meta(key,schema_version,installed_at)
      VALUES (?1, ?2, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        schema_version=excluded.schema_version,
        installed_at=excluded.installed_at`).bind(n,X)]}async function I(e,n){for(let t=0;t<n.length;t+=50)await e.batch(n.slice(t,t+50))}function Ze(){return`CREATE VIEW information_schema__columns AS
    ${tn()}`}function en(){return`CREATE VIEW pg_catalog__pg_attrdef AS
    SELECT 2604 AS tableoid,
      tables.relation_oid * 2048 + CAST(column_name.key AS INTEGER) + 1 AS oid,
      tables.relation_oid AS adrelid,
      CAST(column_name.key AS INTEGER) + 1 AS adnum,
      ${nn("json_extract(tables.current_defaults_json, '$[' || column_name.key || ']')","json_extract(COALESCE(tables.current_pg_types_json,tables.pg_types_json), '$[' || column_name.key || ']')")} AS adbin
    FROM __edgepg_pg_tables AS tables
    JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_name
    WHERE json_type(tables.current_defaults_json, '$[' || column_name.key || ']') IS NOT NULL
      AND json_type(tables.current_defaults_json, '$[' || column_name.key || ']') <> 'null'`}function nn(e,n){const t=`CAST(${e} AS TEXT)`;return`CASE ${n?`WHEN lower(replace(trim(CAST(${n} AS TEXT)), 'pg_catalog.', '')) IN ('boolean','bool')
        AND lower(trim(${t})) IN ('1','true') THEN 'true'
      WHEN lower(replace(trim(CAST(${n} AS TEXT)), 'pg_catalog.', '')) IN ('boolean','bool')
        AND lower(trim(${t})) IN ('0','false') THEN 'false'
      `:""}WHEN instr(lower(${t}), 'strftime(')>0
      AND instr(lower(${t}), '''now''')>0 THEN 'now()'
    WHEN upper(trim(${t}))='CURRENT_TIMESTAMP' THEN 'now()'
    ELSE ${t} END`}function tn(){const e="json_extract(tables.current_defaults_json, '$[' || column_name.key || ']')",n="physical_column.dflt_value",t=`COALESCE(json_extract(tables.current_not_null_json,
      '$[' || column_name.key || ']'), 0)=1
    OR EXISTS (SELECT 1 FROM __edgepg_not_null_constraints AS not_null_constraint
      WHERE not_null_constraint.table_name=tables.physical_name
        AND not_null_constraint.column_name=column_name.value)
    OR EXISTS (SELECT 1 FROM __edgepg_unique_constraints AS primary_constraint,
        json_each(primary_constraint.columns_json) AS primary_column
      WHERE primary_constraint.table_name=tables.physical_name
        AND primary_constraint.kind='primary' AND primary_column.value=column_name.value)`;return`${de({isNullableSql:`CASE WHEN ${t}
        THEN 'NO' ELSE 'YES' END`,defaultSql:e,fromSql:Te(),whereSql:"WHERE tables.current_not_null_json IS NOT NULL AND tables.current_defaults_json IS NOT NULL"})}
    UNION ALL
    ${de({isNullableSql:`CASE WHEN tables.current_not_null_json IS NOT NULL
        THEN CASE WHEN ${t} THEN 'NO' ELSE 'YES' END
      WHEN COALESCE(physical_column.[notnull],0)=1 THEN 'NO' ELSE 'YES' END`,defaultSql:`CASE WHEN tables.current_defaults_json IS NOT NULL THEN ${e} ELSE ${n} END`,fromSql:`${Te()}
    LEFT JOIN pragma_table_info(tables.physical_name) AS physical_column ON physical_column.name=column_name.value`,whereSql:"WHERE tables.current_not_null_json IS NULL OR tables.current_defaults_json IS NULL"})}
    UNION ALL
    ${an()}`}function Te(){const e=`CASE WHEN object.schema_name IN ('','public') THEN object.object_name
      ELSE object.schema_name || '__' || object.object_name END`,n="CASE WHEN object.relation_natts>0 THEN object.relation_natts ELSE 2147483647 END",t=`(SELECT json_group_array(name) FROM (
      SELECT name FROM pragma_table_info(${e})
      WHERE cid<${n} ORDER BY cid))`,a=`(SELECT json_group_array(CASE WHEN trim(type)='' THEN 'text' ELSE lower(type) END) FROM (
      SELECT type FROM pragma_table_info(${e})
      WHERE cid<${n} ORDER BY cid))`;return`FROM (
      SELECT schema_name,table_name,physical_name,columns_json,pg_types_json,
        current_columns_json,current_pg_types_json,current_attnums_json,current_not_null_json,current_defaults_json,
        generated_columns_json
      FROM __edgepg_pg_tables
      UNION ALL
      SELECT object.schema_name,object.object_name,${e},
        COALESCE(${t},'[]'),
        CASE WHEN json_array_length(object.relation_pg_types_json)>0
          THEN object.relation_pg_types_json ELSE COALESCE(${a},'[]') END,
        COALESCE(${t},'[]'),
        CASE WHEN json_array_length(object.relation_pg_types_json)>0
          THEN object.relation_pg_types_json ELSE COALESCE(${a},'[]') END,
        (SELECT COALESCE(json_group_array(cid+1),'[]') FROM pragma_table_info(${e})
          WHERE cid<${n}),
        '[]','[]','[]'
      FROM __edgepg_pg_objects AS object
      WHERE object.kind='view'
    ) AS tables
    JOIN json_each(COALESCE(tables.current_columns_json,tables.columns_json)) AS column_name
    JOIN json_each(COALESCE(tables.current_pg_types_json,tables.pg_types_json)) AS pg_type ON pg_type.key=column_name.key`}function de(e){const n="lower(replace(CAST(pg_type.value AS TEXT), 'pg_catalog.', ''))",t=`(CASE WHEN instr(${n}, '(')>0
    THEN trim(substr(${n}, 1, instr(${n}, '(')-1)) ELSE ${n} END)`,a=`(CASE WHEN ${t}='numeric_text' THEN 'numeric' ELSE ${t} END)`,o=`(CASE WHEN ${a}='varchar'
    THEN 'character varying' ELSE ${a} END)`,g=Ln("pg_type.value"),l=On("pg_type.value"),E=`(SELECT sequence_default.mode FROM __edgepg_sequence_defaults AS sequence_default
    WHERE sequence_default.table_name=tables.physical_name AND sequence_default.column_name=column_name.value
      AND sequence_default.mode IN ('always','default') LIMIT 1)`,c=`(SELECT sequence_default.sequence_name FROM __edgepg_sequence_defaults AS sequence_default
    WHERE sequence_default.table_name=tables.physical_name AND sequence_default.column_name=column_name.value
      AND sequence_default.mode IN ('always','default') LIMIT 1)`,N=s=>`(SELECT CAST(sequence.${s} AS TEXT) FROM __edgepg_sequences AS sequence
    WHERE sequence.name=${c})`;return`SELECT 'app' AS table_catalog, tables.schema_name AS table_schema, tables.table_name,
      CAST(column_name.value AS TEXT) AS column_name,
      COALESCE(CAST(json_extract(tables.current_attnums_json, '$[' || column_name.key || ']') AS INTEGER),
        CAST(column_name.key AS INTEGER)+1) AS ordinal_position,
      CASE WHEN ${E} IS NOT NULL THEN 'NO' ELSE ${e.isNullableSql} END AS is_nullable,
      CASE WHEN ${a} IN ('boolean','bool')
          AND lower(COALESCE(${e.defaultSql}, '')) IN ('1','true')
        THEN 'true'
        WHEN ${a} IN ('boolean','bool')
          AND lower(COALESCE(${e.defaultSql}, '')) IN ('0','false')
        THEN 'false'
        WHEN lower(COALESCE(${e.defaultSql}, '')) LIKE '%strftime(%now%'
        OR upper(COALESCE(${e.defaultSql}, ''))='CURRENT_TIMESTAMP'
        THEN 'now()' ELSE ${e.defaultSql} END AS column_default,
      ${o} AS data_type,
      'pg_catalog' AS udt_schema,
      ${a} AS udt_name,
      NULL AS character_maximum_length, ${g} AS numeric_precision,
      ${l} AS numeric_scale,
      CASE WHEN lower(CAST(pg_type.value AS TEXT)) IN (
        'time', 'timetz', 'time without time zone', 'time with time zone',
        'timestamp', 'timestamptz', 'timestamp without time zone', 'timestamp with time zone', 'interval'
      ) THEN 6 ELSE NULL END AS datetime_precision,
      CASE WHEN ${E} IS NULL THEN 'NO' ELSE 'YES' END AS is_identity,
      CASE ${E} WHEN 'always' THEN 'ALWAYS' WHEN 'default' THEN 'BY DEFAULT' ELSE NULL END AS identity_generation,
      ${N("start_value")} AS identity_start,
      ${N("increment_value")} AS identity_increment,
      ${N("max_value")} AS identity_maximum,
      ${N("min_value")} AS identity_minimum,
      CASE WHEN ${E} IS NULL THEN 'NO'
        WHEN (SELECT sequence.cycle FROM __edgepg_sequences AS sequence WHERE sequence.name=${c})=1
        THEN 'YES' ELSE 'NO' END AS identity_cycle,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(tables.generated_columns_json) AS generated
        WHERE json_extract(generated.value,'$.column')=column_name.value) THEN 'ALWAYS' ELSE 'NEVER' END AS is_generated,
      (SELECT json_extract(generated.value,'$.expressionSql') FROM json_each(tables.generated_columns_json) AS generated
        WHERE json_extract(generated.value,'$.column')=column_name.value LIMIT 1) AS generation_expression
    ${e.fromSql}
    ${e.whereSql}`}function an(){const e="upper(trim(COALESCE(physical_column.type,'')))",n=`(CASE
    WHEN ${e} LIKE '%INT%' THEN 'integer'
    WHEN ${e} LIKE '%CHAR%' OR ${e} LIKE '%CLOB%' OR ${e} LIKE '%TEXT%' THEN 'text'
    WHEN ${e} LIKE '%BLOB%' OR ${e}='' THEN 'bytea'
    WHEN ${e} LIKE '%REAL%' OR ${e} LIKE '%FLOA%' OR ${e} LIKE '%DOUB%' THEN 'double precision'
    WHEN ${e} LIKE '%NUM%' OR ${e} LIKE '%DEC%' THEN 'numeric'
    WHEN ${e} LIKE '%BOOL%' THEN 'boolean'
    WHEN ${e} LIKE '%DATE%' AND ${e} NOT LIKE '%TIME%' THEN 'date'
    WHEN ${e} LIKE '%TIME%' THEN 'timestamp'
    ELSE lower(${e}) END)`;return`SELECT 'app' AS table_catalog, materialized.schema_name AS table_schema,
      materialized.relation_name AS table_name, physical_column.name AS column_name,
      physical_column.cid+1 AS ordinal_position,
      CASE WHEN physical_column.[notnull]=1 THEN 'NO' ELSE 'YES' END AS is_nullable,
      physical_column.dflt_value AS column_default,
      ${n} AS data_type, 'pg_catalog' AS udt_schema, ${n} AS udt_name,
      NULL AS character_maximum_length, NULL AS numeric_precision, NULL AS numeric_scale,
      NULL AS datetime_precision, 'NO' AS is_identity, NULL AS identity_generation,
      NULL AS identity_start, NULL AS identity_increment, NULL AS identity_maximum, NULL AS identity_minimum,
      'NO' AS identity_cycle,
      'NEVER' AS is_generated, NULL AS generation_expression
    FROM __edgepg_materialized_views AS materialized
    JOIN pragma_table_info(CASE WHEN materialized.populated=1 THEN materialized.name
      ELSE '__edgepg_unpopulated__' || materialized.name END) AS physical_column
    WHERE materialized.relation_name<>''`}function _n(){const e=U("entry.grantor");return`CREATE VIEW pg_catalog__pg_namespace AS
    WITH acl_entries AS (
      SELECT schema.name AS schema_name,schema.owner_name,
        privilege.grantor,privilege.grantee,
        MAX(CASE WHEN privilege.privilege_type='USAGE' THEN 1 ELSE 0 END) AS has_usage,
        MAX(CASE WHEN privilege.privilege_type='USAGE' THEN privilege.is_grantable ELSE 0 END) AS usage_grantable,
        MAX(CASE WHEN privilege.privilege_type='CREATE' THEN 1 ELSE 0 END) AS has_create,
        MAX(CASE WHEN privilege.privilege_type='CREATE' THEN privilege.is_grantable ELSE 0 END) AS create_grantable
      FROM __edgepg_schemas AS schema
      JOIN __edgepg_schema_privileges AS privilege ON privilege.schema_name=schema.name
      GROUP BY schema.name,schema.owner_name,privilege.grantor,privilege.grantee),
    raw_acl AS (
      SELECT entry.schema_name,entry.owner_name,entry.grantor,entry.grantee,${`CASE WHEN entry.grantee='public' THEN '' ELSE ${U("entry.grantee")} END`} || '='
        || CASE WHEN entry.has_usage=1 THEN 'U' || CASE WHEN entry.usage_grantable=1 THEN '*' ELSE '' END ELSE '' END
        || CASE WHEN entry.has_create=1 THEN 'C' || CASE WHEN entry.create_grantable=1 THEN '*' ELSE '' END ELSE '' END
        || '/' || ${e} AS item
      FROM acl_entries AS entry),
    ordered_acl AS (
      SELECT schema_name,CASE WHEN instr(item,',')>0 OR instr(item,'"')>0 OR instr(item,'\\')>0
          OR instr(item,'{')>0 OR instr(item,'}')>0 OR item GLOB '* *'
        THEN '"' || replace(replace(item,'\\','\\\\'),'"','\\"') || '"'
        ELSE item END AS item
      FROM raw_acl
      ORDER BY schema_name,CASE WHEN grantee=owner_name THEN 0 ELSE 1 END,
        grantee,grantor),
    acl_text AS (SELECT schema_name,group_concat(item, ',') AS items
      FROM ordered_acl GROUP BY schema_name)
    SELECT schema.oid, schema.name AS nspname,
      COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=schema.owner_name),10) AS nspowner,
      CASE WHEN schema.acl_initialized=1 THEN
        '{' || COALESCE(acl_text.items, '') || '}'
      ELSE NULL END AS nspacl
    FROM __edgepg_schemas AS schema LEFT JOIN acl_text ON acl_text.schema_name=schema.name`}function on(){return`CREATE VIEW pg_catalog__pg_proc AS
    SELECT routine.routine_oid AS oid,routine.routine_name AS proname,schema.oid AS pronamespace,
      COALESCE((SELECT role.rowid+20000 FROM __edgepg_roles AS role WHERE role.name=routine.owner_name),10) AS proowner,
      CASE WHEN EXISTS (SELECT 1 FROM __edgepg_aggregates AS aggregate
          WHERE aggregate.aggregate_oid=routine.routine_oid) THEN 'a'
        WHEN routine.routine_kind='procedure' THEN 'p' ELSE 'f' END AS prokind,
      routine.return_type_oid AS prorettype,json_array_length(routine.input_argument_type_oids_json) AS pronargs,
      routine.input_default_count AS pronargdefaults,routine.variadic_type_oid AS provariadic,
      routine.input_argument_type_oids_json AS proargtypes,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(routine.argument_modes_json) WHERE value<>'in')
        THEN routine.all_argument_type_oids_json ELSE NULL END AS proallargtypes,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(routine.argument_modes_json) WHERE value<>'in')
        THEN (SELECT json_group_array(CASE mode.value WHEN 'in' THEN 'i' WHEN 'out' THEN 'o'
          WHEN 'inout' THEN 'b' WHEN 'variadic' THEN 'v' WHEN 'table' THEN 't' END)
          FROM json_each(routine.argument_modes_json) AS mode) ELSE NULL END AS proargmodes,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(routine.argument_names_json) WHERE value<>'')
        THEN routine.argument_names_json ELSE NULL END AS proargnames,
      CASE WHEN routine.routine_acl_initialized=0 OR
        (SELECT count(*) FROM __edgepg_routine_privileges AS defaults
          WHERE defaults.routine_oid=routine.routine_oid)=2
        AND EXISTS (SELECT 1 FROM __edgepg_routine_privileges AS owner_acl
          WHERE owner_acl.routine_oid=routine.routine_oid AND owner_acl.grantor=routine.owner_name
            AND owner_acl.grantee=routine.owner_name AND owner_acl.is_grantable=0)
        AND EXISTS (SELECT 1 FROM __edgepg_routine_privileges AS public_acl
          WHERE public_acl.routine_oid=routine.routine_oid AND public_acl.grantee='public'
            AND public_acl.is_grantable=0) THEN NULL ELSE
        (SELECT '{' || COALESCE(group_concat(entry,','),'') || '}' FROM (
          SELECT CASE WHEN privilege.grantee='public' THEN '' ELSE privilege.grantee END || '=X'
            || CASE WHEN privilege.is_grantable=1 THEN '*' ELSE '' END || '/' || privilege.grantor AS entry
          FROM __edgepg_routine_privileges AS privilege WHERE privilege.routine_oid=routine.routine_oid
          ORDER BY CASE WHEN privilege.grantee='public' THEN 0 ELSE 1 END,privilege.grantee,privilege.grantor)) END AS proacl,
      routine.definition AS prosrc,CASE routine.declared_language WHEN 'sql' THEN 14 ELSE 13563 END AS prolang,
      CASE WHEN upper(routine.definition) LIKE '% IMMUTABLE%' THEN 'i'
        WHEN upper(routine.definition) LIKE '% STABLE%' THEN 's' ELSE 'v' END AS provolatile,
      'u' AS proparallel,CASE WHEN upper(routine.definition) LIKE '% STRICT%' THEN 1 ELSE 0 END AS proisstrict,
      0 AS prosecdef,0 AS proleakproof,CASE WHEN upper(routine.definition) LIKE '% RETURNS SETOF %'
        OR EXISTS (SELECT 1 FROM json_each(routine.argument_modes_json) WHERE value='table') THEN 1 ELSE 0 END AS proretset,
      routine.identity_arguments_text AS __edgepg_identity_arguments,
      routine.arguments_text AS __edgepg_arguments,routine.result_text AS __edgepg_result,
      routine.definition AS __edgepg_definition
    FROM __edgepg_routines AS routine JOIN __edgepg_schemas AS schema ON schema.name=routine.schema_name
    WHERE routine.legacy_identity_unresolved=0
    UNION ALL
    SELECT column1 AS oid,column2 AS proname,(SELECT oid FROM __edgepg_schemas WHERE name='pg_catalog') AS pronamespace,
      10 AS proowner,'f' AS prokind,701 AS prorettype,column3 AS pronargs,0 AS pronargdefaults,
      0 AS provariadic,column4 AS proargtypes,NULL AS proallargtypes,NULL AS proargmodes,NULL AS proargnames,
      NULL AS proacl,column2 AS prosrc,12 AS prolang,'s' AS provolatile,'s' AS proparallel,1 AS proisstrict,
      0 AS prosecdef,0 AS proleakproof,0 AS proretset,column5 AS __edgepg_identity_arguments,
      column5 AS __edgepg_arguments,column6 AS __edgepg_result,column2 AS __edgepg_definition
    FROM (VALUES
      (101,'eqsel',4,'[2281,26,2281,23]','internal, oid, internal, integer','double precision'),
      (105,'eqjoinsel',5,'[2281,26,2281,21,2281]','internal, oid, internal, smallint, internal','double precision'),
      (1344,'exp',1,'[701]','double precision','double precision'),
      (1732,'exp',1,'[1700]','numeric','numeric'))
    UNION ALL
    SELECT column1,column2,(SELECT oid FROM __edgepg_schemas WHERE name='pg_catalog'),10,'f',
      column3,json_array_length(column4),0,0,column4,NULL,NULL,NULL,NULL,column2,12,column5,'s',
      column6,0,0,0,'','',pg_catalog_type.typname,column2
    FROM (VALUES ${Xe.map(([n,t,a,o,g,l])=>`(${n},'${t}',${a},'${JSON.stringify(o)}','${g}',${l?1:0})`).join(",")}) AS builtin_proc
    LEFT JOIN pg_catalog__pg_type AS pg_catalog_type ON pg_catalog_type.oid=column3`}function En(){return`CREATE VIEW pg_catalog__pg_aggregate AS
    SELECT aggregate.aggregate_oid AS aggfnoid,'n' AS aggkind,0 AS aggnumdirectargs,
      aggregate.transition_oid AS aggtransfn,0 AS aggfinalfn,0 AS aggcombinefn,
      0 AS aggserialfn,0 AS aggdeserialfn,0 AS aggmtransfn,0 AS aggminvtransfn,
      0 AS aggmfinalfn,0 AS aggfinalextra,0 AS aggmfinalextra,
      'r' AS aggfinalmodify,'r' AS aggmfinalmodify,0 AS aggsortop,
      aggregate.transition_type_oid AS aggtranstype,0 AS aggtransspace,
      0 AS aggmtranstype,0 AS aggmtransspace,aggregate.initcond AS agginitval,
      NULL AS aggminitval
    FROM __edgepg_aggregates AS aggregate`}function sn(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),0)`){const n=U("entry.grantor");return`CREATE VIEW pg_catalog__pg_default_acl AS
    WITH privilege_defaults(object_type,privilege_type,privilege_code,ordinal) AS (VALUES
      ('table','INSERT','a',1),('table','SELECT','r',2),('table','UPDATE','w',3),
      ('table','DELETE','d',4),('table','TRUNCATE','D',5),('table','REFERENCES','x',6),
      ('table','TRIGGER','t',7),('table','MAINTAIN','m',8),
      ('sequence','SELECT','r',1),('sequence','UPDATE','w',2),('sequence','USAGE','U',3),
      ('function','EXECUTE','X',1),('type','USAGE','U',1),
      ('schema','USAGE','U',1),('schema','CREATE','C',2)),
    groups AS (
      SELECT owner_role,schema_name,object_type,MIN(default_acl_oid) AS oid
      FROM __edgepg_default_privileges WHERE default_acl_oid IS NOT NULL
      GROUP BY owner_role,schema_name,object_type),
    base_privileges AS (
      SELECT groups.owner_role,groups.schema_name,groups.object_type,groups.owner_role AS grantor,
        groups.owner_role AS grantee,defaults.privilege_type,1 AS is_enabled,0 AS is_grantable
      FROM groups JOIN privilege_defaults AS defaults ON defaults.object_type=groups.object_type
      WHERE groups.schema_name=''
      UNION ALL
      SELECT groups.owner_role,groups.schema_name,groups.object_type,groups.owner_role,'public',
        defaults.privilege_type,1,0
      FROM groups JOIN privilege_defaults AS defaults ON defaults.object_type=groups.object_type
      WHERE groups.schema_name='' AND (groups.object_type='function' OR groups.object_type='type')),
    candidates AS (
      SELECT owner_role,schema_name,object_type,grantor,grantee,privilege_type FROM base_privileges
      UNION
      SELECT owner_role,schema_name,object_type,grantor,grantee,privilege_type
      FROM __edgepg_default_privileges),
    effective AS (
      SELECT candidate.owner_role,candidate.schema_name,candidate.object_type,candidate.grantor,
        candidate.grantee,candidate.privilege_type,
        CASE WHEN stored.privilege_type IS NOT NULL THEN stored.is_enabled ELSE base.is_enabled END AS is_enabled,
        CASE WHEN stored.privilege_type IS NOT NULL THEN stored.is_grantable ELSE base.is_grantable END AS is_grantable
      FROM candidates AS candidate
      LEFT JOIN __edgepg_default_privileges AS stored
        ON stored.owner_role=candidate.owner_role AND stored.schema_name=candidate.schema_name
        AND stored.object_type=candidate.object_type AND stored.grantor=candidate.grantor
        AND stored.grantee=candidate.grantee AND stored.privilege_type=candidate.privilege_type
      LEFT JOIN base_privileges AS base
        ON base.owner_role=candidate.owner_role AND base.schema_name=candidate.schema_name
        AND base.object_type=candidate.object_type AND base.grantor=candidate.grantor
        AND base.grantee=candidate.grantee AND base.privilege_type=candidate.privilege_type),
    ordered_privileges AS (
      SELECT effective.owner_role,effective.schema_name,effective.object_type,effective.grantor,effective.grantee,
        defaults.privilege_code || CASE WHEN effective.is_grantable=1 THEN '*' ELSE '' END AS privilege
      FROM effective JOIN privilege_defaults AS defaults
        ON defaults.object_type=effective.object_type AND defaults.privilege_type=effective.privilege_type
      WHERE effective.is_enabled=1
      ORDER BY effective.owner_role,effective.schema_name,effective.object_type,
        CASE WHEN effective.grantee='public' THEN 0 WHEN effective.grantee=effective.owner_role THEN 1 ELSE 2 END,
        effective.grantee,effective.grantor,defaults.ordinal),
    acl_entries AS (
      SELECT owner_role,schema_name,object_type,grantor,grantee,group_concat(privilege,'') AS privileges
      FROM ordered_privileges GROUP BY owner_role,schema_name,object_type,grantor,grantee),
    raw_acl AS (
      SELECT entry.owner_role,entry.schema_name,entry.object_type,entry.grantee,entry.grantor,
        ${`CASE WHEN entry.grantee='public' THEN '' ELSE ${U("entry.grantee")} END`} || '=' || entry.privileges || '/' || ${n} AS item
      FROM acl_entries AS entry),
    ordered_acl AS (
      SELECT owner_role,schema_name,object_type,CASE WHEN instr(item,',')>0 OR instr(item,'"')>0
          OR instr(item,'\\')>0 OR instr(item,'{')>0 OR instr(item,'}')>0 OR item GLOB '* *'
        THEN '"' || replace(replace(item,'\\','\\\\'),'"','\\"') || '"' ELSE item END AS item
      FROM raw_acl ORDER BY owner_role,schema_name,object_type,
        CASE WHEN grantee='public' THEN 0 WHEN grantee=owner_role THEN 1 ELSE 2 END,grantee,grantor),
    acl_text AS (
      SELECT owner_role,schema_name,object_type,group_concat(item,',') AS items
      FROM ordered_acl GROUP BY owner_role,schema_name,object_type),
    meaningful_groups AS (
      SELECT groups.* FROM groups WHERE
        groups.schema_name<>'' AND EXISTS (SELECT 1 FROM __edgepg_default_privileges AS stored
          WHERE stored.owner_role=groups.owner_role AND stored.schema_name=groups.schema_name
            AND stored.object_type=groups.object_type AND stored.is_enabled=1)
        OR groups.schema_name='' AND EXISTS (SELECT 1 FROM __edgepg_default_privileges AS stored
          WHERE stored.owner_role=groups.owner_role AND stored.schema_name='' AND stored.object_type=groups.object_type
            AND (stored.is_grantable=1
              OR stored.is_enabled=0 AND (stored.grantee=stored.owner_role
                OR stored.grantee='public' AND stored.object_type='function' AND stored.privilege_type='EXECUTE'
                OR stored.grantee='public' AND stored.object_type='type' AND stored.privilege_type='USAGE')
              OR stored.is_enabled=1 AND stored.grantee<>stored.owner_role
                AND NOT (stored.grantee='public' AND stored.object_type='function' AND stored.privilege_type='EXECUTE')
                AND NOT (stored.grantee='public' AND stored.object_type='type' AND stored.privilege_type='USAGE'))))
    SELECT groups.oid,
      ${e("groups.owner_role")} AS defaclrole,
      CASE WHEN groups.schema_name='' THEN 0 ELSE COALESCE(schemas.oid,0) END AS defaclnamespace,
      CASE groups.object_type WHEN 'table' THEN 'r' WHEN 'sequence' THEN 'S'
        WHEN 'function' THEN 'f' WHEN 'type' THEN 'T' WHEN 'schema' THEN 'n' END AS defaclobjtype,
      '{' || COALESCE(acl_text.items,'') || '}' AS defaclacl
    FROM meaningful_groups AS groups
    LEFT JOIN __edgepg_schemas AS schemas ON schemas.name=groups.schema_name
    LEFT JOIN acl_text ON acl_text.owner_role=groups.owner_role AND acl_text.schema_name=groups.schema_name
      AND acl_text.object_type=groups.object_type`}function rn(){const e=U("entry.grantor");return`CREATE VIEW pg_catalog__pg_database AS
    WITH privilege_codes(privilege_type,privilege_code,ordinal) AS (VALUES
      ('CREATE','C',1),('TEMPORARY','T',2),('CONNECT','c',3)),
    ordered_privileges AS (
      SELECT privilege.rowid AS privilege_ordinal,database.name AS database_name,
        database.owner_name,privilege.grantor,privilege.grantee,
        codes.privilege_code || CASE WHEN privilege.is_grantable=1 THEN '*' ELSE '' END AS privilege
      FROM __edgepg_database_privileges AS privilege
      JOIN __edgepg_databases AS database ON database.name=privilege.database_name
      JOIN privilege_codes AS codes ON codes.privilege_type=privilege.privilege_type
      ORDER BY database.name,privilege.grantor,privilege.grantee,codes.ordinal),
    acl_entries AS (
      SELECT database_name,owner_name,grantor,grantee,MIN(privilege_ordinal) AS first_ordinal,
        group_concat(privilege,'') AS privileges
      FROM ordered_privileges GROUP BY database_name,owner_name,grantor,grantee),
    raw_acl AS (
      SELECT entry.database_name,entry.owner_name,entry.grantor,entry.grantee,entry.first_ordinal,
        ${`CASE WHEN entry.grantee='public' THEN '' ELSE ${U("entry.grantee")} END`} || '=' || entry.privileges || '/' || ${e} AS item
      FROM acl_entries AS entry),
    ordered_acl AS (
      SELECT database_name,CASE WHEN instr(item,',')>0 OR instr(item,'"')>0 OR instr(item,'\\')>0
          OR instr(item,'{')>0 OR instr(item,'}')>0 OR item GLOB '* *'
        THEN '"' || replace(replace(item,'\\','\\\\'),'"','\\"') || '"' ELSE item END AS item
      FROM raw_acl ORDER BY database_name,
        CASE WHEN grantee='public' THEN 0 WHEN grantee=owner_name THEN 1 ELSE 2 END,first_ordinal),
    acl_text AS (
      SELECT database_name,group_concat(item,',') AS items FROM ordered_acl GROUP BY database_name)
    SELECT database.oid,database.name AS datname,
      COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=database.owner_name),10) AS datdba,
      'UTF8' AS encoding,'C' AS datcollate,'C' AS datctype,0 AS datistemplate,
      1 AS datallowconn,database.connection_limit AS datconnlimit,
      CASE WHEN database.acl_initialized=1 THEN '{' || COALESCE(acl_text.items,'') || '}'
        ELSE NULL END AS datacl
    FROM __edgepg_databases AS database
    LEFT JOIN acl_text ON acl_text.database_name=database.name
    UNION ALL
    SELECT 5 AS oid,'postgres' AS datname,10 AS datdba,'UTF8' AS encoding,
      'C' AS datcollate,'C' AS datctype,0 AS datistemplate,1 AS datallowconn,-1 AS datconnlimit,NULL AS datacl
    WHERE NOT EXISTS (SELECT 1 FROM __edgepg_databases WHERE name='postgres')`}function ln(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){return`CREATE VIEW pg_catalog__pg_publication AS
    SELECT publication.rowid+31000 AS oid,
      publication.name AS pubname,
      ${e("publication.owner_name")} AS pubowner,
      publication.all_tables AS puballtables,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(publication.publish_json) AS item WHERE item.value='insert') THEN 1 ELSE 0 END AS pubinsert,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(publication.publish_json) AS item WHERE item.value='update') THEN 1 ELSE 0 END AS pubupdate,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(publication.publish_json) AS item WHERE item.value='delete') THEN 1 ELSE 0 END AS pubdelete,
      CASE WHEN EXISTS (SELECT 1 FROM json_each(publication.publish_json) AS item WHERE item.value='truncate') THEN 1 ELSE 0 END AS pubtruncate,
      0 AS pubviaroot,
      CAST('n' AS TEXT) AS pubgencols
    FROM __edgepg_publications AS publication`}function pn(){return`CREATE VIEW pg_catalog__pg_publication_tables AS
    SELECT publication.name AS pubname,
      tables.schema_name AS schemaname,
      tables.table_name AS tablename,
      NULL AS attnames,
      NULL AS rowfilter
    FROM __edgepg_publications AS publication
    JOIN __edgepg_pg_tables AS tables ON publication.all_tables=1
    UNION ALL
    SELECT publication.name AS pubname,
      json_extract(entry.value,'$.schema') AS schemaname,
      json_extract(entry.value,'$.name') AS tablename,
      NULL AS attnames,
      NULL AS rowfilter
    FROM __edgepg_publications AS publication,json_each(publication.tables_json) AS entry
    WHERE publication.all_tables<>1`}function cn(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){return`CREATE VIEW pg_catalog__pg_subscription AS
    SELECT subscription.rowid+32000 AS oid,
      COALESCE((SELECT oid FROM __edgepg_databases WHERE name='app'),16384) AS subdbid,
      0 AS subskiplsn,
      subscription.name AS subname,
      ${e("subscription.owner_name")} AS subowner,
      subscription.enabled AS subenabled,
      0 AS subbinary,
      0 AS substream,
      0 AS subtwophasestate,
      0 AS subdisableonerr,
      -1 AS subpasswordrequired,
      'off' AS subrunasowner,
      subscription.connection_info AS subconninfo,
      subscription.slot_name AS subslotname,
      NULL AS subsynccommit,
      subscription.publications_json AS subpublications,
      NULL AS suborigin,
      NULL AS subfailover
    FROM __edgepg_subscriptions AS subscription`}function gn(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){return`CREATE VIEW pg_catalog__pg_tablespace AS
    SELECT 1663 AS oid,'pg_default' AS spcname,10 AS spcowner,NULL AS spcacl,NULL AS spcoptions
    UNION ALL
    SELECT 1664 AS oid,'pg_global' AS spcname,10 AS spcowner,NULL AS spcacl,NULL AS spcoptions
    UNION ALL
    SELECT rowid+60000 AS oid,name AS spcname,${e("owner_name")} AS spcowner,NULL AS spcacl,
      CASE WHEN instr(definition,'(')>0 AND instr(definition,')')>instr(definition,'(')
        THEN json_array(replace(replace(replace(trim(substr(definition,instr(definition,'(')+1,
    instr(definition,')')-instr(definition,'(')-1)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS spcoptions
    FROM __edgepg_catalog_objects WHERE object_type='tablespace'`}function Nn(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){return`CREATE VIEW pg_catalog__pg_foreign_data_wrapper AS
    SELECT rowid+70000 AS oid,name AS fdwname,${e("owner_name")} AS fdwowner,
      0 AS fdwhandler,0 AS fdwvalidator,NULL AS fdwacl,
      CASE WHEN json_array_length(COALESCE(options_json,'[]'))>0 THEN options_json
        WHEN instr(upper(definition),'OPTIONS (')>0 AND instr(definition,')')>instr(upper(definition),'OPTIONS (')
        THEN json_array(replace(replace(replace(trim(substr(definition,instr(definition,'OPTIONS (')+9,
    instr(definition,')')-instr(definition,'OPTIONS (')-9)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS fdwoptions
    FROM __edgepg_catalog_objects WHERE object_type='foreign_data_wrapper'`}function mn(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){const n="'FOREIGN DATA WRAPPER '",t="' OPTIONS '",o=`COALESCE(NULLIF(server.fdw_name,''), ${`trim(CASE
    WHEN instr(upper(server.definition), ${n})>0
    THEN substr(server.definition,
      instr(upper(server.definition), ${n}) + length(${n}),
      CASE WHEN instr(upper(server.definition), ${t})>instr(upper(server.definition), ${n})
        THEN instr(upper(server.definition), ${t})
          - (instr(upper(server.definition), ${n}) + length(${n}))
        ELSE length(server.definition) END)
    ELSE '' END)`})`;return`CREATE VIEW pg_catalog__pg_foreign_server AS
    SELECT server.rowid+71000 AS oid,server.name AS srvname,${e("server.owner_name")} AS srvowner,
      COALESCE(fdw.oid,0) AS srvfdw,NULL AS srvtype,NULL AS srvversion,NULL AS srvacl,
      CASE WHEN json_array_length(COALESCE(server.options_json,'[]'))>0 THEN server.options_json
        WHEN instr(upper(server.definition),'OPTIONS (')>0
          AND instr(server.definition,')')>instr(upper(server.definition),'OPTIONS (')
        THEN json_array(replace(replace(replace(trim(substr(server.definition,instr(server.definition,'OPTIONS (')+9,
    instr(server.definition,')')-instr(server.definition,'OPTIONS (')-9)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS srvoptions
    FROM __edgepg_catalog_objects AS server
    LEFT JOIN pg_catalog__pg_foreign_data_wrapper AS fdw ON fdw.fdwname=${o}
    WHERE server.object_type='foreign_server'`}function Sn(e=n=>`CASE WHEN ${n}='public' THEN 0
      ELSE COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),0) END`){return`CREATE VIEW pg_catalog__pg_user_mapping AS
    SELECT mapping.rowid+72000 AS oid,${e("json_extract(mapping.name,'$[0]')")} AS umuser,
      COALESCE(server.oid,0) AS umserver,
      CASE WHEN instr(upper(mapping.definition),'OPTIONS (')>0
          AND instr(mapping.definition,')')>instr(upper(mapping.definition),'OPTIONS (')
        THEN json_array(replace(replace(replace(trim(substr(mapping.definition,instr(mapping.definition,'OPTIONS (')+9,
    instr(mapping.definition,')')-instr(mapping.definition,'OPTIONS (')-9)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS umoptions
    FROM __edgepg_catalog_objects AS mapping
    LEFT JOIN pg_catalog__pg_foreign_server AS server ON server.srvname=json_extract(mapping.name,'$[1]')
    WHERE mapping.object_type='user_mapping'`}function Tn(){const e="json_extract(mapping.name,'$[0]')",n="json_extract(mapping.name,'$[1]')";return`CREATE VIEW pg_catalog__pg_user_mappings AS
    SELECT mapping.rowid+72000 AS umid,COALESCE(server.oid,0) AS srvid,${n} AS srvname,
      CASE WHEN ${e}='public' THEN 0
        ELSE COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${e}),0) END AS umuser,
      CASE WHEN ${e}='public' THEN 'public' ELSE ${e} END AS usename,
      CASE WHEN instr(upper(mapping.definition),'OPTIONS (')>0
          AND instr(mapping.definition,')')>instr(upper(mapping.definition),'OPTIONS (')
        THEN json_array(replace(replace(replace(trim(substr(mapping.definition,instr(mapping.definition,'OPTIONS (')+9,
    instr(mapping.definition,')')-instr(mapping.definition,'OPTIONS (')-9)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS umoptions
    FROM __edgepg_catalog_objects AS mapping
    LEFT JOIN pg_catalog__pg_foreign_server AS server ON server.srvname=${n}
    WHERE mapping.object_type='user_mapping'`}function dn(){const e="' SERVER '",n="' OPTIONS '";return`CREATE VIEW pg_catalog__pg_foreign_table AS
    SELECT tables.relation_oid AS ftrelid,COALESCE(server.oid,0) AS ftserver,
      CASE WHEN json_array_length(COALESCE(tables.foreign_options_json,'[]'))>0
        THEN tables.foreign_options_json
        WHEN instr(upper(tables.definition),'OPTIONS (')>0
          AND instr(tables.definition,')')>instr(upper(tables.definition),'OPTIONS (')
        THEN json_array(replace(replace(replace(trim(substr(tables.definition,instr(tables.definition,'OPTIONS (')+9,
    instr(tables.definition,')')-instr(tables.definition,'OPTIONS (')-9)), ' = ', '='), '= ', '='), ' =', '=')) ELSE NULL END AS ftoptions
    FROM __edgepg_pg_tables AS tables
    LEFT JOIN pg_catalog__pg_foreign_server AS server ON server.srvname=COALESCE(tables.foreign_server_name, ${`trim(CASE
    WHEN instr(upper(tables.definition), ${e})>0
    THEN substr(tables.definition,
      instr(upper(tables.definition), ${e}) + length(${e}),
      CASE WHEN instr(upper(tables.definition), ${n})>instr(upper(tables.definition), ${e})
        THEN instr(upper(tables.definition), ${n})
          - (instr(upper(tables.definition), ${e}) + length(${e}))
        ELSE length(tables.definition) END)
    ELSE '' END)`})
    WHERE tables.persistence='foreign'`}function An(e=n=>`COALESCE((SELECT rowid+20000 FROM __edgepg_roles WHERE name=${n}),10)`){const n=D("domains.base_type"),t=xe.map(o=>`(${o.join(",")})`).join(","),a=`COALESCE(NULLIF(${W(n,!1)},0),
    (SELECT CASE WHEN ${n} LIKE '%[]' THEN array_oid ELSE oid END
      FROM __edgepg_type_identities AS base_identity
      WHERE base_identity.name=replace(replace(${n},'.','__'),'[]','')),0)`;return`CREATE VIEW pg_catalog__pg_type AS
    WITH builtin_types(typname,oid,typarray) AS (VALUES
      ('bool',16,1000),('bytea',17,1001),('char',18,1002),('name',19,1003),
      ('int8',20,1016),('int2',21,1005),('int4',23,1007),('text',25,1009),('oid',26,1028),
      ('float4',700,1021),('float8',701,1022),('bpchar',1042,1014),('varchar',1043,1015),
      ('date',1082,1182),('time',1083,1183),('timestamp',1114,1115),('timestamptz',1184,1185),
      ('interval',1186,1187),('timetz',1266,1270),('numeric',1700,1231),('uuid',2950,2951),
      ('json',114,199),('jsonb',3802,3807)),
    builtin_type_io(type_oid,typinput,typoutput,typreceive,typsend,typmodin,typmodout,typanalyze) AS
      (VALUES ${t}),
    custom_relation_types(typname,typtype,oid,typarray,typnamespace,typowner,typbasetype,typelem,typrelid,typnotnull) AS (
      SELECT CASE WHEN instr(types.name,'__')>0 THEN substr(types.name,instr(types.name,'__')+2) ELSE types.name END,
        CASE types.kind WHEN 'enum' THEN 'e' WHEN 'composite' THEN 'c' WHEN 'range' THEN 'r' WHEN 'multirange' THEN 'm' END,
        identities.oid,identities.array_oid,schemas.oid,${e("types.owner_name")},0,0,0,0
      FROM __edgepg_types AS types JOIN __edgepg_type_identities AS identities ON identities.name=types.name
      JOIN __edgepg_schemas AS schemas ON schemas.name=CASE WHEN instr(types.name,'__')>0
        THEN substr(types.name,1,instr(types.name,'__')-1) ELSE 'public' END
      UNION ALL
      SELECT tables.table_name,'c',${F}+tables.relation_oid,
        ${ge}+tables.relation_oid,schemas.oid,
        ${e("COALESCE(owners.owner_name,'edgepg')")},0,0,tables.relation_oid,0
      FROM __edgepg_pg_tables AS tables
      JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
      LEFT JOIN __edgepg_table_owners AS owners ON owners.physical_name=tables.physical_name
      WHERE tables.relation_oid IS NOT NULL
      UNION ALL
      SELECT '_' || tables.table_name,'b',${ge}+tables.relation_oid,0,schemas.oid,
        ${e("COALESCE(owners.owner_name,'edgepg')")},0,
        ${F}+tables.relation_oid,0,0
      FROM __edgepg_pg_tables AS tables
      JOIN __edgepg_schemas AS schemas ON schemas.name=tables.schema_name
      LEFT JOIN __edgepg_table_owners AS owners ON owners.physical_name=tables.physical_name
      WHERE tables.relation_oid IS NOT NULL
    ),
    raw_types(typname,typtype,oid,typarray,typnamespace,typowner,typbasetype,typelem,typrelid,typnotnull) AS (
      SELECT * FROM custom_relation_types
      UNION ALL
      SELECT CASE WHEN instr(domains.name,'__')>0 THEN substr(domains.name,instr(domains.name,'__')+2) ELSE domains.name END,
        'd',identities.oid,identities.array_oid,schemas.oid,${e("domains.owner_name")},
        ${a},0,0,domains.not_null
      FROM __edgepg_domains AS domains JOIN __edgepg_type_identities AS identities ON identities.name=domains.name
      JOIN __edgepg_schemas AS schemas ON schemas.name=CASE WHEN instr(domains.name,'__')>0
        THEN substr(domains.name,1,instr(domains.name,'__')-1) ELSE 'public' END
      UNION ALL
      SELECT '_' || CASE WHEN instr(names.name,'__')>0 THEN substr(names.name,instr(names.name,'__')+2) ELSE names.name END,
        'b',identities.array_oid,0,schemas.oid,${e("names.owner_name")},0,identities.oid,0,0
      FROM (SELECT name,owner_name FROM __edgepg_types UNION ALL SELECT name,owner_name FROM __edgepg_domains) AS names
      JOIN __edgepg_type_identities AS identities ON identities.name=names.name
      JOIN __edgepg_schemas AS schemas ON schemas.name=CASE WHEN instr(names.name,'__')>0
        THEN substr(names.name,1,instr(names.name,'__')-1) ELSE 'public' END
      WHERE identities.oid IS NOT NULL AND identities.array_oid IS NOT NULL
      UNION ALL
      SELECT typname,'b',oid,typarray,(SELECT oid FROM __edgepg_schemas WHERE name='pg_catalog'),10,0,0,0,0
      FROM builtin_types
      UNION ALL
      SELECT '_' || typname,'b',typarray,0,(SELECT oid FROM __edgepg_schemas WHERE name='pg_catalog'),10,0,oid,0,0
      FROM builtin_types
    ), classified AS (
      SELECT raw_types.*,
        CASE WHEN typelem<>0 THEN -1
          WHEN oid IN (16,18) THEN 1 WHEN oid=21 THEN 2 WHEN oid IN (23,26,700,1082) THEN 4
          WHEN oid IN (20,701,1083,1114,1184) THEN 8 WHEN oid=1266 THEN 12
          WHEN oid IN (1186,2950) THEN 16 WHEN oid=19 THEN 64 WHEN typtype='e' THEN 4 ELSE -1 END AS base_typlen,
        CASE WHEN typelem<>0 THEN 0 WHEN oid IN (16,18,20,21,23,26,700,701,1082,1083,1114,1184) THEN 1
          WHEN typtype='e' THEN 1 ELSE 0 END AS base_typbyval,
        CASE WHEN typelem<>0 THEN 'x' WHEN oid=1700 THEN 'm'
          WHEN oid IN (17,25,114,1042,1043,3802) OR typtype IN ('c','r','m') THEN 'x' ELSE 'p' END AS base_typstorage,
        CASE WHEN oid IN (20,701,1083,1114,1184,1186,1266) OR typtype IN ('c','r','m') THEN 'd'
          WHEN oid IN (16,18,19,2950) THEN 'c' WHEN oid=21 THEN 's' ELSE 'i' END AS base_typalign,
        CASE WHEN typelem<>0 THEN 'A' WHEN oid=16 THEN 'B' WHEN oid=18 THEN 'Z'
          WHEN oid IN (19,25,1042,1043) THEN 'S' WHEN oid IN (20,21,23,26,700,701,1700) THEN 'N'
          WHEN oid IN (1082,1083,1114,1184,1266) THEN 'D' WHEN oid=1186 THEN 'T'
          WHEN typtype='e' THEN 'E' WHEN typtype='c' THEN 'C' WHEN typtype IN ('r','m') THEN 'R' ELSE 'U' END AS base_typcategory,
        CASE WHEN oid IN (16,25,26,701,1184,1186) THEN 1 ELSE 0 END AS base_typispreferred,
        CASE WHEN oid IN (19,1003) THEN 950 WHEN oid IN (25,1042,1043,1009,1014,1015) THEN 100 ELSE 0 END AS base_typcollation
      FROM raw_types
    ), typed AS (
      SELECT classified.*,
        CASE WHEN typelem<>0 THEN 750 WHEN typtype='d' THEN 2597 WHEN typtype='c' THEN 2290
          WHEN typtype='e' THEN 3506 WHEN typtype='r' THEN 3834 WHEN typtype='m' THEN 4231
          ELSE COALESCE((SELECT io.typinput FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typinput,
        CASE WHEN typelem<>0 THEN 751 WHEN typtype='c' THEN 2291 WHEN typtype='e' THEN 3507
          WHEN typtype='r' THEN 3835 WHEN typtype='m' THEN 4232
          ELSE COALESCE((SELECT io.typoutput FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typoutput,
        CASE WHEN typelem<>0 THEN 2400 WHEN typtype='d' THEN 2598 WHEN typtype='c' THEN 2402
          WHEN typtype='e' THEN 3532 WHEN typtype='r' THEN 3836 WHEN typtype='m' THEN 4233
          ELSE COALESCE((SELECT io.typreceive FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typreceive,
        CASE WHEN typelem<>0 THEN 2401 WHEN typtype='c' THEN 2403 WHEN typtype='e' THEN 3533
          WHEN typtype='r' THEN 3837 WHEN typtype='m' THEN 4234
          ELSE COALESCE((SELECT io.typsend FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typsend,
        CASE WHEN typelem<>0 THEN COALESCE((SELECT io.typmodin FROM builtin_type_io AS io WHERE io.type_oid=classified.typelem),0)
          ELSE COALESCE((SELECT io.typmodin FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typmodin,
        CASE WHEN typelem<>0 THEN COALESCE((SELECT io.typmodout FROM builtin_type_io AS io WHERE io.type_oid=classified.typelem),0)
          ELSE COALESCE((SELECT io.typmodout FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typmodout,
        CASE WHEN typelem<>0 THEN 3816 WHEN typtype='r' THEN 3916 WHEN typtype='m' THEN 4242
          ELSE COALESCE((SELECT io.typanalyze FROM builtin_type_io AS io WHERE io.type_oid=classified.oid),0) END AS resolved_typanalyze
      FROM classified
    ), effective AS (
      SELECT typed.*,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typlen FROM typed AS base
          WHERE base.oid=typed.typbasetype),-1) ELSE base_typlen END AS effective_typlen,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typbyval FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE base_typbyval END AS effective_typbyval,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typcategory FROM typed AS base
          WHERE base.oid=typed.typbasetype),'U') ELSE base_typcategory END AS effective_typcategory,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typispreferred FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE base_typispreferred END AS effective_typispreferred,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.resolved_typoutput FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE resolved_typoutput END AS effective_typoutput,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.resolved_typsend FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE resolved_typsend END AS effective_typsend,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.resolved_typmodin FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE resolved_typmodin END AS effective_typmodin,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.resolved_typmodout FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE resolved_typmodout END AS effective_typmodout,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.resolved_typanalyze FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE resolved_typanalyze END AS effective_typanalyze,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typalign FROM typed AS base
          WHERE base.oid=typed.typbasetype),'i') ELSE base_typalign END AS effective_typalign,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typstorage FROM typed AS base
          WHERE base.oid=typed.typbasetype),'p') ELSE base_typstorage END AS effective_typstorage,
        CASE WHEN typtype='d' THEN COALESCE((SELECT base.base_typcollation FROM typed AS base
          WHERE base.oid=typed.typbasetype),0) ELSE base_typcollation END AS effective_typcollation
      FROM typed
    )
    SELECT oid,typname,typnamespace,typowner,
      effective_typlen AS typlen,
      CASE WHEN typelem<>0 THEN 0 ELSE effective_typbyval END AS typbyval,
      typtype,
      effective_typcategory AS typcategory,
      effective_typispreferred AS typispreferred,
      1 AS typisdefined,',' AS typdelim,typrelid,
      CASE WHEN typelem<>0 THEN 6179 ELSE 0 END AS typsubscript,
      typelem,typarray,resolved_typinput AS typinput,
      effective_typoutput AS typoutput,
      resolved_typreceive AS typreceive,
      effective_typsend AS typsend,
      CASE WHEN typelem<>0 THEN COALESCE((SELECT element.effective_typmodin FROM effective AS element
        WHERE element.oid=effective.typelem),0) ELSE effective_typmodin END AS typmodin,
      CASE WHEN typelem<>0 THEN COALESCE((SELECT element.effective_typmodout FROM effective AS element
        WHERE element.oid=effective.typelem),0) ELSE effective_typmodout END AS typmodout,
      effective_typanalyze AS typanalyze,
      CASE WHEN typelem<>0 THEN CASE WHEN COALESCE((SELECT element.effective_typalign FROM effective AS element
        WHERE element.oid=effective.typelem),'i')='d' THEN 'd' ELSE 'i' END
        ELSE effective_typalign END AS typalign,
      CASE WHEN typelem<>0 THEN 'x' ELSE effective_typstorage END AS typstorage,
      typnotnull,typbasetype,-1 AS typtypmod,0 AS typndims,
      CASE WHEN typelem<>0 THEN COALESCE((SELECT element.effective_typcollation FROM effective AS element
        WHERE element.oid=effective.typelem),0) ELSE effective_typcollation END AS typcollation,
      NULL AS typdefaultbin,NULL AS typdefault,NULL AS typacl
    FROM effective`}function un(){const e=D("json_extract(types.values_json,'$.subtype')"),n=W(e),t=a=>`COALESCE((SELECT routine.routine_oid
    FROM __edgepg_routines AS routine
    WHERE routine.routine_name=CASE WHEN instr(json_extract(ranges.values_json,'$.${a}'),'.')>0
      THEN substr(json_extract(ranges.values_json,'$.${a}'),
        instr(json_extract(ranges.values_json,'$.${a}'),'.')+1)
      ELSE json_extract(ranges.values_json,'$.${a}') END
      AND routine.schema_name=CASE WHEN instr(json_extract(ranges.values_json,'$.${a}'),'.')>0
        THEN substr(json_extract(ranges.values_json,'$.${a}'),1,
          instr(json_extract(ranges.values_json,'$.${a}'),'.')-1) ELSE 'public' END
    ORDER BY routine.routine_oid LIMIT 1),0)`;return`CREATE VIEW pg_catalog__pg_range AS
    WITH ranges AS (
      SELECT types.values_json,identities.oid AS rngtypid,${n} AS rngsubtype,
        COALESCE(multirange_identity.oid,0) AS rngmultitypid
      FROM __edgepg_types AS types
      JOIN __edgepg_type_identities AS identities ON identities.name=types.name
      LEFT JOIN __edgepg_type_identities AS multirange_identity
        ON multirange_identity.name=json_extract(types.values_json,'$.multirangePhysicalName')
      WHERE types.kind='range'
    )
    SELECT ranges.rngtypid,ranges.rngsubtype,
      COALESCE((SELECT opclass.oid FROM pg_catalog__pg_opclass AS opclass
        WHERE opclass.opcmethod=403 AND opclass.opcintype=ranges.rngsubtype
        ORDER BY opclass.opcdefault DESC,opclass.oid LIMIT 1),0) AS rngsubopc,
      COALESCE((SELECT collation.oid FROM __edgepg_collations AS collation
        WHERE collation.collation_name=CASE
          WHEN instr(replace(json_extract(ranges.values_json,'$.collation'),'"',''),'.')>0
          THEN substr(replace(json_extract(ranges.values_json,'$.collation'),'"',''),
            instr(replace(json_extract(ranges.values_json,'$.collation'),'"',''),'.')+1)
          ELSE replace(json_extract(ranges.values_json,'$.collation'),'"','') END
        ORDER BY CASE WHEN collation.schema_name='pg_catalog' THEN 0 ELSE 1 END,collation.oid LIMIT 1),
        (SELECT type.typcollation FROM pg_catalog__pg_type AS type
          WHERE type.oid=ranges.rngsubtype),0) AS rngcollation,
      ${t("canonical")} AS rngcanonical,
      ${t("subtypeDiff")} AS rngsubdiff,
      ranges.rngmultitypid
    FROM ranges`}function W(e,n=!0){return`CASE ${e}
    WHEN 'boolean' THEN 16 WHEN 'bool' THEN 16
    WHEN 'bytea' THEN 17 WHEN 'char' THEN 18 WHEN 'name' THEN 19
    WHEN 'bigint' THEN 20 WHEN 'int8' THEN 20
    WHEN 'smallint' THEN 21 WHEN 'int2' THEN 21
    WHEN 'integer' THEN 23 WHEN 'int' THEN 23 WHEN 'int4' THEN 23
    WHEN 'text' THEN 25
    WHEN 'oid' THEN 26
    WHEN 'real' THEN 700 WHEN 'float4' THEN 700
    WHEN 'double precision' THEN 701 WHEN 'float8' THEN 701
    WHEN 'character' THEN 1042 WHEN 'bpchar' THEN 1042
    WHEN 'character varying' THEN 1043 WHEN 'varchar' THEN 1043
    WHEN 'date' THEN 1082 WHEN 'time' THEN 1083 WHEN 'time without time zone' THEN 1083
    WHEN 'timestamp without time zone' THEN 1114 WHEN 'timestamp' THEN 1114
    WHEN 'timestamp with time zone' THEN 1184 WHEN 'timestamptz' THEN 1184
    WHEN 'interval' THEN 1186
    WHEN 'time with time zone' THEN 1266 WHEN 'timetz' THEN 1266
    WHEN 'numeric' THEN 1700 WHEN 'decimal' THEN 1700
    WHEN 'uuid' THEN 2950
    WHEN 'json' THEN 114 WHEN 'jsonb' THEN 3802
    WHEN 'boolean[]' THEN 1000 WHEN 'bool[]' THEN 1000
    WHEN 'bytea[]' THEN 1001 WHEN 'char[]' THEN 1002 WHEN 'name[]' THEN 1003
    WHEN 'bigint[]' THEN 1016 WHEN 'int8[]' THEN 1016
    WHEN 'smallint[]' THEN 1005 WHEN 'int2[]' THEN 1005
    WHEN 'integer[]' THEN 1007 WHEN 'int[]' THEN 1007 WHEN 'int4[]' THEN 1007
    WHEN 'text[]' THEN 1009
    WHEN 'character[]' THEN 1014 WHEN 'bpchar[]' THEN 1014
    WHEN 'character varying[]' THEN 1015 WHEN 'varchar[]' THEN 1015
    WHEN 'real[]' THEN 1021 WHEN 'float4[]' THEN 1021
    WHEN 'double precision[]' THEN 1022 WHEN 'float8[]' THEN 1022
    WHEN 'oid[]' THEN 1028
    WHEN 'date[]' THEN 1182 WHEN 'time[]' THEN 1183 WHEN 'time without time zone[]' THEN 1183
    WHEN 'timestamp without time zone[]' THEN 1115 WHEN 'timestamp[]' THEN 1115
    WHEN 'timestamp with time zone[]' THEN 1185 WHEN 'timestamptz[]' THEN 1185
    WHEN 'interval[]' THEN 1187
    WHEN 'time with time zone[]' THEN 1270 WHEN 'timetz[]' THEN 1270
    WHEN 'numeric[]' THEN 1231 WHEN 'decimal[]' THEN 1231
    WHEN 'uuid[]' THEN 2951
    WHEN 'json[]' THEN 199 WHEN 'jsonb[]' THEN 3807
    ELSE ${n?`COALESCE((SELECT CASE WHEN ${e} LIKE '%[]' THEN typ.typarray ELSE typ.oid END
      FROM pg_catalog__pg_type AS typ
      WHERE typ.typname=replace(replace(${e}, '.', '__'), '[]', '')
         OR typ.typname=substr(replace(${e}, '.', '__'), instr(replace(${e}, '.', '__'), '__')+2)
      LIMIT 1), 0)`:"0"} END`}function ae(e){return`COALESCE(${e}.typlen,-1) AS attlen,
    COALESCE(${e}.typbyval,0) AS attbyval,
    COALESCE(${e}.typalign,'i') AS attalign,
    COALESCE(${e}.typstorage,'x') AS attstorage`}function D(e){const n=`lower(replace(CAST(${e} AS TEXT), 'pg_catalog.', ''))`,t=`(CASE WHEN instr(${n}, '(')>0 AND instr(${n}, ')')>instr(${n}, '(')
    THEN trim(substr(${n}, 1, instr(${n}, '(')-1)
      || substr(${n}, instr(${n}, ')')+1)) ELSE trim(${n}) END)`;return`(CASE WHEN ${t}='numeric_text' THEN 'numeric' ELSE ${t} END)`}function _e(e){const n=`replace(lower(replace(CAST(${e} AS TEXT), 'pg_catalog.', '')), ' ', '')`,t=`instr(${n}, '(')`,a=`instr(${n}, ',')`,o=`instr(${n}, ')')`,E=`${`${`(CASE WHEN ${t}>0 THEN substr(${n},1,${t}-1) ELSE ${n} END)`} IN ('numeric','numeric_text','decimal')`} AND ${t}>0 AND ${a}>${t} AND ${o}>${a}`,c=`CAST(substr(${n},${t}+1,${a}-${t}-1) AS INTEGER)`,N=`CAST(substr(${n},${a}+1,${o}-${a}-1) AS INTEGER)`;return{valid:E,precision:c,scale:N}}function Ln(e){const n=_e(e);return`(CASE WHEN ${n.valid} THEN ${n.precision} ELSE NULL END)`}function On(e){const n=_e(e);return`(CASE WHEN ${n.valid} THEN ${n.scale} ELSE NULL END)`}function oe(e){const n=_e(e);return`(CASE WHEN ${n.valid}
    THEN 4 + (${n.precision} << 16) + (${n.scale} & 2047) ELSE -1 END)`}function U(e){return`(CASE WHEN ${e}='' OR ${e} GLOB '*[^A-Za-z0-9_]*'
    THEN '"' || replace(replace(${e}, '\\', '\\\\'), '"', '""') || '"'
    ELSE ${e} END)`}function Yn(e,n){return e.prepare(`INSERT INTO __edgepg_pg_tables
    (relation_oid, schema_name, table_name, physical_name, definition, persistence, columns_json, pg_types_json,
      current_columns_json, current_pg_types_json, current_attnums_json, max_attnum, current_not_null_json, current_defaults_json,
      generated_columns_json, export_key_json, reloptions_json, foreign_server_name,
      foreign_options_json, foreign_column_options_json, alterations_json, shape_changes_json, ordinal)
    VALUES (NULL,
      ?1, ?2, ?3, ?4, ?9, ?5, ?6, ?5, ?6, ?16, json_array_length(?5), ?13, ?14, ?8, ?7, ?15, ?10, ?11, ?12, '[]', '[]', COALESCE((SELECT MAX(ordinal)+1 FROM __edgepg_pg_tables), 1))
    ON CONFLICT(schema_name, table_name) DO UPDATE SET physical_name=excluded.physical_name,
      definition=excluded.definition, persistence=excluded.persistence,
      columns_json=excluded.columns_json, pg_types_json=excluded.pg_types_json,
      current_columns_json=excluded.current_columns_json, current_pg_types_json=excluded.current_pg_types_json,
      current_attnums_json=excluded.current_attnums_json,
      max_attnum=excluded.max_attnum,
      current_not_null_json=excluded.current_not_null_json, current_defaults_json=excluded.current_defaults_json,
      generated_columns_json=excluded.generated_columns_json,
      export_key_json=excluded.export_key_json,
      reloptions_json=excluded.reloptions_json,
      foreign_server_name=excluded.foreign_server_name,
      foreign_options_json=excluded.foreign_options_json,
      foreign_column_options_json=excluded.foreign_column_options_json`).bind(n.schema,n.name,n.physicalName,n.definition,JSON.stringify(n.columns),JSON.stringify(n.pgTypes),JSON.stringify(n.exportKey),JSON.stringify(n.generatedColumns||[]),n.persistence||"permanent",n.foreignServerName||null,JSON.stringify(n.foreignOptions||[]),JSON.stringify(n.foreignColumnOptions||{}),JSON.stringify(n.notNull||n.columns.map(()=>!1)),JSON.stringify(Rn(n.pgTypes,n.defaults||n.columns.map(()=>null))),JSON.stringify(n.reloptions||[]),JSON.stringify(n.columns.map((t,a)=>a+1)))}function zn(e,n){let t="COALESCE(current_columns_json,columns_json)",a="COALESCE(current_pg_types_json,pg_types_json)",o=`COALESCE(current_attnums_json,
    (SELECT json_group_array(CAST(key AS INTEGER)+1) FROM json_each(COALESCE(current_columns_json,columns_json))))`,g=`CASE WHEN max_attnum>0 THEN max_attnum
    ELSE COALESCE((SELECT MAX(CAST(value AS INTEGER)) FROM json_each(${o})),0) END`,l=`COALESCE(current_not_null_json,
    (SELECT json_group_array(0) FROM json_each(COALESCE(current_columns_json,columns_json))))`,E=`COALESCE(current_defaults_json,
    (SELECT json_group_array(NULL) FROM json_each(COALESCE(current_columns_json,columns_json))))`,c="export_key_json",N="COALESCE(generated_columns_json,'[]')";for(const s of n.shapeChanges){const i=y(s.column);if(s.action==="add"){const r=`(${g}+1)`;t=`json_insert(${t}, '$[#]', ${i})`,a=`json_insert(${a}, '$[#]', ${y(s.pgType)})`,o=`json_insert(${o}, '$[#]', ${r})`,g=r,l=`json_insert(${l}, '$[#]', ${s.notNull?1:0})`,E=`json_insert(${E}, '$[#]', ${s.defaultSql===void 0?"NULL":y(s.defaultSql)})`}else{const r=`(SELECT key FROM json_each(${t}) WHERE value=${i} LIMIT 1)`;s.action==="drop"?(t=`CASE WHEN ${r} IS NULL THEN ${t}
          ELSE json_remove(${t}, '$[' || ${r} || ']') END`,a=`CASE WHEN ${r} IS NULL THEN ${a}
          ELSE json_remove(${a}, '$[' || ${r} || ']') END`,o=`CASE WHEN ${r} IS NULL THEN ${o}
          ELSE json_remove(${o}, '$[' || ${r} || ']') END`,l=`CASE WHEN ${r} IS NULL THEN ${l}
          ELSE json_remove(${l}, '$[' || ${r} || ']') END`,E=`CASE WHEN ${r} IS NULL THEN ${E}
          ELSE json_remove(${E}, '$[' || ${r} || ']') END`,c=`CASE WHEN EXISTS (SELECT 1 FROM json_each(${c}) WHERE value=${i})
          THEN json_remove(${c}, '$[' || (SELECT key FROM json_each(${c}) WHERE value=${i} LIMIT 1) || ']')
          ELSE ${c} END`):s.action==="rename"?(t=`json_set(${t}, '$[' || ${r} || ']', ${y(s.newColumn)})`,c=`CASE WHEN EXISTS (SELECT 1 FROM json_each(${c}) WHERE value=${i})
          THEN json_set(${c}, '$[' || (SELECT key FROM json_each(${c}) WHERE value=${i} LIMIT 1) || ']', ${y(s.newColumn)})
          ELSE ${c} END`,N=`(SELECT COALESCE(json_group_array(json_object(
          'column', CASE WHEN json_extract(value,'$.column')=${i} THEN ${y(s.newColumn)}
            ELSE json_extract(value,'$.column') END,
          'expressionSql', replace(json_extract(value,'$.expressionSql'),
            ${y(`"${s.column.replaceAll('"','""')}"`)},
            ${y(`"${s.newColumn.replaceAll('"','""')}"`)}),
          'stored', json_extract(value,'$.stored'))), '[]') FROM json_each(${N}))`):s.action==="type"?a=`json_set(${a}, '$[' || ${r} || ']', ${y(s.pgType)})`:s.action==="set-not-null"?l=`json_set(${l}, '$[' || ${r} || ']', 1)`:s.action==="drop-not-null"?l=`json_set(${l}, '$[' || ${r} || ']', 0)`:s.action==="set-default"?E=`json_set(${E}, '$[' || ${r} || ']',
        ${s.defaultSql===void 0?"NULL":y(s.defaultSql)})`:s.action==="drop-default"&&(E=`json_set(${E}, '$[' || ${r} || ']', NULL)`)}}return e.prepare(`UPDATE __edgepg_pg_tables
    SET alterations_json=json_insert(COALESCE(alterations_json, '[]'), '$[#]', ?3),
        shape_changes_json=json_insert(COALESCE(shape_changes_json, '[]'), '$[#]', json(?4)),
        current_columns_json=${t}, current_pg_types_json=${a},
        current_attnums_json=${o},max_attnum=${g},
        current_not_null_json=${l}, current_defaults_json=${E}, export_key_json=${c},
        generated_columns_json=${N}
    WHERE schema_name=?1 AND table_name=?2`).bind(n.schema,n.name,n.definition,JSON.stringify(n.shapeChanges))}function Kn(e,n,t="edgepg"){return e.prepare(`INSERT INTO __edgepg_pg_objects(
      phase,kind,schema_name,object_name,owner_name,definition,view_definition,compact_view_definition,
      relation_natts,relation_pg_types_json,relation_collations_json,
      dependencies_json,routine_dependencies_json,reloptions_json,ordinal)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,
      COALESCE(?13,(SELECT count(*) FROM pragma_table_info(?9))),?14,?15,?10,?11,?12,
      COALESCE((SELECT MAX(ordinal)+1 FROM __edgepg_pg_objects WHERE phase=?1), 1))
    ON CONFLICT(phase, kind, schema_name, object_name) DO UPDATE SET
      definition=excluded.definition,view_definition=excluded.view_definition,
      compact_view_definition=excluded.compact_view_definition,
      relation_natts=excluded.relation_natts,
      relation_pg_types_json=excluded.relation_pg_types_json,
      relation_collations_json=excluded.relation_collations_json,
      dependencies_json=excluded.dependencies_json,routine_dependencies_json=excluded.routine_dependencies_json,
      reloptions_json=excluded.reloptions_json`).bind(n.phase,n.kind,n.schema,n.name,t,n.definition,n.viewDefinition||null,n.compactViewDefinition||n.viewDefinition||null,n.schema==="public"?n.name:`${n.schema}__${n.name}`,JSON.stringify(n.dependencies||[]),JSON.stringify(n.routineDependencies||[]),JSON.stringify(n.reloptions||[]),n.relationNatts??null,JSON.stringify(n.relationPgTypes||[]),JSON.stringify(n.relationCollations||[]))}function yn(){const e=a=>`'"' || replace(${a}, '"', '""') || '"'`,n=`${e("tables.schema_name")} || '.' || ${e("tables.table_name")}`,t=`(SELECT group_concat(${e("CAST(constraint_column.value AS TEXT)")}, ', ')
    FROM json_each(unique_constraint.columns_json) AS constraint_column)`;return`CREATE VIEW pg_catalog__pg_indexes AS
    SELECT tables.schema_name AS schemaname,tables.table_name AS tablename,
      unique_constraint.constraint_name AS indexname,NULL AS tablespace,
      'CREATE UNIQUE INDEX ' || ${e("unique_constraint.constraint_name")}
        || ' ON ' || ${n} || ' USING btree (' || ${t} || ')'
        || CASE WHEN unique_constraint.nulls_not_distinct=1 THEN ' NULLS NOT DISTINCT' ELSE '' END AS indexdef
    FROM __edgepg_unique_constraints AS unique_constraint
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=unique_constraint.table_name
    UNION ALL
    SELECT tables.schema_name,tables.table_name,object.object_name,NULL,object.definition
    FROM __edgepg_pg_objects AS object
    JOIN json_each(object.dependencies_json) AS dependency
    JOIN __edgepg_pg_tables AS tables ON tables.physical_name=CAST(dependency.value AS TEXT)
    WHERE object.kind='index' AND object.relation_oid IS NOT NULL`}function Qn(e,n){const t=JSON.parse(e);if(!Array.isArray(t)||!t.every(a=>typeof a=="string"))throw new TypeError(`${n} is not a string array`);return t}async function Cn(e){const n=await e.prepare(`SELECT schema_name,table_name,physical_name,
    columns_json,pg_types_json,shape_changes_json,current_columns_json,current_pg_types_json,
    current_attnums_json,max_attnum,current_not_null_json,current_defaults_json
    FROM __edgepg_pg_tables ORDER BY ordinal`).all(),t=[];for(const a of n.results){const o=`${a.schema_name}.${a.table_name}`,g=V(a.columns_json),l=V(a.pg_types_json);let E;if(g&&l&&g.length===l.length)try{E=Hn(g,l,a.shape_changes_json,o)}catch{E=void 0}const N=(await e.prepare(`PRAGMA table_info(${Oe(a.physical_name)})`).all()).results.filter(_=>!_.name.startsWith("__edgepg_")),s=N.map(_=>_.name),i=V(a.current_columns_json),r=V(a.current_pg_types_json),O=bn(a.current_attnums_json),b=!!(i&&r&&i.length===r.length&&(!s.length||ie(i,s)));let m,d,S,p;if(b)m=i,d=r,O&&O.length===m.length&&O.every(_=>Number.isSafeInteger(_)&&_>0)?(S=O,p=Math.max(Number(a.max_attnum)||0,...S,0)):E&&ie(m,E.columns)?(S=E.attnums,p=E.maxAttnum):(S=m.map((_,z)=>z+1),p=S.length);else if(E&&(!s.length||ie(E.columns,s)))({columns:m,pgTypes:d,attnums:S,maxAttnum:p}=E);else{m=s.length?s:g||[];const _=Ee(i,r),z=E?Ee(E.columns,E.pgTypes):new Map,ue=Ee(g,l);d=N.length?N.map(M=>_.get(M.name)||z.get(M.name)||ue.get(M.name)||String(M.type||"text").toLowerCase()):l||[],S=m.map((M,Le)=>Le+1),p=S.length}if(!m.length||m.length!==d.length)continue;const T=P(a.current_not_null_json),j=P(a.current_defaults_json),w=!b||!O||O.length!==m.length||O.some(_=>!Number.isSafeInteger(_)||_<=0)||Number(a.max_attnum)<Math.max(...S,0),Y=w||!T||T.length!==m.length||!j||j.length!==m.length;if(!w&&!Y)continue;const x=new Map(N.map(_=>[_.name,_])),v=T?.length===m.length?T:m.map(_=>Number(x.get(_)?.notnull||0)===1),se=j?.length===m.length?j:m.map(_=>Ae(x.get(_)?.dflt_value??null));t.push(e.prepare(`UPDATE __edgepg_pg_tables SET
      current_columns_json=?3,current_pg_types_json=?4,current_attnums_json=?5,max_attnum=?6,
      current_not_null_json=?7,current_defaults_json=?8
      WHERE schema_name=?1 AND table_name=?2`).bind(a.schema_name,a.table_name,JSON.stringify(m),JSON.stringify(d),JSON.stringify(S),p,JSON.stringify(v),JSON.stringify(se)))}t.length&&await e.batch(t)}function P(e){if(typeof e=="string")try{const n=JSON.parse(e);return Array.isArray(n)?n:void 0}catch{return}}function V(e){const n=P(e);return n?.every(t=>typeof t=="string")?n:void 0}function bn(e){const n=P(e);return n?.every(t=>typeof t=="number")?n:void 0}function ie(e,n){return e.length===n.length&&e.every((t,a)=>t===n[a])}function Ee(e,n){const t=new Map;if(!e||!n||e.length!==n.length)return t;for(const[a,o]of e.entries())t.set(o,n[a]);return t}function Hn(e,n,t,a){if(e.length!==n.length)throw new TypeError(`${a} initial column/type width mismatch`);const o=JSON.parse(t);if(!Array.isArray(o))throw new TypeError(`${a} shape changes are not an array`);const g=o.flatMap(i=>Array.isArray(i)?i:[i]),l=[...e],E=[...n],c=e.map((i,r)=>r+1);let N=c.length+1;const s=new Map;for(const i of g){if(!i||typeof i!="object"||typeof i.action!="string"||typeof i.column!="string")throw new TypeError(`${a} contains an invalid shape change`);const r=l.indexOf(i.column);if(i.action==="add"){if(typeof i.pgType!="string"||l.includes(i.column))throw new TypeError(`${a} contains an invalid added column`);l.push(i.column),E.push(i.pgType),c.push(N++)}else if(i.action==="drop"){if(r<0)throw new TypeError(`${a} drops an unknown column ${i.column}`);l.splice(r,1),E.splice(r,1),c.splice(r,1)}else if(i.action==="rename"){if(r<0||typeof i.newColumn!="string"||l.includes(i.newColumn))throw new TypeError(`${a} contains an invalid column rename`);l[r]=i.newColumn;for(const[O,b]of s)b===i.column&&s.set(O,i.newColumn);s.set(i.column,i.newColumn)}else if(i.action==="type"){if(r<0||typeof i.pgType!="string")throw new TypeError(`${a} changes an unknown column type`);E[r]=i.pgType}else{if(["set-not-null","drop-not-null","set-default","drop-default"].includes(String(i.action)))continue;throw new TypeError(`${a} contains an unsupported shape change`)}}return{columns:l,pgTypes:E,attnums:c,maxAttnum:N-1,renames:s}}function y(e){return`'${e.replaceAll("'","''")}'`}function Ae(e){return e===null?null:/\bstrftime\s*\([^)]*['"]now['"]/iu.test(e)||e.toUpperCase()==="CURRENT_TIMESTAMP"?"now()":/^\(?\s*\(?random\(\)\s*&\s*9223372036854775807\)?\s*\/\s*9223372036854775808\.0\s*\)?\s*\)?$/iu.test(e.trim())?"random()":e}function Rn(e,n){return n.map((t,a)=>jn(t,e[a]||""))}function jn(e,n){if(e===null)return null;e=Ae(e);const t=n.toLowerCase().replace(/^pg_catalog\./u,"");if(t==="boolean"||t==="bool"){const a=e.trim().toLowerCase();if(a==="1"||a==="true")return"true";if(a==="0"||a==="false")return"false"}return/^bit(?:\s+varying)?(?:\s*\(\s*\d+\s*\))?$/iu.test(t)&&!/::(?:"bit"|bit\s+varying)$/iu.test(e.trim())?`${e}::${/^bit\s+varying\b/iu.test(t)?"bit varying":'"bit"'}`:e}export{F as RELATION_TYPE_OID_OFFSET,Pn as ensurePostgresObjectCatalogStorage,Ge as ensurePostgresTableCatalogStorage,tn as informationSchemaColumnsBodySql,Ze as informationSchemaColumnsViewSql,ke as installPostgresCatalog,Rn as normalizeCatalogDefaults,En as pgAggregateViewSql,en as pgAttributeDefaultViewSql,Ln as pgAttributeNumericPrecisionSql,On as pgAttributeNumericScaleSql,ae as pgAttributePhysicalMetadataSql,oe as pgAttributeTypeModSql,D as pgAttributeTypeNameSql,rn as pgDatabaseViewSql,sn as pgDefaultAclViewSql,Nn as pgForeignDataWrapperViewSql,mn as pgForeignServerViewSql,dn as pgForeignTableViewSql,yn as pgIndexesViewSql,_n as pgNamespaceViewSql,on as pgProcViewSql,pn as pgPublicationTablesViewSql,ln as pgPublicationViewSql,un as pgRangeViewSql,cn as pgSubscriptionViewSql,gn as pgTablespaceViewSql,W as pgTypeOidSql,An as pgTypeViewSql,Sn as pgUserMappingViewSql,Tn as pgUserMappingsViewSql,zn as postgresCatalogAlterationStatement,nn as postgresCatalogDefaultExpressionSql,Kn as postgresCatalogObjectStatement,Yn as postgresCatalogTableStatement,kn as postgresRelationCatalogStorageCached};
