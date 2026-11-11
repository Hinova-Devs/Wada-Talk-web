// Who sees what in /ops. Roles come from `ops_role()` (ops-api.md section 8).
export type OpsRole = "super_admin" | "teacher" | "finance";
export type OpsSection = "overview" | "lessons" | "organizations" | "staff" | "affiliates" | "finance";

/** The menu, in order; each entry lists the roles that see it. */
export const MENU: { id: OpsSection; href: string; label: string; icon: string; roles: OpsRole[] }[] = [
  { id: "overview", href: "/", label: "Overview", icon: "◧", roles: ["super_admin"] },
  { id: "lessons", href: "/lessons", label: "Lessons", icon: "▤", roles: ["super_admin", "teacher"] },
  { id: "organizations", href: "/organizations", label: "Organizations", icon: "▦", roles: ["super_admin"] },
  { id: "staff", href: "/staff", label: "Staff", icon: "◉", roles: ["super_admin"] },
  { id: "affiliates", href: "/affiliates", label: "Affiliates", icon: "⇄", roles: ["super_admin"] },
  { id: "finance", href: "/finance", label: "Finance", icon: "＄", roles: ["super_admin", "finance"] },
];
export const ROLE_LABELS: Record<OpsRole, string> = { super_admin: "Super admin", teacher: "Teacher", finance: "Finance" };
export const homeFor = (role: OpsRole) => (role === "super_admin" ? "/" : role === "teacher" ? "/lessons" : "/finance");

/** US-dollar cents shown as $1,234.50. */
export const usd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
/** "12.5" or "$1,200" typed by a person → cents; null when it isn't a positive amount. */
export const toCents = (v: string) => {
  const n = Number(v.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};
