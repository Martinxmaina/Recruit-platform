-- Fix applications_stage_check: allow stage to match pipeline_stages.name (e.g. "New", "Screening").
-- Run this in Supabase SQL Editor if you get: new row for relation "applications" violates check constraint "applications_stage_check"

-- Drop the existing restrictive check (exact name may vary; uncomment the one that exists)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_stage_check;

-- Optional: allow only non-empty stage (recommended)
ALTER TABLE public.applications ADD CONSTRAINT applications_stage_check
  CHECK (stage IS NOT NULL AND trim(stage) <> '');
