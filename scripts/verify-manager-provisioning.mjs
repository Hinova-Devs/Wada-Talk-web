import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync('supabase/functions/provision-class-manager/index.ts','utf8');
const filename=process.cwd()+'/supabase/functions/provision-class-manager/index.ts';
const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,skipLibCheck:true,noEmit:true,esModuleInterop:true};
const host=ts.createCompilerHost(options);const originalSource=host.getSourceFile.bind(host);
host.getSourceFile=(file,version,...args)=>file.replaceAll('\\','/')===filename.replaceAll('\\','/')?ts.createSourceFile(file,source.replace('npm:@supabase/supabase-js@2.117.2','@supabase/supabase-js')+'\ndeclare const Deno: {env:{get(name:string):string|undefined};serve(handler:(request:Request)=>Promise<Response>):void};',version,true):originalSource(file,version,...args);
const diagnostics=ts.getPreEmitDiagnostics(ts.createProgram([filename],options,host));
assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>process.cwd(),getNewLine:()=>"\n"}));
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/^import .*?;\s*/m,'');
async function run({role='admin',existing=false,authenticated=true,invited=true,passwordError=false,classMatch=true,password='StrongDemo!2468'}={}){
 const events=[];let handler;
 const caller={auth:{getUser:async()=>({data:{user:authenticated?{id:'caller'}:null},error:null})},rpc:async()=>({data:[{org_id:'org',role,classes:[{id:classMatch?'class':'other'}]}],error:null}),functions:{invoke:async(name,input)=>{events.push(['invite',name,input]);return {data:{user_id:'new-manager',invited},error:null};}}};
 const owner={auth:{admin:{listUsers:async()=>{events.push(['list']);return {data:{users:existing?[{email:'manager@example.test'}]:[]},error:null};},updateUserById:async(id,input)=>{events.push(['password',id,input]);return {error:passwordError?new Error('private error'):null};}}}};
 const createClient=(_url,key)=>key==='secret'?owner:caller;
 const Deno={env:{get:key=>({SUPABASE_URL:'https://example.test',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'secret',DASHBOARD_URL:'http://localhost:3000'}[key])},serve:value=>{handler=value;}};
 new Function('createClient','Deno',compiled)(createClient,Deno);
 const response=await handler(new Request('https://example.test/functions/v1/provision-class-manager',{method:'POST',headers:{origin:'http://localhost:3000',authorization:'Bearer mock','content-type':'application/json'},body:JSON.stringify({org_id:'org',class_id:'class',email:'manager@example.test',name:'Class owner',password})}));
 const body=await response.json();assert.ok(!JSON.stringify(body).includes(password));return {status:response.status,body,events};
}
for(const config of [{role:'teacher'},{classMatch:false}]){const r=await run(config);assert.equal(r.status,403);assert.equal(r.events.length,0);}
assert.equal((await run({authenticated:false})).status,401);
assert.equal((await run({password:'weak'})).status,400);
let r=await run({existing:true});assert.equal(r.status,409);assert.equal(r.events.filter(e=>e[0]==='invite'||e[0]==='password').length,0);
r=await run({invited:false});assert.equal(r.status,409);assert.equal(r.events.filter(e=>e[0]==='password').length,0);
r=await run();assert.equal(r.status,200);assert.equal(r.body.password_set,true);assert.deepEqual(r.events.find(e=>e[0]==='invite')[2].body,{org_id:'org',email:'manager@example.test',role:'teacher',class_id:'class'});assert.equal(r.events.find(e=>e[0]==='password')[1],'new-manager');
r=await run({passwordError:true});assert.equal(r.status,502);assert.match(r.body.error.message,/password could not be set/);
console.log('PASS: English Teacher provisioning rejects unassigned classes/non-Super Admins, preserves existing passwords, provisions only newly invited staff, validates passwords and reports partial failure. Supabase calls mocked.');
