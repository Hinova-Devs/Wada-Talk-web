"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Section = "overview" | "classes" | "students" | "student-detail" | "progress" | "skills" | "activity" | "reports" | "export" | "team" | "settings";
const sections: [Section, string, string][] = [
  ["classes", "Forms and streams", "▦"], ["students", "Students", "♙"], ["progress", "App progress", "◒"],
  ["skills", "Skills and mistakes", "◉"], ["activity", "App activity", "◷"], ["reports", "Reports", "◇"],
  ["export", "Export", "⇩"], ["team", "School team", "♧"], ["settings", "Settings", "⚙"],
];
const learningNav = ["classes", "students", "student-detail"];
const progressNav = ["progress", "skills", "activity"];
const adminNav = ["reports", "export", "team", "settings"];
const titles: Record<Section, string> = { overview: "Overview", classes: "Forms and streams", students: "Students", "student-detail": "Student progress", progress: "App progress", skills: "Skills and mistakes", activity: "App activity", reports: "Reports", export: "Export", team: "School team", settings: "Settings" };
const descriptions: Record<Section, string> = {
  overview: "Follow how students in Forms 1–4 use Wada and build their speaking skills.",
  classes: "Organize students by Form and stream, then link each school group to its Wada speaking-practice group.",
  students: "Find a student and open their Wada learning progress.",
  "student-detail": "Review one student’s app activity, skill progress and recent practice.",
  progress: "Review student activity and learning progress over a selected period.",
  skills: "See school-group learning patterns from Wada skill scores and mistake categories.",
  activity: "Review speaking minutes, completed units and recent app use.",
  reports: "Review school-level summaries of student learning in Wada.",
  export: "Prepare a school report from connected Wada learning records.",
  team: "Manage who can view school forms, streams and learning progress.",
  settings: "Connect Forms 1–4 and streams to Wada speaking-practice groups.",
};
type Props = { section: string; studentId?: string; range?: string };

function Panel({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return <section className="oa-panel"><header className="oa-panel-head"><div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div></header>{children}</section>;
}
function NoData({ detail = "School data is not connected yet." }: { detail?: string }) {
  return <div className="sch-empty"><span aria-hidden="true">↗</span><b>{detail}</b><p>School Form/stream records and Wada speaking-practice groups are separate. They will be linked to student records when the school data connection is ready.</p><Link href="/school-admin/preview?section=settings">Review connection setup →</Link></div>;
}
function Notice() {
  return <div className="sch-notice"><span><b>School workspace</b><span>Progress is sourced from students’ Wada app activity. School data is not connected yet.</span></span><span className="sch-term">Forms 1–4</span></div>;
}
function NavGroup({ label, ids, section }: { label: string; ids: string[]; section: Section }) {
  const items = sections.filter(([id]) => ids.includes(id));
  return <details className="oa-nav-group sch-nav-group" open={items.some(([id]) => id === section)}>
    <summary>{label}</summary><div>{items.map(([id, name, icon]) => <Link key={id} href={`/school-admin/preview?section=${id}`} className={`oa-nav-link${section === id ? " active" : ""}`} aria-current={section === id ? "page" : undefined}><i>{icon}</i>{name}</Link>)}</div>
  </details>;
}

export default function SchoolAdmin({ section: requested, studentId, range = "week" }: Props) {
  const router = useRouter();
  const valid = new Set<string>(sections.map(([id]) => id).concat("overview", "student-detail"));
  const section = (valid.has(requested) ? requested : "overview") as Section;
  const selectedRange = ["week", "4-weeks", "term"].includes(range) ? range : "week";
  const navigate = (target: Section) => router.push(`/school-admin/preview?section=${target}`);
  return <div className="portal-shell oa-shell sch-shell">
    <aside className="portal-sidebar oa-sidebar sch-sidebar">
      <Link href="/" className="wordmark"><Image src="/assets/fox-tile.webp" width={36} height={36} alt=""/><span>wada</span></Link>
      <div className="oa-side-org sch-school"><small>SCHOOL WORKSPACE</small><strong>Secondary school · Forms 1–4</strong></div>
      <nav className="oa-nav sch-nav" aria-label="School portal sections">
        <Link href="/school-admin/preview?section=overview" className={`oa-nav-link${section === "overview" ? " active" : ""}`} aria-current={section === "overview" ? "page" : undefined}><i>⌂</i>Overview</Link>
        <NavGroup label="School register" ids={learningNav} section={section}/>
        <NavGroup label="App progress" ids={progressNav} section={section}/>
        <NavGroup label="School" ids={adminNav} section={section}/>
      </nav>
      <div className="oa-side-footer sch-side-footer"><span>LEARNING DATA</span><b>App progress only</b></div>
    </aside>
    <main className="portal-content oa-main sch-main">
      <header className="oa-topbar"><div><span>Wada</span><b>/</b><strong>School</strong><b>/</b><strong>{titles[section]}</strong></div><div className="sch-top-actions">{["progress", "skills", "activity"].includes(section) && <label>Period<select value={selectedRange} onChange={e => router.push(`/school-admin/preview?section=${section}&range=${e.target.value}`)}><option value="week">This week</option><option value="4-weeks">Last 4 weeks</option><option value="term">This term</option></select></label>}<span className="sch-profile-label">Secondary school</span></div></header>
      <div className="oa-mobile-nav"><label>Go to section<select value={section} onChange={e => navigate(e.target.value as Section)}>{[["overview", "Overview"], ...sections.map(([id, name]) => [id, name])].map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label></div>
      <header className="oa-page-head"><div><span>SECONDARY SCHOOL · FORMS 1–4</span><h1>{titles[section]}</h1><p>{descriptions[section]}</p></div></header>
      <Notice/>
      {section === "overview" && <>
        <div className="oa-stats">{[["Active students", "—"], ["Minutes spoken", "—"], ["Live Talks", "—"], ["Units completed", "—"]].map(([label, value], i) => <article key={label} className={`oa-stat ${["orange", "blue", "green", "purple"][i]}`}><span>{label}</span><strong>{value}</strong><small>Shown when school app data is connected</small></article>)}</div>
        <div className="oa-dashboard-grid"><Panel title="Student learning progress" eyebrow="WADA APP"><NoData detail="No Wada practice groups are linked to school streams."/></Panel><Panel title="Skills students are practising" eyebrow="SCHOOL-GROUP LEARNING PATTERNS"><NoData detail="No skill scores are available yet."/></Panel><Panel title="Forms 1–4 and streams" eyebrow="SCHOOL REGISTER"><NoData detail="No Form or stream records are connected."/></Panel><Panel title="Student follow-up" eyebrow="APP ACTIVITY"><NoData detail="No app activity is available yet."/></Panel></div>
      </>}
      {section === "classes" && <div className="oa-dashboard-grid"><Panel title="School structure" eyebrow="FORM → STREAM → STUDENT"><p className="sch-field-list">The school register groups students by Form 1, Form 2, Form 3 or Form 4, then by the school’s own stream or homeroom.</p><NoData detail="No school Form and stream records are connected."/></Panel><Panel title="Wada speaking-practice groups" eyebrow="APP GROUP → STUDENT ACTIVITY"><p className="sch-field-list">A Wada group is a practice cohort inside the learning app. Link it to a school Form/stream when they represent the same learners; keep the two records distinct.</p><NoData detail="No Wada practice groups are linked yet."/></Panel></div>}
      {section === "students" && <Panel title="Student records" eyebrow="WADA APP PROGRESS"><NoData detail="No student records are connected."/></Panel>}
      {section === "student-detail" && <Panel title="Student learning progress" eyebrow={studentId ? "WADA STUDENT RECORD" : "STUDENT PROFILE"}><NoData detail={studentId ? "This student is not available in connected school data." : "Choose a student from the Students list to view their progress."}/></Panel>}
      {section === "progress" && <div className="oa-dashboard-grid"><Panel title="App use over time" eyebrow="STUDENT ENGAGEMENT"><NoData detail="No Wada activity data is connected."/></Panel><Panel title="Progress by Form and stream" eyebrow="SCHOOL REGISTER GROUPS"><NoData detail="No student progress can be grouped by Form and stream yet."/></Panel></div>}
      {section === "skills" && <div className="oa-dashboard-grid"><Panel title="Speaking skills" eyebrow="APP SKILL SCORES"><p className="sch-field-list">When connected, this view uses Wada’s skill measures: vocabulary, grammar, fluency, interaction and organization. School totals are grouped by Form/stream; Wada practice groups remain a separate app grouping.</p><NoData detail="No student skill scores are connected."/></Panel><Panel title="Mistake patterns" eyebrow="AGGREGATE LEARNING SUPPORT"><p className="sch-field-list">Only aggregated mistake categories are planned here. Recordings and full transcripts are not part of this school view.</p><NoData detail="No school-group mistake patterns are connected."/></Panel></div>}
      {section === "activity" && <Panel title="Student app activity" eyebrow="WADA USAGE"><p className="sch-field-list">For {selectedRange === "week" ? "this week" : selectedRange === "4-weeks" ? "the last four weeks" : "this term"}, the app can show speaking minutes, completed units and last active time, matching the Wada student progress records.</p><NoData detail="No student activity records are connected."/></Panel>}
      {section === "reports" && <Panel title="School learning reports" eyebrow="CONNECTED APP RECORDS"><NoData detail="Reports will be available after school classes are connected."/></Panel>}
      {section === "export" && <Panel title="Export school progress" eyebrow="PRIVACY-SAFE SUMMARY"><p className="sch-field-list">Exports are limited to learning scores, progress, aggregated skill patterns and app usage. Audio recordings and full transcripts are excluded.</p><NoData detail="There are no connected records to export."/></Panel>}
      {section === "team" && <Panel title="School team access" eyebrow="ROLE-BASED ACCESS"><p className="sch-field-list">The school team and its access rules will appear after school membership is connected. The current workspace does not have a school roster.</p><NoData detail="No school team is connected."/></Panel>}
      {section === "settings" && <Panel title="Connect this school to Wada" eyebrow="SCHOOL SETUP"><div className="sch-setup"><span className="sch-setup-step">1</span><div><b>Connect the school workspace</b><p>A school account and data connection are not configured in this project yet.</p></div><Badge>Not connected</Badge><span className="sch-setup-step">2</span><div><b>Map school Forms and streams to Wada practice groups</b><p>Keep school enrolment (Form/stream) distinct from the student’s app practice group; link both through each student record.</p></div><Badge>Waiting for connection</Badge><span className="sch-setup-step">3</span><div><b>Choose school staff access</b><p>Staff permissions will be applied when the school sign-in and backend are set up.</p></div><Badge>Waiting for connection</Badge></div></Panel>}
      <footer className="oa-footer sch-footer">School workspace <span>Progress and skill patterns only. No recordings or full transcripts.</span></footer>
    </main>
  </div>;
}
function Badge({ children }: { children: ReactNode }) { return <span className="sch-status">{children}</span>; }
