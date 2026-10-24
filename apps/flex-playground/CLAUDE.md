# Flux

Flux (`flex-playground`) is an interactive Flexbox reference. What it does
and why is in [spec.md](spec.md).

## Stack

- Fontsource (Geist, Geist Mono): bundles the fonts with the app, no
  third-party request.
- Zod (planned): validates the layout state at its boundaries (browser
  storage, and URLs from the Docs milestone). Added to the catalog by the first ticket that
  needs it.
- shadcn/ui (planned): set up with its first component (`components.json`,
  `lib/cn.ts`), not before.

## Structure

```
src/
  routes/       TanStack Router file routes; thin, they only compose features
  features/     one folder per mode, its UI and logic: playground/, docs/,
                exercises/
  domain/       Flexbox knowledge shared by every mode: property descriptions,
                layout state, CSS and HTML generation; plain TypeScript
  components/   shared UI with no domain knowledge
  lib/          pure utilities with no domain knowledge
  theme/        the app's theme: theme.css, its font faces (fonts.css),
                its themes for @osmoz/theme (theme-options.ts) and the
                theme store (theme-store.ts)
public/         static files served as is: favicon.svg and
                apple-touch-icon.png, derived from the Osmoz mark
                (docs/brand.md)
```

`features/`, `domain/`, `components/` and `lib/` are created by their first
file.

## Layers

- `routes` may import `features`, `components` and `lib`.
- `features/<a>` may import `domain`, `components` and `lib`, never `routes`
  nor another feature. Code two features need moves to `domain`,
  `components` or `lib`.
- `domain` may import `lib`, never React nor any other folder of the app.
- `components` may import `lib`, never `features`, `domain` nor `routes`.
- `lib` imports nothing from the app.
- `theme` imports nothing from the app. `routes`, `features` and
  `components` may import `theme/theme-store` to read or change the theme.

## Where a file goes

| Kind of file                | Folder                | Example                   |
| --------------------------- | --------------------- | ------------------------- |
| Page                        | `routes/`             | `home.tsx`                |
| Mode component              | `features/<feature>/` | `flex-container-view.tsx` |
| Mode logic or state         | `features/<feature>/` | `use-history.ts`          |
| Property descriptions       | `domain/`             | `container-properties.ts` |
| Layout state and its schema | `domain/`             | `layout-state.ts`         |
| Code generation             | `domain/`             | `to-css.ts`               |
| Shared UI component         | `components/`         | `button.tsx`              |
| Pure utility                | `lib/`                | `cn.ts`                   |

Properties are described in lists, one file per target (container, item). A
property gets a file of its own only when it has logic of its own
(`parse-flex-basis.ts`). Explanation texts are i18n messages, not domain
data.

## Theme

- File: `src/theme/theme.css`
- Themes: `light`, `dark`, from board F-01 of the OSM-13 canvas, declared in
  `src/theme/theme-options.ts` and stored under `flux:theme`. `vite.config.ts`
  injects the first-paint script of `@osmoz/theme`; `src/theme/theme-store.ts`
  creates the app's single theme store, imported by `main.tsx` before
  rendering and read with `useTheme`. Without JavaScript, `light` applies. No
  theme switcher yet.
- Aliases shared by both themes: `card-foreground`, `popover-foreground` and
  `secondary-foreground` are `foreground`, `popover` is `card`, `secondary`
  is `muted`, `ring` is `primary`.
- Roles beyond the contract: `item`, `item-foreground`, `item-border`,
  `axis-cross`, `code-keyword`, `code-value`.
- Fonts: Geist for the interface, Geist Mono for code, with system fallback
  stacks. Only `--font-sans` and `--font-mono` change in `@theme`.
- Font loading: `fonts.css`, imported by `theme.css`, declares the latin and
  latin-ext faces of both fonts from Fontsource's files, with
  `font-display: optional`: a font is used only if it is ready for the first
  paint, otherwise the system stack stays for the visit, so text never
  reflows. Fontsource's own CSS is not imported, since it forces `swap`; its
  `unicode-range` values are copied and must be checked when Fontsource is
  updated. `index.html` preloads both latin files so they are usually ready;
  Vite rewrites the links to the hashed files the CSS requests.

## Commands

None beyond the root commands.
