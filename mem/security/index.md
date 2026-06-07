---
name: Security memory
description: Persistent security context and accepted exceptions for the World Cup Tickets app
type: constraint
---
# Security Memory

## App context
Public-facing World Cup 2026 ticket marketplace on TanStack Start + Supabase. Auth uses Supabase email/password + Google. Roles stored in `public.user_roles` and checked via `public.has_role(uuid, app_role)` (SECURITY DEFINER, search_path=public). Admin dashboard mutations run through `createServerFn` with `requireSupabaseAuth`, which then re-checks admin role via `supabaseAdmin`.

## Must never happen
- Service role key reaching the browser bundle.
- Roles stored on `client_profiles` or any user-editable table.
- RLS disabled on `client_profiles`, `user_roles`, `site_settings`, `news`, `ticket_categories`.
- `client_profiles` exposing other users' rows to authenticated users (admin-only via has_role).

## Accepted exceptions for scanners
- `pg_cron` and `pg_net` are intentionally installed in the `public` schema to power the hourly FIFA fixtures sync. Do not re-flag `extension_in_public` for these two; only flag if NEW extensions appear in public.
- `has_role(uuid, app_role)` is SECURITY DEFINER and intentionally executable by `authenticated` — it is called from RLS policies, so EXECUTE cannot be revoked from authenticated. Do not flag `authenticated_security_definer_function_executable` for this specific function.
- `/api/public/hooks/sync-fifa` is a public cron endpoint with no signature check; it only triggers an idempotent upsert of public fixture data from football-data.org. Acceptable for now.