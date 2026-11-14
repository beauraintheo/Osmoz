# Flux

Flux (`flex-playground`) is an interactive Flexbox reference. What it does
and why is in [spec.md](spec.md).

## Stack

- Fontsource (Geist, Geist Mono): bundles the fonts with the app, no
  third-party request.
- Zod: validates the layout state at its boundaries (browser storage, and
  URLs from the Docs milestone). Its schema is derived from the property
  descriptions of `domain/`, never written next to them.
- `@osmoz/brand`: the Osmoz mark, for the signature; its O takes Flux's
  accent through `--osmoz-o` (docs/brand.md). `theme.css` imports
  `@osmoz/brand/brand.css` so Tailwind generates its classes.
- zustand: the app's state library. `@osmoz/preferences` builds the theme
  and language stores with it; the layout state and its history will use it
  too.
- `@osmoz/ui`: interface components without style; Flux styles each one it
  uses in `components/ui/`.
- Remix Icon (`@remixicon/react`): the app's icons, line style, always
  passed as components to `components/ui/icon.tsx`, which holds their sizes.
  Free for apps and design systems; its license only forbids selling the
  icons on their own.

## Structure

```
src/
  routes/       TanStack Router file routes; thin, they only compose features
                and components, with no class and no layout element
  features/     one folder per mode, its UI and logic: playground/, docs/,
                exercises/; screens, assembled from components like routes
  domain/       Flexbox knowledge shared by every mode; plain TypeScript
    length/          parsing and normalizing a typed length
    property-kinds/  one helper per kind of property, and what the kinds
                     share; knows nothing of Flexbox
    properties/      the Flexbox properties, built with those kinds: the
                     container and item lists, their MDN links
    layout/          the layout state, its schema and its transitions
  components/   patterns: shared UI with no domain knowledge, built from
                components/ui, holding the classes and the responsive
                layout of the screens; one folder per family, named after
                what its components do, never after a kind of file
    layout/     the regions of the screen: the shell, the top bar, the
                workspace columns
    preferences/ the visitor's settings: language and theme
    ui/         Flux's design system: one styled version per @osmoz/ui
                component, and the layout and text primitives with no
                @osmoz/ui counterpart, each with its stories, and nothing
                that knows the app; typography-classes.ts maps each
                typography role to its classes, font family included;
                introduction.mdx, the Flux section's entry page in the
                Storybook, is the one file that describes Flux
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
- `components` may import `components/ui`, `lib` and `@osmoz/brand`, never
  `features`, `domain` nor `routes`.
- `components/ui` may import `lib`, `@osmoz/ui` and the other files of
  `components/ui`: no store, no catalog, no component outside it. Its texts
  come in as props.
- `routes`, `features` and `components` use the styled components of
  `components/ui/`, never `@osmoz/ui` directly.
- `lib` imports nothing from the app.
- `theme` imports nothing from the app. `routes`, `features` and
  `components` may import `theme/use-theme-store` to read or change the theme.
- `i18n` imports nothing from the app. `routes`, `features` and `components`
  read the texts with `i18n/use-messages` and change the language with
  `i18n/use-locale-store`, never a catalog.

## Where a file goes

| Kind of file                 | Folder                    | Example                   |
| ---------------------------- | ------------------------- | ------------------------- |
| Page                         | `routes/`                 | `home.tsx`                |
| Mode component               | `features/<feature>/`     | `flex-container-view.tsx` |
| Mode logic or state          | `features/<feature>/`     | `use-history.ts`          |
| Length parsing               | `domain/length/`          | `parse-length.ts`         |
| Kind of property             | `domain/property-kinds/`  | `keyword-property.ts`     |
| Property descriptions        | `domain/properties/`      | `container-properties.ts` |
| Layout state and its schema  | `domain/layout/`          | `layout-state.ts`         |
| Code generation              | `domain/`                 | `to-css.ts`               |
| Styled `@osmoz/ui` component | `components/ui/`          | `button.tsx`              |
| Layout or text primitive     | `components/ui/`          | `stack.tsx`               |
| Region of the screen         | `components/layout/`      | `workspace-layout.tsx`    |
| Visitor setting              | `components/preferences/` | `lang-toggle.tsx`         |
| Pure utility                 | `lib/`                    | `cn.ts`                   |
| Message catalog              | `i18n/`                   | `fr.ts`                   |

Properties are described in lists, one file per target (container, item).
Each entry is built by the helper of its kind (`<kind>Property`), which
returns the property's Zod schema with its description attached, so `z.object` takes a list as it is. A kind
gets its helper only when a property needs it. `property-kinds/` imports
only Zod and `length/`; anything that names a Flexbox property goes in
`properties/`. Explanation texts are i18n
messages, not domain data. MDN links are derived from the property's name
(`mdn-url.ts`), not stored.

## Theme

- File: `src/theme/theme.css`
- Themes: `light`, `dark`, from the mockups, declared in
  `src/theme/theme-options.ts` and stored under `flux:theme`. Without
  JavaScript, `light` applies.
- Tokens: the contract's aliases, the roles beyond the contract and the
  typography roles are declared in `theme.css`, the single source. A role
  keeps the same size on every screen.
- Osmoz mark: the O is `primary`, `#00778D` in light (4.84:1) and `#56D2DF`
  in dark (9.73:1) on the reference grounds (docs/brand.md).
- 4 px grid: spacing, sizes (heights, widths, icons) and line heights are
  multiples of 4 px, so no half step of the Tailwind scale (`gap-1.5`,
  `px-2.5`). Font sizes and radii stay outside the grid.
- Touch sizes follow the pointer, not the screen width: every interactive
  component is sized for the mouse (32 px controls, 24 px small ones) and
  grows with `pointer-coarse:` (44 px, 36 px small). The `lg:` breakpoint
  only changes the layout.
- Fonts: Geist for the interface, Geist Mono for code and titles, with
  system fallback stacks. Only `--font-sans` and `--font-mono` change in
  `@theme`; each role's family is set in `components/ui/typography-classes.ts`.
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
  Until the visitor picks a language, Flux is in French, whatever the browser's language; the
  choice is stored under `flux:locale`. `index.html` declares `lang="fr"`.
- Each language is named in itself in every switcher.

## Commands

None beyond the root commands.
