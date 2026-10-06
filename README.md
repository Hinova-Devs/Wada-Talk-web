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

The single login form supports email/password for provisioned English Teachers and existing staff, plus invitation-only email links (`shouldCreateUser: false`) for existing invitation workflows. Backend `my_orgs()` is checked after either sign-in method; signing in never grants staff access by itself. Root callbacks with a PKCE code and token-hash callbacks are handled by `/auth/callback`. Passwords are never hardcoded in the frontend. Service-role credentials are used only inside the Supabase Edge Function environment.

Without the rotation migration, manual codes are held only in component memory and shown when generated. With `class-code-rotation.sql`, codes are retained privately by the backend and readable only by staff assigned to that class or its institution's Super Admin. The frontend never writes codes to localStorage or URLs. The CSV export uses `class_students` and a fixed field whitelist, with formula protection and proper CSV quoting. It excludes learner contact details, transcripts, recordings and mistake sentences. Skills are shown out of 20; unavailable feedback remains empty. Dates are displayed in Africa/Nairobi (East Africa time).

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

The workspace uses course groups for universities and classes for schools. Every group has its own capacity, student progress and join-code settings. UI roles are **English Teacher** (the existing backend `teacher`, assigned classes only) and **Super Admin** (the existing backend `admin`, all classes in the institution). This is not a project-wide or cross-institution superuser role. The Institution, administrator and audit sections remain Super Admin-only. The English Teacher account is provisioned from the class creation form, where the Super Admin enters its name, email and password, or assigns existing staff. There is no separate public English Teacher registration form.

Student join codes have a configurable 1–365-day duration (subject to the original API's limits), optional server-side automatic renewal, copy/print and stop/revoke controls. Expiry prevents new joins; it does not remove enrolled students or reset their progress. Students enter the current code in the learner app. QR cards contain the code itself; scanning support depends on that app.

### Supabase owner setup

Apply `database/institution-portal.sql` in the existing project's SQL Editor. It adds `org_portal_profiles`, `org_access_requests`, and three RPCs without changing the original org/class API:

- `org_portal_profile(p_org)` reads a profile for existing staff.
- `set_org_portal_profile(p_org,p_type)` saves a type for existing admins only.
- `request_org_access(...)` receives public onboarding requests. It validates fields and limits repeated requests per email to one every 24 hours. Tables have RLS enabled and no direct anon/authenticated access.

The migration assumes the existing `my_orgs()` returns the contract's JSON array. Verify that signature before applying it. Run the script as the project owner; use an invited admin to save each existing institution's type in the portal. Review pending requests privately in the Supabase table editor, create the organization using the existing owner workflow, send the admin invitation and mark the request approved. Receiving a request does not automatically send email or create privileged accounts. Match the requested type in the new institution's profile.

Until the migration is applied, the portal still reads existing dashboard data, institution settings clearly report pending setup, and registration prepares a request that the user must send through their email app. `NEXT_PUBLIC_CONTACT_EMAIL` controls the destination for this fallback. No service-role credential is included in this web app.

Validation: the extension was applied twice to a temporary PostgreSQL runtime (PGlite 0.5.8), with mocked `auth.uid()` and JSON `my_orgs()`. Anonymous direct table reads and profile calls were denied, teachers could read their organization but not save a type, cross-organization reads were denied, admins could save, malformed public requests and duplicate email requests were rejected. This does not replace validation against the real Supabase migration and roles.


## Class account and automatic-code deployment

1. Apply `database/class-code-rotation.sql` to the existing dashboard project's database. It depends on JSON `my_orgs()`, `new_join_code(uuid,integer)` and `revoke_join_code(uuid)`. New portal writes must use the wrapper RPCs (`configure_class_code`, `read_class_code`, `stop_class_code`); legacy callers should stop using the original code-write RPCs so the cached current code and schedule stay consistent.
2. Enable Supabase Cron, then apply `database/class-code-cron.sql`. Its named job checks expiry every minute (up to 100 due classes per run). Rotation also occurs when authorized staff read an expired automatic schedule. Original code expiry stays authoritative: the old code fails after expiry, and renewal may be delayed until the next job tick. Cron failures must be monitored in Supabase. See https://supabase.com/docs/guides/cron.
3. Deploy the supplied function: `supabase functions deploy provision-class-manager --project-ref hwalemkndxvkhdqpuvii`. The existing `invite-staff` function must already be deployed and configured. Set `DASHBOARD_ALLOWED_ORIGINS` to your exact permitted origins, such as `https://admin.wada.com,http://localhost:3000`. Supabase injects its built-in project credentials in the Edge Function environment; never add its service-role key to frontend env variables.
4. Use a real Super Admin to create a class with its English Teacher credentials. The function verifies the caller, institution and class before provisioning. It uses the existing staff invitation workflow, then assigns a password only to a newly invited account. Existing accounts must be assigned through the existing-staff option; their passwords are not reset. The existing onboarding function may send its usual invitation email, but the English Teacher can use the Super Admin-provided password directly. SMTP and existing staff-profile rules still need live validation.
5. If class creation succeeds but account setup fails, the form keeps the new class ID and retries against the same class. If invitation succeeded but password setup failed, use the invitation or ask the project owner to complete the account; do not create duplicate accounts. Browser refresh loses the temporary retry state, so check the class list first.

Automatic rotation records the user who configured it. Every worker run rechecks that user's current class access before calling the original code RPC. Removed staff stop authorizing renewal; failures disable renewal and are reported in the portal. Tables have RLS and no direct public or staff read permissions, and the worker is not executable by anon/authenticated roles. Rotation does not enroll, remove or reset students. This extension changes the original "show a code only once" rule to make the current automatically renewed code available to authorized class staff.

Validation: `node scripts/verify-manager-provisioning.mjs` type-checks the Edge Function against the installed SDK and tests authorization, new-account password assignment, existing-account preservation and partial failures with mocked Supabase calls. `node scripts/verify-code-rotation.mjs <path-to-installed-pglite/dist/index.js>` uses optional PGlite to test SQL permissions, expiry/renewal, revocation, actor removal, claim restoration and learner preservation against mocked original functions. Actual project schema, Cron jobs, SMTP and Edge Function deployment must still be checked in Supabase.
