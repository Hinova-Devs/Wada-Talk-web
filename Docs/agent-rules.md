# Rules for AI agents (and for people using them)

Read this file first, every session. It is short on purpose. Then read `work-log.md` (what is done and what is next) and
the doc for the area you are touching.

## Start of a session
0. **Find the Linear issue** for what you are about to do (team Hinova, project Wada App, IDs like `HDT-27`). Do not create a duplicate. Move it to In Progress, and when you finish move it to In Review with a short comment (done / verified / **not** verified).
1. Read `product-brief.md` (product and design rules), `README.md` (this folder), `work-log.md`, and the doc for your area. **Before writing Next.js code, read the guide for what you touch in `node_modules/next/dist/docs/`**: this is Next.js 16 and it differs from older versions (see `AGENTS.md`).
2. Do **one** step. Name it in your first message. If the request is unclear or is a big decision (a new service, a new package, a new page or subdomain, a change to a decision in `project-overview.md`), **ask the owner first**.
3. Use the branch you were given. Otherwise create `<job>/fox` from `main`. **Never commit to `main`.**

## Never do (hard rules)
- **Never put a secret in the repo, in a doc, in a commit or in chat.** The site only ever has the Supabase URL and the **anon** key (`NEXT_PUBLIC_*` in `.env.local`, gitignored). Never a service-role key, an AI key or a LiveKit secret: anything `NEXT_PUBLIC_` is sent to every browser.
- **Never write to the database from the browser except through the backend's Edge Functions or SQL functions** (`ops-units`, `ops-orgs`, the `portal_*` / dashboard functions). Reading is fine where Row Level Security allows it. New database rules, tables or functions belong in the Wada Backend repo, not here.
- **Never show a raw error to a user.** Show the backend's `message` (see `src/lib/ops/call.ts`) or a plain sentence.
- **Never let `/ops` pages be reached outside the ops subdomain** or without `opsGate()` (`src/lib/ops/gate.ts`). `src/proxy.ts` returns 404 for `/ops` on every other host: keep it that way.
- **Never index private pages.** `/ops`, `/portal`, `/join`, previews: `robots: { index: false }`, and keep them out of `sitemap.ts`.
- **Never touch the old Fariid / Loola backend or app**, unless the owner says so for one specific thing.
- **Never commit `package-lock.json` changes you did not cause on purpose** (the owner's local copy often differs; leave it unstaged).
- **Never add a package "for later".** Add it in the step that needs it, and say why.
- **Never invent content presented as real** (testimonials, numbers, school names, Somali text). Mark drafts as drafts.
- **Never claim something works if you did not run it.** Say what you ran and what you could not (see "Verification").
- Do not push or merge unless asked. Do not create a pull request unless asked.

## Always do
- **Follow the backend contract.** Before calling a function, read its contract in the Wada Backend repo (`DOC/ops-api.md`, `DOC/dashboard-api.md`). If the site needs a change there, it is a backend step first; say so.
- **Every page handles loading, error (with retry) and empty.**
- **Accessibility basics:** labels on every input, real buttons and links, `role="alert"` / `role="status"` on messages, readable at phone width.
- **Match the file's style.** Some files are compact one-liners (`content.ts`, `pages.tsx`), the ops files are normal multi-line TypeScript. Keep each file in its own style.
- **Mark stand-ins** with a `// ponytail:` comment saying what is fake and what replaces it.
- **Small, reversible commits** with a clear message. Do not mix a refactor with a feature.
- **Update the docs in the same change** (this folder; the backend contract if you changed one there).
- **Update `work-log.md` before you finish** (entry at the top, status table, "Needs the owner", gotchas).

## Verification (what "done" means)
| Check | Must pass |
|---|---|
| Types | `npx tsc --noEmit` (no errors) |
| Lint | `npx eslint <the files you changed>` clean. (`npm run lint` over the whole repo has old errors in files you did not touch; do not add new ones) |
| Build, for routing / config / layout changes | `npm run build` |
| In the browser | open the page with `npm run dev` (`localhost:3000`, ops on `ops.localhost:3000`). Pages behind a sign-in need the owner's account: say so if you could not open them |
In your final message and in the work log say plainly: **what you ran, what passed, and what you could not verify**
(for example "not tried signed in", "not deployed", "backend function not deployed yet").

## What to ask the owner about
New services or paid accounts · new pages, subdomains or domains · changes to a decision in `project-overview.md` ·
anything about real users' or schools' data · public wording, prices, legal pages, Somali text · deleting data or files
you did not create.

## Where to find things
| Question | File |
|---|---|
| What the site is, what is decided | `project-overview.md` |
| Where code goes, naming, style | `project-structure.md` |
| Commands, env, local subdomains, deploy, branches | `development-workflow.md` |
| What is done, what is next, what the owner must do | `work-log.md` |
| What `ops-units` / `ops-orgs` accept and answer | `DOC/ops-api.md` (Wada Backend repo) |
| What the organization functions accept and answer | `DOC/dashboard-api.md` (Wada Backend repo) |
| Tables and access rules | `DOC/data-model.md` (Wada Backend repo) |
| Lesson plans (levels, sources, admin lessons) | `Docs/levels-plan.md`, `Docs/admin-lessons-plan.md` (wada repo) |
