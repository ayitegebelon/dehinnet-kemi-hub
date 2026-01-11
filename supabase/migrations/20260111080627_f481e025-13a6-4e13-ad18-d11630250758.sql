-- Add UPDATE and DELETE policies for safety_certifications table
CREATE POLICY "Users can update their own certifications" 
ON public.safety_certifications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certifications" 
ON public.safety_certifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add UPDATE and DELETE policies for achievements table
CREATE POLICY "Users can update their own achievements" 
ON public.achievements 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements" 
ON public.achievements 
FOR DELETE 
USING (auth.uid() = user_id);