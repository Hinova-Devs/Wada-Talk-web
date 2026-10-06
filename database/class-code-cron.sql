-- Enable Supabase Cron first, then run this as the database owner.
-- A named job updates the existing job if this script is run again.
select cron.schedule('wada-class-code-rotation','* * * * *','select public.rotate_due_class_codes();');
