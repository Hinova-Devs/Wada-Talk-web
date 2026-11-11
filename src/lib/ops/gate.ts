import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OpsRole } from "@/lib/ops/access";

export const opsConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * For every /ops page: signed in (else the sign-in page), then the person's ops role (`ops_role()`).
 * `allowed` = the role is one of [roles] (default: super admin only). Paths are written without /ops: on the ops subdomain the proxy adds it.
 */
export async function opsGate(roles: OpsRole[] = ["super_admin"]) {
  if (!opsConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await supabase.rpc("ops_role");
  const role = error ? null : ((data as OpsRole | null) ?? null);
  return { supabase, email: user.email ?? "", role, allowed: !!role && roles.includes(role), failed: !!error };
}
