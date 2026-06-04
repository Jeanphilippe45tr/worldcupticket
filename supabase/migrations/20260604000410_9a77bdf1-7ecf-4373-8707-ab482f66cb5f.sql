GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

CREATE TABLE IF NOT EXISTS public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  address text,
  city text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients can create own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients can update own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Admins can manage client profiles" ON public.client_profiles;

CREATE POLICY "Clients can view own profile"
ON public.client_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Clients can create own profile"
ON public.client_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update own profile"
ON public.client_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage client profiles"
ON public.client_profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON public.client_profiles;
CREATE TRIGGER update_client_profiles_updated_at
BEFORE UPDATE ON public.client_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();