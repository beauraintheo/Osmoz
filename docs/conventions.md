# Conventions

How code is written, committed, reviewed and ticketed.

Each rule is marked:

- 🔒 **enforced**: a tool fails `pnpm validate`. You cannot miss it.
- 👀 **review**: nothing catches it. It is on you, and on the reviewer.

The 👀 rules are the ones that rot. They are listed together at the end.

## Architecture

These conventions hold in every project of the monorepo. The architecture does
not: each project picks the one that fits it.

👀 **Each app documents its architecture** in `apps/<app>/CLAUDE.md`: its
folders, its layers if any, where a file goes, which dependencies are allowed.
Claude Code loads it when working in that app. Its required sections and
template are in [app-spec.md](app-spec.md).

👀 **Code used by one app stays in that app.** Code used by several apps lives
in `packages/*`. Move it there when a second app needs it, not before.

👀 **Interface components are split in two.** `@osmoz/ui` holds them without
style: behavior, accessibility and API (`variant`, `size`, states exposed as
`data-*` and ARIA attributes), never a class name. Each app styles them in its
own `components/`, by wrapping the `@osmoz/ui` component with its classes, so
apps with different identities share the same behavior. A component goes to
`@osmoz/ui` from its first use: the second-app rule above does not apply to it.

👀 **Native elements first.** An `@osmoz/ui` component builds on the native
element (`<button>`, `<dialog>`). A headless library comes in only where no
native element fits, chosen with the first component that needs it.

👀 **Routing stays out of `@osmoz/ui`.** Its `Link` is a plain anchor with the
shared behavior. Each app styles it, then turns it into a router link with
TanStack Router's `createLink`, so `to` stays typed against its routes.

👀 **The Osmoz mark lives in `@osmoz/brand`, from the start.** It ships there
as components drawn without a color: they read `--osmoz-o` and
`--osmoz-cloud` from the app's theme. It is not part of `@osmoz/ui`, and the
second-app rule does not apply to it: the mark is shared by nature
([brand.md](brand.md)). The mark's source files stay in `docs/brand/`, and a
file enters the package only when code imports it. An image used by one app
stays in that app.

A package exposes `src/` through `exports` patterns in its `package.json`, one
per kind of file, never a list of files: `"./*": "./src/*.ts"` for code,
`"./*": "./src/*.tsx"` for components (`@osmoz/ui`, whose `.ts` logic stays
internal), `"./*": "./src/*"` for assets, `"./*.json": "./src/*.json"` or
`"./*.css": "./src/*.css"` next to code for JSON configs or stylesheets. A consumer imports the file it needs: `@osmoz/<package>/<file>`.

## Naming

🔒 **Files and folders are kebab-case.** Components and hooks included.

👀 **A file is named after its main export**, in kebab-case. The import path
tells which file holds which symbol:

```
order-status-badge.tsx   exports OrderStatusBadge
use-order-list.ts        exports useOrderList
format-price.ts          exports formatPrice
```

| Symbol                     | Case                       | Example                               |
| -------------------------- | -------------------------- | ------------------------------------- |
| Component, type, interface | PascalCase                 | `OrderStatusBadge`, `OrderListParams` |
| Hook                       | camelCase, `use` prefix    | `useOrderList`                        |
| Function, variable         | camelCase                  | `fetchOrderList`                      |
| Constant map or literal    | SCREAMING_SNAKE_CASE       | `ORDER_STATUS_LABELS`                 |
| Zod schema                 | camelCase, `Schema` suffix | `orderSchema`                         |

## Files

👀 **One file, one concern.** Split when the concern splits, and name the file
after the concern, never after its category.

```
order-status-labels.ts      says what is inside, and who else could use it
order-list.constants.ts     says only who owns it
```

No `.types.ts`, `.constants.ts`, `.utils.ts` or `.helpers.ts`. Props stay in the
component file. The only accepted suffixes are `.test.ts` and `.config.ts`.

The measure is not line count, it is **how many reasons the file has to
change**. A 200-line file with one reason is fine.

## Exports and imports

🔒 **Named exports only.** Default exports are allowed only where a tool
requires one: `*.config.ts`, `*.config.js`, `*.config.mjs`, `*.cjs`.

**No barrel files.** Import a symbol from the file that defines it.

- 🔒 No `index.ts` that exports anything.
- 🔒 No `export *`.
- 👀 No file whose purpose is to re-export (`export { x } from "./x"`).

👀 Export only what is used outside the file: every export is a contract.

🔒 **Imports are grouped and sorted**: Node builtins, packages, `@/` aliases,
relative paths, styles, with a blank line between groups. `pnpm check:fix` does
it for you.

```ts
import { readFileSync } from "node:fs";

import { formatPrice } from "@osmoz/format/format-price";
import { z } from "zod";

import { env } from "@/config/env";

import { OrderStatusBadge } from "./order-status-badge";
```

🔒 **Type-only imports use `import type`.** 🔒 **No circular dependency.**

## TypeScript

🔒 Strict mode, with `noUncheckedIndexedAccess`: indexing an array gives
`T | undefined`. Handle it.

🔒 **No `any`, no `!`, no `as`** (`as const` is fine). When a value's type is
not known, validate it with Zod rather than asserting it:

```ts
const payload: unknown = await response.json();
return orderListSchema.parse(payload);
```

🔒 **Explicit return types** on every function and component.

🔒 **Every promise is handled**: `await`, `.catch`, or `void` on purpose.

🔒 **`switch` over a union covers every member**, and **`??` over `||`** for
defaults, since `||` rewrites a legitimate `0`.

👀 **Annotate boundaries, let factories infer.** Annotate parameters, return
types and props. Never annotate a value built by a generic factory (`z.object`,
…): it can only widen the type.

👀 `interface` for props and object shapes, `type` for unions and `z.infer`.
API types are never written by hand: they are generated from the contract or
inferred from Zod.

## Functional style

🔒 **Function expressions, not declarations**: `const f = (): T => …`.

🔒 `const` by default, no `var`, no `forEach`: use `map`, `filter`, `reduce`,
`flatMap`.

🔒 **No mutation of a parameter**, its properties included. 👀 No mutation of a
shared variable, no `delete`: build a new value.

🔒 `console.log` is rejected. `console.warn` and `console.error` pass.

## React

👀 **Components are arrow functions**, with an explicit return type. No
component or hook defined inside another function.

```tsx
export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps): ReactElement => (
  <Badge>{ORDER_STATUS_LABELS[status]}</Badge>
);
```

👀 **No `memo`, `useMemo` or `useCallback`** when the React Compiler is enabled.
Add one only for a measured problem, with the measurement in the PR.

👀 **No `useEffect` to derive state.** Compute it during render. An effect is for
syncing with something outside React.

## Design

Each project has its own visual identity. These principles hold in all of them.

### Tokens

👀 **Semantic tokens only.** A token is named after its role, never after its
value. No palette token (`--blue-500`, `--gray-100`): the value goes straight
into the semantic token.

👀 **The color contract is shadcn's.** Every theme defines these tokens, and a
project may add its own roles on top:

| Role                  | Tokens                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| Page                  | `--background`, `--foreground`                                               |
| Surfaces              | `--card`, `--card-foreground`, `--popover`, `--popover-foreground`           |
| Actions               | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground` |
| Quiet and highlighted | `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`           |
| Danger                | `--destructive`, `--destructive-foreground`                                  |
| Lines and focus       | `--border`, `--input`, `--ring`                                              |
| Osmoz mark            | `--osmoz-o` (the app's accent), `--osmoz-cloud` (the Osmoz cloud color)      |

The mark's tokens color the `@osmoz/brand` components; their values are set
in [brand.md](brand.md).

👀 **The Tailwind palette is removed.** `@osmoz/theme/base.css` resets
`--color-*` and maps the contract to utilities, so `bg-primary` exists and
`bg-blue-500` generates nothing. Every app imports it right after Tailwind:

```css
@import "tailwindcss";
@import "@osmoz/theme/base.css";
```

👀 **Sizes use Tailwind's default scales**: spacing, text, radius, shadow,
breakpoints. An app gives them its identity by changing their values in its
`@theme` block (`--radius-md: 0`, `--font-sans: …`), not by adding names. A new
name is allowed only for a real role, like `--font-display`.

👀 **Typography roles are tokens.** Text that repeats a style (a title, a
label, code) gets a named role in the app's `@theme`: `--text-<role>` with its
`--line-height`, and its `--letter-spacing` and `--font-weight` when the role
sets them. A component writes `text-title`, never a raw `text-lg font-semibold
tracking-tight` combination for a role. The font family stays its own class
(`font-mono`), and a role name never repeats a color name, so `text-<role>`
stays a size. No `@apply`, no class constants in JS: a component for a role
only when it also carries an element and behavior, like a `<Label>` tied to
its field.

👀 **No arbitrary value** in a component: no `p-[13px]`, no `bg-[#fff]`.

🔒 **Tailwind classes are sorted**, in `className`, `class` and `cn(…)`, in
Tailwind's own order, without extra spaces or duplicates. `pnpm check:fix`
and format on save do it for you. Each app's classes are sorted against its own
theme file, so its own tokens sort in place: the root `vite.config.ts` finds
every app of `apps/` and its `src/theme/theme.css` by itself.

👀 **Colors in OKLCH.** OKLCH keeps contrast predictable when deriving a
variant.

👀 **One theme file per app, at `src/theme/theme.css`.** The Tailwind class
sorting reads it there: elsewhere, the app's own tokens sort as unknown
classes.

### Themes

A project can ship any number of themes, not only light and dark.

- A theme is a `[data-theme="<name>"]` block that defines the whole contract,
  and sets `color-scheme` (`light` or `dark`) for native controls.
- A token that equals another one in every theme, like `--popover` and
  `--card`, is an alias: declared once, as `var(--card)`, in a
  `:root, [data-theme]` block placed before the themes. A theme can still
  override it.
- 👀 **No `dark:` variant**, nor any per-theme class in a component: a third
  theme would break it. Only tokens change between themes.
- The default theme follows `prefers-color-scheme`; a manual choice is
  remembered, per app, under `<app>:theme`.
- 👀 **Theme logic comes from `@osmoz/theme`**, never rewritten in an app. The
  app declares its themes with `defineThemeOptions`, injects
  `firstPaintScript` through `headScripts` in `vite.config.ts`, creates its
  store with `createThemeStore` and reads it with `useTheme`. Each app builds
  its own switcher on top.
- Every theme meets the accessibility rules below on its own.

```css
[data-theme="terminal"] {
  color-scheme: dark;
  --background: oklch(0.16 0.02 150);
  --foreground: oklch(0.88 0.17 150);
}
```

### shadcn/ui

shadcn/ui is a starting point, not a dependency.

👀 **A generated component is split before it is committed.** Its behavior and
API go to `@osmoz/ui`, without classes; its classes go to the app's styled
component. Both follow every convention of this page: arrow function with a
return type, tokens only, no `dark:` variant, and tests on the `.ts` logic.

👀 The `cn` helper lives in each app's `lib/cn.ts`, not `lib/utils.ts`: set
`"utils": "@/lib/cn"` in `components.json`.

### Accessibility

WCAG 2.2 AA is the floor.

👀 **Contrast**: 4.5:1 for body text, 3:1 for large text, UI components and
focus indicators. Checked on the mockups, before any code.

👀 **Focus is always visible**: `:focus-visible` styled with an outline of at
least 2px. Never `outline: none` without a replacement.

👀 **Motion is opt-in**: anything that moves, resizes or scales lives inside
`@media (prefers-reduced-motion: no-preference)`. Color and opacity fades
may stay with reduced motion.

👀 **Targets** are at least 24×24px.

👀 **Color never carries information alone**: pair it with text or an icon.

👀 **Semantic HTML before ARIA**: a `button` to act, a link to navigate, a
heading for a title. No clickable `div`, and ARIA only where no native element
fits.

👀 **Every field has a label**, visible or `aria-label`, and every image an
`alt` (empty when decorative).

👀 **Everything works with the keyboard**: every action reachable with Tab, in
a logical order, and a dialog traps and restores focus.

## Tests

🔒 **Coverage is 100%**: lines, functions, branches and statements, on the
`.ts` files of each workspace's `src/`. Each workspace checks its own threshold.

👀 **Every `.ts` file has its test file**: `x.test.ts` sits next to `x.ts`.
Exceptions: `*.test.ts`, `*.d.ts`, `*.config.ts` and generated code
(`*.gen.ts`).

👀 **`.tsx` files get no unit test.** They render: logic worth testing moves to
a `.ts` file next to them. Rendering will be covered by end-to-end tests.

👀 **Every bug fix starts with a failing test.**

👀 **Test behavior, not implementation details.** No snapshots.

👀 **Never delete, weaken or skip a failing test, or lower a threshold, to make
`validate` pass.**

## Comments

👀 **No noise comments.** A comment that paraphrases the code, labels a section
or tells the story of a change is deleted wherever you find it. A choice that
needs explaining goes in the PR or in the docs.

👀 **Keep deliberate ones**: a `TODO`, a warning, a pointer the code cannot
carry. Never remove those.

## Git

### Branches

`main` is the only long-lived branch. Every change goes through a short-lived
branch off `main` and a pull request back into `main`. Nothing is committed
directly to `main`.

An urgent fix takes the same path: a `fix/<ISSUE-ID>-<slug>` branch off
`main`, a pull request, a squash merge. There is no shortcut.

```
<type>/<slug>
<type>/<ISSUE-ID>-<slug>
```

- `feat/login-form`
- `fix/OSM-12-token-refresh`

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`,
`build`, `revert`. The slug is lowercase kebab-case.

### Commits

🔒 [Conventional Commits](https://www.conventionalcommits.org), checked on
`git commit`.

```
<type>(<scope>): <subject>
```

- Scope: the workspace touched (`web`, `config`, …) or `deps`, `repo`.
- 👀 Subject: imperative, lowercase, no trailing period, in English.
- Breaking change: `feat(api)!: …` or a `BREAKING CHANGE:` footer.

### Hooks

| Hook         | Runs         |
| ------------ | ------------ |
| `pre-commit` | `vp staged`  |
| `commit-msg` | `commitlint` |

👀 Hooks are never bypassed (`--no-verify`). If a hook fails, fix the cause.

## Pull requests

- One issue, one branch, one pull request, targeting `main`.
- Squash merge into `main`, once `pnpm validate` passes.
- `/pull-request` in Claude Code drafts one.

**Title**: commit format, in **English**. It becomes the commit on `main`.

**Description**: in **French**. Concise Markdown, drop any empty section.

```markdown
## Ticket

[OSM-12](<linear url>)

## Quoi

<what changes, in 1 to 3 bullet points>

## Pourquoi

<the reason, in 1 to 2 sentences>

## Vérification

- [x] `pnpm validate`
- <manual check performed, if any>

## Points d'attention

<breaking change, migration, risk, follow-up>
```

👀 Describe the change, not the commit history. List only the checks that were
actually run.

### Release

Each app has its own SemVer version, tags, changelog and GitHub Releases. The
shared packages `brand`, `config`, `theme` and `ui` are versioned the same way; the root and
`scripts` are not. Nothing is released by hand: release-please computes it
from the commits on `main` (`.github/workflows/release.yml`,
`release-please-config.json`).

1. Every squash merge into `main` updates a **release pull request** per
   workspace it touches, like `chore(main): release flex-playground 0.2.0`. It
   holds the new version and the `CHANGELOG.md`.
2. Merging it, squash like any other pull request, releases the workspace: tag
   `flex-playground-v0.2.0` and a GitHub Release with its changelog.

The type of the pull request title, which becomes the squash commit, sets the
bump:

| Commit                        | While `0.x` | From `1.0.0` |
| ----------------------------- | ----------- | ------------ |
| `feat`                        | minor       | minor        |
| `fix`, `perf`, `revert`       | patch       | patch        |
| `!` or `BREAKING CHANGE:`     | minor       | major        |
| `chore`, `ci`, `docs`, others | none        | none         |

- A release of `brand`, `config`, `theme` or `ui` bumps every app that depends on it with a
  patch. When the change is a feature of the app, the pull request touches the
  app too, and its `feat` title bumps the app with a minor.
- 👀 To force a version, like `1.0.0`, add a `Release-As: 1.0.0` footer to the
  squash commit. It only applies to the workspaces the commit touches, and only
  to a commit that releases (`feat`, `fix`, `perf`, `revert` or breaking).
- Release pull requests are opened by the repository's GitHub App, so the
  `validate` check runs on them. It reads the `RELEASE_APP_CLIENT_ID` variable
  and the `RELEASE_APP_PRIVATE_KEY` secret.

## Tickets

Tickets live in Linear, written in **French**. `/linear-ticket <intention>` in
Claude Code drafts one.

**Type**: bug, feature, improvement or tech/chore.

**Title**: imperative, ≤ 70 characters, specific, no type prefix, no trailing
period.

```
Corriger le double envoi du formulaire de contact     not [BUG] Problème formulaire.
```

**Description**: concise Markdown, drop any empty section.

```markdown
## Contexte

<why, in 1 to 3 sentences>

## Attendu

<what must exist once done>

## Critères d'acceptation

- [ ] <verifiable, observable>
```

For a bug, `## Contexte` becomes `## Constaté` (current behavior) followed by
`## Reproduction` (numbered steps).

- 2 to 5 acceptance criteria, each testable.
- No imposed technical solution. Ideas go in an optional `## Pistes` section,
  labeled as hypotheses.
- No invented facts: no file, number, URL or cause stated without evidence.

**Labels**: existing ones only, usually type + area, 1 to 3. New labels are
created by the project owner.

**Priority**: only when known. 1 Urgent, 2 High, 3 Medium, 4 Low.

## The 👀 list

Nothing will catch these. `/review` checks them, and so does any human
reviewer:

- The app's architecture is documented in `apps/<app>/CLAUDE.md`, and followed.
- Code used by one app stays in it; shared code moves to `packages/*` on the
  second use, not before.
- Interface components: behavior without classes in `@osmoz/ui`, classes in the
  app's `components/`; native elements before a headless library.
- The Osmoz mark in `@osmoz/brand`, colored by the app's `--osmoz-o` and
  `--osmoz-cloud`; no router in `@osmoz/ui`.
- One concern per file, named after its main export, no category suffix.
- No re-export file: import from the defining file.
- Every `.ts` file has its `.test.ts`; every bug fix has a failing test first.
- No test deleted, skipped or weakened to go green.
- No `memo`, `useMemo`, `useCallback` without a measurement.
- No `useEffect` to derive state, no mutation of shared state, no `delete`.
- Semantic colors only, Tailwind scales for sizes, no arbitrary value, no
  `dark:` variant.
- shadcn components split between `@osmoz/ui` and the app, and adapted to
  these conventions, before commit.
- WCAG 2.2 AA: contrast, visible focus, opt-in motion, 24px targets, semantic
  HTML, labels and `alt`, keyboard access.
- No noise comments.
- English commit subjects and PR titles, French PR descriptions and tickets.
