export const portalSections = [["overview","Overview"],["classes","Classes"],["class-detail","Class detail"],["students","Students"],["student-detail","Student detail"],["skills","Skills and mistakes"],["talk-hours","Live Talk hours"],["discussions","Group discussions"],["reports","Safety reports"],["export","Export"],["team","Team and seats"],["settings","Settings"]] as const;
export type PortalSection=(typeof portalSections)[number][0];
export type PortalRow=Record<string,unknown>;
export function rows(v:unknown):PortalRow[]{if(Array.isArray(v))return v.filter((x):x is PortalRow=>!!x&&typeof x==="object");return v&&typeof v==="object"?[v as PortalRow]:[]}
export function get(r:PortalRow|undefined,...keys:string[]):unknown{for(const k of keys)if(r?.[k]!==undefined&&r?.[k]!==null&&r?.[k]!=="")return r[k];return undefined}
export function text(v:unknown,fallback="Not available"):string{if(typeof v==="string"&&v.trim())return v;if(typeof v==="number")return new Intl.NumberFormat("en").format(v);return fallback}
export function num(r:PortalRow|undefined,...keys:string[]):number{const n=Number(get(r,...keys));return Number.isFinite(n)?n:0}
export function isPortalSection(v:string):v is PortalSection{return portalSections.some(([id])=>id===v)}
