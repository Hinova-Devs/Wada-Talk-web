"use client";
import { useEffect } from "react";

/** Invite and magic links can return tokens in the URL #hash, which the server never sees. Finish the sign-in here, on any page. */
export function AuthHash() {
  useEffect(() => {
    if (location.host.startsWith("ops.")) return; // Ops has its own sign-in.
    const h = new URLSearchParams(location.hash.slice(1));
    const access = h.get("access_token"), refresh = h.get("refresh_token");
    if (h.get("error_description")) { location.replace("/login?error=invalid-link"); return; }
    if (!access || !refresh) return;
    import("@/lib/supabase/client").then(({ createClient }) =>
      createClient().auth.setSession({ access_token: access, refresh_token: refresh }),
    ).then(r => location.replace(r.error ? "/login?error=invalid-link" : "/portal"),
      () => location.replace("/login?error=invalid-link"));
  }, []);
  return null;
}
