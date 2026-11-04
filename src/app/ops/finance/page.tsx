import type { Metadata } from "next";
import { FinanceBoard, type FinanceRow } from "@/components/ops/finance-board";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { opsGate } from "@/lib/ops/gate";

export const metadata: Metadata = { title: "Finance" };
export const dynamic = "force-dynamic";

/** `?month=2026-11` (default: this month) → first and last day, as the database expects dates. */
function monthRange(raw?: string) {
  const m = /^\d{4}-(0[1-9]|1[0-2])$/.test(raw ?? "") ? raw! : new Date().toISOString().slice(0, 7);
  const [y, mo] = m.split("-").map(Number);
  return { month: m, from: `${m}-01`, to: `${m}-${String(new Date(y, mo, 0).getDate()).padStart(2, "0")}` };
}

export default async function Finance({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const gate = await opsGate(["super_admin", "finance"]);
  if (!gate.allowed) return <NoAccess email={gate.email} role={gate.role} failed={gate.failed} />;
  const { month, from, to } = monthRange((await searchParams).month);
  const { data, error } = await gate.supabase.rpc("ops_finance_list", { p_from: from, p_to: to });
  return (
    <OpsShell email={gate.email} role={gate.role} section="finance">
      <FinanceBoard key={month} month={month} rows={(data ?? []) as FinanceRow[]} loadFailed={!!error} />
    </OpsShell>
  );
}
