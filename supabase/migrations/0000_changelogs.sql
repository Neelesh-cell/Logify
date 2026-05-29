CREATE TABLE public.changelogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  repo_full_name text NOT NULL,
  changelog_content jsonb,
  slug text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Note: RLS is managed at the API level via NextAuth sessions as requested.
