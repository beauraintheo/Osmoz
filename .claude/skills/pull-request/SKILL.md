---
name: pull-request
description: Drafts a concise pull request for the current branch — English title in commit format, French description — from the diff against its base branch and the linked Linear issues. Handles feature PRs into develop and release PRs from develop into main. Outputs text ready to paste; does not create the PR. Triggers: "create a PR", "write the PR", "fais la PR", "release", /pull-request.
argument-hint: "[extra context]"
---

# Pull request draft

Optional context: `$ARGUMENTS`.

Read the "Pull requests" section of `docs/conventions.md` first, including "Release". It defines the title and description format. Follow it strictly; this skill only describes the process.

## 1. Pick the kind of PR

`git branch --show-current`:

- `main`: stop, nothing is ever opened from `main`.
- `develop`: **release** PR, base `main`.
- anything else: **feature** PR, base `develop`.

## 2. Collect the change

1. `git fetch origin --quiet`, then, with `<base>` the base picked above:
   - `git log --oneline origin/<base>..HEAD`
   - `git diff --stat origin/<base>...HEAD`
   - `git diff origin/<base>...HEAD` (feature PR only; read the relevant parts if large)
2. `git status --short`. If there are uncommitted changes, flag them in the draft: they will not be in the PR.
3. If nothing differs from `origin/<base>`, stop and say so.

## 3. Find the Linear issues

- **Feature PR**: extract the issue ID from the branch name (`<type>/<ISSUE-ID>-<slug>`) or the commit footers (`Refs: OSM-12`). If found, `get_issue` through the Linear MCP for its title, URL and acceptance criteria. If none, leave the `## Ticket` section out and flag it.
- **Release PR**: collect every issue ID from the commit subjects, bodies and footers in the log. `get_issue` each one for its title. Flag commits that reference no issue.

## 4. Write the draft

Feature PR:

- **Title**: English, commit format. Type from the branch, scope from the workspaces touched. It describes the whole change, not the last commit.
- **Description**: French, per the conventions. "Quoi" comes from the diff, "Pourquoi" from the Linear issue or `$ARGUMENTS`.
- **Vérification**: list only what was actually run. Do not run `pnpm validate` without asking; if it was not run in this session, write `- [ ] \`pnpm validate\`` and say so.
- If the diff covers more than the issue, flag it as a scope warning.

Release PR:

- **Title**: `chore(release): <short summary>`, in English.
- **Description**: French, the `## Contenu` list from the conventions, one `Fixes <ID> — <title>` line per issue.
- Remind that it is merged with a **merge commit**, not squash.

Never invent a reason, a test or a risk that the diff, the issues or the user do not support.

## 5. Review and output

Display the draft:

````
**Base** : <develop | main>

**Titre**
<title>

**Description**
```markdown
<description>
```
````

Then add any flags (uncommitted changes, missing issue, scope warning, commits without issue) in one line each.

Apply requested changes and display it again. Do not push, and do not create the PR.
