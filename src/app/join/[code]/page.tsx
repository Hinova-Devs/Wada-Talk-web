import { createClient } from "@/lib/supabase/server";
import { Frame } from "@/components/pages";
import { StoreButtons } from "@/components/forms";
import { rows, get, text } from "@/lib/portal/data";
export const dynamic = "force-dynamic";
export const metadata = { title: "Join your Wada class", robots: { index: false, follow: false } };
export default async function JoinClass({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = raw.toUpperCase();
  let preview: Record<string, unknown> | undefined;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const client = await createClient();
    const { data, error } = await client.rpc("class_preview", { code });
    if (!error) preview = rows(data)[0];
  }
  const state = String(get(preview, "status", "state") ?? "valid").toLowerCase();
  const valid = !!preview && !["invalid", "expired", "invalid / expired"].includes(state) && !!get(preview, "class_name", "name");
  return <Frame><section className="container"><div className="join-card"><img src="/assets/fox-tile.webp" width="72" height="72" alt="" />
    {valid ? <><div className="eyebrow">Class invitation</div><h1 className="join-title">You’re joining {text(get(preview, "class_name", "name"))}</h1><p>{text(get(preview, "section_name"))} at {text(get(preview, "org_name", "organization_name"))}</p><div className="class-code">{code}</div><StoreButtons code={code} /></> : <><div className="eyebrow">Class invitation</div><h2>This code is invalid or expired</h2><p>Ask your teacher for a current class code, then try again.</p><div className="class-code">{code}</div><a href="/download" className="button">Get Wada</a></>}
  </div></section></Frame>;
}
