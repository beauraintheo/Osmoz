---
name: document-component
description: Documents a component of @osmoz/ui in the Storybook — its behavior stories with interaction tests, the styled stories of every app that wraps it, and its doc page built on the Storybook's blocks, after Base UI's outline (default demo with its code, anatomy, usage, examples with their code, keyboard, accessibility, API with props, attributes and styling). Reads the code, gets the plan approved, drafts the files, runs the checks. Does not commit. Triggers: "document a component", "write the stories", "documente le composant", "fais les stories", /document-component.
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
3. Each of those apps must be in `.storybook/main.ts` (its `stories`) and `.storybook/preview.tsx` (`STORY_SURFACES`), with its store in `.storybook/theme/theme-stores.ts` and its look in `.storybook/theme/theme-surface.tsx`. If one is missing, stop and say so: one Storybook holds one app today, because it resolves the `@/` alias with that app's Vite config and two apps' themes define the same `[data-theme]` names, and that choice is the user's.

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
- Anatomie : <its parts and how they nest, or "aucune, une seule partie">
- Usage : <one line per situation> → <this component, or the one to use instead>
- Exemples : <one line per story but Default> → <the behavior it shows>
- Clavier : <keys and effects, or "aucun, jamais focusable">
- Attributs : <the stories the API's Attributes block reads>
- Habillage : <what each wrapper adds, and the traps of styling from the attributes>

Questions : <what the code does not settle, or —>
```

End with: "Je rédige ? (ou indique les modifications)". Write nothing without explicit approval.

## 4. Draft

**Behavior stories**, `packages/ui/src/<component>/<component>.stories.tsx`:

- One story per state the component exposes, named after the state (`Disabled`, `Pending`), and `Default` first.
- `title` is the component's group, then its name in PascalCase (`"Actions/IconButton"`): `.storybook/main.ts` prefixes it with `Osmoz`, and each app's stories with the app's name. The same `title` in every app's file. The groups are the ones listed in `storySort` of `.storybook/preview.tsx`; a component that fits none of them is a question for the user, and a new group goes there too.
- Texts go through `args`, never as JSX text: the linter rejects it. Use short English placeholders (`"Save"`).
- Every story has a `play` test that checks behavior only: the role, the accessible name, ARIA and `data-*` attributes, focus with `userEvent.tab()`, keys, clicks that run or are blocked. Never a class, never a style.
- Every story shows something in the doc page: an icon passed as a prop draws a real path, never an empty `<svg>`. An element that renders empty or flat without a layout, like a separator, gets a decorator marked `data-story-layout` that gives it one, with inline styles: `Attributes` reads past it.
- Callbacks are `fn()` in the meta's `args`, and a blocked action asserts `not.toHaveBeenCalled()`.
- The first story is named `Default` and shows the default props, in every app's file too.
- Only the first story is interactive: `.storybook/preview.tsx` disables actions and controls for every story, and the first story sets `parameters: { actions: { disable: false }, controls: { disable: false } }`. This holds in every app's file too.
- Every story but the first gets `tags: ["!dev"]`, so it stays out of the sidebar. It still runs its `play` test and shows on the doc page as an example. Never in an app's file.
- A story whose generated name misreads its export, like an acronym (`WithSvgProps`), gets a `name` in sentence case (`"With SVG props"`): the API's `Attributes` block shows it.
- The code shown under each story is generated from its `args`. Event handlers are hidden from it (`.storybook/docs/snippet-props.ts`); any other arg shows, so a story sets only what its example is about.
- The stories render with the Storybook's neutral demo style, `.storybook/docs/demo/demo.css`, which reads the component's attributes. A component whose states it does not draw yet gets its rules there, from its `data-*` and ARIA attributes, never a class.
- A prop that picks one value among several, like `variant`, `size` or `type`, gets `control: "select"`, never a radio, with `options` when Storybook does not infer them. Its default value goes in `table.defaultValue`, never in `args`: an arg shows in the code under each story, and that code shows only what the example sets. This holds in every app's file too.
- Every prop of the API table gets a `description` in the meta's `argTypes`: when to use it, what it changes, what it requires, never its type in words. A prop the table misses, often an inherited native one like `disabled`, gets its entry with a `control` and `table.type.summary`. A prop that only lays out the story, like `style`, gets `table: { disable: true }`.

**Styled stories**, one file per app, `apps/<app>/src/components/ui/<component>.stories.tsx`:

- The meta sets `parameters: { app: "<app>", layout: "fullscreen", tokens: { … } }` and `tags: ["autodocs"]`: `tokens` names each contract role the wrapper uses, its role in the app as value. The doc page is generated from the stories, never written in MDX.
- `Default` first, then one story per other variant, size and board state. Props holding an element, like `icon`, get `argTypes: { <prop>: { control: false } }`.
- A story that shows a state, like `Disabled` or `Pending`, gets `tags: ["state"]`: it becomes a column of the page's matrix. One story that shows the component in use, like a toolbar, gets `tags: ["usage"]`.
- `argTypes` describe what the wrapper adds (`variant`, `size`, a prop whose look it changes). A prop it only passes on points to the component's Osmoz page, `"See Osmoz/<Component>."`, so a description is written once.
- A `play` test only for what the wrapper adds over `@osmoz/ui`. The behavior is already tested in the UI stories.

**Doc page**, `packages/ui/src/<component>/<component>.mdx`, in English. The blocks come from `.storybook/docs/blocks/` and are registered in `.storybook/preview.tsx`: never import them. No Markdown table. The sections, in this order:

1. **Title and why it exists**, then `<Canvas of={Stories.Default} />`.
2. **Anatomy**, only for a component made of several parts: a fenced `tsx` block with its import from `@osmoz/ui/<component>` and how its parts nest, each part on its own line, no prop. A component of a single part has no section.
3. **Usage**: a `<Guidelines>` block, one `<Guideline when="…">` per situation, its reason as a short child sentence. The situations that call for this component come first, without `use`. Each situation that calls for another one names it with `use={OtherStories}`, its stories imported, which links to its page.
4. **Examples**: one `###` heading per story but `Default`, in the stories' order, named after the behavior. Under it, one or two sentences on the props that set it and its behavior (focus, click, announcement), then `<Canvas of={Stories.<Story>} />`. What holds beyond the example follows its canvas, as prose.
5. **Keyboard**: a `<Keyboard>` block, one `<Key keys={["Tab"]}>` per key, its effect as children, `"Shift+Tab"` for a combination. A component that is never focusable gets no block, only "None: the <component> is never focusable."
6. **Accessibility**: a list.
7. **API**, in three `###` parts:
   - **Props**: the props it extends, Base UI's component or the native element, minus and plus, then `Controls`.
   - **Attributes**: one sentence saying an app styles each state from them, then `<Attributes stories={[…]} />`, listing every story that shows a state: the block reads the `role`, `aria-*` and `data-*` attributes on each rendered element and links each value to its example. A component that sets none says so in one sentence instead.
   - **Styling**: what each app's wrapper adds (its file, the variants it picks, the classes a state needs) and the traps of styling from these attributes. No token: each app's page lists the roles it maps to, with their values in its theme. Where the color comes from when no class sets it, usually `currentColor`, in one sentence.

Every claim in the doc is backed by the code or by a `play` test. If a claim cannot be checked, it goes to the questions instead.

Never change the component to make a story pass. If a story shows a bug, stop and report it: the story is the failing test the fix starts from.

## 5. Verify

1. `pnpm check:fix`.
2. `pnpm test:stories`: every story passes, and the component's `.tsx` files reach 100% coverage. An uncovered branch is a missing story, never a lowered threshold.
3. `pnpm --filter @osmoz/ui test`: `component-docs.test.ts` finds the stories and the doc.
4. `pnpm exec storybook build -o <scratchpad>/storybook-static`: the doc page compiles.
5. `pnpm validate`. Report its actual output. If it fails, say what fails.

Then list what the user should review: the guidelines that send to another component, and any state the boards and the code disagree on. Stop. Do not commit.
