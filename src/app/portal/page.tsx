import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/dashboard";
import {errorMessage, isPortalSection, record, rows, type Org, type PortalRow} from "@/lib/portal/data";
export const dynamic = "force-dynamic";
export const metadata = {title: "Wada for universities", robots: {index: false, follow: false}};
type Params = Promise<Record<string, string | string[] | undefined>>;
function currentTime() {return Date.now();}
function Gate({message}: {message: string}) {return <main className="portal-gate"><section className="card"><div className="eyebrow">Wada for universities</div><h1>University access</h1><p>{message}</p><Link className="button secondary" href="/login">Back to sign in</Link></section></main>;}
export default async function Portal({searchParams}: {searchParams: Params}) {
 if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect("/login");
 const client = await createClient();
 const [{data: {user}}, {data, error}] = await Promise.all([client.auth.getUser(), client.rpc("my_orgs")]);
 if (!user) redirect("/login");
 if (error) return <Gate message={errorMessage(error.message)}/>;
 const orgs = rows(data).filter(item => item.role === "admin" || item.role === "teacher").map(item => ({org_id: String(item.org_id), name: String(item.name), role: item.role, classes: rows(item.classes)})) as Org[];
 if (!orgs.length) return <Gate message="Ask your university administrator to invite you"/>;
 const params = await searchParams;
 const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
 const org = orgs.find(item => item.org_id === value("org_id")) ?? orgs[0];
 const raw = value("section");
 let section = isPortalSection(raw) ? raw : "overview";
 if (org.role !== "admin" && ["team", "audit", "institution", "analytics"].includes(section)) section = "overview";
 const selected = org.classes.find(item => item.id === value("class_id"));
 const requiresClass = ["class-detail", "students", "student-detail", "skills", "progress", "alerts", "reports", "join-codes"].includes(section) || org.role === "teacher";
 const classId = section === "analytics" ? "" : String((selected ?? (requiresClass ? org.classes[0] : undefined))?.id ?? "");
 const days = [7, 30, 90].includes(Number(value("days"))) ? Number(value("days")) : 30;
 const errors: string[] = [];
 async function rpc(name: string, args: Record<string, unknown>) {const result = await client.rpc(name, args); if (result.error) errors.push(errorMessage(result.error.message)); return result.error ? undefined : result.data;}
 let overview: PortalRow | undefined;
 let students: PortalRow[] = [], skills: PortalRow[] = [], mistakes: PortalRow[] = [], staff: PortalRow[] = [], audit: PortalRow[] = [];
 const requests: Promise<void>[] = [];
 if (["overview", "class-detail", "progress", "alerts", "reports", "analytics"].includes(section) && (classId || org.role === "admin")) requests.push(rpc(classId ? "class_overview" : "org_overview", classId ? {p_class: classId, p_days: days} : {p_org: org.org_id, p_days: days}).then(value => {overview = record(value);}));
 if (classId && ["overview", "students", "student-detail", "class-detail", "progress", "alerts", "reports"].includes(section)) requests.push(rpc("class_students", {p_class: classId}).then(value => {students = rows(value);}));
 if (classId && section === "skills") {
  requests.push(rpc("class_skills", {p_class: classId, p_weeks: 8}).then(value => {skills = rows(value);}));
  requests.push(rpc("class_mistakes", {p_class: classId, p_days: days}).then(value => {mistakes = rows(value);}));
 }
 if (org.role === "admin" && ["team", "classes", "analytics"].includes(section)) requests.push(rpc("org_staff", {p_org: org.org_id}).then(value => {staff = rows(value);}));
 if (org.role === "admin" && ["audit", "analytics"].includes(section)) requests.push(rpc("org_audit_log", {p_org: org.org_id, p_limit: section === "analytics" ? 10 : 100}).then(value => {audit = rows(value);}));
 await Promise.all(requests);
 const studentId = students.some(item => item.user_id === value("student_id")) ? value("student_id") : "";
 const student = classId && studentId && section === "student-detail" ? record(await rpc("student_detail", {p_class: classId, p_user: studentId})) : undefined;
 return <PortalDashboard key={`${org.org_id}:${classId}:${section}`} data={{institutionType: "university", checkedAt: currentTime(), org, orgs, email: user.email ?? "", overview, students, student, skills, mistakes, staff, audit, errors}} section={section} classId={classId} studentId={studentId} days={days}/>;
}
