---
name: new-app
description: Creates a new app in apps/ on the same base as the existing ones — shared config and theme packages, the structure of a reference app, and an apps/<app>/CLAUDE.md filled from the app spec template. Asks for the app-specific choices, gets the plan approved, writes the files, runs pnpm validate. Does not commit. Triggers: "create an app", "new app", "nouvelle app", "crée un projet", /new-app.
argument-hint: "<app-name> [ISSUE-ID]"
---

# New app

Input: `$ARGUMENTS`, an app name in kebab-case, optionally followed by a Linear issue ID. If the name is missing, ask for it in a single question and stop.

Read first, and follow strictly: the "Architecture" and "Design" sections of `docs/conventions.md`, `docs/app-spec.md`, and `docs/getting-started.md`. This skill only describes the process.

## 1. Check the ground

Never run a git command that changes state. When a branch is needed, give the command (`<type>/<ISSUE-ID>-<slug>`) and let the user run it.

1. If an issue ID is given, `get_issue` through the Linear MCP and keep its acceptance criteria. If it is not found, or does not match the team prefix, say so and propose the closest one (`OMS-6` → `OSM-6`). Wait for confirmation.
2. `git branch --show-current`:
   - `develop` or `main`: stop and give the command to create the branch.
   - a branch naming another issue than the given one: stop. The app would land in that issue's pull request.
   - a branch with no issue while an issue is given: flag it and wait for confirmation.
3. `git status --short`. If there are uncommitted changes, stop: they belong to another piece of work. Ask the user to commit them first.
4. `apps/<app-name>` must not exist. If it does, stop and say so.

## 2. Find the base

The base is what already exists, never what this skill imagines.

1. **Shared packages**: read every `packages/*/package.json` and its `exports`. The new app consumes them by subpath, never by copy.
2. **Reference app**: list `apps/*`. With one app, it is the reference. With several, propose the closest one to the intention and let the user confirm. Read its `CLAUDE.md`, `package.json`, config files and the tree of `src/`.
3. **No app yet**: say so. The plan of step 4 is then built only from the shared packages and `docs/`, and every choice they do not settle is a question of step 3.

## 3. Ask what is specific

One grouped question, only for what the issue, the reference app and `docs/` do not answer:

- what the app does, in one sentence;
- libraries it adds beyond the base, and why;
- its themes;
- any departure from the reference app's architecture.

A stack or architecture choice is never made silently.

## 4. Get the plan approved

Show, then wait:

```
App : apps/<app-name> (@osmoz/<app-name>)
Référence : apps/<reference> | aucune
Paquets partagés : <list>

<tree of every file to create>

Écarts avec la référence : <list or —>
```

End with: "Je crée l'app ? (ou indique les modifications)". Create nothing without explicit approval.

## 5. Create

- Take the reference app's config files and replace its name. Keep its structure, drop its features: `src/` holds only the entry point and a minimal root component.
- Import the shared packages by subpath, as the reference app does. Declare in the app only what is its own (`@theme` values, theme file).
- Write `apps/<app-name>/CLAUDE.md` from the template of `docs/app-spec.md`, every section filled with the approved choices.
- Every `.ts` and `.tsx` file gets its test. No comments.

## 6. Verify

1. `pnpm install`, then `pnpm check:fix`.
2. `pnpm validate`. Report its actual output. If it fails, fix the code, never the check, and say what was fixed.
3. If an issue was given, list each acceptance criterion as covered or not, with the evidence.

Then stop. Do not commit: suggest a Conventional Commits message with the issue in the footer, and let the user commit.
