# osmoz.css

osmoz.css (`osmoz-css`) gathers the everyday CSS tools under one navigation.
It is one app with one route per tool: the tools share the shell, the theme,
the languages and the design system, so they live in one app rather than one
app each. What each tool does and why is in its own `spec.md`, next to its
code (`src/tools/<tool>/spec.md`).

## Stack

- Fontsource (Geist, Geist Mono, Bricolage Grotesque): bundles the fonts with the app, no
  third-party request.
- Zod: validates a tool's state at its boundaries (browser storage, URLs).
  Its schema is derived from the tool's property descriptions, never written
  next to them.
- `@osmoz/brand`: the Osmoz mark, for the signature; its O takes the app's
  accent through `--osmoz-o` (docs/brand.md). `theme.css` imports
  `@osmoz/brand/brand.css` so Tailwind generates its classes.
- zustand: the app's state library. `@osmoz/preferences` builds the theme
  and language stores with it; a tool's state and its history will use it
  too.
- `@osmoz/ui`: interface components without style; the app styles each one
  it uses in `components/ui/`.
- Remix Icon (`@remixicon/react`): the app's icons, line style, always
  passed as components to `components/ui/icon.tsx`, which holds their sizes.
  Free for apps and design systems; its license only forbids selling the
  icons on their own.

## Structure

```
src/
  routes/       TanStack Router file routes, one per tool; thin, they only
                compose a tool's features and components, with no class and
                no layout element. `/` redirects to `/flexbox` until the
                home page exists
  tools/        one folder per tool, named after it
    flexbox/
      spec.md        what the tool does and why
      domain/        the tool's knowledge; plain TypeScript
        properties/  the Flexbox properties, built with the shared kinds:
                     the container and item lists, their MDN links
        layout/      the layout state, its schema and its transitions
      features/      one folder per mode, its UI and logic: playground/,
                     docs/, exercises/; screens, assembled from components
                     like routes
  shared/       code that two tools or more need, and that is not UI
    domain/     plain TypeScript that knows no tool
      length/          parsing and normalizing a typed length
      property-kinds/  one helper per kind of property, and what the kinds
                       share
  components/   patterns: shared UI with no domain knowledge, built from
                components/ui, holding the classes and the responsive
                layout of the screens; one folder per family, named after
                what its components do, never after a kind of file
    layout/     the regions of the screen: the shell, the top bar, the
                workspace columns
    preferences/ the visitor's settings: language and theme
    ui/         the app's design system: one styled version per @osmoz/ui
                component, and the layout and text primitives with no
                @osmoz/ui counterpart, each with its stories, and nothing
                that knows the app; typography-classes.ts maps each
                typography role to its classes, font family included;
                introduction.mdx, the app's entry page in the Storybook, is
                the one file that describes the design system
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

`theme/`, `i18n/`, `lib/cn.ts` and `components/ui/` keep the paths every app
follows (docs/getting-started.md). A folder is created by its first file.

## Layers

- `routes` may import `tools/<tool>/features`, `components` and `lib`.
- A tool never imports another tool. Code two tools need moves to `shared`,
  `components` or `lib`, when the second tool needs it, not before.
- `tools/<tool>/features/<a>` may import its tool's `domain`, `shared`,
  `components` and `lib`, never `routes` nor another feature. Code two
  features need moves to the tool's `domain`, `components` or `lib`.
- `tools/<tool>/domain` and `shared/domain` may import `shared/domain` and
  `lib`, never React nor any other folder of the app. `shared` never imports
  a tool.
- `components` may import `components/ui`, `lib` and `@osmoz/brand`, never
  `tools`, `shared` nor `routes`.
- `components/ui` may import `lib`, `@osmoz/ui` and the other files of
  `components/ui`: no store, no catalog, no component outside it. Its texts
  come in as props.
- `routes`, features and `components` use the styled components of
  `components/ui/`, never `@osmoz/ui` directly.
- `lib` imports nothing from the app.
- `theme` imports nothing from the app. `routes`, features and `components`
  may import `theme/use-theme-store` to read or change the theme.
- `i18n` imports nothing from the app. `routes`, features and `components`
  read the texts with `i18n/use-messages` and change the language with
  `i18n/use-locale-store`, never a catalog.

## Where a file goes

| Kind of file                 | Folder                             | Example                   |
| ---------------------------- | ---------------------------------- | ------------------------- |
| Tool page                    | `routes/`                          | `flexbox.tsx`             |
| Mode component               | `tools/<tool>/features/<feature>/` | `flex-container-view.tsx` |
| Mode logic or state          | `tools/<tool>/features/<feature>/` | `use-history.ts`          |
| Property descriptions        | `tools/<tool>/domain/properties/`  | `container-properties.ts` |
| Tool state and its schema    | `tools/<tool>/domain/<state>/`     | `layout-state.ts`         |
| Code generation              | `tools/<tool>/domain/`             | `to-css.ts`               |
| Length parsing               | `shared/domain/length/`            | `parse-length.ts`         |
| Kind of property             | `shared/domain/property-kinds/`    | `keyword-property.ts`     |
| Styled `@osmoz/ui` component | `components/ui/`                   | `button.tsx`              |
| Layout or text primitive     | `components/ui/`                   | `stack.tsx`               |
| Region of the screen         | `components/layout/`               | `workspace-layout.tsx`    |
| Visitor setting              | `components/preferences/`          | `lang-toggle.tsx`         |
| Pure utility                 | `lib/`                             | `cn.ts`                   |
| Message catalog              | `i18n/`                            | `fr.ts`                   |

Properties are described in lists, one file per target (container, item).
Each entry is built by the helper of its kind (`<kind>Property`), which
returns the property's Zod schema with its description attached, so
`z.object` takes a list as it is. A kind gets its helper only when a property
needs it. `property-kinds/` imports only Zod and `length/`; anything that
names a CSS property goes in the tool's `properties/`. Explanation texts are
i18n messages, not domain data. MDN links are derived from the property's
name (`mdn-url.ts`), not stored.

## Theme

- File: `src/theme/theme.css`
- Themes: `light`, `dark`, from the mockups, declared in
  `src/theme/theme-options.ts` and stored under `osmoz-css:theme`. Without
  JavaScript, `light` applies.
- Tokens: the contract's aliases, the roles beyond the contract and the
  typography roles are declared in `theme.css`, the single source. A role
  keeps the same size on every screen.
- Accent: `primary`, `primary-foreground` (light), `accent` and
  `accent-foreground` derive from one hue, `--primary-hue` (215), each with
  its own lightness and chroma; `ring` and `--osmoz-o` point at `primary`.
  The contrasts of the mockups hold at 215; any other hue offered to the
  visitor must be checked against them.
- Osmoz mark: the O is `primary`, `#00778D` in light (4.84:1) and `#56D2DF`
  in dark (9.73:1) on the reference grounds (docs/brand.md).
- 4 px grid: spacing, sizes (heights, widths, icons) and line heights are
  multiples of 4 px, so no half step of the Tailwind scale (`gap-1.5`,
  `px-2.5`). Font sizes and radii stay outside the grid.
- Touch sizes follow the pointer, not the screen width: every interactive
  component is sized for the mouse (32 px controls, 24 px small ones) and
  grows with `pointer-coarse:` (44 px, 36 px small). The `lg:` breakpoint
  only changes the layout.
- Fonts: Geist for the interface, Geist Mono for code and labels, Bricolage
  Grotesque for titles, with system fallback stacks. `--font-sans` and
  `--font-mono` change in `@theme`, and `--font-display` is added for the
  titles; each role's family is set in `components/ui/typography-classes.ts`.
- Font loading: `fonts.css`, imported by `theme.css`, declares the latin and
  latin-ext faces of each font from Fontsource's files (Bricolage Grotesque's
  with its optical size axis), with
  `font-display: optional`: a font is used only if it is ready for the first
  paint, otherwise the system stack stays for the visit, so text never
  reflows. Fontsource's own CSS is not imported, since it forces `swap`; its
  `unicode-range` values are copied and must be checked when Fontsource is
  updated. `index.html` preloads the latin files so they are usually ready;
  Vite rewrites the links to the hashed files the CSS requests.

## Languages

- Catalogs: `fr`, the source and the fallback, and `en`, in `src/i18n/`.
  Until the visitor picks a language, the app is in French, whatever the
  browser's language; the choice is stored under `osmoz-css:locale`.
  `index.html` declares `lang="fr"`.
- Each language is named in itself in every switcher.

## Commands

None beyond the root commands.
