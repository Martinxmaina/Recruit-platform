-- Add interviewer fields to interviews table
ALTER TABLE public.interviews 
ADD COLUMN IF NOT EXISTS interviewer_user_id text,
ADD COLUMN IF NOT EXISTS interviewer_name text;

COMMENT ON COLUMN public.interviews.interviewer_user_id IS 'Clerk user ID of the interviewer';
COMMENT ON COLUMN public.interviews.interviewer_name IS 'Display name of the interviewer';
