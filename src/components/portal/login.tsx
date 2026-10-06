"use client";
import Link from "next/link";
import {useEffect, useState, type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {authErrorMessage, signInStaff, usesDemoPassword} from "@/lib/portal/auth";
export function LoginForm() {
 const router = useRouter();
 const [type, setType] = useState("university");
 const [email, setEmail] = useState("");
 const [status, setStatus] = useState("");
 const [busy, setBusy] = useState(false);
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
   if (session) {window.history.replaceState(null, "", window.location.pathname); router.replace("/portal"); router.refresh();}
  }).catch(() => setStatus("Could not connect to the sign-in service. Please try again."));
  const {data: {subscription}} = client.auth.onAuthStateChange((event, session) => {
   if (session && ["SIGNED_IN", "INITIAL_SESSION"].includes(event)) {window.history.replaceState(null, "", window.location.pathname); router.replace("/portal"); router.refresh();}
  });
  return () => subscription.unsubscribe();
 }, [router]);
 async function login(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); if (busy) return;
  setBusy(true); setStatus("");
  const form = new FormData(event.currentTarget);
  document.cookie = `wada_institution_type=${type}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  try {
   if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {setStatus("Organization sign-in is not configured."); return;}
   const {error} = await signInStaff(createClient(), {email: String(form.get("email")), password: String(form.get("password") || ""), development: process.env.NODE_ENV === "development", method: passwordLogin ? "password" : "link", origin: window.location.origin});
   if (error) setStatus(authErrorMessage(error));
   else if (passwordLogin) {router.replace("/portal"); router.refresh();}
   else setStatus("Check your email for your secure sign-in link. Open it in this browser.");
  } catch {setStatus("Could not connect to the sign-in service. Check your connection and try again.");} finally {setBusy(false);}
 }
 return <div><form className="demo-form" onSubmit={event => void login(event)}><label>Institution type<select value={type} onChange={event => setType(event.target.value)}><option value="university">University</option><option value="school">School</option></select></label><label>Sign in with<select value={method} onChange={event => setMethod(event.target.value)}><option value="password">Email & password</option><option value="link">Email sign-in link</option></select></label><label>Work email<input name="email" type="email" required autoComplete="email" placeholder="you@school.so" value={email} onChange={event => {setEmail(event.target.value); setStatus("");}}/></label>{passwordLogin && <label>Password<input name="password" type="password" required autoComplete="current-password"/><small>Use the password your Super Admin provided.</small></label>}<button className="button" disabled={busy}>{busy ? "Please wait…" : passwordLogin ? "Sign in" : "Send sign-in link"}</button><p>Super Admin: all institution classes. English Teacher: assigned classes only.</p><p>English Teacher accounts are created by your Super Admin. <Link href="/register">Register your institution →</Link></p></form>{status && <p className="notice" role="status">{status}</p>}</div>;
}
