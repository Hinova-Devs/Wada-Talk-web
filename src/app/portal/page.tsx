import Link from "next/link";
import {cookies} from "next/headers";
import {institutionType} from "@/lib/portal/institution";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/dashboard";
import {errorMessage, isPortalSection, record, rows, type Org, type PortalRow} from "@/lib/portal/data";
export const dynamic = "force-dynamic";
export const metadata = {title: "Wada for schools", robots: {index: false, follow: false}};
type Params = Promise<Record<string, string | string[] | undefined>>;
function currentTime() {return Date.now();}
function Gate({message}: {message: string}) {return <main className="portal-gate"><section className="card"><div className="eyebrow">Wada for schools</div><h1>Organization access</h1><p>{message}</p><Link className="button secondary" href="/login">Back to sign in</Link></section></main>;}
export default async function Portal({searchParams}: {searchParams: Params}) {
 if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
 const client = await createClient();
 const {data: {user}} = await client.auth.getUser();
 if (!user) redirect("/login");
 const {data, error} = await client.rpc("my_orgs");
 if (error) return <Gate message={errorMessage(error.message)}/>;
 const orgs = rows(data).filter(item => item.role === "admin" || item.role === "teacher").map(item => ({org_id: String(item.org_id), name: String(item.name), role: item.role, classes: rows(item.classes)})) as Org[];
 if (!orgs.length) return <Gate message="Ask your school admin to invite you"/>;
 const params = await searchParams;
 const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
 const org = orgs.find(item => item.org_id === value("org_id")) ?? orgs[0];
 const raw = value("section");
 let section = isPortalSection(raw) ? raw : "overview";
 if (org.role !== "admin" && ["team", "audit", "institution"].includes(section)) section = "overview";
 const selected = org.classes.find(item => item.id === value("class_id"));
 const requiresClass = ["class-detail", "students", "student-detail", "skills", "export", "join-codes"].includes(section) || org.role === "teacher";
 const classId = String((selected ?? (requiresClass ? org.classes[0] : undefined))?.id ?? "");
 const days = [7, 30, 90].includes(Number(value("days"))) ? Number(value("days")) : 30;
 const profile = await client.rpc("org_portal_profile", {p_org: org.org_id});
 const preference = (await cookies()).get("wada_institution_type")?.value;
 const workspaceType = institutionType(record(profile.data)?.institution_type ?? preference);
 const profileAvailable = !profile.error;
 const errors: string[] = [];
 if (profile.error && !["PGRST202", "42883"].includes(profile.error.code)) errors.push(errorMessage(profile.error.message));
 async function rpc(name: string, args: Record<string, unknown>) {const result = await client.rpc(name, args); if (result.error) errors.push(errorMessage(result.error.message)); return result.error ? undefined : result.data;}
 let overview: PortalRow | undefined;
 let students: PortalRow[] = [], skills: PortalRow[] = [], mistakes: PortalRow[] = [], staff: PortalRow[] = [], audit: PortalRow[] = [];
 if (["overview", "class-detail"].includes(section) && (classId || org.role === "admin")) overview = record(await rpc(classId ? "class_overview" : "org_overview", classId ? {p_class: classId, p_days: days} : {p_org: org.org_id, p_days: days}));
 if (classId && ["students", "student-detail", "class-detail", "export"].includes(section)) students = rows(await rpc("class_students", {p_class: classId}));
 if (classId && section === "skills") [skills, mistakes] = await Promise.all([rpc("class_skills", {p_class: classId, p_weeks: 8}).then(rows), rpc("class_mistakes", {p_class: classId, p_days: days}).then(rows)]);
 if (org.role === "admin" && ["team", "classes"].includes(section)) staff = rows(await rpc("org_staff", {p_org: org.org_id}));
 if (org.role === "admin" && section === "audit") audit = rows(await rpc("org_audit_log", {p_org: org.org_id, p_limit: 100}));
 const studentId = students.some(item => item.user_id === value("student_id")) ? value("student_id") : "";
 const student = classId && studentId && section === "student-detail" ? record(await rpc("student_detail", {p_class: classId, p_user: studentId})) : undefined;
 return <PortalDashboard key={`${org.org_id}:${classId}:${section}`} data={{institutionType: workspaceType, profileAvailable, checkedAt: currentTime(), org, orgs, email: user.email ?? "", overview, students, student, skills, mistakes, staff, audit, errors}} section={section} classId={classId} studentId={studentId} days={days}/>;
}
