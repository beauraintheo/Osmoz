# Getting started

From a fresh clone to your first pull request.

## 1. Install

You need **Node 24** and **pnpm 12**. The Node version is pinned in
`.node-version` (fnm and nvm read it), pnpm in `package.json`:

```bash
corepack enable
```

Then:

```bash
pnpm install
pnpm dev
```

`pnpm install` also installs the git hooks (husky).

## 2. Everyday commands

| Command               | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `pnpm dev [app]`      | Run every workspace in dev mode, or only `<app>`              |
| `pnpm validate [app]` | `check`, then types and tests at 100% coverage (see below)    |
| `pnpm build [app]`    | `validate`, then build. Stops if validation fails             |
| `pnpm check`          | Format and lint (oxfmt + type-aware oxlint), without writing  |
| `pnpm check:fix`      | Same, with fixes: formatting, import order, autofixable rules |
| `pnpm check-types`    | TypeScript, in every workspace                                |
| `pnpm test`           | Unit tests of every workspace, once                           |
| `pnpm test:coverage`  | Same, with the 100% coverage threshold                        |

`[app]` is a folder name of `apps/`, like `pnpm build flex-playground`. An
unknown name fails and lists the apps.

- Without an app, `validate` covers the whole monorepo.
- With an app, it covers the app **and the shared packages it depends on**:
  lint and format stay global, types and tests run only where the app is
  affected.

`pnpm app` asks the same thing interactively: pick an app (or all of them),
then `dev`, `validate` or `build`. Arrows to move, Enter to confirm, Ctrl+C
to cancel.

`pnpm build <app>` is what a deployment runs: nothing is built until the app
and its packages pass. Each command prints the underlying `vp` commands it
runs. `@osmoz/scripts` holds them.

## 3. Create an app

`/new-app` in Claude Code does it for you. By hand, a front app is
`apps/<app>/` and its config is only a few lines, because `@osmoz/config`
holds the shared base: TypeScript, Vite, React with the React Compiler,
Tailwind, TanStack Router with file-based routing, and Vitest.

`package.json`: the shared packages and the runtime libraries, all versions
from the pnpm catalog (`pnpm-workspace.yaml`), never written in the app.

```json
{
  "name": "@osmoz/<app>",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "check-types": "tsc --noEmit",
    "test": "vp test run",
    "test:coverage": "vp test run --coverage",
    "validate": "vp run check-types && vp run test:coverage"
  },
  "dependencies": {
    "@tanstack/react-router": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@osmoz/config": "workspace:*",
    "@osmoz/theme": "workspace:*",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "tailwindcss": "catalog:",
    "typescript": "catalog:",
    "vite-plus": "catalog:"
  }
}
```

`vite.config.ts`:

```ts
import { defineAppConfig } from "@osmoz/config/define-app-config";
import { defineConfig } from "vite-plus";

export default defineConfig(defineAppConfig({ root: import.meta.dirname }));
```

`tsconfig.json`:

```json
{
  "extends": "@osmoz/config/tsconfig.react.json"
}
```

Then `index.html`, `src/main.tsx`, `src/routes/` and the theme file. The router
plugin generates `src/route-tree.gen.ts` on `dev` and `build`: it is generated
code, ignored by lint, format and coverage. `@/` points to the app's `src/`.

The index route of a folder is `home.tsx`, not `index.tsx`: `routes/home.tsx`
is `/`, `routes/posts/home.tsx` is `/posts/`. A route file exports `Route`, and
the linter forbids named exports from an `index` file.

What the app adds to the base, and why, goes in its `CLAUDE.md`
([app-spec.md](app-spec.md)).

## 4. From a ticket to a pull request

1. **Ticket.** Every change starts from a Linear issue. `/linear-ticket` drafts
   one.
2. **Branch** off an up-to-date `main`, named after the issue:
   `feat/OSM-12-login-form`.
3. **Write the code** following [conventions.md](conventions.md).
4. **Test it**: each `.ts` file gets its `.test.ts`, coverage stays at 100%.
5. **Commit.** The `pre-commit` hook formats and lints staged files, `commit-msg`
   checks Conventional Commits.
6. **Run `pnpm validate`**, then push and open the pull request into `main`.
   `/pull-request` drafts it.
7. **Review.** `/self-review` reports no blocking finding, ideally run in a
   fresh Claude Code session. A PR touching code also goes through
   `/code-review`. Every finding gets a change or a reply.
8. **Merge.** Squash merge into `main` once `pnpm validate` passes, delete the
   branch.

> [!IMPORTANT]
> Never disable a rule, skip a test, lower a threshold or use `--no-verify` to
> make a check green: fix the code, or say what fails in the PR.

## 5. What surprises people

- **`pnpm check` proves little.** It formats and lints, but runs no typecheck and
  no tests. Only `pnpm validate` tells you the work is done.
- **Coverage is 100%, not "high".** One uncovered branch fails `pnpm validate`.
- **`console.log`, `any`, `as` casts, `!` and default exports are rejected** by
  the linter. `console.warn` and `console.error` pass.
- **Function declarations are rejected.** Write `const f = (): T => …`.
- **`pnpm check:fix` reorders your imports.** That is expected.
- **Only `.ts` files are unit tested.** `.tsx` files render, and coverage
  ignores them.
- **`@osmoz/config` imports its own files with the `.ts` extension.** Node
  loads it as is when Vite reads an app's `vite.config.ts`, and Node requires
  the extension.

## 6. Next

Read [conventions.md](conventions.md). What to work on lives in Linear.
