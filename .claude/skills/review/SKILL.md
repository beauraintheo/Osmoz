---
name: review
description: Reviews the current branch against the project conventions before merging, as a second reviewer would — the 👀 rules no tool enforces, the linked Linear issue's acceptance criteria, scope and docs, plus performance suggestions, and runs /code-review for bugs when the diff changes code. Reports findings with file:line, then lists every proposed fix and applies each one only after the user says yes to it. Triggers: "review my PR", "review", "relis ma PR", "challenge ma PR", /review.
argument-hint: "[focus]"
---

# Review

Optional focus: `$ARGUMENTS`.

You are the reviewer, not the author. Be skeptical: look for what is wrong or missing, not for reasons to approve. Read-only until step 6: do not edit anything before the user approves a fix, and never commit or push.

Read `docs/conventions.md` first, especially "The 👀 list". If the diff touches `apps/<app>/`, also read `apps/<app>/CLAUDE.md`.

## 1. Collect the change

`git branch --show-current`. Stop on `main`. The base is `main`.

1. `git fetch origin --quiet`, then:
   - `git log --oneline origin/<base>..HEAD`
   - `git diff --stat origin/<base>...HEAD`
   - `git diff origin/<base>...HEAD`, read in full; open the touched files when the diff lacks context
2. `git status --short`. Uncommitted changes are reviewed too, and flagged as not in the PR.
3. If nothing differs from `origin/<base>`, stop and say so.

## 2. Find the Linear issue

Extract the issue ID from the branch name (`<type>/<ISSUE-ID>-<slug>`), then `get_issue` through the Linear MCP for its acceptance criteria. If none, flag it.

## 3. Review

Check the diff against each of these, and only these:

1. **👀 rules**: every rule of "The 👀 list" and of the matching sections of `docs/conventions.md`, applied to the lines added or changed.
2. **Acceptance criteria**: for each criterion of the issue, covered, partly covered or missing, with the evidence in the diff.
3. **Scope**: changes that serve no criterion of the issue.
4. **Tests**: each touched `.ts` file has its `.test.ts`; tests check behavior; a bug fix comes with a test that fails without it.
5. **Docs**: a change of behavior, command, convention or structure without the matching update in `docs/` or a `CLAUDE.md`.
6. **Commits and PR**: Conventional Commits, English subjects.

Do not report what `pnpm validate` already enforces (🔒 rules), style preferences outside the conventions, or anything you cannot point to in the diff. If a rule is ambiguous for a case, say so instead of deciding.

### Beyond the conventions

Then one more pass on the same diff, for performance. It only produces **suggestions**, never a blocking finding or one to fix: a dependency added and its weight, a re-render that can be avoided by moving state, requests made one after another that could run in parallel, an unoptimized image or asset.

Each suggestion still needs a `path:line` and a concrete reason. Bugs belong to step 4. Duplication, simpler approaches and dead code are out of scope: recommend `/simplify` when the diff changes code.

## 4. Bugs

If the diff adds or changes a `.ts` or `.tsx` file, invoke the `code-review` skill with the Skill tool, args `medium <current branch>`. Never pass `--fix` or `--comment`: fixes go through step 6, and nothing is posted. Otherwise skip this step and say so in the report.

Keep every finding it reports, with its `path:line`, for the Bugs section. If it fails or cannot run, say so in the report instead of hunting bugs yourself.

## 5. Report

```
**Ticket** : <ID or —>

### Bloquant
- `path:line` — <what is wrong> (<rule or criterion>)

### Bugs
- `path:line` — <what is wrong> (<failure scenario>)

### À corriger
- `path:line` — <what is wrong> (<rule or criterion>)

### Suggestion
- `path:line` — <improvement> (<why>)

### Critères d'acceptation
- [x] <criterion> — <evidence>
- [ ] <criterion> — <what is missing>

**Verdict** : <prête | à corriger | bloquée>
```

- **Bloquant**: breaks a convention or a criterion in a way that must not reach `main`.
- **Bugs**: every finding of step 4, as `code-review` reported it.
- **À corriger**: a 👀 rule broken, cheap to fix.
- **Suggestion**: optional, never a rule. Every finding of the "Beyond the conventions" pass lands here.

Write in French. Drop empty sections. No finding without a `path:line` and a rule, criterion or concrete reason. If there is nothing to report, say so in one line: do not invent findings.

## 6. Fixes

1. After the report, list every fix you propose in one block, numbered in the report's order: `<n>. path:line — <the change, in one line>`. One fix per finding of Bloquant, Bugs and À corriger; a Suggestion gets one only if it is worth doing. A finding with no fix you can propose says so.
2. Then ask about the fixes one at a time, in order: show the fix, its cost and what it changes, and wait for oui or non.
3. On oui, apply that fix alone, with its tests and docs, then ask about the next one. On non, skip it and ask about the next one. If the user's answer changes the fix, apply what they decided.
4. Once every fix is answered, run `pnpm validate`, report its actual output, and recap what was applied and what was skipped.
