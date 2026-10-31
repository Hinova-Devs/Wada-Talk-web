"use client";
/* Ported from the user-owned Claude Design source; no design runtime is required. */
import {Fragment, type CSSProperties} from "react";
import Link from "next/link";
import {Header, Footer} from "../shell";
import {DownloadQR, DemoForm} from "../forms";
import {useSafety} from "./hooks";
export default function SafetyDesign({lang="en"}: {lang?: "en"|"so"}) { const v=useSafety(lang); return (<>

<div lang={v.lang} data-screen-label={"Safety"} style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontSize":"17px","lineHeight":"1.55","background":"#E6ECF3","color":"#0F1B2D"} as CSSProperties}>
<div style={{"position":"sticky","top":"0","zIndex":"50"} as CSSProperties}><Header page="safety" lang={v.lang} dark={false} /></div>
<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(56px,8vw,104px) clamp(16px,4vw,40px) clamp(40px,5vw,64px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,380px),1fr))","gap":"32px 56px","alignItems":"center"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0B7DB3"} as CSSProperties}>{"Safety and privacy"}</div>
<h1 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(44px,6vw,80px)","lineHeight":"1.06","letterSpacing":"-.02em","margin":"10px 0 0","textWrap":"balance"} as CSSProperties}>{v.en && <>{"Practice with people you can trust."}</>}{v.so && <>{"La tababar dad aad ku kalsoon tahay."}</>}</h1>
<p style={{"fontSize":"20px","color":"#5B6778","margin":"18px 0 0","maxWidth":"40ch"} as CSSProperties}>{"How Wada keeps calls safe for students, what families should know, and what organizations can and can't see."}</p>
</div>
<div style={{"display":"flex","justifyContent":"center","position":"relative"} as CSSProperties}>
<div style={{"width":"min(100%,360px)","aspectRatio":"1","borderRadius":"50%","background":"#0F1B2D","display":"grid","placeItems":"center","position":"relative"} as CSSProperties}>
<img src={"/assets/fox.webp"} alt={"Wada the fox"} style={{"width":"62%","display":"block","animation":"wbob 3.6s ease-in-out infinite"} as CSSProperties} loading="lazy" width={240} height={240} />
<span style={{"position":"absolute","right":"4%","bottom":"10%","width":"84px","height":"84px","borderRadius":"26px","background":"#26AEE8","color":"#0F1B2D","display":"grid","placeItems":"center","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M20 13c0 5-3.5 7.5-7.66 8.950a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}></path><path d={"m9 12 2 2 4-4"}></path></svg></span>
</div>
</div>
</section>
<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(24px,4vw,48px) clamp(16px,4vw,40px) clamp(64px,8vw,104px)"} as CSSProperties}>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(32px,3.8vw,48px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"0"} as CSSProperties}>{"On every call"}</h2>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,300px),1fr))","gap":"18px","marginTop":"32px"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"56px","height":"56px","borderRadius":"17px","background":"#CFEAF6","color":"#0B7DB3","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}></path><circle cx={"9"} cy={"7"} r={"4"}></circle><path d={"M22 21v-2a4 4 0 0 0-3-3.87"}></path><path d={"M16 3.13a4 4 0 0 1 0 7.75"}></path></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"24px","lineHeight":"1.15","margin":"0"} as CSSProperties}>{"Who you talk to"}</h3>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"Partners at your level. Classmates first when you join through your university. Choose same-gender partners if you prefer."}</p>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"56px","height":"56px","borderRadius":"17px","background":"#CFEAF6","color":"#0B7DB3","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"}></path></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"24px","lineHeight":"1.15","margin":"0"} as CSSProperties}>{"Audio-only, any time"}</h3>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"Turn your camera off before or during a call. Your score doesn't change."}</p>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"56px","height":"56px","borderRadius":"17px","background":"#CFEAF6","color":"#0B7DB3","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"}></path><line x1={"4"} x2={"4"} y1={"22"} y2={"15"}></line></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"24px","lineHeight":"1.15","margin":"0"} as CSSProperties}>{"Report and block"}</h3>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"One tap ends the call, blocks the person and sends a report. Accounts with repeated reports are suspended."}</p>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"56px","height":"56px","borderRadius":"17px","background":"#CFEAF6","color":"#0B7DB3","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}></path><path d={"m9 12 2 2 4-4"}></path></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"24px","lineHeight":"1.15","margin":"0"} as CSSProperties}>{"AI safety checks"}</h3>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"Calls are checked automatically for harmful behaviour, and flagged calls are reviewed by the Wada team."}</p>
</div>
</div>
</section>
<section style={{"background":"#0F1B2D","color":"#E6ECF3"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(64px,8vw,104px) clamp(16px,4vw,40px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,380px),1fr))","gap":"32px 56px","alignItems":"start"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#26AEE8"} as CSSProperties}>{"For families"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(32px,3.8vw,48px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"Questions parents ask us"}</h2>
</div>
<div style={{"display":"grid","gap":"10px"} as CSSProperties}>
{v.faq.map((q, index) => <Fragment key={index}>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"20px","overflow":"hidden"} as CSSProperties}>
<button type={"button"} onClick={q.toggle} aria-expanded={q.open} style={{"width":"100%","display":"flex","alignItems":"center","gap":"14px","textAlign":"left","padding":"18px 20px","background":"transparent","border":"0","color":"#E6ECF3","font":"700 18px 'Plus Jakarta Sans',sans-serif","cursor":"pointer","minHeight":"56px"} as CSSProperties}>
<span style={{"flex":"1"} as CSSProperties}>{q.q}</span><span style={{"width":"32px","height":"32px","borderRadius":"10px","background":"#243550","display":"grid","placeItems":"center","fontWeight":"800","color":"#26AEE8","transition":"transform .2s","transform":"rotate(" + q.rot + ")"} as CSSProperties}>{"+"}</span>
</button>
{q.open && <><p style={{"margin":"0","padding":"0 20px 20px","color":"#B5C0CF","fontSize":"17px"} as CSSProperties}>{q.a}</p></>}
</div>
</Fragment>)}
</div>
</div>
</section>
<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(64px,8vw,104px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,340px),1fr))","gap":"18px"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"28px","padding":"28px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"30px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{"What organizations see"}</h2>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"If you join through a university or employer, they see your scores, progress and mistake categories. Never your recordings or full transcripts. A teacher only sees their own classes."}</p>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"28px","padding":"28px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"30px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{"What we record"}</h2>
<p style={{"margin":"0","color":"#5B6778"} as CSSProperties}>{"Calls are processed to create your private report and for safety checks. Read the privacy page for information about data handling. You can delete your account and data at any time."}</p>
</div>
</div>
<div style={{"display":"flex","flexWrap":"wrap","gap":"12px","marginTop":"28px"} as CSSProperties}>
<Link href={"/privacy"} style={{"display":"inline-flex","alignItems":"center","minHeight":"52px","padding":"0 20px","borderRadius":"14px","background":"#E6ECF3","border":"2px solid #C3CCD8","color":"#0F1B2D","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>{"Privacy Policy"}</Link>
<Link href={"/community-rules"} style={{"display":"inline-flex","alignItems":"center","minHeight":"52px","padding":"0 20px","borderRadius":"14px","background":"#E6ECF3","border":"2px solid #C3CCD8","color":"#0F1B2D","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>{"Community rules"}</Link>
<Link href={"/delete-account"} style={{"display":"inline-flex","alignItems":"center","minHeight":"52px","padding":"0 20px","borderRadius":"14px","background":"#E6ECF3","border":"2px solid #C3CCD8","color":"#0F1B2D","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>{"Delete account"}</Link>
<Link href={"/download"} style={{"display":"inline-flex","alignItems":"center","minHeight":"52px","padding":"0 24px","borderRadius":"14px","background":"#26AEE8","color":"#0F1B2D","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","marginLeft":"auto"} as CSSProperties} className="design-action-13">{"Get the app"}</Link>
</div>
</section>
<Footer />
</div>
</>); }
