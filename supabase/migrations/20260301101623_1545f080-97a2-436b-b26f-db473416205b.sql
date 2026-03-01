
-- Create lab_notebook table for digital lab entries
CREATE TABLE public.lab_notebook (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  experiment_date date NOT NULL DEFAULT CURRENT_DATE,
  hypothesis text DEFAULT '',
  materials text DEFAULT '',
  procedure text DEFAULT '',
  observations text DEFAULT '',
  conclusion text DEFAULT '',
  safety_notes text DEFAULT '',
  status text NOT NULL DEFAULT 'planned',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_notebook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lab entries"
ON public.lab_notebook FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
