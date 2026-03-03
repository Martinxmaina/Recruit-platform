-- 1. Add display_name to org_members (for activity log "who did it")
ALTER TABLE public.org_members
ADD COLUMN IF NOT EXISTS display_name text;

COMMENT ON COLUMN public.org_members.display_name IS 'Display name shown in activity log (e.g. who moved a candidate)';

-- 2. Create or replace set_user_context to set both user id and display name for activity triggers
CREATE OR REPLACE FUNCTION public.set_user_context(p_user_id text, p_user_name text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  PERFORM set_config('app.current_user_id', COALESCE(NULLIF(trim(p_user_id), ''), 'system'), true);
  PERFORM set_config('app.current_user_name', COALESCE(NULLIF(trim(p_user_name), ''), 'System'), true);
END;
$$;

COMMENT ON FUNCTION public.set_user_context(text, text) IS 'Sets session variables for RLS and activity log; call before mutations';

-- 3. Add interview feedback columns
ALTER TABLE public.interviews
ADD COLUMN IF NOT EXISTS rating numeric(3,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
ADD COLUMN IF NOT EXISTS feedback_notes text,
ADD COLUMN IF NOT EXISTS meeting_transcript text;

COMMENT ON COLUMN public.interviews.rating IS 'Interview rating 0-5';
COMMENT ON COLUMN public.interviews.feedback_notes IS 'Interviewer feedback or comment';
COMMENT ON COLUMN public.interviews.meeting_transcript IS 'Placeholder for meeting transcript';
