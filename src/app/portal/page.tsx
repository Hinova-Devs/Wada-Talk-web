import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/dashboard";
import { isPortalSection, rows, type PortalRow } from "@/lib/portal/data";
export const dynamic="force-dynamic";
type Params=Promise<Record<string,string|string[]|undefined>>;
function dates(range:string){const to=new Date();const from=new Date(to);from.setDate(to.getDate()-(range==="term"?89:range==="4-weeks"?27:6));return{from:from.toISOString().slice(0,10),to:to.toISOString().slice(0,10)}}
async function rpc(client:Awaited<ReturnType<typeof createClient>>,name:string,args:Record<string,unknown>){const{data,error}=await client.rpc(name,args);return{data:error?null:data,failed:!!error}}
function Gate({children}:{children:React.ReactNode}){return <main className="portal-gate"><section className="card"><div className="eyebrow">Wada organization portal</div><h1>Organization access is not ready</h1><p>{children}</p><Link className="button secondary" href="/login">Back to sign in</Link></section></main>}
export default async function Portal({searchParams}:{searchParams:Params}){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)redirect("/login");
 const client=await createClient();const{data:{user}}=await client.auth.getUser();if(!user)redirect("/login");
 const{data:member,error}=await client.from("memberships").select("org_id,role").eq("user_id",user.id).in("role",["teacher","org_admin"]).limit(1).maybeSingle();
 if(error||!member||!member.org_id||!["teacher","org_admin"].includes(member.role))return <Gate>Your account is signed in, but we could not verify an organization role. Ask your organization admin to invite you.</Gate>;
 const params=await searchParams;const raw=typeof params.section==="string"?params.section:"overview";const section=isPortalSection(raw)?raw:"overview";const r=typeof params.range==="string"?params.range:"week";const range=["week","4-weeks","term"].includes(r)?r:"week";
 const{from,to}=dates(range);const org_id=String(member.org_id);const cr=await rpc(client,"portal_classes",{org_id});const classes=rows(cr.data);
 const wanted=typeof params.class_id==="string"?params.class_id:"";const class_id=classes.some(c=>String(c.id??c.class_id)===wanted)?wanted:"";const args={org_id,class_id:class_id||null,from,to};
 const all=await Promise.all([rpc(client,"portal_overview",args),rpc(client,"portal_skills",args),rpc(client,"portal_mistakes",{...args,limit:10}),rpc(client,"portal_students",args),rpc(client,"portal_schedule",args),rpc(client,"portal_seats",{org_id}),rpc(client,"portal_reports",args),rpc(client,"portal_group_sessions",args)]);
 const[o,sk,mi,st,sc,se,re,gs]=all;const students=rows(st.data);const wantedStudent=typeof params.student_id==="string"?params.student_id:"";const selected=students.find(x=>String(x.user_id??x.id)===wantedStudent);let student:PortalRow|undefined;let studentFailed=false;
 if(selected&&wantedStudent){const detail=await rpc(client,"portal_student",{org_id,user_id:wantedStudent,class_id:class_id||null,from,to});student=rows(detail.data)[0];studentFailed=detail.failed}
 return <PortalDashboard data={{org:String(rows(o.data)[0]?.org_name??"Organization workspace"),role:String(member.role),email:user.email??"",classes,overview:rows(o.data)[0],skills:rows(sk.data),mistakes:rows(mi.data),students,student,schedule:rows(sc.data),seats:rows(se.data)[0],reports:rows(re.data),sessions:rows(gs.data),warning:cr.failed||all.some(x=>x.failed)||studentFailed}} section={section} classId={class_id} studentId={wantedStudent} range={range}/>;
}


