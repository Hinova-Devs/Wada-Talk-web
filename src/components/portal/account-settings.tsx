"use client";
import {useState, type FormEvent} from "react";
import {createClient} from "@/lib/supabase/client";
import {authErrorMessage, changeStaffPassword} from "@/lib/portal/auth";
import {validManagerPassword} from "@/lib/portal/management";

export function AccountSettings({email, role, preview}: {email: string; role: string; preview: boolean}) {
 const [busy, setBusy] = useState(false);
 const [notice, setNotice] = useState("");
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (busy) return;
  const form = event.currentTarget;
  const values = new FormData(form);
  const currentPassword = String(values.get("current_password") ?? "");
  const newPassword = String(values.get("new_password") ?? "");
  const confirmation = String(values.get("confirm_password") ?? "");
  if (!validManagerPassword(newPassword)) {setNotice("Use 12–128 characters with uppercase and lowercase letters, a number and a symbol."); return;}
  if (newPassword !== confirmation) {setNotice("The new passwords do not match."); return;}
  if (currentPassword === newPassword) {setNotice("Choose a new password that is different from your current password."); return;}
  if (preview) {setNotice("Sample account only. No password was changed."); return;}
  setBusy(true); setNotice("");
  try {
   const {error} = await changeStaffPassword(createClient(), {email, currentPassword, newPassword});
   if (error) {setNotice(authErrorMessage(error)); return;}
   form.reset();
   setNotice("Password changed. Use the new password the next time you sign in.");
  } catch {setNotice("Could not connect to the sign-in service. Please try again.");}
  finally {setBusy(false);}
 }
 return <section className="oa-panel"><header className="oa-panel-head"><h2>My account</h2></header><div className="oa-account-summary"><span><small>Role</small><strong>{role}</strong></span><span><small>Work email</small><strong>{email}</strong></span></div><h3>Change password / PIN</h3><p>Confirm your current password, then choose a new secure password. Your university and assigned course groups will stay the same.</p><form className="oa-account-form" onSubmit={event => void submit(event)}><fieldset disabled={busy}><label>Current password<input name="current_password" type="password" required autoComplete="current-password"/></label><label>New password<input name="new_password" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/><small>12+ characters with uppercase, lowercase, a number and a symbol.</small></label><label>Confirm new password<input name="confirm_password" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/></label><button className="oa-button primary">{busy ? "Changing…" : "Change password"}</button></fieldset></form>{notice && <p className="oa-message" role="status">{notice}</p>}</section>;
}
