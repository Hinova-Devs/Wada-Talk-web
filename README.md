# Wada website and organization dashboard

Next.js 16.3.6, React 19 and Supabase v2. The public website and dashboard share this source, but the dashboard has its own layout and can run as its own deployment at admin.wada.com.

## Run locally

Install dependencies with `pnpm install` (or `npm ci`). Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>
WADA_APP_MODE=dashboard
```

Use `pnpm dev` or `npm run dev`, then open http://localhost:3000. Dashboard mode opens the organization workspace at `/`; unauthenticated visitors go to `/login`. Omit `WADA_APP_MODE` to use the public marketing homepage. The hostname `admin.wada.com` also selects dashboard mode automatically. `/portal-preview` is a clearly marked sample preview with no live mutations.

## Dashboard contract

All dashboard data reads and changes use Supabase RPCs. There are no direct table reads. `my_orgs()` determines accessible organizations, role (`admin` or `teacher`) and classes. Organization selection is restricted to that result. Teachers see assigned classes; staff and audit sections are admin-only. The database remains the final authorization authority.

Reads: `my_orgs`, `org_overview`, `class_overview`, `class_students`, `student_detail`, `class_skills`, `class_mistakes`, `org_staff`, `org_audit_log`.

Changes: `create_class`, `update_class` (all four fields), `new_join_code`, `revoke_join_code`, `remove_student`, `assign_teacher`, `set_staff_role`. Staff invitation uses `functions.invoke('invite-staff', {body: {org_id, email, role, class_id?}})` and displays the Edge Function's safe error message.

Staff sign-in uses email OTP with `shouldCreateUser: false` and the dashboard origin as redirect URL. Root callbacks with a PKCE code and token-hash callbacks are handled by `/auth/callback`; implicit invite sessions are picked up on the login page. The login page provides one sign-in form. Invited staff use email links. In development only, entering the documented seeded account `sahra@demo.wada.test` shows a password field in that same form and uses `signInWithPassword`; its password is entered by the user and never hardcoded in the frontend. Production always uses invitation-only email OTP. Authentication errors distinguish email delivery setup, sending limits, missing invitation and expired callbacks. No service-role key belongs in this app.

New join codes are held only in component memory and shown when generated. They are not written to localStorage, URLs or the database by the frontend. Existing codes cannot be retrieved. The CSV export uses `class_students` and a fixed field whitelist, with formula protection and proper CSV quoting. It excludes learner contact details, transcripts, recordings and mistake sentences. Skills are shown out of 20; unavailable feedback remains empty. Dates are displayed in Africa/Nairobi (East Africa time).

Removed unsupported portal features: schedule editing, group discussions, safety reports, PDF export, billing seats and organization settings. The supplied API provides none of these. The public join page hands off to the learner app and displays the required privacy notice; it does not call the nonexistent `class_preview` RPC or claim that an unverified code is valid/expired.

## Backend setup owned by the Supabase project

This checkout does not contain `backend/`, SQL migrations or Edge Function source. Configure the existing backend from its own repository:

1. Apply `20261006100000_org_dashboard.sql`.
2. Deploy `invite-staff`.
3. Set its `DASHBOARD_URL=https://admin.wada.com` secret.
4. Add `https://admin.wada.com` and `http://localhost:3000` to Authentication redirect URLs.
5. Enable Email authentication and configure SMTP for real invitations.
6. Point the dashboard deployment/domain to this app with `WADA_APP_MODE=dashboard` and the public Supabase values.

Creating organizations and first admins is an owner workflow through the Supabase dashboard and `create_org`; it is not exposed to teachers in this frontend.

## Verification

- `npm test`: CSV escaping, formula protection, privacy whitelist, API errors, supported sections and authentication routing/error handling.
- `npx tsc --noEmit`: type checking.
- `npm run lint`: lint.
- `npm run build`: production compilation.
- `node scripts/verify-backend.mjs`: optional read-only check using the documented seeded Sahra development account. Do not use this demo account in production. Session tokens are never printed or saved by the script.

On this configured project, Sahra currently returns `teacher`, despite the supplied backend note describing her as an admin. Live teacher reads were verified; admin changes and staff emails require an actual admin account and are not exercised by the read-only check.


## University and school workspaces

`/register` requests an institution admin invitation and requires a University/School choice. Existing invited staff use the single `/login` form. Selecting a type at sign-in sets a browser presentation preference only; it never creates an organization or grants permissions. A saved organization profile takes precedence over that preference.

The workspace adapts its group and staff labels to the institution: course groups and lecturers for universities, classes and teachers for schools. Both use the existing learning-progress API. The Institution section is admin-only. Student join codes have their own section: choose a group, generate or replace a 7/30/90-day code, copy it, print a student card or revoke it. Students enter the code in the learner app; they do not sign in to the staff dashboard. Codes are held in component memory and cannot be retrieved after leaving the section. QR cards contain the code itself; app scanner support depends on the learner app.

### Supabase owner setup

Apply `database/institution-portal.sql` in the existing project's SQL Editor. It adds `org_portal_profiles`, `org_access_requests`, and three RPCs without changing the original org/class API:

- `org_portal_profile(p_org)` reads a profile for existing staff.
- `set_org_portal_profile(p_org,p_type)` saves a type for existing admins only.
- `request_org_access(...)` receives public onboarding requests. It validates fields and limits repeated requests per email to one every 24 hours. Tables have RLS enabled and no direct anon/authenticated access.

The migration assumes the existing `my_orgs()` returns the contract's JSON array. Verify that signature before applying it. Run the script as the project owner; use an invited admin to save each existing institution's type in the portal. Review pending requests privately in the Supabase table editor, create the organization using the existing owner workflow, send the admin invitation and mark the request approved. Receiving a request does not automatically send email or create privileged accounts. Match the requested type in the new institution's profile.

Until the migration is applied, the portal still reads existing dashboard data, institution settings clearly report pending setup, and registration prepares a request that the user must send through their email app. `NEXT_PUBLIC_CONTACT_EMAIL` controls the destination for this fallback. No service-role credential is included in this web app.

Validation: the extension was applied twice to a temporary PostgreSQL runtime (PGlite 0.5.8), with mocked `auth.uid()` and JSON `my_orgs()`. Anonymous direct table reads and profile calls were denied, teachers could read their organization but not save a type, cross-organization reads were denied, admins could save, malformed public requests and duplicate email requests were rejected. This does not replace validation against the real Supabase migration and roles.
