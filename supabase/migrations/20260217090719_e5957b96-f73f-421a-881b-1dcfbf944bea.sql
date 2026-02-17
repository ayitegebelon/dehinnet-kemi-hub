-- Allow anyone to verify certificates by certificate_number (public read for verification)
CREATE POLICY "Anyone can verify certificates by number"
ON public.certificates
FOR SELECT
USING (true);

-- Drop the restrictive user-only SELECT policy since we now have a public one
-- Actually keep both - the restrictive one uses RESTRICTIVE mode, so we need permissive
-- Let's drop the old restrictive one and recreate as permissive
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;

CREATE POLICY "Users can view own certificates"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id);
