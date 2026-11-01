import type { SupabaseClient } from "@supabase/supabase-js";
import { rows, type PortalRow } from "./data";

/** Reads for the org portal, through the Wada Backend contract (Wada Backend `DOC/dashboard-api.md`). Never reads tables. */
export type PortalData = {
  org: string; orgId: string; kind: string; role: "org_admin" | "teacher"; email: string;
  classes: PortalRow[]; overview?: PortalRow; skills: PortalRow[]; mistakes: PortalRow[]; students: PortalRow[];
  student?: PortalRow; seats?: PortalRow; warning: boolean;
};
export type PortalLoad = { gate: string } | { data: PortalData };

type Result = { data: unknown; failed: boolean };
async function rpc(client: SupabaseClient, name: string, args: Record<string, unknown>): Promise<Result> {
  const { data, error } = await client.rpc(name, args);
  return { data: error ? null : data, failed: !!error };
}

const s = (v: unknown) => (typeof v === "string" ? v : "");
const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
/** Skills come as 0–20; the UI shows 0–100. */
const pct = (v: unknown) => Math.round(n(v) * 5);

function lastActive(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "No activity yet";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}
const isInactive = (iso: unknown) => typeof iso !== "string" || !iso || Date.now() - new Date(iso).getTime() > 7 * 86400000;

export async function loadPortal(client: SupabaseClient, email: string, p: { range: string; classId: string; studentId: string }): Promise<PortalLoad> {
  const mine = await rpc(client, "my_orgs", {});
  if (mine.failed) return { gate: "We could not load your organization. Please try again." };
  const org = rows(mine.data)[0];
  if (!org) return { gate: "Your account is signed in, but it is not staff of any organization. Ask your organization admin to invite you." };

  const orgId = s(org.org_id), role = org.role === "admin" ? "org_admin" : "teacher";
  const classes: PortalRow[] = rows(org.classes).map(c => ({ ...c, class_name: c.name }));
  const days = p.range === "term" ? 90 : p.range === "4-weeks" ? 28 : 7, weeks = p.range === "term" ? 12 : p.range === "4-weeks" ? 4 : 2;
  const classId = classes.some(c => c.id === p.classId) ? p.classId : "";
  const targets = classId ? classes.filter(c => c.id === classId) : classes;
  let failed = false;
  const call = async (name: string, args: Record<string, unknown>) => { const r = await rpc(client, name, args); if (r.failed) failed = true; return r.data; };

  // Overview: the org for an admin looking at everything, otherwise the chosen class(es) added up.
  let total: PortalRow = {};
  if (role === "org_admin" && !classId) total = rows(await call("org_overview", { p_org: orgId, p_days: days }))[0] ?? {};
  else {
    const parts = await Promise.all(targets.map(c => call("class_overview", { p_class: c.id, p_days: days })));
    const list = parts.flatMap(rows);
    const sum = (k: string) => list.reduce((a, r) => a + n(r[k]), 0);
    const scored = list.filter(r => r.avg_score != null);
    total = { students: sum("students"), active_7d: sum("active_7d"), active_30d: sum("active_30d"), units_done: sum("units_done"), calls: sum("calls"),
      avg_score: scored.length ? scored.reduce((a, r) => a + n(r.avg_score), 0) / scored.length : null };
  }

  // Skills by week and the common mistakes, from every class in view.
  const skillRows = (await Promise.all(targets.map(c => call("class_skills", { p_class: c.id, p_weeks: weeks })))).flatMap(rows);
  const byWeek = new Map<string, PortalRow[]>();
  for (const r of skillRows) byWeek.set(s(r.week), [...(byWeek.get(s(r.week)) ?? []), r]);
  const weekly = [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([week, list]) => {
    const avg = (k: string) => list.reduce((a, r) => a + n(r[k]), 0) / list.length;
    return { week: week.slice(5), range: avg("range"), accuracy: avg("accuracy"), fluency: avg("fluency"), interaction: avg("interaction"), coherence: avg("coherence") };
  });
  const latest = weekly[weekly.length - 1];
  const skills = latest ? [{ vocabulary: pct(latest.range), grammar: pct(latest.accuracy), fluency: pct(latest.fluency), interaction: pct(latest.interaction), organization: pct(latest.coherence) }] : [];
  const merged = new Map<string, { category: string; student_count: number }>();
  for (const r of (await Promise.all(targets.map(c => call("class_mistakes", { p_class: c.id, p_days: days })))).flatMap(rows)) {
    const k = s(r.category), prev = merged.get(k) ?? { category: k, student_count: 0 };
    merged.set(k, { category: k, student_count: prev.student_count + n(r.learners) });
  }
  const mistakes = [...merged.values()].sort((a, b) => b.student_count - a.student_count);

  const overview: PortalRow = {
    org_name: s(org.name), students: n(total.students), active_students: n(p.range === "week" ? total.active_7d : total.active_30d),
    inactive_students: Math.max(0, n(total.students) - n(total.active_7d)), calls: n(total.calls), units_done: n(total.units_done),
    average_score: total.avg_score == null ? null : Math.round(n(total.avg_score)),
    average_score_per_week: weekly.map(w => ({ week: w.week, score: Math.round((w.range + w.accuracy + w.fluency + w.interaction + w.coherence) / 4 * 5) })),
  };

  // Students: each class roster, with the class name.
  const students = (await Promise.all(targets.map(async c => rows(await call("class_students", { p_class: c.id })).map(r => ({
    user_id: r.user_id, class_id: c.id, class_name: c.name, name: s(r.first_name) || "Student", latest_score: r.latest_score, score: r.latest_score,
    trend: r.latest_score != null && r.first_score != null ? (n(r.latest_score) - n(r.first_score) >= 0 ? "+" : "−") + Math.abs(Math.round(n(r.latest_score) - n(r.first_score))) : "—",
    units_done: n(r.units_done), calls: n(r.calls), last_active: lastActive(r.last_active), inactive: isInactive(r.last_active),
    current_unit: (r.current_unit as PortalRow | null)?.title,
  }))))).flat();

  let student: PortalRow | undefined;
  const chosen = students.find(x => x.user_id === p.studentId);
  if (chosen) {
    const d = rows(await call("student_detail", { p_class: chosen.class_id, p_user: chosen.user_id }))[0];
    if (d) {
      const units = rows(d.units);
      student = { ...chosen, score_history: rows(d.scores).map(x => ({ week: s(x.at).slice(0, 10), score: x.score })),
        can_do_items: units.filter(u => u.status === "done").map(u => s(u.title)), mistakes: rows(d.mistakes), activity: rows(d.activity) };
    }
  }

  let seats: PortalRow | undefined;
  if (role === "org_admin") {
    const staff = rows(await call("org_staff", { p_org: orgId }));
    const limits = classes.map(c => c.seat_limit);
    seats = { seats_used: classes.reduce((a, c) => a + n(c.students), 0), seats_total: limits.length && limits.every(l => l != null) ? limits.reduce<number>((a, l) => a + n(l), 0) : undefined,
      members: staff.map(m => ({ user_id: m.user_id, name: s(m.first_name) || s(m.email), email: m.email, role: m.role === "admin" ? "Organization admin" : "Teacher", classes: m.classes })) };
  }

  return { data: { org: s(org.name), orgId, kind: s(org.kind), role, email, classes, overview, skills, mistakes, students, student, seats, warning: failed } };
}
