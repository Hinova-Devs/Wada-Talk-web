export type InstitutionType = "university" | "school";
export function institutionType(value: unknown): InstitutionType {return value === "school" ? "school" : "university";}
export const institutionLabels = {
 university: {name: "University", workspace: "University dashboard", groups: "Course groups", group: "Course group", staff: "Administrators", students: "Students", description: "Manage course groups, support lecturers and follow your students' English practice.", example: "ENG 201 · First-year cohort", icon: "🎓"},
 school: {name: "School", workspace: "School dashboard", groups: "Classes", group: "Class", staff: "Administrators", students: "Students", description: "Organize classes, support teachers and follow your students' English practice.", example: "Grade 8 · English A", icon: "🏫"},
} as const;
export function portalLabel(section: string, type: InstitutionType, fallback: string): string {
 const labels = institutionLabels[type];
 return section === "classes" ? labels.groups : section === "class-detail" ? `${labels.group} detail` : section === "team" ? labels.staff : section === "join-codes" ? "Student join codes" : section === "institution" ? "Institution" : fallback;
}
