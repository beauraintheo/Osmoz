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

👀 **Native elements first.** An `@osmoz/ui` component builds on the native
element (`<button>`, `<dialog>`). A headless library comes in only where no
native element fits, chosen with the first component that needs it.

👀 **One folder per `@osmoz/ui` component**, named after it, holding the
component and, when it has logic beyond wiring, that logic and its tests
(`button/button.tsx`, `button/button-behavior.ts`).
The `"./*": "./src/*/*.tsx"` export keeps the import short: `@osmoz/ui/link`.

👀 **Routing stays out of `@osmoz/ui`.** Its `Link` is a plain anchor. It
opens a new tab only through its `newTab` prop, which then requires a
`newTabHint` to announce it. Each app
styles it, gives the hint its own text, then turns it into a router link with
TanStack Router's `createLink`, so `to` stays typed against its routes.

👀 **The Osmoz mark lives in `@osmoz/brand`, from the start.** It ships there
as components that look the same in every app: the symbol and the signature.
They take their colors from the app's theme (`--osmoz-o`, `--osmoz-cloud` and
the contract tokens), and their classes use only those tokens and Tailwind's
default scales, never a token or role of one app. `@osmoz/brand/brand.css`
declares their `@source`: an app that uses the mark imports it in its
`theme.css`, right after `@osmoz/theme/base.css`, so its Tailwind generates
them. It is not
part of `@osmoz/ui`, and the second-app rule does not apply to it: the mark is
shared by nature ([brand.md](brand.md)). The mark's source files stay in
`docs/brand/`, and a file enters the package only when code imports it. An
image used by one app stays in that app.

👀 **Every `@osmoz/ui` component is documented in the Storybook**, from its
first use. 🔒 Its folder holds `<component>.stories.tsx` and
`<component>.mdx`, or `component-docs.test.ts` fails. Each app that styles it
adds `<component>.stories.tsx` next to its `components/ui/<component>.tsx`.
`/document-component` drafts all three.

The Storybook lives at the root, in `.storybook/`. It shows three sections:
Osmoz's own pages, `UI` for the contract of each `@osmoz/ui` component,
unstyled, and one section per app for its look, titled by
`.storybook/main.ts`. An app's stories set
`parameters: { app: "<app>", layout: "fullscreen" }`: `.storybook/preview.tsx`
then loads that app's `theme.css` with them, and only with them, and paints
the app's background over the whole canvas. The doc pages wear the Osmoz theme of `@osmoz/brand`. Blocks
shared by the doc pages live in `.storybook/blocks/`, one folder per block
with its logic and tests, take their texts as props or children, and use only
the contract tokens. `.storybook/preview.tsx` registers them, so a `.mdx`
uses them without import:

| Block                              | Shows                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Guidelines`, `Guideline when="…"` | Each situation and the component it calls for: this one, or `use={OtherStories}` linked to its page; `preview` renders a story |
| `States`, `State of={…}`           | Each state story, with the attributes read on its rendered element                                                             |
| `Keyboard`, `Key keys={…}`         | Each key and its effect; `"Shift+Tab"` is a combination                                                                        |
| `Tokens`, `Token name="…"`         | Each token and its role, with its value read in the doc page's Osmoz theme, not an app's                                       |

A story that needs a layout to show, like a vertical `<hr>` in a row, wraps
itself in a decorator marked `data-story-layout`: `States` reads the
attributes of the element inside it.

A block's root has the `sb-unstyled` class, so Storybook's own doc styles
stay out of it.

> [!WARNING]
> One Storybook holds one app today. It resolves the `@/` alias and builds
> with that app's Vite config, and two apps' themes define the same
> `[data-theme]` names. A second app means one Storybook per app, composed
> into the root one through Storybook's `refs`.

👀 **A shared component gets its text from the app.** A component of
`@osmoz/ui` or `@osmoz/brand` writes no user-facing text: it takes it as a
prop, with no default, so each app passes its own wording and language.

👀 **The visitor's preferences live in `@osmoz/preferences`**: one folder per
preference, `theme/` and `i18n/`, each with its zustand store, and `persist/`
for what they share: the storage that never throws, the persisted field and
the sync with other tabs. A new preference gets its folder there and builds
on `persist/`, never on its own storage code. `@osmoz/theme` holds only the
design contract, `base.css`.

A package exposes `src/` through `exports` patterns in its `package.json`, one
per kind of file, never a list of files: `"./*": "./src/*.ts"` for code,
`"./*": "./src/*.tsx"` for components, `"./*": "./src/*/*.tsx"` for
components in their own folder (`@osmoz/ui`, whose `.ts` logic stays
internal), `"./*": "./src/*"` for assets, `"./*.json": "./src/*.json"` or
`"./*.css": "./src/*.css"` next to code for JSON configs or stylesheets. A consumer imports the file it needs: `@osmoz/<package>/<file>`.
The `*` of a pattern spans folders too: `"./*": "./src/*.ts"` serves
`@osmoz/preferences/theme/create-theme-store` from
`src/theme/create-theme-store.ts`.

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

🔒 **Type-only imports use `import type`.** 🔒 **No circular dependency.**

## Ordering

🔒 **Keys and members are sorted alphabetically**: object keys, interface and
object type members, enum members and JSX props. `pnpm check:fix` sorts
them for you (eslint-plugin-perfectionist, run by oxlint).

- A blank line starts a new group: each group is sorted on its own, and the
  groups keep their order. Use it for a real grouping, like the lint rules of
  `vite.config.ts` by theme, not to escape the rule.
- A spread stays where it is: keys are sorted on each side of it.
- Arrays are never sorted, so an order that matters goes in an array, like
  the `locales` of `createLocaleStore`.
- Union members are not sorted: write them in their natural order
  (`"sm" | "md" | "lg"`, `string | null`).

🔒 **Lines stop at 100 characters**, enforced by the formatter (`printWidth`).
It never splits a string: a long list of classes may go past it.

🔒 **An object literal with 3 keys or more spans one line per key**, enforced
by `@stylistic/object-curly-newline` (run by oxlint); `pnpm check:fix` breaks
it for you. Below 3 keys, an object stays on one line unless it is already
broken: the formatter keeps an object multi-line when a line break follows its
opening brace.

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

## Texts and languages

Every text an app shows comes from its message catalog, so a language can be
added without touching a component. The `i18n/` folder of
`@osmoz/preferences` holds the mechanism, each app holds its catalogs in
`src/i18n/`.

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

- **The source catalog** is the app's default language: `src/i18n/<locale>.ts`
  exports a plain object named after its locale, nested by screen or feature.
  A message is a string, or a function when it takes parameters:
  `itemCount: (count: number): string => …`. Plurals use `Intl.PluralRules`
  inside that function.
- **Another language** is one file, `src/i18n/<locale>.ts`, typed
  `satisfies typeof <source>`, added to the `catalogs` of
  `src/i18n/use-locale-store.ts` and to its `locales`, which set the order
  the languages are offered in. Each catalog has a test:
  `emptyMessages(<catalog>)` is `[]`, so no message is left empty. It checks
  only string messages: 👀 a message that is a function is checked on review.
- **The language is a zustand store.** `createLocaleStore` starts on the
  visitor's stored choice, kept under `<app>:locale` by zustand's `persist`,
  else on the fallback: the browser's language is not followed. A blocked
  storage never throws. The store sets `<html lang>`, follows a choice made in
  another tab, and `setLocale` switches every text at once, without a reload.
  `index.html` declares the fallback for the first paint.
- **`createLocaleStore` returns a zustand hook**, which the app exports as
  `useLocaleStore`. Components read their texts with the app's `useMessages`
  hook, never from a catalog: `const messages = useMessages()`. It lives in
  `src/i18n/use-messages.ts`, one line over the store, written in each app
  rather than shared. A language switcher reads `locales` and `locale` from
  `useLocaleStore`, and calls `setLocale`.
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
- 👀 **Theme logic comes from the `theme/` folder of `@osmoz/preferences`**,
  never rewritten in an app. The
  app declares its themes with `defineThemeOptions`, injects
  `firstPaintScript` through `headScripts` in `vite.config.ts`, creates its
  store with `createThemeStore`, which returns a zustand hook, and reads it
  with a selector. The choice is kept under `<app>:theme` by zustand's
  `persist`; the first-paint script reads that same entry before any
  JavaScript of the app. Each app builds its own switcher on top.
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
Exceptions: `*.test.ts`, `*.d.ts`, `*.config.ts`, `.storybook/main.ts`
(Storybook's config) and generated code (`*.gen.ts`).

👀 **`.tsx` files get no unit test.** They render: logic worth testing moves to
a `.ts` file next to them.

🔒 **Components are tested by their stories.** Each story of
`*.stories.tsx` is a test: its `play` function checks the behavior, never a
class. `pnpm test:stories` runs them in Chromium and holds the `.tsx` of
`@osmoz/ui` and of every `components/ui/` at 100% coverage, without the React
Compiler, which adds branches no render can take. An uncovered branch is a
missing story. The same run holds the `.ts` files of `.storybook/` at 100%,
with their `.test.ts` next to them, in Chromium too. Other `.tsx` files will be covered by end-to-end tests.

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
shared packages `brand`, `config`, `preferences`, `theme` and `ui` are versioned the same way; the root and
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

- A release of `brand`, `config`, `preferences`, `theme` or `ui` bumps every app that depends on it with a
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
  app's `components/ui/`; native elements before a headless library; one folder
  per `@osmoz/ui` component.
- The Osmoz mark in `@osmoz/brand`, colored by the app's `--osmoz-o` and
  `--osmoz-cloud`; no router in `@osmoz/ui`.
- Components of `@osmoz/ui` and `@osmoz/brand` write no user-facing text: the
  app passes it as props, without defaults.
- Every `@osmoz/ui` component has its stories and doc page, and every app that
  styles it has its stories; a story's `play` checks behavior, never a class.
- One concern per file, named after its main export, no category suffix.
- No re-export file: import from the defining file.
- Every `.ts` file has its `.test.ts`; every bug fix has a failing test first.
- No test deleted, skipped or weakened to go green.
- No `memo`, `useMemo`, `useCallback` without a measurement.
- No `useEffect` to derive state, no mutation of shared state, no `delete`.
- Semantic colors only, Tailwind scales for sizes, no arbitrary value, no
  `dark:` variant.
- WCAG 2.2 AA: contrast, visible focus, opt-in motion, 24px targets, semantic
  HTML, labels and `alt`, keyboard access.
- No noise comments.
- English commit subjects and PR titles, French PR descriptions and tickets.
