import type { Metadata } from "next";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { StaffBoard, type StaffRow } from "@/components/ops/staff-board";
import { opsGate } from "@/lib/ops/gate";

export const metadata: Metadata = { title: "Staff" };
export const dynamic = "force-dynamic";

export default async function Staff() {
  const gate = await opsGate();
  if (!gate.allowed) return <NoAccess email={gate.email} role={gate.role} failed={gate.failed} />;
  const { data, error } = await gate.supabase.rpc("ops_staff_list");
  return (
    <OpsShell email={gate.email} role={gate.role} section="staff">
      <StaffBoard rows={(data ?? []) as StaffRow[]} loadFailed={!!error} />
    </OpsShell>
  );
}
