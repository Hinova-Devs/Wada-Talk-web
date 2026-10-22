"use client";
import Link from "next/link";
import {useCallback, useEffect, useRef, useState, type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {authErrorMessage, signInStaff, usesDemoPassword} from "@/lib/portal/auth";
export function LoginForm() {
 const router = useRouter();
 const entering = useRef(false);
 const [email, setEmail] = useState("");
 const [status, setStatus] = useState("");
 const [busy, setBusy] = useState(false);
 const [mfaFactor,setMfaFactor]=useState("");
 const enterPortal = useCallback(() => {if (entering.current) return;const requested=new URLSearchParams(window.location.search).get("next")||"/portal";const destination=requested.startsWith("/portal")&&!requested.startsWith("//")?requested:"/portal";entering.current = true; router.replace(destination); router.refresh();}, [router]);
 const continueAuthenticated=useCallback(async(client:ReturnType<typeof createClient>,method="session")=>{const assurance=await client.auth.mfa.getAuthenticatorAssuranceLevel();if(assurance.error){setStatus(authErrorMessage(assurance.error));return;}if(assurance.data.nextLevel==="aal2"&&assurance.data.currentLevel!=="aal2"){const listed=await client.auth.mfa.listFactors();if(listed.error||!listed.data.totp.length){setStatus(listed.error?authErrorMessage(listed.error):"Your two-step verification setup could not be loaded.");return;}setMfaFactor(listed.data.totp[0].id);setStatus("Enter the six-digit code from your authenticator app.");return;}void Promise.resolve(client.rpc("record_portal_login",{p_method:method,p_client_label:"University web portal"}));enterPortal();},[enterPortal]);
 const demo = usesDemoPassword(email, process.env.NODE_ENV === "development");
 const [method,setMethod] = useState("password");
 const passwordLogin = demo || method === "password";
 useEffect(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  const client = createClient();
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const errorCode = hash.get("error_code") || params.get("reason") || undefined;
  const errorDescription = hash.get("error_description");
  const invalidLink = params.has("error");
  if (errorDescription) window.history.replaceState(null, "", window.location.pathname);
  void client.auth.getSession().then(({data: {session}, error}) => {
   if (error) setStatus(authErrorMessage(error));
   else if (errorDescription || invalidLink) setStatus(errorCode ? authErrorMessage({code: errorCode, message: errorDescription || "This sign-in link is invalid or expired. Request another link."}) : "This sign-in link is invalid or expired. Request another link.");
   if (session) {void continueAuthenticated(client);}
  }).catch(() => setStatus("Could not connect to the sign-in service. Please try again."));
  const {data: {subscription}} = client.auth.onAuthStateChange((event, session) => {
   if (session && ["INITIAL_SESSION", "MFA_CHALLENGE_VERIFIED"].includes(event)) {void continueAuthenticated(client);}
  });
  return () => subscription.unsubscribe();
 }, [continueAuthenticated]);
 async function login(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); if (busy) return;
  setBusy(true); setStatus("");
  const form = new FormData(event.currentTarget);
  document.cookie = `wada_institution_type=university; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  try {
   if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {setStatus("University sign-in is not configured."); return;}
   const client=createClient();
   if(mfaFactor){const code=String(form.get("mfa_code")||"").replace(/\s/g,"");const {error}=await client.auth.mfa.challengeAndVerify({factorId:mfaFactor,code});if(error){setStatus(authErrorMessage(error));return;}await continueAuthenticated(client,"session");return;}
   const {error} = await signInStaff(client, {email: String(form.get("email")), password: String(form.get("password") || ""), development: process.env.NODE_ENV === "development", method: passwordLogin ? "password" : "link", origin: window.location.origin});
   if (error) setStatus(authErrorMessage(error));
   else if (passwordLogin) await continueAuthenticated(client,"password");
   else setStatus("Check your email for your secure sign-in link. Open it in this browser.");
  } catch {setStatus("Could not connect to the sign-in service. Check your connection and try again.");} finally {setBusy(false);}
 }
 async function recoverPassword(){if(busy)return;if(!/^\S+@\S+\.\S+$/.test(email.trim())){setStatus("Enter your work email first.");return;}setBusy(true);setStatus("");try{const callback=new URL("/auth/callback",window.location.origin);callback.searchParams.set("next","/portal?section=account&recovery=1");const {error}=await createClient().auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:callback.toString()});setStatus(error?authErrorMessage(error):"Check your email for a password recovery link.");}catch{setStatus("Could not send the recovery email. Please try again.");}finally{setBusy(false);}}
 return <div><form className="demo-form" onSubmit={event => void login(event)}>{mfaFactor?<><label>Authenticator code<input name="mfa_code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} autoFocus/><small>Open your authenticator app and enter the current six-digit code.</small></label><button className="button" disabled={busy}>{busy?"Verifying…":"Verify and continue"}</button><button className="auth-text-button" type="button" disabled={busy} onClick={()=>{void createClient().auth.signOut({scope:"local"});setMfaFactor("");setStatus("");}}>Use another account</button></>:<><label>Sign in with<select value={method} onChange={event => setMethod(event.target.value)}><option value="password">Email & password</option><option value="link">Email sign-in link</option></select></label><label>Work email<input name="email" type="email" required autoComplete="email" placeholder="you@university.edu" value={email} onChange={event => {setEmail(event.target.value); setStatus("");}}/></label>{passwordLogin && <label>Password<input name="password" type="password" required autoComplete="current-password"/><small>Use the password your Super Admin provided.</small></label>}<button className="button" disabled={busy}>{busy ? "Please wait…" : passwordLogin ? "Sign in" : "Send sign-in link"}</button>{passwordLogin&&<button className="auth-text-button" type="button" disabled={busy} onClick={()=>void recoverPassword()}>Forgot password?</button>}<p>Super Admin: all university course groups. English Lecturer: assigned course groups only.</p><p>English Lecturer accounts are created by your Super Admin. <Link href="/register">Register your university →</Link></p></>}</form>{status && <p className="notice" role="status">{status}</p>}</div>;
}
