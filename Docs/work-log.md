# Work log

**The living record of this repo.** Humans and AI agents read this to know what is done, what is half-done, and what is waiting on someone.
**Every session must update it before finishing:** (1) add an entry at the top of "Log" (newest first), (2) update the status table, (3) add anything the owner must do to "Needs the owner", (4) add any gotcha to "Decisions & gotchas".
Keep it short and factual. No code, no secrets. Backend and app work is logged in the wada repo's `Docs/work-log.md`.

Legend: ✅ done and verified · 🟡 code done, someone must verify or do a manual step · 🔄 in progress · ⏳ not started · ⛔ blocked

**Current sprint (2026-10-26 → 27) and who owns what:** top of `../wada/Docs/work-log.md`. Web dev owns this repo; backend contract changes go to fox.

## Status
| Area | Status |
|---|---|
| Public site (EN + SO pages, home, students, organizations, safety, legal) | 🟡 built; content partly draft |
| Join a class (`/join/<code>`) | 🟡 checks only the shape of the code and points to the app (no backend preview function exists); looked at with curl, not in a browser |
| Organization portal (`/portal`) + previews | 🟡 now reads and writes through the backend's `my_orgs` / `org_*` / `class_*` functions (`design/wada-app-look`); tsc + lint clean, previews checked in the browser; **not tried signed in** against the Wad project |
| Site look | 🟡 matched Flutter main `868e8b7` (2026-11-04): orange, warm cream / brown, teal progress, violet icons; branch `theme/app-match`; light/dark and phone-width browser checks; not deployed |
| School admin | removed (`/school-admin`, its CSS and the "School" type); university admin (`/portal`) stays |
| Ops: sign-in, admin gate, subdomain (O2) | 🟡 merged; `ops.wada-talk.com` DNS / host setup not done |
| Ops: Lessons plan + unit editor (O3) | ✅ merged; used by the owner against the dev project |
| Ops: Organizations (K2) | 🟡 merged into `o3/fox` after O3 had gone to `main`; reached `main` through P0 (#7) |
| Ops: CEFR levels A1–B2 (levels plan P0) | ✅ merged (#7) and deployed with the backend |
| Ops: words and grammar per unit (P1b) + "Stopped / Try again" for stuck generations | 🟡 PR #8 (`p1b/fox`) open; tsc + lint clean; not tried signed in |
| Ops: Overview, Staff directory (teachers, finance), Finance (ops roles) | 🟡 branch `ops-finance-staff/claude`; tsc + eslint clean on `src/app/ops`, `components/ops`, `lib/ops`; **not run against a database** (backend migration `20261104100000` untested, no pgTAP written) |
| Ops: Affiliates (payout requests, referrers, pilot date, test payment) + `/r/<code>` invite page | 🟡 branch `affiliates/claude`; eslint + tsc clean; not tried signed in; backend migration `20261104110000` not applied or tested |
| Docs (this folder) | 🟡 first version on `web-docs/fox` |

## Needs the owner
- [ ] Review and merge `theme/app-match` to release the orange app theme; this branch is not deployed.
- [ ] **Ops roles:** merge wada-backend branch `ops-staff-finance/claude`, then `supabase db push` and `supabase functions deploy ops-units`. Then add teachers in Ops → Staff (they sign up on the ops page first). Teachers plan/generate; only super admins publish.
- [ ] **Merge PR #8** (`p1b/fox`) after the backend generation fix (wada-backend #8) is merged and `ops-units` is deployed.
- [ ] **ops subdomain:** DNS record for `ops.wada-talk.com`, add the domain in the host, and add `https://ops.wada-talk.com/auth/callback` (and `http://ops.localhost:3000/auth/callback`) to Supabase Auth → Redirect URLs.
- [ ] **Ops access:** each founder creates an account on the ops site, then is added to `platform_admins` (see `development-workflow.md`).
- [ ] **Go live on `wada-talk.com`:** see README → "Going live" (env, DNS for both domains, Supabase Site URL + Redirect URLs for `wada-talk.com` and `ops.wada-talk.com`, contact mailbox).
- [ ] **Write down the hosting:** which host serves the site, how `main` deploys, where env is set (`development-workflow.md` → Deploy).
- [ ] **Portal sign-in (Wad project):** add `http://localhost:3000/auth/callback` (and the real site's `/auth/callback`) to Supabase Auth → Redirect URLs. Today only `http://localhost:3000` is listed, so the email link never reaches the callback. Then sign in once with an invited staff email and try Overview, Classes and Students.
- [ ] **`/join/<code>` class name:** the page used to call `class_preview`, which exists nowhere (and made every real code say "invalid or expired"). It now shows the code and sends the learner to the app. If the page should show the class and organization name before sign-in, the backend needs a public preview function (owner decision; it would reveal class names to anyone with a code).
- [ ] **Repo vs live backend:** `institution_portal`, `class_code_rotation`, `university_operations` (and the company ones) are `;` stubs in wada-backend; their SQL exists only on the live project (`university_operations`, `org_live_talk_hours`, `org_portal_profile`, `record_portal_login`…). The portal does not use those yet. Commit the real SQL to the backend repo.
- [ ] **Score scale:** the portal assumes `latest_score` / `avg_score` are 0–100 (skills 0–20 are shown ×5 as %). Confirm in `dashboard-api.md`.

## Decisions & gotchas
- **Next.js 16:** `src/proxy.ts` is the middleware (renamed from `middleware.ts`). Read `node_modules/next/dist/docs/` before writing Next code; `next dev` re-writes the Next block in `AGENTS.md`.
- **Ops is subdomain-only:** `/ops/...` on the main host is a 404 on purpose. Locally use `ops.localhost:3000`. Links inside ops leave out `/ops`.
- **Ship order with the backend:** a page that reads new columns must deploy after the backend migration (P1b read `target_words`, `grammar`, `word_warnings`; before `db push` the Lessons list said "Could not load the plan").
- **Stacked PRs:** a PR based on another feature branch merges into that branch, not `main` (K2 #6 merged into `o3/fox` 26 s after O3 went to `main`, so K2 missed `main`). Base PRs on `main`, or check the base before merging.
- **`package-lock.json`** differs on the owner's machine: leave it unstaged unless a package change is the point.
- **Lint:** `npm run lint` over the whole repo reports old errors in files not touched recently; check only the files you change.
- **Portal functions:** the portal now follows the backend contract (`DOC/dashboard-api.md`); the web role label `org_admin` is only the UI name for the backend role `admin`. `src/lib/portal/backend.ts` is the one place that maps backend answers to what the dashboard shows. No Live Talk hours, group discussions, safety reports or settings: the backend has no data for them.
- **Join codes** are shown only once, when created (`new_join_code`); the portal keeps them in page state only.
- **Preview data** lives in `src/app/portal-preview/page.tsx` in the same shape `loadPortal` returns; `?role=teacher` shows the teacher view. Previews need `NEXT_PUBLIC_SUPABASE_*` set (any values) or the proxy redirects `/portal*` to `/login`.

## Log (newest first)

### 2026-11-10 — HDT-69 + HDT-66: gate portal-preview, SEO pass (branch `seo-gate/claude`)
- `/portal-preview` now 404s in production builds unless `ALLOW_PORTAL_PREVIEW=1`; dev unchanged. `/university-admin` (+`/preview`) removed: nothing linked to it.
- SEO: public pages now set `openGraph` (title, description, url, image) in `[...slug]/page.tsx`; `robots.ts` also disallows `/so/login`. Sitemap, canonical base (`NEXT_PUBLIC_SITE_URL`, wada-talk.com at go-live) and OG image were already fine.

### 2026-11-04 — Match the current Flutter app theme (`theme/app-match`)
- Source is actual Flutter `main` commit `868e8b7432ea68a133fad2574ff04499d6abd4cc` (app-colours PR #36), `lib/core/theme/app_theme.dart` and `lib/core/widgets/widgets.dart`, rather than the older cyan docs.
- Orange `#F26B1D`, dark orange actions `#D9480F`, warm cream `#F4EEE8`, dark surface `#2A2421`; teal progress and violet icon tiles. Shared CSS tokens cover public pages, portal and ops; inline marketing styles, previews, QR and social image updated. Raised cards use paired shadows, fields use inset shadows, buttons press to 0.97.
- Verified: TypeScript, production build; browser home, safety, organization page; light/dark toggle and no horizontal overflow at desktop and 390px on checked pages. ESLint reports the same 153 existing `react-hooks/refs` errors in HomeDesign and existing warnings; other changed TS/TSX files have no errors.
- Not verified: signed-in portal/ops, live deployment. No backend or auth behavior changed.

### 2026-11-04 — Ops: Affiliates
- New Ops → Affiliates page (super admin): payout requests with Mark paid (writes a Finance payout), referrers table, pilot date + minimum payout, and a "Record $3 payment" test button until the gateway is connected. `/r/<code>` is the page the app's affiliate link opens (shows the code and the store buttons). Contract: `DOC/ops-api.md` section 9 in wada-backend. Depends on the ops roles PR (#15 / wada-backend #22).

### 2026-11-04 — Ops: Overview, Staff, Finance
- `/ops` menu now follows `ops_role()` (super admin, teacher, finance): Overview (super admin home: units by status, orgs, team, month income, recent activity), Lessons (super admin + teacher; teachers don't see Publish), Organizations, **Staff** (directory of teachers/finance with planned/generated counts, pay per unit, owed, Pay and Remove), **Finance** (monthly income/expense/payout entries, net). Contract: `DOC/ops-api.md` section 8 in wada-backend.
- Teacher pay: owed = units generated × rate minus payouts to that email; "Pay" writes a payout to Finance.

### 2026-11-01 — Fox removed from the site (not committed yet)
- The fox mascot is gone everywhere it was used as an image (header, footer, login, join cards, home/organizations/safety heroes, 404, download page, press kit); logos now show just the word "wada". Small chat avatars became a blue "w" circle; the home hero ring shows a faint "wada". The press kit offers the new W icon (`public/assets/wada-icon.png`). The fox files stay in `public/assets/` unused.

### 2026-11-01 — About page: team section (not committed yet)
- About page: the five new sections are cards (`.about-cards`), and a new "Our team" grid (`src/components/team.tsx`, photos in `public/team/*.webp`, cropped 4:5) lists the Chancellor, Academic Advisor, CEO, CTO, COO, CMO and Head of Learning with the names the owner gave.
- Needs the owner: the CMO name is not set yet (card shows the role only); names and roles to be confirmed before launch.

### 2026-11-01 — new app icon (not committed yet)
- New icon: a "W" made of two overlapping strokes (two people together) with a dot above. Master files and the render script are in `brand/` (`wada-icon.svg`, `wada-icon-1024.png` for the app stores). The site now uses it as `src/app/icon.svg`, `apple-icon.png` and `favicon.ico`; `icons:` was removed from `layout.tsx`.
- The fox stays as the in-page mascot and in the header/footer/join logos. The Flutter app (`Wada-Talk`) was not touched: its launcher icons must be generated from `brand/wada-icon-1024.png` there.
- Concept 3 (not installed): two overlapping speech bubbles, cyan and coral, overlap = "together" with a typing-dots mark, on dark navy. Files in `brand/concept-3/`. The site still uses concept 2 (the W) until the owner picks.
- Concept 5 (not installed): a speech bubble holding a voice waveform that runs from cyan to coral (two voices becoming one), on the app blue. Files in `brand/concept-5/`. (A tree concept was tried and dropped: it looked like a mushroom cloud.)
- Concept 6 "Dawn" for the Somaliland Tech Expo (not installed): a sunrise whose rings are also sound/signal waves, on deep navy. Files in `brand/expo/` (`dawn.svg`, `dawn-1024.png`).
- Concept 6b "Dawn, together" (not installed): the same sunrise with two people in front of the sun, so the meaning reads without explanation (two people talking together at a new dawn). `brand/expo/dawn-together.svg` / `-1024.png`.
- Concept 7 "Hi" (not installed): a soft-3D blue speech bubble with a big white "Hi" (the i-dot is gold, with a sparkle) on warm sand. Self-explanatory: say hi in English. `brand/round3/hi.svg` / `hi-1024.png`.
- Concept 3b "Together, world" (not installed): the owner picked concept 3 and asked for an international version: the overlap of the two bubbles now holds a globe (two voices, one world). `brand/concept-3/wada-icon-world.svg` / `-1024.png`.
- Concept 3c "Together, glass" (not installed): the owner asked to advance the *form* of concept 3: same idea, now as glossy glass (rim light, soft highlights, coloured glow, luminous lens, gradient globe). `brand/v2/wada-icon-glass.svg` / `-1024.png`.

## 2026-10-31 — Site restyle, school admin removed, portal on the real backend (`design/wada-app-look`)
- Restyled the site and the portal/ops dashboards to the Wada app look (colours, Plus Jakarta Sans, neumorphic cards, inset fields). Removed the school admin (route, component, CSS, "School" in the demo form and copy).
- Portal: replaced the `portal_*` calls with the backend's functions (reads in `src/lib/portal/backend.ts`; writes `create_class`, `update_class`, `new_join_code`, `revoke_join_code`, `set_staff_role`, `invite-staff`). Roles come from `my_orgs()`. Removed sections without backend data; Export is a CSV built in the browser.
- Public pages audit (27 URLs incl. `/so`, at 375 px and 1280 px, in a browser): no horizontal overflow, no broken images, no error pages. A contrast sweep found blue text `#0B7DB3` on `#E6ECF3` at 3.8:1 and grey text at 2–3:1; blue text is now `#0A6C99` (4.9:1) and the greys `#5B6778`. After the fix 0 failing text nodes on 14 public and portal-preview pages (WCAG AA, 4.5:1 / 3:1 for large text). The ops sign-in page and the signed-in ops pages were not swept.
- Join page: removed the `class_preview` call (no such function), so real codes are no longer called "invalid or expired"; bad shapes still are. "Enter a code" links to `/download`, where the code form lives.
- Sign-in fallback in `src/proxy.ts`: `/?code=…` is passed to `/auth/callback`, because the Wad project allows only `http://localhost:3000` as a redirect URL. Checked with curl (redirect, and a bad code goes to `/login?error=invalid-link`); a real email link was not sent.
- Dark mode: colours moved to CSS variables in `globals.css` (light values unchanged, dark values from the app's palette); Auto / Light / Dark button in the header and the portal top bar (`theme-toggle.tsx`), saved in `localStorage`, applied by a script in `layout.tsx`. Contrast sweep (WCAG AA) over 27 public and portal-preview pages in dark and in light: 0 failing text nodes. `tsc` clean and `npm run build` passes; `HomeDesign.tsx` has 155 old lint errors that are the same on `main`. Not checked: signed-in portal and ops pages in dark, the Somali text length in dark, the `opengraph-image` (kept light on purpose).
- Domain: visible links and docs say `wada-talk.com` / `ops.wada-talk.com` (was `wadatalk.com`; `Docs/product-brief.md` is shared by three repos, so it was left alone). `hello@wadatalk.com` was not changed: nobody confirmed that mailbox exists on the new domain. README has a "Going live" list.
- Ran: `tsc --noEmit` and `eslint` on the changed portal files clean; looked at the portal previews (admin and teacher) in the browser. Not verified: signed-in use against the Wad project (Redirect URL missing, see Needs the owner), the other public pages, ops Lessons/Organizations pages, dark mode (the app's dark palette is not ported).

## 2026-10-26 — Product brief and start-here header (`agent-context/fox`)
- `Docs/product-brief.md` (same file in all three repos) and a start-here header at the top of `AGENTS.md` (above the Next.js block). Docs only.

## 2026-10-23 — Docs folder and agent rules (`web-docs/fox`)
- Added `Docs/` like the wada repo: `README.md` (index, the three repos, reading order), `agent-rules.md`, `project-overview.md`, `project-structure.md`, `development-workflow.md`, this work log (history below rebuilt from git and the wada work log).
- `CLAUDE.md` now points agents at `Docs/` (and still imports `AGENTS.md`). `.env.example` added (names only) and allowed in `.gitignore`. README replaced the create-next-app text.
- Nothing in `src/` changed. Not verified: the hosting section is a placeholder for the owner.

## 2026-10-23 — Ops: words and grammar per unit (P1b) + stuck generations (`p1b/fox`, PR #8)
- Add unit and the unit editor show and edit the words and grammar a unit teaches (empty = the AI picks them from the backend's word lists); the editor lists `word_warnings`. A unit still "generating" after 10 minutes shows "Stopped" with "Try again", and the page stops re-reading. tsc + lint clean; not tried signed in.

## 2026-10-23 — Ops: CEFR levels (levels plan P0, PR #7)
- Level choices A1, A2, B1, B2 (default A2), matching wada-backend migration `20261023110000`. Also brought K2 to `main`.

## 2026-10-22 — Ops Organizations page (K2)
- Create universities and companies, add admins, change kind (`ops-orgs`). Merged into `o3/fox` by mistake (see gotchas); reached `main` via #7.

## 2026-10-19 — Hinova ops site (O2, O3)
- O2: ops on its own subdomain, sign-in (email + password, open sign-up), platform-admin gate, Lessons course plan per category. O3: unit editor (edit every field, generate, regenerate, publish / unpublish).

## 2026-10-01 — Organization portal (team, `admin/cusub`)
- Portal dashboard, school / university admin pages and previews.

## 2026-09-28 — First version of the site (team)
- Public site, students page with a "how to get started" download call to action.
