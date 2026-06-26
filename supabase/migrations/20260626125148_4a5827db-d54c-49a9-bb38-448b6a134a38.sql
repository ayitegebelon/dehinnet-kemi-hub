
CREATE TABLE public.chemical_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chemical_name TEXT NOT NULL,
  analysis_result TEXT,
  risk_level TEXT,
  safety_notes TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chemical_memory TO authenticated;
GRANT ALL ON public.chemical_memory TO service_role;

ALTER TABLE public.chemical_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own memory" ON public.chemical_memory
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own memory" ON public.chemical_memory
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own memory" ON public.chemical_memory
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own memory" ON public.chemical_memory
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_chemical_memory_updated_at
  BEFORE UPDATE ON public.chemical_memory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_chemical_memory_user_chem ON public.chemical_memory(user_id, chemical_name);
CREATE INDEX idx_chemical_memory_created ON public.chemical_memory(created_at DESC);
