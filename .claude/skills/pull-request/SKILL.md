---
name: pull-request
description: Drafts a concise pull request for the current branch — English title in commit format, French description — from the diff against main and the linked Linear issue. Outputs text ready to paste; does not create the PR. Triggers: "create a PR", "write the PR", "fais la PR", /pull-request.
argument-hint: "[extra context]"
---

# Pull request draft

Optional context: `$ARGUMENTS`.

Read the "Pull requests" section of `docs/conventions.md` first. It defines the title and description format. Follow it strictly; this skill only describes the process.

## 1. Collect the change

1. `git branch --show-current`. If on `main`, stop and say a branch is required.
2. `git fetch origin main --quiet`, then:
   - `git log --oneline origin/main..HEAD`
   - `git diff --stat origin/main...HEAD`
   - `git diff origin/main...HEAD` (read the relevant parts if large)
3. `git status --short`. If there are uncommitted changes, flag them in the draft: they will not be in the PR.
4. If nothing differs from `origin/main`, stop and say so.

## 2. Find the Linear issue

Extract the issue ID from the branch name (`<type>/<ISSUE-ID>-<slug>`) or the commit footers (`Refs: OSM-12`).

If found, `get_issue` through the Linear MCP to get its title, URL and acceptance criteria. If none, leave the `## Ticket` section out and flag it.

## 3. Write the draft

- **Title**: English, commit format. Type from the branch, scope from the workspaces touched. It describes the whole change, not the last commit.
- **Description**: French, per the conventions. "Quoi" comes from the diff, "Pourquoi" from the Linear issue or `$ARGUMENTS`.
- **Vérification**: list only what was actually run. Do not run `pnpm validate` without asking; if it was not run in this session, write `- [ ] \`pnpm validate\`` and say so.
- If the diff covers more than the issue, flag it as a scope warning.

Never invent a reason, a test or a risk that the diff, the issue or the user does not support.

## 4. Review and output

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
