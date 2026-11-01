# Wada-Talk-web: start here (Claude Code, Codex and people)

This repo is the website: public site (wada-talk.com), org portal (`/portal`), `/join/<code>` and Hinova's
`ops.wada-talk.com`. The Flutter app (`wada`) and the backend (`Wada Backend`) are separate repos; clone all three side by side.

1. Read `Docs/product-brief.md` (what Wada is, product and design rules).
2. Read `Docs/agent-rules.md` (never / always / what "done" means), then `Docs/work-log.md`. The current sprint and
   who owns what are at the top of `../wada/Docs/work-log.md`.
3. Before calling a backend function, read its contract in `../Wada Backend/DOC/` (`ops-api.md`, `dashboard-api.md`).
   Database or function changes happen only in the Wada Backend repo.
4. Do one Linear issue (`HDT-…`) on its own branch `<issue-or-job>/<name>` from `main`. Never commit to `main`.
5. Before finishing: `npx tsc --noEmit` and `npx eslint <changed files>` clean; update `Docs/work-log.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
