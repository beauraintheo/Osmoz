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

## v1 inventory

First iteration, built from the OSM-13 mockups. Anything marked
**proposed** is not settled: see [Open questions](#open-questions).

### Container properties

The generated code omits every property left at its default.

| Property          | Values                                                                                                   | Default  | Control                 |
| ----------------- | -------------------------------------------------------------------------------------------------------- | -------- | ----------------------- |
| `flex-direction`  | `row`, `row-reverse`, `column`, `column-reverse`                                                         | `row`    | Tiles, 2 columns        |
| `flex-wrap`       | `nowrap`, `wrap`, `wrap-reverse`                                                                         | `nowrap` | Tiles                   |
| `justify-content` | `normal`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`            | `normal` | Tiles                   |
| `align-items`     | `normal`, `flex-start`, `flex-end`, `center`, `stretch`, `baseline`                                      | `normal` | Tiles                   |
| `align-content`   | `normal`, `flex-start`, `flex-end`, `center`, `stretch`, `space-between`, `space-around`, `space-evenly` | `normal` | Tiles, "no effect" note |
| `gap`             | 0 to 48 px, step 2 (proposed)                                                                            | `0`      | Slider and its value    |

`normal` is the browser's real default: it behaves as `flex-start` for
`justify-content` and as `stretch` for the two others. Each tile shows its
value in a live miniature flex box.

Candidate values, not in v1 yet: `start`, `end` (all three), `self-start`,
`self-end` (`align-items`, `align-self`), separate `row-gap` and
`column-gap`. Left out: `left`, `right`, `safe`, `unsafe`.

### Item properties

| Property      | Values                                                | Default | Control                      |
| ------------- | ----------------------------------------------------- | ------- | ---------------------------- |
| `order`       | Integer, -99 to 99 (proposed)                         | `0`     | Stepper                      |
| `flex-grow`   | Number ≥ 0, up to 99 (proposed)                       | `0`     | Stepper, step 1              |
| `flex-shrink` | Number ≥ 0, up to 99 (proposed)                       | `1`     | Stepper, step 1              |
| `flex-basis`  | `auto`, `content`, `0`, a length                      | `auto`  | Text field, validated        |
| `align-self`  | `auto`, then the `align-items` values except `normal` | `auto`  | Tiles                        |
| `width`       | `auto`, `0`, a length                                 | `auto`  | Text field, validated        |
| `height`      | `auto`, `0`, a length                                 | `auto`  | Text field, validated        |
| Content       | Text, 0 to 40 characters (proposed)                   | Its id  | Text field; HTML output only |

A length is a number followed by `px`, `%`, `rem`, `em`, `ch`, `vw` or
`vh`. Keywords are matched after trimming. Candidates: `min-content`,
`max-content`, `fit-content`. Left out: `calc()`.

### Items and preview

| Setting        | Values                                                | Default |
| -------------- | ----------------------------------------------------- | ------- |
| Items          | 0 to 12 (proposed); ids are never reused in a session | 3       |
| Preview width  | 120 to 1200 px                                        | 520     |
| Preview height | 80 to 900 px                                          | 300     |
| Theme          | `light`, `dark`                                       | System  |

The preview size is set by dragging the corner handle, with the arrow keys
on that handle (16 px per press), or with two number fields. It never
appears in the generated code.

### Generated code

- **CSS**: `.container` always gets `display: flex`, then its changed
  properties. Each changed item gets an `.item-<id>` block; unchanged items
  get none.
- **Shorthands** (toggle, off by default): `flex-direction` and `flex-wrap`
  become `flex-flow`, holding only the changed parts. `flex-grow`,
  `flex-shrink` and `flex-basis` become `flex: <grow> <shrink> <basis>`,
  all three written, as soon as one of them changed.
- **HTML**: one `.container`, one `.item-<id>` per item with its content.
- **Copy** copies the visible tab, as shown.
- Property and value names are written exactly as in CSS.

### Errors and edge cases

| Case                                           | Behavior                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Invalid `flex-basis`, `width` or `height`      | Field marked invalid; the canvas and code keep the last valid value; a message says what to type |
| Field left invalid, then another item selected | The invalid text is dropped; the field shows the last valid value                                |
| Stepper at its bound                           | The button past the bound is disabled                                                            |
| Preview size typed out of range                | Clamped to the bound on blur                                                                     |
| `align-content` while `flex-wrap: nowrap`      | Still editable, with a "no effect, single line" note                                             |
| `justify-content` while an item grows          | No free space left, so no visible effect; same kind of note (proposed)                           |
| Items bigger than the preview                  | They overflow the dashed frame, as in CSS; nothing is clipped                                    |
| Last item deleted                              | Empty state with an add button; the code keeps `.container` alone                                |
| Item limit reached                             | Add button disabled, with the reason                                                             |
| Selected item deleted                          | Selection cleared, the Container tab opens                                                       |
| Undo brings back a deleted item                | It comes back unselected                                                                         |
| Reset all                                      | Undoable, like any change                                                                        |
| Nothing to undo or redo                        | The button is disabled                                                                           |
| `⌘Z` while a text field has focus              | The field's own undo, not the app's                                                              |
| Clipboard refused or unavailable               | The button says the copy failed; the code stays selectable                                       |
| Web fonts not loaded                           | System fallback stacks; nothing shifts                                                           |
| Reduced motion                                 | No transition                                                                                    |

If the state is saved in the browser (open question):

| Case                                   | Behavior                                     |
| -------------------------------------- | -------------------------------------------- |
| Storage unavailable (private browsing) | Works without saving, no message             |
| Saved state fails schema validation    | Starts from the arrival state                |
| Saved state from an older schema       | Migrated if possible, else the arrival state |

### Flows

1. **First visit.** Three items, Container tab, the code shows
   `display: flex` alone. Hover or focus a value: its sentence shows under
   the canvas. Pick it: canvas and code change at once, undo becomes
   available, the property shows "Défaut".
2. **Check a behavior.** Pick the property values, read the canvas and the
   axes, copy the code.
3. **Edit an item.** Click it on the canvas: the Item tab opens. Change a
   stepper, type a `flex-basis`; an invalid entry shows its message until
   fixed.
4. **Undo a mistake.** Undo and redo, reset one property, or reset
   everything (undoable too).
5. **Empty container.** Delete every item: empty state, then add one.
6. **Resize.** Drag the handle, use the arrow keys on it, or type the size:
   the size shows while dragging, items reflow live.
7. **Copy.** CSS or HTML, shorthands on or off, copy, "Copié" for 1.6 s.
8. **Theme.** Follows the system until switched; the manual choice is
   remembered (`docs/conventions.md`).
9. **Mobile.** Canvas on top, then Conteneur, Élément and Code tabs. The
   same properties in the same order.
10. **Keyboard only.** Header, controls, canvas items, resize handle, code,
    in that order; every action reachable, focus always visible.

### Open questions

- Is the playground state saved in the browser in v1?
- Which candidate values join v1?
- Are the proposed bounds right: 12 items, `order` ±99, `gap` 48 px,
  40-character content?
- Should `flex-grow` and `flex-shrink` accept decimals?
- On touch screens, how does a value's explanation show without a hover:
  the info button only, or a long press?
- Which layout between mobile and desktop (tablets, narrow windows)?
