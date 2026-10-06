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

Staff sign-in uses email OTP with `shouldCreateUser: false` and the dashboard origin as redirect URL. Root callbacks with a PKCE code and token-hash callbacks are handled by `/auth/callback`; implicit invite sessions are picked up on the login page. Development builds also provide a password form for existing demo users. This form is absent in production. No service-role key belongs in this app.

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

- `npm test`: CSV escaping, formula protection, privacy whitelist, API errors and supported sections.
- `npx tsc --noEmit`: type checking.
- `npm run lint`: lint.
- `npm run build`: production compilation.
- `node scripts/verify-backend.mjs`: optional read-only check using the documented seeded Sahra development account. Do not use this demo account in production. Session tokens are never printed or saved by the script.

On this configured project, Sahra currently returns `teacher`, despite the supplied backend note describing her as an admin. Live teacher reads were verified; admin changes and staff emails require an actual admin account and are not exercised by the read-only check.
