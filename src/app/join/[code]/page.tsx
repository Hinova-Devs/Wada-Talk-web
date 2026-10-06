import {Frame} from "@/components/pages";
import {JoinForm} from "@/components/forms";
export const metadata = {title: "Join your Wada class", robots: {index: false, follow: false}};
export default async function JoinClass({params}: {params: Promise<{code: string}>}) {
 const {code: raw} = await params;
 const code = raw.toUpperCase();
 return <Frame><section className="container"><p>Your teacher will see your progress, scores and common mistakes, never your recordings or what you said.</p>{/^[A-Z0-9]{10}$/.test(code) ? <><JoinForm initialCode={code}/><p className="muted">Open Wada and enter this code. The app checks whether the code is valid and whether seats are available.</p></> : <div className="join-card"><h1>Check your class code</h1><p>Ask your teacher for a current 10-character code.</p></div>}</section></Frame>;
}
