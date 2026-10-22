import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function compile(path, imports = {}) {
 const code = ts.transpileModule(readFileSync(path, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022}}).outputText;
 const compiledModule = {exports: {}};
 new Function('require', 'module', 'exports', code)(name => imports[name] ?? require(name), compiledModule, compiledModule.exports);
 return compiledModule.exports;
}
const data = compile('src/lib/portal/data.ts');
const org = {org_id: 'org-a', name: 'University A', role: 'teacher', classes: [{id: 'class-a', name: 'ENG 201'}]};
const started = [];
let releaseAuth, releaseOverview;
const authGate = new Promise(resolve => {releaseAuth = resolve;});
const overviewGate = new Promise(resolve => {releaseOverview = resolve;});
let signedIn = true;
const client = {
 auth: {getUser: async () => {started.push('auth'); await authGate; return {data: {user: signedIn ? {email: 'lecturer@example.test'} : null}};}},
 rpc: async name => {
  started.push(name);
  if (name === 'my_orgs') {releaseAuth(); return {data: [org], error: null};}
  if (name === 'class_overview') {await overviewGate; return {data: {students: 1}, error: null};}
  if (name === 'class_students') {releaseOverview(); return {data: [{user_id: 'learner-a', first_name: 'Amina'}], error: null};}
  throw new Error('Unnecessary or unauthorized RPC: ' + name);
 },
};
const Portal = compile('src/app/portal/page.tsx', {
 'next/link': {default: () => null},
 'next/navigation': {redirect: path => {throw new Error('redirect:' + path);}},
 '@/lib/supabase/server': {createClient: async () => client},
 '@/components/portal/dashboard': {default: () => null},
 '@/lib/portal/data': data,
}).default;
const savedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const savedKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test';
let timeout;
try {
 const element = await Promise.race([
  Portal({searchParams: Promise.resolve({section: 'class-detail', class_id: 'class-a'})}),
  new Promise((_, reject) => {timeout = setTimeout(() => reject(new Error('Independent portal reads were serialized')), 2000);}),
 ]);
 clearTimeout(timeout);
 assert.deepEqual(started, ['auth', 'my_orgs', 'class_overview', 'class_students']);
 assert.equal(element.props.data.students.length, 1);
 assert.equal(element.props.data.org.role, 'teacher');
 assert.equal(element.props.data.institutionType, 'university');
 started.length = 0;
 signedIn = false;
 await assert.rejects(Portal({searchParams: Promise.resolve({section: 'class-detail'})}), /redirect:\/login/);
 assert.deepEqual(started, ['auth', 'my_orgs']);
 console.log('PASS: Authentication and membership start together; independent class reads run together; obsolete profile RPC is absent; anonymous users still redirect before class data loads.');
} finally {
 clearTimeout(timeout);
 if (savedUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = savedUrl;
 if (savedKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedKey;
}
