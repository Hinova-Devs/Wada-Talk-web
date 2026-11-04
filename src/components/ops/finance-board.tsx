"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toCents, usd } from "@/lib/ops/access";
import { opsRpc } from "@/lib/ops/call";

export type FinanceRow = {
  id: string; kind: "income" | "expense" | "payout"; category: string; amount_cents: number;
  party: string | null; note: string | null; entry_date: string;
};
const KINDS = [["income", "Income"], ["expense", "Expense"], ["payout", "Payout"]] as const;
const CATEGORIES = ["Organization fees", "Learner subscriptions", "LiveKit", "AI usage", "Supabase / hosting", "Teacher pay", "Marketing", "Other"];
const day = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));

/** Money in and out for one month: add entries, see income, expenses, payouts and the net. */
export function FinanceBoard({ month, rows, loadFailed }: { month: string; rows: FinanceRow[]; loadFailed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const sum = (k: FinanceRow["kind"]) => rows.filter((r) => r.kind === k).reduce((t, r) => t + r.amount_cents, 0);
  const income = sum("income");
  const out = sum("expense") + sum("payout");

  async function run(key: string, fn: string, args: Record<string, unknown>, done: string) {
    setBusy(key);
    setMessage(null);
    try {
      await opsRpc(fn, args);
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
    const form = e.currentTarget;
    const f = new FormData(form);
    const cents = toCents(String(f.get("amount")));
    if (!cents) return setMessage({ ok: false, text: "Enter an amount above zero, like 250 or 12.50." });
    const ok = await run("add", "ops_finance_add", {
      p_kind: f.get("kind"), p_category: String(f.get("category")).trim(), p_amount_cents: cents,
      p_party: String(f.get("party")), p_note: String(f.get("note")), p_entry_date: f.get("date"),
    }, "Saved.");
    if (ok) form.reset();
  }

  return (
    <>
      <header className="oa-page-head">
        <div>
          <span>Money</span>
          <h1>Finance</h1>
          <p>Everything related to money: what comes in, what Hinova spends, and what it pays its teachers. Amounts are in US dollars.</p>
        </div>
        <div className="oa-page-actions">
          <label>Month<input type="month" value={month} onChange={(e) => e.target.value && router.push(`/finance?month=${e.target.value}`)} /></label>
        </div>
      </header>
      <div className="oa-stats">
        <article className="oa-stat green"><span>Income</span><strong>{usd(income)}</strong><small>This month</small></article>
        <article className="oa-stat orange"><span>Expenses</span><strong>{usd(sum("expense"))}</strong><small>Tools, hosting, AI</small></article>
        <article className="oa-stat purple"><span>Payouts</span><strong>{usd(sum("payout"))}</strong><small>Teachers and staff</small></article>
        <article className="oa-stat blue"><span>Net</span><strong>{usd(income - out)}</strong><small>Income minus all money out</small></article>
      </div>
      {message && <div className={message.ok ? "oa-preview-banner" : "oa-empty"} role="status">{message.text}</div>}
      <form className="oa-panel oa-create-form ops-add" onSubmit={add}>
        <h2>Add an entry</h2>
        <div>
          <label>Type<select name="kind">{KINDS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}</select></label>
          <label>Category<input name="category" list="fin-cats" required maxLength={60} /></label>
          <label>Amount (USD)<input name="amount" inputMode="decimal" required placeholder="250" /></label>
          <label>From / to (organization, vendor, person email)<input name="party" /></label>
          <label>Date<input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label>
          <label className="full">Note<input name="note" /></label>
        </div>
        <datalist id="fin-cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
        <button className="oa-button primary" disabled={busy === "add"}>{busy === "add" ? "Saving…" : "Add entry"}</button>
      </form>
      {loadFailed ? (
        <div className="oa-empty">Could not load the entries. Refresh, or check that the latest backend migration is applied.</div>
      ) : rows.length === 0 ? (
        <div className="oa-empty">No entries in this month yet.</div>
      ) : (
        <section className="oa-panel">
          <table className="oa-table">
            <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>From / to</th><th>Amount</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{day(r.entry_date)}</td>
                  <td><span className="ops-status">{KINDS.find(([id]) => id === r.kind)?.[1]}</span></td>
                  <td>{r.category}{r.note && <><br /><small>{r.note}</small></>}</td>
                  <td>{r.party ?? "—"}</td>
                  <td><b>{r.kind === "income" ? "+" : "−"}{usd(r.amount_cents)}</b></td>
                  <td>
                    <button type="button" className="oa-button ghost" disabled={busy === r.id}
                      onClick={() => confirm("Delete this entry?") && void run(r.id, "ops_finance_delete", { p_id: r.id }, "Deleted.")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
