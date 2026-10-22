"use client";
import Image from "next/image";
import {useEffect, useState, type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {authErrorMessage, changeStaffPassword} from "@/lib/portal/auth";
import {validManagerPassword} from "@/lib/portal/management";

type Factor={id:string;friendly_name?:string;created_at:string};
type Enrollment={id:string;qr:string;secret:string};
type LoginEvent={method:string;client_label:string;occurred_at:string};

export function AccountSettings({email, role, preview}: {email: string; role: string; preview: boolean}) {
 const router=useRouter();
 const [busy, setBusy] = useState(false);
 const [notice, setNotice] = useState("");
 const [factors,setFactors]=useState<Factor[]>([]);
 const [enrollment,setEnrollment]=useState<Enrollment|null>(null);
 const [history,setHistory]=useState<LoginEvent[]>(preview?[{method:"password",client_label:"University web portal",occurred_at:new Date().toISOString()}]:[]);
 const [recovery] = useState(() => typeof window!=="undefined"&&new URLSearchParams(window.location.search).get("recovery")==="1");

 useEffect(()=>{if(preview)return;const client=createClient();void Promise.all([client.auth.mfa.listFactors(),Promise.resolve(client.rpc("my_portal_login_history"))]).then(([factorResult,historyResult])=>{
  if(!factorResult.error)setFactors(factorResult.data.totp);
  if(!historyResult.error&&Array.isArray(historyResult.data))setHistory(historyResult.data as LoginEvent[]);
 });},[preview]);

 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();if (busy) return;
  const form = event.currentTarget;const values = new FormData(form);
  const currentPassword = String(values.get("current_password") ?? "");const newPassword = String(values.get("new_password") ?? "");const confirmation = String(values.get("confirm_password") ?? "");
  if (!validManagerPassword(newPassword)) {setNotice("Use 12–128 characters with uppercase and lowercase letters, a number and a symbol."); return;}
  if (newPassword !== confirmation) {setNotice("The new passwords do not match."); return;}
  if (!recovery&&currentPassword === newPassword) {setNotice("Choose a new password that is different from your current password."); return;}
  if (preview) {setNotice("Sample account only. No password was changed."); return;}
  setBusy(true);setNotice("");
  try {const client=createClient();const {error} = recovery?await client.auth.updateUser({password:newPassword}):await changeStaffPassword(client, {email, currentPassword, newPassword});if (error) {setNotice(authErrorMessage(error)); return;}form.reset();setNotice("Password changed. Use the new password the next time you sign in.");}
  catch {setNotice("Could not connect to the sign-in service. Please try again.");}finally {setBusy(false);}
 }

 async function startMfa(){if(preview){setNotice("Sample account only. Two-step verification was not changed.");return;}setBusy(true);setNotice("");try{const {data,error}=await createClient().auth.mfa.enroll({factorType:"totp",friendlyName:`Wada portal ${new Date().toISOString().slice(0,10)}`});if(error){setNotice(authErrorMessage(error));return;}setEnrollment({id:data.id,qr:data.totp.qr_code,secret:data.totp.secret});}catch{setNotice("Could not start two-step verification.");}finally{setBusy(false);}}
 async function verifyMfa(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!enrollment||busy)return;const code=String(new FormData(event.currentTarget).get("code")||"").replace(/\s/g,"");setBusy(true);setNotice("");try{const client=createClient();const {error}=await client.auth.mfa.challengeAndVerify({factorId:enrollment.id,code});if(error){setNotice(authErrorMessage(error));return;}const listed=await client.auth.mfa.listFactors();if(!listed.error)setFactors(listed.data.totp);setEnrollment(null);setNotice("Two-step verification is active.");}catch{setNotice("Could not verify that code.");}finally{setBusy(false);}}
 async function removeMfa(id:string){if(preview)return;setBusy(true);setNotice("");const client=createClient();const {error}=await client.auth.mfa.unenroll({factorId:id});if(error)setNotice(authErrorMessage(error));else{setFactors(items=>items.filter(item=>item.id!==id));setNotice("Two-step verification was removed from this authenticator.");}setBusy(false);}

 return <section className="oa-panel"><header className="oa-panel-head"><h2>My account</h2></header>
  <div className="oa-account-summary"><span><small>Role</small><strong>{role}</strong></span><span><small>Work email</small><strong>{email}</strong></span></div>
  <h3>{recovery?"Set a new password":"Change password / PIN"}</h3><p>{recovery?"Your recovery link is verified. Choose a new secure password.":"Confirm your current password, then choose a new secure password. Your university and assigned course groups will stay the same."}</p>
  <form className="oa-account-form" onSubmit={event => void submit(event)}><fieldset disabled={busy}>{!recovery&&<label>Current password<input name="current_password" type="password" required autoComplete="current-password"/></label>}<label>New password<input name="new_password" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/><small>12+ characters with uppercase, lowercase, a number and a symbol.</small></label><label>Confirm new password<input name="confirm_password" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/></label><button className="oa-button primary">{busy ? "Changing…" : recovery?"Set new password":"Change password"}</button></fieldset></form>
  <div className="account-security"><h3>Two-step verification</h3><p>Use an authenticator app to protect this account with a six-digit code.</p>{factors.map(factor=><div className="account-security-row" key={factor.id}><span><strong>{factor.friendly_name||"Authenticator app"}</strong><small>Active since {new Intl.DateTimeFormat("en-GB",{dateStyle:"medium"}).format(new Date(factor.created_at))}</small></span><button className="oa-button ghost" disabled={busy||preview} onClick={()=>void removeMfa(factor.id)}>Remove</button></div>)}{!enrollment&&factors.length===0&&<button className="oa-button ghost" disabled={busy} onClick={()=>void startMfa()}>Set up authenticator</button>}{enrollment&&<form className="mfa-enrollment" onSubmit={event=>void verifyMfa(event)}><Image src={enrollment.qr} width={180} height={180} unoptimized alt="Authenticator setup QR code"/><div><p>Scan the QR code, or enter this key:</p><code>{enrollment.secret}</code><label>Six-digit code<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6}/></label><button className="oa-button primary" disabled={busy}>Verify and activate</button></div></form>}</div>
  <div className="account-security"><h3>Recent sign-ins</h3>{history.length?<div className="login-history">{history.map((event,index)=><span key={`${event.occurred_at}-${index}`}><strong>{event.method==="email_link"?"Secure email link":event.method==="password"?"Email and password":"Active session"}</strong><small>{event.client_label} · {new Intl.DateTimeFormat("en-GB",{dateStyle:"medium",timeStyle:"short"}).format(new Date(event.occurred_at))}</small></span>)}</div>:<p>Sign-in history will appear after the university operations migration is applied.</p>}</div>
  <div className="account-security"><h3>Session security</h3><p>Sign out this account from every browser and device. You will need the new password or a secure email link to sign in again.</p><button className="oa-button ghost" disabled={busy||preview} onClick={async()=>{setBusy(true);const {error}=await createClient().auth.signOut({scope:"global"});if(error){setNotice(authErrorMessage(error));setBusy(false);return;}router.replace("/login");router.refresh();}}>Sign out all devices</button></div>
  {notice && <p className="oa-message" role="status">{notice}</p>}
 </section>;
}
