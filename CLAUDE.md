@AGENTS.md

# CLAUDE.md — Wada-Talk-web (Next.js)

The Wada website: the public site (wada-talk.com, English + Somali), class join links (`/join/<code>`), the organization
portal (`/portal`) and Hinova's internal site (`ops.wada-talk.com`: Lessons and Organizations). The learner app is the
**wada** repo (Flutter) and the backend is the **Wada Backend** repo (Supabase); both sit next to this folder.

## Start every session here
1. Read `Docs/agent-rules.md` (what you must never / always do), `Docs/work-log.md` (what is done, what is next), then
   the doc for your area. Index: `Docs/README.md`. Before writing Next.js code, read the guide in `node_modules/next/dist/docs/` (`AGENTS.md`).
2. Do **one** step. Use the branch you were given, otherwise `<job>/fox` from `main`. Never commit to `main`.
3. Before finishing, update `Docs/work-log.md` (entry at the top, status table, "Needs the owner").

## Stack
Next.js 16 (App Router, `src/proxy.ts` is the middleware) · React 19 · TypeScript · Tailwind 4 + `src/app/globals.css` ·
`@supabase/ssr` + `@supabase/supabase-js` · `qrcode`. Add a package only in the step that needs it.

## Code rules
- The site holds only the Supabase URL and **anon** key (`NEXT_PUBLIC_*` in `.env.local`). **Never** a service-role key or an AI key.
- Writes go through the backend's Edge Functions / SQL functions (`src/lib/ops/call.ts` for ops). Database rules, tables,
  functions and AI prompts change **only** in the Wada Backend repo, with its contracts in `DOC/` (`ops-api.md`, `dashboard-api.md`).
- `/ops` pages: `opsGate()` first, served only on the ops subdomain (`src/proxy.ts`), never indexed.
- Every page handles loading, error (with retry) and empty. Show readable messages, never raw errors.
- Match each file's existing style (compact one-liners in `content.ts` / `pages.tsx`, normal TypeScript in `ops/`).
- Before finishing: `npx tsc --noEmit` clean and `npx eslint <changed files>` clean; `npm run build` for routing or config changes.

## Run
```
cp .env.example .env.local   # then put the Supabase URL + anon key in it
npm install
npm run dev                  # localhost:3000; ops on ops.localhost:3000
```
