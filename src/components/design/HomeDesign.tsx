"use client";
/* Ported from the user-owned Claude Design source; no design runtime is required. */
import {Fragment, type CSSProperties} from "react";
import Link from "next/link";
import {Header, Footer} from "../shell";
import {DownloadQR, DemoForm} from "../forms";
import {useHome} from "./hooks";
export default function HomeDesign({lang="en"}: {lang?: "en"|"so"}) { const v=useHome(lang); return (<>

<div ref={v.rootRef} lang={v.langCode} data-screen-label={"Home"} style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontSize":"17px","lineHeight":"1.55","background":"#E6ECF3","color":"#0F1B2D"} as CSSProperties}>
<div style={{"position":"sticky","top":"0","zIndex":"50"} as CSSProperties}>
<Header page="home" lang={v.lang} dark={v.navDark} />
</div>

<section ref={v.heroRef} id={"top"} style={{"position":"relative","background":"#0F1B2D","color":"#E6ECF3","overflow":"hidden"} as CSSProperties}>
<div style={{"position":"absolute","left":"50%","top":"62%","width":"min(900px,120vw)","aspectRatio":"1","transform":"translate(-50%,-50%)","borderRadius":"50%","background":"radial-gradient(closest-side,rgba(38,174,232,.30),rgba(38,174,232,.08) 55%,transparent 72%)","animation":"wpulse 7s ease-in-out infinite","pointerEvents":"none"} as CSSProperties}></div>
<div style={{"position":"relative","maxWidth":"1200px","margin":"0 auto","padding":"clamp(48px,7vw,96px) clamp(16px,4vw,40px) clamp(56px,7vw,96px)","display":"grid","justifyItems":"center","textAlign":"center"} as CSSProperties}>
<h1 style={{"width":"100%","fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(46px,8.2vw,112px)","lineHeight":"1.08","letterSpacing":"-.02em","textWrap":"balance","margin":"0"} as CSSProperties}>
{v.en && <><span style={{"display":"block"} as CSSProperties}>{"Speak English."}</span><span style={{"display":"block","color":"#26AEE8"} as CSSProperties}>{"Together."}</span></>}
{v.so && <><span style={{"display":"block"} as CSSProperties}>{"Ku hadal Ingiriisi."}</span><span style={{"display":"block","color":"#26AEE8"} as CSSProperties}>{"Wada jir."}</span></>}
</h1>
<p style={{"fontSize":"clamp(18px,1.7vw,22px)","lineHeight":"1.5","maxWidth":"34ch","margin":"24px 0 0","color":"#D5DCE6"} as CSSProperties}>
{v.en && <>{"Practice speaking with real students. An AI coach shows you exactly what to fix."}</>}
{v.so && <>{"La tababar hadalka arday dhab ah. Macallin AI ah ayaa kuu sheegaya waxa aad saxayso."}</>}
</p>
<div style={{"display":"flex","flexWrap":"wrap","justifyContent":"center","gap":"14px","marginTop":"32px"} as CSSProperties}>
<Link href={"/download"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 28px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","transition":"transform .1s,box-shadow .1s"} as CSSProperties} className="design-action-1">{v.tGetApp}</Link>
<Link href={"/organizations"} style={{"display":"inline-flex","alignItems":"center","gap":"8px","minHeight":"56px","padding":"0 24px","borderRadius":"16px","border":"2px solid rgba(255,255,255,.28)","color":"#E6ECF3","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 0 0 1px rgba(255,255,255,.12)"} as CSSProperties} className="design-action-2">{"For universities →"}</Link>
</div>

<div style={{"width":"100%","display":"grid","gridTemplateColumns":v.heroCols,"gap":"28px","alignItems":"center","marginTop":"clamp(40px,6vw,72px)"} as CSSProperties}>
<div style={{"order":v.leftOrder,"justifySelf":"center","width":"min(100%,300px)","textAlign":"left","background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"18px","boxShadow":"0 24px 60px rgba(0,0,0,.35)"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"8px","fontSize":"12px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B5C0CF"} as CSSProperties}>
<span style={{"width":"8px","height":"8px","borderRadius":"50%","background":"#2BB3A6","animation":"wblink 1.6s infinite"} as CSSProperties}></span>{"Live Talk"}<span style={{"marginLeft":"auto","fontVariantNumeric":"tabular-nums"} as CSSProperties}>{v.callTime}</span>
</div>
<div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"8px","marginTop":"12px"} as CSSProperties}>
<div style={{"position":"relative","aspectRatio":"1","borderRadius":"16px","overflow":"hidden","background":"#243550"} as CSSProperties}><div className="call-avatar"><span aria-hidden="true">P</span><small>Partner</small></div></div>
<div style={{"position":"relative","aspectRatio":"1","borderRadius":"16px","overflow":"hidden","background":"#243550"} as CSSProperties}><div className="call-avatar"><span aria-hidden="true">Y</span><small>You</small></div></div>
</div>
<div style={{"marginTop":"10px","background":"#E6ECF3","color":"#0F1B2D","borderRadius":"16px","padding":"12px 14px","minHeight":"92px"} as CSSProperties}>
<div style={{"fontSize":"11px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"Topic "}{v.topicNum}{" of 4 · Job interviews"}</div>
<div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"19px","lineHeight":"1.2","marginTop":"4px","transition":"opacity .35s,transform .35s","opacity":v.topicOp,"transform":v.topicShift} as CSSProperties}>{v.topicText}</div>
</div>
</div>
<div style={{"order":v.orbitOrder,"gridColumn":v.orbitSpan,"position":"relative","justifySelf":"center","width":"min(100%,440px)","aspectRatio":"1","containerType":"inline-size"} as CSSProperties}>
<div style={{"position":"absolute","inset":"6%","borderRadius":"50%","border":"2px dashed rgba(255,255,255,.16)"} as CSSProperties}></div>
<div style={{"position":"absolute","inset":"22%","borderRadius":"50%","border":"1px solid rgba(255,255,255,.08)"} as CSSProperties}></div>
<div style={{"position":"absolute","inset":"6%","borderRadius":"50%","animation":"wspin " + v.spinDur + " linear infinite"} as CSSProperties}>
<div style={{"position":"absolute","left":"50%","top":"0%","transform":"translate(-50%,-50%)"} as CSSProperties}><div style={{"animation":"wspinr " + v.spinDur + " linear infinite"} as CSSProperties}><div style={{"display":"flex","alignItems":"center","gap":"8px","whiteSpace":"nowrap","padding":"8px 14px 8px 8px","borderRadius":"999px","background":"#E6ECF3","color":"#0F1B2D","fontWeight":"800","fontSize":"clamp(12px,3.4cqw,15px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><span style={{"width":"30px","height":"30px","borderRadius":"50%","display":"grid","placeItems":"center","background":"#CFEAF6","color":"#0A6C99"} as CSSProperties}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"}></path><rect x={"2"} y={"6"} width={"14"} height={"12"} rx={"2"}></rect></svg></span>{"Live Talk"}</div></div></div>
<div style={{"position":"absolute","left":"100%","top":"50%","transform":"translate(-50%,-50%)"} as CSSProperties}><div style={{"animation":"wspinr " + v.spinDur + " linear infinite"} as CSSProperties}><div style={{"display":"flex","alignItems":"center","gap":"8px","whiteSpace":"nowrap","padding":"8px 14px 8px 8px","borderRadius":"999px","background":"#E6ECF3","color":"#0F1B2D","fontWeight":"800","fontSize":"clamp(12px,3.4cqw,15px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><span style={{"width":"30px","height":"30px","borderRadius":"50%","display":"grid","placeItems":"center","background":"#CFEAF6","color":"#0A6C99"} as CSSProperties}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"}></path></svg></span>{"AI coach"}</div></div></div>
<div style={{"position":"absolute","left":"50%","top":"100%","transform":"translate(-50%,-50%)"} as CSSProperties}><div style={{"animation":"wspinr " + v.spinDur + " linear infinite"} as CSSProperties}><div style={{"display":"flex","alignItems":"center","gap":"8px","whiteSpace":"nowrap","padding":"8px 14px 8px 8px","borderRadius":"999px","background":"#E6ECF3","color":"#0F1B2D","fontWeight":"800","fontSize":"clamp(12px,3.4cqw,15px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><span style={{"width":"30px","height":"30px","borderRadius":"50%","display":"grid","placeItems":"center","background":"#CFEAF6","color":"#0A6C99"} as CSSProperties}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"m5 8 6 6"}></path><path d={"m4 14 6-6 2-3"}></path><path d={"M2 5h12"}></path><path d={"M7 2h1"}></path><path d={"m22 22-5-10-5 10"}></path><path d={"M14 18h6"}></path></svg></span>{"Somali on tap"}</div></div></div>
<div style={{"position":"absolute","left":"0%","top":"50%","transform":"translate(-50%,-50%)"} as CSSProperties}><div style={{"animation":"wspinr " + v.spinDur + " linear infinite"} as CSSProperties}><div style={{"display":"flex","alignItems":"center","gap":"8px","whiteSpace":"nowrap","padding":"8px 14px 8px 8px","borderRadius":"999px","background":"#E6ECF3","color":"#0F1B2D","fontWeight":"800","fontSize":"clamp(12px,3.4cqw,15px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><span style={{"width":"30px","height":"30px","borderRadius":"50%","display":"grid","placeItems":"center","background":"#CFEAF6","color":"#0A6C99"} as CSSProperties}><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}></path><path d={"m9 12 2 2 4-4"}></path></svg></span>{"Safe partners"}</div></div></div>
</div>
<div style={{"position":"absolute","left":"50%","top":"50%","width":"52%","transform":"translate(-50%,-46%)"} as CSSProperties}>
<img src={"/assets/fox.webp"} alt={"Wada the fox, waving"} style={{"width":"100%","display":"block","animation":"wbob 3.6s ease-in-out infinite","filter":"drop-shadow(0 18px 24px rgba(0,0,0,.35))"} as CSSProperties} loading="lazy" width={240} height={240} />
</div>
{v.bubbles && <>
<div style={{"position":"absolute","zIndex":"3","left":"57%","top":"17%","background":"#E6ECF3","color":"#0F1B2D","borderRadius":"18px 18px 18px 4px","padding":"10px 14px","fontWeight":"800","fontSize":"clamp(13px,3.4cqw,16px)","lineHeight":"1.25","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","maxWidth":"38%","textAlign":"left"} as CSSProperties}>{v.heroBubble}</div>
</>}
</div>
<div style={{"order":"2","justifySelf":"center","width":"min(100%,300px)","textAlign":"left","background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"18px","boxShadow":"0 24px 60px rgba(0,0,0,.35)"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"10px"} as CSSProperties}>
<img src={"/assets/fox-tile.webp"} alt={""} width={"36"} height={"36"} style={{"width":"36px","height":"36px","borderRadius":"11px","display":"block","border":"1px solid rgba(255,255,255,.1)"} as CSSProperties} loading="lazy" />
<div style={{"display":"grid","lineHeight":"1.2"} as CSSProperties}><span style={{"fontWeight":"800","fontSize":"15px"} as CSSProperties}>{"Your coach"}</span><span style={{"fontSize":"12px","color":"#A0ABBA"} as CSSProperties}>{"Private. Only you see this."}</span></div>
</div>
<div style={{"display":"grid","gap":"8px","marginTop":"14px"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"10px","background":"#3A1E22","borderRadius":"14px","padding":"10px 12px"} as CSSProperties}><span style={{"width":"22px","height":"22px","borderRadius":"50%","background":"#DC3545","color":"#E6ECF3","display":"grid","placeItems":"center","fontWeight":"800","fontSize":"13px","flex":"none"} as CSSProperties}>{"✕"}</span><span style={{"textDecoration":"line-through","textDecorationColor":"#DC3545","color":"#F4C9C6","fontWeight":"700"} as CSSProperties}>{"Yesterday I go"}</span></div>
<div style={{"display":"flex","alignItems":"center","gap":"10px","background":"#1c3a37","borderRadius":"14px","padding":"10px 12px"} as CSSProperties}><span style={{"width":"22px","height":"22px","borderRadius":"50%","background":"#2BB3A6","color":"#0F1B2D","display":"grid","placeItems":"center","fontWeight":"800","fontSize":"13px","flex":"none"} as CSSProperties}>{"✓"}</span><span style={{"fontWeight":"800","color":"#cbf2ee"} as CSSProperties}>{"Yesterday I went"}</span></div>
</div>
<div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline","marginTop":"14px","paddingTop":"12px","borderTop":"1px solid rgba(255,255,255,.08)"} as CSSProperties}>
<span style={{"fontSize":"13px","color":"#A0ABBA","fontWeight":"700"} as CSSProperties}>{"Call score"}</span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"30px","lineHeight":"1"} as CSSProperties}>{"72"}</span>
</div>
</div>
</div>
<div style={{"display":"flex","flexWrap":"wrap","justifyContent":"center","alignItems":"center","gap":"14px 22px","marginTop":"clamp(40px,5vw,60px)"} as CSSProperties}>
<Link href={"/download"} style={{"display":"inline-flex","flexDirection":"column","justifyContent":"center","minHeight":"52px","padding":"6px 18px","borderRadius":"12px","background":"#000","border":"1px solid rgba(255,255,255,.3)","color":"#fff","textDecoration":"none","lineHeight":"1.1","textAlign":"left"} as CSSProperties}><span style={{"fontSize":"10px","fontWeight":"700","letterSpacing":".06em","textTransform":"uppercase"} as CSSProperties}>{"Get it on"}</span><span style={{"fontSize":"18px","fontWeight":"800"} as CSSProperties}>{"Google Play"}</span></Link>
<Link href={"/download"} style={{"display":"inline-flex","flexDirection":"column","justifyContent":"center","minHeight":"52px","padding":"6px 18px","borderRadius":"12px","background":"#000","border":"1px solid rgba(255,255,255,.3)","color":"#fff","textDecoration":"none","lineHeight":"1.1","textAlign":"left"} as CSSProperties}><span style={{"fontSize":"10px","fontWeight":"700","letterSpacing":".06em","textTransform":"uppercase"} as CSSProperties}>{"Download on the"}</span><span style={{"fontSize":"18px","fontWeight":"800"} as CSSProperties}>{"App Store"}</span></Link>
{v.wide && <>
<div style={{"display":"flex","alignItems":"center","gap":"12px","textAlign":"left"} as CSSProperties}>
<DownloadQR compact={"true"}></DownloadQR>
<span style={{"fontSize":"14px","lineHeight":"1.35","color":"#B5C0CF","maxWidth":"14ch"} as CSSProperties}>{"Scan with your phone camera"}</span>
</div>
</>}
</div>
</div>
</section>

<section id={"students"} style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,128px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,420px),1fr))","gap":"24px 48px","alignItems":"end"} as CSSProperties}>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(38px,5vw,64px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"0"} as CSSProperties}>
{v.en && <><span style={{"display":"block"} as CSSProperties}>{"You studied English for years."}</span><span style={{"display":"block","color":"#0A6C99"} as CSSProperties}>{"You've barely spoken it."}</span></>}
{v.so && <><span style={{"display":"block"} as CSSProperties}>{"Sannado ayaad Ingiriisi baratay."}</span><span style={{"display":"block","color":"#0A6C99"} as CSSProperties}>{"Haddana wax yar baad ku hadashay."}</span></>}
</h2>
<div style={{"display":"flex","alignItems":"flex-end","gap":"12px","justifySelf":"end"} as CSSProperties}>
{v.bubbles && <><div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"18px 18px 4px 18px","padding":"10px 14px","fontWeight":"800","fontSize":"16px","marginBottom":"40px"} as CSSProperties}>{"Sound familiar?"}</div></>}
<img src={"/assets/fox.webp"} alt={""} style={{"width":"120px","display":"block"} as CSSProperties} loading="lazy" width={240} height={240} />
</div>
</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,260px),1fr))","gap":"20px","marginTop":"48px"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"28px 24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"18px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#CFEAF6","color":"#0A6C99","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M18 21a8 8 0 0 0-16 0"}></path><circle cx={"10"} cy={"8"} r={"5"}></circle><path d={"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"}></path></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"27px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{v.en && <>{"Nobody to practice with"}</>}{v.so && <>{"Cid aad la tababarto ma jirto"}</>}</h3>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"28px 24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"18px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#CFEAF6","color":"#0A6C99","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><circle cx={"12"} cy={"12"} r={"10"}></circle><path d={"M16 16s-1.5-2-4-2-4 2-4 2"}></path><line x1={"9"} x2={"9.01"} y1={"9"} y2={"9"}></line><line x1={"15"} x2={"15.01"} y1={"9"} y2={"9"}></line></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"27px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{v.en && <>{"Afraid of making mistakes"}</>}{v.so && <>{"Waxaad ka baqaysaa inaad khaldanto"}</>}</h3>
</div>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"28px 24px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"18px","alignContent":"start"} as CSSProperties}>
<span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#CFEAF6","color":"#0A6C99","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}></path><circle cx={"9"} cy={"7"} r={"4"}></circle><path d={"M22 21v-2a4 4 0 0 0-3-3.87"}></path><path d={"M16 3.13a4 4 0 0 1 0 7.75"}></path></svg></span>
<h3 style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"27px","lineHeight":"1.1","margin":"0"} as CSSProperties}>{v.en && <>{"Classes too big to get a turn"}</>}{v.so && <>{"Fasal aad u weyn, kaalin ma helaysid"}</>}</h3>
</div>
</div>
</section>

<section ref={v.howRef} id={"how"} style={{"position":"relative","height":v.howHeight,"background":"#E6ECF3","borderTop":"2px solid #D3DBE5","borderBottom":"2px solid #D3DBE5"} as CSSProperties}>
<div style={{"position":v.howPos,"top":"65px","minHeight":v.howMin,"display":"flex","alignItems":"center"} as CSSProperties}>
<div style={{"width":"100%","maxWidth":"1200px","margin":"0 auto","padding":v.howPad + " clamp(16px,4vw,40px)","display":"grid","gridTemplateColumns":v.howCols,"gap":"40px 56px","alignItems":"center"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"How it works"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(36px,4.6vw,60px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"10px 0 28px"} as CSSProperties}>{v.en && <>{"One unit, four steps"}</>}{v.so && <>{"Hal cutub, afar tallaabo"}</>}</h2>
<ol style={{"listStyle":"none","margin":"0","padding":"0","display":"grid","gap":"10px"} as CSSProperties}>
{v.steps.map((s, index) => <Fragment key={index}>
<li >
<button type={"button"} onClick={s.pick} aria-current={s.cur} style={{"width":"100%","display":"grid","gridTemplateColumns":"48px 1fr","gap":"14px","alignItems":"center","textAlign":"left","padding":"14px 16px","borderRadius":"20px","cursor":"pointer","font":"inherit","color":"inherit","background":s.bg,"border":"2px solid " + s.border,"boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)" + s.border,"transition":"background .3s,border-color .3s,box-shadow .3s"} as CSSProperties}>
<span style={{"width":"48px","height":"48px","borderRadius":"14px","display":"grid","placeItems":"center","fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"22px","background":s.numBg,"color":s.numFg,"transition":"background .3s"} as CSSProperties}>{s.n}</span>
<span >
<span style={{"display":"block","fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{s.title}</span>
<span style={{"display":"block","fontSize":"16px","lineHeight":"1.4","color":"#5B6778","marginTop":"2px"} as CSSProperties}>{s.line}</span>
</span>
</button>
</li>
</Fragment>)}
</ol>
<Link href={"/download"} style={{"display":"inline-flex","marginTop":"26px","fontWeight":"800","fontSize":"16px","letterSpacing":".05em","textTransform":"uppercase"} as CSSProperties}>{"Try your first unit →"}</Link>
</div>
<div style={{"display":"flex","justifyContent":"center"} as CSSProperties}>
<div style={{"width":v.phoneW,"aspectRatio":"9/18.5","border":"10px solid #0F1B2D","borderRadius":"46px","background":"#E6ECF3","overflow":"hidden","boxShadow":"0 30px 60px rgba(13,19,33,.18)","display":"flex","flexDirection":"column"} as CSSProperties}>
<div style={{"padding":"16px 18px 12px"} as CSSProperties}>
<div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","fontSize":"12px","fontWeight":"800","color":"#5B6778"} as CSSProperties}><span >{"Unit 4 · Job interviews"}</span><span style={{"color":"#0A6C99"} as CSSProperties}>{"3-day streak"}</span></div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(4,1fr)","gap":"5px","marginTop":"10px"} as CSSProperties}>
{v.steps.map((s, index) => <Fragment key={index}><span style={{"height":"6px","borderRadius":"3px","background":s.bar,"transition":"background .3s"} as CSSProperties}></span></Fragment>)}
</div>
</div>
{v.step0 && <>
<div style={{"padding":"4px 16px 16px","display":"grid","gap":"10px"} as CSSProperties}>
<div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"24px"} as CSSProperties}>{"Learn"}</div>
<div style={{"border":"2px solid #D3DBE5","borderRadius":"16px","padding":"10px 12px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><div style={{"fontSize":"14px","fontWeight":"700","lineHeight":"1.35"} as CSSProperties}>{"In my last job, I was responsible for…"}</div><div style={{"display":"flex","gap":"8px","marginTop":"8px"} as CSSProperties}><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#CFEAF6","color":"#086590"} as CSSProperties}>{"▶ Listen"}</span><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#DCE3EC","color":"#3A4152"} as CSSProperties}>{"SO"}</span></div></div>
<div style={{"border":"2px solid #D3DBE5","borderRadius":"16px","padding":"10px 12px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><div style={{"fontSize":"14px","fontWeight":"700","lineHeight":"1.35"} as CSSProperties}>{"I'm good at working with…"}</div><div style={{"display":"flex","gap":"8px","marginTop":"8px"} as CSSProperties}><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#CFEAF6","color":"#086590"} as CSSProperties}>{"▶ Listen"}</span><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#DCE3EC","color":"#3A4152"} as CSSProperties}>{"SO"}</span></div></div>
<div style={{"border":"2px solid #D3DBE5","borderRadius":"16px","padding":"10px 12px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><div style={{"fontSize":"14px","fontWeight":"700","lineHeight":"1.35"} as CSSProperties}>{"I'd like to grow in…"}</div><div style={{"display":"flex","gap":"8px","marginTop":"8px"} as CSSProperties}><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#CFEAF6","color":"#086590"} as CSSProperties}>{"▶ Listen"}</span><span style={{"fontSize":"11px","fontWeight":"800","padding":"4px 8px","borderRadius":"8px","background":"#DCE3EC","color":"#3A4152"} as CSSProperties}>{"SO"}</span></div></div>
</div>
</>}
{v.step1 && <>
<div style={{"padding":"4px 16px 16px","display":"flex","flexDirection":"column","gap":"10px","flex":"1"} as CSSProperties}>
<div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"24px"} as CSSProperties}>{"Practice with AI"}</div>
<div style={{"display":"flex","gap":"8px","alignItems":"flex-end"} as CSSProperties}><img src={"/assets/fox-tile.webp"} alt={""} width={"28"} height={"28"} style={{"width":"28px","height":"28px","borderRadius":"9px"} as CSSProperties} loading="lazy" /><div style={{"background":"#DCE3EC","borderRadius":"14px 14px 14px 4px","padding":"9px 11px","fontSize":"13px","fontWeight":"600","lineHeight":"1.4"} as CSSProperties}>{"Tell me about your last job."}</div></div>
<div style={{"alignSelf":"flex-end","maxWidth":"85%","background":"#26AEE8","color":"#0F1B2D","borderRadius":"14px 14px 4px 14px","padding":"9px 11px","fontSize":"13px","fontWeight":"700","lineHeight":"1.4"} as CSSProperties}>{"I am working in a shop since two years."}</div>
<div style={{"display":"flex","gap":"8px","alignItems":"flex-end"} as CSSProperties}><img src={"/assets/fox-tile.webp"} alt={""} width={"28"} height={"28"} style={{"width":"28px","height":"28px","borderRadius":"9px"} as CSSProperties} loading="lazy" /><div style={{"background":"#DCE3EC","borderRadius":"14px 14px 14px 4px","padding":"9px 11px","fontSize":"13px","fontWeight":"600","lineHeight":"1.4"} as CSSProperties}>{"Close! Try it with "}<b >{"for"}</b>{" instead of "}<b >{"since"}</b>{"."}</div></div>
<div style={{"marginTop":"auto","alignSelf":"center","width":"64px","height":"64px","borderRadius":"50%","display":"grid","placeItems":"center","background":"#26AEE8","color":"#0F1B2D","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"}></path><path d={"M19 10v2a7 7 0 0 1-14 0v-2"}></path><line x1={"12"} x2={"12"} y1={"19"} y2={"22"}></line></svg></div>
</div>
</>}
{v.step2 && <>
<div style={{"flex":"1","display":"flex","flexDirection":"column","background":"#0F1B2D","color":"#E6ECF3","padding":"12px"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"6px","fontSize":"11px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#B5C0CF"} as CSSProperties}><span style={{"width":"7px","height":"7px","borderRadius":"50%","background":"#2BB3A6"} as CSSProperties}></span>{"Live Talk"}<span style={{"marginLeft":"auto","fontVariantNumeric":"tabular-nums"} as CSSProperties}>{v.callTime}</span></div>
<div style={{"flex":"1","display":"grid","gridTemplateRows":"1fr 1fr","gap":"8px","marginTop":"10px"} as CSSProperties}>
<div style={{"position":"relative","borderRadius":"18px","overflow":"hidden","background":"#243550"} as CSSProperties}><div className="call-avatar"><span aria-hidden="true">P</span><small>Partner</small></div></div>
<div style={{"position":"relative","borderRadius":"18px","overflow":"hidden","background":"#243550"} as CSSProperties}><div className="call-avatar"><span aria-hidden="true">Y</span><small>You</small></div></div>
</div>
<div style={{"marginTop":"10px","background":"#E6ECF3","color":"#0F1B2D","borderRadius":"14px","padding":"10px 12px","fontSize":"13px","lineHeight":"1.35","fontWeight":"700"} as CSSProperties}>{"Topic 1 of 4 · Tell your partner about a job you'd like."}</div>
</div>
</>}
{v.step3 && <>
<div style={{"padding":"4px 16px 16px","display":"grid","gap":"10px"} as CSSProperties}>
<div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"24px"} as CSSProperties}>{"Review"}</div>
<div style={{"display":"flex","alignItems":"center","gap":"12px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"56px","lineHeight":"1"} as CSSProperties}>{"72"}</span><span style={{"fontSize":"13px","fontWeight":"700","color":"#5B6778","lineHeight":"1.3"} as CSSProperties}>{"Call score"}<br  />{"out of 100"}</span></div>
{v.subsStatic.map((b, index) => <Fragment key={index}>
<div style={{"display":"grid","gridTemplateColumns":"86px 1fr 22px","gap":"8px","alignItems":"center","fontSize":"12px","fontWeight":"700"} as CSSProperties}><span >{b.label}</span><span style={{"height":"8px","borderRadius":"4px","background":"#DCE3EC","overflow":"hidden"} as CSSProperties}><span style={{"display":"block","height":"100%","width":b.w,"background":"#26AEE8","borderRadius":"4px"} as CSSProperties}></span></span><span style={{"textAlign":"right"} as CSSProperties}>{b.v}</span></div>
</Fragment>)}
<div style={{"display":"flex","justifyContent":"center","alignItems":"center","minHeight":"44px","borderRadius":"14px","background":"#26AEE8","color":"#0F1B2D","fontWeight":"800","fontSize":"13px","letterSpacing":".05em","textTransform":"uppercase","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","marginTop":"4px"} as CSSProperties}>{"See 5 things to fix"}</div>
</div>
</>}
</div>
</div>
</div>
</div>
</section>

<section id={"coach"} style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,128px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"The AI coach"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(36px,4.6vw,60px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"10px 0 0","maxWidth":"20ch"} as CSSProperties}>
{v.en && <>{"Every call ends with a private report."}</>}
{v.so && <>{"Wicitaan kasta wuxuu ku dhammaadaa warbixin gaar ah."}</>}
</h2>
<p style={{"fontSize":"19px","color":"#5B6778","margin":"14px 0 0","maxWidth":"46ch"} as CSSProperties}>{"Your score, up to 5 mistakes, and how to fix them. Tap a mistake to try it."}</p>
<div ref={v.coachRef} style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,420px),1fr))","gap":"24px","marginTop":"44px","alignItems":"start"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"28px","padding":"clamp(20px,3vw,32px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"20px","flexWrap":"wrap"} as CSSProperties}>
<div style={{"position":"relative","width":"128px","height":"128px","flex":"none"} as CSSProperties}>
<svg width={"128"} height={"128"} viewBox={"0 0 128 128"} style={{"display":"block","transform":"rotate(-90deg)"} as CSSProperties}><circle cx={"64"} cy={"64"} r={"54"} fill={"none"} stroke={"#DCE3EC"} strokeWidth={"14"}></circle><circle cx={"64"} cy={"64"} r={"54"} fill={"none"} stroke={"#26AEE8"} strokeWidth={"14"} strokeLinecap={"round"} strokeDasharray={"339.3"} strokeDashoffset={v.ringOffset}></circle></svg>
<div style={{"position":"absolute","inset":"0","display":"grid","placeItems":"center","textAlign":"center"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"44px","lineHeight":"1","fontVariantNumeric":"tabular-nums"} as CSSProperties}>{v.score}</span></div>
</div>
<div style={{"display":"grid","gap":"4px"} as CSSProperties}>
<span style={{"fontSize":"12px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#5B6778"} as CSSProperties}>{"Sample report · Job interviews"}</span>
<span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"26px","lineHeight":"1.1"} as CSSProperties}>{"Good call. 5 things to fix."}</span>
</div>
</div>
<div style={{"display":"grid","gap":"10px","marginTop":"24px"} as CSSProperties}>
{v.subs.map((b, index) => <Fragment key={index}>
<div style={{"display":"grid","gridTemplateColumns":"120px 1fr 30px","gap":"12px","alignItems":"center","fontSize":"15px","fontWeight":"700"} as CSSProperties}><span >{b.label}</span><span style={{"height":"12px","borderRadius":"6px","background":"#DCE3EC","overflow":"hidden"} as CSSProperties}><span style={{"display":"block","height":"100%","width":b.w,"background":"#26AEE8","borderRadius":"6px","transition":"width 1.2s cubic-bezier(.2,.7,.2,1)"} as CSSProperties}></span></span><span style={{"textAlign":"right","fontVariantNumeric":"tabular-nums"} as CSSProperties}>{b.v}</span></div>
</Fragment>)}
</div>
<div style={{"marginTop":"28px","fontSize":"12px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#5B6778"} as CSSProperties}>{"What you said"}</div>
<p style={{"fontSize":"19px","lineHeight":"1.9","margin":"6px 0 0"} as CSSProperties}>
{v.segs.map((g, index) => <Fragment key={index}>{g.isText && <><span >{g.t}</span></>}{g.isMistake && <><mark role={"button"} tabIndex={0} onClick={g.pick} onKeyDown={g.key} aria-pressed={g.active} style={{"fontWeight":"700","padding":"2px 6px","borderRadius":"8px","cursor":"pointer","color":g.fg,"background":g.bg,"boxShadow":"inset 0 -2px 0 " + g.line,"WebkitBoxDecorationBreak":"clone","boxDecorationBreak":"clone","transition":"background .2s,color .2s"} as CSSProperties}>{g.t}</mark></>}</Fragment>)}
</p>
</div>
<div style={{"display":"grid","gap":"16px"} as CSSProperties}>
<div style={{"display":"flex","gap":"8px","flexWrap":"wrap","alignItems":"center"} as CSSProperties}>
{v.chips.map((c, index) => <Fragment key={index}>
<button type={"button"} onClick={c.pick} aria-label={"Mistake " + c.n} aria-pressed={c.active} style={{"width":"48px","height":"48px","borderRadius":"14px","font":"800 18px 'Plus Jakarta Sans',sans-serif","cursor":"pointer","border":"2px solid " + c.border,"background":c.bg,"color":c.fg,"boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)" + c.border} as CSSProperties}>{c.n}</button>
</Fragment>)}
<span style={{"marginLeft":"auto","fontSize":"14px","fontWeight":"700","color":"#5B6778"} as CSSProperties}>{"Mistake "}{v.mNum}{" of 5"}</span>
</div>
<div style={{"perspective":"1400px"} as CSSProperties}>
<div style={{"display":"grid","transformStyle":"preserve-3d","transition":"transform .7s cubic-bezier(.3,.7,.2,1)","transform":"rotateY(" + v.flipDeg + ")"} as CSSProperties}>
<div style={{"gridArea":"1/1","backfaceVisibility":"hidden","WebkitBackfaceVisibility":"hidden","background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"28px","padding":"clamp(20px,3vw,32px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"16px","alignContent":"start"} as CSSProperties}>
<span style={{"justifySelf":"start","fontSize":"13px","fontWeight":"800","letterSpacing":".06em","textTransform":"uppercase","padding":"5px 12px","borderRadius":"999px","background":"#CFEAF6","color":"#086590"} as CSSProperties}>{v.m.cat}</span>
<div style={{"display":"flex","alignItems":"flex-start","gap":"12px","background":"#FDE3E1","borderRadius":"16px","padding":"12px 14px"} as CSSProperties}><span style={{"width":"26px","height":"26px","borderRadius":"50%","background":"#DC3545","color":"#fff","display":"grid","placeItems":"center","fontWeight":"800","fontSize":"14px","flex":"none","marginTop":"2px"} as CSSProperties}>{"✕"}</span><span style={{"fontSize":"19px","fontWeight":"700","lineHeight":"1.35","color":"#8E1F19","textDecoration":"line-through","textDecorationColor":"#DC3545"} as CSSProperties}>{v.m.said}</span></div>
<div style={{"display":"flex","alignItems":"flex-start","gap":"12px","background":"#d4f4f1","borderRadius":"16px","padding":"12px 14px"} as CSSProperties}><span style={{"width":"26px","height":"26px","borderRadius":"50%","background":"#2BB3A6","color":"#0F1B2D","display":"grid","placeItems":"center","fontWeight":"800","fontSize":"14px","flex":"none","marginTop":"4px"} as CSSProperties}>{"✓"}</span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontSize":"clamp(24px,2.4vw,30px)","fontWeight":"800","lineHeight":"1.15","color":"#114640"} as CSSProperties}>{v.m.better}</span></div>
<p lang={"en"} style={{"fontSize":"17px","lineHeight":"1.55","margin":"0"} as CSSProperties}>{v.m.en}</p>
<div style={{"display":"flex","gap":"10px","flexWrap":"wrap"} as CSSProperties}>
<button type={"button"} onClick={v.play} style={{"display":"inline-flex","alignItems":"center","gap":"8px","minHeight":"50px","padding":"0 20px","borderRadius":"14px","border":"0","cursor":"pointer","background":"#26AEE8","color":"#0F1B2D","font":"800 15px 'Plus Jakarta Sans',sans-serif","letterSpacing":".05em","textTransform":"uppercase","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}><svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}><polygon points={"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}></polygon><path d={"M15.54 8.46a5 5 0 0 1 0 7.07"}></path></svg>{v.playLabel}</button>
<button type={"button"} onClick={v.flip} style={{"display":"inline-flex","alignItems":"center","minHeight":"50px","padding":"0 18px","borderRadius":"14px","cursor":"pointer","background":"#E6ECF3","color":"#0F1B2D","border":"2px solid #C3CCD8","font":"800 15px 'Plus Jakarta Sans',sans-serif","letterSpacing":".05em","textTransform":"uppercase","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>{"Af Soomaali ↻"}</button>
</div>
</div>
<div style={{"gridArea":"1/1","backfaceVisibility":"hidden","WebkitBackfaceVisibility":"hidden","transform":"rotateY(180deg)","background":"#0F1B2D","color":"#E6ECF3","borderRadius":"28px","padding":"clamp(20px,3vw,32px)","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"16px","alignContent":"start"} as CSSProperties}>
<span style={{"justifySelf":"start","fontSize":"13px","fontWeight":"800","letterSpacing":".06em","textTransform":"uppercase","padding":"5px 12px","borderRadius":"999px","background":"#243550","color":"#CFEAF6"} as CSSProperties}>{"Sharaxaad"}</span>
<div style={{"fontSize":"19px","fontWeight":"700","color":"#F4C9C6","textDecoration":"line-through","textDecorationColor":"#DC3545"} as CSSProperties}>{v.m.said}</div>
<div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontSize":"clamp(24px,2.4vw,30px)","fontWeight":"800","lineHeight":"1.15","color":"#cbf2ee"} as CSSProperties}>{v.m.better}</div>
<p lang={"so"} style={{"fontSize":"17px","lineHeight":"1.55","margin":"0","color":"#E6E8EE"} as CSSProperties}>{v.m.so}</p>
<div style={{"display":"flex","gap":"10px","flexWrap":"wrap"} as CSSProperties}>
<button type={"button"} onClick={v.play} style={{"display":"inline-flex","alignItems":"center","gap":"8px","minHeight":"50px","padding":"0 20px","borderRadius":"14px","border":"0","cursor":"pointer","background":"#26AEE8","color":"#0F1B2D","font":"800 15px 'Plus Jakarta Sans',sans-serif","letterSpacing":".05em","textTransform":"uppercase","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties}>{"▶ "}{v.playLabel}</button>
<button type={"button"} onClick={v.flip} style={{"display":"inline-flex","alignItems":"center","minHeight":"50px","padding":"0 18px","borderRadius":"14px","cursor":"pointer","background":"transparent","color":"#E6ECF3","border":"2px solid rgba(255,255,255,.25)","font":"800 15px 'Plus Jakarta Sans',sans-serif","letterSpacing":".05em","textTransform":"uppercase"} as CSSProperties}>{"English ↻"}</button>
</div>
</div>
</div>
</div>
<div style={{"display":"flex","alignItems":"flex-end","gap":"12px"} as CSSProperties}>
<img src={"/assets/fox.webp"} alt={""} style={{"width":"96px","display":"block","animation":v.foxHop} as CSSProperties} loading="lazy" width={240} height={240} />
{v.bubbles && <><div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"18px 18px 18px 4px","padding":"10px 14px","fontWeight":"800","fontSize":"16px","marginBottom":"34px"} as CSSProperties}>{v.coachBubble}</div></>}
</div>
</div>
</div>
<Link href={"/download"} style={{"display":"inline-flex","marginTop":"32px","fontWeight":"800","fontSize":"16px","letterSpacing":".05em","textTransform":"uppercase"} as CSSProperties}>{"Get your first report →"}</Link>
</section>

<section id={"paths"} style={{"background":"#E6ECF3","borderTop":"2px solid #D3DBE5","borderBottom":"2px solid #D3DBE5"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)"} as CSSProperties}>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"Paths"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.2vw,54px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0","maxWidth":"22ch"} as CSSProperties}>{v.en && <>{"Get ready for what's next."}</>}{v.so && <>{"U diyaar garow waxa xiga."}</>}</h2>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,300px),1fr))","gap":"18px","marginTop":"40px"} as CSSProperties}>
<Link href={"/paths/job-interviews"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-3"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}></path><rect width={"20"} height={"14"} x={"2"} y={"6"} rx={"2"}></rect></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Job interviews"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Answer common questions with confidence"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
<Link href={"/paths/ielts-scholarships"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-4"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"}></path><path d={"M22 10v6"}></path><path d={"M6 12.5V16a6 3 0 0 0 12 0v-3.5"}></path></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"IELTS and scholarships"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Practice the speaking test, part by part"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
<Link href={"/paths/university"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-5"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"m3 9 9-6 9 6"}></path><path d={"M5 10v8"}></path><path d={"M9.5 10v8"}></path><path d={"M14.5 10v8"}></path><path d={"M19 10v8"}></path><path d={"M3 21h18"}></path></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"University"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Seminars, presentations and office hours"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
<Link href={"/paths/business"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-6"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M3 3v16a2 2 0 0 0 2 2h16"}></path><path d={"m19 9-5 5-4-4-3 3"}></path></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Business"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Meetings, calls and pitching an idea"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
<Link href={"/paths/tech-ai"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-7"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><rect width={"20"} height={"14"} x={"2"} y={"3"} rx={"2"}></rect><line x1={"8"} x2={"16"} y1={"21"} y2={"21"}></line><line x1={"12"} x2={"12"} y1={"17"} y2={"21"}></line></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Tech and AI"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Stand-ups, demos and explaining your work"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
<Link href={"/paths/everyday-conversation"} style={{"display":"grid","gridTemplateColumns":"60px 1fr auto","gap":"16px","alignItems":"center","padding":"20px","borderRadius":"24px","background":"#E6ECF3","border":"2px solid #D3DBE5","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","color":"#0F1B2D","textDecoration":"none","transition":"transform .15s,box-shadow .15s"} as CSSProperties} className="design-action-8"><span style={{"width":"60px","height":"60px","borderRadius":"18px","background":"#0F1B2D","color":"#26AEE8","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M7.9 20A9 9 0 1 0 4 16.1L2 22Z"}></path></svg></span><span style={{"display":"grid","gap":"2px"} as CSSProperties}><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"23px","lineHeight":"1.1"} as CSSProperties}>{"Everyday conversation"}</span><span style={{"fontSize":"15px","color":"#5B6778","lineHeight":"1.35"} as CSSProperties}>{"Small talk, directions and making plans"}</span></span><span style={{"fontSize":"22px","color":"#0A6C99","fontWeight":"800"} as CSSProperties}>{"→"}</span></Link>
</div>
</div>
</section>

<section id={"safety"} style={{"background":"#0F1B2D","color":"#E6ECF3"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,380px),1fr))","gap":"40px 64px","alignItems":"center"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#26AEE8"} as CSSProperties}>{"Safety"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(38px,5vw,64px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{v.en && <>{"Safe by design"}</>}{v.so && <>{"Ammaan laga soo bilaabo naqshadda"}</>}</h2>
<p style={{"fontSize":"19px","color":"#B5C0CF","margin":"16px 0 0","maxWidth":"36ch"} as CSSProperties}>{"For students, and for the families who want to know who they're talking to."}</p>
<Link href={"/safety"} style={{"display":"inline-flex","alignItems":"center","minHeight":"52px","padding":"0 22px","marginTop":"28px","borderRadius":"14px","border":"2px solid rgba(255,255,255,.28)","color":"#E6ECF3","fontWeight":"800","fontSize":"15px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 0 0 1px rgba(255,255,255,.12)"} as CSSProperties} className="design-action-9">{"Safety and privacy in full →"}</Link>
</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,220px),1fr))","gap":"14px"} as CSSProperties}>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"22px","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}><span style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}></path><circle cx={"9"} cy={"7"} r={"4"}></circle><path d={"M22 21v-2a4 4 0 0 0-3-3.87"}></path><path d={"M16 3.13a4 4 0 0 1 0 7.75"}></path></svg></span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{v.en && <>{"Same-gender partners if you want"}</>}{v.so && <>{"Lammaane isku jinsi ah haddii aad rabto"}</>}</span></div>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"22px","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}><span style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"}></path></svg></span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{v.en && <>{"Audio-only allowed"}</>}{v.so && <>{"Cod keliya waa la oggol yahay"}</>}</span></div>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"22px","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}><span style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"}></path><line x1={"4"} x2={"4"} y1={"22"} y2={"15"}></line></svg></span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{v.en && <>{"Report and block anytime"}</>}{v.so && <>{"Soo sheeg oo xannib mar kasta"}</>}</span></div>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"24px","padding":"22px","display":"grid","gap":"14px","alignContent":"start"} as CSSProperties}><span style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","display":"grid","placeItems":"center"} as CSSProperties}><svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}></path><path d={"m9 12 2 2 4-4"}></path></svg></span><span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{v.en && <>{"Calls checked for safety"}</>}{v.so && <>{"Wicitaannada waa la hubiyaa"}</>}</span></div>
</div>
</div>
</section>

<section id={"orgs"} style={{"background":"#0F1B2D","color":"#E6ECF3","position":"relative","overflow":"hidden"} as CSSProperties}>
<div style={{"position":"absolute","right":"-10%","top":"-20%","width":"60%","aspectRatio":"1","borderRadius":"50%","background":"radial-gradient(closest-side,rgba(38,174,232,.16),transparent 70%)","pointerEvents":"none"} as CSSProperties}></div>
<div style={{"position":"relative","maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,120px) clamp(16px,4vw,40px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,420px),1fr))","gap":"48px 64px","alignItems":"center"} as CSSProperties}>
<div >
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#26AEE8"} as CSSProperties}>{"For universities and NGOs"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.4vw,56px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"Give a whole class speaking practice. "}<span style={{"color":"#26AEE8"} as CSSProperties}>{"See who's improving."}</span></h2>
<div style={{"display":"grid","gap":"10px","marginTop":"28px"} as CSSProperties}>
<div style={{"display":"flex","gap":"14px","alignItems":"center","fontSize":"17px","fontWeight":"600","color":"#E6E8EE"} as CSSProperties}><span style={{"width":"36px","height":"36px","borderRadius":"12px","background":"#243550","color":"#26AEE8","display":"grid","placeItems":"center","fontWeight":"800","flex":"none"} as CSSProperties}>{"1"}</span>{"Classes with join codes and a printable QR poster"}</div>
<div style={{"display":"flex","gap":"14px","alignItems":"center","fontSize":"17px","fontWeight":"600","color":"#E6E8EE"} as CSSProperties}><span style={{"width":"36px","height":"36px","borderRadius":"12px","background":"#243550","color":"#26AEE8","display":"grid","placeItems":"center","fontWeight":"800","flex":"none"} as CSSProperties}>{"2"}</span>{"Top class mistakes, so you know what to teach next"}</div>
<div style={{"display":"flex","gap":"14px","alignItems":"center","fontSize":"17px","fontWeight":"600","color":"#E6E8EE"} as CSSProperties}><span style={{"width":"36px","height":"36px","borderRadius":"12px","background":"#243550","color":"#26AEE8","display":"grid","placeItems":"center","fontWeight":"800","flex":"none"} as CSSProperties}>{"3"}</span>{"Exports for donors and management"}</div>
</div>
<p style={{"fontSize":"15px","color":"#A0ABBA","margin":"18px 0 0"} as CSSProperties}>{"You see scores and progress, never recordings or transcripts."}</p>
<div style={{"display":"flex","flexWrap":"wrap","gap":"12px","marginTop":"28px"} as CSSProperties}>
<Link href={"/organizations#demo"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 28px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties} className="design-action-10">{"Book a demo"}</Link>
<Link href={"/login"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 24px","borderRadius":"16px","border":"2px solid rgba(255,255,255,.28)","color":"#E6ECF3","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none"} as CSSProperties} className="design-action-11">{"Log in"}</Link>
</div>
</div>
<div style={{"background":"#1C2A40","border":"1px solid rgba(255,255,255,.08)","borderRadius":"28px","overflow":"hidden","boxShadow":"0 30px 70px rgba(0,0,0,.4)","minWidth":"0"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"14px 18px","borderBottom":"1px solid rgba(255,255,255,.08)","fontSize":"13px"} as CSSProperties}>
<img src={"/assets/fox-tile.webp"} alt={""} width={"24"} height={"24"} style={{"width":"24px","height":"24px","borderRadius":"8px"} as CSSProperties} loading="lazy" /><span style={{"fontWeight":"800"} as CSSProperties}>{"org.wada-talk.com"}</span><span style={{"color":"#A0ABBA"} as CSSProperties}>{"· Overview"}</span><span style={{"marginLeft":"auto","fontSize":"11px","fontWeight":"800","padding":"3px 9px","borderRadius":"999px","background":"#243550","color":"#B5C0CF"} as CSSProperties}>{"Sample data"}</span>
</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(120px,1fr))","gap":"10px","padding":"16px"} as CSSProperties}>
<div style={{"background":"#0F1B2D","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#A0ABBA"} as CSSProperties}>{"Active this week"}</div><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"38"}</div></div>
<div style={{"background":"#0F1B2D","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#A0ABBA"} as CSSProperties}>{"Minutes spoken"}</div><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"1,240"}</div></div>
<div style={{"background":"#0F1B2D","borderRadius":"16px","padding":"14px"} as CSSProperties}><div style={{"fontSize":"12px","fontWeight":"700","color":"#A0ABBA"} as CSSProperties}>{"Live Talks"}</div><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"32px","lineHeight":"1.1"} as CSSProperties}>{"96"}</div></div>
</div>
<div style={{"padding":"0 16px 16px","display":"grid","gap":"10px"} as CSSProperties}>
<div style={{"fontSize":"12px","fontWeight":"800","letterSpacing":".06em","textTransform":"uppercase","color":"#B5C0CF"} as CSSProperties}>{"What to teach next"}</div>
<div style={{"display":"grid","gridTemplateColumns":"110px 1fr","gap":"10px","alignItems":"center","fontSize":"14px","fontWeight":"700"} as CSSProperties}><span >{"Past tense"}</span><span style={{"height":"10px","borderRadius":"5px","background":"#243550","overflow":"hidden"} as CSSProperties}><span style={{"display":"block","height":"100%","width":"82%","background":"#26AEE8","borderRadius":"5px"} as CSSProperties}></span></span></div>
<div style={{"display":"grid","gridTemplateColumns":"110px 1fr","gap":"10px","alignItems":"center","fontSize":"14px","fontWeight":"700"} as CSSProperties}><span >{"Articles"}</span><span style={{"height":"10px","borderRadius":"5px","background":"#243550","overflow":"hidden"} as CSSProperties}><span style={{"display":"block","height":"100%","width":"64%","background":"#26AEE8","borderRadius":"5px"} as CSSProperties}></span></span></div>
<div style={{"display":"grid","gridTemplateColumns":"110px 1fr","gap":"10px","alignItems":"center","fontSize":"14px","fontWeight":"700"} as CSSProperties}><span >{"Prepositions"}</span><span style={{"height":"10px","borderRadius":"5px","background":"#243550","overflow":"hidden"} as CSSProperties}><span style={{"display":"block","height":"100%","width":"51%","background":"#26AEE8","borderRadius":"5px"} as CSSProperties}></span></span></div>
<div style={{"display":"flex","alignItems":"center","gap":"10px","marginTop":"6px","background":"#162f3a","borderRadius":"14px","padding":"10px 12px","fontSize":"14px","fontWeight":"700","color":"#CFEAF6"} as CSSProperties}><span style={{"width":"8px","height":"8px","borderRadius":"50%","background":"#26AEE8","flex":"none"} as CSSProperties}></span>{"4 students inactive for 7+ days"}</div>
</div>
</div>
</div>
</section>

<section id={"method"} style={{"maxWidth":"1200px","margin":"0 auto","padding":"clamp(72px,9vw,128px) clamp(16px,4vw,40px)"} as CSSProperties}>
{v.proofResearch && <>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"The method"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.2vw,54px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0","maxWidth":"22ch"} as CSSProperties}>{"Built on research into how people learn to speak"}</h2>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,320px),1fr))","gap":"16px","marginTop":"40px"} as CSSProperties}>
{v.method.map((r, index) => <Fragment key={index}>
<div style={{"background":"#E6ECF3","border":"2px solid #D3DBE5","borderRadius":"24px","padding":"22px","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)","display":"grid","gap":"8px","alignContent":"start"} as CSSProperties}>
<span style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","lineHeight":"1.15"} as CSSProperties}>{r.t}</span>
<span style={{"fontSize":"16px","lineHeight":"1.5","color":"#5B6778"} as CSSProperties}>{r.d}</span>
<Link href={"/method"} style={{"fontSize":"14px","fontWeight":"700"} as CSSProperties}>{"Source: Lesson Guide"}</Link>
</div>
</Fragment>)}
</div>
</>}
{v.proofPilot && <>
<div style={{"fontSize":"14px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase","color":"#0A6C99"} as CSSProperties}>{"From the pilot"}</div>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(34px,4.2vw,54px)","lineHeight":"1.1","letterSpacing":"-.02em","margin":"10px 0 0"} as CSSProperties}>{"Layout for approved pilot results"}</h2>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,220px),1fr))","gap":"16px","marginTop":"36px"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"64px","lineHeight":"1"} as CSSProperties}>{"—"}</div><div style={{"fontWeight":"700","color":"#5B6778"} as CSSProperties}>{"Pilot number 1"}</div></div>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"64px","lineHeight":"1"} as CSSProperties}>{"—"}</div><div style={{"fontWeight":"700","color":"#5B6778"} as CSSProperties}>{"Pilot number 2"}</div></div>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}><div style={{"fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"800","fontSize":"64px","lineHeight":"1"} as CSSProperties}>{"—"}</div><div style={{"fontWeight":"700","color":"#5B6778"} as CSSProperties}>{"Pilot number 3"}</div></div>
</div>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,300px),1fr))","gap":"16px","marginTop":"16px"} as CSSProperties}>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","color":"#5B6778","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}>{"Student quote, with consent"}</div>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","color":"#5B6778","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}>{"Student quote, with consent"}</div>
<div style={{"background":"#E6ECF3","border":"2px dashed #C3CCD8","borderRadius":"24px","padding":"22px","fontFamily":"'Plus Jakarta Sans',sans-serif","fontWeight":"700","fontSize":"22px","color":"#5B6778","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}>{"Teacher quote, with consent"}</div>
</div>
</>}
</section>

<section id={"get"} style={{"maxWidth":"1200px","margin":"0 auto","padding":"0 clamp(16px,4vw,40px) clamp(72px,9vw,120px)"} as CSSProperties}>
<div style={{"background":"#0F1B2D","color":"#E6ECF3","borderRadius":"36px","padding":"clamp(32px,5vw,64px)","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,340px),1fr))","gap":"32px","alignItems":"center","position":"relative","overflow":"hidden"} as CSSProperties}>
<div style={{"position":"absolute","right":"0","bottom":"-30%","width":"60%","aspectRatio":"1","borderRadius":"50%","background":"radial-gradient(closest-side,rgba(38,174,232,.28),transparent 70%)","pointerEvents":"none"} as CSSProperties}></div>
<div style={{"position":"relative"} as CSSProperties}>
<h2 style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"clamp(40px,5.6vw,76px)","lineHeight":"1.08","letterSpacing":"-.02em","margin":"0"} as CSSProperties}>{v.en && <>{"Your first conversation is waiting."}</>}{v.so && <>{"Wada hadalkaagii ugu horreeyay wuu ku sugayaa."}</>}</h2>
<div style={{"display":"flex","flexWrap":"wrap","gap":"12px","marginTop":"30px"} as CSSProperties}>
<Link href={"/download"} style={{"display":"inline-flex","alignItems":"center","minHeight":"56px","padding":"0 28px","borderRadius":"16px","background":"#26AEE8","color":"#0F1B2D","fontWeight":"800","fontSize":"17px","letterSpacing":".05em","textTransform":"uppercase","textDecoration":"none","boxShadow":"0 14px 30px -10px rgba(38,174,232,.6)"} as CSSProperties} className="design-action-12">{v.tGetApp}</Link>
<Link href={"/download"} style={{"display":"inline-flex","flexDirection":"column","justifyContent":"center","minHeight":"56px","padding":"6px 18px","borderRadius":"12px","background":"#000","border":"1px solid rgba(255,255,255,.3)","color":"#fff","textDecoration":"none","lineHeight":"1.1"} as CSSProperties}><span style={{"fontSize":"10px","fontWeight":"700","letterSpacing":".06em","textTransform":"uppercase"} as CSSProperties}>{"Get it on"}</span><span style={{"fontSize":"18px","fontWeight":"800"} as CSSProperties}>{"Google Play"}</span></Link>
<Link href={"/download"} style={{"display":"inline-flex","flexDirection":"column","justifyContent":"center","minHeight":"56px","padding":"6px 18px","borderRadius":"12px","background":"#000","border":"1px solid rgba(255,255,255,.3)","color":"#fff","textDecoration":"none","lineHeight":"1.1"} as CSSProperties}><span style={{"fontSize":"10px","fontWeight":"700","letterSpacing":".06em","textTransform":"uppercase"} as CSSProperties}>{"Download on the"}</span><span style={{"fontSize":"18px","fontWeight":"800"} as CSSProperties}>{"App Store"}</span></Link>
</div>
<p style={{"margin":"22px 0 0","fontSize":"17px","color":"#B5C0CF"} as CSSProperties}>{"Have a class code? "}<Link href={"/join"} style={{"color":"#26AEE8","fontWeight":"800"} as CSSProperties}>{"Join your class →"}</Link></p>
</div>
<div style={{"position":"relative","display":"flex","alignItems":"flex-end","justifyContent":"center","gap":"24px"} as CSSProperties}>
<img src={"/assets/fox.webp"} alt={"Wada the fox"} style={{"width":"min(240px,55%)","display":"block","animation":"wbob 3.6s ease-in-out infinite","filter":"drop-shadow(0 18px 24px rgba(0,0,0,.35))"} as CSSProperties} loading="lazy" width={240} height={240} />
{v.wide && <>
<div style={{"display":"grid","gap":"8px","justifyItems":"center","marginBottom":"12px"} as CSSProperties}>
<div style={{"width":"112px","height":"112px","borderRadius":"18px","background":"#E6ECF3","display":"grid","placeItems":"center","color":"#5B6778","fontSize":"12px","fontWeight":"800","backgroundImage":"repeating-linear-gradient(45deg,transparent 0 7px,#D3DBE5 7px 8px)","boxShadow":"8px 8px 18px #C3CCD8,-8px -8px 18px #FFFFFF"} as CSSProperties}>{"QR"}</div>
<span style={{"fontSize":"13px","color":"#B5C0CF","fontWeight":"700"} as CSSProperties}>{"wada-talk.com/download"}</span>
</div>
</>}
</div>
</div>
</section>
<Footer />
</div>
</>); }
