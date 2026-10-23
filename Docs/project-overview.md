# Project overview

## What the site is
Wada (Wada-Talk) is an English speaking-practice app for Somali learners, built by Hinova. This repo is everything on the
web; the learner app is the Flutter app (wada repo) and the backend is Supabase (Wada Backend repo).

| Part | Where | Who uses it |
|---|---|---|
| **Public site** | `wadatalk.com`: home, students, paths, organizations, download, safety, plans, method, about, legal pages… English and Somali (`/so/...`) | Everyone |
| **Join a class** | `/join/<code>`: checks a class join code (`class_preview`) and points to the app stores | Students invited by a school |
| **Organization portal** | `/portal`: classes, students, scores for a university or company. Sign-in, then the user's `memberships` role (`teacher` / `org_admin`) decides access | Schools and companies |
| **Portal preview** | `/portal-preview`, `/school-admin/preview`: the portal with sample data, for demos (not indexed) | Sales / demos |
| **Hinova ops** | `ops.wadatalk.com` (code in `src/app/ops`): **Lessons** (plan → generate with AI → review → publish units) and **Organizations** (create universities and companies, add admins) | Hinova staff (platform admins) only |

## Who owns it
Hinova. The owner decides product, wording and anything public. Teammates (e.g. farahabdishakur) work on the public site
and the portal.

## How it is built
- **Next.js 16** (App Router, React 19, TypeScript), Tailwind 4 plus hand-written CSS in `src/app/globals.css`.
- **Supabase** through `@supabase/ssr`: browser client `src/lib/supabase/client.ts`, server client `server.ts`, session
  refresh `middleware.ts`. The site only has the URL and the **anon** key.
- **`src/proxy.ts`** (Next 16's middleware): rewrites `ops.<host>/x` to `/ops/x`, returns 404 for `/ops` on any other
  host, and refreshes the Supabase session for `/portal` and ops.
- Writes go through the backend: `/ops` calls the Edge Functions `ops-units` and `ops-orgs` (`src/lib/ops/call.ts`);
  `/portal` calls SQL functions (`portal_*`); `/join` calls `class_preview`.
- Content of the public pages lives in `src/lib/content.ts` (English and Somali).

## Decisions already made (do not reopen without the owner)
- **Ops lives on its own subdomain** `ops.wadatalk.com` (`ops.localhost:3000` locally), not `admin.` ("admin" means
  school admins). Not linked from the public site, not indexed. Gate: the user must be in `platform_admins`
  (`is_platform_admin()`). Sign-in is email + password; anyone can create an account, only platform admins get in.
- **One codebase and one deploy** for the public site, portal and ops.
- **Professional, not gamified:** no points, rankings, leagues or badges anywhere (owner, 2026-10-19).
- **Lessons:** category, then CEFR level (A1, A2, B1, B2); the AI writes units from Wada's course plan and the backend's
  word lists and grammar list (`levels-plan.md`, wada repo). The team checks the Somali by publishing.
- **The backend owns all rules:** tables, access rules, functions and AI prompts change only in the Wada Backend repo.

## Where things stand
See `work-log.md`.
