# Browsable compiled distribution

`compiled/latest/` is the unpacked, installable EdgePG package for the latest public candidate. It exists so customers can inspect exactly which compiled files changed between releases without publishing the commercial source tree.

## Publication policy

Included:

- compiled JavaScript (`.js`, `.mjs`);
- compiled WebAssembly (`.wasm`);
- generated TypeScript declarations (`.d.ts`);
- package metadata and package documentation.

Excluded:

- original `.ts`, `.tsx` and Rust source files;
- source maps;
- tests, fixtures and internal evidence;
- build scripts and private development documentation;
- environment files, credentials and signing material.

The npm package remains the canonical installable artifact. The browsable tree must match its unpacked file hashes. Every release receives a permanent per-file manifest under `compiled/manifests/`; Git history on `compiled/latest/` shows which compiled files changed and when.

## Current compiled release

| Field | Value |
|---|---|
| Version | `edgepg@0.8.3` |
| Files | `198` |
| Uncompressed bytes | `4,903,761` |
| Raw TypeScript/TSX | `0` |
| Source maps | `0` |
| Tests/internal evidence | `0` |

- [Browse the compiled package](latest/)
- [Per-file SHA-256 manifest](manifests/0.8.3-files.json)
- [Download the compiled ZIP](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.3/edgepg-0.8.3-compiled.zip)
- [Download the canonical npm package](https://github.com/LogicMateCA/edgepg/releases/download/v0.8.3/edgepg-0.8.3.tgz)

The historical directory name `src/` inside the npm package is an internal package layout. Public files below it are compiled `.js` and generated `.d.ts`; original TypeScript source is not included.
