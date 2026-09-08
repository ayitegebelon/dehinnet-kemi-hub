
-- Create quiz_attempts table to store quiz results with integrity data
CREATE TABLE public.quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  quiz_score integer NOT NULL DEFAULT 0,
  integrity_score integer NOT NULL DEFAULT 100,
  tab_switch_count integer NOT NULL DEFAULT 0,
  copy_paste_count integer NOT NULL DEFAULT 0,
  focus_lost_count integer NOT NULL DEFAULT 0,
  rapid_answer_count integer NOT NULL DEFAULT 0,
  flagged boolean NOT NULL DEFAULT false,
  warnings text[] DEFAULT '{}',
  student_name text,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can insert their own attempts
CREATE POLICY "Users can insert own quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own attempts
CREATE POLICY "Users can view own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all attempts
CREATE POLICY "Admins can view all quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));
