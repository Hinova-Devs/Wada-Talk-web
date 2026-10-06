import {redirect} from "next/navigation";
import {isPortalSection} from "@/lib/portal/data";
export default async function UniversityAdminPreview({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {const params = await searchParams; const section = typeof params.section === "string" && isPortalSection(params.section) ? params.section : "overview"; redirect("/portal-preview?section=" + section);}
