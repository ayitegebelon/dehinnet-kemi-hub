-- Allow superadmins to delete profiles
CREATE POLICY "Superadmins can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Allow superadmins to delete certificates
CREATE POLICY "Superadmins can delete certificates"
ON public.certificates FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));
