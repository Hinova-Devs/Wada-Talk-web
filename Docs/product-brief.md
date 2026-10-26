# Product brief: what Wada is and how it must feel

**Every agent and every person reads this before building anything.** It is the same file in all three repos
(`wada/Docs/`, `Wada-Talk-web/Docs/`, `Wada Backend/DOC/`). Change all three copies together.
On product and design questions this file wins over older docs (`project-overview.md` still describes the v1 unit and v4 look).
Last updated by the owner's direction of 2026-10-19 → 2026-10-25.

## In one line
Wada helps Somali adults **speak** English for real situations (interviews, study, work, daily life), with short
lessons, an AI partner (Geeli) and 1:1 Live Talk calls with other learners.

## Who it is for
Higher-education level adults: university students, office and tech workers, school leavers going for scholarships
(IELTS etc.). No under-18s. The pilot is university students in Somaliland.
They already know some English. **They need confidence speaking it**, not a children's game.

## Product rules (do not break without the owner)
1. **Speaking first.** Everything serves speaking. Use what the learner already knows (greetings, real conversations).
2. **Professional, not gamified.** No XP, leagues, badges, rankings, confetti or cartoon rewards. Do not add game
   mechanics. Tone of UI text and lessons: calm, adult, respectful.
3. **Learn first, then speak.** A unit teaches before it tests:
   Scene (situation + model conversation) → Words and grammar → Hear the difference → Say it your way (spoken) →
   Practice with AI (spoken) → Live Talk → Review. The old choose/build drills are retired. Details: `levels-plan.md` (wada repo).
4. **Somali under every English line**, on by default, switch in Settings ("Show Somali"). Somali is AI-drafted and
   marked as draft until a native speaker checks it. Never present it as checked.
5. **Hidden levels A1–B2.** Placement looks like a normal first lesson; learners are locked to a level and move up only by
   passing a test. A1 has no Live Talk (AI only). Tech is its own world and needs B1.
6. **Categories** (the admin picks one, then a level, when generating a unit): job interview / business, tech,
   exams & scholarships (IELTS), everyday conversation; medicine and others later.
7. **Content is never invented freely.** The unit generator takes words and grammar from Wada's own source lists
   (`shared/sources/` in Wada Backend), at the learner's level.
8. **Live Talk:** one partner, one 6-minute video call, roles swap at 3:00. Safety (report, block) is never cut.
9. **Privacy:** learner recordings are deleted right after speech-to-text (Say it your way, Practice) or after 30 days
   (calls). Never log speech, transcripts, phone numbers or tokens.

## Design rules (the redesign is in progress, owner: fox)
- The current look (**design v4**: dark navy, lime, rounded Baloo2, Geeli fox, 3D press buttons) is being **replaced
  completely**. Do not polish or extend v4, and do not invent a new look in a feature branch.
- It must **not look AI-generic** (no default "generic blue" SaaS, no gradients for decoration, no emoji as icons).
  It should look like a real designer made it: professional, clear, speaking-first.
- **Until the new design lands, build screens only from the shared pieces**: `W` palette and theme in
  `lib/core/theme/app_theme.dart`, widgets in `lib/core/widgets/`. No hard-coded colours, fonts or sizes in a feature.
  Then the redesign changes one place and every screen follows.
- Every screen: loading, error (with retry) and empty states; readable at small phone widths; real buttons with labels.

## The three repos (clone them side by side in one folder)
| Folder | GitHub | What | Agent entry file |
|---|---|---|---|
| `wada` | `Hinova-Devs/Wada-Talk` | Flutter app for learners; product plans in `Docs/`; **the work log for app + backend** | `CLAUDE.md` / `AGENTS.md` |
| `Wada Backend` | `Hinova-Devs/wada-backend` | Supabase (migrations, RLS, Edge Functions), `shared/` (schemas, prompts, sources), `worker/` (Railway); contracts in `DOC/` | `AGENTS.md` / `CLAUDE.md` |
| `Wada-Talk-web` | `Hinova-Devs/Wada-Talk-web` | Next.js 16: public site (wadatalk.com), org portal (`/portal`), `/join/<code>`, Hinova's `ops.wadatalk.com` (lesson generator) | `AGENTS.md` / `CLAUDE.md` |

**Who owns what:** database, functions and contracts change **only** in Wada Backend, and the contract doc in `DOC/`
changes in the same commit. The app and the site call those contracts; they never invent their own.

## Words we use
| Word | Means |
|---|---|
| Unit | One lesson about one situation (e.g. "Greet people at an interview"). Has a level (A1–B2) and a category |
| Variant | One of 3 versions of a unit's content (`units.variants`), so learners don't all get the same lines |
| Geeli | The AI speaking partner (and today's mascot) |
| Say it your way | 3 prompts the learner answers out loud, using 1–3 target words |
| Practice with AI | A short spoken role-play with Geeli (`practice-turn`) |
| Live Talk | 1:1 video call with another learner (LiveKit) |
| Feedback | Report after a call: score, sub-scores, mistakes with replay, tip in English + Somali |
| Review | Cards made from the learner's own mistakes |
| Ops | Hinova's internal site to plan, generate (AI), review and publish units |
| Portal | The website part for universities and companies (classes, students, stats) |

## How we work (all three repos)
- Tasks are Linear issues (team Hinova, `HDT-…`). One agent = one issue = one branch `<issue-or-job>/<name>`. Never commit to `main`.
- Read in this order: this brief → the repo's `agent-rules.md` → `work-log.md` (current sprint at the top) → the doc for your area.
- Done means the repo's checks pass and you said plainly what you ran and what you could not verify.
- Update the work log before you finish.
