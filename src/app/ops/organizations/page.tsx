import type { Metadata } from "next";
import { OrgsBoard } from "@/components/ops/orgs-board";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { opsGate } from "@/lib/ops/gate";
import type { OrgRow } from "@/lib/ops/orgs";

export const metadata: Metadata = { title: "Organizations" };
export const dynamic = "force-dynamic";

export default async function Organizations() {
  const gate = await opsGate();
  if (!gate.allowed) return <NoAccess email={gate.email} role={gate.role} failed={gate.failed} />;
  const { data, error } = await gate.supabase.rpc("ops_orgs");
  return (
    <OpsShell email={gate.email} role={gate.role} section="organizations">
      <OrgsBoard rows={(data ?? []) as OrgRow[]} loadFailed={!!error} />
    </OpsShell>
  );
}
