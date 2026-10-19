"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** The /ops frame: sidebar (sections, who is signed in, sign out) and the page. */
export function OpsShell({ email, section, children }: { email: string; section: "lessons" | null; children: React.ReactNode }) {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }
  return (
    <div className="oa-shell">
      <aside className="oa-sidebar">
        <Link href="/lessons" className="wordmark">
          <img src="/assets/fox-tile.webp" width="34" height="34" alt="" />
          <span>wada</span>
        </Link>
        <div className="oa-side-org">
          <small>HINOVA OPS</small>
          <strong>Internal tools</strong>
        </div>
        <nav className="oa-nav" aria-label="Sections">
          <Link href="/lessons" className="oa-nav-link" aria-current={section === "lessons" ? "page" : undefined}>
            <i>▤</i>Lessons
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
              : `${email} is not on the Hinova staff list. Ask a Hinova admin to add you.`}
          </p>
        </div>
      </div>
    </OpsShell>
  );
}
