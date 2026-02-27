-- Remove CHECK constraint on work_type to allow free text
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_work_type_check;
