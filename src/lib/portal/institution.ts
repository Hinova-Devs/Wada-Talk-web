export type InstitutionType = "university";
// Normalize legacy preferences to the university-only workspace.
export function institutionType(value: unknown): InstitutionType {void value; return "university";}
export const institutionLabels = {
 university: {name: "University", workspace: "University dashboard", groups: "Course groups", group: "Course group", staff: "Administrators", students: "Students", description: "Manage course groups, support lecturers and follow your students' English practice.", example: "ENG 201 · First-year cohort", icon: "🎓"},
} as const;
export function portalLabel(section: string, type: InstitutionType, fallback: string): string {
 const labels = institutionLabels[type];
 return section === "classes" ? labels.groups : section === "class-detail" ? `${labels.group} detail` : section === "team" ? "Staff controls" : section === "analytics" ? "Course comparison" : section === "join-codes" ? "Student join codes" : section === "institution" ? "University" : fallback;
}
