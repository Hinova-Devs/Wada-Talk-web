import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const code = ts.transpileModule(readFileSync('src/components/portal/warmup.tsx', 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
function fixture({saveData = false, hidden = false} = {}) {
 const prefetched = [], timers = new Map(), cleanup = [];
 let now = 20000, id = 0;
 const compiledModule = {exports: {}};
 const schedule = callback => {timers.set(++id, callback); return id;};
 const cancel = timer => timers.delete(timer);
 const imports = {
  react: {useEffect: effect => cleanup.push(effect())},
  'next/navigation': {useRouter: () => ({prefetch: href => prefetched.push(href)})},
 };
 new Function('require', 'module', 'exports', 'navigator', 'document', 'window', 'setTimeout', 'clearTimeout', 'Date', code)(
  name => imports[name], compiledModule, compiledModule.exports,
  {connection: {saveData}}, {visibilityState: hidden ? 'hidden' : 'visible'},
  {location: {pathname: '/register'}, requestIdleCallback: schedule, cancelIdleCallback: cancel}, schedule, cancel, {now: () => now},
 );
 return {...compiledModule.exports, prefetched, timers, advance: () => {now += 30001;}, run: () => {for (const [key, callback] of [...timers]) {timers.delete(key); callback();}}, clear: () => cleanup.forEach(callback => callback?.())};
}
const saved = process.env.NODE_ENV;
process.env.NODE_ENV = 'production';
try {
 const links = '/portal?section=classes&org_id=org-a\n/portal?section=students&org_id=org-a\n/portal?section=audit&org_id=org-a';
 const view = fixture();
 view.PortalSectionWarmup({links});
 assert.equal(view.prefetched.length, 0, 'Do not block initial render with eager requests');
 view.run();
 assert.deepEqual(view.prefetched, links.split('\n').slice(0, 2), 'Only two read-only, organization-scoped destinations are warmed');
 view.PortalSectionWarmup({links}); view.run();
 assert.equal(view.prefetched.length, 2, 'Rapid repeated navigations must not refetch the same destinations');
 view.advance(); view.PortalSectionWarmup({links}); view.run();
 assert.equal(view.prefetched.length, 4, 'Expired entries may load fresh data');
 const limited = fixture({saveData: true}); limited.PortalSectionWarmup({links}); limited.run();
 assert.equal(limited.prefetched.length, 0);
 const background = fixture({hidden: true}); background.PortalSectionWarmup({links}); background.run();
 assert.equal(background.prefetched.length, 0);
 const cancelled = fixture(); cancelled.PortalSectionWarmup({links}); cancelled.clear(); cancelled.run();
 assert.equal(cancelled.prefetched.length, 0, 'Leaving a view cancels its queued requests');
 const publicPages = fixture(); publicPages.PortalWarmup(); publicPages.run(); publicPages.PortalWarmup(); publicPages.run();
 assert.deepEqual(publicPages.prefetched, ['/login'], 'Public startup warmup runs once and never fetches private records');
 console.log('PASS: Bounded and deferred prefetch, organization URLs preserved, repeat suppression, expiry, cancellation, data-saver/background protection and one-time public warmup.');
} finally {
 if (saved === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = saved;
}
