import type { Metadata } from "next";
import Link from "next/link";
import { UnitEditor } from "@/components/ops/unit-editor";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { opsGate } from "@/lib/ops/gate";
import { UNIT_COLUMNS, type UnitRow } from "@/lib/ops/units";

export const metadata: Metadata = { title: "Edit unit" };
export const dynamic = "force-dynamic";

export default async function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const gate = await opsGate();
  if (!gate.allowed) return <NoAccess email={gate.email} failed={gate.failed} />;
  const { id } = await params;
  const { data, error } = /^[0-9a-f-]{36}$/i.test(id)
    ? await gate.supabase.from("units").select(UNIT_COLUMNS).eq("id", id).maybeSingle()
    : { data: null, error: null };
  const unit = data as unknown as UnitRow | null;
  return (
    <OpsShell email={gate.email} section="lessons">
      {unit ? (
        // A new version from the server (after save, publish or generation) starts the editor afresh.
        <UnitEditor key={unit.updated_at} unit={unit} />
      ) : (
        <div className="oa-page-head">
          <div>
            <span>Lessons</span>
            <h1>{error ? "Could not load this unit" : "Unit not found"}</h1>
            <p>{error ? "The server did not answer. Refresh the page to try again." : "It may have been removed."}</p>
            <p><Link className="oa-link" href="/lessons">← Back to the course plan</Link></p>
          </div>
        </div>
      )}
    </OpsShell>
  );
}
