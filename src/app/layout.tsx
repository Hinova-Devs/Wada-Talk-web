import type {Metadata} from "next";
import {PortalWarmup} from "@/components/portal/warmup";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'Wada — Speak English. Together.',template:'%s | Wada'},description:'Practice speaking English with real students. An AI coach shows you exactly what to fix. Made in Hargeisa.',icons:{icon:'/assets/fox-tile.webp'},openGraph:{title:'Wada — Speak English. Together.',description:'Real conversations. Your own AI coach.',type:'website',images:['/opengraph-image']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<PortalWarmup/></body></html>}

