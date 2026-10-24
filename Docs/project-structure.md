# Project structure

```
Wada-Talk-web/                    THIS repo: the website, portal and ops (Next.js 16)
├── CLAUDE.md, AGENTS.md          Short rules for AI agents (they point here). AGENTS.md's Next.js block is re-written by `next dev`
├── Docs/                         All docs for this repo (you are here)
├── src/
│   ├── proxy.ts                  Next 16 middleware: ops subdomain rewrite, /ops 404 elsewhere, Supabase session
│   ├── app/                      Routes (App Router)
│   │   ├── page.tsx              Home (components/design/HomeDesign)
│   │   ├── [...slug]/            Every other public page, English and /so/ Somali (content from lib/content.ts)
│   │   ├── join/[code]/          Join a class by code
│   │   ├── portal/               Organization portal (signed in, teacher / org_admin)
│   │   ├── portal-preview/       Portal with sample data (demo, not indexed)
│   │   ├── school-admin/, university-admin/   Redirects to the portal preview / portal
│   │   ├── auth/callback/        Supabase sign-in callback for the public host
│   │   ├── ops/                  Hinova ops, served on ops.<host>: login, lessons, lessons/[id], organizations, auth/callback
│   │   ├── layout.tsx, globals.css, not-found.tsx, robots.ts, sitemap.ts, opengraph-image.tsx
│   ├── components/
│   │   ├── design/               Home, Organizations and Safety page designs (+ their .data.ts)
│   │   ├── ops/                  shell, login-form, lessons-board, unit-editor, variant-fields, orgs-board
│   │   ├── portal/               dashboard
│   │   ├── school/               school-admin preview
│   │   └── pages.tsx, shell.tsx, forms.tsx   public page frame, header/footer, store buttons, forms
│   └── lib/
│       ├── content.ts            Public page content (EN + SO), paths, documents
│       ├── supabase/             client.ts (browser), server.ts (server), middleware.ts (session refresh)
│       ├── ops/                  gate.ts (opsGate), call.ts (callOps / opsUnits), units.ts, orgs.ts (types, labels, columns)
│       └── portal/data.ts        portal sections and row helpers
├── public/                       Images (assets/), fonts
└── .env.example                  Copy to .env.local (Supabase URL + anon key, site URLs)
```

## Rules for the code
- **Server first.** Pages that read data are server components (`createClient()` from `lib/supabase/server.ts`); only
  interactive parts are `"use client"` (the ops boards and editor, forms).
- **Ops:** every page calls `opsGate()` first. Links inside ops leave out `/ops` (the proxy adds it). Writes go through
  `opsUnits()` / `callOps()` in `lib/ops/call.ts`, which turn backend errors into a readable message.
- **Column lists and types for the backend live in one place** per area: `lib/ops/units.ts`, `lib/ops/orgs.ts`,
  `lib/portal/data.ts`. If the backend changes a table or a function's answer, change them there.
- **Every page handles loading, error (with retry) and empty.** Messages use `role="alert"` (errors) or `role="status"`.
- **Styles:** `globals.css` (class prefixes: `oa-` shared admin look, `ops-` ops only, `portal-` portal). Reuse a class
  before adding one.
- `ponytail:` comments mark stand-ins (sample data, simplified parts). Search for them to see what is not real yet.

## Naming
- Branches: use the branch you are given; otherwise `<job>/fox` (for example `p1b/fox`). Never commit to `main`.
- Components: `kebab-case.tsx` in `components/ops`, `portal`, `school`; the older design files use `PascalCase.tsx`. Keep a folder's style.
- Docs file names are lower-case with hyphens.
