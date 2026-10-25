# Osmoz

A personal project: a portfolio and the ecosystem of projects around it. It
shows who I am, the kind of projects I want to build, how I write code, and the
skills I bring.

This repo is a pnpm monorepo holding the whole ecosystem: applications in
`apps/*`, shared code in `packages/*`.

## Quick start

Node 24 and pnpm 12 (`corepack enable` picks up the pinned version).

```bash
pnpm install
pnpm dev
```

The rest of the setup: [docs/getting-started.md](docs/getting-started.md).

## Stack

|                 |                                          |
| --------------- | ---------------------------------------- |
| Language        | TypeScript 7, strict                     |
| Toolchain       | Vite+, pnpm workspaces                   |
| Lint and format | oxlint (type-aware) and oxfmt            |
| Tests           | Vitest, 100% coverage                    |
| Git             | husky, commitlint (Conventional Commits) |

The application stack is decided per project, through Linear tickets.

## Documentation

| Page                                       | What it covers                                              |
| ------------------------------------------ | ----------------------------------------------------------- |
| [Getting started](docs/getting-started.md) | Setup, commands, from a ticket to a pull request            |
| [Conventions](docs/conventions.md)         | Naming, TypeScript, React, design, tests, git, PRs, tickets |
| [CLAUDE.md](CLAUDE.md)                     | Rules for Claude Code, built on the pages above             |

Claude Code skills: `/linear-ticket <intention>` drafts a Linear ticket,
`/pull-request` drafts a pull request, `/review` reviews it against the
conventions and runs `/code-review` for bugs.
