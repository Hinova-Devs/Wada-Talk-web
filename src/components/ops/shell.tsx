"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** The /ops frame: sidebar (sections, who is signed in, sign out) and the page. */
export function OpsShell({ email, section, children }: { email: string; section: "lessons" | "organizations" | null; children: React.ReactNode }) {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }
  return (
    <div className="oa-shell">
      <aside className="oa-sidebar">
        <Link href="/lessons" className="wordmark">
          <span>Wada-Talk</span>
        </Link>
        <div className="oa-side-org">
          <small>HINOVA OPS</small>
          <strong>Internal tools</strong>
        </div>
        <nav className="oa-nav ops-nav" aria-label="Sections">
          <Link href="/lessons" className="oa-nav-link" aria-current={section === "lessons" ? "page" : undefined}>
            <i>▤</i>Lessons
          </Link>
          <Link href="/organizations" className="oa-nav-link" aria-current={section === "organizations" ? "page" : undefined}>
            <i>▦</i>Organizations
          </Link>
        </nav>
        <div className="oa-side-footer">
          <span>{email}</span>
          <b>
            Signed in <button type="button" onClick={signOut}>Sign out</button>
          </b>
        </div>
      </aside>
      <main id="main" className="oa-main">{children}</main>
    </div>
  );
}

/** Shown to signed-in people who are not platform admins (or when the check itself failed). */
export function NoAccess({ email, failed }: { email: string; failed: boolean }) {
  return (
    <OpsShell email={email} section={null}>
      <div className="oa-page-head">
        <div>
          <span>Hinova ops</span>
          <h1>{failed ? "Could not check your access" : "No access"}</h1>
          <p>
            {failed
              ? "The server did not answer. Refresh the page in a moment."
              : `${email} can't use the ops tools yet. Only the founders can; a founder adds you by running this once in the Supabase SQL editor:`}
          </p>
          {!failed && (
            <pre className="ops-sql">{`insert into public.platform_admins (user_id)
select id from auth.users where email = '${email}';`}</pre>
          )}
        </div>
      </div>
    </OpsShell>
  );
}
