# Osmoz — agent guide

pnpm monorepo built with Vite+, TypeScript strict. Applications in `apps/*`,
shared code in `packages/*`. The human docs live in `docs/` and are imported
below: they are the single source of truth, do not restate them here.

| Topic                                                       | Full page                 |
| ----------------------------------------------------------- | ------------------------- |
| Setup, commands, ticket to PR flow                          | `docs/getting-started.md` |
| Naming, TypeScript, React, design, tests, git, PRs, tickets | `docs/conventions.md`     |
| Template of an app's `CLAUDE.md`                            | `docs/app-spec.md`        |
| Osmoz brand: logo, colors, what every app shares            | `docs/brand.md`           |

@docs/getting-started.md
@docs/conventions.md

## Rules for Claude

- Never commit to `main`. Create a branch off `main` per the conventions
  first.
- Never bypass hooks (`--no-verify`), disable a lint rule, skip a test or lower
  the coverage threshold to make a check green.
- Every `.ts` file you create or touch has its `.test.ts`. If unsure whether a
  file is an exception, say so.
- Inside `apps/<app>/`, its own `CLAUDE.md` defines the architecture. If an app
  has none, ask before choosing one.
- Work is driven by Linear tickets. A stack or architecture choice not settled
  in the ticket or the docs is not yours to make silently: ask.
- When a convention is missing or contradicts the code, flag it instead of
  inventing a rule.
- Use `/linear-ticket` for Linear tickets, `/new-app` to create an app,
  `/pull-request` for PR drafts and `/self-review` to review a branch before
  merging.

## Before you finish

- Add or update the tests for the code you touched.
- Update the page in `docs/` that describes what you changed.
- Run `pnpm validate` and report its actual output. If it fails, say so.
