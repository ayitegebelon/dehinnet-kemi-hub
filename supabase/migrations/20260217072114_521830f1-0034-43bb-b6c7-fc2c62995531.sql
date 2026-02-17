
-- Fix: Change leaderboard view to SECURITY INVOKER (default for views, but let's be explicit)
ALTER VIEW public.leaderboard SET (security_invoker = on);
