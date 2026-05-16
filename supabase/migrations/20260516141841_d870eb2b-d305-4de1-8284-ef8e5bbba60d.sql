
-- Add restrictive policies requiring authentication on sensitive tables
CREATE POLICY "Deny anonymous access" ON public.profiles
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access" ON public.achievements
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access" ON public.safety_incidents
  AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
