"use client";
import {useState} from "react";
import QRCode from "qrcode";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {errorMessage,record,text,type PortalRow} from "@/lib/portal/data";
export function JoinCodes({group,orgName,groupLabel,preview}: {group?:PortalRow;orgName:string;groupLabel:string;preview:boolean}) {
 const router=useRouter(); const [days,setDays]=useState(30);const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");
 const [generated,setGenerated]=useState<{code:string;expires:string;qr:string}|null>(null);
 async function change(revoke=false) {
  if(!group||busy)return;
  if((revoke||group.has_code||generated)&&!confirm(revoke?"Revoke the join code? Students will no longer be able to use it.":"Replace the current code? The previous code will stop working."))return;
  setBusy(true);setNotice("");setGenerated(null);
  try {
   const result=preview?{data:revoke?null:{code:"DEMO2468AB",expires_at:new Date(Date.now()+days*86400000).toISOString()},error:null}:await createClient().rpc(revoke?"revoke_join_code":"new_join_code",revoke?{p_class:group.id}:{p_class:group.id,p_valid_days:days});
   if(result.error){setNotice(errorMessage(result.error.message));return;}
   if(revoke){setNotice(preview?"Sample code revoked. No live records changed.":"Join code revoked.");}
   else {const value=record(result.data);if(!value?.code||!value.expires_at){setNotice("No code was returned. Please try again.");return;}const code=String(value.code);setGenerated({code,expires:String(value.expires_at),qr:await QRCode.toDataURL(code,{width:240,margin:2,color:{dark:"#142b35",light:"#ffffff"}})});setNotice(preview?"Sample code only. It cannot join a live class.":"Code created. Copy it now; it is shown only during this visit.");}
   if(!preview)router.refresh();
  }catch{setNotice("Could not connect. Please try again.");}finally{setBusy(false);}
 }
 async function copy(){if(!generated)return;try{await navigator.clipboard.writeText(generated.code);setNotice("Code copied. Share it with your students.");}catch{setNotice("Select and copy the code below.");}}
 if(!group)return <section className="oa-panel"><h2>Student join codes</h2><p>Create or select a {groupLabel.toLowerCase()} first.</p></section>;
 return <><section className="oa-panel oa-code-controls"><header className="oa-panel-head"><h2>Invite students to {text(group.name)}</h2></header><p>Students enter this code in the Wada app to join this {groupLabel.toLowerCase()}. They use their own student accounts.</p><div className="oa-code-steps"><article><b>01</b><strong>Create a code</strong><span>Choose how long it stays valid.</span></article><article><b>02</b><strong>Share with students</strong><span>Copy the code or print the card below.</span></article><article><b>03</b><strong>Join in the Wada app</strong><span>Open the app, sign in and enter the code.</span></article></div><p className="oa-footnote">{group.has_code?`An active code expires ${new Date(String(group.code_expires_at)).toLocaleDateString("en-GB")}. Existing codes cannot be displayed again.`:"No active join code."} · {text(group.students)} students · {text(group.seat_limit,"Unlimited")} seats</p><div className="oa-action-row"><label>Valid for<select value={days} disabled={busy} onChange={e=>setDays(Number(e.target.value))}>{[7,30,90].map(d=><option key={d} value={d}>{d} days</option>)}</select></label><button className="oa-button primary" disabled={busy} onClick={()=>void change()}>{busy?"Please wait…":group.has_code||generated?"Generate replacement code":"Generate join code"}</button><button className="oa-button ghost" disabled={busy||(!group.has_code&&!generated)} onClick={()=>void change(true)}>Revoke code</button></div>{notice&&<p role="status" className="oa-message">{notice}</p>}</section>{generated&&<section className="oa-panel oa-code-poster"><div className="oa-poster-content"><span className="eyebrow">{preview?"Sample · ":""}{orgName}</span><h2>Join {text(group.name)}</h2><p>Enter this code in the Wada app</p><strong className="oa-code-value">{generated.code}</strong><Image unoptimized src={generated.qr} width={200} height={200} alt="QR containing the student join code"/><p>Valid until {new Date(generated.expires).toLocaleDateString("en-GB")}</p><small>Your teacher will see your progress, scores and common mistakes, never your recordings or what you said.</small></div><div className="oa-action-row"><button className="oa-button primary" onClick={()=>void copy()}>Copy code</button><button className="oa-button ghost" onClick={()=>window.print()}>Print student card</button><button className="oa-button ghost" onClick={()=>setGenerated(null)}>Hide code</button></div></section>}</>;
}
