---
name: pull-request
description: Drafts a concise pull request for the current branch into main — English title in commit format, French description — from the diff against main and the linked Linear issue. Outputs text ready to paste; does not create the PR. Triggers: "create a PR", "write the PR", "fais la PR", /pull-request.
argument-hint: "[extra context]"
---

# Pull request draft

Optional context: `$ARGUMENTS`.

Read the "Pull requests" section of `docs/conventions.md` first. It defines the title and description format. Follow it strictly; this skill only describes the process.

## 1. Check the branch

`git branch --show-current`. On `main`, stop: nothing is ever opened from `main`.

## 2. Collect the change

1. `git fetch origin --quiet`, then:
   - `git log --oneline origin/main..HEAD`
   - `git diff --stat origin/main...HEAD`
   - `git diff origin/main...HEAD` (read the relevant parts if large)
2. `git status --short`. If there are uncommitted changes, flag them in the draft: they will not be in the PR.
3. If nothing differs from `origin/main`, stop and say so.

## 3. Find the Linear issue

Extract the issue ID from the branch name (`<type>/<ISSUE-ID>-<slug>`). If found, `get_issue` through the Linear MCP for its title, URL and acceptance criteria. If none, leave the `## Ticket` section out and flag it.

## 4. Write the draft

- **Title**: English, commit format. Type from the branch, scope from the workspaces touched. It describes the whole change, not the last commit.
- **Description**: French, per the conventions. "Quoi" comes from the diff, "Pourquoi" from the Linear issue or `$ARGUMENTS`.
- **Vérification**: list only what was actually run. Do not run `pnpm validate` without asking; if it was not run in this session, write `- [ ] \`pnpm validate\`` and say so.
- If the diff covers more than the issue, flag it as a scope warning.

Never invent a reason, a test or a risk that the diff, the issue or the user do not support.

## 5. Review and output

Display the draft:

````
**Titre**
<title>

**Description**
```markdown
<description>
```
````

Then add any flags (uncommitted changes, missing issue, scope warning) in one line each.

Apply requested changes and display it again. Do not push, and do not create the PR.
