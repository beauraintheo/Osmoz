# Brand

What every Osmoz app shares. Everything else, each app decides on its own.

## The mark

A cloud outline with a solid O passing through its edge, half outside and half
inside: knowledge passing through, as in osmosis. The cloud line cuts a gap
into the O where they cross.

| File                                                           | Use                                                |
| -------------------------------------------------------------- | -------------------------------------------------- |
| [osmoz-lockup-light.svg](brand/osmoz-lockup-light.svg)         | Symbol and wordmark, light grounds                 |
| [osmoz-lockup-dark.svg](brand/osmoz-lockup-dark.svg)           | Symbol and wordmark, dark grounds                  |
| [osmoz-symbol-light.svg](brand/osmoz-symbol-light.svg)         | Symbol alone, light grounds                        |
| [osmoz-symbol-dark.svg](brand/osmoz-symbol-dark.svg)           | Symbol alone, dark grounds                         |
| [osmoz-symbol.svg](brand/osmoz-symbol.svg)                     | Favicon: follows `prefers-color-scheme` on its own |
| [osmoz-app-icon.svg](brand/osmoz-app-icon.svg)                 | App icon source: symbol on the cream ground        |
| [osmoz-apple-touch-icon.png](brand/osmoz-apple-touch-icon.png) | App icon, 180 px, rendered from the source         |

The gap is a mask, not a background-colored stroke: every file is transparent
and sits on any ground.

These files are the source of the mark: the design reference, and what an
app's favicon and icon are derived from. Inside an app's interface, the mark
comes from `@osmoz/brand` instead. The symbol is a component drawn without
color (`@osmoz/brand/osmoz-symbol`): it reads `--osmoz-o` and `--osmoz-cloud`
from the app's theme and falls back to `currentColor`. It is decorative by
default; given an `aria-label`, it is announced as an image. The signature
(`@osmoz/brand/osmoz-signature`) is built on it. A file moves into the package
only when code imports it.

The symbol's paths exist twice, in `osmoz-symbol.svg` and in the component:
change both together. The component's `viewBox` fits the drawing tightly, so
it centers in any box; the files keep their own framing, made for favicons.

## Layout

- **Desktop**: the lockup, symbol and wordmark.
- **Mobile**: the symbol alone.
- The favicon is the symbol alone.

## Colors

The mark's colors are fixed when it stands for Osmoz itself: the files above,
the portfolio. Inside an app, the O takes the app's accent instead (see the
signature and the favicon below); the cloud and the wordmark never change.

| Role     | Light     | Dark      | Contrast on its ground |
| -------- | --------- | --------- | ---------------------- |
| Cloud    | `#8463C4` | `#9C8CFF` | 4.25:1 · 6.33:1        |
| O        | `#D9638F` | `#FF8FB8` | 3.16:1 · 8.22:1        |
| Wordmark | `#33244F` | `#EDE8FF` | 12.88:1 · 14.64:1      |
| Ground   | `#FBF5EE` | `#12163A` |                        |

Contrast is measured on the reference grounds: cream in light, deep night blue
in dark. On another ground, check that the cloud and the O stay at 3:1 or
more.

## Osmoz theme

`@osmoz/brand/osmoz-theme.css` dresses what speaks for Osmoz itself, not for
an app: the design system's Storybook today, the portfolio later. It fills the
whole token contract of [conventions.md](conventions.md#tokens), from the
colors above: the cream and night grounds, the wordmark as text, the cloud as
the accent.

Its themes are `osmoz-light` and `osmoz-dark`, never `light` and `dark`, and
it sets nothing on `:root`: the Storybook loads it next to an app's theme, and
the two must not override each other.

| Token                | Light     | Dark      | Contrast, light · dark          |
| -------------------- | --------- | --------- | ------------------------------- |
| `background`         | `#FBF5EE` | `#12163A` | ground                          |
| `foreground`         | `#33244F` | `#EDE8FF` | 12.88:1 · 14.64:1               |
| `card`               | `#FFFDF9` | `#1A1F4A` | foreground on it: 13.72 · 13.14 |
| `muted`              | `#F3EADF` | `#232859` | foreground on it: 11.72 · 11.58 |
| `muted-foreground`   | `#5F5373` | `#B7AEDA` | 6.53:1 · 8.39:1                 |
| `primary`            | `#6A4BB0` | `#B9AEFF` | 5.98:1 · 8.79:1                 |
| `primary-foreground` | `#FFFDF9` | `#12163A` | on primary: 6.37 · 8.79         |
| `accent`             | `#EDE5F8` | `#252B5E` | surface                         |
| `accent-foreground`  | `#553A9C` | `#D6CEFF` | on accent: 6.94 · 8.91          |
| `destructive`        | `#A3324F` | `#FF9BB5` | 6.20:1 · 8.83:1                 |
| `border`             | `#E5D9CB` | `#2C3266` | decorative                      |
| `input`              | `#8E8299` | `#6F76B0` | 3.34:1 · 4.07:1                 |
| `osmoz-o`            | `#D9638F` | `#FF8FB8` | 3.16:1 · 8.22:1                 |
| `osmoz-cloud`        | `#8463C4` | `#9C8CFF` | 4.25:1 · 6.33:1                 |

Contrast is measured on `background` unless stated. The file holds the values
in OKLCH, converted from these hex values. `card-foreground`,
`popover-foreground` and `secondary-foreground` are `foreground`, `popover` is
`card`, `secondary` is `muted`, and `ring` is `primary`.

## Wordmark

Osmoz, in Manrope Bold, letter-spacing -0.03em.

> [!WARNING]
> In the lockup files the wordmark is still live text: it renders in Manrope
> only where the font is installed. Outline it before shipping the files.

## Shared and free

One author, many identities: an app shares the signature, nothing else.

| Shared by every app                                 | Free in each app         |
| --------------------------------------------------- | ------------------------ |
| The Osmoz mark, its cloud and wordmark colors       | Palette and themes       |
| The signature in the header (below)                 | Fonts and type scale     |
| A favicon derived from the mark (below)             | Radius, spacing values   |
| The token contract and WCAG 2.2 AA, per conventions | Layout and composition   |
|                                                     | How it sets its own name |

## App name and signature

The app's own name comes first, in the app's own type: Flux is Flux, not Osmoz
Flux.

The Osmoz signature sits in the header, next to the app name, on every
screen:

- **Desktop**: the symbol followed by "par Osmoz".
- **Mobile**: the symbol alone; "par Osmoz" stays, visually hidden, as the
  link's name.
- It is a link to [github.com/beauraintheo](https://github.com/beauraintheo)
  until the portfolio exists, then to the portfolio. It opens in a new tab,
  announced to screen readers.
- The O takes the app's accent and the cloud the Osmoz cloud color, through
  the theme tokens `--osmoz-o` and `--osmoz-cloud`, with the values of the
  table below; the text takes the app's muted foreground token.
- The signature is one component for every app,
  `@osmoz/brand/osmoz-signature`: the `@osmoz/ui` link around the symbol, with
  its look fixed here. The app passes its texts (`label`, `newTabLabel`) and,
  through `className`, only its placement.
- The symbol is at least 16 px high. The link target is 32 px high with a
  mouse and 44 px with a coarse pointer (`pointer-coarse:`).

## Derived favicon

Each app's favicon is the Osmoz symbol with the O in the app's accent color,
the same as in its signature. The cloud keeps the Osmoz cloud color, so the
tabs of every app read as one family and still tell apart.

The app's accent must keep the O at 3:1 or more on both reference grounds. An
app without a settled accent uses `osmoz-symbol.svg` until it has one.

The app's `favicon.svg` is `osmoz-symbol.svg` with the O fills changed, and
its `apple-touch-icon.png` is `osmoz-app-icon.svg` with the light O fill
changed, rendered at 180 px.

| App  | O light   | O dark    | Contrast on its ground |
| ---- | --------- | --------- | ---------------------- |
| Flux | `#00778D` | `#56D2DF` | 4.84:1 · 9.73:1        |

## Not done yet

- The Osmoz theme's fonts: Manrope for the interface, a monospace for code,
  bundled like an app's fonts.
- The wordmark outlined to paths.
- The `.ico` 32 px fallback, for browsers without SVG favicons.
- An app's favicon generated from `osmoz-symbol.svg` and its accent, instead of
  derived by hand.
