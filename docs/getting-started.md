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

| Command                | What it does                                                            |
| ---------------------- | ----------------------------------------------------------------------- |
| `pnpm dev [app]`       | Run every workspace in dev mode, or only `<app>`                        |
| `pnpm validate [app]`  | `check`, then types and tests at 100% coverage, stories included        |
| `pnpm build [app]`     | `validate` without the stories, then build. Stops if validation fails   |
| `pnpm check`           | Format and lint (oxfmt + type-aware oxlint), without writing            |
| `pnpm check:fix`       | Same, with fixes: formatting, import and class order, autofixable rules |
| `pnpm check-types`     | TypeScript, in every workspace and in `.storybook/`                     |
| `pnpm test`            | Unit tests of every workspace, once                                     |
| `pnpm test:coverage`   | Same, with the 100% coverage threshold                                  |
| `pnpm test:stories`    | Every story's interaction test in Chromium, `.tsx` coverage at 100%     |
| `pnpm storybook`       | The components' Storybook, on http://127.0.0.1:6006                     |
| `pnpm storybook:build` | The Storybook's static build, in `storybook-static/`                    |

`[app]` is a folder name of `apps/`. An unknown name fails and lists the apps.

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

`/new-app` in Claude Code creates it from an existing app. By hand, copy an
existing app and keep its config files: they are a few lines each, because
`@osmoz/config` holds the shared base (TypeScript, Vite, React with the React
Compiler, Tailwind, TanStack Router with file-based routing, Vitest).

What every app follows:

- **Versions** come from the pnpm catalog (`pnpm-workspace.yaml`), never
  written in the app: `"catalog:"` for a library, `"workspace:*"` for a
  shared package.
- **Theme**: `src/theme/theme.css`, always at that path, since the root
  `vite.config.ts` finds it there to sort the app's Tailwind classes. It
  imports `tailwindcss`, then `@osmoz/theme/base.css`, then
  `@osmoz/brand/brand.css`, and each of its themes sets `--osmoz-o` and
  `--osmoz-cloud` ([brand.md](brand.md)). Its themes are declared with
  `defineThemeOptions` and read through the app's single store, built with
  `createThemeStore`, both from `@osmoz/preferences`.
- **Texts**: one catalog per language in `src/i18n/`, a single language store
  built with `createLocaleStore`, and a `useMessages` hook components read
  their texts with ([conventions.md](conventions.md#texts-and-languages)).
- **Stores first**: `src/main.tsx` imports the theme and language stores
  before rendering.
- **Routes**: the router plugin generates `src/route-tree.gen.ts`, ignored by
  lint, format and coverage. A folder's index route is `home.tsx`, not
  `index.tsx`, since the linter forbids named exports from an `index` file.
- **Components**: the app wraps each `@osmoz/ui` component it uses in its own
  `components/ui/`, with its `cn` helper in `src/lib/cn.ts`
  ([conventions.md](conventions.md#architecture)).
- `@/` points to the app's `src/`.

What the app adds to the base, and why, goes in its `CLAUDE.md`
([app-spec.md](app-spec.md)).

## 4. Create a component

An interface component lives in two places: its behavior in `@osmoz/ui`,
shared, and its look in the app ([conventions.md](conventions.md#architecture)).

1. **Design it.** On the app's mockups, in the screen that uses it, then on the
   components boards with every state, in every theme. Tokens and typography
   roles only.
2. **Write its behavior** in `packages/ui/src/<component>/<component>.tsx`:
   it wraps the matching Base UI component, or the native element where Base
   UI has none, and never sets a class name. Its states are `data-*` and ARIA
   attributes. Logic beyond wiring goes to a `.ts` file next to it, with its
   `.test.ts`. Its texts come from the app, as props.
3. **Style it** in `apps/<app>/src/components/ui/<component>.tsx`: wrap the
   `@osmoz/ui` component and give it the app's classes with `cn`. Every state
   of the boards has its class. List its edge cases before you style it, like
   a label too long for its parent or a state that must not move the layout:
   each becomes a story tagged `edge-case`, whose `play` test proves the look
   holds ([conventions.md](conventions.md#architecture)).
4. **Document it.** `/document-component <component>` in Claude Code drafts
   its stories and doc page, following an existing component. Its Osmoz page
   follows one outline, after Base UI's:
   - **Title and description**, then the `Default` story with its code.
   - **Anatomy**, only for a component made of several parts: its import and
     how its parts nest, in a `tsx` code block.
   - **Usage**: when to use it, and which component to use instead.
   - **Examples**: one per behavior, each a heading, a sentence and its story
     with its code. Each story has its `play` test.
   - **Edge cases**: the same shape, one per edge case of the behavior, like
     a prop that overrides another or an empty text. Its story is tagged
     `edge-case` and its `play` test proves the behavior holds.
   - **Keyboard**, **Accessibility**.
   - **API**: its props (`Controls`); the `role`, `aria-*` and `data-*`
     attributes it sets, read from its stories (`Attributes`), which each app
     styles its states from; then what each app's wrapper adds, and the traps
     of styling from those attributes. The contract roles an app maps it to
     stay on that app's page.

   The stories render with a neutral demo style, owned by the Storybook
   (`.storybook/docs/demo/`): it reads the component's attributes, so each
   state is visible while the code stays the API, without a class.

5. **Use it.** Routes, features and the app's own components import the
   styled component from `components/ui/`, never `@osmoz/ui` directly.
6. **Check it.** The rendered states match the boards, every action works with
   the keyboard, and `pnpm validate` passes. A state found along the way goes
   back to the boards.

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
   the branch. The merge publishes the Storybook.

Every pull request runs `pnpm validate`, then `pnpm storybook:build`, in
GitHub Actions. The `main` ruleset requires its `validate` check on a branch up
to date with `main`: a red check, or a branch behind `main`, blocks the merge.

Every merge into `main` publishes the Storybook on GitHub Pages, at
[beauraintheo.github.io/Osmoz](https://beauraintheo.github.io/Osmoz/). A pull
request publishes nothing.

> [!IMPORTANT]
> Never disable a rule, skip a test, lower a threshold or use `--no-verify` to
> make a check green: fix the code, or say what fails in the PR.

## 6. What surprises people

- **`pnpm check` proves little.** It formats and lints, but runs no typecheck and
  no tests. Only `pnpm validate` tells you the work is done.
- **`pnpm check:fix` reorders your imports, your Tailwind classes, and your
  keys and props** ([conventions.md](conventions.md#ordering)).
  That is expected; a blank line keeps a group apart. In VS Code, saving a file
  does the same: install the recommended Oxc extension.
- **Stories run in a real Chromium.** The first time, run
  `pnpm exec playwright install chromium-headless-shell`.
- **A new Claude Code skill of the project is ignored by git** until it is
  listed in `.gitignore`. Every folder of `.claude/skills/` is ignored, so the
  skills a developer installs for themself stay out of the repo; the project's
  own skills are the exceptions listed after it, `!.claude/skills/<skill>/`.
  Add yours there, then check that `git status` shows it.

## 7. Next

Read [conventions.md](conventions.md). What to work on lives in Linear.
