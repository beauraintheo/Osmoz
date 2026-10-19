# Flux — functional spec

What Flux does and why. How it is built lives in [CLAUDE.md](CLAUDE.md).

## Purpose

Flux is an interactive Flexbox reference: the place to check how a property
behaves when in doubt. It targets developers who already use Flexbox and need
to confirm a behavior fast. A beginner must still be able to use it and
understand what they see.

[flexbox.tech](https://flexbox.tech/) covers the functional need. Flux keeps
its scope, fills its gaps and reworks the UI and UX.

| From the reference      | In Flux                                                  |
| ----------------------- | -------------------------------------------------------- |
| Container properties    | Kept, plus `gap` and the missing values                  |
| Item properties         | Kept, plus item size and content                         |
| Generated CSS and HTML  | Kept, defaults omitted; adds copy and longhand/shorthand |
| Reset                   | Kept, per property and global; adds undo/redo            |
| Empty canvas on arrival | Replaced by 3 items ready to play with                   |
| Dropdowns hiding values | Replaced by visual controls showing every value          |
| No explanation          | One sentence per value, axes drawn on the container      |

## UX principles

Every design choice is checked against these. When two conflict, the first
listed wins.

1. **Instant feedback.** Every change shows on the canvas immediately
   (Nielsen #1, visibility of system status).
2. **Recognition over recall.** Every value is visible with a diagram of its
   effect; nothing hides behind a dropdown (Nielsen #6).
3. **Direct manipulation.** Resize the container by dragging it, select an
   item by clicking it (Shneiderman).
4. **User control.** Every change can be undone; nothing asks for
   confirmation because nothing is lost (Nielsen #3).
5. **Standards.** CSS property and value names are written exactly as in CSS;
   defaults are the browser's (Nielsen #4).
6. **Progressive disclosure.** Explanations are one hover or focus away, never
   in the way of a developer who already knows.
7. **Accessible by default.** WCAG 2.2 AA and full keyboard use, as set in
   `docs/conventions.md`.

## Roadmap

| Version | Delivers                                    |
| ------- | ------------------------------------------- |
| v1      | Playground: experiment and check a behavior |
| v1.1    | Generated code as Tailwind classes, as well |
| v2      | Docs: one readable section per property     |
| v3      | Exercises: reproduce a target layout        |

Each version is a mode of the same app, on the same three-column frame:

| Mode       | Route             | Left          | Center                   | Right              |
| ---------- | ----------------- | ------------- | ------------------------ | ------------------ |
| Playground | `/`               | Controls      | Canvas                   | Code               |
| Docs       | `/docs/$property` | Property list | Article, static diagrams | Table of contents  |
| Exercises  | `/exercises/$id`  | Controls      | Canvas: target and yours | Brief, hint, check |

Constraints from v1, so later versions plug in without rework:

- Each property is described once (name, values, default, target,
  explanation, MDN link, diagram). The playground, the docs and the exercises
  read that one description.
- The layout state (container and items) is one plain, validated object. The
  docs' "Try it" passes it to the playground, and an exercise describes its
  target with it.

## v1 — Playground

### Screen

Three columns under a thin top bar:

- **Top bar**: logo and name, the command palette trigger, undo, redo, help.
  Reset and theme are in the command palette; settings and about are in the
  help dialog.
- **Controls** (left): two tabs, _Container_ and _Item_. Each property is a
  collapsible row.
- **Canvas** (center): the flex container and its items, with one status line
  below it that explains the value being hovered or focused.
- **Code** (right): the generated CSS and HTML, always visible.

On mobile, the full experience is kept: canvas on top, controls and code in
tabs of a panel below.

### Initial state

- 3 items, every property at its browser default, axes visible.
- On a later visit, the last state is restored.

### Container

| Property          | Values                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `display`         | `flex`, `inline-flex`                                                                                    |
| `flex-direction`  | `row`, `row-reverse`, `column`, `column-reverse`                                                         |
| `flex-wrap`       | `nowrap`, `wrap`, `wrap-reverse`                                                                         |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `start`, `end`      |
| `align-items`     | `stretch`, `flex-start`, `flex-end`, `center`, `baseline`, `start`, `end`                                |
| `align-content`   | `normal`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `stretch` |
| `row-gap`         | length                                                                                                   |
| `column-gap`      | length                                                                                                   |

The container's width and height can be changed by dragging its edge or by
typing a value, to reproduce wrapping and shrinking.

### Items

- Add, duplicate and remove items. With no item, the canvas says how to add
  one.
- Select an item by clicking it or with the keyboard, then edit it in the
  _Item_ tab.

| Property      | Values                                                            |
| ------------- | ----------------------------------------------------------------- |
| `order`       | integer                                                           |
| `flex-grow`   | number ≥ 0                                                        |
| `flex-shrink` | number ≥ 0                                                        |
| `flex-basis`  | `auto`, `content`, length or percentage                           |
| `align-self`  | `auto`, `stretch`, `flex-start`, `flex-end`, `center`, `baseline` |
| `width`       | `auto`, length                                                    |
| `height`      | `auto`, length                                                    |
| Content       | text, to test content sizing                                      |
| Font size     | length, to test `baseline` alignment                              |

Each item shows its index, so `order` and `*-reverse` are readable.

### Visual controls

- An enumerated value is a button showing a diagram of its effect and its
  exact CSS name. A numeric value is a field with steppers.
- The current value and the default are marked with text or an icon, never
  with color alone.
- Hovering or focusing a value previews it on the canvas without applying it,
  and shows its one-sentence explanation in the status line.
- A property's reset and its MDN link show when its row is hovered or
  focused.

### Axes

The main axis and the cross axis are drawn on the container. They follow
`flex-direction`, and `wrap-reverse` flips the cross axis. They can be hidden.

### Generated code

- CSS and HTML of the current layout, with default values omitted.
- A switch between longhand (`flex-grow: 1`) and shorthand (`flex: 1`,
  `flex-flow`, `gap`).
- A copy button that confirms the copy.

### History and persistence

- Undo and redo every change, with buttons and with `Ctrl`/`Cmd` + `Z` and
  `Shift` + `Ctrl`/`Cmd` + `Z`.
- Reset one property to its default, or the whole layout. Both can be undone.
- The state is saved in the browser. No sharing by URL in v1.

### Command palette and shortcuts

- `Cmd`/`Ctrl` + `K` opens a command palette with only the essentials: go to
  a property (opens and focuses its row), add an item, copy the CSS, copy the
  HTML, reset the layout, change the theme, open the help. Values are set with
  the controls, not from the palette.
- Single-key shortcuts for frequent actions:

| Key         | Action                  |
| ----------- | ----------------------- |
| `A`         | Add an item             |
| `D`         | Duplicate the item      |
| `Backspace` | Remove the item         |
| `1`–`9`     | Select an item          |
| `C`         | Copy the CSS            |
| `?`         | Open help and shortcuts |

- Single-key shortcuts are on by default and can be turned off in the
  palette (WCAG 2.1.4). They never fire while typing in a field.
- Every action also has a visible control: a shortcut is a faster path, never
  the only one.

### Help and about

`?` or the palette opens one dialog: what Flux is for, the shortcuts, the
author, links to Osmoz and the source code. No separate page, so the
playground keeps the whole screen.

### Onboarding

No guided tour. The initial state, the visible axes and the visual controls
make the first use self-explanatory.

### Themes and language

- Light and dark. The system preference is followed until the user picks one;
  the choice is remembered.
- English only, but every string goes through the i18n mechanism so other
  languages can be added without touching components.

## v2 — Docs

- One section per property: what it does, each value with a static diagram,
  common pitfalls.
- "Try it" opens the playground with that value applied; the playground links
  back to the section.
- The docs pages are meant to be indexed (see OSM-25).

## v3 — Exercises

Reproduce a target layout with the controls; the result is checked against
the target. Scoped when v2 ships.

## Out of scope

- Sharing a layout by URL (v1).
- Generated code as Tailwind classes (v1.1).
- Languages other than English (v1).
- CSS Grid: it has its own app.

## Non-functional

- Accessibility: WCAG 2.2 AA, every action reachable with the keyboard.
- Responsive: full experience from mobile to desktop.
- Browsers: features listed as Baseline widely available.

## Open questions

- Maximum number of items.
- Values beyond the lists above: `left`, `right`, `safe`, `unsafe`,
  `first baseline`, `last baseline`.
- Class names in the generated code (`.container`, `.item-1`…).
- Lighthouse targets, once OSM-25 gives a public URL.
- How Flux shows its link to Osmoz and its author, set by OSM-23.
- Command palette, shortcuts, i18n and theme switching are wanted in every
  app: their approach is decided for the monorepo, their code starts here.
