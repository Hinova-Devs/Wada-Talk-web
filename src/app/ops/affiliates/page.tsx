import type { Metadata } from "next";
import { AffiliatesBoard, type AffiliateRow, type AffiliateSettings, type PayoutRequest } from "@/components/ops/affiliates-board";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { opsGate } from "@/lib/ops/gate";

export const metadata: Metadata = { title: "Affiliates" };
export const dynamic = "force-dynamic";

export default async function Affiliates() {
  const gate = await opsGate();
  if (!gate.allowed) return <NoAccess email={gate.email} role={gate.role} failed={gate.failed} />;
  const [rows, requests, settings] = await Promise.all([
    gate.supabase.rpc("ops_affiliates"),
    gate.supabase.rpc("ops_affiliate_requests"),
    gate.supabase.rpc("ops_affiliate_settings"),
  ]);
  return (
    <OpsShell email={gate.email} role={gate.role} section="affiliates">
      <AffiliatesBoard
        rows={(rows.data ?? []) as AffiliateRow[]}
        requests={(requests.data ?? []) as PayoutRequest[]}
        settings={(settings.data ?? null) as AffiliateSettings | null}
        loadFailed={!!(rows.error || requests.error || settings.error)}
      />
    </OpsShell>
  );
}
