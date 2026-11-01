import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/dashboard";
import { isPortalSection } from "@/lib/portal/data";
import { loadPortal } from "@/lib/portal/backend";
export const dynamic="force-dynamic";
type Params=Promise<Record<string,string|string[]|undefined>>;
function Gate({children}:{children:React.ReactNode}){return <main className="portal-gate"><section className="card"><div className="eyebrow">Wada organization portal</div><h1>Organization access is not ready</h1><p>{children}</p><Link className="button secondary" href="/login">Back to sign in</Link></section></main>}
export default async function Portal({searchParams}:{searchParams:Params}){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)redirect("/login");
 const client=await createClient();const{data:{user}}=await client.auth.getUser();if(!user)redirect("/login");
 const params=await searchParams;const one=(k:string)=>typeof params[k]==="string"?String(params[k]):"";
 const raw=one("section")||"overview";const section=isPortalSection(raw)?raw:"overview";const range=["week","4-weeks","term"].includes(one("range"))?one("range"):"week";
 const res=await loadPortal(client,user.email??"",{range,classId:one("class_id"),studentId:one("student_id")});
 if("gate" in res)return <Gate>{res.gate}</Gate>;
 return <PortalDashboard data={res.data} section={section} classId={one("class_id")} studentId={one("student_id")} range={range}/>;
}
