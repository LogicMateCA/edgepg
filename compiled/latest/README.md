# EdgePG dependency

EdgePG runs inside the customer's existing Cloudflare Worker.
It is not a separately deployed Worker service.

Import the common Core/ORM path from `edgepg`. Import `edgepg/full` only
when PL/pgSQL routine-definition parsing is required. The same package
also exposes `edgepg/plpgsql` for explicit parser injection.

Import the optional, default-off Read Accelerator feature explicitly from
`edgepg/accelerator`.

Import the optional, default-off pgvector-compatible feature explicitly
from `edgepg/plugins/vector`. Its Vector WASM is excluded from the default
`edgepg` Worker bundle and is included only by that explicit subpath.

The package contains no deployment orchestrator, standalone Worker,
local bridge command, native sidecar, or customer-resource provisioning.
