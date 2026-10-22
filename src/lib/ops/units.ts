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

/** A unit's level band. Inside a unit, easy / medium / hard still adapt to each learner. */
export const LEVELS = [
  ["a2_b1", "A2–B1"],
  ["b1", "B1"],
  ["b1_b2", "B1–B2"],
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
