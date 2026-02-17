
-- Study streaks table
CREATE TABLE public.study_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  total_study_days INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.study_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.study_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.study_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard view (materialized as a regular view for simplicity)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.user_id,
  p.full_name,
  p.avatar_url,
  p.skill_level,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) as completed_lessons,
  COALESCE(AVG(up.quiz_score) FILTER (WHERE up.quiz_score IS NOT NULL), 0) as avg_quiz_score,
  COALESCE(ss.current_streak, 0) as current_streak,
  (COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) * 10 + 
   COALESCE(AVG(up.quiz_score) FILTER (WHERE up.quiz_score IS NOT NULL), 0) +
   COALESCE(ss.current_streak, 0) * 5) as total_points
FROM profiles p
LEFT JOIN user_progress up ON p.user_id = up.user_id
LEFT JOIN study_streaks ss ON p.user_id = ss.user_id
GROUP BY p.user_id, p.full_name, p.avatar_url, p.skill_level, ss.current_streak
ORDER BY total_points DESC;
