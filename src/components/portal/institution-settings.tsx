"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {institutionLabels, type InstitutionType} from "@/lib/portal/institution";
export function InstitutionSettings({orgId, type, available, preview}: {orgId:string; type:InstitutionType; available:boolean; preview:boolean}) {
 const router=useRouter(); const [selected,setSelected]=useState(type); const [busy,setBusy]=useState(false); const [notice,setNotice]=useState("");
 async function save() {
  if(busy)return; setBusy(true);setNotice("");
  try {
   if(preview){router.push(`/portal-preview?section=institution&type=${selected}`);return;}
   if(!available){setNotice("Institution settings need the Supabase setup before they can be saved. Ask your project owner to apply the institution portal SQL.");return;}
   const {error}=await createClient().rpc("set_org_portal_profile",{p_org:orgId,p_type:selected});
   if(error){setNotice("Could not save institution settings. Only an organization admin can change these settings.");return;}
   setNotice("Institution type saved.");router.refresh();
  }catch{setNotice("Could not connect. Please try again.");}finally{setBusy(false);}
 }
 return <section className="oa-panel"><header className="oa-panel-head"><h2>Institution settings</h2></header><p>Your institution type controls the language and organization of your workspace.</p><fieldset className="institution-choice" disabled={busy}><legend>Institution type</legend>{(["university","school"] as const).map(value=><label className={selected===value?"selected":""} key={value}><input type="radio" name="workspace-type" checked={selected===value} onChange={()=>setSelected(value)}/><span className="institution-icon">{institutionLabels[value].icon}</span><strong>{institutionLabels[value].name}</strong><small>{institutionLabels[value].groups} · {institutionLabels[value].staff}</small></label>)}</fieldset><button className="oa-button primary" disabled={busy} onClick={()=>void save()}>{busy?"Saving…":"Save institution type"}</button>{!available&&<p className="oa-footnote">Pending Supabase setup. The current layout preference does not change staff permissions.</p>}{notice&&<p role="status">{notice}</p>}</section>;
}
