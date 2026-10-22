/* University operations extension. Apply after the existing dashboard API.
   It stores portal-only department, planning, snapshot, notification and safe
   error metadata. It does not change learner membership or core class tables. */
begin;

do $$ begin
 if not exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='my_orgs' and p.pronargs=0) then
  raise exception 'Requires public.my_orgs().';
 end if;
 if not exists (select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='org_overview' and p.pronargs=2) then
  raise exception 'Requires public.org_overview(uuid,integer).';
 end if;
end $$;

create table if not exists public.university_departments (
 id uuid primary key default gen_random_uuid(), org_id uuid not null, name text not null,
 created_at timestamptz not null default now(), created_by uuid not null,
 unique(org_id,name), check(length(trim(name)) between 2 and 100)
);
create table if not exists public.university_class_plans (
 class_id uuid primary key, org_id uuid not null, department_id uuid references public.university_departments(id) on delete set null,
 meeting_day smallint check(meeting_day between 1 and 7), meeting_time time,
 next_lesson text check(next_lesson is null or length(next_lesson)<=200),
 updated_at timestamptz not null default now(), updated_by uuid not null
);
create table if not exists public.university_progress_snapshots (
 org_id uuid not null, class_id uuid not null, snapshot_day date not null default current_date,
 metrics jsonb not null, captured_at timestamptz not null default now(), captured_by uuid not null,
 primary key(org_id,class_id,snapshot_day), check(jsonb_typeof(metrics)='object')
);
create table if not exists public.university_notifications (
 id bigint generated always as identity primary key, org_id uuid not null, class_id uuid,
 kind text not null check(kind in ('low_activity','capacity','join_code','planning')),
 title text not null, detail text not null, notification_day date not null default current_date,
 status text not null default 'open' check(status in ('open','read','resolved')),
 created_at timestamptz not null default now(), unique(org_id,class_id,kind,notification_day)
);
create table if not exists public.university_portal_errors (
 id bigint generated always as identity primary key, org_id uuid not null, actor_id uuid not null,
 area text not null check(length(area) between 2 and 60), safe_message text not null check(length(safe_message) between 2 and 300),
 created_at timestamptz not null default now()
);
create table if not exists public.university_login_events (
 id bigint generated always as identity primary key, user_id uuid not null,
 sign_in_method text not null check(sign_in_method in ('password','email_link','session')),
 client_label text not null check(length(client_label) between 2 and 80),
 occurred_at timestamptz not null default now()
);
create index if not exists university_departments_org on public.university_departments(org_id);
create index if not exists university_class_plans_org on public.university_class_plans(org_id);
create index if not exists university_snapshots_org_day on public.university_progress_snapshots(org_id,snapshot_day desc);
create index if not exists university_notifications_org_status on public.university_notifications(org_id,status,created_at desc);
create index if not exists university_errors_org_created on public.university_portal_errors(org_id,created_at desc);
create index if not exists university_login_events_user_created on public.university_login_events(user_id,occurred_at desc);
alter table public.university_departments enable row level security;
alter table public.university_class_plans enable row level security;
alter table public.university_progress_snapshots enable row level security;
alter table public.university_notifications enable row level security;
alter table public.university_portal_errors enable row level security;
alter table public.university_login_events enable row level security;
revoke all on public.university_departments,public.university_class_plans,public.university_progress_snapshots,public.university_notifications,public.university_portal_errors,public.university_login_events from public,anon,authenticated;
revoke all on sequence public.university_notifications_id_seq,public.university_portal_errors_id_seq,public.university_login_events_id_seq from public,anon,authenticated;

create or replace function public.portal_university_role(p_org uuid)
returns text language plpgsql security definer set search_path='' as $$
declare role_name text;
begin
 if auth.uid() is null then raise exception 'not_authenticated';end if;
 select o->>'role' into role_name from jsonb_array_elements(to_jsonb(public.my_orgs())) o
 where o->>'org_id'=p_org::text and o->>'role' in ('admin','teacher') limit 1;
 if role_name is null then raise exception 'not_allowed';end if;
 return role_name;
end $$;

create or replace function public.portal_university_class(p_class uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare o jsonb;c jsonb;
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

create or replace function public.university_operations(p_org uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare role_name text;
begin
 role_name:=public.portal_university_role(p_org);
 return jsonb_build_object(
  'available',true,
  'departments',coalesce((select jsonb_agg(jsonb_build_object('id',d.id,'name',d.name) order by d.name) from public.university_departments d where d.org_id=p_org),'[]'::jsonb),
  'classes',coalesce((select jsonb_agg(jsonb_build_object('class_id',p.class_id,'department_id',p.department_id,'department_name',d.name,'meeting_day',p.meeting_day,'meeting_time',p.meeting_time,'next_lesson',p.next_lesson,'updated_at',p.updated_at)) from public.university_class_plans p left join public.university_departments d on d.id=p.department_id where p.org_id=p_org and (role_name='admin' or exists(select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o,jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) c where o->>'org_id'=p_org::text and o->>'role'='teacher' and c->>'id'=p.class_id::text))),'[]'::jsonb),
  'snapshots',coalesce((select jsonb_agg(jsonb_build_object('class_id',s.class_id,'snapshot_day',s.snapshot_day,'metrics',s.metrics) order by s.snapshot_day desc) from (select * from public.university_progress_snapshots where org_id=p_org and (role_name='admin' or exists(select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o,jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) c where o->>'org_id'=p_org::text and o->>'role'='teacher' and c->>'id'=class_id::text)) order by snapshot_day desc limit 500) s),'[]'::jsonb),
  'notifications',coalesce((select jsonb_agg(jsonb_build_object('id',n.id,'class_id',n.class_id,'kind',n.kind,'title',n.title,'detail',n.detail,'status',n.status,'created_at',n.created_at) order by n.created_at desc) from (select * from public.university_notifications where org_id=p_org and status<>'resolved' and (role_name='admin' or exists(select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o,jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) c where o->>'org_id'=p_org::text and o->>'role'='teacher' and c->>'id'=class_id::text)) order by created_at desc limit 100) n),'[]'::jsonb),
  'errors',case when role_name='admin' then coalesce((select jsonb_agg(jsonb_build_object('area',e.area,'message',e.safe_message,'created_at',e.created_at) order by e.created_at desc) from (select * from public.university_portal_errors where org_id=p_org order by created_at desc limit 50) e),'[]'::jsonb) else '[]'::jsonb end
 );
end $$;

create or replace function public.save_university_department(p_org uuid,p_name text)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;normalized text:=trim(p_name);
begin
 if public.portal_university_role(p_org)<>'admin' then raise exception 'not_allowed';end if;
 if normalized is null or length(normalized) not between 2 and 100 then raise exception 'invalid_department';end if;
 insert into public.university_departments(org_id,name,created_by) values(p_org,normalized,auth.uid())
 on conflict(org_id,name) do update set name=excluded.name returning id into result;
 return result;
end $$;

create or replace function public.save_university_class_plan(p_class uuid,p_department uuid,p_day integer,p_time time,p_next_lesson text)
returns void language plpgsql security definer set search_path='' as $$
declare access jsonb;org uuid;lesson text:=nullif(trim(coalesce(p_next_lesson,'')),'');
begin
 access:=public.portal_university_class(p_class);org:=(access->>'org_id')::uuid;
 if p_day is not null and p_day not between 1 and 7 then raise exception 'invalid_day';end if;
 if lesson is not null and length(lesson)>200 then raise exception 'invalid_lesson';end if;
 if p_department is not null and not exists(select 1 from public.university_departments where id=p_department and org_id=org) then raise exception 'invalid_department';end if;
 insert into public.university_class_plans(class_id,org_id,department_id,meeting_day,meeting_time,next_lesson,updated_by)
 values(p_class,org,p_department,p_day,p_time,lesson,auth.uid()) on conflict(class_id) do update set
 department_id=excluded.department_id,meeting_day=excluded.meeting_day,meeting_time=excluded.meeting_time,next_lesson=excluded.next_lesson,updated_by=excluded.updated_by,updated_at=now();
end $$;

create or replace function public.bulk_update_university_classes(p_org uuid,p_rows jsonb)
returns integer language plpgsql security definer set search_path='' as $$
declare item jsonb;class_id uuid;department_name text;department_id uuid;changed integer:=0;allowed boolean;
begin
 if public.portal_university_role(p_org)<>'admin' then raise exception 'not_allowed';end if;
 if jsonb_typeof(p_rows)<>'array' or jsonb_array_length(p_rows)>200 then raise exception 'invalid_import';end if;
 for item in select value from jsonb_array_elements(p_rows) loop
  begin class_id:=(item->>'class_id')::uuid;exception when others then raise exception 'invalid_class_id';end;
  select exists(select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o,jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) c where o->>'org_id'=p_org::text and o->>'role'='admin' and c->>'id'=class_id::text) into allowed;
  if not allowed then raise exception 'not_allowed';end if;
  department_name:=nullif(trim(coalesce(item->>'department','')),'');department_id:=null;
  if department_name is not null then
   if length(department_name)>100 then raise exception 'invalid_department';end if;
   insert into public.university_departments(org_id,name,created_by) values(p_org,department_name,auth.uid()) on conflict(org_id,name) do update set name=excluded.name returning id into department_id;
  end if;
  perform public.save_university_class_plan(class_id,department_id,nullif(item->>'meeting_day','')::integer,nullif(item->>'meeting_time','')::time,item->>'next_lesson');changed:=changed+1;
 end loop;
 return changed;
end $$;

create or replace function public.capture_university_snapshot(p_org uuid)
returns integer language plpgsql security definer set search_path='' as $$
declare overview jsonb;item jsonb;class_id uuid;changed integer:=0;
begin
 if public.portal_university_role(p_org)<>'admin' then raise exception 'not_allowed';end if;
 overview:=to_jsonb(public.org_overview(p_org,30));
 for item in select value from jsonb_array_elements(coalesce(overview->'classes','[]'::jsonb)) loop
  begin class_id:=coalesce(item->>'id',item->>'class_id')::uuid;exception when others then continue;end;
  insert into public.university_progress_snapshots(org_id,class_id,metrics,captured_by) values(p_org,class_id,item,auth.uid())
  on conflict(org_id,class_id,snapshot_day) do update set metrics=excluded.metrics,captured_at=now(),captured_by=excluded.captured_by;changed:=changed+1;
 end loop;
 return changed;
end $$;

create or replace function public.refresh_university_notifications(p_org uuid)
returns integer language plpgsql security definer set search_path='' as $$
declare overview jsonb;item jsonb;class_id uuid;students integer;active integer;changed integer:=0;org_data jsonb;class_data jsonb;
begin
 if public.portal_university_role(p_org)<>'admin' then raise exception 'not_allowed';end if;
 overview:=to_jsonb(public.org_overview(p_org,30));
 select value into org_data from jsonb_array_elements(to_jsonb(public.my_orgs())) where value->>'org_id'=p_org::text and value->>'role'='admin' limit 1;
 for item in select value from jsonb_array_elements(coalesce(overview->'classes','[]'::jsonb)) loop
  begin class_id:=coalesce(item->>'id',item->>'class_id')::uuid;exception when others then continue;end;
  students:=coalesce((item->>'students')::integer,0);active:=coalesce((item->>'active_7d')::integer,0);
  if students>=5 and active*100<students*50 then insert into public.university_notifications(org_id,class_id,kind,title,detail) values(p_org,class_id,'low_activity','Low weekly activity',active||' of '||students||' learners were active in 7 days') on conflict do nothing;changed:=changed+1;end if;
 end loop;
 for class_data in select value from jsonb_array_elements(coalesce(org_data->'classes','[]'::jsonb)) loop
  begin class_id:=(class_data->>'id')::uuid;exception when others then continue;end;
  if coalesce((class_data->>'has_code')::boolean,false)=false then insert into public.university_notifications(org_id,class_id,kind,title,detail) values(p_org,class_id,'join_code','No active join code','Create a code before inviting learners') on conflict do nothing;changed:=changed+1;end if;
  if class_data->>'seat_limit' is not null and coalesce((class_data->>'students')::integer,0)*100>=greatest((class_data->>'seat_limit')::integer,1)*90 then insert into public.university_notifications(org_id,class_id,kind,title,detail) values(p_org,class_id,'capacity','Class capacity is nearly full',(class_data->>'students')||' of '||(class_data->>'seat_limit')||' seats are used') on conflict do nothing;changed:=changed+1;end if;
 end loop;
 return changed;
end $$;

create or replace function public.set_university_notification_status(p_org uuid,p_id bigint,p_status text)
returns void language plpgsql security definer set search_path='' as $$
declare role_name text;
begin
 role_name:=public.portal_university_role(p_org);if p_status not in ('read','resolved') then raise exception 'invalid_status';end if;
 update public.university_notifications n set status=p_status where n.id=p_id and n.org_id=p_org and (role_name='admin' or exists(select 1 from jsonb_array_elements(to_jsonb(public.my_orgs())) o,jsonb_array_elements(coalesce(o->'classes','[]'::jsonb)) c where o->>'org_id'=p_org::text and o->>'role'='teacher' and c->>'id'=n.class_id::text));
end $$;

create or replace function public.record_university_portal_error(p_org uuid,p_area text,p_message text)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform public.portal_university_role(p_org);
 if length(trim(p_area)) not between 2 and 60 or length(trim(p_message)) not between 2 and 300 then raise exception 'invalid_error';end if;
 insert into public.university_portal_errors(org_id,actor_id,area,safe_message) values(p_org,auth.uid(),trim(p_area),trim(p_message));
end $$;

create or replace function public.record_portal_login(p_method text default 'session',p_client_label text default 'University web portal')
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'not_authenticated';end if;
 if p_method not in ('password','email_link','session') or length(trim(p_client_label)) not between 2 and 80 then raise exception 'invalid_login_event';end if;
 if not exists(select 1 from public.university_login_events where user_id=auth.uid() and sign_in_method=p_method and occurred_at>now()-interval '2 minutes') then
  insert into public.university_login_events(user_id,sign_in_method,client_label) values(auth.uid(),p_method,trim(p_client_label));
 end if;
end $$;

create or replace function public.my_portal_login_history()
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'not_authenticated';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('method',e.sign_in_method,'client_label',e.client_label,'occurred_at',e.occurred_at) order by e.occurred_at desc) from (select * from public.university_login_events where user_id=auth.uid() order by occurred_at desc limit 20) e),'[]'::jsonb);
end $$;

revoke all on function public.portal_university_role(uuid),public.portal_university_class(uuid),public.university_operations(uuid),public.save_university_department(uuid,text),public.save_university_class_plan(uuid,uuid,integer,time,text),public.bulk_update_university_classes(uuid,jsonb),public.capture_university_snapshot(uuid),public.refresh_university_notifications(uuid),public.set_university_notification_status(uuid,bigint,text),public.record_university_portal_error(uuid,text,text),public.record_portal_login(text,text),public.my_portal_login_history() from public,anon,authenticated;
grant execute on function public.university_operations(uuid),public.save_university_department(uuid,text),public.save_university_class_plan(uuid,uuid,integer,time,text),public.bulk_update_university_classes(uuid,jsonb),public.capture_university_snapshot(uuid),public.refresh_university_notifications(uuid),public.set_university_notification_status(uuid,bigint,text),public.record_university_portal_error(uuid,text,text),public.record_portal_login(text,text),public.my_portal_login_history() to authenticated;
notify pgrst,'reload schema';
commit;
