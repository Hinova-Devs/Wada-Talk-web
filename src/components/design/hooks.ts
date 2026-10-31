"use client";
import React, {useCallback,useEffect,useRef,useState} from "react";
import {MISTAKES,STEPS,TOPICS,SUBS,PATHS,SAFETY,METHOD,ORBIT,SEGS} from "./HomeDesign.data";
import {FAQ} from "./SafetyDesign.data";
import {TABS,SKILLS,MIST,STUDENTS,TYPES} from "./OrganizationsDesign.data";
type Language="en"|"so";
export function useHome(lang: Language) {
 const [s,setState]=useState({lang:lang as string,w:1280,step:0,topic:0,topicIn:true,mistake:0,flipped:false,seen:true,score:72,playing:false,sec:252,navDark:true,hop:0,vh:800});
 const update=useCallback((patch:Partial<typeof s>|((old:typeof s)=>Partial<typeof s>))=>setState(old=>({...old,...(typeof patch==='function'?patch(old):patch)})),[]);
 const rootRef=useRef<HTMLDivElement>(null),heroRef=useRef<HTMLElement>(null),howRef=useRef<HTMLElement>(null),coachRef=useRef<HTMLDivElement>(null);
 const [rm,setRm]=useState(false);
 useEffect(()=>{const mq=window.matchMedia('(prefers-reduced-motion: reduce)');const resize=()=>{update({w:window.innerWidth,vh:window.innerHeight});setRm(mq.matches)};resize();window.addEventListener('resize',resize);mq.addEventListener('change',resize);return()=>{window.removeEventListener('resize',resize);mq.removeEventListener('change',resize);window.speechSynthesis?.cancel()}},[update]);
 useEffect(()=>{const onScroll=()=>{const h=heroRef.current,how=howRef.current; const patch:Partial<typeof s>={};if(h)patch.navDark=h.getBoundingClientRect().bottom>70;if(how&&window.innerWidth>=720){const r=how.getBoundingClientRect(),span=r.height-window.innerHeight;if(span>0)patch.step=Math.floor(Math.min(.999,Math.max(0,-r.top/span))*4)}update(patch)};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[update]);
 useEffect(()=>{if(rm)return; const timer=setInterval(()=>update(old=>({topic:(old.topic+1)%TOPICS.length})),5000);return()=>clearInterval(timer)},[rm,update]);
 const pickStep=(i:number)=>{update({step:i});const how=howRef.current;if(how&&window.innerWidth>=720){const span=how.offsetHeight-window.innerHeight;window.scrollTo({top:how.getBoundingClientRect().top+window.scrollY+span*(i+.5)/4,behavior:rm?'instant':'smooth'})}};
 const play=()=>{if(!window.speechSynthesis){update({playing:false});return;}window.speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(MISTAKES[s.mistake].full);speech.lang='en-US';speech.rate=.9;speech.onend=speech.onerror=()=>update({playing:false});update({playing:true});window.speechSynthesis.speak(speech)};

    const p = {motion:true, bubbles:true, proof:"research"};
    const so = s.lang === 'so', wide = s.w >= 980, motion = p.motion !== false && !rm, stick = s.w >= 720;
    const m = MISTAKES[s.mistake];
    const pickM = (i: number) => update(x => ({ mistake: i, hop: x.hop + 1 }));
    const mm = String(Math.floor(s.sec / 60)).padStart(2, '0') + ':' + String(s.sec % 60).padStart(2, '0');
    const scoreV = s.seen ? s.score : 0;
    return {
      rootRef: rootRef, heroRef: heroRef, howRef: howRef, coachRef: coachRef,
      lang: s.lang, langCode: so ? 'so' : 'en', en: !so, so, setLang: (l: string) => update({ lang: l }),
      navDark: s.navDark, wide, bubbles: p.bubbles !== false,
      tGetApp: so ? 'Soo deji app-ka' : 'Get the app',
      heroBubble: so ? 'Haye! Diyaar ma u tahay?' : 'Hi! Ready for your first talk?',
      heroCols: wide ? 'minmax(0,1fr) minmax(0,1.35fr) minmax(0,1fr)' : (s.w >= 640 ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)'),
      leftOrder: wide ? 0 : 1, orbitOrder: wide ? 1 : 0, orbitSpan: wide ? 'auto' : '1 / -1',
      howPos: stick ? 'sticky' : 'relative', howMin: stick ? 'calc(100vh - 65px)' : '0', howPad: stick ? '24px' : 'clamp(64px,9vw,112px)',
      howCols: s.w >= 720 ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      phoneW: stick ? 'min(100%, 300px, calc((100vh - 130px) * .486))' : 'min(100%, 270px)',
      spinDur: motion ? '60s' : '100000s',
      orbit: ORBIT.map(([icon, label], i) => { const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2; return { icon, label, x: (50 + 50 * Math.cos(a)) + '%', y: (50 + 50 * Math.sin(a)) + '%' }; }),
      callTime: mm, topicNum: s.topic + 1, topicText: TOPICS[s.topic],
      topicOp: s.topicIn ? 1 : 0, topicShift: s.topicIn ? 'translateX(0)' : 'translateX(-16px)',
      howHeight: stick ? '340vh' : 'auto',
      steps: STEPS.map((x, i) => {
        const a = i === s.step;
        return { n: i + 1, title: so ? x.so : x.t, line: so ? x.sl : x.l, cur: a ? 'step' as const : undefined,
          bg: a ? 'var(--accent-soft)' : 'var(--bg)', border: a ? '#26AEE8' : 'var(--line)',
          numBg: a ? '#26AEE8' : 'var(--bg)', numFg: a ? '#0F1B2D' : 'var(--mut)',
          bar: i <= s.step ? '#26AEE8' : 'var(--surf2)', pick: () => pickStep(i) };
      }),
      step0: s.step === 0, step1: s.step === 1, step2: s.step === 2, step3: s.step === 3,
      subsStatic: SUBS.map(([label, v]) => ({ label, v, w: v + '%' })),
      subs: SUBS.map(([label, v]) => ({ label, v, w: (s.seen ? v : 0) + '%' })),
      score: scoreV, ringOffset: String(339.3 * (1 - scoreV / 100)),
      segs: SEGS.map(g => {
        if (g.m == null) return { isText: true, isMistake: false, t: g.t };
        const a = g.m === s.mistake;
        return { isText: false, isMistake: true, t: MISTAKES[g.m].said, active: a,
          bg: a ? '#DC3545' : 'var(--red-bg)', fg: a ? '#FFFFFF' : 'var(--red-text)', line: a ? '#A8261F' : '#DC3545', pick: () => pickM(g.m!), key: (e: React.KeyboardEvent<HTMLElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickM(g.m!); } } };
      }),
      chips: MISTAKES.map((_, i) => { const a = i === s.mistake; return { n: i + 1, active: a, bg: a ? '#26AEE8' : 'var(--bg)', fg: a ? '#0F1B2D' : 'var(--ink)', border: a ? '#0A6C99' : 'var(--edge)', pick: () => pickM(i) }; }),
      m, mNum: s.mistake + 1,
      flip: () => update(x => ({ flipped: !x.flipped })), flipDeg: s.flipped ? '180deg' : '0deg',
      play: play, playLabel: s.playing ? 'Playing…' : 'Hear it',
      coachBubble: m.bubble,
      foxHop: motion ? (s.hop % 2 ? 'whop .7s ease-out' : 'whop2 .7s ease-out') : 'none',
      paths: PATHS.map(([icon, title, line, href]) => ({ icon, title, line, href })),
      safety: SAFETY.map(([icon, en, sot]) => ({ icon, t: so ? sot : en })),
      method: METHOD.map(([t, d]) => ({ t, d })),
      proofResearch: p.proof !== 'pilot', proofPilot: p.proof === 'pilot'
    };
}
export function useSafety(lang:Language){const [open,setOpen]=useState(0);return {lang,en:lang==='en',so:lang==='so',setLang:()=>{},faq:FAQ.map(([q,a],i)=>({q,a,open:open===i,rot:open===i?'45deg':'0deg',toggle:()=>setOpen(old=>old===i?-1:i)}))}}
export function useOrganizations(lang:Language){const [tab,setTab]=useState(0);return {lang,langCode:lang,setLang:()=>{},tabs:TABS.map(([title,line],i)=>({title,line,active:tab===i,bg:tab===i?'var(--accent-soft)':'var(--bg)',border:tab===i?'#26AEE8':'var(--line)',pick:()=>setTab(i)})),tabTitle:TABS[tab][0],t0:tab===0,t1:tab===1,t2:tab===2,t3:tab===3,skills:SKILLS.map(([label,was,now])=>({label,v:now,was:was+'%',now:now+'%'})),mistakes:MIST.map(([cat,ex,pct],i)=>({n:i+1,cat,ex,pct})),students:STUDENTS.map(([name,trend,min,last,inactive])=>({name,trend,min,last,trendColor:trend.startsWith('▲')?'#7ddfd5':trend.startsWith('▼')?'#F4A09A':'#A0ABBA',tagBg:inactive?'#26AEE8':'#243550',tagFg:inactive?'#0F1B2D':'#B5C0CF'})),types:TYPES.map(label=>({label})),formOpen:true,done:false}}

