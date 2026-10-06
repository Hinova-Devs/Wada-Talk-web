-- Apply after the original dashboard API. Current codes are retained privately
-- so authorized class staff can retrieve a code after a server-side rotation.
begin;
create table if not exists public.class_portal_codes (
 class_id uuid primary key,
 org_id uuid not null,
 valid_days integer not null check(valid_days between 1 and 365),
 automatic boolean not null default false,
 code text,
 expires_at timestamptz,
 actor_id uuid not null,
 last_error text,
 updated_at timestamptz not null default now()
);
alter table public.class_portal_codes enable row level security;
revoke all on public.class_portal_codes from public,anon,authenticated;
create index if not exists class_portal_codes_due on public.class_portal_codes(expires_at) where automatic;

create or replace function public.portal_class_access(p_class uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare o jsonb; c jsonb;
begin
 if auth.uid() is null then raise exception 'not_authenticated';end if;
 for o in select value from jsonb_array_elements(to_jsonb(public.my_orgs())) loop
  if o->>'role' in ('admin','teacher') then
   for c in select value from jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) loop
    if c->>'id'=p_class::text then return jsonb_build_object('org_id',o->>'org_id','role',o->>'role');end if;
   end loop;
  end if;
 end loop;
 raise exception 'not_allowed';
end $$;

create or replace function public.configure_class_code(p_class uuid,p_valid_days integer,p_automatic boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare access jsonb; result jsonb;
begin
 access:=public.portal_class_access(p_class);
 if p_valid_days is null or p_valid_days not between 1 and 365 or p_automatic is null then raise exception 'invalid_duration';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_class::text,47));
 result:=to_jsonb(public.new_join_code(p_class,p_valid_days));
 if result->>'code' is null or result->>'expires_at' is null then raise exception 'code_not_returned';end if;
 insert into public.class_portal_codes(class_id,org_id,valid_days,automatic,code,expires_at,actor_id)
 values(p_class,(access->>'org_id')::uuid,p_valid_days,p_automatic,result->>'code',(result->>'expires_at')::timestamptz,auth.uid())
 on conflict(class_id) do update set valid_days=excluded.valid_days,automatic=excluded.automatic,code=excluded.code,
 expires_at=excluded.expires_at,actor_id=excluded.actor_id,last_error=null,updated_at=now();
 return result||jsonb_build_object('automatic',p_automatic,'valid_days',p_valid_days);
end $$;

create or replace function public.read_class_code(p_class uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s public.class_portal_codes%rowtype; result jsonb;
begin
 perform public.portal_class_access(p_class);
 perform pg_advisory_xact_lock(hashtextextended(p_class::text,47));
 select * into s from public.class_portal_codes where class_id=p_class for update;
 if not found then return null;end if;
 if s.automatic and s.expires_at<=now() then
  return public.configure_class_code(p_class,s.valid_days,true);
 end if;
 result:=jsonb_build_object('code',case when s.expires_at>now() then s.code else null end,
  'expires_at',s.expires_at,'automatic',s.automatic,'valid_days',s.valid_days,'rotation_error',s.last_error);
 return result;
end $$;

create or replace function public.stop_class_code(p_class uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.portal_class_access(p_class);
 perform pg_advisory_xact_lock(hashtextextended(p_class::text,47));
 perform public.revoke_join_code(p_class);
 delete from public.class_portal_codes where class_id=p_class;
end $$;

-- Only the DB job/owner can run this worker. Its recorded actor must still have
-- access to that class; existing new_join_code permissions are checked again.
create or replace function public.rotate_due_class_codes()
returns integer language plpgsql security definer set search_path='' as $$
declare s public.class_portal_codes%rowtype; result jsonb; changed integer:=0;
 old_claims text:=current_setting('request.jwt.claims',true);
 old_sub text:=current_setting('request.jwt.claim.sub',true);
 old_role text:=current_setting('request.jwt.claim.role',true);
begin
 for s in select * from public.class_portal_codes where automatic and expires_at<=now() order by expires_at limit 100 loop
  if not pg_try_advisory_xact_lock(hashtextextended(s.class_id::text,47)) then continue;end if;
  select * into s from public.class_portal_codes where class_id=s.class_id for update skip locked;
  if not found or not s.automatic or s.expires_at>now() then continue;end if;
  begin
   perform set_config('request.jwt.claims',jsonb_build_object('sub',s.actor_id,'role','authenticated')::text,true);
   perform set_config('request.jwt.claim.sub',s.actor_id::text,true);
   perform set_config('request.jwt.claim.role','authenticated',true);
   perform public.portal_class_access(s.class_id);
   result:=to_jsonb(public.new_join_code(s.class_id,s.valid_days));
   if result->>'code' is null or result->>'expires_at' is null then raise exception 'code_not_returned';end if;
   update public.class_portal_codes set code=result->>'code',expires_at=(result->>'expires_at')::timestamptz,last_error=null,updated_at=now() where class_id=s.class_id;
   changed:=changed+1;
  exception when others then
   update public.class_portal_codes set automatic=false,code=null,last_error='rotation_failed',updated_at=now() where class_id=s.class_id;
  end;
  perform set_config('request.jwt.claims',coalesce(old_claims,''),true);
  perform set_config('request.jwt.claim.sub',coalesce(old_sub,''),true);
  perform set_config('request.jwt.claim.role',coalesce(old_role,''),true);
 end loop;
 return changed;
end $$;
revoke all on function public.portal_class_access(uuid),public.rotate_due_class_codes(),public.configure_class_code(uuid,integer,boolean),public.read_class_code(uuid),public.stop_class_code(uuid) from public,anon,authenticated;
grant execute on function public.configure_class_code(uuid,integer,boolean),public.read_class_code(uuid),public.stop_class_code(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
