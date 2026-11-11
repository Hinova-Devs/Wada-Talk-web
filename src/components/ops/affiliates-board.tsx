"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toCents, usd } from "@/lib/ops/access";
import { opsRpc } from "@/lib/ops/call";

export type AffiliateRow = {
  user_id: string; email: string; code: string; referrals: number; paid: number;
  earned_cents: number; paid_out_cents: number; balance_cents: number;
};
export type PayoutRequest = {
  id: string; email: string; phone: string; amount_cents: number; status: "requested" | "paid"; requested_at: string; paid_at: string | null;
};
export type AffiliateSettings = { pilot_until: string | null; min_payout_cents: number; rates: { from_n: number; percent: number }[] };
const day = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));

/** The affiliate program: payout requests to pay by hand, who refers whom, the pilot date, and a test-payment button. */
export function AffiliatesBoard({ rows, requests, settings, loadFailed }: { rows: AffiliateRow[]; requests: PayoutRequest[]; settings: AffiliateSettings | null; loadFailed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const open = requests.filter((r) => r.status === "requested");

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

  const pay = (r: PayoutRequest) => {
    if (confirm(`Mark ${usd(r.amount_cents)} to ${r.email} (${r.phone}) as paid? Do this after you have sent the money. It is added to Finance.`))
      void run(r.id, "ops_affiliate_pay", { p_request: r.id }, `Paid ${usd(r.amount_cents)} to ${r.email}. Recorded in Finance.`);
  };
  function saveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const min = toCents(String(f.get("min")));
    if (!min) return setMessage({ ok: false, text: "The minimum payout must be above zero, like 5." });
    void run("settings", "ops_affiliate_settings_set", { p_pilot_until: String(f.get("pilot")) || null, p_min_payout_cents: min }, "Saved.");
  }
  function testPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    void run("test", "ops_payment_mark", { p_email: email }, `A $3 payment was recorded for ${email}. If someone invited them, that person just earned.`);
  }

  return (
    <>
      <header className="oa-page-head">
        <div>
          <span>Growth</span>
          <h1>Affiliates</h1>
          <p>Users share their link; when a friend pays, the referrer earns a share of that first payment. You pay referrers by hand, then press Pay.</p>
        </div>
      </header>
      {message && <div className={message.ok ? "oa-preview-banner" : "oa-empty"} role="status">{message.text}</div>}
      {loadFailed ? (
        <div className="oa-empty">Could not load affiliates. Refresh, or check that the latest backend migration is applied.</div>
      ) : (
        <>
          <section className="oa-panel">
            <header className="oa-panel-head"><div><span>{open.length} waiting</span><h2>Payout requests</h2></div></header>
            {requests.length === 0 ? (
              <div className="oa-empty">No payout requests yet.</div>
            ) : (
              <table className="oa-table">
                <thead><tr><th>Who</th><th>Send to</th><th>Amount</th><th>Asked</th><th /></tr></thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.email}</td>
                      <td><b>{r.phone}</b></td>
                      <td>{usd(r.amount_cents)}</td>
                      <td>{day(r.requested_at)}</td>
                      <td>
                        {r.status === "requested"
                          ? <button type="button" className="oa-button primary" disabled={busy === r.id} onClick={() => pay(r)}>{busy === r.id ? "Saving…" : "Mark paid"}</button>
                          : <span className="ops-status">Paid {r.paid_at ? day(r.paid_at) : ""}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <section className="oa-panel">
            <header className="oa-panel-head"><div><span>Referrers</span><h2>Who is bringing people</h2></div></header>
            {rows.length === 0 ? (
              <div className="oa-empty">No one has been referred yet.</div>
            ) : (
              <table className="oa-table">
                <thead><tr><th>Referrer</th><th>Code</th><th>Joined</th><th>Paid</th><th>Earned</th><th>Paid out</th><th>Balance</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.user_id}>
                      <td>{r.email}</td><td>{r.code}</td><td>{Number(r.referrals)}</td><td>{Number(r.paid)}</td>
                      <td>{usd(Number(r.earned_cents))}</td><td>{usd(Number(r.paid_out_cents))}</td><td><b>{usd(Number(r.balance_cents))}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          {settings && (
            <form className="oa-panel oa-create-form ops-add" onSubmit={saveSettings}>
              <h2>Rates and pilot</h2>
              <p className="ops-hint">
                Now: {settings.rates.map((r, i, all) => `friends ${r.from_n}${all[i + 1] ? `–${all[i + 1].from_n - 1}` : "+"} earn ${r.percent}%`).join(", ")} of what they pay after the gateway fee.
                Until the pilot date everyone earns 100%. To change the percentages, edit the <code>affiliate_rates</code> table.
              </p>
              <div>
                <label>Pilot: everyone earns 100% until<input name="pilot" type="date" defaultValue={settings.pilot_until ?? ""} /></label>
                <label>Minimum payout (USD)<input name="min" inputMode="decimal" defaultValue={settings.min_payout_cents / 100} required /></label>
              </div>
              <button className="oa-button primary" disabled={busy === "settings"}>{busy === "settings" ? "Saving…" : "Save"}</button>
            </form>
          )}
          <form className="oa-panel oa-create-form ops-add" onSubmit={testPayment}>
            <h2>Record a test payment</h2>
            <p className="ops-hint">Until the payment gateway is connected: records a $3 payment for an account, as if the gateway confirmed it. Use it to try the whole flow.</p>
            <div><label>Account email<input name="email" type="email" required /></label></div>
            <button className="oa-button ghost" disabled={busy === "test"}>{busy === "test" ? "Saving…" : "Record $3 payment"}</button>
          </form>
        </>
      )}
    </>
  );
}
