import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const opsConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * For every /ops page: signed in (else the sign-in page) and a Hinova platform admin.
 * Paths are written without /ops: on the ops subdomain the proxy adds it.
 */
export async function opsGate() {
  if (!opsConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: allowed, error } = await supabase.rpc("is_platform_admin");
  return { supabase, email: user.email ?? "", allowed: !error && allowed === true, failed: !!error };
}
