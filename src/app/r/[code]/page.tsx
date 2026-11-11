import Link from "next/link";
import { Frame } from "@/components/pages";
import { StoreButtons } from "@/components/forms";
export const metadata = { title: "A friend invited you to Wada", robots: { index: false, follow: false } };

// Affiliate link from the app's Settings. Only the shape is checked here; the app checks the code for real (`affiliate_claim`).
const SHAPE = /^[A-Z0-9]{6,12}$/;

export default async function Invited({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw).toUpperCase();
  const ok = SHAPE.test(code);
  return <Frame><section className="container"><div className="join-card">
    {ok ? <><div className="eyebrow">Invitation</div><h1 className="join-title">A friend invited you to Wada</h1>
      <p>Get the app, create your account, then enter this code when it asks <b>Have a friend&apos;s code?</b></p><div className="class-code">{code}</div><StoreButtons code={code} /></>
    : <><div className="eyebrow">Invitation</div><h2>This code does not look right</h2><p>Ask your friend to share their link again.</p><Link href="/download" className="button">Get the app</Link></>}
  </div></section></Frame>;
}
