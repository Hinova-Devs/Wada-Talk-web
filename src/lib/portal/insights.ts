import {record, text, type PortalRow} from "./data";

function number(value: unknown): number | null {const parsed=Number(value);return Number.isFinite(parsed)?parsed:null;}

export type LearnerAlert={user_id:string;name:string;reasons:string[];lastActive:string};
export function learnerAlerts(students: PortalRow[], now=Date.now()): LearnerAlert[] {
 return students.flatMap(student=>{
  const reasons:string[]=[];
  const last=typeof student.last_active==="string"?Date.parse(student.last_active):NaN;
  const joined=typeof student.joined_at==="string"?Date.parse(student.joined_at):NaN;
  const activity=Number.isFinite(last)?last:joined;
  if(!Number.isFinite(last)) reasons.push("No activity recorded");
  else if(now-last>=7*86400000) reasons.push("Inactive for 7+ days");
  if(number(student.units_done)===0&&Number.isFinite(activity)&&now-activity>=3*86400000) reasons.push("No unit completed yet");
  const first=number(student.first_score),latest=number(student.latest_score);
  if(first!==null&&latest!==null&&latest<first) reasons.push("Latest score is below the first score");
  return reasons.length?[{user_id:text(student.user_id,""),name:text(student.first_name,"Learner"),reasons,lastActive:Number.isFinite(last)?String(student.last_active):"No activity"}]:[];
 });
}

export type LessonProgress={key:string;position:number|null;unit:string;learners:number;percent:number};
export function lessonProgress(students: PortalRow[]): LessonProgress[] {
 const groups=new Map<string,{position:number|null;unit:string;learners:number}>();
 for(const student of students){const current=record(student.current_unit);const position=number(current?.position);const unit=text(current?.title,"Not started");const key=`${position??"none"}:${unit}`;const found=groups.get(key);if(found)found.learners+=1;else groups.set(key,{position,unit,learners:1});}
 return [...groups].map(([key,value])=>({...value,key,percent:students.length?Math.round(value.learners/students.length*100):0})).sort((a,b)=>(a.position??Number.MAX_SAFE_INTEGER)-(b.position??Number.MAX_SAFE_INTEGER));
}

export function comparisonRows(overview: PortalRow|undefined, classes: PortalRow[]): PortalRow[] {
 const classRows=Array.isArray(overview?.classes)?overview.classes.filter((item):item is PortalRow=>!!item&&typeof item==="object"):[];
 return classRows.map(item=>{const id=String(item.id??item.class_id??"");const group=classes.find(candidate=>String(candidate.id)===id)||classes.find(candidate=>String(candidate.name)===String(item.name));return {...item,lecturer:text(group?.teacher_name,"Not assigned")};});
}
