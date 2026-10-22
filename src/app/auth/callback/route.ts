import {NextResponse, type NextRequest} from "next/server";
import {createClient} from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
 let reason = "invalid-link";
 const code = request.nextUrl.searchParams.get("code");
 const tokenHash = request.nextUrl.searchParams.get("token_hash");
 const type = request.nextUrl.searchParams.get("type");
 const requestedNext = request.nextUrl.searchParams.get("next") || "/portal";
 const next = requestedNext.startsWith("/portal") && !requestedNext.startsWith("//") ? requestedNext : "/portal";
 const passwordRecovery=next.includes("recovery=1");
 if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const client = await createClient();
  const finish = async (method:"email_link"|"session") => {
   const assurance=await client.auth.mfa.getAuthenticatorAssuranceLevel();
   if(method==="email_link"&&!assurance.error&&(assurance.data.nextLevel!=="aal2"||assurance.data.currentLevel==="aal2"))await client.rpc("record_portal_login",{p_method:method,p_client_label:"University web portal"});
   return NextResponse.redirect(new URL(next, request.url));
  };
  if (code) {const {error} = await client.auth.exchangeCodeForSession(code); if (!error) return finish(passwordRecovery?"session":"email_link"); reason = error.code || "invalid-link";}
  if (tokenHash && (type === "invite" || type === "magiclink" || type === "email" || type === "recovery")) {const {error} = await client.auth.verifyOtp({token_hash: tokenHash, type}); if (!error) return finish(type==="recovery"?"session":"email_link"); reason = error.code || "invalid-link";}
 }
 const login = new URL("/login", request.url); login.searchParams.set("error", "invalid-link"); login.searchParams.set("reason", reason); return NextResponse.redirect(login);
}

