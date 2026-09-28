import {notFound} from 'next/navigation';
import {Frame} from '@/components/pages';
import {JoinForm} from '@/components/forms';
export const metadata={title:'Join your class',robots:{index:false,follow:false}};
export default async function Join({params}:{params:Promise<{code:string}>}){const {code}=await params;if(!/^[a-zA-Z0-9-]{4,24}$/.test(code))notFound();return <Frame><section className="container"><JoinForm initialCode={code.toUpperCase()}/></section></Frame>}
