// Shared by the /ops pages (server and browser). Contract: ops-api.md in the wada-backend repo.

/** Lesson categories (database `path`, `GOALS` in wada-backend shared/src/enums.ts), in menu order. */
export const CATEGORIES = [
  ["job_interviews", "Job interviews"],
  ["business", "Business"],
  ["tech_ai", "Tech & AI"],
  ["ielts_scholarships", "IELTS & scholarships"],
  ["university", "University"],
  ["everyday", "Everyday English"],
] as const;
export type Category = (typeof CATEGORIES)[number][0];
export const isCategory = (v: unknown): v is Category => CATEGORIES.some(([id]) => id === v);
export const categoryLabel = (v: string) => CATEGORIES.find(([id]) => id === v)?.[1] ?? v;

/** A unit's CEFR level (B2 also covers stronger learners). Inside a unit, easy / medium / hard still adapt to each learner. */
export const LEVELS = [
  ["a1", "A1"],
  ["a2", "A2"],
  ["b1", "B1"],
  ["b2", "B2"],
] as const;
export type Level = (typeof LEVELS)[number][0];
export const levelLabel = (v: string) => LEVELS.find(([id]) => id === v)?.[1] ?? v;

export type UnitStatus = "planned" | "generating" | "draft" | "failed" | "published";

/**
 * Still "generating" after 10 minutes = the server stopped the AI before it finished (a generation takes about a minute).
 * The backend then allows generating again (STALE_GENERATING_MS in wada-backend shared/src/ops-handler.ts).
 */
export const isStuck = (r: { status: UnitStatus; updated_at: string }, now = Date.now()) =>
  r.status === "generating" && now - Date.parse(r.updated_at) > 10 * 60_000;
export const STATUS_LABELS: Record<UnitStatus, string> = {
  planned: "Planned",
  generating: "Generating…",
  draft: "Draft · needs review",
  failed: "Generation failed",
  published: "Published",
};

/** One row of the course plan, as the Lessons list reads it. */
export type PlanRow = {
  id: string;
  position: number;
  title: string;
  status: UnitStatus;
  level: Level;
  notes: string | null;
  generation_error: string | null;
  updated_at: string;
  /** What the unit teaches (from the backend's word lists and grammar list). Empty = the AI picks them when generating. */
  target_words: string[];
  grammar: string[];
  /** List words above the unit's level that the generated content uses: review them. */
  word_warnings: string[];
  can_do_items: { text_en: string; text_so: string | null } | null;
};
export const PLAN_COLUMNS = "id, position, title, status, level, notes, generation_error, updated_at, target_words, grammar, word_warnings, can_do_items(text_en, text_so)";

/** "seat, traffic, weather" → ["seat", "traffic", "weather"]: words split on commas or lines, lowercase, no repeats. */
export const wordList = (text: string) => [...new Set(text.split(/[,\n]/).map((w) => w.trim().toLowerCase()).filter(Boolean))];
/** One grammar point per line. */
export const lineList = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);

// ---------------------------------------------------------------- unit content (wada-backend shared/src/unit.ts)
type Explain = { id: string; explain_en: string; explain_so: string | null };
export type ChoiceDrill = Explain & { type: "choice"; prompt: string; options: string[]; answer: number };
export type BuildDrill = Explain & { type: "build"; prompt: string; bank: string[]; target: string[] };
export type SayDrill = Explain & { type: "say"; text: string; hint?: string };
export type Drill = ChoiceDrill | BuildDrill | SayDrill;
export type Topic = { q: string; help?: string };
/** The "learn first" part (levels plan P2a): same in every variant; missing on units written before it existed. */
export type Teach = {
  scene_so: string;
  scene_en: string;
  dialogue: { speaker: string; en: string; so: string }[];
  words: { en: string; so: string; example_en: string; example_so: string }[];
  grammar: { title: string; explain_en: string; explain_so: string; examples: string[] }[];
  sound_pairs: { sound: string; a: string; b: string; tip_en: string; tip_so: string }[];
};
/** "Say it your way" (levels plan P2b): replaces the drills from prompt unit-8. */
export type SayPrompt = { prompt: string; prompt_so?: string; use_words: string[]; example: string; example_so?: string };
export type Variant = {
  teach?: Teach;
  say_your_way?: SayPrompt[];
  drills: Drill[];
  ai_script: {
    persona: string; setting: string; goal: string; opening: string; max_learner_turns: number;
    points: { id: string; target: string; chips: string[] }[];
  };
  plan_prompts: string[];
  talk_topics: { interviewer: Topic[]; candidate: Topic[] };
};
export const VARIANT_LEVELS = [
  ["easy", "Easy"],
  ["medium", "Medium"],
  ["hard", "Hard"],
] as const;
export type VariantLevel = (typeof VARIANT_LEVELS)[number][0];

/** Everything the unit editor reads. */
export type UnitRow = PlanRow & {
  path: Category;
  variants: Partial<Record<VariantLevel, Variant>>;
  prompt_version: string | null;
  somali_checked_at: string | null;
  content_credits: { source: string; note: string | null }[];
};
export const UNIT_COLUMNS = `${PLAN_COLUMNS}, path, variants, prompt_version, somali_checked_at, content_credits(source, note)`;
