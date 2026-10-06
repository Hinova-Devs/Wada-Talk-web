import {type NextRequest, NextResponse} from "next/server";
import {updateSession} from "@/lib/supabase/middleware";
export async function proxy(request: NextRequest) {
 const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 const dashboard = process.env.WADA_APP_MODE === "dashboard" || request.nextUrl.hostname === "admin.wada.com";
 if (request.nextUrl.pathname === "/" && (dashboard || request.nextUrl.searchParams.has("code") || request.nextUrl.searchParams.has("token_hash"))) {
  const target = request.nextUrl.clone();
  target.pathname = request.nextUrl.searchParams.has("code") || request.nextUrl.searchParams.has("token_hash") ? "/auth/callback" : "/portal";
  const response = configured ? await updateSession(request) : NextResponse.next({request});
  const rewrite = NextResponse.rewrite(target);
  response.cookies.getAll().forEach(cookie => rewrite.cookies.set(cookie));
  return rewrite;
 }
 if (request.nextUrl.pathname.startsWith("/portal") && !request.nextUrl.pathname.startsWith("/portal-preview")) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return NextResponse.redirect(new URL("/login", request.url));
  return updateSession(request);
 }
 if (configured && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname.startsWith("/auth/"))) return updateSession(request);
 return NextResponse.next();
}
export const config = {matcher: ["/", "/portal/:path*", "/login", "/auth/:path*"]};

