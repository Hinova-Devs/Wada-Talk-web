import {notFound} from "next/navigation";
import PortalDashboard from "@/components/portal/dashboard";
import { isPortalSection, type PortalRow } from "@/lib/portal/data";
export const metadata={title:"Organization portal preview",robots:{index:false,follow:false}};
type Params=Promise<Record<string,string|string[]|undefined>>;
// Sample data in the same shape `loadPortal` (src/lib/portal/backend.ts) builds from the backend.
const classes:PortalRow[]=[
  {id:"class-2b",name:"Class 2B",class_name:"Class 2B",teacher_name:"Ms. Sahra",students:3,seat_limit:30,has_code:true,code_expires_at:"2026-12-01T00:00:00Z"},
  {id:"class-3a",name:"Class 3A",class_name:"Class 3A",teacher_name:"Mr. Abdi",students:2,seat_limit:30,has_code:false,code_expires_at:null},
];
const students:PortalRow[]=[
  {user_id:"student-a",class_id:"class-2b",class_name:"Class 2B",name:"Amina",latest_score:74,score:74,first_score:48,trend:"+26",units_done:8,calls:12,last_active:"Today",inactive:false,current_unit:"Describe your work experience"},
  {user_id:"student-b",class_id:"class-2b",class_name:"Class 2B",name:"Abdi",latest_score:68,score:68,first_score:50,trend:"+18",units_done:6,calls:9,last_active:"Yesterday",inactive:false},
  {user_id:"student-c",class_id:"class-3a",class_name:"Class 3A",name:"Hodan",latest_score:61,score:61,first_score:58,trend:"+3",units_done:5,calls:6,last_active:"3 days ago",inactive:false},
  {user_id:"student-d",class_id:"class-3a",class_name:"Class 3A",name:"Omar",latest_score:54,score:54,first_score:54,trend:"+0",units_done:2,calls:2,last_active:"9 days ago",inactive:true},
  {user_id:"student-e",class_id:"class-2b",class_name:"Class 2B",name:"Fadumo",latest_score:null,score:null,first_score:null,trend:"—",units_done:1,calls:0,last_active:"No activity yet",inactive:true},
];
const student:PortalRow={...students[0],score_history:[{week:"2026-09-28",score:48},{week:"2026-10-05",score:55},{week:"2026-10-12",score:61},{week:"2026-10-19",score:74}],can_do_items:["Introduce yourself clearly","Describe previous work experience","Ask a follow-up question"]};
export default async function Page({searchParams}:{searchParams:Params}){
  const params=await searchParams; // awaited first so the page stays dynamic and the flag is read at request time
  if(process.env.NODE_ENV==="production"&&process.env.ALLOW_PORTAL_PREVIEW!=="1")notFound();const one=(k:string)=>typeof params[k]==="string"?String(params[k]):"";
  const section=isPortalSection(one("section"))?(one("section") as Parameters<typeof PortalDashboard>[0]["section"]):"overview";
  const range=["week","4-weeks","term"].includes(one("range"))?one("range"):"week";
  const classId=classes.some(c=>c.id===one("class_id"))?one("class_id"):"";const studentId=one("student_id");
  const list=classId?students.filter(s=>s.class_id===classId):students;
  return <PortalDashboard preview data={{org:"Demo University",orgId:"demo-org",kind:"university",role:one("role")==="teacher"?"teacher":"org_admin",email:one("role")==="teacher"?"teacher@demo.wada.test":"admin@demo.wada.test",classes,
    overview:{students:5,active_students:3,inactive_students:2,calls:29,units_done:22,average_score:64,average_score_per_week:[{week:"09-28",score:48},{week:"10-05",score:55},{week:"10-12",score:61},{week:"10-19",score:64}]},
    skills:[{vocabulary:64,grammar:57,fluency:66,interaction:72,organization:70}],
    mistakes:[{category:"Past tense",student_count:4},{category:"Articles",student_count:3},{category:"Prepositions",student_count:2}],
    students:list,student:studentId?student:undefined,
    seats:one("role")==="teacher"?undefined:{seats_used:5,seats_total:60,members:[{user_id:"m1",name:"Sahra",email:"sahra@demo.wada.test",role:"Organization admin"},{user_id:"m2",name:"Abdi",email:"abdi@demo.wada.test",role:"Teacher"}]},
    warning:false}} section={section} classId={classId} studentId={studentId} range={range}/>;
}
