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

| Command               | What it does                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `pnpm dev [app]`      | Run every workspace in dev mode, or only `<app>`                        |
| `pnpm validate [app]` | `check`, then types and tests at 100% coverage, stories included        |
| `pnpm build [app]`    | `validate` without the stories, then build. Stops if validation fails   |
| `pnpm check`          | Format and lint (oxfmt + type-aware oxlint), without writing            |
| `pnpm check:fix`      | Same, with fixes: formatting, import and class order, autofixable rules |
| `pnpm check-types`    | TypeScript, in every workspace and in `.storybook/`                     |
| `pnpm test`           | Unit tests of every workspace, once                                     |
| `pnpm test:coverage`  | Same, with the 100% coverage threshold                                  |
| `pnpm test:stories`   | Every story's interaction test in Chromium, `.tsx` coverage at 100%     |
| `pnpm storybook`      | The components' Storybook, on http://127.0.0.1:6006                     |

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
and its packages pass. It skips the stories, which need a browser: the
`validate` check of every pull request already ran them. Each command prints the underlying `vp` commands it
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
    "@osmoz/brand": "workspace:*",
    "@osmoz/preferences": "workspace:*",
    "@osmoz/ui": "workspace:*",
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
import { firstPaintScript } from "@osmoz/preferences/theme/first-paint-script";
import { defineConfig } from "vite-plus";

import { THEME_OPTIONS } from "./src/theme-options";

export default defineConfig(
  defineAppConfig({
    root: import.meta.dirname,
    headScripts: [firstPaintScript(THEME_OPTIONS)],
  }),
);
```

`src/theme-options.ts` declares the app's themes. A module of the app exports
its single store, `useThemeStore = createThemeStore(THEME_OPTIONS)`: a zustand
hook, which `src/main.tsx` imports before rendering and the app's switcher
calls with a selector, `useThemeStore((state) => state.resolved)`. Where these
files go is up to the app's `CLAUDE.md`.

```ts
import { defineThemeOptions } from "@osmoz/preferences/theme/theme-options";

export const THEME_OPTIONS = defineThemeOptions({
  app: "<app>",
  themes: ["light", "dark"],
  system: { light: "light", dark: "dark" },
});
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

Texts come from the app's catalogs, in `src/i18n/`: one file per language,
`use-locale-store.ts`, which creates the app's single language store, a
zustand hook, and `use-messages.ts`, which components read their texts with.
`src/main.tsx` imports the store before rendering
([conventions.md](conventions.md#texts-and-languages)).

```ts
import { createLocaleStore } from "@osmoz/preferences/i18n/create-locale-store";

import { en } from "./en";
import { fr } from "./fr";

export const useLocaleStore = createLocaleStore({
  app: "<app>",
  catalogs: { en, fr },
  fallback: "fr",
  locales: ["fr", "en"],
});
```

```ts
import type { fr } from "./fr";
import { useLocaleStore } from "./use-locale-store";

export const useMessages = (): typeof fr => useLocaleStore((state) => state.messages);
```

Interface components come from `@osmoz/ui`, without style: the app wraps each
one it uses in its own `components/ui/`, with its classes, and its `cn` helper
lives in `src/lib/cn.ts` ([conventions.md](conventions.md#architecture)).

The theme file is always `src/theme/theme.css`: the root `vite.config.ts`
finds it there to sort the app's Tailwind classes against its own tokens.
Nothing to declare. Each of its themes also sets `--osmoz-o` and
`--osmoz-cloud`, which color the Osmoz mark of `@osmoz/brand` in the
signature ([brand.md](brand.md)). It imports `@osmoz/brand/brand.css` right
after `@osmoz/theme/base.css`, so Tailwind generates the mark's classes:

```css
@import "tailwindcss";
@import "@osmoz/theme/base.css";
@import "@osmoz/brand/brand.css";
```

What the app adds to the base, and why, goes in its `CLAUDE.md`
([app-spec.md](app-spec.md)).

## 4. Create a component

An interface component lives in two places: its behavior in `@osmoz/ui`,
shared, and its look in the app ([conventions.md](conventions.md#architecture)).

1. **Design it.** On the app's mockups, in the screen that uses it, then on the
   components boards with every state, in every theme. Tokens and typography
   roles only.
2. **Write its behavior** in `packages/ui/src/<component>/<component>.tsx`:
   the native element first, never a class name. Its API is `variant` and
   `size`, its states are `data-*` and ARIA attributes, and its props extend
   `ComponentProps<"<element>">`. Logic beyond wiring goes to a `.ts` file next
   to it, with its `.test.ts`. Its texts come from the app, as props.
3. **Style it** in `apps/<app>/src/components/ui/<component>.tsx`: wrap the
   `@osmoz/ui` component and give it the app's classes with `cn`. Every state
   of the boards has its class: `hover:`, `focus-visible:`, `disabled:`,
   `aria-busy:`…
4. **Document it.** `/document-component <component>` in Claude Code drafts
   it, or by hand, following `button/`:
   - `packages/ui/src/<component>/<component>.stories.tsx`: one story per
     state, each with a `play` test of its behavior: roles, ARIA attributes,
     keyboard, clicks that run or are blocked.
   - `packages/ui/src/<component>/<component>.mdx`: why it exists, its usage,
     states, keyboard, accessibility and API.
   - `apps/<app>/src/components/ui/<component>.stories.tsx`: one story per
     variant, size and board state, with `parameters: { app: "<app>" }`.
5. **Use it.** Routes, features and the app's own components import the
   styled component from `components/ui/`, never `@osmoz/ui` directly.
6. **Check it.** The rendered states match the boards, every action works with
   the keyboard, and `pnpm validate` passes. A state found along the way goes
   back to the boards.

`text-control` below is one of the app's typography roles: each app declares
its own in `theme.css` ([conventions.md](conventions.md#tokens)).

```tsx
// packages/ui/src/button/button.tsx: behavior, no class
export const Button = ({ type = "button", ...props }: ButtonProps): ReactElement => (
  <button {...props} type={type} />
);

// apps/<app>/src/components/ui/button.tsx: the app's look
export const Button = ({ className, ...props }: ButtonProps): ReactElement => (
  <BaseButton {...props} className={cn("bg-primary text-control h-8 rounded-md px-3", className)} />
);
```

## 5. From a ticket to a pull request

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
7. **Review.** `/review` reports no blocking finding, ideally run in a
   fresh Claude Code session. When the PR touches code, it also runs
   `/code-review` and reports its bugs. Every finding gets a change or a reply.
8. **Merge.** Squash merge into `main` once the `validate` check passes, delete
   the branch.

Every pull request runs `pnpm validate` in GitHub Actions
(`.github/workflows/validate.yml`), with the Node version of `.node-version`
and the pnpm version of `package.json`. The `main` ruleset requires its
`validate` check on a branch up to date with `main`: a red check, or a branch
behind `main`, blocks the merge.

> [!IMPORTANT]
> Never disable a rule, skip a test, lower a threshold or use `--no-verify` to
> make a check green: fix the code, or say what fails in the PR.

## 6. What surprises people

- **`pnpm check` proves little.** It formats and lints, but runs no typecheck and
  no tests. Only `pnpm validate` tells you the work is done.
- **Coverage is 100%, not "high".** One uncovered branch fails `pnpm validate`.
- **`console.log`, `any`, `as` casts, `!` and default exports are rejected** by
  the linter. `console.warn` and `console.error` pass.
- **Function declarations are rejected.** Write `const f = (): T => …`.
- **Text written in JSX is rejected**, `aria-label` included. It comes from the
  app's catalog, read with the app's `useMessages`: `{messages.app.name}`.
- **`pnpm check:fix` reorders your imports, your Tailwind classes, and your
  keys and props** ([conventions.md](conventions.md#ordering)).
  That is expected; a blank line keeps a group apart. In VS Code, saving a file does the same: install the recommended
  Oxc extension, which runs Vite+'s formatter and linter with the root
  `vite.config.ts`. After changing that config, run **Oxc: Restart oxfmt
  Server**.
- **`.ts` files have unit tests, `.tsx` components have stories.** The `.tsx`
  of `@osmoz/ui` and of each app's `components/ui/` reach 100% coverage
  through their stories' interaction tests. Those run without the React
  Compiler, whose memoization adds branches no render can take. Other `.tsx`
  files, like routes, are not covered yet.
- **Stories run in a real Chromium.** The first time, run
  `pnpm exec playwright install chromium-headless-shell`.
- **`@osmoz/config` imports its own files with the `.ts` extension.** Node
  loads it as is when Vite reads an app's `vite.config.ts`, and Node requires
  the extension.

## 7. Next

Read [conventions.md](conventions.md). What to work on lives in Linear.
