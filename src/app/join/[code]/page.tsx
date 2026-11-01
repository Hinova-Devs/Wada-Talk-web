import Link from "next/link";
import { Frame } from "@/components/pages";
import { StoreButtons } from "@/components/forms";
export const metadata = { title: "Join your Wada class", robots: { index: false, follow: false } };

// The backend has no way to check a class code without a signed-in learner (`take_seat`, Wada Backend DOC/dashboard-api.md §8),
// so this page only checks the shape of the code. The app checks it for real when the learner joins.
const SHAPE = /^[A-Z0-9-]{4,24}$/;

export default async function JoinClass({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw).toUpperCase();
  const ok = SHAPE.test(code);
  return <Frame><section className="container"><div className="join-card">
    {ok ? <><div className="eyebrow">Class invitation</div><h1 className="join-title">Join your class in Wada</h1>
      <p>Get the app, sign in, then enter this code under <b>Join a class</b>.</p><div className="class-code">{code}</div><StoreButtons code={code} />
      <p className="join-note">Your teacher will see your progress, scores and common mistakes, never your recordings or what you said.</p></>
    : <><div className="eyebrow">Class invitation</div><h2>This code does not look right</h2><p>Class codes use letters and numbers only. Ask your teacher for the code again, then try again.</p><Link href="/download" className="button">Enter a code</Link></>}
  </div></section></Frame>;
}
