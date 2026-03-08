
-- Create storage bucket for admin signatures
INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', true);

-- Allow admins to upload signatures
CREATE POLICY "Admins can upload signatures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'signatures' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
);

-- Allow admins to update signatures
CREATE POLICY "Admins can update signatures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'signatures' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
);

-- Allow admins to delete signatures
CREATE POLICY "Admins can delete signatures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'signatures' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
);

-- Anyone can view signatures (needed for certificate download)
CREATE POLICY "Anyone can view signatures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'signatures');
