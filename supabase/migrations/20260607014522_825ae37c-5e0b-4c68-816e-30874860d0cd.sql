-- 1. Allow users to delete their own client profile
CREATE POLICY "Clients can delete own profile"
ON public.client_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Harden has_role: SECURITY DEFINER with fixed search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;