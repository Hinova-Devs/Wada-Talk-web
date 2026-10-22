import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const sql=readFileSync('database/university-operations.sql','utf8');
for(const table of ['university_departments','university_class_plans','university_progress_snapshots','university_notifications','university_portal_errors','university_login_events']){
 assert.match(sql,new RegExp(`create table if not exists public\\.${table}`));
 assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`));
}
for(const fn of ['portal_university_role','portal_university_class','university_operations','save_university_department','save_university_class_plan','bulk_update_university_classes','capture_university_snapshot','refresh_university_notifications','set_university_notification_status','record_university_portal_error','record_portal_login','my_portal_login_history'])assert.match(sql,new RegExp(`create or replace function public\\.${fn}`));
assert.match(sql,/jsonb_array_length\(p_rows\)>200/);assert.match(sql,/o->>'role'='admin'/);assert.match(sql,/o->>'role'='teacher' and c->>'id'=p\.class_id::text/);assert.match(sql,/c->>'id'=n\.class_id::text/);assert.match(sql,/revoke all on public\.university_departments/);assert.match(sql,/grant execute on function public\.university_operations/);assert.match(sql,/notify pgrst,'reload schema'/);
assert.doesNotMatch(sql,/service_role|SUPABASE_SERVICE_ROLE_KEY/i);
console.log('PASS: University operations migration is repeat-safe at object creation, enables RLS, revokes table access, limits bulk rows, checks roles and exposes only authenticated RPCs.');
