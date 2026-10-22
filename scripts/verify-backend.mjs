import {readFileSync, existsSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const env = {...process.env};
for (const file of ['.env', '.env.local']) {
 if (!existsSync(file)) continue;
 for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z_][A-Z_0-9]*)\s*=\s*(.*?)\s*$/);
  if (match && process.env[match[1]] === undefined) env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
 }
}
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, .env or the process environment.');
const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {auth: {persistSession: false, autoRefreshToken: false}});
const auth = await client.auth.signInWithPassword({email: 'sahra@demo.wada.test', password: 'demo1234'});
if (auth.error) {console.log('Demo sign-in unavailable:', auth.error.message); process.exitCode = 1;} else {
 const membership = await client.rpc('my_orgs');
 if (membership.error) throw new Error(membership.error.message);
 console.log('my_orgs: OK; organizations:', membership.data.length, 'role:', membership.data[0]?.role);
 const org = membership.data[0]; const classroom = org?.classes?.[0];
 const checks = [];
 if (org?.role === 'teacher') {for (const name of ['org_overview', 'org_staff', 'org_audit_log']) {const result = await client.rpc(name, {p_org: org.org_id}); console.log(name + ' teacher access: ' + (result.error?.message.includes('not_allowed') ? 'correctly denied' : 'unexpected result')); if (!result.error?.message.includes('not_allowed')) process.exitCode = 1;}}
 if (org?.role === 'admin') checks.push(['org_overview', {p_org: org.org_id, p_days: 30}], ['org_staff', {p_org: org.org_id}], ['org_audit_log', {p_org: org.org_id, p_limit: 100}]);
 if (classroom) checks.push(['class_overview', {p_class: classroom.id, p_days: 30}], ['class_students', {p_class: classroom.id}], ['class_skills', {p_class: classroom.id, p_weeks: 8}], ['class_mistakes', {p_class: classroom.id, p_days: 30}]);
 const results = await Promise.all(checks.map(async ([name, args]) => {const result = await client.rpc(name, args); console.log(name + ': ' + (result.error ? result.error.message : 'OK')); if (result.error) process.exitCode = 1; return {name, data: result.data};}));
 const learners = results.find(item => item.name === 'class_students')?.data;
 if (learners?.length) {const result = await client.rpc('student_detail', {p_class: classroom.id, p_user: learners[0].user_id}); console.log('student_detail: ' + (result.error ? result.error.message : 'OK')); if (result.error) process.exitCode = 1;}
 await client.auth.signOut({scope: 'local'});
}


