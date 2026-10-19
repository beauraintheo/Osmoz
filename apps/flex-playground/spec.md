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

| Milestone  | Delivers                                    |
| ---------- | ------------------------------------------- |
| Playground | Experiment and check a behavior             |
| Tailwind   | Generated code as Tailwind classes, as well |
| Docs       | One readable section per property           |
| Exercises  | Reproduce a target layout                   |

Milestones are not version numbers: versions follow strict SemVer, and a new
mode adds features without breaking anything. Playground ships as `1.0.0`.

Playground, Docs and Exercises are modes of the same app, on the same
three-column frame:

| Mode       | Route             | Left          | Center                   | Right              |
| ---------- | ----------------- | ------------- | ------------------------ | ------------------ |
| Playground | `/`               | Controls      | Canvas                   | Code               |
| Docs       | `/docs/$property` | Property list | Article, static diagrams | Table of contents  |
| Exercises  | `/exercises/$id`  | Controls      | Canvas: target and yours | Brief, hint, check |

Constraints from Playground, so later milestones plug in without rework:

- Each property is described once (name, values, default, target,
  explanation, MDN link, diagram). The playground, the docs and the exercises
  read that one description.
- The layout state (container and items) is one plain, validated object. The
  docs' "Try it" passes it to the playground, and an exercise describes its
  target with it.

## Playground

Mockups: the OSM-13 canvas. Anything marked **proposed** is not settled: see
[Open questions](#open-questions).

### Screen

Three columns under a thin top bar:

- **Top bar**: the app name, the command palette trigger, undo, redo, help,
  and the Osmoz signature (`docs/brand.md`). Reset and theme are in the
  command palette; settings and about are in the help dialog.
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

| Property          | Values                                                                                                        | Default  |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| `display`         | `flex`, `inline-flex`                                                                                         | `flex`   |
| `flex-direction`  | `row`, `row-reverse`, `column`, `column-reverse`                                                              | `row`    |
| `flex-wrap`       | `nowrap`, `wrap`, `wrap-reverse`                                                                              | `nowrap` |
| `justify-content` | `normal`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `start`, `end` | `normal` |
| `align-items`     | `normal`, `stretch`, `flex-start`, `flex-end`, `center`, `baseline`, `start`, `end`                           | `normal` |
| `align-content`   | `normal`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`, `stretch`      | `normal` |
| `row-gap`         | length, 0 to 48 px (proposed)                                                                                 | `0`      |
| `column-gap`      | length, 0 to 48 px (proposed)                                                                                 | `0`      |

`normal` is the browser's real default: it behaves as `flex-start` for
`justify-content` and as `stretch` for the two others. It is listed so the
default is a visible, selectable value.

The container's width and height can be changed by dragging its edge, with
the arrow keys on the resize handle (16 px per press), or by typing a value,
to reproduce wrapping and shrinking. Width 120 to 1200 px, height 80 to
900 px. The size never appears in the generated code.

### Items

- Add, duplicate and remove items. With no item, the canvas says how to add
  one.
- Select an item by clicking it or with the keyboard, then edit it in the
  _Item_ tab.
- 1 to 12 items (proposed). Item ids are never reused within a session.

| Property      | Values                                                            | Default |
| ------------- | ----------------------------------------------------------------- | ------- |
| `order`       | integer, -99 to 99 (proposed)                                     | `0`     |
| `flex-grow`   | number ≥ 0, up to 99 (proposed)                                   | `0`     |
| `flex-shrink` | number ≥ 0, up to 99 (proposed)                                   | `1`     |
| `flex-basis`  | `auto`, `content`, length or percentage                           | `auto`  |
| `align-self`  | `auto`, `stretch`, `flex-start`, `flex-end`, `center`, `baseline` | `auto`  |
| `width`       | `auto`, length                                                    | `auto`  |
| `height`      | `auto`, length                                                    | `auto`  |
| Content       | text, to test content sizing, 0 to 40 characters (proposed)       | empty   |
| Font size     | length, to test `baseline` alignment                              | inherit |

A length is a number followed by `px`, `%`, `rem`, `em`, `ch`, `vw` or `vh`,
or `0`. Keywords are matched after trimming.

Each item shows its index, so `order` and `*-reverse` are readable.

### Visual controls

- An enumerated value is a button showing a diagram of its effect and its
  exact CSS name. A numeric value is a field with steppers.
- The current value and the default are marked with text or an icon, never
  with color alone.
- Hovering or focusing a value previews it on the canvas without applying it,
  and shows its one-sentence explanation in the status line.
- A property's reset and its MDN link show when its row is hovered or
  focused. A property changed from its default is marked as such.
- `align-content` while `flex-wrap` is `nowrap`, and `justify-content` while
  an item grows, stay editable with a "no visible effect" note.

### Axes

The main axis and the cross axis are drawn on the container. They follow
`flex-direction`, and `wrap-reverse` flips the cross axis. They can be hidden.

### Generated code

- CSS and HTML of the current layout, with default values omitted.
- **CSS**: `.container` always gets `display: flex`, then its changed
  properties. Each changed item gets an `.item-<index>` block; unchanged items
  get none. Class names are proposed.
- A switch between longhand (`flex-grow: 1`) and shorthand (`flex: 1`,
  `flex-flow`, `gap`). In shorthand, `flex-flow` holds only the changed parts,
  and `flex` writes grow, shrink and basis as soon as one of them changed.
- **HTML**: one `.container`, one `.item-<index>` per item with its content.
- A copy button that confirms the copy, or says it failed and leaves the code
  selectable.

### History and persistence

- Undo and redo every change, with buttons and with `Ctrl`/`Cmd` + `Z` and
  `Shift` + `Ctrl`/`Cmd` + `Z`. In a text field, these keys belong to the
  field.
- Reset one property to its default, or the whole layout. Both can be undone.
- The state is saved in the browser. No sharing by URL in Playground.

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

### Errors and edge cases

| Case                                           | Behavior                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Invalid `flex-basis`, `width`, `height`        | Field marked invalid; canvas and code keep the last valid value; a message says what to type |
| Field left invalid, then another item selected | The invalid text is dropped; the field shows the last valid value                            |
| Stepper at its bound                           | The button past the bound is disabled                                                        |
| Container size typed out of range              | Clamped to the bound when the field loses focus                                              |
| Items bigger than the container                | They overflow the dashed frame, as in CSS; nothing is clipped                                |
| Last item removed                              | Empty state with an add button; the code keeps `.container` alone                            |
| Item limit reached                             | Add and duplicate disabled, with the reason                                                  |
| Selected item removed                          | Selection cleared, the Container tab opens                                                   |
| Undo brings back a removed item                | It comes back unselected                                                                     |
| Nothing to undo or redo                        | The button is disabled                                                                       |
| Clipboard refused or unavailable               | The copy button says it failed; the code stays selectable                                    |
| Browser storage unavailable                    | Works without saving, no message                                                             |
| Saved state fails validation                   | Starts from the initial state                                                                |
| Saved state from an older schema               | Migrated if possible, else the initial state                                                 |
| Web fonts not loaded                           | System fallback stacks; nothing shifts                                                       |
| Reduced motion                                 | No transition                                                                                |

### Flows

1. **First visit.** Three items, Container tab, the code shows
   `display: flex` alone. Hover or focus a value: the canvas previews it and
   the status line explains it. Pick it: canvas and code change, undo becomes
   available, the property is marked as changed.
2. **Check a behavior.** Pick the values, read the canvas and the axes, copy
   the code.
3. **Edit an item.** Click it, or press its number: the Item tab opens.
   Change a stepper, type a `flex-basis`; an invalid entry shows its message
   until fixed.
4. **Undo a mistake.** Undo and redo, reset one property, or reset the layout
   from the palette (undoable too).
5. **Empty container.** Remove every item: empty state, then add one.
6. **Resize.** Drag the handle, use the arrow keys on it, or type the size;
   items reflow live.
7. **Copy.** CSS or HTML, shorthand on or off, copy, confirmation.
8. **Keyboard power use.** `Cmd`/`Ctrl` + `K` to jump to a property or run
   an action; single keys for frequent actions; `?` for help.
9. **Come back later.** The last state is restored.
10. **Theme.** Follows the system until switched from the palette; the
    choice is remembered.
11. **Mobile.** Canvas on top, then Container, Item and Code tabs. The same
    properties in the same order.
12. **Keyboard only.** Top bar, controls, canvas items, resize handle, code;
    every action reachable, focus always visible.

## Docs

- One section per property: what it does, each value with a static diagram,
  common pitfalls.
- "Try it" opens the playground with that value applied; the playground links
  back to the section.
- The docs pages are meant to be indexed (see OSM-25).

## Exercises

Reproduce a target layout with the controls; the result is checked against
the target. Scoped when Docs ships.

## Out of scope

- Sharing a layout by URL (Playground).
- Generated code as Tailwind classes (Tailwind milestone).
- Languages other than English (Playground).
- CSS Grid: it has its own app.

## Non-functional

- Accessibility: WCAG 2.2 AA, every action reachable with the keyboard.
- Responsive: full experience from mobile to desktop.
- Browsers: features listed as Baseline widely available.

## Open questions

- Bounds marked proposed: 12 items, `order` ±99, grow and shrink up to 99,
  gaps up to 48 px, 40-character content.
- Should `flex-grow` and `flex-shrink` accept decimals?
- Values beyond the lists above: `left`, `right`, `safe`, `unsafe`,
  `first baseline`, `last baseline`, `self-start`, `self-end`; `min-content`,
  `max-content`, `fit-content` for sizes.
- Class names in the generated code (`.container`, `.item-1`…).
- On touch screens, how a value's explanation and preview show without hover.
- Layout between mobile and desktop (tablets, narrow windows).
- Lighthouse targets, once OSM-25 gives a public URL.
- Command palette, shortcuts, i18n and theme switching are wanted in every
  app: their approach is decided for the monorepo, their code starts here.
