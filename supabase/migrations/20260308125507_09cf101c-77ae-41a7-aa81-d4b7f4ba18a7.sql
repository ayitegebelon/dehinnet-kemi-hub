
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can verify certificates by number" ON public.certificates;

CREATE POLICY "Anyone can verify certificates by number"
ON public.certificates
FOR SELECT
TO anon, authenticated
USING (true);
