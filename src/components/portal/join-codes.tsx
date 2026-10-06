"use client";
import {useEffect,useState} from "react";
import QRCode from "qrcode";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {codeDays,codeIsExpired} from "@/lib/portal/management";
import {errorMessage,record,text,type PortalRow} from "@/lib/portal/data";
type Generated={code:string;expires:string;qr:string};
export function JoinCodes({group,orgName,groupLabel,preview}: {group?:PortalRow;orgName:string;groupLabel:string;preview:boolean}) {
 const router=useRouter();const [days,setDays]=useState(30);const [automatic,setAutomatic]=useState(true);const [available,setAvailable]=useState(preview);const [loading,setLoading]=useState(!preview);const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const [generated,setGenerated]=useState<Generated|null>(null);const [now,setNow]=useState(()=>Date.now());
 async function renderCode(value:PortalRow):Promise<Generated|null>{if(!value.code||codeIsExpired(value.expires_at))return null;const code=String(value.code);return {code,expires:String(value.expires_at),qr:await QRCode.toDataURL(code,{width:240,margin:2,color:{dark:"#142b35",light:"#ffffff"}})};}
 useEffect(()=>{
  let active=true;let polling=false;let initial=true;
  async function read(){if(preview||!group||polling)return;polling=true;
   try{const {data,error}=await createClient().rpc("read_class_code",{p_class:group!.id});if(!active)return;
    if(error){setAvailable(false);if(!["PGRST202","42883"].includes(error.code))setNotice(errorMessage(error.message));return;}
    setAvailable(true);const value=record(data);if(value){const display=await renderCode(value);if(active){setGenerated(display);setNow(Date.now());if(initial){setDays(Number(value.valid_days)||30);setAutomatic(value.automatic===true);}if(value.rotation_error)setNotice("Automatic rotation stopped. Generate a new code to restart it.");}}else setGenerated(null);initial=false;
   }catch{if(active)setNotice("Could not load the current code. Please try again.");}finally{polling=false;if(active)setLoading(false);}
  }
  void read();const poll=setInterval(()=>void read(),60000);const clock=setInterval(()=>setNow(Date.now()),1000);return()=>{active=false;clearInterval(poll);clearInterval(clock);};
 },[group,preview]);
 useEffect(()=>{
  if(!preview||!generated||!automatic)return;
  let active=true;let timer:ReturnType<typeof setTimeout>;
  function schedule(){timer=setTimeout(()=>{if(!active)return;if(Date.parse(generated!.expires)>Date.now()){schedule();return;}const code=crypto.randomUUID().replaceAll("-","").slice(0,10).toUpperCase();void renderCode({code,expires_at:new Date(Date.now()+days*86400000).toISOString()}).then(value=>{if(active)setGenerated(value);});},Math.min(Math.max(0,Date.parse(generated!.expires)-Date.now()),2147483647));}
  schedule();return()=>{active=false;clearTimeout(timer);};
 },[preview,generated,automatic,days]);

 async function change(revoke=false){
  const duration=codeDays(days);if(!group||busy||loading)return;if(!revoke&&!duration){setNotice("Choose 1–365 days.");return;}
  if((revoke||group.has_code||generated)&&!confirm(revoke?"Stop automatic renewal and revoke this class code?":"Replace this class code? The previous code will stop working."))return;
  setBusy(true);setNotice("");
  try{
   const result=preview?{data:revoke?null:{code:crypto.randomUUID().replaceAll("-","").slice(0,10).toUpperCase(),expires_at:new Date(Date.now()+duration!*86400000).toISOString()},error:null}:await createClient().rpc(available?(revoke?"stop_class_code":"configure_class_code"):(revoke?"revoke_join_code":"new_join_code"),revoke?{p_class:group.id}:{p_class:group.id,p_valid_days:duration,...(available?{p_automatic:automatic}:{})});
   if(result.error){setNotice(errorMessage(result.error.message));return;}
   if(revoke){setGenerated(null);setNotice(preview?"Sample renewal stopped and code revoked.":"Automatic renewal stopped and code revoked.");}
   else{const value=record(result.data);if(!value?.code||!value.expires_at){setNotice("No code returned. Please try again.");return;}setGenerated(await renderCode(value));setNow(Date.now());setNotice(preview?"Sample only. This code cannot join a live class.":available&&automatic?"Code saved. It renews automatically after expiry.":"Code created. Copy it before leaving this page.");}
   if(!preview)router.refresh();
  }catch{setNotice("Could not connect. Please try again.");}finally{setBusy(false);}
 }
 const expired=!!generated&&codeIsExpired(generated.expires,now);
 const remaining=generated?Math.max(0,Math.ceil((Date.parse(generated.expires)-(now))/3600000)):0;
 async function copy(){if(!generated||expired)return;try{await navigator.clipboard.writeText(generated.code);setNotice("Code copied. Share it with this class's students.");}catch{setNotice("Select and copy the code below.");}}
 if(!group)return <section className="oa-panel"><h2>Student join codes</h2><p>Create or select a {groupLabel.toLowerCase()} first.</p></section>;
 return <><section className="oa-panel oa-code-controls"><header className="oa-panel-head"><h2>Code for {text(group.name)}</h2></header><p>This code belongs only to this {groupLabel.toLowerCase()}. Students enter it in the Wada app; their progress stays with this class when its code changes.</p><div className="oa-code-steps"><article><b>01</b><strong>Choose the class</strong><span>Set its own capacity and code duration.</span></article><article><b>02</b><strong>Share its current code</strong><span>Copy it or print a student card.</span></article><article><b>03</b><strong>Renew at expiry</strong><span>Automatic renewal replaces the old code.</span></article></div><p className="oa-footnote">{text(group.students)} students · {text(group.seat_limit,"Unlimited")} seats. Capacity and progress are managed separately for each class.</p><div className="oa-action-row"><label>Code duration (days)<input type="number" min="1" max="365" step="1" value={days} disabled={busy||loading} onChange={e=>setDays(Number(e.target.value))}/></label><label className="oa-check"><input type="checkbox" checked={available&&automatic} disabled={busy||loading||!available} onChange={e=>setAutomatic(e.target.checked)}/>Renew automatically at expiry</label><button className="oa-button primary" disabled={busy||loading} onClick={()=>void change()}>{loading?"Loading…":busy?"Please wait…":group.has_code||generated?"Save & replace code":"Create class code"}</button><button className="oa-button ghost" disabled={busy||loading||(!group.has_code&&!generated)} onClick={()=>void change(true)}>Stop & revoke</button></div>{!available&&!loading&&<p className="oa-footnote">Automatic renewal requires the class-code Supabase migration and Cron setup. Manual codes still work.</p>}{notice&&<p role="status" className="oa-message">{notice}</p>}</section>{generated&&<section className="oa-panel oa-code-poster"><div className="oa-poster-content"><span className="eyebrow">{preview?"Sample · ":""}{orgName}</span><h2>Join {text(group.name)}</h2><p>Enter this class code in the Wada app</p><strong className="oa-code-value">{expired?"Expired":generated.code}</strong>{!expired&&<Image unoptimized src={generated.qr} width={200} height={200} alt="QR containing this class's student join code"/>}<p>Expires {new Intl.DateTimeFormat("en-GB",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Nairobi"}).format(new Date(generated.expires))} · East Africa time</p><p>{expired?automatic?"Waiting for the next server renewal. Refresh shortly.":"Generate a new code to reopen joining.":`${remaining} hours remaining · ${available&&automatic?"Automatic renewal":"Manual renewal"}`}</p><small>Your teacher will see your progress, scores and common mistakes, never your recordings or what you said.</small></div><div className="oa-action-row"><button className="oa-button primary" disabled={expired} onClick={()=>void copy()}>Copy class code</button><button className="oa-button ghost" disabled={expired} onClick={()=>window.print()}>Print student card</button><button className="oa-button ghost" onClick={()=>setGenerated(null)}>Hide code</button></div></section>}</>;
}
