"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {errorMessage,text,type PortalRow} from "@/lib/portal/data";
import {validManagerPassword} from "@/lib/portal/management";
export function ClassCreate({orgId,staff,groupLabel,example,preview}: {orgId:string;staff:PortalRow[];groupLabel:string;example:string;preview:boolean}) {
 const router=useRouter();const [mode,setMode]=useState("new");const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const [classId,setClassId]=useState("");const [password,setPassword]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;const form=new FormData(event.currentTarget);const name=String(form.get("name")).trim(),managerName=String(form.get("manager_name")).trim(),email=String(form.get("manager_email")||"").trim().toLowerCase();
  if(mode==="new"&&!validManagerPassword(password)){setNotice("Use 12–128 characters, including upper/lowercase letters, a number and a symbol.");return;}
  setBusy(true);setNotice("");let saved=classId;
  try{
   if(preview){setNotice("Sample class and English Teacher details validated. No account or live class was created.");return;}
   const client=createClient();const limit=String(form.get("seat_limit")||"");const seats=limit?Number(limit):null;
   if(!saved){const {data,error}=await client.rpc("create_class",{p_org:orgId,p_name:name,p_seat_limit:seats});if(error){setNotice(errorMessage(error.message));return;}if(typeof data!=="string"){setNotice("No class ID returned. Refresh the class list before trying again.");return;}saved=data;setClassId(saved);}
   const {error:updateError}=await client.rpc("update_class",{p_class:saved,p_name:name,p_teacher_name:managerName||null,p_seat_limit:seats});if(updateError){setNotice(`Class saved. ${errorMessage(updateError.message)} Retry to complete its details.`);return;}
   if(mode==="existing"){
    const {error}=await client.rpc("assign_teacher",{p_class:saved,p_user:String(form.get("manager_id")),p_on:true});if(error){setNotice(`Class saved. ${errorMessage(error.message)} Retry to assign its English Teacher.`);return;}
   }else{
    const {data,error}=await client.functions.invoke("provision-class-manager",{body:{org_id:orgId,class_id:saved,name:managerName,email,password}});
    if(error||data?.error){let message=data?.error?.message||"Could not create the English Teacher. Check the provision-class-manager deployment.";
     if(error&&"context" in error&&error.context instanceof Response){const result=await error.context.json().catch(()=>null);if(typeof result?.error?.message==="string")message=result.error.message;}
     setNotice(`Class saved. ${message} Retry completes this same class; it will not create another.`);router.refresh();return;}
   }
   setPassword("");setClassId("");setNotice(mode === "new" ? "Class created and English Teacher assigned. They can sign in with their email and password." : "Class created and existing English Teacher assigned. Their sign-in details are unchanged.");router.refresh();
  }catch{setNotice(saved?"Class saved. Connection failed during setup. Retry to finish this same class.":"Connection failed. Please try again.");}finally{setBusy(false);}
 }
 return <section className="oa-panel"><header className="oa-panel-head"><h2>Create {groupLabel.toLowerCase()} & English Teacher</h2></header><p>The Super Admin fills in the class and its administrator here. This administrator sees assigned classes only.</p><form className="oa-class-setup" onSubmit={e=>void submit(e)}><fieldset disabled={busy}><div className="oa-setup-grid"><label>{groupLabel} name<input name="name" required minLength={2} placeholder={example}/></label><label>Student capacity (optional)<input name="seat_limit" type="number" min="1" step="1"/></label></div><label>English Teacher assignment<select value={mode} onChange={e=>setMode(e.target.value)}><option value="new">Create new English Teacher with email & password</option><option value="existing">Assign existing English Teacher</option></select></label><label>English Teacher name<input name="manager_name" required minLength={2} maxLength={100}/></label>{mode==="new"?<div className="oa-setup-grid"><label>English Teacher email<input name="manager_email" type="email" required maxLength={254} autoComplete="off"/></label><label>English Teacher password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={12} maxLength={128} autoComplete="new-password"/><small>12+ characters, uppercase, lowercase, a number and a symbol. Share it securely with the English Teacher.</small></label></div>:<label>Existing staff<select name="manager_id" required defaultValue=""><option value="" disabled>Select staff</option>{staff.filter(member=>member.role==="teacher").map(member=><option key={String(member.user_id)} value={String(member.user_id)}>{text(member.first_name)} · {text(member.email)}</option>)}</select></label>}<button className="oa-button primary" disabled={busy}>{busy?"Saving…":classId?"Complete this class setup":"Create class & English Teacher"}</button></fieldset></form>{notice&&<p role="status" className="oa-message">{notice}</p>}</section>;
}
