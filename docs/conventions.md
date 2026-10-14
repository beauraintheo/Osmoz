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
Claude Code loads it when working in that app.

👀 **Code used by one app stays in that app.** Code used by several apps lives
in `packages/*`. Move it there when a second app needs it, not before.

A package exposes its files through `exports` subpaths in its `package.json`
(`"./*": "./src/*.ts"`), so a consumer imports the file it needs:
`@Osmoz/<package>/<file>`.

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

import { formatPrice } from "@Osmoz/format/format-price";
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

## Tests

🔒 **Coverage is 100%**: lines, functions, branches and statements, on
`apps/*/src` and `packages/*/src`.

👀 **Every `.ts` file has its test file**: `x.test.ts` sits next to `x.ts`.
Exceptions: `*.test.ts`, `*.d.ts`, `*.config.ts` and generated code.

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
branch and a pull request.

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
- 👀 Reference the Linear issue in the footer: `Refs: OSM-12`.

### Hooks

| Hook         | Runs         |
| ------------ | ------------ |
| `pre-commit` | `vp staged`  |
| `commit-msg` | `commitlint` |

👀 Hooks are never bypassed (`--no-verify`). If a hook fails, fix the cause.

## Pull requests

- One issue, one branch, one pull request.
- Squash merge only, once `pnpm validate` passes.
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

Nothing will catch these. Reviewers, check them:

- The app's architecture is documented in `apps/<app>/CLAUDE.md`, and followed.
- Code used by one app stays in it; shared code moves to `packages/*` on the
  second use, not before.
- One concern per file, named after its main export, no category suffix.
- No re-export file: import from the defining file.
- Every `.ts` file has its `.test.ts`; every bug fix has a failing test first.
- No test deleted, skipped or weakened to go green.
- No `memo`, `useMemo`, `useCallback` without a measurement.
- No `useEffect` to derive state, no mutation of shared state, no `delete`.
- No noise comments.
- English commit subjects and PR titles, French PR descriptions and tickets.
