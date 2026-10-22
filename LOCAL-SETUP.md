# Wada local workspace — 2026-10-21

All three repositories are available locally. Open `Wada.code-workspace` to view them together.

| Project | Directory | Checked revision / branch |
|---|---|---|
| Organization website | workspace root | `8a034fa`, `ENG-faarax` plus local setup fixes |
| Standalone backend | `related-projects/wada-backend` | `ffd2a60`, default branch |
| Flutter learner app | `related-projects/Wada-Talk` | `cc8094d` plus local fixes on `setup/fox` |

The related repositories are independent Git checkouts and are ignored by the website repository. Commit and review their changes separately. The app still contains a historical `backend/` copy; use the standalone backend as the current backend source.

## Start

From the website directory, in two PowerShell terminals:

```powershell
./scripts/start-local.ps1 -Target web
./scripts/start-local.ps1 -Target app
```

Website: http://localhost:3000/login. Learner application: http://localhost:3001.

The app launcher uses Flutter from PATH, `FLUTTER_ROOT`, or its generated package configuration. Alternatively pass `-FlutterPath 'C:\path\to\flutter-sdk'`. Node must be on PATH. Stop either server with Ctrl+C in its terminal. The web launcher now builds and starts production mode by default; add `-Development` when you need hot reload.

Public Supabase settings are configured in the website `.env`, the learner `.env.app.json`, and backend `.env`. Existing settings were preserved. No service-role or AI credentials were copied into either frontend. The backend secret placeholders are still empty. The app is served in debug mode; its Google button is an explicitly documented offline demo, not working Google authentication. Hodan/Amina development buttons use Supabase demo accounts. Real Google/phone sign-in needs provider configuration.

`/portal` reads real Supabase data. `/portal-preview` uses sample data. The verified development staff account currently has teacher access; it cannot manage the whole institution.

## Verified locally

- Website checks for authentication, CSV privacy, institution navigation and mocked teacher provisioning passed.
- Website TypeScript and production build passed. ESLint: zero errors, 27 existing warnings.
- Live read-only Supabase check passed: staff membership, class overview, roster, learner detail, skills and mistakes. Teacher access to organization administration was correctly denied.
- Backend shared TypeScript and 64 Vitest tests passed. SQL tests and deployed Edge Functions were not validated here.
- Flutter dependencies installed using the existing Flutter 3.47.6 / Dart 3.13.5 SDK. LiveKit updated to 2.13.1 because 2.6.4 failed to compile on this Dart version. Route-transition timing in call tests was corrected. A browser entry point and a scrollable sign-in layout were added.
- Flutter: 57 tests passed, including the short-viewport regression test. Dart analysis reported no issues. `flutter analyze` itself could not finish because the installed SDK lacks its `examples/` directory; analysis was run with the SDK's `dart analyze .` instead.

Backend installation encountered a registry timeout for the Windows esbuild archive. It was downloaded directly from the official registry, verified against the committed package-lock SHA-512 integrity, and installed locally. Other optional platform binaries were omitted. Normal installation on another machine is `npm ci` inside `related-projects/wada-backend/shared`.

## Still required for the full product

These are product/deployment work, not resolved by downloading the repositories:

1. Owner access to Supabase is needed to inspect migration history, deploy the institution/profile and rotating-code extensions and `provision-class-manager`, configure Cron, SMTP and auth redirect URLs. Do not reset or seed the live database. The website README contains the extension deployment order.
2. The learner's class-code form currently saves a code on the device; it does not call the existing backend `take_seat` RPC. That integration remains to be built and tested. A rotating dashboard code alone does not enroll students.
3. The standalone `worker/` contains instructions only. The worker, recording/feedback pipeline, notifications and associated operational deployment remain unfinished. AI/LiveKit and other service secrets require the owner; no paid service was provisioned.
4. Review/progress/feedback and some learner actions still contain demo placeholders. Check the app work log before planning features; it also contains stale statements about the separate dashboard and backend location.
5. Real two-device calls, microphone/camera, mobile builds, SQL/permission tests on Supabase and production sign-in/invitations still require end-to-end verification. No Android device was connected; iOS needs macOS tooling.

No new accounts or privileged roles were created, no database migrations were applied, and no deployment was performed in this setup session.
