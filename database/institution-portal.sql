/* Institution portal extension. Run once in the project's Supabase SQL editor.
   Requires the existing dashboard API, including public.my_orgs().
   Does not change class membership, learner accounts or existing staff roles. */
begin;
do $$ begin
 if not exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='my_orgs' and p.pronargs=0 and not p.proretset
  and p.prorettype in ('json'::regtype,'jsonb'::regtype)) then
  raise exception 'Requires the dashboard API: public.my_orgs() must return a JSON array (json or jsonb).';
 end if;
end $$;
create table if not exists public.org_portal_profiles (
 org_id uuid primary key,
 institution_type text not null check (institution_type in ('university','school')),
 updated_at timestamptz not null default now(),
 updated_by uuid not null
);
create table if not exists public.org_access_requests (
 id bigint generated always as identity primary key,
 institution_name text not null,
 institution_type text not null check (institution_type in ('university','school')),
 contact_name text not null,
 email text not null,
 learner_count integer not null check (learner_count between 1 and 1000000),
 message text not null default '',
 status text not null default 'pending' check (status in ('pending','approved','declined')),
 created_at timestamptz not null default now()
);
create index if not exists org_access_requests_email_created on public.org_access_requests (email,created_at);
alter table public.org_portal_profiles enable row level security;
alter table public.org_access_requests enable row level security;
revoke all on public.org_portal_profiles, public.org_access_requests from anon, authenticated;
revoke all on sequence public.org_access_requests_id_seq from anon, authenticated;

create or replace function public.org_portal_profile(p_org uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
 if auth.uid() is null then raise exception 'not_authenticated'; end if;
 if not exists (select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o
  where o->>'org_id'=p_org::text and o->>'role' in ('teacher','admin')) then
  raise exception 'not_staff';
 end if;
 select jsonb_build_object('institution_type',p.institution_type) into result
 from public.org_portal_profiles p where p.org_id=p_org;
 return coalesce(result,'{}'::jsonb);
end $$;

create or replace function public.set_org_portal_profile(p_org uuid,p_type text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'not_authenticated'; end if;
 if not exists (select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o
  where o->>'org_id'=p_org::text and o->>'role'='admin') then
  raise exception 'not_admin';
 end if;
 if p_type is null or p_type not in ('university','school') then raise exception 'invalid_institution_type'; end if;
 insert into public.org_portal_profiles(org_id,institution_type,updated_by)
 values(p_org,p_type,auth.uid()) on conflict(org_id) do update
 set institution_type=excluded.institution_type,updated_by=excluded.updated_by,updated_at=now();
 return jsonb_build_object('institution_type',p_type);
end $$;

create or replace function public.request_org_access(p_name text,p_type text,p_contact_name text,p_email text,p_learner_count integer,p_message text default '')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare normalized_email text := lower(trim(p_email));
begin
 if p_type is null or p_type not in ('university','school')
  or p_name is null or length(trim(p_name)) not between 2 and 150
  or p_contact_name is null or length(trim(p_contact_name)) not between 2 and 100
  or normalized_email is null or length(normalized_email)>254 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  or p_learner_count is null or p_learner_count not between 1 and 1000000
  or length(coalesce(p_message,''))>2000 then raise exception 'invalid_request'; end if;
 perform pg_advisory_xact_lock(hashtextextended(normalized_email,0));
 if exists(select 1 from public.org_access_requests r where r.email=normalized_email and r.created_at>now()-interval '24 hours') then
  raise exception 'rate_limited';
 end if;
 insert into public.org_access_requests(institution_name,institution_type,contact_name,email,learner_count,message)
 values(trim(p_name),p_type,trim(p_contact_name),normalized_email,p_learner_count,trim(coalesce(p_message,'')));
 return jsonb_build_object('received',true);
end $$;
revoke all on function public.org_portal_profile(uuid),public.set_org_portal_profile(uuid,text),public.request_org_access(text,text,text,text,integer,text) from public;
grant execute on function public.org_portal_profile(uuid),public.set_org_portal_profile(uuid,text) to authenticated;
grant execute on function public.request_org_access(text,text,text,text,integer,text) to anon,authenticated;
notify pgrst, 'reload schema';
commit;
