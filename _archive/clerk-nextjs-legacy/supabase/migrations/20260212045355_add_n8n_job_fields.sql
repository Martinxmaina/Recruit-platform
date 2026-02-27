-- Source / external tracking
alter table public.jobs add column if not exists external_id bigint;
alter table public.jobs add column if not exists source text;
alter table public.jobs add column if not exists source_type text;
alter table public.jobs add column if not exists source_domain text;
alter table public.jobs add column if not exists url text;
alter table public.jobs add column if not exists external_apply_url text;
alter table public.jobs add column if not exists linkedin_id bigint;

-- Dates
alter table public.jobs add column if not exists date_posted timestamptz;
alter table public.jobs add column if not exists date_validthrough timestamptz;

-- Location enrichment
alter table public.jobs add column if not exists locations_raw jsonb;
alter table public.jobs add column if not exists locations_derived jsonb;
alter table public.jobs add column if not exists cities_derived jsonb;
alter table public.jobs add column if not exists regions_derived jsonb;
alter table public.jobs add column if not exists countries_derived jsonb;
alter table public.jobs add column if not exists remote_derived boolean;
alter table public.jobs add column if not exists lats_derived jsonb;
alter table public.jobs add column if not exists lngs_derived jsonb;

-- Employment
alter table public.jobs add column if not exists employment_type jsonb;
alter table public.jobs add column if not exists seniority text;

-- Salary
alter table public.jobs add column if not exists salary_raw jsonb;
alter table public.jobs add column if not exists ai_salary_currency text;
alter table public.jobs add column if not exists ai_salary_value numeric;
alter table public.jobs add column if not exists ai_salary_minvalue numeric;
alter table public.jobs add column if not exists ai_salary_maxvalue numeric;
alter table public.jobs add column if not exists ai_salary_unittext text;

-- AI enrichment (new fields)
alter table public.jobs add column if not exists ai_benefits jsonb;
alter table public.jobs add column if not exists ai_experience_level text;
alter table public.jobs add column if not exists ai_work_arrangement text;
alter table public.jobs add column if not exists ai_work_arrangement_office_days integer;
alter table public.jobs add column if not exists ai_remote_location text;
alter table public.jobs add column if not exists ai_remote_location_derived text;
alter table public.jobs add column if not exists ai_key_skills jsonb;
alter table public.jobs add column if not exists ai_core_responsibilities text;
alter table public.jobs add column if not exists ai_hiring_manager_name text;
alter table public.jobs add column if not exists ai_hiring_manager_email_address text;
alter table public.jobs add column if not exists description_text text;

-- Organization enrichment (from LinkedIn)
alter table public.jobs add column if not exists organization_name text;
alter table public.jobs add column if not exists organization_url text;
alter table public.jobs add column if not exists organization_logo text;
alter table public.jobs add column if not exists linkedin_org_employees integer;
alter table public.jobs add column if not exists linkedin_org_url text;
alter table public.jobs add column if not exists linkedin_org_size text;
alter table public.jobs add column if not exists linkedin_org_slogan text;
alter table public.jobs add column if not exists linkedin_org_industry text;
alter table public.jobs add column if not exists linkedin_org_description text;
alter table public.jobs add column if not exists linkedin_org_headquarters text;
alter table public.jobs add column if not exists linkedin_org_type text;
alter table public.jobs add column if not exists linkedin_org_foundeddate text;
alter table public.jobs add column if not exists linkedin_org_specialties jsonb;
alter table public.jobs add column if not exists linkedin_org_locations jsonb;

-- Recruiter
alter table public.jobs add column if not exists recruiter_name text;
alter table public.jobs add column if not exists recruiter_title text;
alter table public.jobs add column if not exists recruiter_url text;

-- Unique constraint for n8n upsert
create unique index if not exists idx_jobs_org_source_external
  on public.jobs (organization_id, source, external_id)
  where external_id is not null and source is not null;
