import SchoolAdmin from "@/components/school/school-admin";
export const metadata = { title: "School admin preview", robots: { index: false, follow: false } };
type Params = Promise<Record<string, string | string[] | undefined>>;
export default async function Page({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  return <SchoolAdmin section={typeof params.section === "string" ? params.section : "overview"} studentId={typeof params.student_id === "string" ? params.student_id : undefined} range={typeof params.range === "string" ? params.range : "week"} />;
}
