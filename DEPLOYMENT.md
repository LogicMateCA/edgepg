# Manual Cloudflare deployment

This guide deploys EdgePG as a dependency inside your own Cloudflare Worker. It does not use an EdgePG or All2CF installer, does not create resources on your behalf, and does not deploy a shared EdgePG service into the application hot path.

You will manually:

1. download and verify an immutable EdgePG package;
2. create or select a D1 database in your Cloudflare account;
3. add a Durable Object coordinator to your Worker configuration;
4. review a dry-run bundle;
5. deploy and verify your Worker.

## Before you begin

- Cloudflare account with Workers, D1, and Durable Objects enabled.
- Node.js 24 or newer and npm.
- Wrangler installed locally in the project. This guide was written for Wrangler `4.120.0`.
- A Worker project you control, or an empty directory for the minimal smoke-test Worker below.
- A license that covers your use. Personal/noncommercial use and time-limited evaluation are described in [LICENSE.md](LICENSE.md); commercial use requires a [written commercial license](COMMERCIAL-LICENSE.md).

The core deployment requires two bindings:

| Binding | Cloudflare resource | Purpose |
|---|---|---|
| `DB` | D1 database | PostgreSQL-compatible data and catalogs |
| `COORDINATOR` | Durable Object namespace | Transactions, locks, session workspaces, and ordered operations |

R2 is not required by the EdgePG core package. Add R2 only if your own application or backup design uses it.

## 1. Prepare the Worker project

For a new manual smoke-test project:

```bash
mkdir edgepg-worker
cd edgepg-worker
npm init -y
npm install --save-dev wrangler@4.120.0 typescript @types/node
mkdir -p src vendor
```

For an existing Worker, stay in its project directory and keep its current framework, entry point, and deployment process.

## 2. Download and verify EdgePG

Download the immutable rc.19 package:

```bash
curl -fL \
  -o vendor/edgepg-0.8.1-rc.19.tgz \
  https://github.com/LogicMateCA/edgepg/releases/download/v0.8.1-rc.19/edgepg-0.8.1-rc.19.tgz
```

Verify it before installation:

```bash
printf '%s  %s\n' \
  '6b018ff3998610eb66e706b7239b566bb6fddc2b3911d24e28c791a34c96958c' \
  'vendor/edgepg-0.8.1-rc.19.tgz' | sha256sum -c -
```

Expected output:

```text
vendor/edgepg-0.8.1-rc.19.tgz: OK
```

On macOS, use `shasum -a 256 vendor/edgepg-0.8.1-rc.19.tgz`. On Windows PowerShell, use `Get-FileHash -Algorithm SHA256 vendor/edgepg-0.8.1-rc.19.tgz` and compare the value exactly.

Install the verified local file:

```bash
npm install ./vendor/edgepg-0.8.1-rc.19.tgz
```

Keep the package and lockfile in your controlled build inputs. Do not replace rc.19 with an unverified mutable URL during CI.

## 3. Create or select D1 manually

You may create D1 in the Cloudflare dashboard, or run Cloudflare's command yourself:

```bash
npx wrangler d1 create edgepg-app-db
```

If Wrangler offers to edit the project automatically, decline and copy the returned `database_name` and `database_id`. This guide keeps resource creation and configuration explicit.

For an existing database, retrieve its identity:

```bash
npx wrangler d1 info edgepg-app-db
```

Do not continue with a placeholder ID. The Worker configuration must identify the exact D1 database you intend to use.

## 4. Add the Worker entry point

Create `src/index.ts` for the smoke test, or adapt the same imports and bindings in your existing Worker entry point:

```ts
import { Client, EdgePgTransactionCoordinator } from "edgepg";

// Cloudflare must see this named export for the COORDINATOR binding.
export { EdgePgTransactionCoordinator };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "GET" || url.pathname !== "/health") {
      return new Response("Not found", { status: 404 });
    }

    const client = new Client({
      bindings: {
        DB: env.DB,
        COORDINATOR: env.COORDINATOR,
      },
      database: "app",
    });

    try {
      await client.connect();
      const result = await client.query<{ ok: number }>(
        "SELECT 1::integer AS ok",
      );
      return Response.json({ ok: result.rows[0]?.ok === 1 });
    } catch (error) {
      console.error("EdgePG health query failed", error);
      return Response.json({ ok: false }, { status: 503 });
    } finally {
      await client.end();
    }
  },
} satisfies ExportedHandler<Env>;
```

This endpoint executes one fixed query. Do not expose an endpoint that accepts arbitrary SQL from the public Internet.

## 5. Configure D1 and the coordinator

Create or update `wrangler.jsonc`. Replace all three uppercase placeholders with values from your account:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "YOUR_WORKER_NAME",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-20",
  "compatibility_flags": ["nodejs_compat"],

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "YOUR_D1_DATABASE_NAME",
      "database_id": "YOUR_D1_DATABASE_ID"
    }
  ],

  "durable_objects": {
    "bindings": [
      {
        "name": "COORDINATOR",
        "class_name": "EdgePgTransactionCoordinator"
      }
    ]
  },

  "migrations": [
    {
      "tag": "edgepg-coordinator-v1",
      "new_sqlite_classes": ["EdgePgTransactionCoordinator"]
    }
  ],

  "observability": {
    "enabled": true
  }
}
```

Important:

- `DB` and `COORDINATOR` are the default EdgePG binding names.
- The Durable Object class is exported by the same application Worker; no separate EdgePG Worker is required.
- Add `edgepg-coordinator-v1` once. If the Worker already has migrations, append this entry without deleting or renaming existing migration tags.
- Do not remove the Durable Object migration during later package upgrades.

Generate Cloudflare types after the bindings are configured:

```bash
npx wrangler types
```

For a minimal TypeScript project, `tsconfig.json` can be:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "worker-configuration.d.ts"]
}
```

## 6. Preserve existing `pg` imports when needed

New code may import `Client` and `Pool` directly from `edgepg` or `edgepg/pg`. An existing Worker that already uses `import pg from "pg"` or `import { Client, Pool } from "pg"` can keep those application imports by adding a Wrangler module alias:

```jsonc
{
  "alias": {
    "pg": "edgepg/pg"
  }
}
```

The Worker entry module must still export the coordinator:

```ts
export { EdgePgTransactionCoordinator } from "edgepg";
```

Use `edgepg/pg` for the smaller core runtime. Only use `edgepg/full/pg` when the application explicitly needs the optional PL/pgSQL parser; the full entry increases the bundle and cold-start surface.

## 7. Validate before deployment

Run local static checks and a Wrangler dry run:

```bash
npx tsc --noEmit
npx wrangler types --check
npx wrangler deploy --dry-run --outdir .wrangler-dry-run
```

Inspect the output and confirm:

- the only intended D1 binding is `DB`;
- `COORDINATOR` points to `EdgePgTransactionCoordinator`;
- the package version is `0.8.1-rc.19` in `node_modules/edgepg/package.json`;
- no secrets, test fixtures, or unexpected application files are included.

The dry run builds the Worker but does not deploy it. Wrangler may generate a local source map in the dry-run directory; keep it private because it can expose application and dependency structure. Delete `.wrangler-dry-run` after inspection if you do not need to retain it as private build evidence.

## 8. Deploy manually

Authenticate to the intended Cloudflare account and verify the active identity:

```bash
npx wrangler login
npx wrangler whoami
```

Review `wrangler.jsonc` one final time, then deploy:

```bash
npx wrangler deploy
```

Record the Worker name, version ID, D1 database ID, package SHA-256, and deployment time. These are the minimum identities needed for an auditable upgrade or rollback.

Verify the fixed smoke-test endpoint at the deployed URL:

```bash
curl -fsS https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev/health
```

Expected response:

```json
{"ok":true}
```

For an existing application, run its normal read, write, transaction, and migration acceptance tests before moving production traffic.

## 9. Apply PostgreSQL migrations through EdgePG

Do not send PostgreSQL migrations directly to `wrangler d1 execute`. That command executes SQLite against D1 and bypasses EdgePG's PostgreSQL catalog and semantic layers.

Apply PostgreSQL DDL through one of these controlled paths instead:

- the application's existing `pg`/ORM migration runner after the `pg` alias is active;
- a private administrative Worker path that executes fixed, reviewed migrations;
- an authorized PGWire/connector path if your deployment includes one.

Never publish a generic unauthenticated SQL or migration endpoint. Back up important data before schema changes and validate restore procedures independently.

## 10. Upgrade and rollback

EdgePG releases are immutable. For an upgrade:

1. download the new release package;
2. verify its published SHA-256;
3. install it without deleting the previous package or deployment record;
4. rerun typecheck, dry-run, application gates, and backup/restore checks;
5. deploy only after the exact artifact passes.

List recent Worker versions:

```bash
npx wrangler versions list
```

Roll back Worker code to a recorded version ID:

```bash
npx wrangler rollback VERSION_ID
```

A Worker rollback does not undo D1 data or schema changes. Database rollback requires a separately tested backup/restore or forward-fix plan. Cloudflare also blocks some Worker rollbacks when resource bindings or Durable Object class migrations changed, so keep resource identities stable.

## Troubleshooting

| Symptom | Check |
|---|---|
| `EdgePG D1 binding DB is missing` | `d1_databases[].binding` is exactly `DB`, and the database ID is valid in the active account |
| `EdgePG Durable Object binding COORDINATOR is missing` | Named export, binding name, class name, and migration entry all match exactly |
| Durable Object migration error | Keep prior migration tags and add `edgepg-coordinator-v1` only once |
| `0A000` compatibility error | The SQL is outside the supported core boundary or requires an optional capability; do not rewrite it into a lossy SQLite approximation |
| PL/pgSQL parser capability error | Use the explicit `edgepg/full` or `edgepg/full/pg` entry only if the larger capability is required |
| Local build passes but deployed Worker fails | Recheck `wrangler whoami`, deployed bindings, Worker version ID, and exact package SHA |

## Official Cloudflare references

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Create and bind a D1 database](https://developers.cloudflare.com/d1/tutorials/build-an-api-to-access-d1/)
- [Durable Object bindings and migrations](https://developers.cloudflare.com/durable-objects/get-started/)
- [Wrangler TypeScript types](https://developers.cloudflare.com/workers/languages/typescript/)
- [Worker rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)

This repository intentionally does not include a deploy button, resource-provisioning script, automatic account mutation, or an All2CF installation dependency.
