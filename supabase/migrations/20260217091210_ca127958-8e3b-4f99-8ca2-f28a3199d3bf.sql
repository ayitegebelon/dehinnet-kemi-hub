-- Add father_name column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS father_name varchar DEFAULT NULL;
