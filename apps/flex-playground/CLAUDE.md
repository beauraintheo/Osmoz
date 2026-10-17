# Flux

Flux (`flex-playground`) is an interactive playground to experiment with
Flexbox, modeled on [flexbox.tech](https://flexbox.tech/).

## Stack

Nothing beyond `@osmoz/config`'s base yet. shadcn/ui is planned: it is set up
with its first component (`components.json`, `lib/cn.ts`), not before.

## Structure

```
src/
  routes/       TanStack Router file routes; thin, they only compose features
  features/     one folder per domain, its UI and logic (e.g. flex-editor/)
  components/   shared UI with no domain knowledge
  lib/          pure utilities with no React
  theme.css     the app's theme
```

`features/`, `components/` and `lib/` are created by their first file.

## Layers

- `routes` may import `features`, `components` and `lib`.
- `features/<a>` may import `components` and `lib`, never `routes` nor another
  feature. Code two features need moves to `components` or `lib`.
- `components` may import `lib`, never `features` nor `routes`.
- `lib` imports nothing from the app.

## Where a file goes

| Kind of file          | Folder                | Example                   |
| --------------------- | --------------------- | ------------------------- |
| Page                  | `routes/`             | `home.tsx`                |
| Domain component      | `features/<feature>/` | `flex-container-view.tsx` |
| Domain logic or state | `features/<feature>/` | `build-flex-style.ts`     |
| Shared UI component   | `components/`         | `button.tsx`              |
| Pure utility          | `lib/`                | `cn.ts`                   |

## Theme

- File: `src/theme.css`
- Themes: `light`, `dark`. Without `data-theme`, `prefers-color-scheme`
  picks one. The values are neutral placeholders until the design (OSM-13).

## Commands

None beyond the root commands.
