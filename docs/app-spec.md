# App spec

Every app has a technical spec in `apps/<app>/CLAUDE.md`. Claude Code loads it
when working in that app, and it is the first page a human reads there.

It describes only what is specific to the app. What `docs/` already says is
never repeated: link to it, or leave it out.

## Required sections

| Section           | Answers                                                     |
| ----------------- | ----------------------------------------------------------- |
| Stack             | Which libraries the app adds, and why. No versions.         |
| Structure         | What each folder of `src/` holds, one line each.            |
| Layers            | Which folder may import which. What is forbidden.           |
| Where a file goes | For each kind of file, its folder and an example name.      |
| Theme             | Where the theme file is, which themes ship.                 |
| Commands          | Commands specific to the app. Root commands are not listed. |

A section that does not apply says so in one line rather than disappearing:
the reader then knows it was considered.

## Template

Copy it to `apps/<app>/CLAUDE.md` and replace every `<…>`. `/new-app` in
Claude Code creates the app and fills it.

````markdown
# <App name>

<What the app does, in one sentence.>

## Stack

- <library>: <why this app needs it>

## Structure

```
src/
  <folder>/   <what it holds>
```

## Layers

- `<folder>` may import `<folder>`, never `<folder>`.

## Where a file goes

| Kind of file | Folder     | Example       |
| ------------ | ---------- | ------------- |
| <kind>       | `<folder>` | `<file-name>` |

## Theme

- File: `<path>`
- Themes: `<name>`, …

## Commands

None beyond the root commands.
````
