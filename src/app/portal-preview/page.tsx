import {institutionType} from "@/lib/portal/institution";
import PortalDashboard from "@/components/portal/dashboard";
import {isPortalSection, type DashboardData, type Org} from "@/lib/portal/data";
export const metadata = {title: "Dashboard preview", robots: {index: false, follow: false}};
const org: Org = {org_id: "demo-org", name: "Demo University", role: "admin", classes: [{id: "demo-class", name: "ENG 201", teacher_name: "Ms. Sahra", seat_limit: 30, students: 2, has_code: false, code_expires_at: null}]};
const data: DashboardData = {institutionType: "university", profileAvailable: true, checkedAt: new Date("2026-10-06T10:00:00Z").getTime(), org, orgs: [org], email: "sahra@demo.wada.test", overview: {students: 2, active_7d: 1, active_30d: 2, units_done: 5, calls: 8, avg_score: null, with_streak: 1}, students: [{user_id: "demo-learner", first_name: "Amina", joined_at: "2026-09-01T10:00:00Z", current_unit: {position: 3, title: "Introductions"}, units_done: 2, last_active: "2026-10-05T10:00:00Z", calls: 4, first_score: null, latest_score: null, streak: 3}], student: {user_id: "demo-learner", first_name: "Amina", joined_at: "2026-09-01T10:00:00Z", streak: 3, units: [{position: 3, title: "Introductions", status: "in_progress", steps: 2, level: "A1"}], scores: [], mistakes: [], activity: [{day: "2026-10-05", points: 3}]}, skills: [], mistakes: [], staff: [{user_id: "demo-admin", first_name: "Sahra", email: "sahra@demo.wada.test", role: "admin", classes: [{id: "demo-class", name: "ENG 201"}]}], audit: [{at: "2026-10-01T10:00:00Z", action: "class_created", actor: "Sahra", target: null, class: "ENG 201", detail: null}], errors: []};
export default async function Preview({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
 const params = await searchParams;
 const section = typeof params.section === "string" && isPortalSection(params.section) ? params.section : "overview";
 const type = institutionType(params.type);
 const workspaceOrg: Org = type === "school" ? {...org, name: "Demo School", classes: org.classes.map(group => ({...group, name: "Grade 8 · English A"}))} : org;
 return <PortalDashboard key={`${section}:${type}`} preview data={{...data, org: workspaceOrg, orgs: [workspaceOrg], institutionType: type}} section={section} classId="demo-class" studentId={typeof params.student_id === "string" ? params.student_id : ""} days={30}/>;
}
