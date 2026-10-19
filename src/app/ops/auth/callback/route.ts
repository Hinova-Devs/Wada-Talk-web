import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { opsConfigured } from "@/lib/ops/gate";

// A relative Location keeps the browser on the ops subdomain (request.url is the rewritten /ops URL).
const go = (path: string) => new NextResponse(null, { status: 307, headers: { Location: path } });

// The email link lands here (ops.<domain>/auth/callback) and signs the person in on the ops subdomain.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && opsConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return go("/lessons");
  }
  return go("/login?error=invalid-link");
}
