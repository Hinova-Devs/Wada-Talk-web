"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MENU, type OpsRole, type OpsSection, ROLE_LABELS } from "@/lib/ops/access";

/** The /ops frame: sidebar (sections, who is signed in, sign out) and the page. */
export function OpsShell({ email, role, section, children }: { email: string; role: OpsRole | null; section: OpsSection | null; children: React.ReactNode }) {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }
  return (
    <div className="oa-shell">
      <aside className="oa-sidebar">
        <Link href="/" className="wordmark">
          <span>Wada-Talk</span>
        </Link>
        <div className="oa-side-org">
          <small>HINOVA OPS</small>
          <strong>{role ? ROLE_LABELS[role] : "Internal tools"}</strong>
        </div>
        <nav className="oa-nav ops-nav" aria-label="Sections">
          {MENU.filter((m) => role && m.roles.includes(role)).map((m) => (
            <Link key={m.id} href={m.href} className="oa-nav-link" aria-current={section === m.id ? "page" : undefined}>
              <i>{m.icon}</i>{m.label}
            </Link>
          ))}
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

/** Shown to signed-in people with no ops role, to a role on a page that isn't theirs, or when the check itself failed. */
export function NoAccess({ email, role, failed }: { email: string; role: OpsRole | null; failed: boolean }) {
  return (
    <OpsShell email={email} role={role} section={null}>
      <div className="oa-page-head">
        <div>
          <span>Hinova ops</span>
          <h1>{failed ? "Could not check your access" : role ? "Not for your role" : "No access"}</h1>
          <p>
            {failed
              ? "The server did not answer. Refresh the page in a moment."
              : role
                ? `${ROLE_LABELS[role]} accounts can't open this page. Use the menu on the left.`
                : `${email} can't use the ops tools yet. Ask a super admin to add you in Staff. A founder becomes a super admin by running this once in the Supabase SQL editor:`}
          </p>
          {!failed && !role && (
            <pre className="ops-sql">{`insert into public.platform_admins (user_id)
select id from auth.users where email = '${email}';`}</pre>
          )}
        </div>
      </div>
    </OpsShell>
  );
}
