-- Set both app.current_user_id and app.current_user_name for activity trigger and RLS.
CREATE OR REPLACE FUNCTION public.set_user_context(p_user_id text, p_user_name text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  PERFORM set_config('app.current_user_id', COALESCE(p_user_id, ''), true);
  PERFORM set_config('app.current_user_name', COALESCE(p_user_name, ''), true);
END;
$$;

COMMENT ON FUNCTION public.set_user_context(text, text) IS 'Sets session variables for current user id and name (used by activity log trigger and RLS)';
