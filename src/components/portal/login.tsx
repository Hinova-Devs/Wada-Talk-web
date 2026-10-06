"use client";
import Link from "next/link";
import {useEffect, useState, type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
export function LoginForm() {
 const router = useRouter(); const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
 useEffect(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
  const client = createClient();
  const invalidLink = new URLSearchParams(window.location.search).has("error");
  const error = new URLSearchParams(window.location.hash.slice(1)).get("error_description");
  if (error) window.history.replaceState(null, "", window.location.pathname);
  void client.auth.getSession().then(({data: {session}}) => {if (error || invalidLink) setStatus(error || "This sign-in link is invalid or expired. Request another link."); if (session) {window.history.replaceState(null, "", window.location.pathname); router.replace("/portal"); router.refresh();}});
  const {data: {subscription}} = client.auth.onAuthStateChange((event, session) => {if (session && ["SIGNED_IN", "INITIAL_SESSION"].includes(event)) {window.history.replaceState(null, "", window.location.pathname); router.replace("/portal"); router.refresh();}});
  return () => subscription.unsubscribe();
 }, [router]);
 async function login(event: FormEvent<HTMLFormElement>, password = false) {
  event.preventDefault(); setBusy(true); setStatus("");
  const form = new FormData(event.currentTarget);
  try {
   if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {setStatus("Organization sign-in is not configured."); return;}
   const client = createClient(); const email = String(form.get("email")).trim();
   const {error} = password ? await client.auth.signInWithPassword({email, password: String(form.get("password"))}) : await client.auth.signInWithOtp({email, options: {emailRedirectTo: window.location.origin, shouldCreateUser: false}});
   if (error) setStatus(password ? "Could not sign in. Check your demo account details." : "Could not send a link. Check your email or ask your school admin to invite you.");
   else if (password) {router.replace("/portal"); router.refresh();} else setStatus("Check your email for your secure sign-in link.");
  } catch {setStatus("Connection failed. Please try again.");} finally {setBusy(false);}
 }
 return <div><form className="demo-form" onSubmit={event => void login(event)}><label>Work email<input name="email" type="email" required autoComplete="email" placeholder="you@school.so"/></label><button className="button" disabled={busy}>{busy ? "Please wait…" : "Send sign-in link"}</button><p>Staff access is by invitation.</p><Link href="/organizations#demo">Request access →</Link></form>{status && <p className="notice" role="status">{status}</p>}{process.env.NODE_ENV === "development" && <details className="card"><summary>Development account sign-in</summary><form className="demo-form" onSubmit={event => void login(event, true)}><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Password<input name="password" type="password" required autoComplete="current-password"/></label><button className="button" disabled={busy}>Sign in</button></form></details>}<p><Link href="/portal-preview">Preview the dashboard →</Link></p></div>;
}

