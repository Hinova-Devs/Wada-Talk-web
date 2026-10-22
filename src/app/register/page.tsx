import Image from "next/image";
import Link from "next/link";
import {InstitutionRegistration} from "@/components/portal/registration";
export const metadata = {title: "Register your university · Wada", robots: {index: false, follow: false}};
export default function Register() {
 return <main className="registration-page"><section className="registration-wrap"><Link className="wordmark" href="/login"><Image src="/assets/fox-tile.webp" width={40} height={40} alt=""/><span>wada</span></Link><div className="eyebrow">Wada for universities</div><h1>Your university.<br/>A place to grow.</h1><p>Request an invitation to manage your university’s English course groups, lecturers and students.</p><InstitutionRegistration/><p className="registration-footer">Already invited? <Link href="/login">Sign in →</Link></p></section></main>;
}
