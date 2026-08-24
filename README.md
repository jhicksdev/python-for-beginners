# Python for Beginners

Learn Python right in your browser — no setup, no installs. Type code, hit
**Run**, and the exercise checks itself against real CPython running on
WebAssembly (via Pyodide) in a Web Worker.

## Live site

<https://jhicksdev.github.io/python-for-beginners/>

Deployed as a fully static site to GitHub Pages on every push to `main` (see
`.github/workflows/deploy.yml`).

## What's inside

- **11 chapters** from "Hello, World!" to a capstone, written as plain
  TypeScript modules in `content/` and bundled at build time.
- **In-browser Python 3.14** — learner code runs in a fresh namespace per run;
  check expressions are `eval`ed in that namespace and pass only when they
  evaluate to exactly `True`. Every run returns one JSON blob `{ok, output,
  error, checks, methodChecks}` — stdout is never used for results.
- **Technique enforcement** via AST: exercises can require `mustUseMethods` /
  `mustUseFunctions` (e.g. `strings-2` requires `.upper()`, `functions-3`
  requires `.lower()`). Only *real* call nodes in the source satisfy a
  requirement — comments and string literals don't.
- **Progress saved in the browser** (`localStorage`) — nothing leaves your
  machine.

## Requirements

- [Bun](https://bun.sh) (this is a Bun workspace; `bun.lock` is the lockfile)

## Commands

From the repo root:

```sh
bun run dev             # API server (:4568) + Vite client concurrently
bun run dev:client      # Vite client only (local development)
bun run dev:server      # API server only (local development)
bun run check           # svelte-check typecheck (client)
bun run lint            # ESLint flat config (repo root)
bun test                # server suite
bun run build           # Vite build -> client/dist
bun client/scripts/verify-content.ts   # every solution passes its own checks
bun client/scripts/smoke.ts            # runner sanity + must-use enforcement
```

`server/` is a **local-development only** utility (read-only content API +
static host). It is not deployed — the published site is fully static.

## Layout

```
content/     Chapter modules (Chapter type from shared/types)
client/      Svelte 5 + Vite app; runner lives in client/src/lib/runner
shared/      Shared TypeScript types only
server/      Local Bun dev server (API + static host of client/dist)
.github/     GitHub Pages deploy workflow
```

## Contributing an exercise

- Prompts live in `content/chNN-*.ts`. Keep `check` expressions evaluating to
  exactly `True`.
- Run `bun client/scripts/verify-content.ts` after editing content.
- If an exercise's prompt explicitly mandates a technique, tag it with
  `mustUseMethods` / `mustUseFunctions` so it can't be solved via a workaround.
- Prefer curated tags — don't enforce techniques the prompt doesn't require.