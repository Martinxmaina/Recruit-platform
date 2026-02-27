-- Fix notify_org_members_on_change trigger function to handle tables without job_id column
-- The function was trying to read NEW.job_id for all tables, but tracked_candidates
-- and candidates tables don't have a job_id column, causing "record 'new' has no field 'job_id'" error

CREATE OR REPLACE FUNCTION public.notify_org_members_on_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  org_id uuid;
  record_id text;
  job_id_value text;
  notif_type text;
  notif_title text;
  notif_message text;
  notif_link text;
  target_user record;
begin
  org_id := coalesce(new.organization_id, old.organization_id);
  if org_id is null then
    return coalesce(new, old);
  end if;

  record_id := coalesce((new.id)::text, (old.id)::text, '');
  
  -- Only read job_id for tables that have this column (applications, interviews)
  -- For other tables (tracked_candidates, candidates, etc.), set to empty string
  if TG_TABLE_NAME in ('applications', 'interviews') then
    job_id_value := coalesce((new.job_id)::text, (old.job_id)::text, '');
  else
    job_id_value := '';
  end if;

  notif_type := format('%s_%s', tg_table_name, lower(tg_op));
  notif_title := format('%s %s', initcap(replace(tg_table_name, '_', ' ')), case when tg_op = 'INSERT' then 'added' else 'updated' end);
  notif_message := format('%s was %s', initcap(replace(tg_table_name, '_', ' ')), lower(case when tg_op = 'INSERT' then 'added' else 'updated' end));

  notif_link := case tg_table_name
    when 'candidates' then '/candidates/' || record_id
    when 'jobs' then '/jobs/' || record_id
    when 'clients' then '/clients/' || record_id
    when 'interviews' then '/interviews'
    when 'applications' then case when job_id_value <> '' then '/jobs/' || job_id_value else '/candidates' end
    when 'notes' then '/dashboard'
    when 'tracked_candidates' then '/tracking'
    else '/dashboard'
  end;

  for target_user in
    select om.user_id
    from public.org_members om
    where om.organization_id = org_id
  loop
    insert into public.notifications (
      organization_id,
      user_id,
      type,
      title,
      message,
      link,
      metadata,
      read_at
    ) values (
      org_id,
      target_user.user_id,
      notif_type,
      notif_title,
      notif_message,
      notif_link,
      jsonb_build_object(
        'table', tg_table_name,
        'operation', tg_op,
        'record_id', record_id
      ),
      null
    );
  end loop;

  return coalesce(new, old);
end;
$function$;
