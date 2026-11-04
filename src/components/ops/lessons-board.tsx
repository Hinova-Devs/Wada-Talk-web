"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { opsUnits } from "@/lib/ops/call";
import { CATEGORY_PHOTOS, unitPhoto } from "@/lib/ops/photos";
import { CATEGORIES, categoryLabel, type Category, isStuck, LEVELS, levelLabel, lineList, type PlanRow, STATUS_LABELS, wordList } from "@/lib/ops/units";

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** The course plan of one category: add units, generate them, see their status. A title opens the unit editor. */
export function LessonsBoard({ category, rows, loadFailed }: { category: Category; rows: PlanRow[]; loadFailed: boolean }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const generating = rows.some((r) => r.status === "generating" && !isStuck(r));

  // While the AI works (about a minute), re-read the plan every 5 seconds. A stuck unit stops this (see isStuck).
  useEffect(() => {
    if (!generating) return;
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [generating, router]);

  async function run(key: string, body: Record<string, unknown>, done: string) {
    setBusy(key);
    setMessage(null);
    try {
      await opsUnits(body);
      setMessage({ ok: true, text: done });
      router.refresh();
      return true;
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Something went wrong." });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const position = Number(f.get("position"));
    const notes = String(f.get("notes")).trim();
    const words = wordList(String(f.get("words")));
    const grammar = lineList(String(f.get("grammar")));
    const ok = await run("add", {
      action: "plan",
      path: category,
      title: String(f.get("title")).trim(),
      can_do: String(f.get("can_do")).trim(),
      level: f.get("level"),
      notes: notes || null,
      ...(position > 0 ? { position } : {}),
      ...(words.length ? { target_words: words } : {}),
      ...(grammar.length ? { grammar } : {}),
    }, "Unit added to the plan.");
    if (ok) setAdding(false);
  }

  function generate(r: PlanRow) {
    if (r.status === "draft" && !confirm(`Generate "${r.title}" again? The current draft will be replaced.`)) return;
    void run(r.id, { action: "generate", unit_id: r.id }, `Generating "${r.title}". This takes about a minute.`);
  }

  function remove(r: PlanRow) {
    if (!confirm(`Remove "${r.title}" from the plan? This cannot be undone.`)) return;
    void run(r.id, { action: "remove", unit_id: r.id }, `"${r.title}" was removed.`);
  }

  const count = (s: PlanRow["status"]) => rows.filter((r) => r.status === s).length;

  return (
    <>
      <div className="oa-page-head">
        <div>
          <span>Lessons</span>
          <h1>Course plan</h1>
          <p>Plan the units of each category, let the AI write them from the plan, then open a unit to review and publish it.</p>
        </div>
        <div className="oa-page-actions">
          <button type="button" className="oa-button primary" onClick={() => setAdding((a) => !a)} aria-expanded={adding}>
            {adding ? "Close" : "+ Add unit"}
          </button>
        </div>
      </div>

      <nav className="ops-tabs ops-cats" aria-label="Categories">
        {CATEGORIES.map(([id, label]) => (
          <Link key={id} href={`/lessons?category=${id}`} aria-current={id === category ? "page" : undefined}
            style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.78)), ${CATEGORY_PHOTOS[id]}` }}>{label}</Link>
        ))}
      </nav>

      {message && (
        <div className={`oa-message${message.ok ? "" : " error"}`} role={message.ok ? "status" : "alert"}>
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)}>Dismiss</button>
        </div>
      )}

      {adding && (
        <form className="oa-panel oa-create-form ops-add" onSubmit={add}>
          <h2>Add a unit to {categoryLabel(category)}</h2>
          <div>
            <label>Title<input name="title" required minLength={3} maxLength={120} placeholder="Talk about your work experience" /></label>
            <label>Level
              <select name="level" defaultValue="a2">
                {LEVELS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>Position<input name="position" type="number" min={1} placeholder={`Next (${rows.length + 1})`} /></label>
            <label className="full">Can-do statement (what the learner will be able to say)
              <input name="can_do" required minLength={10} maxLength={300} placeholder="I can describe my work experience in an interview." />
            </label>
            <label className="full">Notes for the AI (optional)
              <textarea name="notes" rows={3} maxLength={2000} placeholder="Focus on internships and volunteer work. Use the past simple and present perfect." />
            </label>
            <label className="full">Words to teach (optional, separated by commas)
              <input name="words" placeholder="seat, traffic, weather" />
            </label>
            <label className="full">Grammar to teach (optional, one per line)
              <textarea name="grammar" rows={2} placeholder="past simple" />
            </label>
            <p className="full ops-hint">Leave words and grammar empty and the AI picks 8–10 words of this level from the word lists (not taught in earlier units) and 1–3 grammar points. You can change them in the unit afterwards.</p>
          </div>
          <div className="oa-action-row">
            <button className="oa-button primary" type="submit" disabled={busy === "add"}>{busy === "add" ? "Adding…" : "Add to plan"}</button>
            <button className="oa-button ghost" type="button" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      <section className="oa-panel">
        <header className="oa-panel-head">
          <div>
            <span>{categoryLabel(category)}</span>
            <h2>{rows.length} {rows.length === 1 ? "unit" : "units"}</h2>
          </div>
          <p>
            {count("published")} published · {count("draft")} to review · {count("planned")} planned
            {generating ? " · generating now" : ""}
          </p>
        </header>
        {loadFailed ? (
          <div className="oa-empty">
            <p>Could not load the plan.</p>
            <button type="button" className="oa-button ghost" onClick={() => router.refresh()}>Try again</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="oa-empty">
            <p>No units planned for {categoryLabel(category)} yet.</p>
            <button type="button" className="oa-button primary" onClick={() => setAdding(true)}>+ Add the first unit</button>
          </div>
        ) : (
          <div className="oa-table-scroll">
            <table className="oa-table ops-plan">
              <thead>
                <tr>
                  <th>#</th><th>Unit</th><th>Level</th><th>Status</th><th>Updated</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.position}</td>
                    <td className="ops-unit">
                      <span className="ops-thumb" aria-hidden="true" style={{ backgroundImage: unitPhoto(category, r.title, r.can_do_items?.text_en) }} />
                      <Link href={`/lessons/${r.id}`}><strong>{r.title}</strong></Link>
                      <small>{r.can_do_items?.text_en}</small>
                      {r.target_words?.length > 0 && <small>Words: {r.target_words.join(", ")}</small>}
                      {r.status === "failed" && r.generation_error && <small className="ops-error">{r.generation_error}</small>}
                    </td>
                    <td>{levelLabel(r.level)}</td>
                    <td>
                      {isStuck(r)
                        ? <span className="ops-status failed" title="The server stopped the AI before it finished.">Stopped</span>
                        : <span className={`ops-status ${r.status}`}>{STATUS_LABELS[r.status]}</span>}
                    </td>
                    <td>{when(r.updated_at)}</td>
                    <td>
                      <div className="oa-action-row">
                        {(r.status === "planned" || r.status === "failed" || r.status === "draft" || isStuck(r)) && (
                          <button type="button" className="oa-button ghost" disabled={busy !== null} onClick={() => generate(r)}>
                            {busy === r.id ? "Working…" : r.status === "draft" ? "Regenerate" : r.status === "planned" ? "Generate" : "Try again"}
                          </button>
                        )}
                        {r.status !== "published" && r.status !== "generating" && (
                          <button type="button" className="oa-button ghost danger" disabled={busy !== null} onClick={() => remove(r)}>Remove</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
