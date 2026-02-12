-- Function to create activity log entries
CREATE OR REPLACE FUNCTION public.create_activity_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  org_id uuid;
  candidate_id_val uuid;
  user_id_val text;
  user_name_val text;
  action_type_val text;
  old_vals jsonb;
  new_vals jsonb;
BEGIN
  -- Get organization_id from NEW or OLD
  org_id := COALESCE(NEW.organization_id, OLD.organization_id);
  IF org_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Determine candidate_id based on entity type
  IF TG_TABLE_NAME = 'applications' THEN
    candidate_id_val := COALESCE(NEW.candidate_id, OLD.candidate_id);
  ELSIF TG_TABLE_NAME = 'interviews' THEN
    -- Get candidate_id from application
    SELECT candidate_id INTO candidate_id_val
    FROM applications
    WHERE id = COALESCE(NEW.application_id, OLD.application_id);
  ELSIF TG_TABLE_NAME = 'notes' THEN
    IF COALESCE(NEW.entity_type, OLD.entity_type) = 'candidate' THEN
      candidate_id_val := COALESCE(NEW.entity_id, OLD.entity_id);
    ELSIF COALESCE(NEW.entity_type, OLD.entity_type) = 'application' THEN
      SELECT candidate_id INTO candidate_id_val
      FROM applications
      WHERE id = COALESCE(NEW.entity_id, OLD.entity_id);
    END IF;
  ELSIF TG_TABLE_NAME = 'candidates' THEN
    candidate_id_val := COALESCE(NEW.id, OLD.id);
  ELSIF TG_TABLE_NAME = 'tracked_candidates' THEN
    candidate_id_val := COALESCE(NEW.candidate_id, OLD.candidate_id);
  END IF;

  -- Get user context (set by application layer via set_user_context)
  user_id_val := current_setting('app.current_user_id', true);
  user_name_val := current_setting('app.current_user_name', true);
  
  -- If user context not set, try to get from added_by_user_id or similar fields
  IF user_id_val = '' OR user_id_val IS NULL THEN
    IF TG_TABLE_NAME = 'tracked_candidates' THEN
      user_id_val := COALESCE(NEW.added_by_user_id, OLD.added_by_user_id);
      user_name_val := COALESCE(user_name_val, 'System');
    ELSE
      user_id_val := 'system';
      user_name_val := 'System';
    END IF;
  END IF;

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type_val := CASE TG_TABLE_NAME
      WHEN 'applications' THEN 'application_created'
      WHEN 'interviews' THEN 'interview_scheduled'
      WHEN 'notes' THEN 'note_added'
      WHEN 'candidates' THEN 'candidate_created'
      WHEN 'tracked_candidates' THEN 'candidate_tracked'
      ELSE 'created'
    END;
    
    -- Convert NEW record to JSONB
    new_vals := to_jsonb(NEW);
    
    INSERT INTO public.activity_logs (
      organization_id,
      entity_type,
      entity_id,
      candidate_id,
      user_id,
      user_name,
      action_type,
      new_values,
      action_details,
      created_at
    ) VALUES (
      org_id,
      CASE TG_TABLE_NAME
        WHEN 'tracked_candidates' THEN 'tracked_candidate'
        ELSE TG_TABLE_NAME
      END,
      NEW.id,
      candidate_id_val,
      user_id_val,
      user_name_val,
      action_type_val,
      new_vals,
      jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP),
      now()
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for stage changes in applications
    IF TG_TABLE_NAME = 'applications' AND OLD.stage IS DISTINCT FROM NEW.stage THEN
      action_type_val := 'stage_changed';
      old_vals := jsonb_build_object('stage', OLD.stage, 'status', OLD.status);
      new_vals := jsonb_build_object('stage', NEW.stage, 'status', NEW.status);
    ELSIF TG_TABLE_NAME = 'applications' AND OLD.status IS DISTINCT FROM NEW.status THEN
      action_type_val := 'status_changed';
      old_vals := jsonb_build_object('status', OLD.status);
      new_vals := jsonb_build_object('status', NEW.status);
    ELSIF TG_TABLE_NAME = 'interviews' AND OLD.status IS DISTINCT FROM NEW.status THEN
      action_type_val := CASE NEW.status
        WHEN 'completed' THEN 'interview_completed'
        WHEN 'cancelled' THEN 'interview_cancelled'
        ELSE 'interview_updated'
      END;
      old_vals := to_jsonb(OLD);
      new_vals := to_jsonb(NEW);
    ELSE
      action_type_val := CASE TG_TABLE_NAME
        WHEN 'applications' THEN 'application_updated'
        WHEN 'interviews' THEN 'interview_updated'
        WHEN 'candidates' THEN 'candidate_updated'
        WHEN 'tracked_candidates' THEN 'tracked_candidate_updated'
        ELSE 'updated'
      END;
      old_vals := to_jsonb(OLD);
      new_vals := to_jsonb(NEW);
    END IF;
    
    INSERT INTO public.activity_logs (
      organization_id,
      entity_type,
      entity_id,
      candidate_id,
      user_id,
      user_name,
      action_type,
      old_values,
      new_values,
      action_details,
      created_at
    ) VALUES (
      org_id,
      CASE TG_TABLE_NAME
        WHEN 'tracked_candidates' THEN 'tracked_candidate'
        ELSE TG_TABLE_NAME
      END,
      NEW.id,
      candidate_id_val,
      user_id_val,
      user_name_val,
      action_type_val,
      old_vals,
      new_vals,
      jsonb_build_object('table', TG_TABLE_NAME, 'operation', TG_OP),
      now()
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trg_log_application_activity ON public.applications;
CREATE TRIGGER trg_log_application_activity
  AFTER INSERT OR UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_activity_log();

DROP TRIGGER IF EXISTS trg_log_interview_activity ON public.interviews;
CREATE TRIGGER trg_log_interview_activity
  AFTER INSERT OR UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.create_activity_log();

DROP TRIGGER IF EXISTS trg_log_note_activity ON public.notes;
CREATE TRIGGER trg_log_note_activity
  AFTER INSERT ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_activity_log();

DROP TRIGGER IF EXISTS trg_log_candidate_activity ON public.candidates;
CREATE TRIGGER trg_log_candidate_activity
  AFTER UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.create_activity_log();

DROP TRIGGER IF EXISTS trg_log_tracked_candidate_activity ON public.tracked_candidates;
CREATE TRIGGER trg_log_tracked_candidate_activity
  AFTER INSERT OR UPDATE ON public.tracked_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.create_activity_log();

COMMENT ON FUNCTION public.create_activity_log() IS 'Automatically creates activity log entries for changes to applications, interviews, notes, candidates, and tracked_candidates';
