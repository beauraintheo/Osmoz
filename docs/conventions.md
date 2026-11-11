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
own `components/ui/`, by wrapping the `@osmoz/ui` component with its classes, so
apps with different identities share the same behavior. A component goes to
`@osmoz/ui` from its first use: the second-app rule above does not apply to it.

👀 **A component belongs to `@osmoz/ui`** when it matches a Base UI component,
or when it enforces an accessibility guarantee that Base UI leaves to the
caller, like a required label. Anything else is the app's own component, built
from `components/ui/`.

👀 **Base UI first, native otherwise.** An `@osmoz/ui` component wraps the
[Base UI](https://base-ui.com) component that matches it, which brings its
keyboard, focus and ARIA behavior. Where Base UI has none, it builds on the
native element. `@osmoz/ui` adds only what the apps need on top, and keeps its
own API: it does not expose Base UI's `render` prop, nor a `className` or
`style` that is a function of the state, until a component needs one.

👀 **One folder per `@osmoz/ui` component**, named after it, holding the
component and, when it has logic beyond wiring, that logic and its tests.

👀 **Routing stays out of `@osmoz/ui`.** Each app turns the shared link into a
router link, so its targets stay typed against its routes.

👀 **The Osmoz mark lives in `@osmoz/brand`, from the start.** It looks the
same in every app and takes its colors from the app's theme, never from a token
or role of one app. The second-app rule does not apply to it: the mark is
shared by nature ([brand.md](brand.md)). An image used by one app stays in that
app.

👀 **Every `@osmoz/ui` component is documented in the Storybook**, from its
first use. 🔒 Its folder holds `<component>.stories.tsx` and
`<component>.mdx`, or `component-docs.test.ts` fails. Each app that styles it
adds `<component>.stories.tsx` next to its `components/ui/<component>.tsx`.
`/document-component` drafts all three.

👀 **An app's component page is generated from its stories**, never written
in MDX.

👀 **Every prop in a story's API table has a description**, never in a code
comment. A description says what a developer cannot read in the type: when to
use the prop, what it changes, what it requires. It is written once: an app's
story describes what its wrapper adds and points to the component's Osmoz page
for the rest.

👀 **Only a component's first story is interactive.** It is named `Default`,
in `@osmoz/ui` and in every app, and shows the component with its default
props. Its controls and actions are enabled; every other story disables them,
since it shows one fixed state.

👀 **A state story of `@osmoz/ui` stays out of the sidebar** (`tags: ["!dev"]`).
It still runs its `play` test and shows on the doc page as an example, and its
attributes are read in the API section. An app's state stories stay in the
sidebar, since its classes make each state visible.

👀 **An Osmoz page follows one outline**, set in
[getting-started.md](getting-started.md#4-create-a-component): its default
story and each example show their code, and its API lists the attributes the
component sets.

👀 **A shared component gets its text from the app.** A component of
`@osmoz/ui` or `@osmoz/brand` writes no user-facing text: it takes it as a
prop, with no default, so each app passes its own wording and language.

👀 **The visitor's preferences live in `@osmoz/preferences`**, one folder per
preference, never in an app's own storage code. `@osmoz/theme` holds only the
design contract.

👀 **A package exposes `src/` through `exports` patterns**, one per kind of
file, never a list of files. A consumer imports the file it needs:
`@osmoz/<package>/<file>`.

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
requires one: `*.config.ts`, `*.config.js`, `*.config.mjs`, `*.cjs`, and
Storybook's `*.stories.tsx` and `.storybook/*` files.

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

👀 **In an app, `./` within a folder, `@/` across folders**, never `../`.
The path then says where the file lives, a layer an import breaks shows in
it, and moving a file only touches the imports that point to it. Code outside
an app has no `@/` alias: it keeps relative paths.

🔒 **Type-only imports use `import type`.** 🔒 **No circular dependency.**

## Ordering

🔒 **Keys and members are sorted alphabetically**: object keys, interface and
object type members, enum members and JSX props. `pnpm check:fix` sorts
them for you.

- A blank line starts a new group: each group is sorted on its own, and the
  groups keep their order. Use it for a real grouping, not to escape the rule.
- A spread stays where it is: keys are sorted on each side of it.
- Arrays are never sorted, so an order that matters goes in an array.
- Union members are not sorted: write them in their natural order
  (`"sm" | "md" | "lg"`, `string | null`).

🔒 **Lines stop at 100 characters**, enforced by the formatter (`printWidth`).
It never splits a string: a long list of classes may go past it.

🔒 **An object literal with 3 keys or more spans one line per key**;
`pnpm check:fix` breaks it for you. Below 3 keys, an object stays on one line
unless it is already broken: the formatter keeps an object multi-line when a
line break follows its opening brace.

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

🔒 **No nested ternary.** A choice between more than two values is a
constant map read by its key, or an early return.

🔒 **No mutation of a parameter**, its properties included. 👀 No mutation of a
shared variable, no `delete`: build a new value.

👀 `console.log` is a lint warning: it does not fail `pnpm validate`, so it is
removed before review. `console.warn` and `console.error` pass.

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

## Texts and languages

Every text an app shows comes from its message catalog, so a language can be
added without touching a component.

🔒 **No text written in JSX.** A text child, or a string in `aria-label`,
`aria-description`, `alt`, `title`, `placeholder` or `label`, fails the
linter (`react/jsx-no-literals`). Read it from the catalog instead:

```tsx
<h1 className="text-title">{messages.app.name}</h1>
```

A text built outside JSX, like a string passed to a function, is not caught:
👀 it goes through the catalog all the same.

🔒 **A key that does not exist fails the typecheck**, and so does a
translation that misses or adds a key, since it is written
`satisfies typeof <source>`.

- **A message** is a string, or a function when it takes parameters. Plurals
  use `Intl.PluralRules` inside that function.
- **Each language** is one file, typed against the source catalog, with a test
  that no message is left empty. That test checks only string messages: 👀 a
  message that is a function is checked on review.
- **The language is the visitor's choice**, remembered per app, else the app's
  fallback: the browser's language is not followed.
- **Components read their texts through the app's hook**, never from a
  catalog.
- 👀 **Shared components take their texts as props**
  ([Architecture](#architecture)): the app passes them from its catalog.
  Punctuation belongs to the message too: `"(new tab)"`, not `({label})` in
  the component.

## Design

Each project has its own visual identity. These principles hold in all of them.

### Tokens

👀 **Semantic tokens only.** A token is named after its role, never after its
value. No palette token (`--blue-500`, `--gray-100`): the value goes straight
into the semantic token.

👀 **One color contract for every app.** Every theme defines these tokens, and a
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

👀 **The Tailwind palette is removed.** Only the contract generates color
utilities, so `bg-primary` exists and `bg-blue-500` generates nothing.

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

🔒 **Tailwind classes are sorted**, in Tailwind's own order, without extra
spaces or duplicates. `pnpm check:fix` and format on save do it for you.

👀 **Colors in OKLCH.** OKLCH keeps contrast predictable when deriving a
variant.

👀 **One theme file per app, at `src/theme/theme.css`.**

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
  remembered, per app.
- 👀 **Theme logic comes from `@osmoz/preferences`**, never rewritten in an
  app. Each app builds its own switcher on top.
- Every theme meets the accessibility rules below on its own.

```css
[data-theme="terminal"] {
  color-scheme: dark;
  --background: oklch(0.16 0.02 150);
  --foreground: oklch(0.88 0.17 150);
}
```

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
Exceptions: `*.test.ts`, `*.d.ts`, tool configs and generated code (`*.gen.ts`).

👀 **`.tsx` files get no unit test.** They render: logic worth testing moves to
a `.ts` file next to them.

🔒 **Components are tested by their stories.** Each story of
`*.stories.tsx` is a test: its `play` function checks the behavior, never a
class. They hold the `.tsx` of `@osmoz/ui` and of every `components/ui/` at 100%
coverage: an uncovered branch is a missing story. Other `.tsx` files will be
covered by end-to-end tests.

👀 **Every bug fix starts with a failing test.**

👀 **Test behavior, not implementation details.** No snapshots.

👀 **Never delete, weaken or skip a failing test, or lower a threshold, to make
`validate` pass.**

## Documentation

👀 **Docs hold rules, never cases.** A page of `docs/`, a `CLAUDE.md`, a skill
or a Storybook page states what holds for every component, app or ticket. It
never lists components, records a ticket's progress, nor copies code or
tokens that live in the source: it points to the source instead. A rule added
to one of them is written the same way. A change that only adds a component,
a token or a ticket's step never touches them.

The one exception is a component's own doc page, which describes that
component alone.

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

Each app and shared package has its own SemVer version, tags, changelog and
GitHub Releases; the root and `@osmoz/scripts` do not. Nothing is released by
hand: release-please computes it from the commits on `main`.

1. Every squash merge into `main` updates a **release pull request** per
   workspace it touches, like `chore(main): release <app> 0.2.0`. It holds the
   new version and the `CHANGELOG.md`.
2. Merging it, squash like any other pull request, releases the workspace: a
   tag `<app>-v0.2.0` and a GitHub Release with its changelog.

The type of the pull request title, which becomes the squash commit, sets the
bump:

| Commit                        | While `0.x` | From `1.0.0` |
| ----------------------------- | ----------- | ------------ |
| `feat`                        | minor       | minor        |
| `fix`, `perf`, `revert`       | patch       | patch        |
| `!` or `BREAKING CHANGE:`     | minor       | major        |
| `chore`, `ci`, `docs`, others | none        | none         |

- A release of a shared package bumps every app that depends on it with a
  patch. When the change is a feature of the app, the pull request touches the
  app too, and its `feat` title bumps the app with a minor.
- 👀 To force a version, like `1.0.0`, add a `Release-As: 1.0.0` footer to the
  squash commit. It only applies to the workspaces the commit touches, and only
  to a commit that releases (`feat`, `fix`, `perf`, `revert` or breaking).

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
  app's `components/ui/`; Base UI first, native elements otherwise; one folder
  per `@osmoz/ui` component.
- The Osmoz mark in `@osmoz/brand`, colored by the app's `--osmoz-o` and
  `--osmoz-cloud`; no router in `@osmoz/ui`.
- Components of `@osmoz/ui` and `@osmoz/brand` write no user-facing text: the
  app passes it as props, without defaults.
- Every `@osmoz/ui` component has its stories and doc page, and every app that
  styles it has its stories; a story's `play` checks behavior, never a class.
- A component joins `@osmoz/ui` only if it matches a Base UI component or
  enforces an accessibility guarantee; its Osmoz page follows the outline.
- Only the first story is interactive; the state stories of `@osmoz/ui` stay
  out of the sidebar.
- One concern per file, named after its main export, no category suffix.
- No re-export file: import from the defining file.
- In an app, `./` within a folder and `@/` across folders, never `../`.
- Every `.ts` file has its `.test.ts`; every bug fix has a failing test first.
- No test deleted, skipped or weakened to go green.
- No `memo`, `useMemo`, `useCallback` without a measurement.
- No `useEffect` to derive state, no mutation of shared state, no `delete`.
- Semantic colors only, Tailwind scales for sizes, no arbitrary value, no
  `dark:` variant.
- WCAG 2.2 AA: contrast, visible focus, opt-in motion, 24px targets, semantic
  HTML, labels and `alt`, keyboard access.
- No noise comments.
- Docs hold rules, never cases: no list of components, no ticket progress, no
  copy of the source.
- English commit subjects and PR titles, French PR descriptions and tickets.
