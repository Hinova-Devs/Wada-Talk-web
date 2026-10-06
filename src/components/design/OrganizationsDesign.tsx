"use client";
/* Ported from the user-owned Claude Design source; no design runtime is required. */
import {Fragment, type CSSProperties} from "react";
import Link from "next/link";
import {Header, Footer} from "../shell";
import {DownloadQR, DemoForm} from "../forms";
import {useOrganizations} from "./hooks";
export default function OrganizationsDesign({lang="en"}: {lang?: "en"|"so"}) { const v=useOrganizations(lang); return (<>

<div lang={v.langCode} data-screen-label={"Organizations"} style={{"fontFamily":"'Nunito Sans',system-ui,sans-serif","fontSize":"17px","lineHeight":"1.55","background":"#F7F1E8","color":"#1A2030"} as CSSProperties}>
<div style={{"position":"sticky","top":"0","zIndex":"50"} as CSSProperties}><Header page="orgs" lang={v.lang} dark={true} /></div>

<section style={{"background":"#0D1321","color":"#FFFCF7","position":"relative","overflow":"hidden"} as CSSProperties}>
<div style={{"position":"absolute","left":"60%","top":"40%","width":"70%","aspectRatio":"1","transform":"translate(-50%,-50%)","borderRadius":"50%","background":"radial-gradient(closest-side,rgba(240,135,58,.22),transparent 70%)","pointerEvents":"none"} as CSSProperties}></div>
<div style={{"position":"relative","maxWidth":"1200px","margin":"0 auto","padding":"clamp(56px,8vw,112px) clamp(16px,4vw,40px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,440px),1fr))","gap":"48px 64px","alignItems":"center"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#F0873A"} as CSSProperties}>{"For universities, schools, businesses and NGOs"}</div>
<h1 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(42px,5.8vw,78px)","lineHeight":"1.06","letterSpacing":"-.02em","margin":"12px 0 0","textWrap":"balance"} as CSSProperties}>{"Speaking practice for every student, "}<span style={{"color":"#F0873A"} as CSSProperties}>{"and a dashboard that shows it."}</span></h1>
<div style={{"display":"flex","flexWrap":"wrap","gap":"12px","marginTop":"32px"} as CSSProperties}>
<Link href={"#demo"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 28px","borderRadius":"16px","background":"#F0873A","color":"#0D1321","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 5px 0 #C85512"} as CSSProperties} className="design-action-14">{"Book a demo"}</Link>
<Link href={"/login"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 24px","borderRadius":"16px","border":"2px solid rgba(255,255,255,.28)","color":"#FFFCF7","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none"} as CSSProperties} className="design-action-15">{"Log in"}</Link>
</div>
<p style={{"fontSize":"15px","color":"#AEB4C2","margin":"22px 0 0"} as CSSProperties}>{"You see scores and progress, never recordings or transcripts."}</p>
</div>
<div style={{"position":"relative","minWidth":"0"} as CSSProperties}>
<div style={{"background":"#161F33","border":"1px solid rgba(255,255,255,.08)","borderRadius":"28px","overflow":"hidden","boxShadow":"0 30px 70px rgba(0,0,0,.4)"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"14px 18px","borderBottom":"1px solid rgba(255,255,255,.08)","fontSize":"13px"} as CSSProperties}>
<img src={"/assets/fox-tile.webp"} alt={""} width={"24"} height={"24"} style={{"width":"24px","height":"24px","borderRadius":"8px"} as CSSProperties} loading="lazy" /><span style={{"fontWeight":"800"} as CSSProperties}>{"org.wadatalk.com"}</span><span style={{"color":"#AEB4C2"} as CSSProperties}>{"· Class 2B"}</span><span style={{"marginLeft":"auto","fontSize":"11px","fontWeight":"800","padding":"3px 9px","borderRadius":"999px","background":"#22304A","color":"#C9CEDA"} as CSSProperties}>{"Sample data"}</span>
</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(110px,1fr))","gap":"10px","padding":"16px"} as CSSProperties}>
<div style={{"background":"#0D1321","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#AEB4C2"} as CSSProperties}>{"Active this week"}</div><div style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"38"}</div></div>
<div style={{"background":"#0D1321","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#AEB4C2"} as CSSProperties}>{"Minutes spoken"}</div><div style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"1,240"}</div></div>
<div style={{"background":"#0D1321","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#AEB4C2"} as CSSProperties}>{"Live Talks"}</div><div style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"96"}</div></div>
<div style={{"background":"#0D1321","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#AEB4C2"} as CSSProperties}>{"Units done"}</div><div style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"142"}</div></div>
</div>
<div style={{"padding":"0 16px 18px"} as CSSProperties}>
<div style={{"fontSize":"12px","fontWeight":"800","letterSpacing":".06em","textTransform":"uppercase","color":"#C9CEDA","marginBottom":"10px"} as CSSProperties}>{"Class average score, last 6 weeks"}</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(6,1fr)","gap":"8px","alignItems":"end","height":"110px"} as CSSProperties}>
<span style={{"height":"48%","background":"#22304A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span><span style={{"height":"52%","background":"#22304A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span><span style={{"height":"55%","background":"#22304A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span><span style={{"height":"61%","background":"#22304A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span><span style={{"height":"64%","background":"#22304A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span><span style={{"height":"70%","background":"#F0873A","borderRadius":"8px 8px 4px 4px"} as CSSProperties}></span>
</div>
</div>
</div>
<img src={"/assets/fox.webp"} alt={""} style={{"position":"absolute","left":"-28px","bottom":"-34px","width":"110px","animation":"wbob 3.6s ease-in-out infinite","filter":"drop-shadow(0 12px 18px rgba(0,0,0,.35))"} as CSSProperties} loading="lazy" width={240} height={240} />
</div>
</div>
</section>

<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B04A0E"} as CSSProperties}>{"How it works"}</div>
<h2 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.4vw,56px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"From demo to a talking class"}</h2>
<ol style={{"listStyle":"none","margin":"40px 0 0","padding":"0","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,240px),1fr))","gap":"16px"} as CSSProperties}>
<li style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"24px","padding":"22px","boxShadow":"0 5px 0 #EADFCF","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"48px","height":"48px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","display":"grid","placeItems":"center","fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"22px"} as CSSProperties}>{"1"}</span>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Seats"}</span>
<span style={{"fontSize":"16px","color":"#5A6070"} as CSSProperties}>{"After your demo, we set up your organization with the seats you need."}</span>
</li>
<li style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"24px","padding":"22px","boxShadow":"0 5px 0 #EADFCF","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"48px","height":"48px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","display":"grid","placeItems":"center","fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"22px"} as CSSProperties}>{"2"}</span>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Classes with join codes"}</span>
<span style={{"fontSize":"16px","color":"#5A6070"} as CSSProperties}>{"Each class gets a code, a link and a QR poster. Students scan and land in the class."}</span>
</li>
<li style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"24px","padding":"22px","boxShadow":"0 5px 0 #EADFCF","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"48px","height":"48px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","display":"grid","placeItems":"center","fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"22px"} as CSSProperties}>{"3"}</span>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Live Talk hours"}</span>
<span style={{"fontSize":"16px","color":"#5A6070"} as CSSProperties}>{"Schedule the hours your class talks, so partners are always online together."}</span>
</li>
<li style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"24px","padding":"22px","boxShadow":"0 5px 0 #EADFCF","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"48px","height":"48px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","display":"grid","placeItems":"center","fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"22px"} as CSSProperties}>{"4"}</span>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Dashboard"}</span>
<span style={{"fontSize":"16px","color":"#5A6070"} as CSSProperties}>{"See who's improving, who needs help, and what to teach next."}</span>
</li>
</ol>
</section>

<section style={{"background":"#FFFCF7","borderTop":"2px solid #EADFCF","borderBottom":"2px solid #EADFCF"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B04A0E"} as CSSProperties}>{"Dashboard tour"}</div>
<h2 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.4vw,56px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"Know what to teach next"}</h2>
<div style={{"display":"flex","flexWrap":"wrap","gap":"24px","marginTop":"40px","alignItems":"flex-start"} as CSSProperties}>
<div role={"tablist"} aria-label={"Dashboard views"} style={{"flex":"1 1 280px","display":"grid","gap":"10px"} as CSSProperties}>
{v.tabs.map((tb, index) => <Fragment key={index}>
<button type={"button"} role={"tab"} aria-selected={tb.active} onClick={tb.pick} style={{"display":"grid","gap":"2px","textAlign":"left","padding":"16px 18px","borderRadius":"20px","cursor":"pointer","font":"inherit","color":"#1A2030","background":tb.bg,"border":"2px solid " + tb.border,"boxShadow":"0 4px 0 " + tb.border,"transition":"background .2s,border-color .2s"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{tb.title}</span>
<span style={{"fontSize":"15px","color":"#5A6070"} as CSSProperties}>{tb.line}</span>
</button>
</Fragment>)}
</div>
<div role={"tabpanel"} style={{"flex":"2 1 460px","minWidth":"0","background":"#0D1321","color":"#FFFCF7","borderRadius":"28px","padding":"clamp(18px,3vw,28px)","minHeight":"380px","boxShadow":"0 24px 50px rgba(13,19,33,.18)"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"10px","marginBottom":"18px"} as CSSProperties}><span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"700","fontSize":"22px"} as CSSProperties}>{v.tabTitle}</span><span style={{"marginLeft":"auto","fontSize":"11px","fontWeight":"800","padding":"3px 9px","borderRadius":"999px","background":"#22304A","color":"#C9CEDA"} as CSSProperties}>{"Sample data"}</span></div>
{v.t0 && <>
<div style={{"display":"grid","gap":"14px"} as CSSProperties}>
{v.skills.map((k, index) => <Fragment key={index}>
<div style={{"display":"grid","gridTemplateColumns":"130px 1fr 40px","gap":"12px","alignItems":"center","fontSize":"15px","fontWeight":"700"} as CSSProperties}><span >{k.label}</span><span style={{"position":"relative","height":"14px","borderRadius":"7px","background":"#22304A","overflow":"hidden"} as CSSProperties}><span style={{"position":"absolute","inset":"0 auto 0 0","width":k.was,"background":"#3A4A66","borderRadius":"7px"} as CSSProperties}></span><span style={{"position":"absolute","inset":"0 auto 0 0","width":k.now,"background":"#F0873A","borderRadius":"7px","opacity":".95"} as CSSProperties}></span></span><span style={{"textAlign":"right"} as CSSProperties}>{k.v}</span></div>
</Fragment>)}
<div style={{"display":"flex","gap":"18px","fontSize":"13px","color":"#AEB4C2","fontWeight":"700","marginTop":"6px"} as CSSProperties}><span style={{"display":"flex","alignItems":"center","gap":"6px"} as CSSProperties}><span style={{"width":"12px","height":"12px","borderRadius":"4px","background":"#F0873A"} as CSSProperties}></span>{"This month"}</span><span style={{"display":"flex","alignItems":"center","gap":"6px"} as CSSProperties}><span style={{"width":"12px","height":"12px","borderRadius":"4px","background":"#3A4A66"} as CSSProperties}></span>{"Last month"}</span></div>
</div>
</>}
{v.t1 && <>
<div style={{"display":"grid","gap":"10px"} as CSSProperties}>
{v.mistakes.map((k, index) => <Fragment key={index}>
<div style={{"display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","background":"#161F33","borderRadius":"16px","padding":"12px 14px"} as CSSProperties}><span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"20px","color":"#F0873A"} as CSSProperties}>{k.n}</span><span style={{"display":"grid","lineHeight":"1.3"} as CSSProperties}><span style={{"fontWeight":"800"} as CSSProperties}>{k.cat}</span><span style={{"fontSize":"14px","color":"#AEB4C2"} as CSSProperties}>{k.ex}</span></span><span style={{"fontSize":"13px","fontWeight":"800","color":"#FDE7D4","whiteSpace":"nowrap"} as CSSProperties}>{k.pct}{" of students"}</span></div>
</Fragment>)}
</div>
</>}
{v.t2 && <>
<div style={{"overflowX":"auto"} as CSSProperties}>
<table style={{"width":"100%","borderCollapse":"collapse","fontSize":"15px"} as CSSProperties}>
<thead ><tr style={{"textAlign":"left","color":"#AEB4C2","fontSize":"12px","letterSpacing":".06em","textTransform":"uppercase"} as CSSProperties}><th style={{"padding":"10px 8px","fontWeight":"800"} as CSSProperties}>{"Student"}</th><th style={{"padding":"10px 8px","fontWeight":"800"} as CSSProperties}>{"Score trend"}</th><th style={{"padding":"10px 8px","fontWeight":"800"} as CSSProperties}>{"Minutes"}</th><th style={{"padding":"10px 8px","fontWeight":"800"} as CSSProperties}>{"Last active"}</th></tr></thead>
<tbody >
{v.students.map((r, index) => <Fragment key={index}>
<tr style={{"borderTop":"1px solid rgba(255,255,255,.08)"} as CSSProperties}><td style={{"padding":"12px 8px","fontWeight":"700"} as CSSProperties}>{r.name}</td><td style={{"padding":"12px 8px","color":r.trendColor,"fontWeight":"800"} as CSSProperties}>{r.trend}</td><td style={{"padding":"12px 8px"} as CSSProperties}>{r.min}</td><td style={{"padding":"12px 8px"} as CSSProperties}><span style={{"fontSize":"13px","fontWeight":"800","padding":"4px 10px","borderRadius":"999px","background":r.tagBg,"color":r.tagFg} as CSSProperties}>{r.last}</span></td></tr>
</Fragment>)}
</tbody>
</table>
</div>
</>}
{v.t3 && <>
<div style={{"display":"grid","gap":"14px","maxWidth":"460px"} as CSSProperties}>
<label style={{"display":"grid","gap":"6px","fontSize":"14px","fontWeight":"700","color":"#C9CEDA"} as CSSProperties}>{"Class"}<span style={{"background":"#161F33","borderRadius":"14px","padding":"12px 14px","color":"#FFFCF7","fontWeight":"700"} as CSSProperties}>{"Class 2B · English for work"}</span></label>
<label style={{"display":"grid","gap":"6px","fontSize":"14px","fontWeight":"700","color":"#C9CEDA"} as CSSProperties}>{"Date range"}<span style={{"background":"#161F33","borderRadius":"14px","padding":"12px 14px","color":"#FFFCF7","fontWeight":"700"} as CSSProperties}>{"1 Sep – 30 Sep"}</span></label>
<div style={{"display":"flex","gap":"10px","flexWrap":"wrap","marginTop":"4px"} as CSSProperties}>
<span style={{"display":"inline-flex","alignItems":"center","minHeight":"48px","padding":"0 20px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","boxShadow":"0 4px 0 #C85512"} as CSSProperties}>{"Download PDF"}</span>
<span style={{"display":"inline-flex","alignItems":"center","minHeight":"48px","padding":"0 20px","borderRadius":"14px","border":"2px solid rgba(255,255,255,.25)","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase"} as CSSProperties}>{"CSV"}</span>
</div>
<p style={{"fontSize":"14px","color":"#AEB4C2","margin":"4px 0 0"} as CSSProperties}>{"For donors and management. Every export is logged."}</p>
</div>
</>}
</div>
</div>
</div>
</section>

<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,300px),1fr))","gap":"20px","alignItems":"stretch"} as CSSProperties}>
<div style={{"display":"grid","alignContent":"center","gap":"14px"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B04A0E"} as CSSProperties}>{"Privacy promise"}</div>
<h2 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(32px,3.8vw,48px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"0"} as CSSProperties}>{"Students speak freely because their calls stay theirs."}</h2>
<img src={"/assets/fox.webp"} alt={""} style={{"width":"110px","display":"block"} as CSSProperties} loading="lazy" width={240} height={240} />
</div>
<div style={{"background":"#E4F6D2","borderRadius":"28px","padding":"26px","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"26px","color":"#1F4D0A"} as CSSProperties}>{"You see"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#2F6E0F"} as CSSProperties}>{"✓"}</span>{"Scores and sub-scores"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#2F6E0F"} as CSSProperties}>{"✓"}</span>{"Progress over time"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#2F6E0F"} as CSSProperties}>{"✓"}</span>{"Mistake categories"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#2F6E0F"} as CSSProperties}>{"✓"}</span>{"Minutes and activity"}</span>
</div>
<div style={{"background":"#FDE3E1","borderRadius":"28px","padding":"26px","display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"26px","color":"#8E1F19"} as CSSProperties}>{"You never see"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#A8261F"} as CSSProperties}>{"✕"}</span>{"Call recordings"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#A8261F"} as CSSProperties}>{"✕"}</span>{"Full transcripts"}</span>
<span style={{"display":"flex","gap":"10px","fontWeight":"700"} as CSSProperties}><span style={{"color":"#A8261F"} as CSSProperties}>{"✕"}</span>{"Other teachers' classes"}</span>
</div>
</div>
</section>

<section style={{"maxWidth":"1200px","margin":"0 auto","padding":"0 clamp(16px,4vw,40px) clamp(72px,9vw,120px)"} as CSSProperties}>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,420px),1fr))","gap":"20px"} as CSSProperties}>
<div style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"28px","padding":"clamp(22px,3vw,34px)","boxShadow":"0 6px 0 #EADFCF","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0D1321","color":"#F0873A","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"}></path><path d={"M22 10v6"}></path><path d={"M6 12.5V16a6 3 0 0 0 12 0v-3.5"}></path></svg></span>
<h3 style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"30px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{"Universities and schools"}</h3>
<p style={{"margin":"0","color":"#5A6070"} as CSSProperties}>{"Give every student speaking time, even in a class of 80. Classmates practice with each other first, and teachers see class skills at a glance."}</p>
</div>
<div style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"28px","padding":"clamp(22px,3vw,34px)","boxShadow":"0 6px 0 #EADFCF","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0D1321","color":"#F0873A","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}></path><rect width={"20"} height={"14"} x={"2"} y={"6"} rx={"2"}></rect></svg></span>
<h3 style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"30px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{"Businesses and NGOs"}</h3>
<p style={{"margin":"0","color":"#5A6070"} as CSSProperties}>{"Track staff or beneficiary English over a programme, and export clear reports for donors and management."}</p>
</div>
</div>
</section>

<section id={"plans"} style={{"background":"#FFFCF7","borderTop":"2px solid #EADFCF","borderBottom":"2px solid #EADFCF"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B04A0E"} as CSSProperties}>{"Plans"}</div>
<h2 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.4vw,56px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"Start with one class"}</h2>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,290px),1fr))","gap":"18px","marginTop":"40px","alignItems":"stretch"} as CSSProperties}>
<div style={{"background":"#F7F1E8","border":"2px solid #EADFCF","borderRadius":"28px","padding":"26px","boxShadow":"0 6px 0 #EADFCF","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"28px"} as CSSProperties}>{"Students"}</span>
<span style={{"justifySelf":"start","fontSize":"13px","fontWeight":"800","padding":"4px 10px","borderRadius":"999px","background":"#EEF0F4","color":"#3A4152"} as CSSProperties}>{"Pricing to be confirmed"}</span>
<p style={{"margin":"0","color":"#5A6070"} as CSSProperties}>{"Every path, AI practice, Live Talk and your private reports."}</p>
<Link href={"/download"} style={{"display":"inline-flex","justifyContent":"center","alignItems":"center","minHeight":"52px","borderRadius":"14px","background":"#FFFCF7","border":"2px solid #E0D3C0","color":"#1A2030","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 4px 0 #E0D3C0","marginTop":"auto"} as CSSProperties}>{"Get the app"}</Link>
</div>
<div style={{"background":"#0D1321","color":"#FFFCF7","borderRadius":"28px","padding":"26px","boxShadow":"0 6px 0 #22304A","display":"grid","gap":"14px","alignContent":"start","position":"relative"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"28px"} as CSSProperties}>{"Pilot class"}</span>
<span style={{"justifySelf":"start","fontSize":"13px","fontWeight":"800","padding":"4px 10px","borderRadius":"999px","background":"#F0873A","color":"#0D1321"} as CSSProperties}>{"Talk to us"}</span>
<p style={{"margin":"0","color":"#C9CEDA"} as CSSProperties}>{"One class, a set term, the full dashboard. A simple way to see if Wada works for your students."}</p>
<Link href={"#demo"} style={{"display":"inline-flex","justifyContent":"center","alignItems":"center","minHeight":"52px","borderRadius":"14px","background":"#F0873A","color":"#0D1321","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 4px 0 #C85512","marginTop":"auto"} as CSSProperties} className="design-action-16">{"Book a demo"}</Link>
</div>
<div style={{"background":"#F7F1E8","border":"2px solid #EADFCF","borderRadius":"28px","padding":"26px","boxShadow":"0 6px 0 #EADFCF","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}>
<span style={{"fontFamily":"'Baloo 2',sans-serif","fontWeight":"800","fontSize":"28px"} as CSSProperties}>{"Institution"}</span>
<span style={{"justifySelf":"start","fontSize":"13px","fontWeight":"800","padding":"4px 10px","borderRadius":"999px","background":"#FDE7D4","color":"#7A3408"} as CSSProperties}>{"Talk to us"}</span>
<p style={{"margin":"0","color":"#5A6070"} as CSSProperties}>{"All your classes and teachers, seats for the year, exports and a named contact at Wada."}</p>
<Link href={"#demo"} style={{"display":"inline-flex","justifyContent":"center","alignItems":"center","minHeight":"52px","borderRadius":"14px","background":"#FFFCF7","border":"2px solid #E0D3C0","color":"#1A2030","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 4px 0 #E0D3C0","marginTop":"auto"} as CSSProperties}>{"Book a demo"}</Link>
</div>
</div>
</div>
</section>

<section id={"demo"} style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
{v.formOpen && <>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,340px),1fr))","gap":"40px 56px","alignItems":"start"} as CSSProperties}>
<div style={{"display":"grid","gap":"16px"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B04A0E"} as CSSProperties}>{"Book a demo"}</div>
<h2 style={{"fontFamily":"'Baloo 2',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(36px,4.6vw,60px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"0"} as CSSProperties}>{"See Wada with your own class in mind."}</h2>
<p style={{"margin":"0","color":"#5A6070","maxWidth":"38ch"} as CSSProperties}>{"Tell us a little about your organization. We'll reply on WhatsApp or by phone, usually within a working day."}</p>
<div style={{"display":"flex","alignItems":"flex-end","gap":"12px","marginTop":"8px"} as CSSProperties}>
<img src={"/assets/fox.webp"} alt={""} style={{"width":"110px","display":"block"} as CSSProperties} loading="lazy" width={240} height={240} />
<div style={{"background":"#FFFCF7","border":"2px solid #EADFCF","borderRadius":"18px 18px 18px 4px","padding":"10px 14px","fontWeight":"800","fontSize":"16px","marginBottom":"36px"} as CSSProperties}>{"It takes two minutes!"}</div>
</div>
</div>
<DemoForm ></DemoForm>
</div>
</>}
</section>
<Footer />
</div>
</>); }
