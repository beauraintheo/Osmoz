# Getting started

From a fresh clone to your first pull request.

## 1. Install

You need **Node 24** and **pnpm 12**. The Node version is pinned in
`.node-version` (fnm and nvm read it), pnpm in `package.json`:

```bash
corepack enable
```

Then:

```bash
pnpm install
pnpm dev
```

`pnpm install` also installs the git hooks (husky).

## 2. Everyday commands

| Command              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `pnpm dev`           | Run every workspace in dev mode                               |
| `pnpm build`         | Build every workspace                                         |
| `pnpm check`         | Format and lint (oxfmt + type-aware oxlint), without writing  |
| `pnpm check:fix`     | Same, with fixes: formatting, import order, autofixable rules |
| `pnpm check-types`   | TypeScript, in every workspace                                |
| `pnpm test`          | Unit tests, once                                              |
| `pnpm test:coverage` | Unit tests with the 100% coverage threshold                   |
| `pnpm validate`      | Everything: `check`, `check-types`, `test:coverage`           |

## 3. From a ticket to a pull request

1. **Ticket.** Every change starts from a Linear issue. `/linear-ticket` drafts
   one.
2. **Branch** off an up-to-date `main`, named after the issue:
   `feat/OSM-12-login-form`.
3. **Write the code** following [conventions.md](conventions.md).
4. **Test it**: each `.ts` file gets its `.test.ts`, coverage stays at 100%.
5. **Commit.** The `pre-commit` hook formats and lints staged files, `commit-msg`
   checks Conventional Commits.
6. **Run `pnpm validate`**, then push and open the pull request.
   `/pull-request` drafts it.
7. **Review.** At least one approval. Every comment gets a change or a reply.
8. **Merge.** Squash merge once `pnpm validate` passes, delete the branch, move the Linear
   issue to Done.

> [!IMPORTANT]
> Never disable a rule, skip a test, lower a threshold or use `--no-verify` to
> make a check green: fix the code, or say what fails in the PR.

## 4. What surprises people

- **`pnpm check` proves little.** It formats and lints, but runs no typecheck and
  no tests. Only `pnpm validate` tells you the work is done.
- **Coverage is 100%, not "high".** One uncovered branch fails `pnpm validate`.
- **`console.log`, `any`, `as` casts, `!` and default exports are rejected** by
  the linter. `console.warn` and `console.error` pass.
- **Function declarations are rejected.** Write `const f = (): T => …`.
- **`pnpm check:fix` reorders your imports.** That is expected.

## 5. Next

Read [conventions.md](conventions.md). What to work on lives in Linear.
