"use client";
import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function OpsLoginForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setBusy(true);
    try {
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setStatus(error ? "We could not send a link to that address. Check it, or ask for access." : "Check your email for your sign-in link.");
    } catch {
      setStatus("Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="demo-form" onSubmit={send}>
      <label>
        Work email
        <input type="email" name="email" placeholder="you@hinova.so" autoComplete="email" required />
      </label>
      <button className="button" disabled={busy} type="submit">{busy ? "Sending…" : "Send sign-in link"}</button>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
