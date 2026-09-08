
-- Allow admins/superadmins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role)
);

-- Allow superadmins to update any profile
CREATE POLICY "Superadmins can update all profiles"
ON public.profiles
FOR UPDATE
USING (
  has_role(auth.uid(), 'superadmin'::app_role)
);
