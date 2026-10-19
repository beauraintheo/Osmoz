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

## Layout

- **Desktop**: the lockup, symbol and wordmark.
- **Mobile**: the symbol alone.
- The favicon is the symbol alone.

## Colors

The mark's colors are fixed. They do not follow an app's theme tokens.

| Role     | Light     | Dark      | Contrast on its ground |
| -------- | --------- | --------- | ---------------------- |
| Cloud    | `#8463C4` | `#9C8CFF` | 4.25:1 · 6.33:1        |
| O        | `#D9638F` | `#FF8FB8` | 3.16:1 · 8.22:1        |
| Wordmark | `#33244F` | `#EDE8FF` | 12.88:1 · 14.64:1      |
| Ground   | `#FBF5EE` | `#12163A` |                        |

Contrast is measured on the reference grounds: cream in light, deep night blue
in dark. On another ground, check that the cloud and the O stay at 3:1 or
more.

## Wordmark

Osmoz, in Manrope Bold, letter-spacing -0.03em.

> [!WARNING]
> In the lockup files the wordmark is still live text: it renders in Manrope
> only where the font is installed. Outline it before shipping the files.

## Shared and free

One author, many identities: an app shares the signature, nothing else.

| Shared by every app                                 | Free in each app         |
| --------------------------------------------------- | ------------------------ |
| The Osmoz mark and its colors                       | Palette and themes       |
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
- **Mobile**: the symbol alone, with `aria-label="par Osmoz"`.
- It is a link to [github.com/beauraintheo](https://github.com/beauraintheo)
  until the portfolio exists, then to the portfolio.
- The symbol keeps its fixed colors; the text takes the app's muted foreground
  token.
- The symbol is at least 16 px high and the link target at least 24 × 24 px.

## Derived favicon

Each app's favicon is the Osmoz symbol with the O in the app's accent color.
The cloud keeps the Osmoz cloud color, so the tabs of every app read as one
family and still tell apart.

The app's accent must keep the O at 3:1 or more on both reference grounds. An
app without a settled accent uses `osmoz-symbol.svg` until it has one.

## Not done yet

- The wordmark outlined to paths.
- The `.ico` 32 px fallback, for browsers without SVG favicons.
- Flux's derived favicon: it ships the plain Osmoz symbol until OSM-13 settles
  its accent.
