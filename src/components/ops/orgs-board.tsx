"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, Fragment, useState } from "react";
import { callOps } from "@/lib/ops/call";
import { kindLabel, ORG_KINDS, type OrgKind, type OrgRow } from "@/lib/ops/orgs";

const day = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

/** Every organization: create one (name, kind, first admin), add admins, change the kind. */
export function OrgsBoard({ rows, loadFailed }: { rows: OrgRow[]; loadFailed: boolean }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(key: string, body: Record<string, unknown>, done: (r: Record<string, unknown>) => string) {
    setBusy(key);
    setMessage(null);
    try {
      const r = await callOps("ops-orgs", body);
      setMessage({ ok: true, text: done(r) });
      router.refresh();
      return true;
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Something went wrong." });
      return false;
    } finally {
      setBusy(null);
    }
  }

  const invitedText = (email: string, r: Record<string, unknown>) =>
    r.invited ? `An invite email was sent to ${email}.` : `${email} already had an invited account and can sign in now.`;

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const email = String(f.get("admin_email")).trim();
    const ok = await run("create", { action: "create", name, kind: f.get("kind"), admin_email: email },
      (r) => `${name} was created. ${invitedText(email, r)}`);
    if (ok) setCreating(false);
  }

  async function addAdmin(e: FormEvent<HTMLFormElement>, org: OrgRow) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    const ok = await run(org.org_id, { action: "add_admin", org_id: org.org_id, email },
      (r) => `${email} is now an admin of ${org.name}. ${invitedText(email, r)}`);
    if (ok) setAddingTo(null);
  }

  function changeKind(org: OrgRow) {
    const kind: OrgKind = org.kind === "university" ? "company" : "university";
    const note = kind === "company" ? " A company has no teachers." : "";
    if (!confirm(`Make ${org.name} a ${kindLabel(kind).toLowerCase()}?${note} Its dashboard changes with it.`)) return;
    void run(org.org_id, { action: "set_kind", org_id: org.org_id, kind }, () => `${org.name} is now a ${kindLabel(kind).toLowerCase()}.`);
  }

  const count = (k: OrgKind) => rows.filter((r) => r.kind === k).length;

  return (
    <>
      <div className="oa-page-head">
        <div>
          <span>Organizations</span>
          <h1>Universities and companies</h1>
          <p>Create an organization, choose whether it is a university or a company, and invite its first admin by email.</p>
        </div>
        <div className="oa-page-actions">
          <button type="button" className="oa-button primary" onClick={() => setCreating((c) => !c)} aria-expanded={creating}>
            {creating ? "Close" : "+ New organization"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`oa-message${message.ok ? "" : " error"}`} role={message.ok ? "status" : "alert"}>
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)}>Dismiss</button>
        </div>
      )}

      {creating && (
        <form className="oa-panel oa-create-form ops-add" onSubmit={create}>
          <h2>New organization</h2>
          <div>
            <label>Name<input name="name" required minLength={2} maxLength={120} placeholder="Hargeisa University" /></label>
            <label>Kind
              <select name="kind" required defaultValue="">
                <option value="" disabled>Choose…</option>
                {ORG_KINDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>First admin&apos;s email<input name="admin_email" type="email" required maxLength={254} placeholder="admin@example.so" /></label>
            <p className="full ops-hint">
              A university has teachers and classes. A company has admins only; its employees join groups with a join code.
              The admin gets an email link to the organization dashboard (no password).
            </p>
          </div>
          <div className="oa-action-row">
            <button className="oa-button primary" type="submit" disabled={busy === "create"}>{busy === "create" ? "Creating…" : "Create organization"}</button>
            <button className="oa-button ghost" type="button" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </form>
      )}

      <section className="oa-panel">
        <header className="oa-panel-head">
          <div>
            <span>All organizations</span>
            <h2>{rows.length} {rows.length === 1 ? "organization" : "organizations"}</h2>
          </div>
          <p>{count("university")} {count("university") === 1 ? "university" : "universities"} · {count("company")} {count("company") === 1 ? "company" : "companies"}</p>
        </header>
        {loadFailed ? (
          <div className="oa-empty">
            <p>Could not load the organizations. If this keeps happening, check that the org migration (K1) is applied.</p>
            <button type="button" className="oa-button ghost" onClick={() => router.refresh()}>Try again</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="oa-empty">
            <p>No organizations yet.</p>
            <button type="button" className="oa-button primary" onClick={() => setCreating(true)}>+ Create the first one</button>
          </div>
        ) : (
          <div className="oa-table-scroll">
            <table className="oa-table ops-plan">
              <thead>
                <tr>
                  <th>Organization</th><th>Kind</th><th>Admins</th><th>People</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <Fragment key={o.org_id}>
                    <tr>
                      <td><div className="ops-unit"><strong>{o.name}</strong><small>Created {day(o.created_at)}</small></div></td>
                      <td><span className={`ops-status ${o.kind === "company" ? "generating" : "published"}`}>{kindLabel(o.kind)}</span></td>
                      <td><div className="ops-cell">{o.admins.length ? o.admins.map((a) => <small key={a}>{a}</small>) : <small>No admin</small>}</div></td>
                      <td>
                        <div className="ops-cell">
                          <small>{o.students} {o.kind === "company" ? "employees" : "students"}</small>
                          <small>{o.classes} {o.kind === "company" ? "groups" : "classes"}{o.kind === "university" ? ` · ${o.teachers} teachers` : ""}</small>
                        </div>
                      </td>
                      <td>
                        <div className="oa-action-row">
                          <button type="button" className="oa-button ghost" disabled={busy !== null}
                            onClick={() => setAddingTo(addingTo === o.org_id ? null : o.org_id)} aria-expanded={addingTo === o.org_id}>
                            + Admin
                          </button>
                          <button type="button" className="oa-button ghost" disabled={busy !== null} onClick={() => changeKind(o)}>
                            {busy === o.org_id ? "Working…" : o.kind === "university" ? "Make company" : "Make university"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {addingTo === o.org_id && (
                      <tr>
                        <td colSpan={5}>
                          <form className="ops-inline-form" onSubmit={(e) => addAdmin(e, o)}>
                            <label>New admin&apos;s email for {o.name}
                              <input name="email" type="email" required maxLength={254} placeholder="admin@example.so" autoFocus />
                            </label>
                            <button className="oa-button primary" type="submit" disabled={busy !== null}>{busy === o.org_id ? "Adding…" : "Add admin"}</button>
                            <button className="oa-button ghost" type="button" onClick={() => setAddingTo(null)}>Cancel</button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
