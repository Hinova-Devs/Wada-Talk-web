import {NextResponse, type NextRequest} from "next/server";
import {createClient} from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
 let reason = "invalid-link";
 const code = request.nextUrl.searchParams.get("code");
 const tokenHash = request.nextUrl.searchParams.get("token_hash");
 const type = request.nextUrl.searchParams.get("type");
 const requestedNext = request.nextUrl.searchParams.get("next") || "/portal";
 const next = requestedNext.startsWith("/portal") && !requestedNext.startsWith("//") ? requestedNext : "/portal";
 if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const client = await createClient();
  if (code) {const {error} = await client.auth.exchangeCodeForSession(code); if (!error) {await client.rpc("record_portal_login",{p_method:"email_link",p_client_label:"University web portal"});return NextResponse.redirect(new URL(next, request.url));} reason = error.code || "invalid-link";}
  if (tokenHash && (type === "invite" || type === "magiclink" || type === "email" || type === "recovery")) {const {error} = await client.auth.verifyOtp({token_hash: tokenHash, type}); if (!error) {await client.rpc("record_portal_login",{p_method:"email_link",p_client_label:"University web portal"});return NextResponse.redirect(new URL(next, request.url));} reason = error.code || "invalid-link";}
 }
 const login = new URL("/login", request.url); login.searchParams.set("error", "invalid-link"); login.searchParams.set("reason", reason); return NextResponse.redirect(login);
}

