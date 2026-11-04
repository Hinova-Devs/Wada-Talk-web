import Link from "next/link";
import type {CSSProperties} from "react";
export default function Footer(){return (

<footer style={{"background":"var(--accent)","color":"var(--navy)","fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif"} as CSSProperties}>
<div style={{"maxWidth":"1200px","margin":"0 auto","padding":"64px clamp(16px,4vw,40px) 28px"} as CSSProperties}>
<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,170px),1fr))","gap":"36px 28px"} as CSSProperties}>
<div style={{"display":"grid","gap":"12px","alignContent":"start"} as CSSProperties}>
<div style={{"display":"flex","alignItems":"center","gap":"12px"} as CSSProperties}>

<span style={{"fontFamily":"'Plus Jakarta Sans',system-ui,sans-serif","fontWeight":"800","fontSize":"40px","lineHeight":"1","paddingTop":"6px"} as CSSProperties}>{"wada"}</span>
</div>
<span style={{"fontSize":"15px","fontWeight":"700","lineHeight":"1.45"} as CSSProperties}>{"wada = together"}<br  />{"wada hadal = dialogue"}</span>
</div>
<div style={{"display":"grid","gap":"10px","alignContent":"start","fontSize":"15px","fontWeight":"600"} as CSSProperties}>
<span style={{"fontSize":"13px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase"} as CSSProperties}>{"Students"}</span>
<Link href={"/students"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-17">{"For students"}</Link>
<Link href={"/paths"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-18">{"Paths"}</Link>
<Link href={"/download"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-19">{"Get the app"}</Link>
<Link href={"/join"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-20">{"Join a class"}</Link>
</div>
<div style={{"display":"grid","gap":"10px","alignContent":"start","fontSize":"15px","fontWeight":"600"} as CSSProperties}>
<span style={{"fontSize":"13px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase"} as CSSProperties}>{"Organizations"}</span>
<Link href={"/organizations"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-21">{"For organizations"}</Link>
<Link href={"/plans"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-22">{"Plans"}</Link>
<Link href={"/organizations#demo"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-23">{"Book a demo"}</Link>
<Link href={"/login"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-24">{"Log in"}</Link>
</div>
<div style={{"display":"grid","gap":"10px","alignContent":"start","fontSize":"15px","fontWeight":"600"} as CSSProperties}>
<span style={{"fontSize":"13px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase"} as CSSProperties}>{"Wada"}</span>
<Link href={"/how-it-works"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-25">{"How it works"}</Link>
<Link href={"/method"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-26">{"The method"}</Link>
<Link href={"/safety"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-27">{"Safety and privacy"}</Link>
<Link href={"/about"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-28">{"About"}</Link>
<Link href={"/press"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-29">{"Press kit"}</Link>
</div>
<div style={{"display":"grid","gap":"10px","alignContent":"start","fontSize":"15px","fontWeight":"600"} as CSSProperties}>
<span style={{"fontSize":"13px","fontWeight":"800","letterSpacing":".08em","textTransform":"uppercase"} as CSSProperties}>{"Legal"}</span>
<Link href={"/privacy"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-30">{"Privacy Policy"}</Link>
<Link href={"/terms"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-31">{"Terms"}</Link>
<Link href={"/community-rules"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-32">{"Community rules"}</Link>
<Link href={"/delete-account"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-33">{"Delete account"}</Link>
<Link href={"/credits"} style={{"color":"inherit","textDecoration":"none"} as CSSProperties} className="design-action-34">{"Open content credits"}</Link>
</div>
</div>
<div style={{"display":"flex","flexWrap":"wrap","gap":"12px 24px","alignItems":"center","marginTop":"52px","paddingTop":"22px","borderTop":"2px solid rgba(13,19,33,.18)","fontSize":"14px","fontWeight":"700"} as CSSProperties}>
<span >{"Made in Hargeisa"}</span>
<Link href={"mailto:hello@wadatalk.com"} style={{"color":"inherit"} as CSSProperties}>{"hello@wadatalk.com"}</Link>
<span style={{"marginLeft":"auto","display":"flex","gap":"18px"} as CSSProperties}></span>
</div>
</div>
</footer>
);}
