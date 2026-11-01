import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const configured = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Hinova's internal site lives on its own subdomain (ops.wada-talk.com, ops.localhost locally). */
export const isOpsHost = (host: string | null) => !!host && host.startsWith("ops.");

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ops.<domain>/x is served by app/ops/x. Its links leave out /ops, so its URLs stay clean.
  if (isOpsHost(request.headers.get("host"))) {
    const url = request.nextUrl.clone();
    url.pathname = path.startsWith("/ops") ? path : `/ops${path === "/" ? "" : path}`;
    if (!configured()) return NextResponse.rewrite(url);
    return updateSession(request, () => NextResponse.rewrite(url, { request }));
  }
  // The internal pages exist only on the ops subdomain.
  if (path === "/ops" || path.startsWith("/ops/")) return new NextResponse("Not found", { status: 404 });

  // A sign-in link whose redirect URL Supabase does not allow lands on the Site URL (/) with ?code=.
  // Pass it on to the callback so the email link still signs the person in.
  if (path === "/" && request.nextUrl.searchParams.has("code") && configured()) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/portal")) {
    if (!configured()) return NextResponse.redirect(new URL("/login", request.url));
    return updateSession(request);
  }
  return NextResponse.next();
}

// Every page; not Next's own files or the static assets in public/.
export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)"],
};
