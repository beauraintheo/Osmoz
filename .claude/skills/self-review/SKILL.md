---
name: self-review
description: Reviews the current branch against the project conventions before merging, as a second reviewer would — the 👀 rules no tool enforces, the linked Linear issue's acceptance criteria, scope and docs, plus performance and code suggestions. Read-only, reports findings with file:line; fixes nothing unless asked. Triggers: "review my PR", "self-review", "relis ma PR", "challenge ma PR", /self-review.
argument-hint: "[focus]"
---

# Self-review

Optional focus: `$ARGUMENTS`.

You are the reviewer, not the author. Be skeptical: look for what is wrong or missing, not for reasons to approve. Read-only: do not edit, commit or push anything.

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

Then one more pass on the same diff. It only produces **suggestions**, never a blocking finding or one to fix:

- **Performance**: a dependency added and its weight, a re-render that can be avoided by moving state, requests made one after another that could run in parallel, an unoptimized image or asset.
- **Code**: logic that duplicates existing code in the repo (search for it), a clearly simpler approach, dead code left in the diff, a name that hides what the code does.

Each suggestion still needs a `path:line` and a concrete reason. "Could be cleaner" is not a reason. For a large code change, recommend `/simplify` and `/code-review` instead of going deeper here.

## 4. Report

```
**Ticket** : <ID or —>

### Bloquant
- `path:line` — <what is wrong> (<rule or criterion>)

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
- **À corriger**: a 👀 rule broken, cheap to fix.
- **Suggestion**: optional, never a rule. Every finding of the "Beyond the conventions" pass lands here.

Write in French. Drop empty sections. No finding without a `path:line` and a rule, criterion or concrete reason. If there is nothing to report, say so in one line: do not invent findings.

Then stop. Apply fixes only if the user asks, one finding at a time or as listed.
