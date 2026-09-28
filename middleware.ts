import {type NextRequest,NextResponse} from "next/server";
import {updateSession} from "@/lib/supabase/middleware";
export async function middleware(request:NextRequest){if(request.nextUrl.pathname.startsWith('/portal')){if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)return NextResponse.redirect(new URL('/login',request.url));return updateSession(request);}return NextResponse.next();}
export const config={matcher:['/portal/:path*']};
