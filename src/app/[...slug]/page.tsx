import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {PageContent} from '@/components/pages';
import {publicPages,paths,documents} from '@/lib/content';
export const dynamicParams=false;
export function generateStaticParams(){return [{slug:['so']},...publicPages.flatMap(p=>[{slug:p.split('/')},{slug:['so',...p.split('/')]}])];}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{const {slug}=await params;const lang=slug[0]==='so'?'so':'en';const key=(lang==='so'?slug.slice(1):slug).join('/');const item=paths.find(p=>'paths/'+p.slug===key);const title=item?.title||documents[key]?.title||key.split('/').at(-1)?.replaceAll('-',' ')||'Ku hadal Ingiriisi. Wada jir.';const description=item?.intro||documents[key]?.intro||'Learn, practice with AI, speak with a partner, and review. Wada brings English conversations closer.';const url=lang==='so'?'/so/'+key:'/'+key;return {title,description,openGraph:{title,description,url,type:'website',images:['/opengraph-image']},alternates:{canonical:url,languages:{en:'/'+key,so:'/so/'+key}},robots:['privacy','terms','credits','cookies'].includes(key)?{index:false,follow:true}:undefined}}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const lang=slug[0]==='so'?'so':'en';const key=(lang==='so'?slug.slice(1):slug).join('/');if(key&&!publicPages.includes(key))notFound();return <PageContent slug={key} lang={lang}/>}
