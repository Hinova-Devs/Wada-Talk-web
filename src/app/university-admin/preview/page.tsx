import {redirect} from "next/navigation";
type Params=Promise<Record<string,string|string[]|undefined>>;
const sections=["overview","classes","class-detail","students","student-detail","skills","talk-hours","discussions","reports","export","team","settings"];
export default async function UniversityAdminPreview({searchParams}:{searchParams:Params}){const params=await searchParams;const requested=typeof params.section==="string"&&sections.includes(params.section)?params.section:"overview";redirect("/portal-preview?section="+requested)}
