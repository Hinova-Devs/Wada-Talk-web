import PortalDashboard from "@/components/portal/dashboard";
import { isPortalSection, type PortalRow } from "@/lib/portal/data";
export const metadata={title:"Organization portal preview",robots:{index:false,follow:false}};
type Params=Promise<Record<string,string|string[]|undefined>>;
// Fake data in the same shape `loadPortal` (src/lib/portal/backend.ts) builds from the backend. 255 students, same every load.
let seed=7;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};const pick=<T,>(a:T[])=>a[Math.floor(rnd()*a.length)];
const first=["Amina","Abdi","Hodan","Omar","Fadumo","Ayaan","Mohamed","Ifrah","Yusuf","Sahra","Hamza","Maryan","Ahmed","Khadra","Ismail","Nasra","Abdirahman","Sagal","Liban","Zeynab","Bilal","Hibo","Guled","Deqa","Mustafe"];
const last=["Ali","Hassan","Ahmed","Mohamud","Jama","Farah","Warsame","Osman","Abdillahi","Nur","Duale","Hersi"];
const classes:PortalRow[]=[["2A","Ms. Sahra"],["2B","Mr. Abdi"],["3A","Ms. Hodan"],["3B","Mr. Omar"],["4A","Ms. Fadumo"],["4B","Mr. Yusuf"],["5A","Ms. Maryan"],["5B","Mr. Guled"]].map(([n,t],i)=>({id:"class-"+i,name:"Class "+n,class_name:"Class "+n,teacher_name:t,students:0,seat_limit:40,has_code:i%3!==0,code_expires_at:"2026-12-01T00:00:00Z"}));
const ago=(d:number)=>d<=0?"Today":d===1?"Yesterday":d+" days ago";
const students:PortalRow[]=Array.from({length:255},(_,i)=>{
  const c=classes[i%classes.length];c.students=(c.students as number)+1;
  const idle=rnd()<0.14,none=rnd()<0.04,days=none?-1:idle?8+Math.floor(rnd()*20):Math.floor(rnd()*7);
  const firstScore=35+Math.floor(rnd()*30),gain=Math.floor(rnd()*28)-(rnd()<0.1?5:0),score=none?null:Math.min(98,firstScore+gain);
  return {user_id:"student-"+i,class_id:c.id,class_name:c.class_name,name:pick(first)+" "+pick(last),latest_score:score,score,first_score:none?null:firstScore,trend:none?"—":(gain>=0?"+":"")+gain,units_done:none?0:1+Math.floor(rnd()*16),calls:none?0:Math.floor(rnd()*22),last_active:none?"No activity yet":ago(days),inactive:none||idle};
});
const sum=(l:PortalRow[],k:string)=>l.reduce((a,r)=>a+(Number(r[k])||0),0);
const scored=(l:PortalRow[])=>l.filter(s=>s.score!=null);
const avg=(l:PortalRow[])=>scored(l).length?Math.round(sum(scored(l),"score")/scored(l).length):0;
export default async function Page({searchParams}:{searchParams:Params}){
  const params=await searchParams;const one=(k:string)=>typeof params[k]==="string"?String(params[k]):"";
  const section=isPortalSection(one("section"))?(one("section") as Parameters<typeof PortalDashboard>[0]["section"]):"overview";
  const range=["week","4-weeks","term"].includes(one("range"))?one("range"):"week";
  const classId=classes.some(c=>c.id===one("class_id"))?one("class_id"):"";const studentId=one("student_id");
  const list=classId?students.filter(s=>s.class_id===classId):students;const a=avg(list);
  const found=students.find(s=>s.user_id===studentId);
  const student:PortalRow|undefined=found?{...found,score_history:[0,1,2,3].map(w=>({week:"2026-10-"+["05","12","19","26"][w],score:Math.max(20,Math.round(Number(found.first_score??50)+(Number(found.score??50)-Number(found.first_score??50))*(w/3)))})),can_do_items:["Introduce yourself clearly","Describe previous work experience","Ask a follow-up question"]}:undefined;
  const teacher=one("role")==="teacher";
  return <PortalDashboard preview data={{org:"Demo University",orgId:"demo-org",kind:"university",role:teacher?"teacher":"org_admin",email:teacher?"teacher@demo.wada.test":"admin@demo.wada.test",classes,
    overview:{students:list.length,active_students:list.filter(s=>!s.inactive).length,inactive_students:list.filter(s=>s.inactive).length,calls:sum(list,"calls"),units_done:sum(list,"units_done"),average_score:a,average_score_per_week:[["09-28",-16],["10-05",-9],["10-12",-4],["10-19",0]].map(([w,d])=>({week:w as string,score:Math.max(0,a+(d as number))}))},
    skills:[{vocabulary:64,grammar:57,fluency:66,interaction:72,organization:70}],
    mistakes:[{category:"Past tense",student_count:142},{category:"Articles",student_count:117},{category:"Prepositions",student_count:96},{category:"Word order",student_count:61}],
    students:list,student,
    seats:teacher?undefined:{seats_used:255,seats_total:300,members:[{user_id:"m1",name:"Sahra",email:"sahra@demo.wada.test",role:"Organization admin"},{user_id:"m2",name:"Abdi",email:"abdi@demo.wada.test",role:"Teacher"},{user_id:"m3",name:"Hodan",email:"hodan@demo.wada.test",role:"Teacher"}]},
    warning:false}} section={section} classId={classId} studentId={studentId} range={range}/>;
}
