CREATE TABLE public.safety_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text,
  danger_level text,
  structured jsonb,
  raw_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.safety_analyses TO authenticated;
GRANT ALL ON public.safety_analyses TO service_role;

ALTER TABLE public.safety_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own safety analyses"
  ON public.safety_analyses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_safety_analyses_user_created
  ON public.safety_analyses (user_id, created_at DESC);

CREATE TRIGGER update_safety_analyses_updated_at
  BEFORE UPDATE ON public.safety_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();