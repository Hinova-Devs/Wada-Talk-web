import type {InstitutionType} from "./institution";
export const portalSections = [["overview", "Overview"], ["classes", "Classes"], ["class-detail", "Class detail"], ["students", "Students"], ["student-detail", "Student detail"], ["skills", "Skills and mistakes"], ["join-codes", "Student join codes"], ["export", "CSV export"], ["team", "Staff"], ["audit", "Audit log"], ["institution", "Institution"]] as const;
export type PortalSection = (typeof portalSections)[number][0];
export type PortalRow = Record<string, unknown>;
export type Role = "admin" | "teacher";
export type Org = {org_id: string; name: string; role: Role; classes: PortalRow[]};
export type DashboardData = {institutionType: InstitutionType; profileAvailable: boolean; checkedAt: number; org: Org; orgs: Org[]; email: string; overview?: PortalRow; students: PortalRow[]; student?: PortalRow; skills: PortalRow[]; mistakes: PortalRow[]; staff: PortalRow[]; audit: PortalRow[]; errors: string[]};
export function rows(value: unknown): PortalRow[] {return Array.isArray(value) ? value.filter((item): item is PortalRow => !!item && typeof item === "object") : [];}
export function record(value: unknown): PortalRow | undefined {return value && typeof value === "object" && !Array.isArray(value) ? value as PortalRow : undefined;}
export function text(value: unknown, fallback = "—"): string {return typeof value === "string" || typeof value === "number" ? String(value) : fallback;}
export function isPortalSection(value: string): value is PortalSection {return portalSections.some(([id]) => id === value);}
export function errorMessage(message: string): string {
 const errors: Record<string, string> = {not_authenticated: "Your session expired. Sign in again.", not_allowed: "You don't have access to this", not_in_class: "This learner is no longer in this class.", not_staff: "This person must be staff of the organization first.", bad_role: "Choose Teacher or Admin.", last_admin: "Make someone else admin first", name_required: "Enter a class name."};
 return Object.entries(errors).find(([code]) => message.includes(code))?.[1] ?? "We could not complete this request. Please try again.";
}
export function csv(students: PortalRow[]): string {
 const fields = ["user_id", "first_name", "joined_at", "current_unit_position", "current_unit_title", "units_done", "last_active", "calls", "first_score", "latest_score", "streak"];
 const escape = (value: unknown) => {let cell = text(value, ""); if (/^[\s]*[=+@-]/.test(cell)) cell = "'" + cell; return '"' + cell.replaceAll('"', '""') + '"';};
 return [fields.join(","), ...students.map(student => {const unit = record(student.current_unit); return fields.map(field => escape(field === "current_unit_position" ? unit?.position : field === "current_unit_title" ? unit?.title : student[field])).join(",");})].join("\r\n");
}
