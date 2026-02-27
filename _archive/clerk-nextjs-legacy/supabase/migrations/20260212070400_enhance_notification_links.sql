-- Enhance notification links to be more specific and clickable
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
  candidate_id_value text;
  application_id_value text;
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
  if TG_TABLE_NAME in ('applications', 'interviews') then
    job_id_value := coalesce((new.job_id)::text, (old.job_id)::text, '');
  else
    job_id_value := '';
  end if;

  -- Get candidate_id for better linking
  if TG_TABLE_NAME = 'applications' then
    candidate_id_value := coalesce((new.candidate_id)::text, (old.candidate_id)::text, '');
    application_id_value := record_id;
  elsif TG_TABLE_NAME = 'interviews' then
    application_id_value := coalesce((new.application_id)::text, (old.application_id)::text, '');
    -- Get candidate_id from application
    if application_id_value <> '' then
      select candidate_id::text, job_id::text into candidate_id_value, job_id_value
      from applications
      where id = application_id_value::uuid;
    end if;
  elsif TG_TABLE_NAME = 'candidates' then
    candidate_id_value := record_id;
  elsif TG_TABLE_NAME = 'tracked_candidates' then
    candidate_id_value := coalesce((new.candidate_id)::text, (old.candidate_id)::text, '');
  elsif TG_TABLE_NAME = 'notes' then
    if coalesce(new.entity_type, old.entity_type) = 'candidate' then
      candidate_id_value := coalesce((new.entity_id)::text, (old.entity_id)::text, '');
    elsif coalesce(new.entity_type, old.entity_type) = 'application' then
      application_id_value := coalesce((new.entity_id)::text, (old.entity_id)::text, '');
      -- Get candidate_id and job_id from application
      if application_id_value <> '' then
        select candidate_id::text, job_id::text into candidate_id_value, job_id_value
        from applications
        where id = application_id_value::uuid;
      end if;
    end if;
  end if;

  notif_type := format('%s_%s', tg_table_name, lower(tg_op));
  notif_title := format('%s %s', initcap(replace(tg_table_name, '_', ' ')), case when tg_op = 'INSERT' then 'added' else 'updated' end);
  notif_message := format('%s was %s', initcap(replace(tg_table_name, '_', ' ')), lower(case when tg_op = 'INSERT' then 'added' else 'updated' end));

  -- Enhanced links - prioritize candidate links, then job links
  notif_link := case tg_table_name
    when 'candidates' then '/candidates/' || record_id
    when 'jobs' then '/jobs/' || record_id
    when 'clients' then '/clients/' || record_id
    when 'interviews' then 
      case 
        when candidate_id_value <> '' then '/candidates/' || candidate_id_value || '?tab=interviews'
        when job_id_value <> '' then '/jobs/' || job_id_value
        else '/interviews'
      end
    when 'applications' then 
      case 
        when candidate_id_value <> '' then '/candidates/' || candidate_id_value || '?tab=applications'
        when job_id_value <> '' then '/jobs/' || job_id_value || '?tab=applicants'
        else '/candidates'
      end
    when 'notes' then 
      case 
        when candidate_id_value <> '' then '/candidates/' || candidate_id_value || '?tab=notes'
        when job_id_value <> '' then '/jobs/' || job_id_value || '?tab=notes'
        else '/dashboard'
      end
    when 'tracked_candidates' then 
      case 
        when candidate_id_value <> '' then '/candidates/' || candidate_id_value || '?tab=activity'
        else '/tracking'
      end
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
        'record_id', record_id,
        'candidate_id', candidate_id_value,
        'job_id', job_id_value,
        'application_id', application_id_value
      ),
      null
    );
  end loop;

  return coalesce(new, old);
end;
$function$;
