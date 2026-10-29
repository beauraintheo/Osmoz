---
name: document-component
description: Documents a component of @osmoz/ui in the Storybook — its behavior stories with interaction tests, the styled stories of every app that wraps it, and its doc page (why it exists, when to use it, when not, states, keyboard, accessibility). Reads the code, gets the plan approved, drafts the files, runs the checks. Does not commit. Triggers: "document a component", "write the stories", "documente le composant", "fais les stories", /document-component.
argument-hint: "<component>"
---

# Document a component

Input: `$ARGUMENTS`, the folder name of a component in `packages/ui/src/`, like `icon-button`. If it is missing, list the folders of `packages/ui/src/` that lack a `.mdx` and ask which one, in a single question, then stop.

Read first, and follow strictly: the "Architecture", "Texts and languages", "Accessibility" and "Tests" sections of `docs/conventions.md`, and "Create a component" in `docs/getting-started.md`. This skill only describes the process.

The reference is what already exists: `packages/ui/src/button/button.stories.tsx`, `packages/ui/src/button/button.mdx`, `apps/flex-playground/src/components/ui/button.stories.tsx`, and `.storybook/`. Match their shape, naming and density. Never write a comment in a story.

## 1. Check the ground

Never run a git command that changes state.

1. `packages/ui/src/<component>/<component>.tsx` must exist. If not, stop and say so.
2. Find every app that wraps it: `apps/*/src/components/ui/<component>.tsx`.
3. Each of those apps must be in `.storybook/main.ts` (its `stories`) and `.storybook/preview.tsx` (`APP_STYLES`). If one is missing, stop and say so: adding a second app raises the theme and `@/` alias collision documented in `docs/conventions.md`, and that choice is the user's.

## 2. Read what the component does

The doc describes the code, never what this skill imagines.

1. The component, its logic `.ts` and that logic's tests: every prop, every state, every `data-*` and ARIA attribute it sets, every event it blocks.
2. Each app's wrapper: its `variant`, `size` and other props, and what it adds (an icon, a spinner, a text).
3. Where each app uses it (`grep` the wrapper's import in `apps/*/src`): real usages say when to use it.
4. The other components of `packages/ui/src/`: they say when *not* to use this one.
5. The app's `CLAUDE.md`, for the boards that show its states. If a board shows a state the code lacks, or the reverse, flag it.

## 3. Get the plan approved

Show, then wait:

```
Composant : @osmoz/ui/<component>

Stories UI (comportement) :
- <Story> : <props> → <what its play test checks>

Stories <app> (habillage) :
- <Story> : <props> → <play test, or — when it only shows a look>

Doc :
- Pourquoi : <one sentence>
- Quand l'utiliser : <points>
- Quand ne pas l'utiliser : <points, each naming the component to use instead>

Questions : <what the code does not settle, or —>
```

End with: "Je rédige ? (ou indique les modifications)". Write nothing without explicit approval.

## 4. Draft

**Behavior stories**, `packages/ui/src/<component>/<component>.stories.tsx`:

- One story per state the component exposes, named after the state (`Disabled`, `Pending`), and `Default` first.
- `title` is the component's name in PascalCase (`"IconButton"`): `.storybook/main.ts` prefixes it with `UI`, and each app's stories with the app's name. The same `title` in every app's file.
- Texts go through `args`, never as JSX text: the linter rejects it. Use short English placeholders (`"Save"`).
- Every story has a `play` test that checks behavior only: the role, the accessible name, ARIA and `data-*` attributes, focus with `userEvent.tab()`, keys, clicks that run or are blocked. Never a class, never a style.
- Callbacks are `fn()` in the meta's `args`, and a blocked action asserts `not.toHaveBeenCalled()`.

**Styled stories**, one file per app, `apps/<app>/src/components/ui/<component>.stories.tsx`:

- The meta sets `parameters: { app: "<app>" }` and `tags: ["autodocs"]`.
- One story per variant, size and board state. Props holding an element, like `icon`, get `argTypes: { <prop>: { control: false } }`.
- A `play` test only for what the wrapper adds over `@osmoz/ui`. The behavior is already tested in the UI stories.

**Doc page**, `packages/ui/src/<component>/<component>.mdx`, in English, with these sections in this order: the title and why it exists, followed by the `Default` canvas; "Usage", a `<Guidelines>` block with one `<Guideline when="…">` per situation, its reason as children: without `use` it calls for this component, with `use={OtherStories}` (the other component's stories, imported) it links to that component's page, and `preview={Stories.Default}` renders the component it calls for (the blocks come from `.storybook/blocks/`, registered in `.storybook/preview.tsx`: no import); "States", as a table of props → DOM → focusable → effect, followed by a canvas per state; "Keyboard"; "Accessibility"; "API", with `Controls`; "Styling", saying which classes each app needs for each state.

Every claim in the doc is backed by the code or by a `play` test. If a claim cannot be checked, it goes to the questions instead.

Never change the component to make a story pass. If a story shows a bug, stop and report it: the story is the failing test the fix starts from.

## 5. Verify

1. `pnpm check:fix`.
2. `pnpm test:stories`: every story passes, and the component's `.tsx` files reach 100% coverage. An uncovered branch is a missing story, never a lowered threshold.
3. `pnpm --filter @osmoz/ui test`: `component-docs.test.ts` finds the stories and the doc.
4. `pnpm exec storybook build -o <scratchpad>/storybook-static`: the doc page compiles.
5. `pnpm validate`. Report its actual output. If it fails, say what fails.

Then list what the user should review: the "Use something else" points, and any state the boards and the code disagree on. Stop. Do not commit.
