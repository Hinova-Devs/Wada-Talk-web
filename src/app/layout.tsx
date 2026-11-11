import type {Metadata} from "next";
import "./globals.css";
import {AuthHash} from "@/components/auth-hash";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'Wada — Speak English. Together.',template:'%s | Wada'},description:'Practice speaking English with real students. An AI coach shows you exactly what to fix. Made in Hargeisa.',openGraph:{title:'Wada — Speak English. Together.',description:'Real conversations. Your own AI coach.',type:'website',images:['/opengraph-image']}};
const themeScript=`try{var t=localStorage.getItem("wada-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><AuthHash/>{children}</body></html>}
