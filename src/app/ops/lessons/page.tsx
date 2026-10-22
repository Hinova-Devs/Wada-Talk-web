import type { Metadata } from "next";
import { LessonsBoard } from "@/components/ops/lessons-board";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { opsGate } from "@/lib/ops/gate";
import { isCategory, PLAN_COLUMNS, type PlanRow } from "@/lib/ops/units";

export const metadata: Metadata = { title: "Lessons" };
export const dynamic = "force-dynamic";

export default async function Lessons({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const gate = await opsGate();
  if (!gate.allowed) return <NoAccess email={gate.email} failed={gate.failed} />;
  const { category: raw } = await searchParams;
  const category = isCategory(raw) ? raw : "job_interviews";
  const { data, error } = await gate.supabase.from("units").select(PLAN_COLUMNS).eq("path", category).order("position");
  return (
    <OpsShell email={gate.email} section="lessons">
      <LessonsBoard key={category} category={category} rows={(data ?? []) as unknown as PlanRow[]} loadFailed={!!error} />
    </OpsShell>
  );
}
