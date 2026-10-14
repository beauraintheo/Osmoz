---
name: linear-ticket
description: Turns an intention (a sentence, an idea, an observed bug) into a concise, correct Linear ticket written in French. Drafts it, gets it approved, then creates it through the Linear MCP using existing labels only. Triggers: "create a ticket", "Linear ticket", "open an issue", "crée un ticket", /linear-ticket.
argument-hint: <intention>
---

# Linear ticket from an intention

Input: `$ARGUMENTS`. If empty, ask for the intention in a single question and stop.

Read the "Tickets" section of `docs/conventions.md` first. It defines the type, title, description, labels and priority rules. Follow it strictly; this skill only describes the process.

## 1. Understand the intention

Classify the intention by type. If an essential piece of information is missing and cannot be inferred (e.g. a bug with no observed behavior), ask **one** grouped question. Never ask for what can be inferred or is optional.

## 2. Fetch Linear context

Using the Linear MCP tools:

1. `list_teams` — pick the team inferred from the intention. If there is only one, use it. If ambiguous, propose one in the draft and flag it.
2. `list_issue_labels` with `team` — keep only non-retired labels (no `retiredAt`) that are not groups.
3. If the intention mentions a project: `list_projects` to find its exact name. Otherwise, set no project.

## 3. Pick labels

- Only from the existing labels fetched. **Never create a label** (`create_issue_label` and `save_issue_label` are forbidden).
- If a useful label does not exist, mention it in the draft under "Labels manquants" without applying it.

## 4. Get approval

Display the draft like this, then wait:

```
Équipe : <team>
Projet : <project or —>
Labels : <labels>
Priorité : <priority or —>
Labels manquants : <if any>

# <Title>

<Description>
```

End with: "Je crée le ticket ? (ou indique les modifications)".

Apply any requested changes and display the draft again. Create nothing without explicit approval.

## 5. Create

After approval: `save_issue` with `team`, `title`, `description`, `labels`, and `project` / `priority` only when set. Do not pass `id`.

Reply only with the identifier and link of the created ticket. On error, show the returned message and do not retry in a loop.
