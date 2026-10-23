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
  can_do_items: { text_en: string; text_so: string | null } | null;
};
export const PLAN_COLUMNS = "id, position, title, status, level, notes, generation_error, updated_at, can_do_items(text_en, text_so)";

// ---------------------------------------------------------------- unit content (wada-backend shared/src/unit.ts)
type Explain = { id: string; explain_en: string; explain_so: string | null };
export type ChoiceDrill = Explain & { type: "choice"; prompt: string; options: string[]; answer: number };
export type BuildDrill = Explain & { type: "build"; prompt: string; bank: string[]; target: string[] };
export type SayDrill = Explain & { type: "say"; text: string; hint?: string };
export type Drill = ChoiceDrill | BuildDrill | SayDrill;
export type Topic = { q: string; help?: string };
export type Variant = {
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
