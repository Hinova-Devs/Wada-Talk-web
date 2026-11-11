# Development workflow

## One-time setup
| Tool | Version | For |
|---|---|---|
| Node | 20.9 or newer | Next.js 16 |
| npm | comes with Node | packages (`package-lock.json` is committed) |
| Supabase CLI | current | only for backend work, which happens in the Wada Backend repo |

1. `npm install`
2. `cp .env.example .env.local`, then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase →
   Project Settings → API). **Never commit `.env.local` and never paste keys into chat.** Without them, the public site
   works and `/portal` and ops send you to the sign-in page.

## Daily commands
| Do this | Run |
|---|---|
| Run the site | `npm run dev` → public site on `http://localhost:3000` |
| Open ops locally | `http://ops.localhost:3000` (works in Chrome/Edge without any hosts-file change) |
| Type check | `npx tsc --noEmit` |
| Lint the files you changed | `npx eslint src/path/to/file.tsx …` |
| Production build | `npm run build` |

## Env (`.env.local`; all are public, sent to browsers)
| Name | What |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The Supabase project (dev or pilot) |
| `NEXT_PUBLIC_SITE_URL` | The site's own URL, for links, sitemap and Open Graph |
| `ALLOW_PORTAL_PREVIEW` | Server-only. `1` lets a production build serve `/portal-preview` (sample data); unset = 404. Dev is always open |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact address on the public pages |
| `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL` | Store buttons (download page, join page) |
Never add a non-`NEXT_PUBLIC_` secret here for use in pages: the site holds no secrets.

## Sign-in on ops (owner setup, once per person)
1. Create an account on the ops site (email + password).
2. In the Supabase SQL editor: `insert into public.platform_admins (user_id) select id from auth.users where email = '<their email>';`
3. Supabase → Auth → URL configuration: add `https://ops.wada-talk.com/auth/callback` and `http://ops.localhost:3000/auth/callback` to Redirect URLs.

## Backend changes the site needs
The site never changes the database. If a page needs a new column, function or rule: make that change in the
**Wada Backend** repo (migration, Edge Function, tests, `DOC/` contract), deploy it, **then** ship the page. Ship order
matters: a page that reads a column the database does not have yet shows "Could not load".

## Deploy
- One deploy serves `wada-talk.com` and `ops.wada-talk.com` (the ops subdomain must be added to the host and to DNS).
- The hosting setup is not recorded in this repo yet: ask the owner, then write it here (host, project, how a merge to `main` deploys, where env is set).

## Tasks live in Linear
- Team **Hinova**, project **Wada App** (key `HDT`). Find the issue before you start; move it to In Progress, then In Review with a short comment (done / verified / **not** verified). Done only when merged and working where it matters (deployed, tried signed in).
- Never put secrets or users' data in a Linear issue or comment.

## Branches and pull requests
- Three repos (`Wada-Talk-web`, `wada`, `Wada Backend`). A change that touches more than one needs a branch in each.
- One job per branch: use the branch you were given, otherwise `<job>/fox` from `main`. Never commit to `main`.
- Small commits. Push the branch. Open a pull request only when asked; say in it what must be deployed first.
- Before you push: the checks in `agent-rules.md` ("Verification") pass and `work-log.md` is updated.

## Definition of done
The step works as described · types and lint clean · tried in the browser (or "not tried" written down) · docs and work
log updated · nothing secret committed.
