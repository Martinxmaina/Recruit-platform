-- Invitations table for invite-by-email flow
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member',
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_org_email ON public.invitations(organization_id, email) WHERE used_at IS NULL;

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can insert invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Org members can select invitations for their org"
  ON public.invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.org_members
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

COMMENT ON TABLE public.invitations IS 'Pending email invitations; token used in sign-up URL';
