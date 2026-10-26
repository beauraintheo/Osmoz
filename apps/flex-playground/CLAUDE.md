# Flux

Flux (`flex-playground`) is an interactive Flexbox reference. What it does
and why is in [spec.md](spec.md).

## Stack

- Fontsource (Geist, Geist Mono): bundles the fonts with the app, no
  third-party request.
- Zod (planned): validates the layout state at its boundaries (browser
  storage, and URLs from the Docs milestone). Added to the catalog by the first ticket that
  needs it.
- `@osmoz/brand`: the Osmoz mark, for the signature; its O takes Flux's
  accent through `--osmoz-o` (docs/brand.md). `theme.css` imports
  `@osmoz/brand/brand.css` so Tailwind generates its classes.
- zustand: the app's state library. `@osmoz/preferences` builds the theme
  and language stores with it; the layout state and its history will use it
  too.
- `@osmoz/ui`: interface components without style; Flux styles each one it
  uses in `components/`.
- shadcn/ui (planned): starting point for components, split between
  `@osmoz/ui` and `components/` (conventions.md). `components.json` is set up
  with the first one.

## Structure

```
src/
  routes/       TanStack Router file routes; thin, they only compose features
  features/     one folder per mode, its UI and logic: playground/, docs/,
                exercises/
  domain/       Flexbox knowledge shared by every mode: property descriptions,
                layout state, CSS and HTML generation; plain TypeScript
  components/   shared UI with no domain knowledge: Flux's styled versions of
                @osmoz/ui components, and its own generic components
  lib/          pure utilities with no domain knowledge, cn.ts included
  theme/        the app's theme: theme.css, its font faces (fonts.css),
                its themes (theme-options.ts) and the theme store
                (use-theme-store.ts), from @osmoz/preferences
  i18n/         the message catalogs (fr.ts, en.ts) and the language
                store (use-locale-store.ts), from @osmoz/preferences
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
- `components` may import `lib`, `@osmoz/ui` and `@osmoz/brand`, never
  `features`, `domain` nor `routes`.
- `routes` and `features` use the styled components of `components/`, never
  `@osmoz/ui` directly.
- `lib` imports nothing from the app.
- `theme` imports nothing from the app. `routes`, `features` and
  `components` may import `theme/use-theme-store` to read or change the theme.
- `i18n` imports nothing from the app. `routes`, `features` and `components`
  may import `i18n/use-locale-store` to read the texts or change the language,
  never a catalog.

## Where a file goes

| Kind of file                 | Folder                | Example                   |
| ---------------------------- | --------------------- | ------------------------- |
| Page                         | `routes/`             | `home.tsx`                |
| Mode component               | `features/<feature>/` | `flex-container-view.tsx` |
| Mode logic or state          | `features/<feature>/` | `use-history.ts`          |
| Property descriptions        | `domain/`             | `container-properties.ts` |
| Layout state and its schema  | `domain/`             | `layout-state.ts`         |
| Code generation              | `domain/`             | `to-css.ts`               |
| Styled `@osmoz/ui` component | `components/`         | `button.tsx`              |
| Other shared UI component    | `components/`         | `header.tsx`              |
| Pure utility                 | `lib/`                | `cn.ts`                   |
| Message catalog              | `i18n/`               | `fr.ts`                   |

Properties are described in lists, one file per target (container, item). A
property gets a file of its own only when it has logic of its own
(`parse-flex-basis.ts`). Explanation texts are i18n messages, not domain
data.

## Theme

- File: `src/theme/theme.css`
- Themes: `light`, `dark`, from board F-01 of the OSM-13 canvas, declared in
  `src/theme/theme-options.ts` and stored under `flux:theme`. `vite.config.ts`
  injects the first-paint script of `@osmoz/preferences`;
  `src/theme/use-theme-store.ts` creates the app's single theme store, a
  zustand hook imported by `main.tsx` before rendering. Without JavaScript,
  `light` applies. No theme switcher yet.
- Aliases shared by both themes: `card-foreground`, `popover-foreground` and
  `secondary-foreground` are `foreground`, `popover` is `card`, `secondary`
  is `muted`, `ring` and `osmoz-o` are `primary`. `osmoz-cloud` takes the
  Osmoz cloud color of each theme (docs/brand.md).
- Roles beyond the contract: `item`, `item-foreground`, `item-border`,
  `axis-cross`, `code-keyword`, `code-value`.
- Typography roles, from the OSM-13 canvas: `title` (app and dialog titles,
  with `font-mono`), `body` (running text), `control` (buttons, fields,
  property names), `label` (field and group labels, with `font-mono`),
  `overline` (section titles, with `uppercase`), `code` (generated code),
  `canvas` (item text), `tile` (value tile labels). Their sizes are in
  `theme.css` and on boards C-01 and C-02.
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

## Languages

- Catalogs: `fr`, the source and the fallback, and `en`, in `src/i18n/`.
  `src/i18n/use-locale-store.ts` creates the app's single language store, a
  zustand hook imported by `main.tsx` before rendering. Until the visitor
  picks a language, Flux is in French, whatever the browser's language; the
  choice is stored under `flux:locale`. `index.html` declares `lang="fr"`.
- Switcher (proposed, OSM-13 canvas): a language menu in the desktop header
  (D-06), a select in Help › Settings on mobile (M-05). Each language is named
  in itself. Not built yet.

## Commands

None beyond the root commands.
