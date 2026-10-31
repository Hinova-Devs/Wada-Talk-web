# Wada-Talk-web docs

Read these before you change anything. They are written for the team **and** for the AI agents that work on the site.

This repo is the **website**: the public site (wada-talk.com), the organization portal (`/portal`), class join links
(`/join/<code>`) and Hinova's internal site (`ops.wada-talk.com`). Two other repos sit next to it on the owner's Desktop:

| Repo (folder) | GitHub | What |
|---|---|---|
| `Wada-Talk-web` (this one) | `Hinova-Devs/Wada-Talk-web` | Next.js website, portal, ops |
| `wada` | `Hinova-Devs/Wada-Talk` | Flutter app for learners. Its `Docs/` hold the product plans (levels, pilot, admin lessons, orgs) |
| `Wada Backend` | `Hinova-Devs/wada-backend` | Supabase (database, Edge Functions) + worker. Its `DOC/` hold the API contracts this site calls |

| File | What it tells you |
|---|---|
| [`product-brief.md`](product-brief.md) | **Everyone: read first.** What Wada is, product and design rules, the three repos (same file in all three) |
| [`agent-rules.md`](agent-rules.md) | **AI agents: read first.** What you must never do, what you must always do, what "done" means |
| [`project-overview.md`](project-overview.md) | What the site is, its parts, how it is built, the decisions already made |
| [`project-structure.md`](project-structure.md) | Where every kind of code lives, naming, code style |
| [`development-workflow.md`](development-workflow.md) | Setup, commands, env, local subdomains, deploys, branches, tests |
| [`work-log.md`](work-log.md) | **What is done, what is next, what the owner must do.** Updated every session |

Contracts this site depends on (in the **Wada Backend** repo, `DOC/`): `ops-api.md` (`ops-units`, `ops-orgs`, used by
`/ops`), `dashboard-api.md` (organization functions, used by `/portal`), `data-model.md`, `authentication.md`.
Product plans (in the **wada** repo, `Docs/`): `admin-lessons-plan.md`, `levels-plan.md`, `org-kind-plan.md`, `pilot-plan.md`.

**Tasks:** Linear, team Hinova, project Wada App (`HDT-…`).

## Reading order
- **New teammate:** product-brief → overview → structure → development-workflow → work-log.
- **AI agent:** product-brief → agent-rules → work-log → the doc for your area (and the backend contract for any function you call).

## Keeping the docs true
- A doc that is wrong is worse than no doc. If you change behaviour, change the doc in the same commit.
- `work-log.md` is the one file that must be updated at the end of **every** session.
- No secrets in docs. No code dumps; link to the file instead.
