"use client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/** Calls an ops Edge Function (`ops-units`, `ops-orgs`). Throws an Error whose message is safe to show (ops-api.md §4, §7). */
export async function callOps<T = Record<string, unknown>>(fn: "ops-units" | "ops-orgs", body: Record<string, unknown>): Promise<T> {
  const { data, error } = await createClient().functions.invoke(fn, { body });
  if (!error) return data as T;
  if (error instanceof FunctionsHttpError) {
    const answer = await error.context.json().catch(() => null);
    const message = answer?.error?.message;
    if (answer?.error?.code === "not_authenticated") throw new Error("Your session ended. Sign in again.");
    if (typeof message === "string" && message) throw new Error(message);
    throw new Error(`${fn} answered with an error (HTTP ${error.context.status}). Try again, or check that ${fn} is deployed.`);
  }
  throw new Error("Could not reach the server. Check your connection and try again.");
}

export const opsUnits = <T = Record<string, unknown>>(body: Record<string, unknown>) => callOps<T>("ops-units", body);
