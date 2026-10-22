"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { opsUnits } from "@/lib/ops/call";
import { categoryLabel, LEVELS, levelLabel, STATUS_LABELS, type UnitRow, type Variant, type VariantLevel, VARIANT_LEVELS } from "@/lib/ops/units";
import { cleanVariant, VariantFields } from "./variant-fields";

type Form = {
  title: string;
  level: UnitRow["level"];
  can_do_en: string;
  can_do_so: string;
  notes: string;
  variants: Partial<Record<VariantLevel, Variant>>;
};

const fromUnit = (u: UnitRow): Form => ({
  title: u.title,
  level: u.level,
  can_do_en: u.can_do_items?.text_en ?? "",
  can_do_so: u.can_do_items?.text_so ?? "",
  notes: u.notes ?? "",
  variants: u.variants ?? {},
});

/** Review and edit one unit: plan fields, then easy / medium / hard content. Save, generate, publish. */
export function UnitEditor({ unit }: { unit: UnitRow }) {
  const router = useRouter();
  const initial = useMemo(() => fromUnit(unit), [unit]);
  const [form, setForm] = useState<Form>(initial);
  const [tab, setTab] = useState<VariantLevel>("easy");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const hasContent = VARIANT_LEVELS.every(([l]) => !!form.variants[l]);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const editable = unit.status === "planned" || unit.status === "draft" || unit.status === "failed";
  const back = `/lessons?category=${unit.path}`;

  // While the AI writes this unit, re-read it every 5 seconds.
  useEffect(() => {
    if (unit.status !== "generating") return;
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [unit.status, router]);

  // Unsaved changes: ask before the tab closes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function run(key: string, body: Record<string, unknown>, done: string, after?: () => void) {
    setBusy(key);
    setMessage(null);
    try {
      await opsUnits({ unit_id: unit.id, ...body });
      setMessage({ ok: true, text: done });
      if (after) after();
      else router.refresh();
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(null);
    }
  }

  const save = () =>
    run("save", {
      action: "save",
      title: form.title.trim(),
      level: form.level,
      can_do_en: form.can_do_en.trim(),
      can_do_so: form.can_do_so.trim() || null,
      notes: form.notes.trim() || null,
      ...(hasContent
        ? { variants: Object.fromEntries(VARIANT_LEVELS.map(([l]) => [l, cleanVariant(form.variants[l]!)])) }
        : {}),
    }, "Saved.");

  function generate() {
    const replacing = hasContent ? "The current content will be replaced. " : "";
    const losing = dirty ? "Your unsaved changes will be lost. " : "";
    if ((replacing || losing) && !confirm(`${replacing}${losing}Generate "${unit.title}" now?`)) return;
    void run("generate", { action: "generate" }, "Generating. This takes 1–3 minutes; the page updates by itself.");
  }

  function remove() {
    if (!confirm(`Remove "${unit.title}"? This cannot be undone.`)) return;
    void run("remove", { action: "remove" }, "Removed.", () => router.push(back));
  }

  // The team are native Somali speakers: publishing is the Somali check (who and when are saved).
  const publish = () => run("publish", { action: "publish", somali_checked: true }, "Published. Learners can see it now.");
  const unpublish = () => run("unpublish", { action: "unpublish" }, "Unpublished. It is a draft again.");

  const credit = unit.content_credits?.[0];

  return (
    <div className="ops-editor">
      <div className="oa-page-head">
        <div>
          <span><Link className="oa-link" href={back}>← {categoryLabel(unit.path)}</Link> · Unit {unit.position} · {levelLabel(unit.level)}</span>
          <h1>{unit.title}</h1>
          <p>
            <span className={`ops-status ${unit.status}`}>{STATUS_LABELS[unit.status]}</span>
            {credit && <> · {credit.source}</>}
            {unit.somali_checked_at && <> · published {new Date(unit.somali_checked_at).toLocaleDateString("en-GB")}</>}
          </p>
        </div>
        <div className="oa-page-actions">
          {editable && (
            <button type="button" className="oa-button primary" disabled={!!busy || !dirty} onClick={save}>
              {busy === "save" ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
          )}
          {unit.status === "draft" && (
            <button type="button" className="oa-button ghost" disabled={!!busy || dirty} title={dirty ? "Save your changes first" : undefined} onClick={publish}>
              {busy === "publish" ? "Publishing…" : "Publish"}
            </button>
          )}
          {unit.status === "published" && (
            <button type="button" className="oa-button ghost" disabled={!!busy} onClick={unpublish}>{busy === "unpublish" ? "Working…" : "Unpublish"}</button>
          )}
          {editable && (
            <button type="button" className="oa-button ghost" disabled={!!busy} onClick={generate}>
              {busy === "generate" ? "Starting…" : hasContent ? "Regenerate" : "Generate"}
            </button>
          )}
          {editable && <button type="button" className="oa-button ghost danger" disabled={!!busy} onClick={remove}>Remove</button>}
        </div>
      </div>

      {message && (
        <div className={`oa-message${message.ok ? "" : " error"}`} role={message.ok ? "status" : "alert"}>
          <span className="ops-pre">{message.text}</span>
          <button type="button" onClick={() => setMessage(null)}>Dismiss</button>
        </div>
      )}
      {unit.status === "generating" && <div className="oa-preview-banner" role="status"><b>The AI is writing this unit.</b> This takes 1–3 minutes; the page updates by itself.</div>}
      {unit.status === "published" && <div className="oa-preview-banner"><b>Published units can&apos;t be edited.</b> Unpublish it first (only possible while no learner has started it).</div>}
      {unit.status === "failed" && unit.generation_error && <div className="oa-message error" role="alert"><span>Generation failed: {unit.generation_error}</span></div>}

      <fieldset className="ops-fieldset" disabled={!editable || !!busy}>
        <section className="oa-panel ops-section">
          <h2>Plan</h2>
          <div className="ops-grid">
            <label>Title<input value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label>Level
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Form["level"] })}>
                {LEVELS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>Can-do (English)<textarea rows={2} value={form.can_do_en} maxLength={300} onChange={(e) => setForm({ ...form, can_do_en: e.target.value })} /></label>
            <label>Can-do (Somali)<textarea rows={2} value={form.can_do_so} maxLength={300} onChange={(e) => setForm({ ...form, can_do_so: e.target.value })} /></label>
            <label className="full">Notes for the AI<textarea rows={2} value={form.notes} maxLength={2000} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          </div>
        </section>
      </fieldset>

      {hasContent ? (
        <>
          <nav className="ops-tabs" aria-label="Learner level">
            {VARIANT_LEVELS.map(([l, label]) => (
              <button key={l} type="button" aria-current={tab === l ? "page" : undefined} onClick={() => setTab(l)}>{label}</button>
            ))}
          </nav>
          <fieldset className="ops-fieldset" disabled={!editable || !!busy}>
            <VariantFields
              key={tab}
              v={form.variants[tab]!}
              onChange={(v) => setForm({ ...form, variants: { ...form.variants, [tab]: v } })}
            />
          </fieldset>
        </>
      ) : (
        editable && (
          <section className="oa-panel">
            <div className="oa-empty">
              <p>Not written yet. The AI writes it from this plan and the rest of the {categoryLabel(unit.path)} course plan.</p>
              <button type="button" className="oa-button primary" disabled={!!busy} onClick={generate}>Generate</button>
            </div>
          </section>
        )
      )}
    </div>
  );
}
