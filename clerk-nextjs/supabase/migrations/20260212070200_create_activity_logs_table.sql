-- Create activity_logs table for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('candidate', 'application', 'job', 'interview', 'note', 'tracked_candidate')),
  entity_id uuid NOT NULL,
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE SET NULL, -- Always link to candidate for filtering
  user_id text NOT NULL, -- Clerk user ID
  user_name text NOT NULL,
  action_type text NOT NULL, -- 'created', 'updated', 'stage_changed', 'interview_scheduled', 'note_added', etc.
  action_details jsonb DEFAULT '{}', -- Flexible storage for action-specific data
  old_values jsonb, -- For updates, store previous values
  new_values jsonb, -- For updates, store new values
  duration_minutes integer, -- Time spent on this action
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}' -- Additional context
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_candidate_id ON public.activity_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization_id ON public.activity_logs(organization_id);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see activity logs for their organization
CREATE POLICY "Org members can view activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

-- RLS Policy: Users can insert activity logs in their organization
CREATE POLICY "Org members can insert activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

COMMENT ON TABLE public.activity_logs IS 'Comprehensive activity tracking for all candidate and job-related actions';
COMMENT ON COLUMN public.activity_logs.candidate_id IS 'Always link to candidate for easy filtering of all candidate-related activities';
COMMENT ON COLUMN public.activity_logs.duration_minutes IS 'Time spent on this action in minutes';
