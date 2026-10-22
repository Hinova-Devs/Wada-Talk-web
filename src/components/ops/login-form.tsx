"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Email + password: anyone can create an account; only Hinova staff (platform_admins) get past the gate. */
export function OpsLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    setBusy(true);
    setStatus("");
    try {
      const auth = createClient().auth;
      if (mode === "in") {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) return setStatus("Wrong email or password.");
      } else {
        const { data, error } = await auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) return setStatus(error.message);
        // Email confirmation on in Supabase: no session until the link is opened.
        if (!data.session) return setStatus("Account created. Open the confirmation link we emailed you, then sign in.");
      }
      router.replace("/lessons");
      router.refresh();
    } catch {
      setStatus("Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="demo-form" onSubmit={submit}>
      <label>
        Email
        <input type="email" name="email" placeholder="you@company.com" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          minLength={8}
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          required
        />
      </label>
      <button className="button" disabled={busy} type="submit">
        {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
      </button>
      {status && <p role="status">{status}</p>}
      <button type="button" className="text-button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setStatus(""); }}>
        {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
