import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NoAccess, OpsShell } from "@/components/ops/shell";
import { homeFor, usd } from "@/lib/ops/access";
import { opsGate } from "@/lib/ops/gate";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

type Overview = {
  units: Record<string, number>;
  orgs: number;
  staff: Record<string, number>;
  month_income_cents: number;
  month_out_cents: number;
  recent: { action: string; at: string; who: string; title: string | null }[];
};
const ACTIONS: Record<string, string> = {
  planned: "planned", generate_started: "started generating", generated: "finished generating", generate_failed: "had a failed generation of",
  published: "published", unpublished: "unpublished", removed: "removed", saved: "edited",
};
const when = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** The super admin's home: what the team is producing, who is active, this month's money. Other roles go to their own page. */
export default async function OpsHome() {
  const gate = await opsGate(["super_admin", "teacher", "finance"]);
  if (gate.role && gate.role !== "super_admin") redirect(homeFor(gate.role));
  if (!gate.allowed) return <NoAccess email={gate.email} role={gate.role} failed={gate.failed} />;
  const { data, error } = await gate.supabase.rpc("ops_overview");
  const o = data as Overview | null;
  const u = o?.units ?? {};
  const stats: [string, string | number, string][] = o
    ? [
        ["Published units", u.published ?? 0, `${u.draft ?? 0} drafts to review`],
        ["In progress", (u.planned ?? 0) + (u.generating ?? 0), `${u.planned ?? 0} planned · ${u.generating ?? 0} generating${u.failed ? ` · ${u.failed} failed` : ""}`],
        ["Organizations", o.orgs, "Universities and companies"],
        ["Team", (o.staff.teacher ?? 0) + (o.staff.finance ?? 0), `${o.staff.teacher ?? 0} teachers · ${o.staff.finance ?? 0} finance`],
        ["Income this month", usd(o.month_income_cents), `${usd(o.month_out_cents)} paid out`],
      ]
    : [];
  return (
    <OpsShell email={gate.email} role={gate.role} section="overview">
      <header className="oa-page-head">
        <div>
          <span>Super admin</span>
          <h1>Overview</h1>
          <p>Lessons, people and money across Hinova.</p>
        </div>
      </header>
      {error || !o ? (
        <div className="oa-empty">Could not load the overview. Refresh, or check that the latest backend migration is applied.</div>
      ) : (
        <>
          <div className="oa-stats">
            {stats.map(([label, value, caption], i) => (
              <article key={label} className={`oa-stat ${["green", "orange", "blue", "purple", "green"][i]}`}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{caption}</small>
              </article>
            ))}
          </div>
          <section className="oa-panel">
            <header className="oa-panel-head"><div><span>Latest</span><h2>Recent activity</h2></div></header>
            {o.recent.length === 0 ? (
              <div className="oa-empty">Nothing yet. Planned and generated units show up here.</div>
            ) : (
              <table className="oa-table">
                <tbody>
                  {o.recent.map((r, i) => (
                    <tr key={i}>
                      <td><b>{r.who}</b> {ACTIONS[r.action] ?? r.action} {r.title ? `“${r.title}”` : "a unit"}</td>
                      <td>{when(r.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </OpsShell>
  );
}
