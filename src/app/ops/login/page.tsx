import type { Metadata } from "next";
import { OpsLoginForm } from "@/components/ops/login-form";
import { opsConfigured } from "@/lib/ops/gate";

export const metadata: Metadata = { title: "Sign in" };

export default async function OpsLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main id="main" className="login-page">
      <section className="login-wrap">
        <div className="login-brand">
          <span>Wada-Talk</span>
        </div>
        <div className="eyebrow" style={{ textAlign: "center" }}>Hinova ops</div>
        <h1>Sign in</h1>
        {error === "invalid-link" && (
          <p className="notice" role="alert">That sign-in link has expired or was already used. Ask for a new one.</p>
        )}
        {opsConfigured() ? (
          <OpsLoginForm />
        ) : (
          <p className="notice" role="alert">Sign-in is not set up on this server (Supabase URL and anon key are missing).</p>
        )}
        <p className="login-footnote">For the Wada-Talk team. Anyone can create an account; only founders can change lessons.</p>
      </section>
    </main>
  );
}
