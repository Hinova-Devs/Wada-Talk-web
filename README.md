# Wada-Talk-web

The Wada website: public site (wada-talk.com), class join links, the organization portal and Hinova's ops site
(`ops.wada-talk.com`). Built with Next.js 16 and Supabase.

```
cp .env.example .env.local   # then fill in the Supabase URL + anon key
npm install
npm run dev                  # http://localhost:3000 · ops on http://ops.localhost:3000
```

Docs (start here): [`Docs/README.md`](Docs/README.md). AI agents: [`Docs/agent-rules.md`](Docs/agent-rules.md).

## What changed on `design/wada-app-look` (2026-10-31)

*Soo koob (Somali): shaqada la qabtay waa halkan hoose.*

1. **New look.** The site and the portal/ops dashboards follow the Wada app design: Plus Jakarta Sans, one soft surface
   `#E6ECF3`, accent `#26AEE8`, neumorphic cards and inset fields. Colours are set in `src/app/globals.css` and in the
   design components (`src/components/design/`). The dark palette of the app is not ported yet.
2. **School admin removed.** `/school-admin`, its component and CSS, and "School" in the demo form and copy are gone.
   The university admin (`/portal`, `/university-admin` redirects to it) stays.
3. **Portal on the real backend.** `/portal` now reads and writes only through the Wada Backend contract
   (`../Wada Backend/DOC/dashboard-api.md`); one file maps the answers: `src/lib/portal/backend.ts`.
   - Reads: `my_orgs`, `org_overview`, `class_overview`, `class_students`, `student_detail`, `class_skills`,
     `class_mistakes`, `org_staff`.
   - Writes: `create_class`, `update_class`, `new_join_code`, `revoke_join_code`, `set_staff_role`, and the
     `invite-staff` Edge Function.
   - Roles come from the backend (`admin`, `teacher`); the UI calls `admin` "Organization admin".
   - Removed (the backend has no data for them): Live Talk hours, group discussions, safety reports, settings.
     Export is a CSV built in the browser.
4. **Domain.** Visible links and docs now say `wada-talk.com` and `ops.wada-talk.com` (was `wadatalk.com`). The contact
   email `hello@wadatalk.com` was **not** changed: see "Going live".

### Signing in to the portal (university admin and teacher)
There is no password. Go to `/login`, type your work email, open the link Supabase emails you.
Only invited staff can sign in (`shouldCreateUser: false`): an **admin** sees every class, the team and can create
classes and invite staff; a **teacher** sees only the classes they teach. Send invitations from Portal → Team
(admin only) or ask Hinova to add the first admin from the ops site.
To look at both views without signing in, run the site with any `NEXT_PUBLIC_SUPABASE_*` values and open
`/portal-preview` (admin) and `/portal-preview?role=teacher` (teacher): sample data, nothing is saved.

### Going live (`wada-talk.com`) — still to do by the owner
- Set `NEXT_PUBLIC_SITE_URL=https://wada-talk.com` (and the Supabase URL + anon key) in the host's environment.
- DNS for `wada-talk.com` and `ops.wada-talk.com`, and add both domains in the host.
- Supabase → Authentication → URL Configuration: Site URL `https://wada-talk.com`; Redirect URLs
  `https://wada-talk.com/auth/callback`, `https://ops.wada-talk.com/auth/callback`, and for local work
  `http://localhost:3000/auth/callback` and `http://ops.localhost:3000/auth/callback`. Without these the email link does
  not sign anyone in.
- Decide the contact mailbox (`hello@wadatalk.com` in the footer, forms and help page) and set `NEXT_PUBLIC_CONTACT_EMAIL`.
- `/join/<code>` calls `class_preview`, which the backend does not have yet.

**Sign-in fallback.** If Supabase does not allow the `/auth/callback` redirect, the email link lands on `/?code=...`; `src/proxy.ts` forwards that to `/auth/callback`, so the link still signs the person in (it needs only the Site URL `http://localhost:3000` / `https://wada-talk.com` to be allowed). Adding the callback URLs above is still the clean fix.

Checked: `tsc --noEmit`, `eslint` on the changed portal files, `npm run build`, and the portal previews in a browser.
**Not checked:** signing in against the live project, the ops Lessons/Organizations pages, dark mode.
Full history and open items: [`Docs/work-log.md`](Docs/work-log.md).
