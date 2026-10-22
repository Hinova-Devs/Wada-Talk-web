"use client";
import {useState, type FormEvent} from "react";
import {createClient} from "@/lib/supabase/client";
export function InstitutionRegistration() {
 const type = "university";
 const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [draft, setDraft] = useState(""); const [received, setReceived] = useState(false);
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); if (busy) return; const form = new FormData(event.currentTarget); setBusy(true); setNotice(""); setDraft("");
  const request = {p_name: String(form.get("name")).trim(), p_type: type, p_contact_name: String(form.get("contact_name")).trim(), p_email: String(form.get("email")).trim().toLowerCase(), p_learner_count: Number(form.get("learners")), p_message: String(form.get("message") || "").trim()};
  try {
   document.cookie = `wada_institution_type=${type}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
   const {error} = await createClient().rpc("request_org_access", request);
   if (error) {
    if (["PGRST202", "42883"].includes(error.code)) {const body = `University: ${request.p_name}\nType: University\nContact: ${request.p_contact_name}\nEmail: ${request.p_email}\nStudents: ${request.p_learner_count}\nMessage: ${request.p_message}\n\nPlease invite me as the university admin.`; setDraft(`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@wadatalk.com"}?subject=${encodeURIComponent("Wada university registration request")}&body=${encodeURIComponent(body)}`); setNotice("Your request is ready. Send it using your email app to request an admin invitation.");}
    else setNotice(error.message.includes("rate_limited") ? "A request was already submitted recently. Please wait before trying again." : "Could not submit your request. Check the details and try again.");
    return;
   }
   setReceived(true); setNotice("Request received. The Wada team will review your university and send an admin invitation to your email.");
  } catch {setNotice("Could not connect. Please try again.");} finally {setBusy(false);}
 }
 return <form className="institution-form" onSubmit={event => void submit(event)}><fieldset className="institution-fields" disabled={busy || received}><label>University name<input name="name" required minLength={2} maxLength={150} placeholder="Your university"/></label><div className="institution-form-row"><label>Your name<input name="contact_name" required autoComplete="name" minLength={2} maxLength={100}/></label><label>Work email<input name="email" type="email" required autoComplete="email" maxLength={254}/></label></div><label>Number of students<input name="learners" type="number" min="1" max="1000000" required/></label><label>Anything we should know? (optional)<textarea name="message" rows={3} maxLength={2000}/></label><button className="button" disabled={busy || received}>{busy ? "Submitting…" : "Request admin invitation"}</button><small>Access starts after your university is approved and your admin invitation is accepted.</small></fieldset>{notice && <p className="notice" role="status">{notice}</p>}{draft && <a className="button" href={draft}>Send registration request by email</a>}</form>;
}
