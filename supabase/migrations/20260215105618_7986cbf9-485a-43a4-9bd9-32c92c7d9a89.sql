
-- Flashcards table
CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  front_en text NOT NULL,
  front_am text NOT NULL,
  back_en text NOT NULL,
  back_am text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  difficulty text NOT NULL DEFAULT 'beginner',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flashcards" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Admins can manage flashcards" ON public.flashcards FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- User flashcard progress
CREATE TABLE public.user_flashcard_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  flashcard_id uuid REFERENCES public.flashcards(id) ON DELETE CASCADE NOT NULL,
  confidence_level integer DEFAULT 0 CHECK (confidence_level >= 0 AND confidence_level <= 5),
  last_reviewed_at timestamptz DEFAULT now(),
  next_review_at timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  UNIQUE(user_id, flashcard_id)
);

ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flashcard progress" ON public.user_flashcard_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcard progress" ON public.user_flashcard_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcard progress" ON public.user_flashcard_progress FOR UPDATE USING (auth.uid() = user_id);

-- Discussion posts
CREATE TABLE public.discussion_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0
);

ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view posts" ON public.discussion_posts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create posts" ON public.discussion_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.discussion_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.discussion_posts FOR DELETE USING (auth.uid() = user_id);

-- Discussion replies
CREATE TABLE public.discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.discussion_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view replies" ON public.discussion_replies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create replies" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.discussion_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.discussion_replies FOR DELETE USING (auth.uid() = user_id);

-- Trigger for discussion_posts updated_at
CREATE TRIGGER update_discussion_posts_updated_at
  BEFORE UPDATE ON public.discussion_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
