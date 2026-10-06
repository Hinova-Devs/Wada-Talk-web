// Deploy with Supabase. The service-role key stays in the Edge Function environment.
import {createClient} from "npm:@supabase/supabase-js@2.117.2";
Deno.serve(async (request: Request) => {
 const origin=request.headers.get("origin")||"";
 const allowed=(Deno.env.get("DASHBOARD_ALLOWED_ORIGINS")||Deno.env.get("DASHBOARD_URL")||"").split(",").map(v=>v.trim()).filter(Boolean);
 const cors:Record<string,string>=allowed.includes(origin)?{"Access-Control-Allow-Origin":origin,"Vary":"Origin"}:{};
 const headers={...cors,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Cache-Control":"no-store"};
 const reply=(status:number,message:string)=>new Response(JSON.stringify({error:{message}}),{status,headers});
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(origin&&!allowed.includes(origin))return reply(403,"This dashboard origin is not allowed.");
 if(request.method!=="POST")return reply(405,"Use POST.");
 const url=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 const authorization=request.headers.get("authorization")||"";
 if(!/^Bearer\s+\S+$/i.test(authorization))return reply(401,"Sign in again.");
 const token=authorization.replace(/^Bearer\s+/i,"");
 const caller=createClient(url,anon,{global:{headers:{Authorization:authorization}},auth:{persistSession:false}});
 const {data:{user},error:authError}=await caller.auth.getUser(token);
 if(authError||!user)return reply(401,"Sign in again.");
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return reply(400,"Enter valid class admin details.");}
 const {org_id,class_id}=body;
 const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
 const password=typeof body.password==="string"?body.password:"";
 const name=typeof body.name==="string"?body.name.trim():"";
 if(!email||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||name.length<2||name.length>100||password.length<12||password.length>128||!/[a-z]/.test(password)||!/[A-Z]/.test(password)||!/[0-9]/.test(password)||!/[\W_]/.test(password))return reply(400,"Use a name, work email and a password of 12–128 characters with upper/lowercase letters, a number and a symbol.");
 const {data:orgs,error:orgError}=await caller.rpc("my_orgs");
 const org=Array.isArray(orgs)?orgs.find(o=>o.org_id===org_id&&o.role==="admin"):null;
 if(orgError||!org||!Array.isArray(org.classes)||!org.classes.some((c:{id:string})=>c.id===class_id))return reply(403,"Only the institution's Super Admin can provision a class admin.");
 const owner=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 // Existing accounts must be assigned through the existing-staff option; never reset their password.
 let exhausted=false;
 for(let page=1;page<=100;page++){
  const {data,error}=await owner.auth.admin.listUsers({page,perPage:1000});
  if(error)return reply(503,"Could not check existing staff. Please try again.");
  if(data.users.some(u=>u.email?.toLowerCase()===email))return reply(409,"This email already has an account. Assign existing staff; their password is unchanged.");
  if(data.users.length<1000){exhausted=true;break;}
 }
 if(!exhausted)return reply(503,"Contact the project owner to provision this account.");
 // Use the existing staff onboarding function so its profile and membership rules still apply.
 const {data:invite,error:inviteError}=await caller.functions.invoke("invite-staff",{body:{org_id,email,role:"teacher",class_id}});
 if(inviteError||invite?.error||!invite?.user_id)return reply(502,"The class was saved, but staff provisioning failed. Check the invitation service before retrying.");
 if(!invite.invited)return reply(409,"An account was created concurrently. It was assigned to the class; its password was not changed.");
 const {error:passwordError}=await owner.auth.admin.updateUserById(invite.user_id,{password,email_confirm:true,user_metadata:{first_name:name}});
 if(passwordError)return reply(502,"Staff was invited, but the password could not be set. Use the invite link or ask the project owner to complete password setup.");
 return new Response(JSON.stringify({user_id:invite.user_id,role:"teacher",password_set:true}),{status:200,headers});
});
