import Image from "next/image";
import Link from "next/link";
import {InstitutionRegistration} from "@/components/portal/registration";
export const metadata = {title: "Register your institution · Wada", robots: {index: false, follow: false}};
export default function Register() {
 return <main className="registration-page"><section className="registration-wrap"><Link className="wordmark" href="/login"><Image src="/assets/fox-tile.webp" width={40} height={40} alt=""/><span>wada</span></Link><div className="eyebrow">Wada for education</div><h1>Your institution.<br/>A place to grow.</h1><p>Choose your institution type and request an invitation to your admin workspace.</p><InstitutionRegistration/><p className="registration-footer">Already invited? <Link href="/login">Sign in →</Link></p></section></main>;
}
